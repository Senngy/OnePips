# P0-2 — Helmet + Headers Sécurité (Plan d'implémentation détaillé)

> Date : 30/07/2026 · Version : v10 (17/08 — **vérification réelle du code** : commits C1-C3 (backend) confirmés implémentés, C4-C13 (tests headers + tout le frontend Next.js) confirmés non commencés) · Statut : 🟡 Backend partiel implémenté / Frontend non démarré
> Source : `.tracking/RBAC-v3-audit.md` §5.1, P0 #2
> Périmètre : Backend NestJS **+** Frontend Next.js (les deux doivent être durcis)
> Règle : **document de plan — les cases cochées ci-dessous reflètent l'état réel du code vérifié le 17/08/2026, pas une intention.**

---

## 1. OBJECTIF & PÉRIMÈTRE

Protéger les réponses HTTP du backend **et** les pages du frontend avec l'ensemble des headers de sécurité. Helmet n'est pas un simple `npm install` : c'est une suite de politiques, chacune contre une classe d'attaque.

> Le durcissement se fait en **3 phases** (voir §3.4 « Stratégie de rollout ») pour ne jamais casser l'app en prod : **Report-Only → Enforce → Harden**.

### 1.1 Attaques couvertes

| Header / Politique | Contre quoi | Risque si absent |
|--------------------|-------------|------------------|
| `Content-Security-Policy` (CSP) | XSS, injection script/image/frame | Injection JS possible, exfiltration |
| `X-Frame-Options` + CSP `frame-ancestors` | Clickjacking | Le site embarqué dans un iframe hostile |
| `Strict-Transport-Security` (HSTS) | Downgrade HTTP, SSL strip | Requête en clair possible |
| `Referrer-Policy` | Fuite d'URL (token, données) via le header Referer | Données sensibles dans l'URL d'un tiers |
| `Permissions-Policy` | Accès non sollicité caméra/géoloc/micro | Espionnage par un script |
| `X-Content-Type-Options: nosniff` | MIME sniffing | Exécution de HTML servi en image |
| `X-DNS-Prefetch-Control` | Fuite DNS | Détection de présence par le réseau |
| `Cross-Origin-Opener-Policy` | Hijacking de fenêtre / isolation | Vol de la fenêtre ouverte (OAuth) |
| `Cross-Origin-Resource-Policy` | Lecture cross-site des ressources | Hotlinking / lecture des uploads par un tiers |
| `X-XSS-Protection` (legacy) | — | obsolète, Helmet ne l'ajoute plus |

---

## 2. ÉTAT ACTUEL VÉRIFIÉ

