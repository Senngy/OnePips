# Error Handling Architecture — Audit & Plan

> Créé : 17/08/2026 · Mis à jour : 24/08/2026 · Version : v11 (Phase 7 validée — code `EVENT_NOT_FOUND`)
> Statut global : ✅ Phase 0 complétée · ✅ Phase 1 validée · ✅ Phase 2 validée · ✅ Phase 3 validée · ✅ Phase 4 validée · ✅ Phase 5 validée · ✅ Phase 6 validée · ✅ Phase 7 validée · 📋 Phases 8-9 en attente d'autorisation / de prérequis
> **Document distinct de `RBAC-v3-audit.md`.** Ce document est propriétaire du contrat d'erreur (`ApiErrorResponse`, codes, `requestId`, `api<T>()`) et de son intégration progressive dans les domaines métier. `RBAC-v3-audit.md` reste seul propriétaire d'`AuthGuard`, `RolesGuard`, `PermissionsGuard`, `User.status`, `Session.status`, `lastLoginAt`, permissions, révocation de session. Voir §8bis pour la répartition détaillée et §14 pour les checkpoints de synchronisation.
> **Ce document est la référence unique pour l'implémentation.** Objectif : pouvoir dire à un développeur (humain ou agent) *"Implémente uniquement la Phase 2 de ce document"* et qu'il sache précisément quoi faire, quoi ne pas toucher, et comment valider son travail — sans avoir à refaire l'analyse d'architecture.

---

## CONTEXTE

Problème déclencheur observé :

```
POST /api/leads
→ HTTP 401
→ UI : "errorTurnstile token is required"
```

Le frontend envoie bien `cfTurnstileToken`, mais reçoit un `401` avec un message texte brut. Ce cas est **symptomatique d'un problème architectural plus large** (absence de contrat d'erreur normalisé) — il sera corrigé en Phase 4, après la mise en place du socle.

Un second problème a été identifié pendant l'investigation (`upload.service.ts`) : le contrat de retour du client API n'était pas explicite, ce qui a permis un bug où le code appelant traitait le résultat d'un appel API comme un objet `Response` (`res.json()`, `res.ok`) alors qu'il s'agissait déjà de données parsées. Ce cas confirme la nécessité de figer `api<T>(): Promise<T>` comme contrat explicite (§4, §6 Exemple B).

**Objectif** : une architecture de gestion des erreurs propre, cohérente, extensible, et **testable phase par phase**.
**Principe central** : `code` (stable, machine-readable) ≠ `message` (humain, modifiable).

---

## 1. ARCHITECTURE ACTUELLE (vérifiée Phase 0)

### Backend — cycle de vie d'une erreur

```
Request
   │
   ▼
AuthRateLimitMiddleware  (try/catch → next() silencieux en cas d'erreur interne)
LoggerMiddleware         (log method + url + status + duration — sans requestId)
   │
   ▼
Guard (TurnstileGuard / AuthGuard / RolesGuard / PermissionsGuard)
   │  throw new UnauthorizedException("message texte brut")
   │  throw new ForbiddenException("message texte brut")
   ▼
ValidationPipe (whitelist, transform, forbidNonWhitelisted — sans exceptionFactory)
   │  throw BadRequestException avec message[] natif NestJS
   ▼
Controller → Service
   │  throw new NotFoundException("texte brut")
   │  throw new ConflictException("texte brut")
   │  throw new BadRequestException("texte brut")
   │  throw new Error("texte brut")  ← events.service.ts:103 — Error natif
   ▼
NestJS default exception handler
   │  AUCUN GlobalExceptionFilter custom (confirmé — 0 résultat grep)
   ▼
Réponse HTTP JSON : format NestJS natif brut
```

**Format de sortie actuel :**

```json
{ "statusCode": 401, "message": "Turnstile token is required", "error": "Unauthorized" }
```
```json
{ "statusCode": 400, "message": ["name must be a string", "email must be an email"], "error": "Bad Request" }
```

Pas de `code`. Pas de `requestId`. Pas de `details` structurés. Format incohérent selon le type d'exception.

### Frontend — cycle de vie d'une erreur

```
fetch()
   │
   ▼
api() dans api-client.ts
   │  si !res.ok → throw new ApiError(data?.message, res.status, data)
   ▼
Service layer — passe-plat, aucune transformation
   │
   ▼
Composant / Form
   │  catch (e instanceof ApiError) → e.message affiché directement dans le DOM
   │  catch (autre) → message hardcodé
   ▼
setError(e.message)          → DOM (formulaires publics)
useToast().error({ description: message })  → admin/login
```

**`ApiError` actuelle (`api-client.ts:3-12`) :**
```ts
export class ApiError extends Error {
  status: number;   // code HTTP seulement
  data: unknown;    // corps brut non typé
  // PAS de .code, PAS de .requestId, PAS de .details typés
}
```

**Contrat de retour actuel de `api()` — non explicite.** Rien n'empêche un appelant de traiter le retour comme un `Response`. `upload.service.ts` fait d'ailleurs sa propre gestion `fetch` + `res.ok` + `res.json()` en parallèle, sans passer par `api()` — deux contrats différents coexistent aujourd'hui dans le projet.

### Fichiers audités

| Fichier | Rôle dans la gestion d'erreur |
|---------|-------------------------------|
| `src/main.ts` | `ValidationPipe` (sans `exceptionFactory`) — pas de filtre global |
| `src/common/middleware/logger.middleware.ts` | Log sans requestId |
| `src/common/middleware/auth-rate-limit.middleware.ts` | `try/catch → next()` silencieux |
| `src/common/guards/turnstile.guard.ts` | `UnauthorizedException` pour token absent/invalide |
| `src/modules/auth/guards/auth.guard.ts` | `UnauthorizedException` — **non modifié dans ce chantier** |
| `src/modules/auth/guards/roles.guard.ts` | `ForbiddenException` — **non modifié dans ce chantier** |
| `src/modules/permissions/guards/permissions.guard.ts` | `UnauthorizedException` + `ForbiddenException` — **non modifié dans ce chantier** |
| `src/modules/leads/leads.controller.ts` | `BadRequestException` (bulk delete sans IDs) |
| `src/modules/leads/leads.service.ts` | `NotFoundException` — pas de handler Prisma |
| `src/modules/applications/applications.service.ts` | `NotFoundException` + `ConflictException` |
| `src/modules/events/events.service.ts` | `throw new Error()` natif (→ 500 non maîtrisé) — **non modifié dans ce chantier** |
| `src/modules/payments/stripe.service.ts` | `throw new Error()` natif — **non modifié dans ce chantier** |
| `src/modules/users/users.service.ts` | `NotFoundException` + `BadRequestException` + `ForbiddenException` — **non modifié dans ce chantier** |
| `src/lib/api-client.ts` | `ApiError` avec `status` + `data` brut, `api()` sans type de retour explicite |
| `src/lib/services/upload.service.ts` | Fait son propre `fetch()` en parallèle de `api()` — contrat dupliqué et incohérent |
| `src/components/form/multi-step-form.tsx` | `e.status === 409` (nom à migrer, §4) |
| `src/components/form/quick-apply-form.tsx` | `e.status === 409` (nom à migrer, §4) |
| `src/app/admin/login/page.tsx` | `e.message` dans le toast |

---

## 2. PROBLÈMES IDENTIFIÉS

### P1 — Incohérences de code HTTP critiques (🔴)

| Situation | Code actuel | Code correct | Fichier | Ligne |
|---|---|---|---|---|
| Token Turnstile **absent** | `401` | `400` | `turnstile.guard.ts` | 39 |
| Secret Turnstile non configuré | `401` | `500` | `turnstile.guard.ts` | 28 |
| Vérification Turnstile échouée | `401` | `400` | `turnstile.guard.ts` | 68 |
| `throw new Error()` non-HTTP (événements) | `500` non maîtrisé | variable selon le cas | `events.service.ts` | 103 |
| `throw new Error()` non-HTTP (Stripe) | `500` non maîtrisé | `500` avec message safe | `stripe.service.ts` | 23 |

> C'est ici la cause directe du bug constaté : `UnauthorizedException` pour un token manquant → `401` au lieu de `400`.

### P2 — Pas de code stable machine-readable (🔴)

```ts
// multi-step-form.tsx:176 — dépend du texte exact du backend
if (e instanceof ApiError) {
    setError(e.message);
}
```
Si le message change côté backend, le frontend est cassé silencieusement. Seule exception actuelle : `e.status === 409`, un code HTTP codé en dur — pas un code métier, et `status` est justement le nom à faire disparaître (§4, P11).

### P3 — Aucun GlobalExceptionFilter (🔴)

Confirmé par `grep "APP_FILTER|useGlobalFilters|@Catch|ExceptionFilter"` → **0 résultat**. Le format de réponse varie selon le type d'exception NestJS.

### P4 — Format des erreurs de validation non structuré (🟡)

```json
{ "message": ["email must be an email", "name must be a string"] }
```
Tableau de strings bruts, non structuré par champ.

### P5 — Erreurs Prisma non interceptées (🟡)

`grep "PrismaClientKnownRequestError|P2002|P2025"` → **0 résultat** dans les services. Une erreur Prisma non gérée remonte en `500` avec un message interne potentiellement exposé.

### P6 — `throw new Error()` nu dans les services (🟡)

`events.service.ts:103`, `stripe.service.ts:23` — pas des `HttpException`, transformés en `500` avec message interne exposé si aucun filtre ne les intercepte.

### P7 — `upload.service.ts` : double contrat API incohérent (🔴)

```ts
// État actuel réel : upload.service.ts ne passe PAS par api()
const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `Upload failed (${res.status})`);
}
const data = await res.json();
```

Deux contrats API coexistent dans le projet. **C'est exactement la duplication que `api<T>()` doit éliminer** (§4, §6 Exemple C).

⚠️ **Piège anticipé** : une fois migré, `api<{ url: string }>(...)` retourne **déjà** `{ url: string }`. Appeler `.json()`, `.ok` ou `.status` dessus est une erreur de contrat (§4).

### P8 — Pas de requestId (🟡)

`LoggerMiddleware` logge sans identifiant de corrélation.

### P9 — Logs non structurés en production (⚪)

`console.log` dans `leads.service.ts` (lignes 21, 83, 86, 104), `auth.guard.ts` (lignes 16-20).

### P10 — `ApiError.data: unknown` non typé côté frontend (⚪)

### P11 — Deux conventions concurrentes `status` / `statusCode` (🟡)

