# Error Handling Architecture — Audit & Plan

> Créé : 17/08/2026 · Mis à jour : 24/08/2026 · Version : v5 (Phase 2 implémentée et validée — mapping générique corrigé `UNAUTHORIZED`/`FORBIDDEN`)
> Statut global : ✅ Phase 0 complétée · ✅ Phase 1 validée (contrat figé) · ✅ Phase 2 implémentée et validée · ⬜ Phase 3 en attente d'autorisation
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
| `SECURITY_TURNSTILE_REQUIRED` | 400 | `TurnstileGuard` — token absent | 4 |
| `SECURITY_TURNSTILE_INVALID` | 400 | `TurnstileGuard` — vérification Cloudflare échouée | 4 |
| `SECURITY_TURNSTILE_MISCONFIGURED` | 500 | `TurnstileGuard` — secret absent | 4 |

> **Note de périmètre** : les codes fallback (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, etc.) apparaissent dès la Phase 2 **sans modifier** `auth.guard.ts`, `roles.guard.ts` ou `permissions.guard.ts` — le filtre les déduit uniquement du `statusCode` déjà levé par ces guards existants. Ces codes sont volontairement **génériques** : les codes métier précis (ex. `AUTH_SESSION_REQUIRED`, `AUTHZ_PERMISSION_INSUFFICIENT`) seront fournis par les guards eux-mêmes lors de leur migration (Phase 5+, hors périmètre).
> Les codes métier de domaine (`LEAD_NOT_FOUND`, `APPLICATION_ALREADY_EXISTS`, etc.) ne sont **pas** créés dans ce chantier — ils appartiennent à la Phase 5+ (hors périmètre, §11).

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
  2. `GENERIC_CODE_BY_STATUS` : mapping volontairement **générique** — `401 → UNAUTHORIZED`, `403 → FORBIDDEN` (au lieu de `AUTH_SESSION_REQUIRED` / `AUTHZ_PERMISSION_INSUFFICIENT`, jugés trop spécifiques pour un fallback). Les codes métier précis seront posés par les guards eux-mêmes lors de leur migration (Phase 5+, hors périmètre).

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

### ⬜ PHASE 3 — Frontend core

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
- [ ] `ApiError` ne possède plus `.status` ni `.data` — uniquement `.statusCode`, `.code`, `.details`, `.requestId`, `.message`
- [ ] `api<T>()` respecte les 4 invariants de §4.3
- [ ] `upload.service.ts` n'utilise plus `fetch()` directement
- [ ] Aucun fichier hors périmètre modifié
- [ ] Les erreurs de compilation sur `e.status` (fichiers Phase 4) sont identifiées et listées, pas corrigées ici

**Résultat attendu** : le client API frontend respecte le contrat cible ; `upload.service.ts` devient l'exemple de référence pour les futures migrations (hors périmètre de ce chantier).

**Point de validation humaine** : test manuel de l'upload en conditions réelles (succès + échec) avant de passer à la Phase 4.

**Instructions d'implémentation pour DeepSeek :**
- Modifie uniquement `api-client.ts` et `upload.service.ts` et les autres servics si besoin. Aucun autre fichier.
- Respecte le squelette d'invariants de §6 Exemple B — n'ajoute pas de logique non listée (pas de retry, pas de cache, pas de timeout custom).
- Supprime `.status` et `.data` de `ApiError` sans conserver de propriété de compatibilité.
- Ne corrige pas les usages de `.status` dans les composants — laisse les erreurs de compilation apparaître, elles seront traitées en Phase 4.
- Si `upload.service.ts` révèle un besoin non couvert par ce document (ex. barre de progression, annulation), ne l'implémente pas — documente-le ici comme hors périmètre.
- avec un retour

---

### ⬜ PHASE 4 — Turnstile (premier cas réel)

**Objectif** : valider le système end-to-end sur le cas concret ayant déclenché ce chantier, et clore la migration `status` → `statusCode` sur les deux seuls fichiers qui l'utilisaient.