### Backend (`onepips-backend`)
- `main.ts` : `ValidationPipe(whitelist, transform, forbidNonWhitelisted)`, CORS mono-origin `credentials:true`, `bodyParser:false` (requis Better Auth), statics `/uploads`, **aucun header sécurité**.
- `package.json` : **Helmet non installé**, pas de compression.
- Le serveur sert : l'API JSON (`/api/*`), les fichiers uploadés (`/uploads/*`), le proxy Better Auth (`/api/auth/*`).
- Les fichiers uploadés sont servis **par l'API** → ils héritent des headers de l'API. La whitelist MIME autorise uniquement `jpg/png/webp/gif` (pas de SVG → pas de risque d'XSS via SVG script).
- ✅ **Version Helmet vérifiée (v8.3.0, npm `latest`, 30/07/2026)** : les options suivantes ont été confirmées dans la doc officielle :
  - `expectCt` : **retiré en v8** (Expect-CT est déprécié par les navigateurs) → **ne plus l'utiliser**.
  - `dnsPrefetchControl` **renommé → `xDnsPrefetchControl`** (avec préfixe `x`).
  - `crossOriginEmbedderPolicy` : **existe toujours** en v8 (défaut `false`) — reste **désactivé** ici (COEP).
  - `originAgentCluster` : **existe toujours** en v8.
  - `permittedCrossDomainPolicies` **renommé → `xPermittedCrossDomainPolicies`** (avec préfixe `x`).
  - Middlewares v8 disponibles : `contentSecurityPolicy`, `crossOriginEmbedderPolicy`, `crossOriginOpenerPolicy`, `crossOriginResourcePolicy`, `originAgentCluster`, `referrerPolicy`, `strictTransportSecurity`, `xContentTypeOptions`, `xDnsPrefetchControl`, `xDownloadOptions`, `xFrameOptions`, `xPermittedCrossDomainPolicies`, `xPoweredBy`, `xXssProtection`.
  - La config de référence (§3, SOUS-ÉTAPE 1) intègre déjà ces noms v8.

### Frontend (`onepips-frontend` — Next.js 16.2.1, React 19.2.4)
- Ressources externes détectées (à allowlister en CSP) :

| Ressource | Type CSP | Usage détecté |
|-----------|----------|---------------|
| `fonts.googleapis.com` / `fonts.gstatic.com` | `style-src` / `font-src` | `next/font/google` (Inter, Space_Grotesk) + icônes material-symbols (à confirmer) |
| `www.youtube.com` | `frame-src` | iframes de cours sur `/methode` (3 vidéos) |
| `lh3.googleusercontent.com` | `img-src` | images d'avatars/scènes (multiples pages) |
| `challenges.cloudflare.com` | `script-src` / `frame-src` / **`connect-src`** | widget Turnstile (formulaires publics uniquement — **pas sur `/admin/*`**, vérifié) |
| Backend API (`http://localhost:3001/api` en dev) | `connect-src` + `img-src` | `api-client.ts`, `auth-client.ts`, images uploadées |
| `nextjs.org` / `vercel.live` (dev overlay) | `connect-src` | seulement en dev |
| fichiers locaux (`/logo-onepips.png`, `/profile-pic.jpg`) | `img-src 'self'` | même-origin |

> **Vérifications faites** : aucun embed Cal.com côté frontend (intégration serveur via API), le login admin n'utilise **pas** Turnstile → le bloc CSP `/admin/*` peut être strict.

> ⚠️ **Important Next.js 16 — vérifié dans `node_modules/next/dist/docs/` (30/07/2026)** :
> - Les headers se posent via `headers()` dans `next.config.ts` (statique, évalué à la requête en self-hosted → possible de brancher `process.env.NODE_ENV`).
> - **`middleware` est renommé `proxy` en Next 16** (déprécié, file convention `proxy.ts`, fonction exportée `proxy`, config `matcher`). **Ne pas créer `middleware.ts`.**
> - **CSP sans nonce** : poser la CSP via `headers()` avec `'unsafe-inline'` dans `script-src` (doc officielle « Without Nonces ») → pages **statiques conservées** (perf, CDN).
> - **CSP avec nonce** : **obligatoirement via `proxy.ts`** + **render dynamique forcé** (`connection()` sur toutes les pages) → **désactive** statique, ISR, PPR, cache CDN. Lourd pour OnePips (pages publiques statiques). Non recommandé au lancement.
> - **SRI (hashs)** : expérimental, App Router uniquement, `experimental: { sri: { algorithm: 'sha256' } }` — alternative aux nonces qui garde le statique. À réévaluer en Phase C.

---

## 3. SOUS-ÉTAPES DÉTAILLÉES

## SOUS-ÉTAPE 0 — Préparation & inventaire (échelonnée — tout n'est **pas** requis avant de coder)

> ⚠️ **Correction v9** : cette étape ne bloque **pas** le commit C1. Helmet + CSP se développent et se testent **100% en local** (`http://localhost:3000` / `http://localhost:3001`), sans domaine ni HTTPS ni staging. Le tableau ci-dessous précise **quand** chaque action devient nécessaire (voir aussi §13.0 pour le détail par commit).

| # | Action | Détail | Quand ? |
|---|--------|--------|---------|
| 0.1 | Utiliser des **placeholders** pour les origines | Local : `FRONT_URL=http://localhost:3000`, `API_URL=http://localhost:3001` — le code lit `process.env.FRONT_URL`/`API_URL`, **jamais** de domaine écrit en dur | ✅ **Maintenant** |
| 0.2 | Décider D9 (Helmet seul vs + compression) | Helmet seul recommandé au lancement | ✅ **Maintenant, avant C1** |
| 0.3 | Décider du mode dev | CSP **désactivée** en dev (HMR/react-refresh casse sinon) | ✅ **Maintenant, avant C3** |
| 0.4 | Lister les domaines externes **réellement utilisés dans le code** (table §2) | Base de l'allowlist CSP **initiale** — pas besoin d'être finale/parfaite (Report-Only corrige par itération) | ✅ **Maintenant, avant C6/C7** |
| 0.5 | Choisir un outil de vérification | `curl -I` / DevTools **maintenant** ; `securityheaders.com` seulement utile une fois en ligne | ✅ Maintenant (curl/DevTools) — plus tard (securityheaders.com) |
| 0.6 | Domaine + HTTPS de **staging** (D1/D2 partiels, D10) | `staging.<domaine choisi>` + certificat | ❌ **Pas maintenant** — avant le déploiement staging |
| 0.7 | Destination des rapports CSP (D7) | **Console** suffit en local/dev | ✅ Console maintenant — ❌ `Reporting-Endpoints`/`report-to` réel seulement avant staging |
| 0.8 | Domaine + HTTPS de **production** définitifs (D1/D2 finaux) | `app.<domaine>` / `api.<domaine>` (ou mono-domaine) | ❌ **Pas maintenant** — avant le déploiement production |

---

## SOUS-ÉTAPE 1 — Backend : installer Helmet

### Installation — **l'ordre compte** (voir §2 pour la version cible)
```bash
npm install helmet
# 1) installer ...
npm ls helmet      # 2) ... PUIS vérifier la version effectivement installée
# 3) ouvrir la doc de CETTE version (https://helmetjs.github.io/) ...
# 4) ... et SEULEMENT ENSUITE écrire helmet.config.ts
#    (ne pas écrire la config avant d'avoir confirmé les options de la version installée)
# (helmet v8 inclut ses propres types TS — pas de @types/helmet nécessaire)
```

> **Helmet seul ou Helmet + Compression ? (D9)** — souvent installés ensemble, `helmet` (sécurité) et `compression` (gzip/Brotli, perf) sont **indépendants**. Au lancement : **Helmet seul** recommandé — le reverse-proxy Caddy/Nginx peut déjà compresser. Si `compression` est ajouté côté Nest, éviter de compresser les réponses sensibles (cookies/tokens — vecteur BREACH). La décision est tranchée en D9 avant l'implémentation.

### Type de fichier à créer — `src/common/helmet.config.ts`
Un **factory** qui construit la config selon l'environnement (dev / staging / prod) :

```
src/common/helmet.config.ts          ← fichier de config Helmet (export d'une fonction)
```

### Implémentation référence (à adapter, PAS appliquée)

```ts
// src/common/helmet.config.ts
import type { HelmetOptions } from 'helmet';

export function helmetOptions(env: string): HelmetOptions {
  const isProd = env === 'production';

  // HSTS progressif : montée graduelle du max-age (voir §4), preload jamais au lancement
  const HSTS_MAX_AGE = {
    'phase-a': 86400,     // 1 jour   — Phase A : détection rapide d'un problème
    'phase-b': 2592000,   // 30 jours — Phase B : stabilisation
    'phase-c': 31536000,  // 1 an     — Phase C : régime permanent
  }[process.env.HSTS_PHASE || 'phase-a'] ?? 86400;

  return {
    // ⚠️ CSP : OFF sur l'API (réponses JSON + uploads + proxy auth, PAS de HTML → CSP inutile).
    // La CSP vit UNIQUEMENT côté Next.js (documents HTML). Voir SOUS-ÉTAPE 2.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    //   YouTube + Google Fonts + Turnstile sont INCOMPATIBLES avec COEP → NE PAS réactiver
    //   (pas de CORP header côté Google/Cloudflare). Helmet v8 l'a d'ailleurs retiré.
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' }, // uploads : lecture même-origin uniquement (anti-hotlink)
    //   ⚠️ si le front et l'API sont sur des ORIGINES différentes (app.… / api.…),
    //   same-origin bloquera l'affichage des uploads par le front → passer same-site (D4)
    xDnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' }, // clickjacking (API ne doit jamais être iframée)
    hidePoweredBy: true, // masque X-Powered-By: Express
    hsts: isProd ? { maxAge: HSTS_MAX_AGE, includeSubDomains: true, preload: false } : false,
    //   ⚠️ preload:false — le preload HSTS est quasi irréversible (exige HTTPS partout,
    //   sous-domaines, redirections parfaites, certificat valide partout). À n'envisager
    //   qu'après la Phase C (D6), jamais au lancement.
    ieNoOpen: true,
    noSniff: true, // X-Content-Type-Options
    referrerPolicy: { policy: 'no-referrer' },
    //   ✅ v8.3.0 : crossOriginEmbedderPolicy / originAgentCluster existent toujours
    //   (désactivés ici), expectCt est retiré, xPermittedCrossDomainPolicies existe (préfixe x).
  };
}
```

> **CSP désactivée sur le backend** : l'API renvoie du JSON, des uploads et du proxy auth — aucun document HTML. Configurer une CSP ici n'apporterait rien ; elle n'existe que parce que **Helmet l'ajoute par défaut** (il faut donc la désactiver explicitement). **Les vrais gains backend sont** : `nosniff`, `frameguard`, HSTS, `Referrer-Policy`, COOP et CORP. La CSP est posée **uniquement** côté Next.js (SOUS-ÉTAPE 2). Ne pas recopier une CSP sur l'API « pour faire propre ».

### Implémentation dans `src/main.ts` (modification)

```ts
import helmet from 'helmet';
import { helmetOptions } from './common/helmet.config.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });

  // 1er middleware : avant CORS, routes, statics, guards
  app.use(helmet(helmetOptions(process.env.NODE_ENV || 'development')));

  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.enableCors({ origin: process.env.FRONT_URL, credentials: true });
  await app.listen(process.env.PORT || 3001);
}
```

### Points d'ordre (bon à savoir)
- `app.use(helmet(...))` **avant** le CORS n'a pas d'importance pour les headers, mais le poser en premier = plus lisible et s'applique à tout.
- **Ne pas confondre** avec `forRoutes()` de Nest : Helmet est un middleware Express, pas un guard.
- `bodyParser:false` n'affecte pas Helmet (il ne lit pas le body).
- L'en-tête `X-Powered-By: Express` est supprimé par `hidePoweredBy` (moins d'info pour un attaquant).

### Impacts backend
- **API JSON** : headers utiles = `noSniff`, `frameguard: deny`, `referrerPolicy: no-referrer`, `hsts` (prod). **CSP désactivée** (pas de HTML — la CSP est sur Next uniquement).
- **Uploads servis** (`GET /uploads/:filename`) : héritent de `noSniff` + `X-Content-Type-Options` → un `.html` uploadé ne sera plus exécuté par le navigateur. Pas de SVG possible (whitelist MIME) → pas d'XSS via SVG.
- **Better Auth** : le proxy `@All('*')` passe après Helmet → reçoit les headers (aucun conflit attendu, à retester).
- **CORS** : Helmet ne touche pas `Access-Control-*`. Aucun conflit.
- **Risque dev** : `hsts` ignoré en HTTP ; `crossOriginOpenerPolicy: same-origin` peut casser l'ouverture de fenêtres (OAuth popup) — à surveiller si OAuth est ajouté.

---

## SOUS-ÉTAPE 2 — Frontend : headers Next.js (config)

### Type de fichier à modifier — `onepips-frontend/next.config.ts`

> ✅ **Doc Next 16 vérifiée** (`node_modules/next/dist/docs/` 30/07/2026) : headers via la propriété `headers()` de `next.config.ts` (voir plus haut « Important Next.js 16 »). En self-hosted, `headers()` est évalué à la requête → possible de brancher sur `process.env.NODE_ENV` pour la dev/prod. **CSP avec nonce = `proxy.ts` obligatoire + render dynamique → éviter au lancement (perf).**

```ts
// Piste (mécanisme validé — voir §2 « Important Next.js 16 »)
// HSTS progressif (voir §4) : même stratégie que le backend
const HSTS_MAX_AGE = process.env.HSTS_PHASE === 'phase-c' ? 31536000
  : process.env.HSTS_PHASE === 'phase-b' ? 2592000
  : 86400;

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },      // pages Next : autoriser le même site
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // conserve l'origine (analytics) sans fuir les chemins
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // HSTS : SEULEMENT en prod, avec montée progressive du max-age
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: `max-age=${HSTS_MAX_AGE}; includeSubDomains` }]
    : []),
];
// + headers CSP par route (page HTML) avec les allowlist du §2
```