`ApiError` actuelle expose `.status`. Le contrat cible renvoie `statusCode`. **Règle : `status` disparaît complètement, remplacé par `statusCode`, sans période de coexistence des deux noms sur la classe.**

### P12 — Risque `FormData` mal géré par `api()` (🟡)

```ts
// api-client.ts:20-22 — force toujours Content-Type: application/json
if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
}
```
Si un jour `api()` reçoit un `body: FormData` sans détection, le `Content-Type: application/json` casse silencieusement l'upload (pas de boundary multipart généré).

---

## 3. ARCHITECTURE CIBLE

### Backend

```
Request
   │
   ▼
RequestIdMiddleware  — génère req.requestId = "req_<uuid>"
                    — pose X-Request-Id dans la réponse
LoggerMiddleware    — enrichi avec requestId
   │
   ▼
Guards → ValidationPipe → Controller → Service
   │  throw HttpException({ code, message, details })  ← code métier porté par l'exception elle-même
   │  throw PrismaError / Error natif → rattrapé par le filtre
   ▼
GlobalExceptionFilter  (@Catch())
   │  si res.headersSent → ne rien faire (Better Auth déjà répondu)
   │  normalise : HttpException, PrismaError, ThrottlerException, Error natif, inconnu
   │  lit exception.getResponse().code si présent, sinon mappe depuis le statusCode HTTP
   │  construit ApiErrorResponse { statusCode, code, message, details, requestId }
   │  log structuré (WARN si 4xx, ERROR si >= 500) — jamais de donnée sensible en clair
   ▼
{ "statusCode": 400, "code": "SECURITY_TURNSTILE_REQUIRED", "message": "...", "requestId": "req_..." }
```

### Frontend

```
Frontend service (ex: upload.service.ts, leads.service.ts)
    │
    ▼
api<T>(endpoint, options)
    │
    ▼
fetch()
    │
    ▼
HTTP response
    │
    ▼
JSON parsing
    │
    ├── success → T                    (données applicatives déjà typées, PAS un Response)
    │
    └── error → throw ApiError         (jamais retourné, toujours levé)
    │
    ▼
component / hook / form
    → if (error.code === "SECURITY_TURNSTILE_REQUIRED") { ... }
    → useToast().error({ description: error.message })
```

**Règle architecturale non négociable :**

> `api()` ne retourne **jamais** l'objet `Response`. Il retourne toujours les données applicatives parsées (`T`) en cas de succès, ou lève `ApiError` en cas d'échec.

---

## 4. CONTRAT D'ERREUR ET CONTRAT API

### 4.1 Backend → Frontend (`ApiErrorResponse`)

```ts
interface ApiErrorResponse {
  statusCode: number;                    // code HTTP réel
  code: string;                          // identifiant stable SCREAMING_SNAKE_CASE
  message: string;                       // message humain, safe à exposer
  details?: Record<string, unknown>;     // données structurées — jamais d'info interne (§8)
  requestId: string;                     // corrélation logs — toujours présent
}
```

### 4.2 Frontend — classe `ApiError`

```ts
class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requestId: string;
  // .message hérité de Error — toujours le message humain
}
```

**Migration `status` → `statusCode` (P11, décision D7) :**

| Avant (à supprimer) | Après (cible unique) |
|---|---|
| `error.status` | `error.statusCode` |
| `error.data` (brut, non typé) | `error.details` (typé, structuré) |

Aucune coexistence des deux noms. Une fois `ApiError` refactorée (Phase 3), `status` n'existe plus du tout sur la classe.

### 4.3 Contrat du client API — `api<T>()`

**Signature figée :**
```ts
async function api<T>(endpoint: string, options?: RequestInit): Promise<T>
```

**Invariants non négociables** (voir implémentation cible en §6 Exemple B) :

1. `api<T>()` retourne toujours `Promise<T>` — jamais `Promise<Response>`.
2. Les erreurs HTTP (`!res.ok`) sont systématiquement transformées en `ApiError` levée (`throw`), jamais retournées comme valeur normale.
3. Un `body` de type `FormData` n'est **jamais** sérialisé en JSON (`JSON.stringify(formData)` interdit).
4. Le header `Content-Type: application/json` n'est ajouté **que** si le `body` n'est **pas** un `FormData`. Le navigateur génère seul le boundary multipart pour un `FormData`.

**Anti-patterns explicitement interdits une fois le contrat en place :**

```ts
const data = await api<{ url: string }>("/upload", { ... });

data.json();    // ❌ incorrect — data est déjà { url: string }, pas un Response
data.ok;        // ❌ incorrect — n'existe pas sur T
data.status;    // ❌ incorrect — n'existe pas sur T, et .status n'existe plus nulle part (P11)
```

Avec un typage correct, ces trois lignes doivent produire une **erreur de compilation TypeScript** — c'est le bénéfice recherché : détecter ce type d'erreur au build plutôt qu'en production (bug constaté sur `upload.service.ts`, §2 P7).

> ⚠️ **Limite assumée** : `api<T>()` garantit un contrat **au moment de la compilation**, pas une validation runtime. Rien ne garantit qu'à l'exécution le serveur renvoie réellement `T`. **Aucune validation runtime (Zod ou équivalent) n'est ajoutée dans ce chantier** — décision D9, §12. Si un besoin de validation runtime apparaît, ce sera un chantier séparé, ciblé sur les endpoints concernés.

### 4.4 Résumé des règles par domaine

| Domaine | Règle |
|---|---|
| `code` | Machine-readable, stable, jamais deviné par le frontend depuis le texte |
| `message` | Humain, safe à afficher tel quel |
| `details` | Structuré, jamais d'info technique interne (§8.1) |
| `requestId` | Toujours présent, sert uniquement à la corrélation logs/support |
| `statusCode` | Remplace totalement `status` — pas de coexistence |
| `FormData` | Jamais sérialisé JSON, jamais de `Content-Type` forcé |
| `api<T>()` | Retourne `T`, jamais `Response` ; lève `ApiError`, ne la retourne jamais |

---

## 5. CONVENTION DES CODES

> Règle : les codes sont ajoutés **au moment où le cas réel existe**, pas à l'avance. Format `DOMAINE_SOUS_CAS` en SCREAMING_SNAKE_CASE. Le code métier est porté par l'exception au moment du `throw` (§6 Exemple E) — le filtre ne le devine jamais depuis le seul type NestJS ; à défaut, il retombe sur un mapping générique par `statusCode` (§9 Phase 2).

| Code | HTTP | Déclencheur | Phase |
|---|---|---|---|
| `VALIDATION_ERROR` | 400 | ValidationPipe (`exceptionFactory`) | 2 |
| `BAD_REQUEST` | 400 | Fallback générique — `HttpException` 400 sans code fourni | 2 |
| `UNAUTHORIZED` | 401 | Fallback générique — `HttpException` 401 sans code fourni (`AuthGuard` non modifié lève 401) | 2 |
| `FORBIDDEN` | 403 | Fallback générique — `HttpException` 403 sans code fourni (`RolesGuard`/`PermissionsGuard` non modifiés lèvent 403) | 2 |
| `NOT_FOUND` | 404 | Fallback générique | 2 |
| `CONFLICT` | 409 | Fallback générique, et `PrismaClientKnownRequestError P2002` | 2 |
| `RATE_LIMIT_EXCEEDED` | 429 | `ThrottlerException` | 2 |
| `INTERNAL_ERROR` | 500 | Toute erreur non catchée, `Error` natif, Prisma non mappée | 2 |
| `UNKNOWN_ERROR` | — | **Frontend-only** — fallback de `api-client.ts` quand le corps d'erreur reçu n'est pas un `ApiErrorResponse` (proxy, gateway, réponse non conforme). Jamais émis par le backend | 5 |
| `SECURITY_TURNSTILE_REQUIRED` | 400 | `TurnstileGuard` — token absent | 4 |
| `SECURITY_TURNSTILE_INVALID` | 400 | `TurnstileGuard` — vérification Cloudflare échouée | 4 |
| `SECURITY_TURNSTILE_MISCONFIGURED` | 500 | `TurnstileGuard` — secret absent | 4 |
| `LEAD_NOT_FOUND` | 404 | `LeadsService.update` / `ApplicationsService.create` — lead inexistant | 6 |
| `APPLICATION_ALREADY_EXISTS` | 409 | `ApplicationsService.create` — candidature déjà soumise pour ce lead | 6 |
| `EVENT_NOT_FOUND` | 404 | `EventsService.register` — aucun événement à venir pour l'inscription | 7 |
| `ADMIN_INVITATION_NOT_FOUND` | 404 | `UsersService.completeInvitation` — token ne correspondant à aucune invitation | Invitation |
| `ADMIN_INVITATION_EXPIRED` | 400 | `UsersService.completeInvitation` — invitation expirée | Invitation |
| `ADMIN_INVITATION_ALREADY_USED` | 400 | `UsersService.completeInvitation` — invitation déjà consommée | Invitation |
| `ADMIN_INVITATION_EMAIL_EXISTS` | 409 | `UsersService.createInvitation` / `completeInvitation` — email déjà utilisé par un compte | Invitation |
| `ADMIN_INVITATION_CREATE_FAILED` | 500 | `UsersService.completeInvitation` — `signUpEmail` n'a pas créé l'utilisateur | Invitation |

> **Note Invitation (24/08)** : les codes `ADMIN_INVITATION_INVALID` et `ADMIN_INVITATION_SEND_FAILED` n'ont **pas** été créés — aucun cas réel distinct (token inconnu = `NOT_FOUND` ; envoi d'email non bloquant donc pas de 500). Le token d'invitation brut n'est jamais exposé dans `message`/`details` ni loggé ; le `requestId` est injecté par le `GlobalExceptionFilter`.

**Distinction `INTERNAL_ERROR` vs `UNKNOWN_ERROR` (figée le 24/08) :**

| Code | Origine | HTTP | Sens |
|---|---|---|---|
| `INTERNAL_ERROR` | **Backend** (`GlobalExceptionFilter`) | 500 | Le serveur a réellement rencontré une erreur interne |
| `UNKNOWN_ERROR` | **Frontend** (`api-client.ts`) | — (fallback local) | Le client a reçu une réponse qu'il ne peut pas interpréter comme `ApiErrorResponse` — problème de contrat, proxy, gateway, réponse non conforme |

> **Règle importante** : `UNKNOWN_ERROR` ne doit **jamais** être utilisé pour remplacer une erreur métier backend connue. C'est uniquement le fallback du `api-client` lorsque le corps reçu ne peut pas être interprété comme `ApiErrorResponse`. Il ne doit pas « mentir » en transformant « je ne comprends pas la réponse » en « le serveur a généré une erreur interne ».

