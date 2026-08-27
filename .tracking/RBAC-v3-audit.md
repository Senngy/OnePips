# RBAC v3 — Audit & Suivi

> Dernière mise à jour : 24/08/2026 (v4.3 — synchronisation avec `.tracking/Error-Handling-Architecture.md` : P0 #9 Request ID déjà fait par Error Handling Phase 2 ; référence croisée sur le contrat d'erreur)
> Statut global : ⚠️ En cours (Phases 1-8 terminées)
> **P0 vérifié le 17/08 contre le code réel** : #1 fait, #2 partiel, #9 fait via Error Handling (Phase 2), reste #3-8 et #36-39 à faire. Voir statuts détaillés en §10.
> **Coordination inter-document** : ce document est propriétaire d'`AuthGuard`/`RolesGuard`/`PermissionsGuard`/`User.status`/`Session.status`/`lastLoginAt`/permissions/révocation. Le contrat d'erreur (`ApiErrorResponse`, `requestId`, codes, format `{ code, message, details }`) appartient à `.tracking/Error-Handling-Architecture.md` (§4, §5, §7) — le référencer, ne jamais le redéfinir.

---

## 1. CORRECTION CONCEPTUELLE — Better Auth vs Prisma

> ⚠️ **Erreur corrigée dans l'audit v1** : « Prisma gère les utilisateurs » est **faux**.

### Qui possède quoi

**Better Auth est propriétaire de l'identité** : les tables `User`, `Session`, `Account`, `Verification` lui appartiennent — il y écrit via son adaptateur Prisma. Prisma n'est **pas** le propriétaire de l'identité, c'est l'ORM qui expose ces tables.

| Couche | Tables / champs | Responsable |
|--------|-----------------|-------------|
| **Identité (Better Auth)** | `User` (champs identité : email, emailVerified, name), `Session`, `Account`, `Verification` | Better Auth |
| **Champs métier sur `User`** | `role`, `avatar`, `locale`, `theme`, `timezone`, `preferences`… | Notre code (via `prisma.user.update`) |
| **Domaine (nous)** | `SuperAdmin`, `UserPermission`, `Customer`, `Lead`, `Payment`, etc. | Notre code Prisma |

### Distinguer champs identité / champs métier

Mettre à jour un champ métier avec Prisma est **parfaitement normal et autorisé** :

```ts
await prisma.user.update({
  where: { id },
  data: { role: 'ADMIN', timezone: 'Europe/Paris', avatar: '…' },
});
```

Better Auth n'interdit pas ça. Ce qu'il faut éviter, c'est **contourner sa logique interne** sur les champs identité :

| Gérés par Better Auth (ne pas écrire directement) | Champs métier (écriture Prisma OK) |
|----------------------------------------------------|-------------------------------------|
| `password` (hash) | `role` |
| `emailVerified` | `timezone` / `locale` |
| `accounts` (OAuth) | `avatar` / `theme` / `preferences` |
| `sessions` | champs business (à ajouter au schéma) |
| `verification` | — |

### Règle d'or (nuancée)

- 🔴 **Interdit** : créer une ligne `User` avec des données d'identité en contournant Better Auth (`prisma.user.create({ password })`) → hash incompatible, sessions/accounts incohérents, login cassé.
- ✅ **Normal** : mettre à jour les **champs métier** d'un user existant via `prisma.user.update()`.
- ⚠️ **À éviter** : toucher aux champs identité (`emailVerified`, `password`, `accounts`, `sessions`) sans passer par Better Auth, sauf raison précise.

### Conséquence sur `POST /users` (création d'admin)

La création d'un admin doit passer par un flux Better Auth natif :
1. L'invitation est créée dans **notre** domaine (`AdminInvitation` : token, email, role, expiresAt)
2. Le nouvel admin clique le lien → vérifie le token → **mieux** : `auth.api.signUpEmail()` déclenché **par l'utilisateur lui-même**
3. Better Auth crée `User` + `Session` → nous posons le `role` et les permissions en aval

> Note : il faut vérifier si Better Auth expose `signUpEmail` à partir du backend ou s'il faut ajouter le plugin `invite` / `organization`. Vérification à faire dans la doc Better Auth (voir `node_modules/better-auth/`).

---

## 2. CYCLE DE VIE UTILISATEUR & GDPR — 3 opérations distinctes

L'audit v1 ne distinguait pas. Il faut **trois** opérations, ce sont des exigences différentes :

| Opération | Effet | Données | Contraintes |
|-----------|-------|---------|-------------|
| **Disable** | Bloque l'accès (login refusé) | Conservées | Réversible, immédiat |
| **Delete** | Suppression physique (RGPD art. 17) | Supprimées + cascade | Détruit `Session`, `Account`, `UserPermission`, `SuperAdmin`. **Ne doit PAS casser les références business** (`Customer`, `Booking`…) → prévoir anonymisation/`onDelete: SetNull` ou garde |
| **Anonymize** | Données conservées mais PII effacées (RGPD art. 5/25) | Conservées, dépersonnalisées | Email → `anonyme-<uuid>`, name → null, liens OAuth coupés |

### Implications Schéma

- `User.deletedAt` / `User.anonymizedAt` : horodatage des opérations — **toujours à décider**.
- `Booking.customerId`, `Payment.customerId` : actuellement `onDelete` non défini (restrict par défaut) → un `Delete` physique d'un `Customer` peut échouer ou casser. Décision requise.
- Le `Delete` physique d'un `User` Better Auth doit passer par Better Auth (sinon reprise de la règle §1).

### 2.1 État de compte — `User.status` (DÉCIDÉ le 17/08, révisé le 17/08 — réutilisation de l'enum existant)

> Décision : **3 états**, avec sémantique strictement séparée. `SUSPENDED` n'est **pas** un deuxième `DISABLED`.
>
> ⚠️ **Correction** : l'enum `UserStatus { ACTIVE SUSPENDED DISABLED }` **existe déjà** dans `schema.prisma` (actuellement porté par `Session.status`, cf. §2.1 historique). On **réutilise ce même enum** pour `User.status` — pas de nouveau type à créer. Le nom `LOCKED` envisagé initialement est remplacé par **`SUSPENDED`** pour coller à l'enum réel et éviter une migration de type. **Seule une migration légère d'ajout de colonne est nécessaire** : `ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE'` (le type `UserStatus` existe déjà en base).

```prisma
enum UserStatus {
  ACTIVE
  SUSPENDED
  DISABLED
}
```

| État | Origine | Nature | Effet |
|------|---------|--------|-------|
| `ACTIVE` | Défaut | — | Compte normalement utilisable |
| `DISABLED` | **Décision administrative** (retrait d'équipe, désactivation manuelle) | Permanent jusqu'à réactivation manuelle | Login refusé · sessions existantes révoquées · aucune nouvelle session |
| `SUSPENDED` | **Mécanisme de sécurité automatique** (anti-brute-force, comportement suspect) | Temporaire | Login refusé temporairement · sessions révoquées · retour à `ACTIVE` après levée de la suspension |

```
ACTIVE
  │
  ├── désactivation administrative ──→ DISABLED
  │
  └── protection automatique ────────→ SUSPENDED
                                          │
                                          └── levée de la suspension → ACTIVE
```

**Règle d'or** : `DISABLED` = décision métier permanente jusqu'à action admin. `SUSPENDED` = état de sécurité temporaire. Ne jamais fusionner les deux (sinon on recrée artificiellement le besoin de `disabledBy`/`suspendReason`/`suspendedUntil` pour distinguer après coup deux causes différentes sous un seul état).

**Portée minimale aujourd'hui** : l'enum à 3 valeurs (déjà existant) est réutilisé tel quel, mais `SUSPENDED` n'est pas fonctionnellement piloté tant que la protection anti-brute-force n'existe pas (lié à P3 — device fingerprint / rate limiting, §10). **Ne pas ajouter `suspendedUntil` maintenant** : ce champ n'a de sens que lorsque le verrouillage automatique sera réellement implémenté. Avant cela, `SUSPENDED` reste un état positionnable uniquement via action manuelle (debug/admin), pas encore déclenché automatiquement.

**Levée de la suspension (`SUSPENDED → ACTIVE`)** : ne restaure **pas** les sessions révoquées. L'utilisateur doit se ré-authentifier — choix de sécurité assumé, pas un oubli.

**Révocation de session obligatoire** (`DISABLED` **et** `SUSPENDED`, pas seulement `DISABLED`) :

```
Admin désactive / suspend un user
        │
        ▼
Prisma : User.status = DISABLED | SUSPENDED
        │
        ▼
Better Auth : auth.api.revokeSessions({ userId })
        │
        ▼
Sessions existantes invalidées immédiatement
```

La révocation est une **mesure complémentaire**, pas la seule protection : le contrôle `User.status !== ACTIVE` dans `AuthGuard` (§3.2bis) bloque de toute façon la requête suivante même si une session survivait.

---

## 3. AUDIT DES GUARDS — Toutes les routes (vérifié code réel)

### 3.1 Couverture des routes

| Module | Routes protégées | Routes publiques | Problème |
|--------|------------------|------------------|----------|
| `auth` (`@Controller('auth')`) | — | **Tout** `@All('*')` | Volontaire (proxy Better Auth) ✅ mais inscription publique ouverte (§4) |
| `users` | `GET /` (USERS_MANAGE), `GET /permissions` (USERS_MANAGE), `GET /:id` (USERS_READ), `PATCH /:id/role`, `PATCH /:id/permissions`, `DELETE /:id/permissions` (SUPER_ADMIN) | — | ❌ **Pas de `POST /users`**, pas de `DELETE /users/:id` |
| `leads` | `GET`, `PATCH /:id/status`, `PATCH /:id`, `DELETE /bulk`, `DELETE /:id` | `POST /` (Turnstile) | ✅ |
| `applications` | `GET`, `POST`, `PATCH /:id/status` | `POST /direct` (Turnstile) | ✅ |
| `events` | `GET /archived`, `GET /:id/participants`, `POST /`, `PATCH /:id`, `PATCH /:id/cancel`, `PATCH /:id/publish` | `GET /`, `GET /upcoming`, `GET /state`, `POST /:id/register` (Turnstile) | ✅ routes statiques avant dynamiques |
| `booking` | `GET`, `POST` | — | ✅ |
| `payments` | `GET`, `POST` | — | ⚠️ `POST /` accepte un `@Body() any` (pas de DTO) — voir §5 |
| `community` | `POST`, `PATCH`, `DELETE` testimonials/results | `GET` testimonials, stats, results | ✅ |
| `upload` | `POST /upload` (FILES_UPLOAD) | `GET /uploads/:filename` | 🔴 **Path traversal possible** (§5) |
| `analytics` | `GET /overview` (multi-perm) | — | ✅ |
| `AppController` | — | `GET /api/` (hello) | ⚠️ Endpoint public par défaut — pas de health check dédié |

### 3.2 Points d'attention guards

- **`AuthGuard` fait un `prisma.session.update({ lastLoginAt })` à CHAQUE requête authentifiée** → 1 write DB par requête. Décision : le déplacer au **login** + au **refresh de session** uniquement (§7.2, §12).
- **`AuthGuard` utilise `console.log`** au lieu du `Logger` Nest → pas de structuration, log même en prod.
- **`request.user` n'est pas typé (`any`)** : le guard l'enrichit mais aucun type dédié n'existe (voir §3.3).
- **Guards non déclarés en `providers`** : instanciés ad-hoc par chaque module. C'est le **symptôme** du vrai sujet : l'absence de stratégie globale (voir §3.4). Ça marche uniquement grâce aux modules `@Global` — fragile en DI.
- **`RolesGuard`** : bypass SUPER_ADMIN + vérifie `request.user`. Dépend de l'ordre `@UseGuards(AuthGuard, RolesGuard)` — pas d'assertion de l'ordre dans le code.
- **`GET /:id` users** : `USERS_READ` seulement — n'importe quel user avec `USERS_READ` peut voir un user précis. OK par design (à confirmer).

### 3.2bis Flux cible `AuthGuard` — Authentication vs Authorization (DÉCIDÉ le 17/08)

```
Request
   │
   ▼
Better Auth getSession()
   │
   ├── aucune session valide ─────────────► 401 Unauthorized
   │
   ▼
Prisma User (findUnique)
   │
   ├── user introuvable ───────────────────► 401 Unauthorized
   │
   ├── user.status !== ACTIVE ─────────────► 401 Unauthorized
   │
   ▼
req.user = Prisma User (objet complet — ne pas se limiter à session.user)
req.session = Better Auth Session
   │
   ▼
RolesGuard / PermissionsGuard  (Authorization)
   │
   ├── rôle/permission insuffisant ────────► 403 Forbidden
   │
   ▼
Handler
```

**Codes HTTP — règle actée :**

| Cas | Code | Justification |
|-----|------|----------------|
| Pas de session / session expirée | `401 Unauthorized` | Non authentifié |
| `User.status = DISABLED` ou `SUSPENDED` (session par ailleurs valide) | `401 Unauthorized` | **Volontairement 401, pas 403** — évite de révéler l'existence/l'état d'un compte à qui possède un cookie volé (anti-énumération) |
| Authentifié + `status = ACTIVE` mais rôle/permission insuffisant | `403 Forbidden` | Authentifié, action refusée |

**Authentication ≠ Authorization — ne pas mélanger `SUSPENDED`/`DISABLED` avec le RBAC :**

```
Authentication (AuthGuard)
├── Session valide ?
├── User existe ?
└── User.status = ACTIVE ?
        │
        ▼
Authorization (RolesGuard / PermissionsGuard)
├── Role ?
└── Permissions ?
```

`SUSPENDED` n'est pas une permission. `DISABLED` n'est pas un rôle. Ces contrôles se font **avant** toute logique de rôle/permission, exclusivement dans `AuthGuard`.

**🔴 Interdiction explicite — pas de bypass `SUPER_ADMIN` sur le statut** : le bypass `user.role === Role.SUPER_ADMIN` existant dans `RolesGuard`/`PermissionsGuard` est un mécanisme d'**autorisation** et ne doit **jamais** s'appliquer au contrôle `status` (**authentification**, plus en amont). Un `SUPER_ADMIN` avec `status = DISABLED` doit être bloqué en `401` dans `AuthGuard`, avant même d'atteindre `RolesGuard`/`PermissionsGuard`. Sinon : `SUPER_ADMIN` désactivé = accès "god mode" malgré la désactivation → incohérence de sécurité inacceptable.

> **🟡 Question ouverte (coordination avec Error Handling — non tranchée)** : l'anti-énumération est assurée au niveau `statusCode` (`401` pour session absente **et** compte `DISABLED`/`SUSPENDED`). Mais si `AuthGuard` (P0 #38) émet un `code` d'erreur distinct pour ces deux cas (ex. `AUTH_SESSION_REQUIRED` vs `AUTH_ACCOUNT_INACTIVE`), la distinction redeviendrait visible dans le corps JSON. **Décision à trancher ici (document propriétaire)** : soit un `code` unique pour tous les 401 d'authentification (anti-énumération préservée de bout en bout), soit accepter une distinction au niveau `code` (à justifier). Le contrat de format des codes est défini dans `.tracking/Error-Handling-Architecture.md` (§5, §6 Exemple E, §8bis.4) — ce document décide de la sémantique, Error Handling décide du format.

### 3.3 Typage de `request.user`

Aujourd'hui `AuthGuard` fait `req.user = user` mais `req.user` est `any`. Recommandé :

```ts
// common/types/request-with-user.ts
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
  session: AuthenticatedSession;
}
```

- `AuthenticatedUser` = sous-ensemble de `User` (id, email, name, role, emailVerified…) sans relations lourdes.
- `AuthenticatedSession` = sous-ensemble de `Session` (id, token, expiresAt, ipAddress, userAgent).
- Bénéfice : safety compile-time partout (guards, decorators `@CurrentUser()`, controllers), refactor sûrs, impossible de lire un champ qui n'existe pas.

### 3.4 Stratégie globale des guards — évolution à évaluer

Aujourd'hui chaque endpoint répète `@UseGuards(AuthGuard, PermissionsGuard)`. Pour un backend qui grossit, c'est :
- **répétitif** — chaque nouvel endpoint doit penser à les poser ;
- **risqué** — un guard oublié = route publique silencieuse ;
- **fragile** — ordre implicite (`AuthGuard` avant `PermissionsGuard`).

**Évolution possible** (à évaluer, pas à faire maintenant) :

```ts
// app.module.ts
{ provide: APP_GUARD, useClass: AuthGuard },
{ provide: APP_GUARD, useClass: PermissionsGuard },
```

Puis seules certaines routes s'excluent :
- `@Public()` → bypass AuthGuard (ex : `POST /leads` Turnstile, GET événements, webhooks Stripe)
- `@Roles(...)` → garde le rôle (le `PermissionsGuard` global ignore les routes sans `@Permissions`)
- `@Permissions(...)` → garde la permission

**Précautions obligatoires si on y va** :
- Exclure `/api/auth/*` du `AuthGuard` global (le proxy Better Auth ne doit jamais être intercepté, sinon deadlock au login).
- Les routes publiques « payantes » (webhooks, Turnstile, GET événements) doivent être explicitement `@Public()` **et** vérifiées.
- Impact perf : `getSession()` tournerait sur toutes les requêtes → prévoir exclusions ou cache.
- La matrice « qui accède à quoi » doit être documentée (voir §9) car on perd les guards visibles par module.

---

## 4. AUDIT BETTER AUTH (approfondi)

Config réelle (`auth.ts`) : `emailAndPassword.enabled: true`, `baseURL`, `trustedOrigins: [FRONT_URL]`, `secret`. **Rien d'autre.**

### 4.1 Sessions & cookies

| Point | Statut | Détail |
|-------|--------|--------|
| Durée de session / `expiresIn` | ❌ Non configuré | Défaut Better Auth |
| Rotation de session | ❓ Défaut Better Auth | Doit être vérifié (test : 2 logins consécutifs → même `token` ?) |
| **Session fixation** | ❓ À vérifier | Une nouvelle session est-elle émise au login ? (comportement attendu de Better Auth — à confirmer par test) |
| Remember me / cookie long | ❌ Non configuré | — |
| Logout global | ❌ Non implémenté | Pas d'endpoint invalidation toutes sessions |
| Multi-device / limite sessions | ❌ Non configuré | — |
| Cookie `HttpOnly` | ❓ Défaut Better Auth | Vérifier dans la config `cookies` |
| Cookie `Secure` | ❓ Défaut Better Auth | Dépend de `useSecureCookies` / prod |
| Cookie `SameSite` | ❓ Défaut Better Auth | Vérifier `sameSite` |
| **Device fingerprint** | ❌ Non implémenté | Le schéma a `Session.ipAddress` + `Session.userAgent` mais rien ne les exploite (pas de détection de nouvelle device, pas d'alerte) |
| `lastLoginAt` (Session) | ✅ Présent dans le schéma | À mettre à jour au **login** + au **refresh de session** seulement (décision §12) |

### 4.2 Inscription & vérification

| Point | Statut | Détail |
|-------|--------|--------|
| `emailAndPassword.enabled` | ⚠️ Activé | N'importe qui crée un compte VIEWER |
| Restriction signup (domaine/whitelist) | ❌ Absent | `POST /auth/sign-up/email` est public |
| `emailVerified` | ⚠️ `false` par défaut | Aucun flux de vérification configuré |
| Forgot password / reset | ❓ Défaut Better Auth | Vérifier activation plugin |
| CSRF Better Auth | ❓ À vérifier | Better Auth émet/valide-t-il un token ? Sinon → CSRF (§5) |

---

## 5. AUDIT SÉCURITÉ WEB (approfondi)

`main.ts` réel : `ValidationPipe(whitelist, transform, forbidNonWhitelisted)`, CORS mono-origin `credentials:true`, statics `/uploads`, **pas de Helmet**, pas de compression, pas de limite body.

### 5.1 Helmet — c'est toute une suite, pas `npm install`

> 🔄 **Mis à jour le 17/08** — plan détaillé et vérification complète : `.tracking/Plan-P0-2-Helmet-Headers-Securite.md`. Résumé ci-dessous.

| Politique | Statut Backend (Nest) | Statut Frontend (Next.js) | Détail |
|-----------|------------------------|----------------------------|--------|
| Helmet (paquet) | ✅ Installé (`v8.3.0`) et branché dans `main.ts` | — (Helmet ne s'applique pas au frontend) | `src/common/helmet.config.ts` |
| **CSP** (Content-Security-Policy) | ⚪ Désactivée volontairement (API JSON, pas de HTML) | 🔴 Absent | Doit être posée côté Next.js (`next.config.ts`) — **non commencé** |
| **Clickjacking** (`X-Frame-Options` / frame-ancestors) | ✅ `frameguard: deny` | 🔴 Absent | Pages HTML du site toujours embeddables dans un iframe hostile |
| **HSTS** (`Strict-Transport-Security`) | 🟡 Configuré mais `maxAge` codé en dur (pas de progression phase-a/b/c), prod only | 🔴 Absent | — |
| **Referrer Policy** | ✅ `no-referrer` | 🔴 Absent | — |
| **Permissions Policy** | ❌ Absent (pas dans `helmet.config.ts`) | 🔴 Absent | À ajouter des deux côtés |
| `X-Content-Type-Options` / `X-DNS-Prefetch-Control` | ✅ Présents (`noSniff`, `xDnsPrefetchControl`) | 🔴 Absents | — |
| `Cache-Control` sur les réponses dynamiques | ❌ Non défini | ❌ Non défini | Risque de cache de données admin sur les GET protégés — toujours ouvert |

**Verdict** : le backend a fait le strict minimum Helmet (commits C1-C3 du plan P0-2), mais **le frontend Next.js n'a reçu aucun header de sécurité et aucune CSP** — c'est la partie la plus importante en volume (CSP = protection XSS) et elle n'a pas démarré.

### 5.2 Autres points sécurité

| Point | Statut | Détail |
|-------|--------|--------|
| **XSS (frontend)** | ⚠️ Partiel | React échappe par défaut. Vérifier absence de `dangerouslySetInnerHTML` + validation entrées. Pas de CSP (ci-dessus). Le stockage local n'utilise **pas** de tokens auth (seulement lead/source) ✅ |
| **CSRF** | 🔴 Non implémenté | Cookies de session + CORS `credentials:true` : une requête cross-site peut utiliser la session si CSRF absent. Vérifier ce que Better Auth fait, sinon implémenter |
| **Path traversal upload** | 🔴 `GET /uploads/:filename` fait `join(UPLOAD_DIR, filename)` avec le paramètre utilisateur → `../../` possible si le fichier existe | Valider avec `basename()` + check que `resolve()` reste dans `UPLOAD_DIR` |
| Body size limit | ❌ Non configuré | `bodyParser:false` (requis Better Auth) → pas de limite globale |
| CORS | ⚠️ Mono-origin | OK pour 1 front, mais pas de gestion multi-env (staging/preview) |
| Mass assignment | ✅ `forbidNonWhitelisted` | Bon |
| Validation DTO | ⚠️ Partiel | `payments.controller` utilise `@Body() any` sans DTO |
| MIME upload | ✅ Whitelist + 5MB | Bon (mais extension déduite du MIME déclaré par le client) |
| Rate limiting global | ✅ Throttler 20 req/60s | Bon |
| Rate limiting auth | ⚠️ In-memory `Map` | Perdu au restart, pas distribué, pas Redis. Clé `ip:path` (pas de compte-rendu IP derrière proxy non configuré) |
| SQL injection | ✅ Prisma | — |
| Secrets | 🟡 `.env` local — non commité **confirmé** (17/08 : présent dans `.gitignore` backend, absent de `git ls-files`) | Rotation des secrets Stripe/BetterAuth toujours à vérifier |

---

## 6. AUDIT PRISMA (corrigé)

### 6.1 Correction de l'audit v1

> ❌ « Index manquant sur `User.email`, `Session.token` » était **FAUX**.
> ✅ Ces colonnes sont `@unique` → Prisma génère déjà un index unique.

### 6.2 Index réellement manquants (à vérifier / ajouter)

| Colonne | Pourquoi |
|---------|----------|
| `User.role` | Filtrage des admins (page Users, guards) |
| `User.status` (à créer, §2) | Soft delete → filtrage ACTIVE |
| `User.deletedAt` / `User.anonymizedAt` (à créer) | Requêtes d'exclusion |
| `User.createdAt` | Tri liste users |
| `Session.userId` | `AuthGuard` + revocations (FK non indexée ?) |
| `Session.expiresAt` | Purge des sessions expirées |
| `Account.userId`, `UserPermission.userId` | FK — Prisma **n'indexe pas automatiquement** les clés étrangères |

> ⚠️ **Vérifier** avec `EXPLAIN ANALYZE` si les FK sont réellement non indexées chez Prisma PostgreSQL (comportement documenté : non indexées par défaut).

### 6.3 N+1 & requêtes

| Point | Statut | Détail |
|-------|--------|--------|
| `findAllWithPermissions()` | 🔴 N+1 | 1 requête users + **2 requêtes par user** (`getEffectivePermissions` = findUnique + findMany) → `2N+1`. À remplacer par une requête groupée |
| `hasPermissions()` (guard) | ⚠️ 2 requêtes par vérif | `getEffectivePermissions` à chaque appel, non caché. Utilisé à chaque requête protégée |
| `AuthGuard` | 🔴 1 write/requête | `session.update(lastLoginAt)` à chaque requête |
| Transactions | ⚠️ Absentes | `updatePermissions()` fait un `upsert` en boucle sans `$transaction` |
| `payments.controller` | ⚠️ `@Body() any` | Aucune validation → risque de crash/bad input |

---

## 7. AUDIT PERFORMANCES (approfondi)

L'audit v1 était trop superficiel. Sans métriques réelles, impossible de trancher. Voici ce qu'il **faut mesurer** avant d'optimiser :

### 7.1 Métriques à capturer

| Métrique | Où | Comment |
|----------|-----|---------|
| Nombre de requêtes SQL par endpoint | Logger Prisma | `prisma.$on('query')` en dev |
| Temps moyen / p95 des endpoints | Middleware | Ajouter duration déjà présente dans `LoggerMiddleware` → l'exploiter |
| Payload réponses | Intercepteur | Taille en octets des GET /leads, /users |
| Index utilisés | Perf | `EXPLAIN ANALYZE SELECT ...` sur : `GET /leads`, `GET /users`, `getEffectivePermissions` |
| Write/requête | Audit | Compter `session.update` dans AuthGuard (1 par requête protégée) |

### 7.2 Problèmes de conception identifiés (sans benchmark)

| Problème | Impact | Fix |
|----------|--------|-----|
| `lastLoginAt` à chaque requête | Write DB sur le chemin chaud | Mise à jour **au login** et **au refresh de session** uniquement — jamais à chaque requête (§12) |
| Pas de cache permissions | `getEffectivePermissions` recalculé à chaque requête | Cache **local + invalidation immédiate** sur override — **pas de TTL fixe** (§12) |
| N+1 sur liste users | O(N) requêtes | `groupBy`/`in` |
| Pas de pagination `/users` | Payload complet + latence | `skip/take` + tri |
| Pas de pagination `/analytics` | Vérifier le payload | — |
| Compression | ❌ Absente | `compression` middleware si body > 1KB |
| Cache GET publics (events, community) | Refetch systématique | Cache HTTP (`Cache-Control`) + revalidation |

---

## 8. AUDIT OBSERVABILITÉ (approfondi)

### 8.1 Identifiants de corrélation

| Point | Statut | Détail |
|-------|--------|--------|
| **Request ID / Correlation ID / Trace ID** | 🔴 Absents | Impossible de suivre une requête de bout en bout (front → API → Prisma → logs) |
| Ajout d'un `X-Request-Id` | 🔴 À faire | Générer un UUID par requête + l'injecter dans les logs et les réponses |

### 8.2 Logs

| Point | Statut | Détail |
|-------|--------|--------|
| Logs structurés (JSON + niveaux) | 🔴 Non | `LoggerMiddleware` écrit du texte libre |
| Logs d'erreur corrélés | 🔴 Non | Aucun contexte (userId, requestId) dans les erreurs |
| `console.log` dans AuthGuard | ⚠️ | Non structuré, visible en prod |
| **Audit log des actions admin** | 🔴 Manquant | Changer un rôle / permissions est **intracable** |

### 8.3 Audit log (modèle à créer)

Chaque action sensible doit être tracée :

```
AdminAuditLog {
  id, performedBy(userId), targetUserId?, action(enum),
  oldValue?, newValue?, metadata(Json), ipAddress, userAgent,
  createdAt
}
```

Actions : `USER_CREATED`, `USER_DISABLED`, `USER_DELETED`, `USER_ANONYMIZED`, `ROLE_CHANGED`, `PERMISSIONS_UPDATED`, `PERMISSIONS_RESET`, `SUPER_ADMIN_PROMOTED`…

### 8.4 Métriques & monitoring

| Métrique | Statut |
|----------|--------|
| Nombre de logins réussis/échoués | ❌ Non |
| Nombre d'erreurs / 5xx | ❌ Non |
| Temps de réponse (moy, p95, p99) | ❌ Non |
| Health check endpoint | ⚠️ Seul `GET /api/` existe (hello) |
| Monitoring (uptime, DB) | ❌ Non |
| Alertes | ❌ Non |

---

## 9. SCHÉMA DE DÉPENDANCES ENTRE MODULES

### 9.1 Graphe réel (vérifié)

```
                    ┌───────────────┐
                    │  AppModule    │
                    │  (importe tous)│
                    └──────┬────────┘
                           │
     ┌─────────┬───────────┼────────────┬──────────────┐
     │         │           │            │              │
┌────▼───┐ ┌───▼─────┐ ┌───▼────┐ ┌────▼─────┐  ┌─────▼─────┐
│ Prisma │ │ Permis- │ │ Users  │ │ Auth     │  │ Leads,    │
│ Module │ │ sions   │ │ Module │ │ Module   │  │ Apps,     │
│ @Global │ │ @Global │ │        │ │          │  │ Events…   │
└────────┘ └─────────┘ └───┬────┘ └──────────┘  └───────────┘
      ▲        ▲           │         │
      │        │           │         │ (guards utilisés par
      └────────┴───────────┼─────────┘  tous les modules
  DI : PrismaService &     │             via @UseGuards)
  PermissionsService       │
  résolus partout          │
                     UsersService
                     injecte PermissionsService
```

### 9.2 Analyse

| Point | Verdict |
|-------|---------|
| Dépendances circulaires | ✅ **Aucune aujourd'hui** — `UsersService → PermissionsService` (unidirectionnel), `PermissionsService` n'importe rien d'autre |
| Pourquoi ? | Tout le monde dépend des 2 modules `@Global` (Prisma + Permissions). Graphe plat |
| Risque futur | 🔴 La dépendance aux `@Global` cache la couplage réel. Dès que `PermissionsService` aura besoin d'un autre service (ex: audit log, users), un **cycle Users ↔ Permissions est immédiat** |
| Fragilité DI | Guards non enregistrés en `providers` → toute dépendance non-globale dans un guard = crash DI silencieux |
| Recommandation | Inverser la dépendance : `PermissionsService` ne doit **jamais** dépendre de `UsersService` (ou le faire passer par un `AuditLogModule` / `UserIdentityModule` non-global) |

### 9.3 Direction des imports (matrice)

```
             Users  Permissions  Auth   Leads  Apps  Events  Booking  Payments  Community  Upload  Analytics
Users        —       Uses(global) Uses guard  —      —     —        —         —          —         —       —
Permissions   —       —           —         —      —     —        —         —          —         —       —
Auth(guards) UsesP   —           —         —      —     —        —         —          —         —       —
Leads        —       Uses(global) Uses guard  —     —     —        —         —          —         —       —
...
```

> Tous les modules métier consomment `PrismaService` (global) + guards auth/permissions. **Aucun module métier n'importe un autre module métier** — bon découplage, mais `@Global` masque le graphe réel.

---

## 10. CHECKLIST TODO (révisée)

### P0 — Critique (sécurité / bloquant)

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 1 | ~~Appliquer la migration DB `rbac_v3`~~ ✅ **Fait** — 17/17 migrations appliquées, colonne `granted` présente sur `UserPermission`, enum `Permission` = 20 valeurs (dont `USERS_READ`, `ADMINS_MANAGE`, `ROLES_MANAGE`, `FILES_UPLOAD`). Vérifié en base le 30/07 | Prisma | ✅ |
| 2 | Installer Helmet + configurer **toute la suite** : CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy, nosniff | Sécurité | 🟡 |
| 3 | CSRF : vérifier ce que Better Auth fournit, sinon implémenter | Sécurité | ⬜ |
| 4 | **Audit log admin** (modèle `AdminAuditLog` + écriture sur role/permissions change) | Observabilité | ⬜ |
| 5 | Rate limiting auth → Redis (pas in-memory) | Sécurité | ⬜ |
| 6 | Corriger `GET /uploads/:filename` (path traversal) | Sécurité | ⬜ |
| 7 | Désactiver/restreindre le signup public OU restreindre par domaine | Sécurité | ⬜ |
| 8 | Déplacer `lastLoginAt` au login + refresh de session (plus de write à chaque requête) | Perf | ⬜ |
| 9 | ~~Ajouter Request ID / Correlation ID (middleware + réponse)~~ ✅ **Fait via Error Handling Phase 2** — `RequestIdMiddleware` génère `req.requestId`, pose `X-Request-Id`, `LoggerMiddleware` le logge, `GlobalExceptionFilter` l'injecte dans les erreurs. Référence : `.tracking/Error-Handling-Architecture.md` §7. Plus aucune action RBAC requise | Observabilité | ✅ |
| 36 | Ajouter la colonne `status` sur `User` (type `UserStatus` **déjà existant** dans le schéma — `ACTIVE`/`SUSPENDED`/`DISABLED`, défaut `ACTIVE`) — voir §2.1. **Pas de nouvel enum à créer**, migration légère (ajout de colonne uniquement). `SUSPENDED` sans mécanique de verrouillage automatique pour l'instant | Prisma | ⬜ |
| 37 | Supprimer `Session.status` + `enum UserStatus` (Session) — confirmé mort : 0 référence dans `src/`, absent du schéma Better Auth (`sessionSchema` core) | Prisma | ⬜ |
| 38 | `AuthGuard` : vérifier `user.status === ACTIVE` juste après le `findUnique`, sinon `401` — **avant** `RolesGuard`/`PermissionsGuard`, sans bypass `SUPER_ADMIN` (§3.2bis) | Backend | ⬜ |
| 39 | `Disable`/`Lock` : appeler `auth.api.revokeSessions({ userId })` immédiatement après l'écriture de `User.status` (§2.1) | Backend | ⬜ |

#### Vérification P0 contre le code réel — 17/08/2026

Chaque ligne ci-dessus a été confrontée au code source (pas seulement à l'intention). Détail :

| # | Preuve vérifiée | Verdict |
|---|------------------|---------|
| 2 | `helmet.config.ts` (commit `294fab8`, message *"Helmet security headers (P0-2 **Phase A**)"*) : `hsts`, `noSniff`, `frameguard`, `referrerPolicy`, `hidePoweredBy`, `xDnsPrefetchControl`, `ieNoOpen` configurés. **`contentSecurityPolicy: false`** (explicitement désactivée) et **`Permissions-Policy` absente**. Le commit s'auto-désigne "Phase A" → une "Phase B" (CSP + Permissions-Policy) reste nécessaire pour clore ce point | 🟡 Partiel |
| 3 | `grep -r "csrf\|CSRF" src/` → 0 résultat | ⬜ Inchangé |
| 4 | Pas de modèle `AdminAuditLog` dans `schema.prisma`, `grep -r "AuditLog" src/` → 0 résultat | ⬜ Inchangé |
| 5 | `auth-rate-limit.middleware.ts` : toujours `const store = new Map<string, Entry>()`, en mémoire, non distribué | ⬜ Inchangé |
| 6 | `upload.controller.ts` (modifié le 08/08, mais pas sur ce point) : `serveFile()` fait toujours `join(UPLOAD_DIR, filename)` avec le paramètre brut, sans `basename()` ni vérification `resolve()` | ⬜ Inchangé — 🔴 toujours exploitable |
| 7 | `auth.ts` inchangé depuis l'audit (`emailAndPassword.enabled: true` sans restriction), `AuthController` toujours `@All('*')` sans filtre sur `sign-up` | ⬜ Inchangé |
| 8 | `auth.guard.ts:44-47` : `this.prisma.session.update({ lastLoginAt })` toujours exécuté à **chaque** requête authentifiée | ⬜ Inchangé |
| 9 | ~~Aucun middleware / header `X-Request-Id`~~ ✅ **Fait depuis le 24/08** — implémenté par Error Handling Phase 2 (`RequestIdMiddleware`, `X-Request-Id`, `requestId` dans `ApiErrorResponse`) | ✅ Fait via Error Handling |
| 36-39 | `schema.prisma` non modifié depuis le 25/07/2026 (dernier commit touchant ce fichier : `b71bf00`, antérieur à la décision §2.1) : pas de `User.status`, `Session.status` toujours présent, `AuthGuard` sans contrôle de statut, aucun appel à `revokeSessions` dans le code | ⬜ Non commencé (normal — décision actée seulement le 17/08, après le dernier commit schéma) |

**Conclusion : sur 13 items P0, 2 sont faits (#1, #9 — ce dernier via Error Handling Phase 2) et 1 est partiel (#2 — Helmet sans CSP). Les 10 autres (#3-8, #36-39) n'ont aucune trace d'implémentation dans le code actuel.** Rien à cocher de plus à ce stade.

### P1 — Important ✅ Validé le 27/08 (finir 22 lorsque Payments sera implémenté)

> 🔄 **Réorganisé le 26/08** : items 10-13 validés (invitation admin + UI terminées). Nouveaux items 14-16 (RBAC frontend : exposer les `effectivePermissions`, `usePermissions()`, dépendances de permissions), puis session Better Auth (#17-18), observabilité (#19), et items optionnels/reportés en fin (#20-22). 8

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 10 | ~~Décider du cycle de vie : `User.status`~~ ✅ **Statut décidé** (§2.1 : `ACTIVE/SUSPENDED/DISABLED`, enum déjà existant réutilisé, implémentation en P0 #36-39). Restent ouverts : `deletedAt`, `anonymizedAt` + modèles GDPR | Prisma | ✅ |
| 11 | Création admin par **invitation** (`AdminInvitation` + flux Better Auth natif, PAS `prisma.user.create`) — **fait** : `POST /users/invitations` + `:token/complete`, email Mailpit, rôle imposé ADMIN | Backend | ✅ |
| 12 | `POST /users` (SUPER_ADMIN) + DTO `CreateUserDto` — **superseded par #11** (invitation, plus de mot de passe fantôme) | Backend | ✅ |
| 13 | UI frontend "Créer un administrateur" + "Désactiver" — **création faite** (`InviteAdminModal` + `/admin/invitation`) ; "Désactiver" = placeholder en attente de P0 #36-39 | Frontend | ✅ |
| 14 | Exposer les `effectivePermissions` du user courant au frontend — endpoint sécurisé ou intégration dans la session Better Auth ; la source doit inclure `ROLE_PERMISSIONS` + overrides `UserPermission` | RBAC / Backend + Frontend | ✅ |
| 15 | Créer `usePermissions()` basé sur les `effectivePermissions` réelles + état centralisé et mécanisme de refresh/invalidation après modification des permissions | RBAC / Frontend | ✅ |
| 16 | Définir et faire respecter les dépendances entre permissions : `WRITE → READ`, `DELETE → READ` pour les familles CRUD ; aucune cascade universelle pour les permissions non-CRUD ; UI cohérente + validation backend — **fait** (UI : WRITE/DELETE désactivées si READ absente, overrides préservés ; backend : validation) | RBAC | ✅ |
| 17 | Configurer Better Auth : session `expiresIn`, rotation, rememberMe, cookies Secure/HttpOnly/SameSite | Sécurité | ✅ |
| 18 | Vérifier session fixation / rotation par test | Sécurité | ✅ |
| 19 | Logs structurés (JSON) + intégrer/remplacer les `console.log` AuthGuard | Observabilité | ✅ |
| 20 | N+1 `findAllWithPermissions()` → requête groupée — **optionnel, reporté en P3** | Perf | P3 |
| 21 | Pagination + tri sur `GET /users` — **optionnel, reporté en P3** | Perf | P3 |
| 22 | DTO sur `payments.controller` (`@Body() any` → DTO) — **dernière phase P1**, après implémentation réelle de Payments | Backend | ⬜ |

### 🔄 CHECKPOINT — RBAC Frontend / comportements utilisateur ✅ Validé le 27/08

> Objectif : aligner l'expérience frontend sur les permissions effectives une fois celles-ci exposées au client. Le backend reste l'autorité de sécurité.

- [✅] Filtrer la sidebar selon `effectivePermissions`
- [✅] Protéger les accès directs aux pages
- [✅] Masquer/désactiver les actions sans permission
- [✅] Harmoniser les états `403` avec `AccessDenied` / toasts
- [✅] Ne pas vider les formulaires après un `403`
- [✅] Loading + anti-double-submit sur les mutations
- [✅] Confirmation sur les actions destructives
- [✅] Vérifier le comportement après modification d'une permission sans F5
- [✅] Documenter les écarts constatés sur Leads / Applications / Events / Community

### P2 — Secondaire (qualité + dette)

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 21 | Supprimer OU utiliser `ADMINS_MANAGE` + `ROLES_MANAGE` (mortes) | Dette | ⬜ |
| 22 | Index manquants : `User.role`, `User.status`, `Session.userId`, `Session.expiresAt`, FK (`EXPLAIN ANALYZE` d'abord) | Perf | ⬜ |
| 23 | Transaction dans `updatePermissions()` (`$transaction`) | Perf | ✅ |
| 24 | Compression HTTP + `Cache-Control` sur GET publics | Perf | ⬜ |
| 25 | Confirmation UI (role/permissions reset) + remplacer `alert()` | UX | ⬜ |
| 26 | Recherche/filtre par email/nom/rôle (page Users) | UX | ✅ |
| 27 | **Typer `request.user`** (`RequestWithUser` + `AuthenticatedUser`) | Archi | ⬜ |
| 28 | **Évaluer la stratégie globale des guards** (`APP_GUARD` AuthGuard+PermissionsGuard, `@Public()`/`@Roles()`, exclusion `/api/auth/*`) | Archi | ⬜ |
| 29 | Enregistrer guards en `providers` + importer explicitement leurs modules (fin du tout-global) | Archi | ⬜ |
| 30 | Métriques : logins, erreurs, 5xx, p95 → health check + monitoring | Observabilité | ⬜ |

### P3 — Futures évolutions

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 31 | Flow invitation email complet + mot de passe oublié | Feature | ⬜ |
| 32 | Device fingerprint + alerte nouvelle device | Sécurité | ⬜ |
| 33 | Logout global + limite multi-device | Sécurité | ⬜ |
| 34 | Anonymisation GDPR de masse + purge sessions expirées | Feature | ⬜ |
| 35 | Tracing distribué (OpenTelemetry) | Observabilité | ⬜ |
| 36 | Optimisation en requête groupée (`groupBy`/`in`) | Perf | ⬜ |
| 37 | Ajouter `page`/`limit` + tri sur `GET /users` | Perf | ⬜ |

---

## 11. LÉGENDE

| Symbole | Signification |
|---------|---------------|
| ✅ | Fait / Validé |
| ⚠️ | Partiel / À améliorer |
| 🟡 | Partiel — en cours, vérifié dans le code (nuance de ⬜) |
| ❌ | Manquant / Pas fait |
| 🔴 | Critique |
| ⬜ | À faire (todo) |
| ❓ | À vérifier (test/documentation requis) |

---

## 12. NOTES DE DÉCISIONS

| Date | Décision | Contexte |
|------|----------|----------|
| 30/07 | **Better Auth = propriétaire de l'identité** (champs identité : password, emailVerified, accounts, sessions, verification). Prisma = ORM. **Champs métier** (role, timezone, avatar, theme…) écrivables librement via `prisma.user.update` | Correction v2 |
| 30/07 | **Cycle de vie en 3 opérations** : Disable / Delete / Anonymize (RGPD) — pas un simple soft delete | §2 |
| 30/07 | **Création admin par invitation** : token domaine + signUp Better Auth par l'utilisateur lui-même | §1 |
| 30/07 | **Audit log obligatoire** avant d'enrichir les features admin | §8.3 |
| 30/07 | **Permissions mortes** (`ADMINS_MANAGE`, `ROLES_MANAGE`) : utiliser ou supprimer — décision repoussée | §10 P2-21 |
| 30/07 | **`getEffectivePermissions` non caché = coût 2 requêtes/check** → cache **local + invalidation immédiate** sur override, pas de TTL fixe (un retrait de permission doit être effectif immédiatement) | §7.2 |
| 30/07 | **`lastLoginAt`** : mise à jour **au login** + **au refresh de session**, jamais à chaque requête (pas de suppression de la feature) | §3.2 / §7.2 |
| 30/07 | **Typage `request.user`** (`RequestWithUser` + `AuthenticatedUser`) — à implémenter avant d'ajouter des routes | §3.3 |
| 30/07 | **Stratégie globale des guards** (`APP_GUARD` + `@Public()`/`@Roles()`) — évolution à évaluer, pas immédiate | §3.4 |
| 17/08 | **Décision 1 — `User.status`** : 3 états `ACTIVE / SUSPENDED / DISABLED`. `SUSPENDED` ≠ deuxième `DISABLED` (sémantique strictement séparée : décision admin permanente vs sécurité automatique temporaire). Révisé le 17/08 : l'enum `UserStatus` **existe déjà** dans le schéma (porté par `Session.status`) → **réutilisé tel quel** pour `User.status`, pas de nouveau type créé, `LOCKED` renommé en `SUSPENDED` pour coller à l'enum réel. Non piloté tant que l'anti-brute-force n'existe pas (pas de `suspendedUntil` prématuré) | §2.1 |
| 17/08 | **Décision 2 — `Session.status`** : suppression actée (confirmé mort : 0 référence code, absent du schéma Better Auth). Remplacé par `User.status` comme source d'autorité unique | §2.1 / P0 #37 |
| 17/08 | **Décision 3 — Révocation de session** : `DISABLED` **et** `LOCKED` déclenchent `auth.api.revokeSessions({ userId })`. Déverrouillage `LOCKED → ACTIVE` ne restaure pas les sessions (ré-authentification obligatoire) | §2.1 / P0 #39 |
| 17/08 | **Décision 4 — `AuthGuard` cible** : `getSession()` Better Auth → `findUnique` Prisma → `status === ACTIVE` → `req.user`/`req.session` → guards de rôle/permission. Contrôle du statut **avant** toute logique RBAC, **sans bypass `SUPER_ADMIN`** | §3.2bis / P0 #38 |
| 17/08 | **Décision 5 — `lastLoginAt`** : confirmé — mise à jour au login + refresh de session uniquement, jamais à chaque requête (inchangé depuis le 30/07) | §7.2 / P0 #8 |
| 17/08 | **Décision 6 — Codes HTTP** : pas de session → `401` ; compte `DISABLED`/`LOCKED` → `401` (anti-énumération, pas de fuite d'information sur l'état du compte) ; authentifié mais rôle/permission insuffisant → `403` | §3.2bis |
| 17/08 | **Décision 7 — Ordre des travaux** : (1) figer `User.status` → (2) supprimer `Session.status` → (3) implémenter révocation `DISABLED`/`LOCKED` → (4) adapter `AuthGuard` → (5) `lastLoginAt` (déjà en P0 #8) → (6) tests manuels du cycle de vie → **puis seulement** tests RBAC backend (§10 checklist) | P0 #36-39 |
| 24/08 | **Coordination inter-document** : le contrat d'erreur (`ApiErrorResponse`, `requestId`, codes, format `{ code, message, details }`) est propriété de `.tracking/Error-Handling-Architecture.md` (§4, §5, §7, §8bis) — ce document le référence sans le redéfinir. **P0 #9 (Request ID) marqué fait** car implémenté par Error Handling Phase 2. La migration des guards vers des exceptions structurées (`AUTH_SESSION_REQUIRED`, `AUTH_ACCOUNT_INACTIVE`, `AUTHZ_ROLE_INSUFFICIENT`, `AUTHZ_PERMISSION_INSUFFICIENT`) sera coordonnée avec Error Handling Phase 9 (voir sa §14.2) | §3.2bis / §10 #9 |