### Le choix structurant : CSP par page ou global

| Option | Pour | Contre |
|--------|------|--------|
| **CSP global** (toutes les pages) | Simple, une seule config | Doit couvrir toutes les pages → allowlist large (plus permissive) |
| **CSP par route** | Précis (admin strict, pages publiques moins) | Plus de config, risque d'oublis |

**Recommandation** : 2 blocs — `/admin/*` le plus strict (pas de YouTube ni Turnstile — vérifié), le reste du site avec YouTube + Turnstile + fonts.

### Implémentation CSP (bloc public, piste)

> ⚠️ **Directives incomplètes par conception** :
> - **`connect-src`** : n'autorise que l'existant (API, Turnstile, fonts). **Cette directive sera complétée lors des P0 Stripe / Booking** (ajouter `https://api.stripe.com`, éventuellement Sentry, analytics…). Ne pas oublier.
> - **`frame-src`** : n'autorise que YouTube + Turnstile. **Sera complétée** par `https://js.stripe.com`, `https://cal.com` lors des intégrations (P0 Stripe / Booking).

> ⚠️ **`unsafe-inline` / `unsafe-eval` ne sont PAS des valeurs normales** : ce sont des exceptions **de développement uniquement**. En production, ni l'un ni l'autre dans `script-src` (voir pièges ci-dessous).

**Dev — DEV UNIQUEMENT** (react-refresh / HMR, `unsafe-inline` + `unsafe-eval` acceptés ici) :
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://challenges.cloudflare.com 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https://lh3.googleusercontent.com <API_ORIGIN>;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;
  connect-src 'self' <API_ORIGIN> https://challenges.cloudflare.com https://fonts.googleapis.com https://nextjs.org https://vercel.live;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
```

**Production** (sans unsafe-inline / unsafe-eval dans script-src) :
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https://lh3.googleusercontent.com <API_ORIGIN>;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;
  connect-src 'self' <API_ORIGIN> https://challenges.cloudflare.com https://fonts.googleapis.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
```

### Implémentation CSP (bloc `/admin/*`, piste — plus strict)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://lh3.googleusercontent.com <API_ORIGIN>;
  connect-src 'self' <API_ORIGIN>;
  frame-src 'none';                 // aucun iframe dans l'admin
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
```

> **Évolutions prévues — Stripe & Cal.com** (à anticiper pour ne pas chercher la cause plus tard)
> - **Stripe** (paiement côté client) : ajouter `https://js.stripe.com`, `https://m.stripe.network`, `https://api.stripe.com` dans `script-src` / `connect-src` / `frame-src` (selon Stripe Elements / Checkout). Sans ça, Stripe **casse silencieusement**.
> - **Cal.com** (embed) : ajouter les domaines Cal (`app.cal.com`, `cal.com`, …) dans `frame-src` / `script-src` / `connect-src` selon le mode d'intégration choisi.
> - → Prévoir ces domaines dans l'allowlist au moment de l'intégration.

> **Pièges à connaître**
> - **`'unsafe-inline'` / `'unsafe-eval'` : UNIQUEMENT en dev** (react-refresh/HMR). En production : ni l'un ni l'autre dans `script-src`. Ce ne sont pas des valeurs « normales », ce sont des exceptions de développement.
> - Si Next 16 impose des scripts inline en prod → **nonce via `proxy.ts`** (render dynamique forcé) ou **hashs SRI** (expérimental, statique conservé) — jamais `unsafe-inline` en prod. Voir §2 « Important Next.js 16 ».
> - `'unsafe-inline'` en `style-src` : acceptable (le XSS par style est de faible impact), mais remplaçable par des hashs si on veut durcir davantage.
> - `frame-ancestors` (CSP moderne) **complète** `X-Frame-Options` (legacy mais universel) → mettre les deux.
> - Le widget Turnstile charge un script **et** un iframe **et** fait des requêtes réseau → il faut `script-src`, `frame-src` **et** `connect-src` vers `challenges.cloudflare.com`.
> - **Helmet vs Next** : Helmet protège les **réponses du backend** ; Next protège les **documents HTML**. Les deux peuvent avoir une **CSP différente** — ne pas recopier la CSP de l'API sur les pages HTML (et inversement).

---

## SOUS-ÉTAPE 3 — Vérification / Tests

### 3.1 Backend — vérifier les headers
```bash
curl -sI http://localhost:3001/api/users                  # nosniff, X-Frame-Options, Referrer-Policy...
curl -sI http://localhost:3001/uploads/<file>             # noSniff présent
curl -sI http://localhost:3001/api/auth/sign-up/email     # proxy Better Auth : headers présents, fonctionnel
curl -sI -X OPTIONS http://localhost:3001/api/users       # préflight CORS : Access-Control-* toujours là
```
> Ces 4 commandes sont destinées à devenir `scripts/security-check.sh` (§12.2/§12.5), rejouable manuellement **et** en étape CI GitHub Actions sur staging avant chaque merge vers `main`.

### 3.2 Frontend — vérifier
- DevTools → Network → document principal → Headers : CSP + tous les headers présents.
- Tester chaque page : `/methode` (YouTube), formulaires publics (Turnstile), pages `/admin/*` (API + icônes).
- Vérifier la **console** : `Refused to load ...` = une source manque à l'allowlist.
- **Phase Report-Only** : les violations arrivent dans la console **et** (si configuré) au Reporting-Endpoints / `report-to` — collecter avant d'enforcer.

### 3.3 Matrice de test

| Test | Attendu |
|------|---------|
| `GET /api/users` → headers | nosniff + frameguard + referrer + hsts(prod) |
| iframe hostile sur `app.onepips.fr` | bloqué (frame-ancestors) |
| YouTube sur `/methode` | s'affiche (frame-src ok) |
| Turnstile sur formulaire public | s'affiche + fonctionne (script/frame/connect ok) |
| Image `lh3.googleusercontent.com` | s'affiche (img-src ok) |
| Upload d'un fichier `.html` puis accès | **téléchargé / non exécuté** (nosniff) |
| Login / session Better Auth | toujours fonctionnel |
| CORS préflight (OPTIONS) | `Access-Control-Allow-Origin` intact |
| Dev : HMR/react-refresh | fonctionne (CSP désactivée en dev) |
| Admin : aucun iframe | `frame-src 'none'` respecté, pages fonctionnelles |
| **Stripe Checkout** (après intégration P0) | fonctionne (script/connect/frame ok) |
| **Stripe Elements** (après intégration P0) | fonctionne (script/connect ok) |
| **Webhook Stripe** (après intégration P0) | reçu côté serveur, signature vérifiée (hors CSP — vérifier que rien ne le bloque) |
| **Cal.com** (après intégration P0) | embed affiché + réservation fonctionnelle (frame/script ok) |

### 3.4 Outil externe
- `https://securityheaders.com` (après mise en prod) : viser un score **A ou A+** (le A+ est atteignable avec HSTS + CSP correctement configurées).

### 3.5 Headers de cache (formalisation)

Sécurité et cache vont de pair : un header de cache manquant peut servir des données admin. Les formaliser évite les surprises.

| Ressource | Cache-Control | Pragma | Où |
|-----------|---------------|--------|-----|
| API backend (`/api/*`) | `no-store` | `no-cache` | Nest (middleware ou `@Header()` global) |
| Uploads (`/uploads/*`) | `public, max-age=31536000, immutable` | — | Statics Express (les noms de fichiers sont déjà hashés) |
| Pages HTML (Next) | `no-cache` | `no-cache` | `next.config.ts` (headers) |
| Assets statiques Next (`/_next/static/*`) | `public, max-age=31536000, immutable` | — | Géré par Next (défaut) |

### 3.6 Headers à vérifier après installation (backend)

Comparer les réponses avec `curl -I` sur : `GET /api/users`, `GET /uploads/<file>`, `GET /api/auth/sign-up/email`, et `OPTIONS /api/users` (préflight CORS).