**Fichiers autorisés à modifier** :
- `src/common/guards/turnstile.guard.ts`
- `src/components/form/multi-step-form.tsx`
- `src/components/form/quick-apply-form.tsx`

**Fichiers strictement interdits** :
- `src/modules/applications/applications.service.ts` (introduire `APPLICATION_ALREADY_EXISTS` nécessiterait de le modifier — **hors périmètre**, reporté en Phase 5+)
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
- [ ] Les 3 codes Turnstile (`REQUIRED`, `INVALID`, `MISCONFIGURED`) produits avec les bons `statusCode`
- [ ] Plus aucun `UnauthorizedException` dans `turnstile.guard.ts`
- [ ] Plus aucune référence à `.status` sur `ApiError` dans tout le projet frontend
- [ ] Le bug original (`POST /api/leads` → 401 "Turnstile token is required") est résolu : le comportement observé est maintenant `400 SECURITY_TURNSTILE_REQUIRED`
- [ ] `applications.service.ts` non modifié

**Résultat attendu** : le système de gestion d'erreurs fonctionne end-to-end sur un cas réel, de la levée de l'exception jusqu'à l'affichage UI, avec des codes stables et des messages humains découplés.

**Point de validation humaine** : test manuel complet du formulaire de lead (les 4 scénarios ci-dessus) en environnement de dev avant tout arrêt ou poursuite vers une Phase 5 (qui nécessiterait une nouvelle validation de périmètre, non couverte par ce document).

**Instructions d'implémentation pour DeepSeek :**
- Modifie uniquement les 3 fichiers listés. Ne touche pas à `applications.service.ts` même si cela semblerait "logique" pour un code `APPLICATION_ALREADY_EXISTS` — ce cas est hors périmètre, documente-le comme tel si tu le rencontres.
- Utilise exactement le pattern `throw new BadRequestException({ code, message, details })` de §6 Exemple E.
- Ne modifie pas `AuthGuard`, `RolesGuard`, `PermissionsGuard`, même si `TurnstileGuard` s'en inspire structurellement.
- Après cette phase, **arrête-toi**. Ne commence pas de Phase 5. Documente le résultat des tests dans ce fichier.

---

### ⛔ PHASE 5+ — HORS PÉRIMÈTRE DE CE CHANTIER

| Domaine | Raison |
|---------|--------|
| `events.service.ts` (`throw new Error()`) | Hors périmètre — après validation Phase 4 |
| `stripe.service.ts` | Hors périmètre |
| `auth.guard.ts`, `roles.guard.ts`, `permissions.guard.ts` | Hors périmètre — RBAC séparé (`RBAC-v3-audit.md`) |
| `users.service.ts` | Hors périmètre |
| `lastLoginAt` | Hors périmètre — chantier RBAC distinct |
| `User.status`, `Session.status` | Hors périmètre — chantier RBAC distinct |
| `LEAD_NOT_FOUND`, `APPLICATION_ALREADY_EXISTS` | Nécessitent `leads.service.ts` / `applications.service.ts` — hors périmètre |
| Prisma schema | Aucune modification dans ce chantier |
| Better Auth (architecture, plugins, config) | Aucune modification — seul le comportement du filtre **autour** de ses réponses est concerné (D5) |
| Validation runtime (Zod) | Hors périmètre — décision D9 |
| Toute librairie tierce nouvelle | Voir §10 |

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
| **5+** | ∅ | ∅ | Tout — aucune modification autorisée |

**Total périmètre validé : 2 fichiers créés, 8 fichiers modifiés.**

---

## 12. DÉCISIONS — TOUTES TRANCHÉES

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

**Aucune décision en attente. Implémentation autorisée pour les Phases 2 à 4, dans l'ordre, avec validation humaine entre chaque phase.**

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
| ❓ | À vérifier |
