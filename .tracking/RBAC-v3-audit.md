# RBAC v3 — Audit & Suivi

> Dernière mise à jour : 30/07/2026 (v3 — corrections stratégiques)
> Statut global : ⚠️ En cours (Phases 1-8 terminées)

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

### Implications Schéma (à décider)

- `User.status` : `ACTIVE | DISABLED | LOCKED` (blocage pour Disable)
- `User.deletedAt` / `User.anonymizedAt` : horodatage des opérations
- `Booking.customerId`, `Payment.customerId` : actuellement `onDelete` non défini (restrict par défaut) → un `Delete` physique d'un `Customer` peut échouer ou casser. Décision requise.
- Le `Delete` physique d'un `User` Better Auth doit passer par Better Auth (sinon reprise de la règle §1).

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

| Politique | Statut | Détail |
|-----------|--------|--------|
| Helmet (paquet) | 🔴 Non installé | Aucun header sécurité |
| **CSP** (Content-Security-Policy) | 🔴 Absent | Aucune restriction de sources (script/style/img) |
| **Clickjacking** (`X-Frame-Options` / CSP frame-ancestors) | 🔴 Absent | Le site peut être embeddé dans un iframe hostile |
| **HSTS** (`Strict-Transport-Security`) | 🔴 Absent | Pas de force HTTPS navigateur (uniquement en prod HTTPS) |
| **Referrer Policy** | 🔴 Absent | L'URL peut fuiter vers des tiers |
| **Permissions Policy** | 🔴 Absent | Camera, géoloc, micro, etc. non restreintes |
| X-Content-Type-Options, X-DNS-Prefetch-Control, etc. | 🔴 Absents | Défauts Helmet |
| `Cache-Control` sur les réponses dynamiques | ❌ Non défini | Risque de cache de données admin sur les GET protégés |

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
| Secrets | ⚠️ `.env` local | Vérifier que `.env` n'est pas commité + rotation des secrets Stripe/BetterAuth |

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
| 1 | Appliquer la migration DB `rbac_v3` | Prisma | ⬜ |
| 2 | Installer Helmet + configurer **toute la suite** : CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy, nosniff | Sécurité | ⬜ |
| 3 | CSRF : vérifier ce que Better Auth fournit, sinon implémenter | Sécurité | ⬜ |
| 4 | **Audit log admin** (modèle `AdminAuditLog` + écriture sur role/permissions change) | Observabilité | ⬜ |
| 5 | Rate limiting auth → Redis (pas in-memory) | Sécurité | ⬜ |
| 6 | Corriger `GET /uploads/:filename` (path traversal) | Sécurité | ⬜ |
| 7 | Désactiver/restreindre le signup public OU restreindre par domaine | Sécurité | ⬜ |
| 8 | Déplacer `lastLoginAt` au login + refresh de session (plus de write à chaque requête) | Perf | ⬜ |
| 9 | Ajouter Request ID / Correlation ID (middleware + réponse) | Observabilité | ⬜ |

### P1 — Important

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 10 | Décider du cycle de vie : `User.status`, `deletedAt`, `anonymizedAt` + modèles GDPR | Prisma | ⬜ |
| 11 | Création admin par **invitation** (`AdminInvitation` + flux Better Auth natif, PAS `prisma.user.create`) | Backend | ⬜ |
| 12 | `POST /users` (SUPER_ADMIN) + DTO `CreateUserDto` (email, name, role) | Backend | ⬜ |
| 13 | UI frontend "Créer un administrateur" + "Désactiver" | Frontend | ⬜ |
| 14 | DTO sur `payments.controller` (`@Body() any` → DTO) | Backend | ⬜ |
| 15 | N+1 `findAllWithPermissions()` → requête groupée | Perf | ⬜ |
| 16 | Cache `getEffectivePermissions` **local + invalidation immédiate** sur override (pas de TTL fixe) | Perf | ⬜ |
| 17 | Pagination + tri sur `GET /users` | Perf | ⬜ |
| 18 | Configurer Better Auth : session `expiresIn`, rotation, rememberMe, cookies Secure/HttpOnly/SameSite | Sécurité | ⬜ |
| 19 | Vérifier session fixation / rotation par test | Sécurité | ⬜ |
| 20 | Logs structurés (JSON) + intégrer `console.log` AuthGuard | Observabilité | ⬜ |

### P2 — Secondaire (qualité + dette)

| # | Tâche | Catégorie | Statut |
|---|-------|-----------|--------|
| 21 | Supprimer OU utiliser `ADMINS_MANAGE` + `ROLES_MANAGE` (mortes) | Dette | ⬜ |
| 22 | Index manquants : `User.role`, `User.status`, `Session.userId`, `Session.expiresAt`, FK (`EXPLAIN ANALYZE` d'abord) | Perf | ⬜ |
| 23 | Transaction dans `updatePermissions()` (`$transaction`) | Perf | ⬜ |
| 24 | Compression HTTP + `Cache-Control` sur GET publics | Perf | ⬜ |
| 25 | Confirmation UI (role/permissions reset) + remplacer `alert()` | UX | ⬜ |
| 26 | Recherche/filtre par email/nom/rôle (page Users) | UX | ⬜ |
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

---

## 11. LÉGENDE

| Symbole | Signification |
|---------|---------------|
| ✅ | Fait / Validé |
| ⚠️ | Partiel / À améliorer |
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