| Header attendu | API (`/api/*`) | Uploads (`/uploads/*`) | Pages HTML (Next) |
|----------------|----------------|------------------------|-------------------|
| `Strict-Transport-Security` | ✅ (prod) | ✅ (prod) | ✅ (prod) |
| `Content-Security-Policy` | ❌ (volontaire — pas de HTML) | ❌ | ✅ |
| `X-Frame-Options` | `DENY` | `DENY` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` | `nosniff` | `nosniff` |
| `Referrer-Policy` | `no-referrer` | `no-referrer` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | — | — | ✅ |
| `Cross-Origin-Opener-Policy` | `same-origin` | `same-origin` | — |
| `Cross-Origin-Resource-Policy` | `same-origin` | `same-origin` | — |
| `Origin-Agent-Cluster` | ✅ (v8.3.0) | ✅ (v8.3.0) | — |
| `X-DNS-Prefetch-Control` | `off` | `off` | `off` |
| `Expect-CT` | ❌ (retiré en v8 — ne pas configurer) | ❌ | — |

---

## 4. STRATÉGIE DE ROLLOUT (important)

Pour ne **jamais** casser la prod en déployant une CSP trop stricte :

| Phase | Backend (Helmet) | Frontend (Next) | Durée | Critère de sortie |
|-------|------------------|-----------------|-------|-------------------|
| **A — Report-Only** | HSTS `max-age=86400` (1 jour) — pas de CSP | CSP **Report-Only** + collecte Reporting-Endpoints/`report-to` | 3-7 jours | Plus de violation critique dans les rapports front |
| **B — Enforce** | HSTS `max-age=2592000` (30 jours) | CSP **Enforce** (bloque désormais) | 1-2 semaines | Aucune régression signalée (support, tests) |
| **C — Harden** | HSTS `max-age=31536000` (1 an) | Retirer `'unsafe-inline'`/`'unsafe-eval'` de `script-src` (nonce/hashs), resserrer `img-src` | Continue | Score securityheaders ≥ A+, aucune violation |

> **Rappel** : la CSP ne se déploie **que** côté frontend (le backend n'en a pas, §SOUS-ÉTAPE 1). Le backend ne joue ici que le HSTS progressif.
>
> **HSTS progressif** : la montée graduelle du `max-age` (1 jour → 30 jours → 1 an) est la pratique des organisations pour ne jamais se retrouver bloqué par un header cacheté. Le `preload` ne s'envisage **qu'après** la Phase C (D6), jamais avant.
>
> **Pendant la phase A, surveiller les rapports** : chaque `Refused to load` = une ressource réelle utilisée à ajouter à l'allowlist. C'est le moment de finaliser §2.

---

## 5. IMPACTS SUR LES APPLICATIONS

| Zone | Impact | Gestion |
|------|--------|---------|
| **API Nest** | Headers ajoutés sur toutes les réponses | Aucun code métier à changer |
| **Better Auth proxy** | Passe après Helmet | Retester signup/login/logout |
| **Uploads** | `nosniff` → un HTML uploadé n'est plus rendu | Comportement voulu (sécurité) |
| **Frontend Next 16** | CSP doit autoriser YouTube, fonts, Turnstile, lh3, API | Allowlist §2 |
| **Analytics** | `Referrer-Policy: strict-origin-when-cross-origin` conserve l'origine (données analytics OK) mais masque l'URL complète | Vérifier que GA/matomo ne dépend pas de `referrer` complet |
| **Dev** | CSP/HSTS relâchés en dev | Branche `NODE_ENV` |
| **Admin** | CSP stricte sur `/admin/*` (pas d'iframe, pas de Turnstile) | Bloc séparé §3.2 |
| **OAuth/popups** | COOP `same-origin` peut affecter les popups OAuth | Tester le flux (si OAuth ajouté) |
| **Performance** | Négligeable (headers, pas de body processing) | — |
| **Déploiement** | Domaine(s) prod à connaître AVANT de figer la CSP | Étape 0.1/0.2 |

---

## 6. BON À SAVOIR (pièges classiques)

1. **HSTS en dev** : header ignoré en HTTP ; mais si tu passes par HTTPS en local (tunnel), ne pas mettre `preload` à la légère (engagement ~2 ans **non révocable**). En cas de souci HSTS en prod, réduire `max-age` pour désengager progressivement les navigateurs.
2. **CSP et Next.js** : Next injecte ses propres inline scripts → sans `'unsafe-inline'` (ou nonce/hashs), le site se casse. ✅ **Doc Next 16 vérifiée** : sans nonce → `'unsafe-inline'` dans `script-src` (doc « Without Nonces ») ; avec nonce → `proxy.ts` + render dynamique forcé (perf). Voir §2 « Important Next.js 16 ».
3. **COEP `require-corp` : à ne JAMAIS réactiver** — YouTube + Google Fonts + Turnstile sont incompatibles (pas de CORP header côté Google/Cloudflare). Commentaire laissé dans la config pour le « toi du futur ». ✅ **v8.3.0** : l'option `crossOriginEmbedderPolicy` existe toujours (défaut `false`) → la désactiver explicitement reste valide.
4. **`X-Frame-Options` vs `frame-ancestors`** : `X-Frame-Options` est obsolète face à CSP `frame-ancestors`, mais encore supporté partout → mettre les deux (Helmet fait frameguard + on ajoute frame-ancestors en CSP).
5. **Ordre middleware** : Helmet en premier dans `main.ts`, avant tout router.
6. **Uploads & hotlinking** : poser `Cross-Origin-Resource-Policy: same-site` (ou `same-origin`) sur les uploads pour empêcher d'autres sites de les afficher — à trancher (D4) : si résultats/avatars doivent être visibles sur des sites tiers, `cross-origin`.
7. **`securityheaders.com`** : le score dépend aussi du serveur TLS/reverse-proxy (HSTS, TLS 1.2+, preload) — pas que de l'app.
8. **Cache-Control** : couplé aux headers — `Cache-Control: no-store` sur `/api/*` (données admin), cache autorisé sur les GET publics (`events`, `community`) + uploads (immutable avec hash).
9. **CSP `report-uri` est DÉPRÉCIÉ** (MDN : « Avoid using it »). Préférer **`report-to`** + en-tête **`Reporting-Endpoints`** — utilisés côté **Next** (la CSP ne vit que là, le backend n'en a pas). `report-uri` est ignoré par les navigateurs qui supportent `report-to` → ne l'utiliser que si la stack de collecte ne le supporte pas encore, et dans ce cas spécifier les deux.
10. **SVG** : un `.svg` peut contenir du script — exclu par la whitelist MIME upload actuelle (jpg/png/webp/gif) → garder cette whitelist.
11. **Mass assignment** : déjà couvert (`forbidNonWhitelisted`) — les headers ne protègent pas les inputs, ils complètent.

---

## 7. CHECKLIST P0-2 (Phase d'avant staging ✅ validée 27/08)

> ✅ **v9** : réordonnée pour que les tâches « Maintenant / local » soient clairement séparées des tâches « avant staging » et « avant production » (cf. §13.0).

| # | Tâche | Où | Quand | Statut |
|---|-------|-----|-------|--------|
| 1 | Décider **D9** (Helmet seul, pas de compression) | Décision | ✅ Maintenant | ✅ |
| 2 | Poser les placeholders d'environnement (`FRONT_URL`/`API_URL` en local) | Backend/Frontend | ✅ Maintenant | ✅ |
| 3 | Installer `helmet` (v8.3.0 — options v8 confirmées) | `onepips-backend` | ✅ Maintenant (C1) | ✅ |
| 4 | Créer `src/common/helmet.config.ts` | Backend | ✅ Maintenant (C2) | ✅ |
| 5 | Brancher Helmet dans `main.ts` (CSP off, HSTS off en dev) | Backend | ✅ Maintenant (C3) | ✅ |
| 6 | Retester Better Auth (signup/login/logout) + uploads + API en local | Backend | ✅ Immédiatement après C3 | ✅ **Validé** (test manuel effectué le 26/08) |
| 7 | Automatiser les tests headers (`curl`/script — §14 `security-check.sh`) | Backend | ✅ Maintenant (C4) | ✅ |
| 8 | Headers Next.js non-CSP (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) | Frontend | ✅ Maintenant (C5) | ✅ |
| 9 | Établir une **première allowlist CSP** à partir des dépendances réelles du code (pas besoin d'être finale) | Frontend | ✅ Maintenant (avant C6/C7) | ✅ |
| 10 | CSP Report-Only bloc public, rapports en **console** (localhost) | Frontend | ✅ Maintenant (C6) | ✅ |
| 11 | CSP Report-Only bloc `/admin/*` | Frontend | ✅ Maintenant (C7) | ✅ |
| 12 | Tester/corriger les violations CSP en local, en boucle | Frontend | ✅ Itératif, en local | ✅ |
| 13 | **Avant staging** : trancher D1 (domaine staging) + D2 (HTTPS/reverse-proxy staging) + D7 (reporting CSP réel) | Décision/Infra | ❌ Pas avant | ⬜ |
| 14 | Déployer sur staging, observer 3-7 jours (vraie Phase A, §4) | Staging | ❌ Après C6/C7 validés en local | ⬜ |
| 15 | **Phase B** : basculer Enforce (staging puis prod) + matrice §3.3 | Les 2 | ❌ Après validation staging | ⬜ |
| 16 | **Phase C** : durcir `script-src` (nonce/SRI), HSTS phase-c | Frontend/Backend | ❌ Après Phase B | ⬜ |
| 17 | **Avant production** : trancher D1/D2 définitifs (domaines + HTTPS prod) | Décision/Infra | ❌ Pas avant | ⬜ |
| 18 | Score `securityheaders.com` ≥ A ou A+ (prod) | Prod | ❌ Après mise en prod | ⬜ |
| 19 | Mettre à jour l'audit (section 5.1 → ✅, P0 #2 → ✅) | Audit | Fin | 🟡 Fait partiellement — `RBAC-v3-audit.md` reflète désormais P0 #2 = 🟡 **partiel** (pas ✅, car CSP/Permissions-Policy manquantes) |

#### Vérification contre le code réel — 17/08/2026

| Élément | Preuve | Verdict |
|---------|--------|---------|
| `helmet` installé | `package.json:39` → `"helmet": "^8.3.0"`, `node_modules/helmet/package.json` → version exacte **8.3.0** (celle vérifiée dans ce plan) | ✅ |
| `compression` absent (D9) | `grep '"compression"' package.json` → 0 résultat | ✅ conforme à D9 |
| `src/common/helmet.config.ts` | Fichier existe, options quasi identiques à la référence §3 (SOUS-ÉTAPE 1) : `contentSecurityPolicy:false`, `crossOriginEmbedderPolicy:false`, `crossOriginOpenerPolicy:same-origin`, `crossOriginResourcePolicy:same-origin`, `xDnsPrefetchControl:off`, `frameguard:deny`, `hidePoweredBy`, `hsts` (prod only, `maxAge:86400`), `ieNoOpen`, `noSniff`, `referrerPolicy:no-referrer` | ✅ — **mais différence notée ci-dessous** |
| HSTS progressif (`HSTS_PHASE` phase-a/b/c) | Le fichier réel a `maxAge: 86400` **codé en dur**, pas de lecture de `process.env.HSTS_PHASE` ni de map `phase-a/b/c` comme le prévoyait la référence §3 | ⚠️ Simplifié par rapport au plan — reste en "Phase A" figée, à généraliser avant la Phase B (§4) |
| Helmet branché dans `main.ts` | `app.use(helmet(helmetOptions(...)))` présent, positionné **avant** `setGlobalPrefix`, `useStaticAssets`, `ValidationPipe` et `enableCors` — ordre conforme à la recommandation §3 | ✅ |
| `FRONT_URL` / `NEXT_PUBLIC_API_URL` en placeholders | Présents dans `onepips-backend/.env` et `onepips-frontend/.env` (valeurs non affichées ici) | ✅ — fait directement en `.env` plutôt que `.env.development`, fonctionnellement équivalent en local |
| `scripts/security-check.sh` | `Test-Path` → absent, aucun fichier `security-check*` trouvé hors `node_modules` | ⬜ Non fait (C4) |
| Headers Next.js (`next.config.ts`) | Contenu actuel : uniquement `{ reactCompiler: true }` — **aucun `headers()`, aucune CSP, aucun header non-CSP** | ⬜ Non fait (C5 à C13 — tout le frontend est à zéro) |
| `crossOriginResourcePolicy` (D4) | Implémenté avec `{ policy: 'same-origin' }` dans `helmet.config.ts` | ✅ **D4 est en réalité déjà tranché et implémenté** (voir mise à jour §8 ci-dessous) — le plan le listait encore comme "à trancher" |
| Cache-Control uploads (D8) | `app.useStaticAssets(..., { prefix: '/uploads' })` sans option `maxAge`/`immutable` | ⬜ Non fait — D8 reste à trancher **et** implémenter |

**Conclusion : les commits C1, C2, C3 (backend Helmet) sont réellement faits et conformes au plan, avec une seule simplification (HSTS non progressif). C4 (tests automatisés) et tout le frontend (C5 à C13, soit toute la CSP et les headers Next.js) n'ont aucune trace dans le code — rien n'a été commencé côté Next.js.**

---

## 8. DÉCISIONS À TRANCHER (réparties par étape — **pas toutes avant implémentation**)

> ✅ **Correction v9** : seule **D9** doit être tranchée avant de coder. D1/D2/D7/D10 (tout ce qui touche à un domaine réel) se tranchent **au moment du déploiement concerné** (staging, puis production), pas avant. Voir aussi le résumé §13.0.

| # | Décision | Options | Impact | Quand trancher ? |
|---|----------|---------|--------|-------------------|
| D1 | Domaine(s) de production | **`TBD`** maintenant (placeholder) → `app.<domaine>` + `api.<domaine>` / mono-domaine derrière reverse-proxy | CORS, CSP `connect-src`/`img-src`, HSTS `includeSubDomains` | ❌ Pas maintenant — partiel avant staging (D10), définitif avant production |
| D2 | Terminaison HTTPS | **`TBD`** en local (HTTP) → Caddy/Nginx (recommandé) devant Nest | HSTS, score securityheaders | ❌ Pas maintenant — pertinent seulement dès staging |
| D3 | COEP | **Off** (recommandé) / On | Compatibilité Google Fonts, YouTube, Cloudflare | ✅ Déjà tranché (off) |
| D4 | CORP sur uploads | **`same-origin`** (recommandé — anti-hotlink strict) / `same-site` (si front et API sur origines différentes) / `cross-origin` | Affichage des images : même-origin bloquera un front sur `app.…` si l'API est sur `api.…` | ✅ **Déjà implémenté** — `crossOriginResourcePolicy: { policy: 'same-origin' }` présent dans `helmet.config.ts` (vérifié 17/08). ⚠️ À revalider si front/API finissent sur des origines différentes en prod (D1) |
| D5 | `script-src` en prod | **nonce ou hashs** (durci) / `unsafe-inline` (exception dev uniquement) | Niveau de protection XSS | ❌ Phase C uniquement |
| D6 | HSTS `preload` | Non (recommandé — seulement après Phase C) / Oui | Engagement 2 ans non révocable | ❌ Après Phase C, jamais avant |
| D7 | Collecte des violations CSP | **Console** (local/dev, suffisant pour démarrer) → `Reporting-Endpoints` + `report-to` (recommandé en staging/prod) / `report-uri` (fallback) | Qualité de la phase Report-Only | ✅ Console maintenant — ❌ réel pas avant staging |
| D8 | Cache-Control des uploads | Immutable (nom de fichier hashé) | Perf + sécurité | 🟡 Peut être tranché maintenant |
| D9 | Compression backend | **Helmet seul** (recommandé au lancement — le reverse-proxy Caddy/Nginx peut déjà compresser) / **Helmet + `compression`** (Nest) | Perf réseau ; `compression` ajoute une dépendance + risque BREACH sur réponses sensibles | ✅ **Maintenant** — indépendant du domaine, décision immédiate |
| D10 | Domaine + certificat de staging | **`TBD`** maintenant → `staging.<domaine>` + HTTPS dédié | Nécessaire pour tester HSTS/CSP en conditions réelles (§12.1/§12.2) | ❌ Pas maintenant — avant le déploiement staging |

---

## 9. COUPLAGES AVEC LES AUTRES P0 (à garder en tête)

- **P0-3 (CSRF)** : Helmet **complète** la défense CSRF (`Referrer-Policy`, COOP, en-têtes `Origin`/`Sec-Fetch-Site`) mais **ne la remplace pas** — la protection CSRF (token / vérification d'origine) doit rester implémentée explicitement.
- **P0-6 (path traversal upload)** : `nosniff` + `Cache-Control` sur les uploads complètent le fix.
- **P0-9 (Request ID)** : en-tête personnalisé `X-Request-Id` — à poser **après** Helmet (aucun conflit).
- **Déploiement** : le score securityheaders dépend du reverse-proxy TLS — prévoir la config Caddy/Nginx dans le plan d'infra (`Test-et-Preparation-Production.md`).

---

## 10. RISQUES CONNUS

- **Une nouvelle librairie externe** (script, analytics, chat, A/B test…) nécessitera probablement une mise à jour de la CSP.
- **Toute nouvelle iframe** (embed, vidéo, widget) devra être ajoutée dans `frame-src`.
- **Toute nouvelle API** appelée depuis le navigateur devra être ajoutée dans `connect-src`.
- **Toute nouvelle police** devra être ajoutée dans `font-src` (+ `style-src` pour son CSS).
- **Toute nouvelle source d'images** devra être ajoutée dans `img-src`.
- **Une CSP trop stricte peut casser silencieusement une fonctionnalité** : un script bloqué = fonction morte, sans erreur visible hors console.
- **HSTS `preload` est quasi irréversible** : une fois soumis aux listes des navigateurs, impossible de revenir en arrière avant des mois/années.
- **Les navigateurs cachent `Strict-Transport-Security`** : un `max-age` trop grand rend un rollback vers HTTP impossible → d'où la montée progressive (Phase A→C).
- **Un header oublié sur une route** (ex. uploads servis par un autre chemin) laisse une porte ouverte → tester TOUTES les routes, pas seulement la home.

---

## 11. ROLLBACK

| Situation | Action | Délai d'effet |
|-----------|--------|----------------|
| CSP bloque une fonctionnalité | Retirer la directive fautive (ou passer `reportOnly:true`) + redéployer | Immédiat |
| Site cassé (script-src trop strict) | Mettre `script-src 'unsafe-inline' 'unsafe-eval'` temporairement + redéployer | Immédiat |
| HSTS pose problème | Réduire `max-age` (ex: `max-age=0` en cas de retour HTTP) | Quelques minutes/heures (cache navigateur) |
| Helmet incompatible (v8) | `app.use(helmet({ contentSecurityPolicy: false }))` en attendant | Immédiat |
| HSTS problématique en local HTTPS (tunnel) | `hsts: false` temporaire | Immédiat |

> **Backend** : le rollback Helmet est un simple retrait de `app.use(...)` + redéploiement.
> **Frontend** : retirer les `headers()` de `next.config.ts` + redéploiement.
> **HSTS** : impossible d'annuler immédiatement côté navigateur (caché) — gérer via `max-age` court au début si doute.

---

## 12. ENVIRONNEMENTS, CI/CD & PRÉPARATION AVANT IMPLÉMENTATION

> Ajout suite retour utilisateur (voir historique) : passer de 2 environnements (development/production) à **3** (development/staging/production) — pratique standard en entreprise. **Section 100% documentaire — aucun fichier créé, aucune branche créée par l'agent.**

### 12.1 Modèle d'environnements (mise à jour)

| Environnement | CSP | HSTS | Usage |
|---------------|-----|------|-------|
| **development** | Désactivée (HMR/react-refresh) | Off | Poste local |
| **staging** *(nouveau)* | **Report-Only** en continu (jamais Enforce directement) | `phase-a` (max-age court) | Validation avant prod — c'est ici que la fenêtre d'observation Phase A (§4) doit majoritairement se dérouler, pas directement en prod |
| **production** | Report-Only → Enforce → Harden (Phases A/B/C, §4) | Progressif `phase-a → b → c` (§4) | Utilisateurs réels |

> Conséquence sur `helmet.config.ts` et `next.config.ts` (§3, SOUS-ÉTAPE 1/2) : la factory doit accepter **3 valeurs** (`development` / `staging` / `production`), pas un simple booléen `isProd`. Impact sur le code déjà esquissé en référence : `const isProd = env === 'production'` devra devenir une vraie branche à 3 voies le jour de l'implémentation (non appliqué ici).
> Ajout **D10** (voir §8) : Domaine de staging (`staging.onepips.fr` pressenti) + certificat HTTPS dédié — nécessaire avant de tester HSTS/CSP en conditions réelles.
> ✅ **Précision v9** : ce tableau décrit le modèle **cible**. Les commits C1 à C7 (§13.1) ne nécessitent **aucun** de ces éléments — ils se développent et se testent entièrement en `development` local (`localhost`). D10/staging n'entre en jeu qu'au moment du déploiement staging (§13.0).

### 12.2 Architecture CI/CD proposée (documentaire — à mettre en place, pas par l'agent)

```
Local
  |
  | git push (branche feature/security-helmet)
  v
GitHub Actions
  |  ├─ build
  |  ├─ lint / type-check
  |  └─ scripts/security-check.sh (curl -I sur les headers, §14 répartition)
  v
staging.onepips.fr
  |
  | Tests sécurité (matrice §3.3 + securityheaders.com)
  v
production
```

- **GitHub Actions** devient le **gate obligatoire** : aucun merge vers `main`/production sans que `scripts/security-check.sh` passe sur staging.
- Ce script rend concret le §3.1/§3.6 (vérification `curl -I`) : au lieu d'une checklist manuelle, il devient une **étape CI automatisée** rejouée à chaque déploiement (protège contre R12, §14 — régression silencieuse des headers).

### 12.3 Flux Git

```
feature/security-helmet
        ↓  (PR + review)
staging
        ↓  (validation : matrice §3.3 + CI security-check.sh + observation Phase A, §4)
main
        ↓  (déploiement)
production
```

- Rejoint le découpage en commits (§13) : les commits C1-C8 (Phase A) doivent atterrir sur `staging` **avant** `main`. Les Phases B/C (C9-C13) ne partent vers `production` qu'après validation staging explicite.
- Nom de branche à utiliser (§12.4, Étape 1) : `security/p0-helmet`.

### 12.4 Étapes préparatoires (statut de prise en charge — aucune ne requiert domaine/staging/HTTPS)

> Rappel : rien de ce qui suit n'a été exécuté par l'agent — **documentation de tâches à faire**, conformément à la règle « aucune modification du projet ». ✅ **Précision v9** : ces 4 étapes sont des tâches légères de local uniquement (branche, doc, placeholders `.env.*`, squelettes de config) — aucune ne dépend de D1/D2/D7/D10.

| Étape | Action | Qui | Quand | Statut |
|-------|--------|-----|-------|--------|
| 1 | `git checkout -b security/p0-helmet` | À faire (agent ou utilisateur, au choix — non exécuté ici) | Avant C1 | ⬜ En attente |
| 2 | Créer `docs/security/P0-2-Helmet.md` (reprise de ce plan) | **Pris en charge personnellement par l'utilisateur** | Avant C1 | ⬜ En attente de transmission |
| 3 | Créer les variables d'environnement **locales** : Backend `.env.development` (`NODE_ENV=development`, `FRONT_URL=http://localhost:3000`) ; Frontend `.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:3001`) — **placeholders uniquement, pas de domaine réel** | À faire (non exécuté ici) | Avant C1 | ⬜ En attente |
| 3bis | `.env.staging` (valeurs réelles D1/D10) | À faire | ❌ Pas avant le déploiement staging (§13.0) | ⬜ Différé |
| 4 | Créer une config par environnement : `config/helmet.dev.ts`, `config/helmet.staging.ts`, `config/helmet.prod.ts` (squelettes — même si `staging` n'existe pas encore en infra) | **Pris en charge personnellement par l'utilisateur** | Avant C1 (squelettes) | ⬜ En attente de transmission |

> Étapes 2 et 4 : à cocher dès réception de la transmission utilisateur — ne pas les régénérer/écraser une fois reçues.
> Étapes 1 et 3 : restent des tâches ouvertes du plan, à exécuter avant le commit C1 — mais **sans attendre aucune décision de domaine** (§13.0).

### 12.5 Répartition des tâches d'implémentation (qui code quoi)

> Séparation volontaire pour la phase de code (hors périmètre de cet agent, qui reste en analyse/documentation) :

| Zone | Fichiers | Contenu | Owner |
|------|----------|---------|-------|
| **Backend** | `onepips-backend/src/common/helmet.config.ts` + `onepips-backend/src/main.ts` | Import Helmet, factory de config (3 environnements), intégration Nest (`app.use`) | Agent d'implémentation (« DeepSeek ») |
| **Frontend** | `onepips-frontend/next.config.ts` | Headers sécurité non-CSP, CSP Report-Only, règles dev/staging/prod (§12.1) | Agent d'implémentation (« DeepSeek ») |
| **Tests** | `scripts/security-check.sh` (nouveau, non prévu dans le plan initial — ajouté ici) | Suite de `curl -I` reprenant §3.1/§3.6, pensé pour être rejoué par GitHub Actions (§12.2) | Agent d'implémentation (« DeepSeek ») |

> Ce tableau **remplace/complète** l'attribution implicite du §13 (Découpage en commits) : les commits C1-C3 (backend), C5-C13 (frontend) et C4 (tests) restent valables, mais leur **exécution** est déléguée à l'agent d'implémentation désigné ci-dessus — cet agent-ci ne code pas.

---

## 13. DÉCOUPAGE EN COMMITS (préparation implémentation — **aucun code écrit ici**)

> Objectif : chaque commit doit être **atomique**, **testable isolément**, et **revenable** (rollback = `git revert`). Aucun commit ne doit mélanger backend et frontend. Les commits « sans comportement » (fichier créé mais non branché) précèdent toujours le commit qui l'active.

### 13.0 Décisions réparties par étape (correction v9 — plus de « bloquantes avant C1 »)

> ⚠️ **Erreur corrigée** : la version précédente laissait croire que D1 (domaine prod), D2 (HTTPS) et D7 (reporting CSP) devaient être tranchées avant le commit C1. **C'est faux.** Le développement de Helmet + CSP se fait à 100% en local (`localhost:3000`/`localhost:3001`), sans domaine, sans HTTPS, sans staging. Répartition correcte :

| Avant... | Décisions à trancher | Pourquoi |
|----------|------------------------|----------|
| **C1** (installer Helmet) | **D9 uniquement** (Helmet seul) | Évite d'installer un paquet retiré au commit suivant — tout le reste peut attendre |
| **C3** (brancher Helmet) | Comportement par environnement (dev/staging/prod, §12.1) — avec des **placeholders** (`localhost`), jamais de vraies valeurs de domaine | Le code doit lire `process.env.NODE_ENV`/`FRONT_URL`/`API_URL`, pas des domaines en dur |
| **C6/C7** (CSP Report-Only) | Allowlist CSP **initiale** (pas finale) basée sur les dépendances réelles du code (table §2) | Report-Only ne bloque rien : les oublis d'allowlist se corrigent par itération (console → violation → correction → retest), voir §13.1 |
| **Déploiement staging** | **D1** (domaine staging) + **D2** (HTTPS/reverse-proxy staging) + **D7** (reporting CSP réel) + **D10** | C'est seulement à ce moment que ces éléments deviennent nécessaires |
| **Déploiement production** | **D1**/**D2** définitifs (domaines + HTTPS prod) | Décidés au moment du déploiement, pas avant |