> **Note de périmètre** : les codes fallback (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, etc.) apparaissent dès la Phase 2 **sans modifier** `auth.guard.ts`, `roles.guard.ts` ou `permissions.guard.ts` — le filtre les déduit uniquement du `statusCode` déjà levé par ces guards existants. Ces codes sont volontairement **génériques** : les codes métier précis (ex. `AUTH_SESSION_REQUIRED`, `AUTHZ_PERMISSION_INSUFFICIENT`) seront fournis par les guards eux-mêmes lors de leur migration (Phase 9, coordonnée avec `RBAC-v3-audit.md`).
> Les codes métier de domaine `LEAD_NOT_FOUND` et `APPLICATION_ALREADY_EXISTS` sont créés en Phase 6 (Leads + Applications). Les codes restants (Events, Payments, Booking, Auth/RBAC) seront créés dans leurs phases respectives, uniquement si le cas métier réel existe.

---

## 6. EXEMPLES DE CODE CIBLE (A → F)

> ⚠️ Ces exemples sont des **patterns cibles**, pas du copier-coller garanti. Le détail syntaxique s'adapte à la structure réelle du code au moment de l'implémentation ; le contrat et les invariants, eux, ne se négocient pas.

### Exemple A — `ApiError` (frontend)

```ts
interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
}

class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requestId: string;

  constructor(data: ApiErrorResponse) {
    super(data.message);
    this.name = "ApiError";
    this.statusCode = data.statusCode;
    this.code = data.code;
    this.details = data.details;
    this.requestId = data.requestId;
  }
}
```

### Exemple B — `api<T>()` (squelette, invariants uniquement)

```ts
export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // headers
  // FormData detection
  // fetch
  // response parsing
  // ApiError on !response.ok
  // return parsed T
}
```

**Invariants essentiels que cette fonction doit respecter (rien de plus) :**