> **Le point clé** : rien n'empêche de committer C1 → C7 **aujourd'hui**, en local, sans connaître le domaine de production ni même savoir s'il est disponible.

**Résumé — qu'est-ce qui doit être décidé *maintenant* ?**

| Décision | Maintenant ? | Pourquoi |
|----------|--------------|----------|
| Domaine prod (D1) | ❌ Non | Pas nécessaire en local |
| HTTPS prod (D2) | ❌ Non | Nécessaire seulement au déploiement |
| Domaine staging (D10) | ❌ Pas encore | Nécessaire quand le staging est créé |
| Installer Helmet | ✅ Oui | Fonctionne parfaitement en local (`localhost`) |
| Compression (D9) | ✅ Oui — mais réponse = **non, Helmet seul** | Décision immédiate, indépendante du domaine ; hors besoin immédiat de P0-2 |
| Allowlist CSP | 🟡 Initiale seulement | À construire avec les dépendances réelles du code, pas besoin d'être parfaite |
| CSP Report-Only | ✅ Oui | Très bien pour le local (aucune ressource bloquée) |
| Reporting CSP réel (D7) | ❌ Pas encore | Console suffisante au début |
| HSTS | ❌ Non (en local HTTP) | À activer progressivement seulement en staging/prod |
| CSP Enforce | ❌ Pas au début | Seulement après une observation Report-Only satisfaisante |

### 13.1 PHASE A — Report-Only

| # | Commit (message type) | Fichiers | Comportement | Test avant de passer au suivant | Rollback | Statut réel (17/08) |
|---|------------------------|----------|--------------|----------------------------------|----------|----|
| C1 | `chore(backend): install helmet` (+ `compression` si D9) | `package.json`, `package-lock.json` | **Aucun** (paquet non importé) | `npm ls helmet` → confirmer version → lire sa doc | `npm uninstall` / revert | ✅ Fait (v8.3.0, sans `compression`) |
| C2 | `feat(backend): add helmet.config.ts factory` | `src/common/helmet.config.ts` (nouveau) | **Aucun** (non importé) | Relecture manuelle des options vs doc de la version installée | Supprimer le fichier | ✅ Fait (⚠️ HSTS non progressif, `maxAge` codé en dur — voir §7 vérification) |
| C3 | `feat(backend): wire Helmet in main.ts (CSP off, HSTS phase-a)` | `src/main.ts` | **Changement réel** — tous les endpoints reçoivent les headers | §3.1 (4 `curl`) **+ retest signup/login/logout Better Auth + upload** avant tout autre commit | Retirer la ligne `app.use(helmet(...))` | ✅ Fait (ordre middleware conforme) — ❓ retest fonctionnel non confirmable par lecture de code |
| C4 | `test(backend): add header regression checks` | tests / script curl documenté | Aucun changement runtime | Exécuter la matrice §3.3 (partie backend) | — | ⬜ Non fait |
| C5 | `chore(frontend): add non-CSP security headers` | `next.config.ts` | **Changement réel** — toutes les pages reçoivent ces headers | DevTools Network sur 2-3 pages + `/admin/login` | Retirer le bloc `headers()` | ⬜ Non fait — `next.config.ts` ne contient que `{ reactCompiler: true }` |
| C6 | `feat(frontend): add CSP Report-Only (bloc public)` | `next.config.ts` | Aucune page bloquée (Report-Only) | Naviguer `/methode`, formulaires publics, vérifier console + rapports | Retirer le header CSP | ⬜ Non fait |
| C7 | `feat(frontend): add CSP Report-Only (bloc /admin/*)` | `next.config.ts` | Aucune page bloquée | Naviguer tout `/admin/*` | Retirer le bloc | ⬜ Non fait |
| C8 | `docs: update tracking (checklist 1-12, audit partiel)` | `.tracking/*.md` | Aucun | — | — | 🟡 Partiel — fait pour le backend (RBAC audit + ce document), pas pour le frontend puisque C5-C7 restent à faire |