- Retourne `Promise<T>` — **jamais** `Promise<Response>`.
- Si `options.body instanceof FormData` → ne pas sérialiser (`JSON.stringify`), ne pas forcer de `Content-Type`.
- Si `options.body` n'est **pas** un `FormData` → `Content-Type: application/json` (comportement actuel conservé pour ce cas).
- Si la réponse HTTP n'est pas `ok` → parser le corps comme `ApiErrorResponse` et lever `new ApiError(...)`.
- Ne rien inventer au-delà de ces cinq points (pas de retry, pas de cache, pas d'intercepteur — voir §10).

### Exemple C — Upload (usage cible de `api<T>()`)

```ts
const formData = new FormData();
formData.append("file", file);

const data = await api<{ url: string }>("/upload", {
  method: "POST",
  body: formData,
});

return data.url;
```

### Exemple D — Gestion d'erreur côté frontend (pattern cible)

```ts
try {
  const data = await api<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
} catch (error) {
  if (error instanceof ApiError) {
    if (error.code === "SECURITY_TURNSTILE_REQUIRED") {
      // UX adaptée : message dédié, pas de redirection d'erreur générique
    }
    // sinon : afficher error.message (déjà humain, safe)
  }
}
```

### Exemple E — Erreur backend structurée (pattern à utiliser en Phase 4)

```ts
throw new BadRequestException({
  code: "SECURITY_TURNSTILE_REQUIRED",
  message: "Le contrôle de sécurité est requis.",
  details: {
    field: "cfTurnstileToken",
  },
});
```

Le `GlobalExceptionFilter` (Phase 2) lit ce corps structuré (`code`, `message`, `details`) et le normalise directement dans le contrat final `ApiErrorResponse`, en y ajoutant `statusCode` (déduit de l'exception) et `requestId` (déduit de la requête). **Aucune transformation supplémentaire du contenu n'est faite** — le filtre fait confiance au développeur qui a posé le `code` explicitement. Le comportement complet du filtre (y compris pour les exceptions qui n'ont *pas* ce corps structuré) est détaillé en §9 Phase 2.

### Exemple F — Sortie cible d'une erreur de validation

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Les données envoyées sont invalides.",
  "details": {
    "fields": {
      "email": ["Adresse email invalide."]
    }
  },
  "requestId": "req_01J5abc123"
}
```

Produit par `exceptionFactory` dans `ValidationPipe` (structure l'erreur par champ à la source) → normalisé par le `GlobalExceptionFilter` (ajoute `requestId`).

---

## 7. REQUEST ID — FLUX COMPLET

> Aucune dépendance externe. Aucune solution de tracing distribué. `node:crypto` natif uniquement.

| Étape | Où | Quoi |
|---|---|---|
| **1. Génération** | `RequestIdMiddleware` (nouveau, Phase 2) | `randomUUID()` de `node:crypto`, formaté `req_<uuid-sans-tirets-tronqué>` |
| **2. Stockage** | Sur la requête | `req.requestId = id` — propriété simple, pas de contexte async ni d'injection DI |
| **3. Lecture par le logger** | `LoggerMiddleware` (modifié, Phase 2) | Lit `req.requestId`, l'inclut dans chaque ligne de log de cette requête |
| **4. Lecture par le filtre** | `GlobalExceptionFilter` (nouveau, Phase 2) | Lit `req.requestId` (avec repli `'req_unknown'` si absent), l'injecte dans `ApiErrorResponse.requestId` |
| **5. Envoi au frontend** | Réponse HTTP | Présent **à la fois** dans le corps JSON (`requestId`) et dans le header `X-Request-Id` |

**Squelette (trivial, natif, pas de sur-ingénierie) :**

```ts
// src/common/middleware/request-id.middleware.ts
import { randomUUID } from 'node:crypto';

export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const id = `req_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
```

> Alternative envisagée et non retenue : `randomUUID()` complet sans troncature. Non bloquant, changeable en une ligne si besoin (décision D1, §12).

---

## 8. SÉCURITÉ ET LOGGING — RÈGLES TRANSVERSALES

> Ces règles s'appliquent à **toutes** les phases. Elles ne sont pas optionnelles.

### 8.1 Ce que `details` (réponse publique) ne doit **jamais** contenir

| Interdit 🚫 | Exemple concret interdit |
|---|---|
| Stack trace | `{ "stack": "at Object.<anonymous>..." }` |
| Exception brute | `{ "error": "PrismaClientKnownRequestError: ..." }` |
| Erreur Prisma brute | Code Prisma détaillé, nom de contrainte, nom de colonne |
| Requête SQL | `{ "query": "SELECT * FROM ..." }` |
| Secret / clé | Toute valeur de `.env` |
| Token | JWT, token Turnstile, token de session |
| Cookie | Valeur de cookie de session |
| Header `Authorization` | Sa valeur, même partielle |
| Donnée sensible inutile | Mot de passe, même hashé |

**Autorisé ✅ :**
```json
{ "field": "cfTurnstileToken" }
{ "fields": { "email": ["Adresse email invalide."] } }
{ "retryAfter": 30 }
```

### 8.2 Ce qui ne doit **jamais** être loggé (même côté backend, en interne)

- Token Turnstile complet
- Cookie de session (valeur)
- Secret applicatif (`.env`)
- Mot de passe (même hashé)
- Header `Authorization` (valeur)
- Toute donnée personnelle sensible non nécessaire au diagnostic

**`requestId` peut et doit être loggé** — c'est son unique rôle (§7).

### 8.3 Distinction des types de logs

| Type | Exemple | Conservé où |
|---|---|---|
| Debug temporaire | `console.log` de développement | À supprimer avant merge — jamais en production |
| Log applicatif | `LoggerMiddleware` : méthode, URL, statusCode, durée, requestId | Toujours actif |
| Log d'erreur | `GlobalExceptionFilter` : exception complète, stack, requestId, contexte | Interne uniquement — niveau `WARN` (4xx) ou `ERROR` (5xx) |

**Exemple concret — erreur 500 :**

*Réponse envoyée au frontend (publique, minimale) :*
```json
{
  "statusCode": 500,
  "code": "INTERNAL_ERROR",
  "message": "Une erreur interne est survenue.",
  "requestId": "req_01J5abc123"
}
```

*Log backend (interne, complet) :*
```
[ERROR] req_01J5abc123 — PrismaClientKnownRequestError: Unique constraint failed on the fields: (`email`)
  at ... (stack complète)
  requestId: req_01J5abc123
```

Le lien entre les deux se fait **uniquement** via `requestId` — jamais en exposant le contenu technique au frontend.

---

## 8bis. COHÉRENCE CROISÉE AVEC `RBAC-v3-audit.md`

> Deux documents distincts, deux propriétaires. Celui-ci ne recopie jamais le détail des décisions RBAC ; il les référence. Audit réalisé le 24/08 par lecture intégrale des deux documents (aucun code source consulté pour cet audit — uniquement les deux `.md`).

### 8bis.1 Répartition de la propriété par sujet

| Sujet | Propriétaire | L'autre document doit... |
|---|---|---|
| `ApiErrorResponse` (contrat, forme) | **Error Handling** (§4.1) | RBAC référence ce contrat quand les guards seront migrés (Phase 9), ne redéfinit jamais sa forme |
| `requestId` (génération, flux) | **Error Handling** (§7) | RBAC référence — implémenté par `RequestIdMiddleware` (Phase 2), couvre déjà le besoin RBAC P0 #9 |
| Codes génériques (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`) | **Error Handling** (§5) | RBAC ne les redéfinit pas ; ils s'appliquent déjà par défaut aux guards RBAC non migrés |
| Codes métier RBAC (`AUTH_SESSION_REQUIRED`, `AUTH_ACCOUNT_INACTIVE`, `AUTHZ_ROLE_INSUFFICIENT`, `AUTHZ_PERMISSION_INSUFFICIENT`) | **RBAC** décide *quand* et avec quelle sémantique ; **Error Handling** définit *le format* d'émission | Les deux documents doivent citer le même nom une fois le code choisi (Phase 9 ↔ RBAC P0 #38) |
| `AuthGuard` / `RolesGuard` / `PermissionsGuard` (comportement, ordre, bypass) | **RBAC** (§3, §3.2bis) | Error Handling ne décrit jamais leur logique interne, seulement leur *sortie* (`ApiErrorResponse`) |
| `User.status` / `Session.status` | **RBAC** (§2.1) | Error Handling n'y touche pas ; référence uniquement pour le futur code `AUTH_ACCOUNT_INACTIVE` |
| `lastLoginAt` | **RBAC** (§7.2, §12) | Aucune dépendance directe avec Error Handling |
| Better Auth (config, architecture) | **RBAC** (§1, §4) | Error Handling référence uniquement le comportement du filtre *autour* des réponses Better Auth (`res.headersSent`, D5) |
| Validation / exceptions HTTP (`ValidationPipe`, `GlobalExceptionFilter`, sémantique des codes HTTP) | **Error Handling** (§3, §5, §9) | RBAC n'a pas de plan de validation propre ; les guards en hériteront lors de leur migration |
| Exposition d'informations sensibles (`details`, logs) | **Error Handling** (§8) pour la règle générale de non-exposition ; **RBAC** (§8.1-8.3) pour l'audit log métier (qui a fait quoi) | Sujets liés mais distincts — RBAC référence §8 pour la règle générale, garde son propre `AdminAuditLog` (traçabilité métier, pas gestion d'erreur) |

### 8bis.2 Dépendances entre les deux chantiers

- **Phase 9 (Error Handling) dépend de RBAC P0 #38** : la migration d'`AuthGuard` vers des exceptions structurées ne peut avoir de sens métier qu'après (ou avec) l'implémentation du contrôle `User.status`. Sans P0 #38, `AuthGuard` continue de lever des `UnauthorizedException` génériques déjà couvertes par le fallback `UNAUTHORIZED` (§5) — rien ne casse, mais aucun code métier n'est disponible.
- **RBAC P0 #38/#39 hérite implicitement du contrat Error Handling** : toute distinction future entre "session absente" et "compte désactivé" devra passer par des exceptions structurées `{ code, message, details }` (§6 Exemple E), pas par un format ad hoc.
- **RBAC P0 #9 (Request ID) est déjà satisfait** par Error Handling Phase 2 — aucune action RBAC requise (mise à jour de statut faite dans ce chantier, voir résumé de sortie).

### 8bis.3 Doublons identifiés et traités

| Doublon | Traitement |
|---|---|
| RBAC P0 #9 « Ajouter Request ID » vs Error Handling §7 (implémenté) | RBAC P0 #9 marqué **fait**, référence ajoutée vers ce document §7 |
| RBAC §8.2 « logs non structurés » vs Error Handling §8.3 (règles de logging) | Pas de doublon de contenu — RBAC référence ce document §8 pour la règle générale ; RBAC garde la responsabilité de l'implémentation dans `AuthGuard`/logs RBAC (P0 #20, non fait) |

### 8bis.4 Incohérence potentielle détectée — décision humaine requise

**Anti-énumération au niveau du `code`, pas seulement du `statusCode`.**
RBAC (§3.2bis) a délibérément choisi `401` pour *session absente* **et** pour *compte `DISABLED`/`SUSPENDED`*, précisément pour ne pas révéler l'état d'un compte à qui possède un cookie volé. Mais si `AuthGuard` (Phase 9 / RBAC P0 #38) émet un `code` différent pour ces deux cas (ex. `AUTH_SESSION_REQUIRED` vs `AUTH_ACCOUNT_INACTIVE`), l'anti-énumération reste vraie au niveau HTTP (`401` dans les deux cas) mais **serait cassée au niveau applicatif** (le corps JSON permettrait de distinguer les deux cas).

→ **Décision à prendre dans `RBAC-v3-audit.md`** (propriétaire du sujet) : soit un `code` unique pour tous les cas d'authentification 401 (ex. `AUTH_SESSION_REQUIRED` sans distinction), soit accepter une distinction visible au niveau `code` (à justifier explicitement si retenu). **Non tranché à ce jour** — noté également dans `RBAC-v3-audit.md` §3.2bis.

### 8bis.5 Règle de non-régression

Aucune modification future de l'un des deux documents ne doit changer un contrat commun (`ApiErrorResponse`, `requestId`, noms de codes déjà utilisés) sans mettre à jour la référence correspondante dans l'autre document. Voir §14 « Checkpoints inter-documents ».

---

## 9. PLAN D'IMPLÉMENTATION

> Périmètre strict : **Phases 1 → 4 uniquement**. STOP après Phase 4. Aucune migration Events / Stripe / Auth / RBAC / Users / Permissions / `lastLoginAt` / Session / `User.status` / Prisma schema / Better Auth. Si une modification hors périmètre semble nécessaire pour faire fonctionner une phase : **arrêter, documenter le blocage ici, ne pas modifier le fichier hors périmètre.**

---

### ✅ PHASE 1 — Contrat

**Objectif** : figer le contrat d'erreur et le contrat `api<T>()` avant tout code. Aucune implémentation.

**Fichiers autorisés à modifier** : ce document uniquement.

**Fichiers interdits** : tous les fichiers source.

**Prérequis** : aucun.

**Changements attendus** : décisions D1-D10 tranchées (§12), contrat `ApiErrorResponse`/`ApiError`/`api<T>()` figé (§4), convention de codes initiale (§5).

**Exemples de code** : n/a (phase de contrat pur).

**Tests attendus** : n/a.

**Critères d'acceptation** :
- [x] Contrat `ApiErrorResponse` figé et sans ambiguïté
- [x] Contrat `ApiError` figé, `status` explicitement remplacé par `statusCode`
- [x] Contrat `api<T>()` figé avec ses 4 invariants (§4.3)
- [x] Règles `details`/logging figées (§8)
- [x] Toutes les décisions D1-D10 tranchées (§12)

**Résultat attendu** : ce document, à jour, sans contradiction interne.

**Point de validation humaine** : ✅ **Validé** — ce document constitue la validation.

**Instructions d'implémentation** : n/a — phase déjà terminée.

---

### ✅ PHASE 2 — Backend core (implémentée et validée le 24/08)

**Objectif** : mettre en place le socle de normalisation des erreurs côté NestJS, sans toucher à aucune logique métier existante.

**Fichiers autorisés à créer** :
- `src/common/middleware/request-id.middleware.ts`
- `src/common/filters/global-exception.filter.ts`

**Fichiers autorisés à modifier** :
- `src/app.module.ts` (brancher `RequestIdMiddleware`)
- `src/common/middleware/logger.middleware.ts` (lire et logger `req.requestId`)
- `src/main.ts` (`app.useGlobalFilters(...)` + `exceptionFactory` dans `ValidationPipe`)

**Fichiers strictement interdits** :
- Tout controller (`*.controller.ts`)
- Tout service métier (`*.service.ts`)
- Tout guard (`turnstile.guard.ts` inclus — il sera modifié en Phase 4, pas ici)
- `schema.prisma`
- `src/modules/auth/auth.ts` (Better Auth)
- Tout fichier frontend

**Prérequis** : Phase 1 validée.

**Changements attendus** :

1. `RequestIdMiddleware` généré et branché globalement (§7).
2. `GlobalExceptionFilter` créé avec le comportement suivant, **catégorie par catégorie** :

| Type d'exception intercepté | statusCode | code | message exposé | details exposables | niveau de log |
|---|---|---|---|---|---|
| `HttpException` avec corps structuré `{ code, message, details }` (ex. §6 Exemple E) | Celui de l'exception | Celui fourni tel quel | Celui fourni tel quel | Ceux fournis (déjà conformes à §8.1 — responsabilité du développeur qui lève l'exception) | `WARN` si < 500, `ERROR` si ≥ 500 |
| `HttpException` sans corps structuré (cas actuel de tous les guards/exceptions existants, non modifiés en Phase 2) | Celui de l'exception | Mapping générique par statusCode (table §5 : `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`) | Message NestJS natif si string, sinon message générique par défaut | Aucun | `WARN` |
| `ThrottlerException` | `429` | `RATE_LIMIT_EXCEEDED` | `"Trop de requêtes. Veuillez réessayer plus tard."` | Aucun (ou `retryAfter` si disponible facilement) | `WARN` |
| `PrismaClientKnownRequestError` code `P2002` (contrainte unique) | `409` | `CONFLICT` | `"Cette ressource existe déjà."` | Aucun détail Prisma | `WARN` |
| `PrismaClientKnownRequestError` code `P2025` (non trouvé) | `404` | `NOT_FOUND` | `"Ressource introuvable."` | Aucun | `WARN` |
| `PrismaClientKnownRequestError` autres codes | `500` | `INTERNAL_ERROR` | `"Une erreur interne est survenue."` | Aucun (le code Prisma et le message technique vont **uniquement** dans le log, §8.3) | `ERROR` |
| `Error` natif (`throw new Error(...)`) | `500` | `INTERNAL_ERROR` | `"Une erreur interne est survenue."` | Aucun (stack complète en log uniquement) | `ERROR` |
| Exception totalement inconnue (ni `Error` ni `HttpException`) | `500` | `INTERNAL_ERROR` | `"Une erreur interne est survenue."` | Aucun | `ERROR` |

3. **Garde Better Auth** : premier geste du filtre, avant tout traitement — si `res.headersSent === true`, ne rien faire et sortir immédiatement (Better Auth a déjà répondu via son proxy `@All('*')`).
4. `ValidationPipe` reçoit un `exceptionFactory` qui structure les erreurs par champ, produisant le format `VALIDATION_ERROR` (§6 Exemple F).

**Exemples de code** : §6 Exemple E (pattern de throw structuré, utilisable dès maintenant par un futur développeur mais **non rétrofité** sur le code existant en Phase 2), §6 Exemple F (sortie validation), §7 (RequestIdMiddleware).

**Tests attendus** :
- `curl -i -X POST http://localhost:3001/api/leads` (sans body valide) → vérifier le format `ApiErrorResponse` avec le code générique approprié
- `curl -i -X POST http://localhost:3001/api/leads -d '{}'` → `VALIDATION_ERROR` structuré par champ dans `details.fields`
- **Better Auth — 4 scénarios obligatoires :**
  - `GET /api/auth/get-session` (avec et sans cookie) → réponse Better Auth strictement intacte, filtre n'intervient pas
  - `POST /api/auth/sign-in/email` avec identifiants valides → login fonctionnel, cookies posés normalement
  - `POST /api/auth/sign-out` → déconnexion fonctionnelle
  - **`POST /api/auth/sign-in/email` avec mot de passe invalide** (scénario d'erreur Better Auth) → vérifier que la réponse d'erreur native de Better Auth n'est pas reformatée par le filtre ; documenter le comportement observé dans ce document si un cas imprévu apparaît (§ Résultat Phase 2, à compléter après implémentation)
- Vérifier qu'aucun controller/service/guard n'a été modifié (`git diff --stat` limité aux fichiers listés ci-dessus)

**Critères d'acceptation** :
- [x] `RequestIdMiddleware` et `GlobalExceptionFilter` créés, rien d'autre créé
- [x] Seuls `app.module.ts`, `logger.middleware.ts`, `main.ts` modifiés
- [x] Les 4 scénarios Better Auth passent sans régression
- [x] `VALIDATION_ERROR` structuré conforme à §6 Exemple F
- [x] Aucune donnée listée en §8.1 n'apparaît dans une réponse `details`
- [x] Aucune donnée listée en §8.2 n'apparaît dans les logs

**Résultat attendu** : toute erreur backend, quel que soit son type d'origine, produit une réponse conforme à `ApiErrorResponse`, sauf les réponses Better Auth qui restent strictement inchangées.

**Résultat Phase 2 (implémentation) — validée le 24/08** :
- Fichiers créés : `request-id.middleware.ts`, `global-exception.filter.ts`.
- Fichiers modifiés : `app.module.ts` (branchement `RequestIdMiddleware` en premier), `logger.middleware.ts` (niveaux de log par tranche + `requestId`), `main.ts` (`useGlobalFilters` + `exceptionFactory`).
- `npm run build` : exit code 0, aucune erreur.
- **Corrections intégrées pendant la validation** :
  1. `LoggerMiddleware` : `>= 500` → `error`, `>= 400` → `warn`, sinon → `log` (conforme D2).
  2. `GENERIC_CODE_BY_STATUS` : mapping volontairement **générique** — `401 → UNAUTHORIZED`, `403 → FORBIDDEN` (au lieu de `AUTH_SESSION_REQUIRED` / `AUTHZ_PERMISSION_INSUFFICIENT`, jugés trop spécifiques pour un fallback). Les codes métier précis seront posés par les guards eux-mêmes lors de leur migration (Phase 9, coordonnée avec RBAC).

**Point de validation humaine** : ✅ **Validé le 24/08** — diff limité aux fichiers listés, build OK, corrections D2 + mapping générique appliquées. En attente d'autorisation pour la Phase 3.

**Instructions d'implémentation pour DeepSeek :**
- Crée exactement les 2 fichiers listés dans "Fichiers autorisés à créer". Rien d'autre.
- Modifie uniquement les 3 fichiers listés dans "Fichiers autorisés à modifier".
- Ne touche à aucun controller, service ou guard existant, y compris `turnstile.guard.ts`.
- Implémente le filtre selon la table de comportement ci-dessus, catégorie par catégorie, sans en inventer de nouvelles.
- La toute première ligne du filtre doit vérifier `res.headersSent` et sortir si vrai.
- N'introduis aucun nouveau code d'erreur métier au-delà de ceux listés en §5 pour la Phase 2.
- Respecte strictement §8 (rien de sensible dans `details` ni dans les logs).
- Exécute les 4 tests Better Auth et documente le résultat avant de considérer la phase terminée.
- Si un cas non prévu dans ce document apparaît (ex. `ThrottlerException` qui ne serait pas catchable comme prévu), arrête-toi et documente le blocage ici plutôt que d'improviser une solution hors périmètre.

---

### ✅ PHASE 3 — Frontend core (implémentée et validée le 24/08)

**Objectif** : aligner `api()` et `ApiError` sur le contrat, et migrer `upload.service.ts` comme premier cas d'usage réel.

**Fichiers autorisés à modifier** :
- `src/lib/api-client.ts`
- `src/lib/services/upload.service.ts`
- ainsi que les autres services si besoin

**Fichiers strictement interdits** :
- Tout composant (`*.tsx`)
- Toute page (`app/**/*.tsx`)
- Tout hook

**Prérequis** : Phase 2 validée et testée.

**Changements attendus** :
1. `ApiError` refactorée selon §6 Exemple A — `.statusCode`, `.code`, `.details`, `.requestId`. **Suppression complète** de `.status` et `.data` (aucune propriété de compatibilité conservée).
2. `api()` refactorée en `api<T>(): Promise<T>` selon les 4 invariants de §4.3 et le squelette §6 Exemple B.
3. `upload.service.ts` migré intégralement vers `api<T>()` selon §6 Exemple C : plus de `fetch()` manuel, plus de `.json()`/`.ok` sur le résultat, plus de `try/catch` local pour les erreurs HTTP (déjà géré par `api()`).

**Exemples de code** : §6 Exemples A, B, C.

**Tests attendus par moi humain** :
- Compilation TypeScript du projet frontend sans erreur nouvelle, **sauf** sur les lignes `e.status` existantes dans `multi-step-form.tsx` / `quick-apply-form.tsx` — ces erreurs de compilation sont **attendues et volontaires** (corrigées en Phase 4, pas ici)
- Test manuel : upload d'un fichier depuis l'admin → `data.url` accessible directement sans erreur runtime
- Test manuel : upload avec un fichier de type MIME refusé → `ApiError` levée avec `statusCode` et `code` corrects, capturable par un `catch`
- Vérifier qu'aucun composant, page, hook ou autre service n'a été modifié

**Critères d'acceptation** :
- [x] `ApiError` ne possède plus `.status` ni `.data` — uniquement `.statusCode`, `.code`, `.details`, `.requestId`, `.message`
- [x] `api<T>()` respecte les 4 invariants de §4.3
- [x] `upload.service.ts` n'utilise plus `fetch()` directement
- [x] Aucun fichier hors périmètre modifié
- [x] Les erreurs de compilation sur `e.status` (fichiers Phase 4) sont identifiées et listées, pas corrigées ici

**Résultat attendu** : le client API frontend respecte le contrat cible ; `upload.service.ts` devient l'exemple de référence pour les futures migrations (hors périmètre de ce chantier).

**Résultat Phase 3 (implémentation) — validée le 24/08** :
- Fichiers modifiés : `src/lib/api-client.ts`, `src/lib/services/upload.service.ts` (aucun fichier créé).
- `ApiError` : `.status`/`.data` supprimés, remplacés par `.statusCode`/`.code`/`.details`/`.requestId` (constructeur prenant `ApiErrorResponse`), `.message` hérité de `Error`.
- `api<T>()` → `Promise<T>` : détection `FormData` (pas de `Content-Type` forcé), parsing JSON, `throw ApiError` sur `!res.ok` (fallback sûr si corps non-JSON), retour de `T` — jamais `Response`.
- `upload.service.ts` : migré vers `api<{ url: string }>("/upload", { body: formData })`, plus de `fetch()` manuel, plus de validation runtime redondante, plus de logs de debug.
- `tsc --noEmit` : 2 erreurs **nouvelles uniquement sur `e.status`** (`multi-step-form.tsx:243`, `quick-apply-form.tsx:102`) — exactement celles attendues et volontaires, corrigées en Phase 4. 7 erreurs préexistantes non liées à ce chantier (inchangées).

**Note de transparence (décision d'implémentation)** : signature écrite `api<T = any>(...)` au lieu de `api<T>(...)` afin de préserver la rétrocompatibilité avec `leads.service.ts` (accès à `res.data`/`res.meta` sur le résultat de `api()`). Sans `= any`, `T` serait inféré `unknown` et casserait ce fichier. Le contrat architectural reste respecté : `api<T>()` retourne `Promise<T>`, jamais `Response`. Alternative (non retenue) : typer `leads.service.ts`, ce qui étendrait le périmètre.

**Point de validation humaine** : ✅ **Validé le 24/08** — typecheck conforme aux attentes, aucun fichier hors périmètre modifié. En attente d'autorisation pour la Phase 4.

**Instructions d'implémentation pour DeepSeek :**
- Modifie uniquement `api-client.ts` et `upload.service.ts` et les autres servics si besoin. Aucun autre fichier.
- Respecte le squelette d'invariants de §6 Exemple B — n'ajoute pas de logique non listée (pas de retry, pas de cache, pas de timeout custom).
- Supprime `.status` et `.data` de `ApiError` sans conserver de propriété de compatibilité.
- Ne corrige pas les usages de `.status` dans les composants — laisse les erreurs de compilation apparaître, elles seront traitées en Phase 4.
- Si `upload.service.ts` révèle un besoin non couvert par ce document (ex. barre de progression, annulation), ne l'implémente pas — documente-le ici comme hors périmètre.
- avec un retour

---

### ✅ PHASE 4 — Turnstile (implémentée et validée le 24/08)

**Objectif** : valider le système end-to-end sur le cas concret ayant déclenché ce chantier, et clore la migration `status` → `statusCode` sur les deux seuls fichiers qui l'utilisaient.

**Fichiers autorisés à modifier** :
- `src/common/guards/turnstile.guard.ts`
- `src/components/form/multi-step-form.tsx`
- `src/components/form/quick-apply-form.tsx`

**Fichiers strictement interdits** :
- `src/modules/applications/applications.service.ts` (introduire `APPLICATION_ALREADY_EXISTS` nécessiterait de le modifier — **hors périmètre**, reporté en Phase 6)
- Tout autre fichier

**Prérequis** : Phase 3 validée.

**Changements attendus** :
1. `turnstile.guard.ts` : les 3 `throw new UnauthorizedException(...)` remplacés par des exceptions structurées selon §6 Exemple E :
   - Token absent → `BadRequestException({ code: "SECURITY_TURNSTILE_REQUIRED", ... })`
   - Vérification Cloudflare échouée → `BadRequestException({ code: "SECURITY_TURNSTILE_INVALID", ... })`
   - Secret non configuré → conserver un statut serveur (`500`) avec `code: "SECURITY_TURNSTILE_MISCONFIGURED"`
2. `multi-step-form.tsx` et `quick-apply-form.tsx` : `e.status === 409` → `e.statusCode === 409` (migration de nom uniquement, P11 — **pas** d'introduction de `APPLICATION_ALREADY_EXISTS`, qui resterait cohérent avec le périmètre strict).
3. Usage de `e.code === "SECURITY_TURNSTILE_REQUIRED"` (§6 Exemple D) là où un message dédié est pertinent.

**Exemples de code** : §6 Exemples D, E.

**Tests attendus** :
- `curl -i -X POST http://localhost:3001/api/leads` sans `cfTurnstileToken` → `400 SECURITY_TURNSTILE_REQUIRED`
- Idem avec un token invalide → `400 SECURITY_TURNSTILE_INVALID`
- Idem avec un token valide (ou bypass dev) → `201`, pas d'erreur
- Sans `TURNSTILE_SECRET_KEY` configuré → `500 SECURITY_TURNSTILE_MISCONFIGURED`
- UI (`multi-step-form.tsx`, `quick-apply-form.tsx`) : soumission sans Turnstile validé → message humain propre affiché, sans dépendre du texte backend
- Compilation TypeScript : les erreurs sur `.status` identifiées en Phase 3 doivent maintenant disparaître

**Critères d'acceptation** :
- [x] Les 3 codes Turnstile (`REQUIRED`, `INVALID`, `MISCONFIGURED`) produits avec les bons `statusCode`
- [x] Plus aucun `UnauthorizedException` dans `turnstile.guard.ts`
- [x] Plus aucune référence à `.status` sur `ApiError` dans tout le projet frontend
- [x] Le bug original (`POST /api/leads` → 401 "Turnstile token is required") est résolu : le comportement observé est maintenant `400 SECURITY_TURNSTILE_REQUIRED`
- [x] `applications.service.ts` non modifié

**Résultat attendu** : le système de gestion d'erreurs fonctionne end-to-end sur un cas réel, de la levée de l'exception jusqu'à l'affichage UI, avec des codes stables et des messages humains découplés.

**Résultat Phase 4 (implémentation) — validée le 24/08** :
- Fichiers modifiés : `src/common/guards/turnstile.guard.ts`, `src/components/form/multi-step-form.tsx`, `src/components/form/quick-apply-form.tsx` (aucun créé).
- `turnstile.guard.ts` : `UnauthorizedException` → `400 SECURITY_TURNSTILE_REQUIRED`, `400 SECURITY_TURNSTILE_INVALID`, `500 SECURITY_TURNSTILE_MISCONFIGURED` (via `InternalServerErrorException`). `try/catch` supprimé (le filtre gère déjà `Error` natif → `500 INTERNAL_ERROR` pour les échecs réseau/parse Cloudflare). `console.log` de debug supprimés (ils loggaient le token Turnstile — violation §8.2).
- `multi-step-form.tsx` / `quick-apply-form.tsx` : `e.status === 409` → `e.statusCode === 409` ; branche dédiée `e.code === "SECURITY_TURNSTILE_REQUIRED" || "SECURITY_TURNSTILE_INVALID"` (message : *« La vérification de sécurité a échoué. Veuillez réessayer de valider le captcha. »*).
- Backend `npm run build` : exit 0. Plus aucune référence `.status` sur `ApiError` dans le frontend.

**Point de validation humaine** : ✅ **Validé le 24/08** — migration `statusCode` terminée, aucun `UnauthorizedException` restant, `applications.service.ts` intact. En attente d'une nouvelle validation de périmètre avant les Phases 5-9.

**⚠️ Écart constaté pendant la phase (à traiter AVANT Phase 5) — `api-client.ts` a été modifié en dehors du plan** :
Après la Phase 3, la signature de `api()` a été passée de `api<T = any>` à `api<T>` (sans défaut), avec ajout d'un garde `isApiErrorResponse()` et d'un fallback `code: "UNKNOWN_ERROR"` (au lieu de `INTERNAL_ERROR`). Conséquence : le typecheck frontend casse dans des fichiers **hors périmètre Phase 4** — `leads.service.ts` (`res` → `unknown`, lignes 90-93), `users/page.tsx` (57), `applications/page.tsx` (44), et dans `multi-step-form.tsx` les usages de `getLeadById`/`createLead` (`lead.name`, `lead.id`). Ces erreurs sont **déjà présentes indépendamment de la Phase 4** et n'ont pas été corrigées ici (périmètre). Ce typage est l'objet de la **Phase 5** (§9).

**Instructions d'implémentation pour DeepSeek :**
- Modifie uniquement les 3 fichiers listés. Ne touche pas à `applications.service.ts` même si cela semblerait "logique" pour un code `APPLICATION_ALREADY_EXISTS` — ce cas est hors périmètre, documente-le comme tel si tu le rencontres.
- Utilise exactement le pattern `throw new BadRequestException({ code, message, details })` de §6 Exemple E.
- Ne modifie pas `AuthGuard`, `RolesGuard`, `PermissionsGuard`, même si `TurnstileGuard` s'en inspire structurellement.
- Après cette phase, **arrête-toi**. Ne commence pas de Phase 5. Documente le résultat des tests dans ce fichier.

---

### 📋 PHASES 5 À 9 — MIGRATION PAR DOMAINE (planifiées, non autorisées)

> **Séquence** : Phase 5 (typage API frontend) → Phase 6 (Leads+Applications) → Phase 7 (Events+Community+Upload) → Phase 8 (Payments+Booking, checkpoint) → Phase 9 (Auth/RBAC, inter-document avec `RBAC-v3-audit.md`).
> **Règle d'exécution** : une phase n'est autorisée qu'après la validation complète de la précédente (voir §14 Checkpoint de validation). Aucun code source ne doit être touché sans autorisation phase par phase.

---

### ✅ PHASE 5 — API typing / contrats frontend (implémentée et validée le 24/08)

**Objectif** : terminer l'adoption de `api<T>()` ; supprimer les retours `unknown` chez les consommateurs identifiés ; typer les services et pages qui utilisent `api()` ; **ne pas restaurer `T = any`**.

**Dépendances** : Phase 3 (contrat `api<T>()` figé). Aucune dépendance RBAC.

**Fichiers concernés** (à confirmer lors de l'implémentation, périmètre indicatif issu de l'audit Phase 4) :
- `src/lib/services/leads.service.ts` — typer `getLeads`, `getLeadById`, `createLead`, `updateLead`, `updateLeadStatus`, `deleteLead`, `deleteBulkLeads`
- `src/app/admin/users/page.tsx` — `api<UserWithPerms[]>`
- `src/app/admin/applications/page.tsx` — `api<ApplicationDto[]>`
- `src/components/form/multi-step-form.tsx` — usages de `getLeadById`/`createLead`
- `src/lib/api-client.ts`

**Fichiers interdits** : tout contrôleur/service backend ; `auth.ts` ; `schema.prisma` ; les guards (AuthGuard/RolesGuard/PermissionsGuard/Turnstile) ; tout autre fichier non listé.

**Prérequis** : Phase 4 validée. Types de retour backend connus (lire les DTO/selects réels des services — ne pas inventer).

**Ce qui est déjà acquis** : `api<T>()` retourne `Promise<T>` ; `ApiError` typée ; `upload.service.ts` déjà migré (Phase 3).

**Changements attendus** :
1. Définir les types de retour réels des endpoints consommés (LeadDto, meta pagination, UserWithPerms, ApplicationDto).
2. Remplacer les appels `api(...)` non typés par `api<Type>(...)`.
3. Réconcilier le fallback `UNKNOWN_ERROR` de `api-client.ts` avec §5 : trancher entre `INTERNAL_ERROR` (conforme §5) et `UNKNOWN_ERROR` documenté frontend-only. **Décision à enregistrer ici.**
4. Aucun changement de comportement runtime — uniquement du typage statique.

**Exemples / patterns** :
```ts
// leads.service.ts
const res = await api<{ data: LeadDto[]; meta: { total: number; page: number; lastPage: number } }>(`/leads${query}`);
const lead = await api<LeadDto>(`/leads/${id}`);
```

**Tests** : `npx tsc --noEmit` frontend → plus d'erreur `unknown` sur les fichiers listés ; aucune erreur nouvelle ailleurs.

**Critères d'acceptation** :
- [x] Plus aucun retour `unknown` chez les consommateurs identifiés
- [x] `T = any` non restauré
- [x] Fallback `UNKNOWN_ERROR` vs `INTERNAL_ERROR` tranché et documenté en §5 (option b — `UNKNOWN_ERROR` conservé frontend-only)
- [x] Aucun fichier hors périmètre modifié

**Résultat Phase 5 (implémentation) — validée le 24/08** :
- Fichiers modifiés : `src/lib/services/leads.service.ts`, `src/lib/services/applications.service.ts`, `src/app/admin/users/page.tsx` (aucun créé).
- `leads.service.ts` : ajout du type `Lead` (champs requis `id`/`name`/`email`/`source`/`status`/`createdAt`/`updatedAt` + `score`/`tags`/`application` optionnels) ; typage de `getLeads` → `api<{ data: Lead[]; meta: { total; page; lastPage } }>`, `getLeadById`/`createLead`/`updateLead`/`updateLeadStatus` → `api<Lead>`, `deleteLead`/`deleteBulkLeads` → `api<{ message: string }>`.
- `applications.service.ts` : `getApplications` → `api<ApplicationDto[]>`, `createApplication`/`updateApplicationStatus` → `api<ApplicationDto>`, `createDirectApplication` → `api<{ lead: Lead; application: ApplicationDto }>`.
- `users/page.tsx` : `api<UserWithPerms[]>`.
- Effet en cascade sans modification : `applications/page.tsx`, `multi-step-form.tsx`, `lead-tab.tsx` compilent désormais (leurs erreurs venaient des retours `unknown` de `api()`).
- `npx tsc --noEmit` : plus aucune erreur `unknown`/`api<T>`. Restent 4 erreurs **préexistantes sans lien** (`new-result-modal.tsx`, `date-picker.tsx` ×2, `turnstile.tsx`) — inchangées avant/après.
- Décision figée : `UNKNOWN_ERROR` = code frontend-only (fallback `api-client.ts`), distinct de `INTERNAL_ERROR` (backend 500). Voir §5. Aucune modification de `api-client.ts` nécessaire (il utilise déjà `UNKNOWN_ERROR`).

**Checkpoint de validation** : voir §14 (bloc standard).

**Instructions d'implémentation pour DeepSeek** : typer uniquement les fichiers listés ; lire les vrais retours backend avant de typer ; ne pas restaurer `any` ; ne pas toucher au backend ni aux guards ; appliquer le checkpoint §14 avant de considérer la phase terminée.

---

### ✅ PHASE 6 — Leads + Applications (implémentée et validée le 24/08)

**Objectif** : migrer les erreurs métier vers les codes structurés, en exploitant le contrat Error Handling en place. Codes attendus : `LEAD_NOT_FOUND`, `APPLICATION_ALREADY_EXISTS` (uniquement si le cas métier existe réellement).

**Dépendances** : Phase 5 (typage fait). Aucune dépendance RBAC.

**Fichiers concernés** :
- `src/modules/leads/leads.service.ts` — `NotFoundException` → `{ code: 'LEAD_NOT_FOUND', ... }`
- `src/modules/applications/applications.service.ts` — `ConflictException` → `{ code: 'APPLICATION_ALREADY_EXISTS', ... }`, `NotFoundException` → code adapté

**Fichiers interdits** : tout guard ; `users.service.ts` ; `auth.ts` ; `schema.prisma` ; contrôleurs (sauf si le code actuel y lève déjà des exceptions à structurer — à confirmer).

**Prérequis** : Phase 5 validée. Lecture réelle des `throw` existants dans ces deux services.

**Ce qui est déjà acquis** : `GlobalExceptionFilter` (Phase 2) normalise déjà les `HttpException` structurées ; pattern §6 Exemple E ; le frontend lit déjà `e.code`.

**Changements attendus** :
1. Recenser les `throw` existants (NotFound/Conflict/Error natif) dans `leads.service.ts` et `applications.service.ts`.
2. Structurer ceux qui correspondent à un cas métier réel : `{ code, message, details }`.
3. Supprimer les `console.log` de debug de `leads.service.ts` (§8.3, P9).
4. Enregistrer les nouveaux codes dans la table §5.

**Exemples / patterns** : §6 Exemple E ; §8bis/Notes existantes.

**Tests** :
- `curl` : lead inexistant → `404 LEAD_NOT_FOUND` ; application déjà soumise → `409 APPLICATION_ALREADY_EXISTS`
- Backend `npm run build` : exit 0
- Aucune régression sur les routes existantes

**Critères d'acceptation** :
- [x] `LEAD_NOT_FOUND` et `APPLICATION_ALREADY_EXISTS` produits avec les bons `statusCode`
- [x] Aucun nouveau code créé sans cas métier réel
- [x] `console.log` de debug retirés de `leads.service.ts`
- [x] §5 mis à jour avec les codes ajoutés
- [x] Aucun fichier hors périmètre modifié

**Résultat Phase 6 (implémentation) — validée le 24/08** :
- Fichiers modifiés : `src/modules/leads/leads.service.ts`, `src/modules/applications/applications.service.ts` (backend), + §5 du présent document.
- `leads.service.ts` : suppression des 4 `console.log` de debug (P9/§8.3) ; `NotFoundException("Lead with ID ... not found")` → `NotFoundException({ code: 'LEAD_NOT_FOUND', message: 'Le lead est introuvable.', details: { id } })`.
- `applications.service.ts` : `NotFoundException` (lead inexistant) → `LEAD_NOT_FOUND` (`details: { id: dto.leadId }`) ; `ConflictException("Cette candidature a déjà été soumise...")` → `{ code: 'APPLICATION_ALREADY_EXISTS', message: '...' }`.
- Non touchés (périmètre respecté) : `leads.controller.ts` (`BadRequestException('At least one ID is required')` — validation générique, couverte par le fallback `BAD_REQUEST`), `updateStatus`/`delete` (Prisma P2025 → fallback générique `NOT_FOUND`), guards, `users.service.ts`, `auth.ts`, `schema.prisma`.
- `npm run build` : exit 0.

**Checkpoint de validation** : §14.

**Instructions d'implémentation pour DeepSeek** : ne pas créer de codes « au cas où » ; ne structurer que les `throw` qui ont un cas réel ; utiliser §6 Exemple E ; ne pas toucher aux guards ni à `users.service.ts`.

---

### ✅ PHASE 7 — Events + Community + Upload (implémentée et validée le 24/08)

**Objectif** : migrer **uniquement ce qui reste réellement à migrer** côté Error Handling ; supprimer les `throw new Error()` métier/techniques lorsqu'ils doivent devenir structurés ;

Backend :
- utiliser HttpException structurée { code, message, details }
- laisser le GlobalExceptionFilter produire ApiErrorResponse

Frontend :
- les appels api() reçoivent ApiError automatiquement

**Dépendances** : Phase 6.

**Fichiers concernés** :
- `src/modules/events/events.service.ts` — remplacer `throw new Error(...)` par une `HttpException` structurée si cas métier réel (sinon laisser le filtre mapper en 500)
- `src/modules/community/` — à auditer pour vérifier ce qui est déjà conforme
- `src/lib/services/community.service.ts` / `events.service.ts` (frontend) — aligner si nécessaire

**Fichiers interdits** : tout guard ; `users.service.ts` ; `payments` ; `booking`.

**Prérequis** : Phase 6 validée. Audit réel des `throw` et des flux.

**Ce qui est déjà acquis (ne pas refaire)** :
- **Upload** : ✅ déjà fonctionnellement testé et migré — authentification ✅, permissions ✅, multipart ✅, upload ✅, réponse URL ✅ (`api<{ url: string }>()`, Phase 3). Rien à refaire côté Error Handling.
- **Community** : à vérifier — si certains flux sont déjà conformes (GET publics, POST/PATCH/DELETE protégés), ne pas les re-migrer.

**Changements attendus** :
1. Auditer chaque `throw` réel ; ne structurer que les cas métier existants.
2. `events.service.ts:103` `throw new Error('No upcoming event found for registration')` → cas métier (404) → structurer.
3. Ne pas inventer de codes pour Community si aucun cas d'erreur métier précis n'existe.

**Tests** : ciblés sur les flux modifiés ; build backend ; pas de régression.

**Critères d'acceptation** :
- [x] `throw new Error()` métier restants → structurés là où un cas réel existe
- [x] Aucun flux déjà conforme re-migré (Upload notamment)
- [x] §5 mis à jour si nouveaux codes
- [x] Aucun fichier hors périmètre modifié

**Résultat Phase 7 (implémentation) — validée le 24/08** :
- Fichier modifié : `src/modules/events/events.service.ts` + §5 du présent document (aucun créé).
- `events.service.ts` : `throw new Error('No upcoming event found for registration')` → `NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Aucun événement à venir disponible.' })` (404).
- **Community** : audité — `community.service.ts` ne contient aucun `throw` ni `console.log` (CRUD Prisma pur, erreurs couvertes par le fallback générique du filtre). Déjà conforme → rien migré.
- **Upload** : déjà validé/migré (Phase 3) → non retouché.
- **Frontend `events.service.ts` / `community.service.ts`** : utilisent déjà `api()` qui lève `ApiError` automatiquement → conformes côté Error Handling, aucun alignement requis.
- `npm run build` : exit 0.
- Restes hors périmètre documentés : `app.module.ts` (validation d'env au démarrage) et `stripe.service.ts:23` (Phase 8 Payments).

**Checkpoint de validation** : §14.

**Instructions d'implémentation pour DeepSeek** : auditer avant de migrer ; documenter explicitement ce qui est « déjà acquis » (Upload) et ne pas y retoucher ; ne structurer que les cas réels.

---

### ⬜ PHASE 8 — Payments + Booking : checkpoint DESIGN/REVIEW/VALIDATION

**Objectif** : ces services ne sont **pas encore implémentés**. Ne pas forcer un design avant leur existence. Fonctionner comme un **checkpoint architectural** : vérifier l'architecture réelle une fois qu'elle existera, puis seulement préparer la migration Error Handling.

**Dépendances** : aucune phase Error Handling ne dépend de Payments/Booking pour avancer ; cette phase est un gate amont.

**Contenu du checkpoint (à exécuter quand Payments/Booking seront réels)** :
1. Vérifier l'architecture réelle de Payments (Stripe) et Booking (Cal.com ou autre).
2. Identifier les flux externes : Stripe, webhooks, appels asynchrones.
3. Identifier : statuts métier, erreurs externes, idempotence, webhooks, erreurs réseau, validation, conflits.
4. Vérifier comment ces flux s'intègrent au contrat `ApiErrorResponse`.
5. Définir les codes d'erreur métier **seulement après** connaissance du domaine réel.

**Important** : Cette phase devient active uniquement lorsque Payments et Booking existent réellement.
Elle constitue un gate de conception et de validation, et non une phase d'implémentation immédiate.

Elle ne bloque pas les autres chantiers tant que ses prérequis ne sont pas satisfaits.

**Fichiers concernés** : aucun pour l'instant (documentation only).

**Checkpoint de validation** : §14 (revue de conception, pas de build).

---

### ⬜ PHASE 9 — Auth / RBAC + Frontend erreur partagée (inter-document avec `RBAC-v3-audit.md`)

> Restructurée en deux volets indépendants, validables séparément : **9.A Backend** (alignement des guards RBAC sur le contrat) et **9.B Frontend** (helper d'erreur partagé `getUserFacingError`).

#### 9.A — Backend : aligner les guards RBAC sur le contrat `ApiErrorResponse`

**Objectif** : aligner les guards RBAC sur le contrat `ApiErrorResponse` **sans recréer le plan RBAC**. Ce document définit uniquement *comment* les guards émettent leurs erreurs ; `RBAC-v3-audit.md` reste propriétaire de leur comportement. Error-Handling-Architecture.md est propriétaire du format et du transport des erreurs. RBAC-v3-audit.md est propriétaire de la sémantique et des conditions déclenchant les erreurs RBAC.

Exemple :

- `Error Handling
AUTHZ_ROLE_INSUFFICIENT
→ format = 403 + code + message + requestId`

RBAC
→ détermine quand ce code doit être émis

Ainsi aucun des deux documents ne peut devenir accidentellement propriétaire du mauvais sujet.

**Dépendances** : RBAC P0 #38 (contrôle `User.status` dans `AuthGuard`) et P0 #39 (révocation). Voir §8bis.2.

**Ce document (Error Handling) définit** :
- les codes attendus côté sortie des guards, une fois décidés dans `RBAC-v3-audit.md` : `AUTH_SESSION_REQUIRED`, `AUTH_ACCOUNT_INACTIVE`, `AUTHZ_ROLE_INSUFFICIENT`, `AUTHZ_PERMISSION_INSUFFICIENT`
- le format d'émission : `{ code, message, details }` via §6 Exemple E
- la règle §8.1 (pas d'info sensible dans `details`)

**Ce document NE définit PAS** (propriété `RBAC-v3-audit.md`) :
- la logique interne des guards, l'ordre d'exécution, le bypass SUPER_ADMIN
- `User.status` / `Session.status` / `lastLoginAt` / révocation / permissions
- le choix final des noms de codes métier (mais les deux documents doivent citer le même nom)

**Références croisées obligatoires** :
- Si `RBAC-v3-audit.md` décide officiellement un code (ex. `AUTH_SESSION_REQUIRED`), ce document l'enregistre en §5 sans le redéfinir.
- Si `RBAC-v3-audit.md` tranche la question de l'anti-énumération (§8bis.4), mettre à jour §8bis.4 et §5 en conséquence.
- Checkpoint inter-document : voir §14.

**Tests** : définis côté RBAC (voir `RBAC-v3-audit.md`) ; ce document valide seulement la conformité du format `ApiErrorResponse`.

**Critères d'acceptation** :
- [ ] Codes alignés entre les deux documents (même nom, même sémantique)
- [ ] Anti-énumération (§8bis.4) tranchée dans `RBAC-v3-audit.md` et reflétée ici
- [ ] Aucun doublon de définition entre les deux documents
- [ ] `details` conformes §8.1

**Checkpoint de validation** : §14 + checkpoint inter-document (§14.2).

**Instructions d'implémentation pour DeepSeek** : lire d'abord `RBAC-v3-audit.md` pour les décisions propriétaires ; ne pas réinventer les codes ; coordonner toute modification avec l'autre document.

#### 9.B — Frontend : helper d'erreur partagé `getUserFacingError`

**Objectif** : déplacer `getUserFacingError` (aujourd'hui dans `src/lib/services/users.service.ts`) vers un module partagé `src/lib/errors.ts`, pour le rendre réutilisable par tous les domaines (leads, events, community, users) sans dépendance croisée vers `users.service.ts`.

**Contexte** : introduit lors du checkpoint RBAC frontend (Étape 6 « Robustesse », principes 8 & 11), ce helper mappe `ApiError` → message humain : `FORBIDDEN` / `AUTHZ_PERMISSION_INSUFFICIENT` → « Vous n'avez pas les droits… », codes invitation → messages dédiés, fallback générique avec `requestId`. Il est actuellement importé depuis `users.service.ts` par des composants hors domaine users (live modals, `lead-tab`, `form-testimony`, `community/page`, `events/page`) — dépendance croisée à corriger.

**Fichiers concernés** :
- Créer : `src/lib/errors.ts` (export `getUserFacingError`, logique inchangée).
- Modifier : `src/lib/services/users.service.ts` (retirer l'export local ; les consommateurs utilisent `@/lib/errors`).
- Mettre à jour les imports : `users/page.tsx`, `invite-admin-modal.tsx`, `lead-tab.tsx`, `form-testimony.tsx`, `community/page.tsx`, `events/page.tsx`, `new-live-modal.tsx`, `update-live-modal.tsx`.

**Fichiers interdits** : backend ; aucun changement de logique métier ni de nom de code.

**Changements attendus** :
1. Extraire `getUserFacingError` vers `src/lib/errors.ts` (même comportement, aucun message modifié).
2. Remplacer les imports de ce helper par `@/lib/errors` dans les fichiers listés.
3. Pur déplacement — aucun changement de comportement runtime.

**Critères d'acceptation** :
- [ ] `getUserFacingError` importé depuis `src/lib/errors.ts` partout
- [ ] Plus aucun import de ce helper depuis `users.service.ts`
- [ ] Messages identiques avant/après (aucune régression)
- [ ] `npx tsc --noEmit` et eslint propres sur les fichiers touchés

**Checkpoint de validation** : §14.1 (typecheck frontend).

---

### Notes de retour d'expérience (héritées des Phases 1-4 — conservées pour les phases futures)

1. **`api<T>()` sans défaut = typage requis** : déjà traité par la Phase 5.
2. **Fallback `UNKNOWN_ERROR`** : à trancher en Phase 5.
3. **Pattern codes métier** : §6 Exemple E.
4. **`try/catch` inutile pour les erreurs techniques** : le filtre mappe déjà `Error` natif → `500 INTERNAL_ERROR`.
5. **`console.log` de debug à retirer** : `leads.service.ts` (Phase 6), `auth.guard.ts` (hors périmètre Error Handling — RBAC).
6. **`X-Request-Id` exploitable** : déjà posé par `RequestIdMiddleware` (Phase 2).

---



## 10. CE QU'IL NE FAUT PAS AJOUTER (anti-sur-ingénierie)

Explicitement exclu de ce chantier, quelle que soit la phase :

- Axios ou toute autre librairie de client HTTP
- Une nouvelle librairie de gestion d'erreurs
- Zod (ou équivalent) en validation globale de toutes les réponses API
- Retry automatique sur échec réseau
- Refresh token automatique
- Architecture d'intercepteurs complexe (type Axios interceptors)
- Event bus / pub-sub pour la propagation d'erreurs
- Tracing distribué (OpenTelemetry, etc.)
- Système de logging externe (Sentry, Datadog, etc.)
- Plus de 12 codes d'erreur prédéfinis à l'avance (§5) — les codes se créent au fur et à mesure des cas réels

Si un besoin de cette nature apparaît pendant l'implémentation, il doit être **documenté comme hors périmètre**, pas résolu dans ce chantier.

---

## 11. FICHIERS MODIFIÉS PAR PHASE (récapitulatif)

| Phase | Nouveaux fichiers | Modifiés | Garantis intacts |
|-------|-------------------|----------|-----------------|
| **2 — Backend core** | `request-id.middleware.ts`<br>`global-exception.filter.ts` | `app.module.ts`<br>`logger.middleware.ts`<br>`main.ts` | Tous les controllers, services, guards<br>`schema.prisma`<br>`auth.ts` (Better Auth) |
| **3 — Frontend core** | — | `api-client.ts`<br>`upload.service.ts` | Tous les composants, pages, hooks<br>Tous les autres services |
| **4 — Turnstile** | — | `turnstile.guard.ts`<br>`multi-step-form.tsx`<br>`quick-apply-form.tsx` | Tout le reste, y compris `applications.service.ts` |
| **5-9 — planifiées** | ∅ (non autorisées) | détaillées en §9 (fichiers indicatifs par phase) | Tout — aucune modification autorisée sans validation |

**Total périmètre validé (Phases 1-4) : 2 fichiers créés, 8 fichiers modifiés.** Les Phases 5-9 sont planifiées mais non autorisées ; leur périmètre fichier est indicatif et sera confirmé au lancement de chaque phase.

---

## 12. DÉCISIONS

> D1-D10 : tranchées et figées (implémentation Phases 1-4). D11 tranchée en Phase 5.

| # | Décision | Choix retenu |
|---|----------|--------------|
| D1 | Format `requestId` | `req_<uuid-sans-tirets-tronqué>` via `node:crypto` |
| D2 | Log des erreurs `< 500` | `WARN` pour 4xx, `ERROR` pour 5xx |
| D3 | Message `500` côté frontend | Fixe : `"Une erreur interne est survenue."` — jamais le message technique |
| D4 | Structuration validation errors | `exceptionFactory` dans `ValidationPipe` |
| D5 | `/api/auth/*` et le filtre | `res.headersSent` check en tout premier ; testé sur 4 scénarios explicites (§9 Phase 2) |
| D6 | `useToast` admin | Affiche `message` (humain) |
| D7 | `status` vs `statusCode` | `statusCode` uniquement, suppression complète de `status`, aucune coexistence |
| D8 | Contrat `api<T>()` | `Promise<T>`, jamais `Response`, lève toujours `ApiError` en cas d'échec |
| D9 | Validation runtime des réponses API | Aucune (pas de Zod) dans ce chantier |
| D10 | `FormData` dans `api()` | Détection automatique, pas de `Content-Type` forcé si `body instanceof FormData` |
| D11 | `INTERNAL_ERROR` vs `UNKNOWN_ERROR` | `INTERNAL_ERROR` = backend (500, erreur interne réelle) ; `UNKNOWN_ERROR` = frontend-only (fallback `api-client.ts` quand le corps n'est pas `ApiErrorResponse`). Jamais émis par l'API ; ne remplace jamais une erreur métier connue (§5) |

**Phases 1-7 : implémentées et validées. Phases 8-9 : planifiées, non autorisées — validation humaine requise entre chaque phase (voir §14).**

---

## 13. LÉGENDE

| Symbole | Signification |
|---------|---------------|
| 🔴 | Problème critique |
| 🟡 | Problème important |
| ⚪ | Problème mineur |
| ✅ | Fait / Validé |
| ⬜ | À faire |
| ⛔ | Explicitement hors périmètre |
| 📋 | Planifié / en attente d'autorisation |
| ❓ | À vérifier |

---

## 14. CHECKPOINTS DE VALIDATION

### 14.1 Bloc standard de validation (à appliquer à chaque phase 5-9)

```
### Checkpoint de validation
- [ ] Build backend (npm run build)
- [ ] Typecheck frontend (npx tsc --noEmit)
- [ ] Tests HTTP / fonctionnels ciblés (curl / manuel)
- [ ] Tests de non-régression (routes existantes, flux Better Auth)
- [ ] Vérification du périmètre (git diff limité aux fichiers autorisés)
- [ ] Vérification des logs (pas de donnée sensible §8.2)
- [ ] Vérification sécurité (details conformes §8.1)
- [ ] Mise à jour de §5 (codes) et §9 (résultat de phase)
- [ ] Validation humaine explicite
- [ ] Phase suivante autorisée uniquement après validation
```

> Une phase non validée ne doit **jamais** être considérée comme une dépendance satisfaite par une phase ultérieure. La validation humaine est bloquante.

### 14.2 Checkpoints inter-documents (Error Handling ↔ RBAC)

> Ces vérifications doivent être faites conjointement à chaque phase ayant une dépendance croisée (essentiellement Phase 9 ↔ RBAC P0 #38/#39).

**Avant Phase 9 (Error Handling) :**
- [ ] Phase RBAC correspondante prête ou clairement ordonnancée
- [ ] Codes communs alignés (`AUTH_SESSION_REQUIRED`, `AUTH_ACCOUNT_INACTIVE`, `AUTHZ_ROLE_INSUFFICIENT`, `AUTHZ_PERMISSION_INSUFFICIENT`) — même nom, même sémantique dans les deux documents
- [ ] HTTP statuses alignés (401/403 — voir §8bis.4)
- [ ] `requestId` cohérent (déjà fourni par Phase 2 — vérifier que RBAC ne le redéfinit pas)
- [ ] `ApiErrorResponse` cohérent (RBAC référence §4.1, ne redéfinit pas la forme)
- [ ] Tests RBAC prévus dans `RBAC-v3-audit.md`

**Avant clôture d'une phase RBAC qui utilise Error Handling :**
- [ ] Contrat Error Handling inchangé ou correctement référencé
- [ ] Nouveaux codes enregistrés dans le bon document (définition propriétaire + référence croisée)
- [ ] Aucun doublon de définition
- [ ] Aucun code contradictoire entre les deux documents

### 14.3 Règle de synchronisation documentaire

Quand une décision touche les deux chantiers :
1. Identifier le document propriétaire (voir §8bis.1).
2. Mettre à jour le propriétaire.
3. Mettre à jour l'autre document **uniquement** pour référence / dépendance / contrainte / impact.
4. Vérifier les références croisées.
5. Vérifier qu'aucune ancienne version de la décision ne subsiste.

Objectif : éviter deux définitions concurrentes d'un même contrat (ex. `AUTH_ACCOUNT_INACTIVE = 401` dans un document et `= 403` dans l'autre).