**GATE Phase A** (§4) — se déroule en **2 temps** (correction v9) :
1. **En local (maintenant)** : boucle itérative Report-Only → tester l'app (`/methode`, formulaires, `/admin/*`) → lire les violations en **console** → corriger l'allowlist §2 → retester, jusqu'à zéro violation critique en local. Aucun domaine/staging requis.
2. **En staging** (une fois D1/D2/D7/D10 tranchés, §13.0) : 3-7 jours d'observation avec reporting réel (`Reporting-Endpoints`/`report-to`), critère de sortie = plus de violation critique dans les rapports.

### 13.2 PHASE B — Enforce

| # | Commit | Fichiers | Comportement | Test | Rollback |
|---|--------|----------|--------------|------|----------|
| C9 | `feat(frontend): switch CSP Report-Only → Enforce` | `next.config.ts` | **Changement majeur** — la CSP bloque désormais | Matrice complète §3.3 (dev + prod) | Repasser `reportOnly:true` immédiatement (§11) |
| C10 | `chore(backend): bump HSTS_PHASE → phase-b` | variable d'env déploiement (pas de code) | HSTS max-age 30 jours | — | Revert variable d'env |

**GATE Phase B** : 1-2 semaines, critère de sortie = aucune régression signalée (support, tests).

### 13.3 PHASE C — Harden (la plus risquée, cf. §14 R4)

| # | Commit | Fichiers | Comportement | Rollback |
|---|--------|----------|--------------|----------|
| C11a | Si **nonce** (D5) : `feat(frontend): add proxy.ts (génération nonce)` | `proxy.ts` (nouveau) | Aucun tant que non branché à la CSP | Supprimer le fichier |
| C11b | `feat(frontend): force dynamic rendering on nonce-dependent pages` | pages concernées | **Perte du statique/ISR/PPR/CDN** sur ces pages | Revert |
| C11c | `feat(frontend): switch script-src to nonce + strict-dynamic` | `next.config.ts` / `proxy.ts` | Retire `unsafe-inline` | Remettre `unsafe-inline`/`unsafe-eval` temporairement (§11) |
| *(alt.)* | Si **SRI** (recommandé, garde le statique) : `chore(frontend): enable experimental.sri` puis `feat(frontend): remove unsafe-inline once SRI validated` | `next.config.ts` | Statique conservé | Désactiver `experimental.sri` |
| C12 | `chore(backend): bump HSTS_PHASE → phase-c` | env déploiement | HSTS max-age 1 an, **`preload` reste `false`** (D6) | Revert variable d'env |
| C13 | `chore(frontend): tighten remaining directives (img-src, etc.)` | `next.config.ts` | Durcissement final | Revert |

### 13.4 Final

| # | Commit | Fichiers |
|---|--------|----------|
| C14 | `docs: mark P0-2 complete (audit ✅, checklist 13-19, score securityheaders.com)` | `.tracking/*.md` |

### 13.5 Chemin de travail concret (à partir de maintenant — correction v9)

> Vue d'ensemble qui remplace la lecture linéaire « C1 → C14 » par le vrai enchaînement, avec les points de bascule staging/production explicites.

```
                 MAINTENANT
                     │
                     ▼
              Développement local
                     │
              C1 — Installer Helmet
                     │
              C2 — Config Helmet
                     │
              C3 — Brancher Helmet
                     │
           Tests localhost:3001
        (Better Auth, uploads, API)
                     │
              C4 — Tests headers
                     │
           C5 — Headers Next.js
                     │
       C6/C7 — CSP Report-Only
          (localhost:3000, console)
                     │
          Tests + corrections CSP
             (boucle locale, §13.1)
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
           STAGING      (rester en local
              │          tant que pas prêt)
     domaine + HTTPS réels (D1/D2/D10)
              │
       Reporting CSP réel (D7)
              │
      Observation 3-7 jours
              │
          C9 — Enforce
              │
       Observation 1-2 semaines
              │
       Phase C — Harden
              │
          PRODUCTION
   (D1/D2 définitifs à ce stade)
```

**Chemin minimal pour démarrer aujourd'hui** (aucune étape ci-dessous ne nécessite domaine, certificat, reverse-proxy ou staging) :

1. Tag/commit de sauvegarde avant de commencer
2. C1 — installer Helmet
3. C2 — créer `helmet.config.ts`
4. C3 — brancher Helmet
5. Tester Better Auth + API + uploads (`localhost:3001`)
6. C4 — automatiser les tests headers
7. C5 — headers Next.js
8. C6/C7 — CSP Report-Only (`localhost:3000`)
9. Tester/corriger l'allowlist (boucle)
10. Seulement ensuite : préparer staging
11. Puis HTTPS + domaine de staging (D1/D2/D10)
12. Puis Phase B (Enforce)
13. Puis Phase C (Harden)
14. Puis production (D1/D2 définitifs)

> Les étapes 1 à 9 sont réalisables **dès maintenant**, sans attendre aucune décision de domaine/infra.

---

## 14. ANALYSE DES RISQUES D'IMPLÉMENTATION

> Distinct du §10 (risques de maintenance long terme de la CSP) — ici : risques liés **au déroulé de l'implémentation elle-même**.

| ID | Risque | Probabilité | Impact | Commit concerné | Mitigation |
|----|--------|--------------|--------|------------------|------------|
| R1 | Le proxy Better Auth (`@All('*')`) se comporte différemment après Helmet (login/signup cassé) | Moyenne | 🔴 Critique | C3 | Retester signup/login/logout **immédiatement** après C3, avant tout autre commit |
| R2 | Confusion Helmet/CORS par mauvais ordre de middleware | Faible | Élevé | C3 | Respecter l'ordre du plan (Helmet avant `enableCors`) |
| R3 | La fenêtre Report-Only (3-7j) donne une **fausse confiance** — un cas d'usage rare non déclenché passe à l'Enforce et casse en prod | Moyenne | Élevé | C9 | Fenêtre stricte + rollback immédiat prévu (`reportOnly:true`) ; ne pas raccourcir la fenêtre |
| R4 | Le passage **nonce** (Phase C) force le rendu dynamique → perte statique/ISR/PPR/CDN sur des pages publiques normalement statiques | Élevée si nonce choisi | Élevé (perf) | C11 | Préférer **SRI** (expérimental) pour garder le statique ; ne pas choisir nonce « par réflexe » |
| R5 | `preload: true` activé trop tôt (erreur de commit/copier-coller) → engagement quasi irréversible (~2 ans, listes navigateurs) | Faible (documenté `false`) | 🔴 Critique si ça arrive | C12 | Revue de code obligatoire sur ce champ ; ne jamais committer `preload:true` avant fin Phase C |
| R6 | Un domaine externe manquant dans l'allowlist casse une intégration **silencieusement** (pas d'erreur visible hors console) | Moyenne | Moyen | C6/C7/C9 | Vérifier la console + matrice §3.3 à **chaque** phase, pas seulement à la fin |
| R7 | *(reformulé v9 — D1/D2/D7 ne bloquent plus C6)* : coder un domaine **en dur** pendant le dev local au lieu de lire `process.env.FRONT_URL`/`API_URL` → oubli de rendre l'origine configurable, D1/D2 remplacés trop tard/mal | Faible si `process.env` respecté dès C3 | Élevé si oublié | C3/C6 | Toujours lire l'origine via variable d'environnement dès C3 (jamais de domaine en dur) — voir §13.0 |
| R8 | La version Helmet réellement installée diffère de la v8.3.0 vérifiée (nouvelle release entre-temps) | Faible | Moyen | C1/C2 | Toujours refaire `npm ls helmet` + relire la doc de LA version installée avant d'écrire `helmet.config.ts` |
| R9 | `compression` (si D9 retenu) compresse des réponses sensibles (session/tokens) → vecteur BREACH | Faible (D9 recommandé = Helmet seul) | Moyen | C1 | Ne compresser que les réponses non sensibles si D9 évolue vers « + compression » |
| R10 | Cache navigateur du HSTS empêchant un rollback rapide en cas de souci | Faible | Moyen-Élevé | C10/C12 | Montée progressive du `max-age` déjà prévue (phase-a→b→c), jamais de saut direct à 1 an |
| R11 | Oubli de mise à jour CSP lors d'une future intégration (Stripe/Cal.com/Sentry) « parce que ça marchait avant » | Élevée à moyen terme | Moyen | hors-scope immédiat | Commentaires ⚠️ déjà posés en §3 (`connect-src`/`frame-src` incomplets) — toute PR ajoutant un script tiers doit toucher la CSP |
| R12 | Absence de test automatisé sur les headers → une régression future (refactor `main.ts`) supprime Helmet silencieusement | Moyenne | Moyen | C4 | Ne pas sauter C4 (test d'intégration dédié) |

> **Commits les plus à risque** : **C3** (premier changement de comportement backend, R1/R2), **C9** (passage Enforce, R3/R6), **C11** (durcissement Phase C, R4/R5). Prévoir une fenêtre de test dédiée pour ces trois commits, pas de déploiement un vendredi soir.

---

## 15. LÉGENDE

| Symbole | Signification |
|---------|---------------|
| ⬜ | À faire |
| ✅ | Fait |
| ⚠️ | Attention / vérifier |
| 🔴 | Critique |
| 📝 | Document / plan |
