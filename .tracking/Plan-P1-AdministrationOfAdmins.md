# Plan P1 — Administration des Admins (suivi clôturé - plan P1 terminé ✅ Validée (27/08))

> Créé : 26/08/2026 · Version : v3 (aligné sur les nouveaux items P1 14-22 + checkpoint frontend)
> Source : `.tracking/RBAC-v3-audit.md` §10, section « P1 — Important » (items 10 à 22)
> Périmètre : ce document **planifie et suit** l'accomplissement des tâches P1. Il ne remplace pas `RBAC-v3-audit.md` (document propriétaire du RBAC) ; il le référence.

---

## 1. OBJECTIF

Mener à terme l'ensemble des tâches « P1 — Important » du RBAC, en tenant compte de l'avancement réel déjà produit (invitation admin, email, UI). Les tâches encore ouvertes sont planifiées en phases ordonnées ; les tâches optionnelles/reportées sont placées en fin de plan.

---

## 2. SYNTHÈSE DE L'ÉTAT

| # RBAC | Tâche | Catégorie | Statut dans ce plan | Phase |
|---|---|---|---|---|
| 10 | Cycle de vie `User.status` (décision) | Prisma | ✅ Décidé | Réalisé |
| 11 | Création admin par invitation | Backend | ✅ Fait | Réalisé |
| 12 | `POST /users` + `CreateUserDto` | Backend | ✅ Superseded par #11 | Réalisé |
| 13 | UI « Créer un administrateur » + « Désactiver » | Frontend | ✅ Fait (création) — désactivation en attente P0 | Réalisé |
| 14 | Exposer les `effectivePermissions` du user courant | RBAC / Backend + Frontend | ✅ Validée | Réalisé |
| 15 | `usePermissions()` (état centralisé + refresh/invalidation) | RBAC / Frontend | ✅ Validée | Réalisé |
| 16 | Dépendances entre permissions (`WRITE→READ`, `DELETE→READ`) | RBAC | ✅ Validée | Réalisé |
| 17 | Better Auth : session `expiresIn`, rotation, rememberMe, cookies | Sécurité | ⬜ | Phase B |
| 18 | Vérifier session fixation / rotation par test | Sécurité | ⬜ | Phase B |
| 19 | Logs structurés (JSON) + intégrer `console.log` AuthGuard | Observabilité | ⬜ | Phase C |
| 20 | N+1 `findAllWithPermissions()` → requête groupée | Perf | ⏸ Reporté (optionnel) | Phase D (fin) |
| 21 | Pagination + tri sur `GET /users` | Perf | ⏸ Reporté (optionnel) | Phase D (fin) |
| 22 | DTO sur `payments.controller` | Backend | ⏸ Reporté | Phase D (dernière) |

---

## 3. RÉALISÉ (items 10 à 13)

### 10 — Cycle de vie `User.status` : décidé ✅
- Décision actée : `User.status` à **3 états** `ACTIVE / SUSPENDED / DISABLED` (réutilise l'enum existant `UserStatus`, pas de nouveau type).
- `SUSPENDED` ≠ deuxième `DISABLED` (sécurité temporaire vs décision administrative).
- **Hors périmètre P1** : l'implémentation (`User.status`, contrôle dans `AuthGuard`, révocation `revokeSessions`) relève du **P0 #36-39**, toujours ouvert.
- **Restent ouverts (à décider plus tard, GDPR)** : `deletedAt`, `anonymizedAt` + modèles GDPR (voir §9).

### 11 — Création admin par invitation ✅
Flux implémenté (Better Auth natif, pas de `prisma.user.create` avec mot de passe) :
- Modèle `AdminInvitation` (`email`, `role`, `tokenHash` unique, `expiresAt`, `consumedAt`) + migration `add_admin_invitation`.
- `POST /users/invitations` (SUPER_ADMIN) → crée l'invitation (rôle **imposé `ADMIN`** par le backend), envoie l'email d'invitation (lien + token).
- `POST /users/invitations/:token/complete` (public) → `auth.api.signUpEmail` (l'ADMIN définit son mot de passe), pose `role` + `emailVerified=true`, marque l'invitation consommée.
- Envoi email via `EmailService` (nodemailer → **Mailpit** en dev) ; `emailVerification.sendVerificationEmail` + `sendResetPassword` câblés dans `auth.ts`.
- Codes d'erreur structurés : `ADMIN_INVITATION_NOT_FOUND` / `EXPIRED` / `ALREADY_USED` / `EMAIL_EXISTS` / `CREATE_FAILED` (convention Error Handling V1).

### 12 — `POST /users` + `CreateUserDto` : superseded ✅
- Remplacé par le flux d'invitation (#11) : plus de création avec mot de passe fantôme.
- DTO devenus : `CreateInvitationDto { email }` et `CompleteInvitationDto { password, name }`. Le rôle n'est **jamais** choisi par le client.

### 13 — UI « Créer un administrateur » + « Désactiver » : validé ✅
- **Créer** ✅ : `InviteAdminModal` (email seul, sans rôle) + page `/admin/invitation?token=…` (nom + mot de passe + confirmation).
- **Désactiver** ⏳ : bouton « Désactiver » présent mais **désactivé** (placeholder) — dépend de `User.status` (P0 #36-39, non implémenté). À activer quand P0 sera fait.

---

## 4. PHASE A — RBAC Frontend (items 14, 15, 16)

**Objectif** : rendre les `effectivePermissions` réelles disponibles côté frontend, puis les exploiter de façon cohérente (sidebar, garde d'accès, actions). Le backend reste l'autorité.

### 14 — Exposer les `effectivePermissions` du user courant ✅ Validée
- [x] Fournir les permissions effectives du user **courant** (pas seulement `role`) : endpoint backend sécurisé `GET /users/me/permissions`.
- [x] La source inclut `ROLE_PERMISSIONS` (héritage du rôle) **+** les overrides `UserPermission` (granted/denied) — calculés par `PermissionsService`.
- **Périmètre de l'endpoint** : `GET /users/me/permissions` retourne **uniquement** les permissions de l'utilisateur **authentifié** — **pas** `GET /users/permissions` (qui retourne aujourd'hui toute l'équipe et exige `USERS_MANAGE`).
  ```json
  { "permissions": ["LEADS_READ", "LEADS_WRITE", "EVENTS_READ"] }
  ```
  Éventuellement enrichi plus tard : `{ "role": "ADMIN", "permissions": [...] }`.
- **Validée le 26/08** : `effectivePermissions` exposées pour l'utilisateur courant via `GET /users/me/permissions`, calculées par `PermissionsService` à partir du rôle et des overrides. Tests SUPER_ADMIN/ADMIN effectués.
- **Note** : c'est la condition sine qua non pour un vrai `usePermissions()` — sans elle, le frontend ne peut pas simuler correctement les permissions (risque d'incohérence override).

### 15 — `usePermissions()` basé sur les permissions réelles ✅ Validée
- [x] Hook `usePermissions()` consommant les `effectivePermissions` (#14) : expose `permissions`, `loading`, `hasPermission(p)`, `hasAllPermissions(perms)`, `refresh()`.
- [x] État **centralisé** (cache React Query partagé, clé `["my-effective-permissions"]`) + mécanisme de **refresh/invalidation** (`refresh()` + `invalidateMyPermissions()`, branché sur `changeRole` / `togglePermission` / `resetPermissions`).
- **Note** : ne jamais reconstruire un mapping `rôle → permissions` côté front (déjà écarté — le backend est l'autorité).
- **Validée le 26/08** : `usePermissions()` implémenté (`src/lib/hooks/permissions/usePermissions.ts`) ; invalidation intégrée dans `useUsers`.

### 16 — Dépendances entre permissions ✅ Validée
- [x] Définir les dépendances : `WRITE → READ`, `DELETE → READ` pour les familles CRUD.
- [x] Aucune cascade universelle pour les permissions non-CRUD (ex. `SETTINGS_MANAGE`).
- [x] **Distinguer UI et backend — ne jamais détruire silencieusement les overrides** :
  - **UI** : si `READ` est retiré, `WRITE`/`DELETE` deviennent **indisponibles** (grisés/masqués), sans effacement.
  - **Backend** : refuse une configuration incohérente (`WRITE`/`DELETE` sans `READ`).
  - **Exemple** : `ADMIN` avec `READ` hérité + `WRITE`/`DELETE` en override explicite `true`. Le SUPER_ADMIN retire `READ` → afficher `READ ❌`, `WRITE ⚠️ impossible sans READ`, `DELETE ⚠️ impossible sans READ`, **sans effacer les deux overrides en DB** (évite de perdre la configuration admin sans confirmation).
- **Validée le 26/08** : panneau de permissions (`permissions-panel.tsx`) — WRITE/DELETE désactivées si READ absente (⚠️ « impossible sans READ »), overrides préservés, non-CRUD sans cascade ; recharge silencieuse après toggle (`refreshUsers`) pour débloquer/rebloquer sans F5 ; gestion de `PERMISSION_DEPENDENCY_VIOLATION`.

---

## 5. CHECKPOINT — RBAC Frontend (implémentation)

### Architecture cible

```
Login / bootstrap app
        ↓
/api/users/me/permissions
        ↓
React Query cache
        ↓
usePermissions()
        ↓
┌──────────────────────────────┐
│ Sidebar                      │
│ Route guards                 │
│ Boutons / actions            │
└──────────────────────────────┘
```

### Flux d'une page (ex. Leads)

```
permission connue ?
   │
   ├── non → état "permissions en cours de chargement"
   │
   └── oui
        │
        ├── LEADS_READ absent → AccessDenied, PAS de GET /leads
        │
        └── LEADS_READ présent → fetch /leads
```

> **Le point fondamental** : le fetch métier ne doit démarrer qu'après la décision d'autorisation.

### Principes (Checkpoint RBAC Frontend — implémentation) ✅ Validée (26/08)
> Objectif : utiliser les `effectivePermissions` réelles pour éviter les appels API métier inutiles et offrir une UX fluide. Le backend reste l'autorité finale.

1. Utiliser uniquement `usePermissions()` + React Query comme source frontend. Aucun mapping `ROLE_PERMISSIONS` côté front.
2. Charger `/users/me/permissions` une seule fois via le cache React Query, partagé entre Sidebar, pages et actions.
3. Le shell admin (Sidebar/Navbar) peut s'afficher immédiatement ; le **contenu dépendant des permissions** reste en état de chargement jusqu'à résolution de `usePermissions()`. Éviter tout flash de menus/pages non autorisés, sans bloquer inutilement toute l'interface admin.
4. Sidebar : afficher un item uniquement si la permission `READ` correspondante est présente.
5. Accès direct à une page : vérifier `READ` avant de monter le contenu métier. Permission absente → `AccessDenied`, sans afficher la page cassée.
6. Ne jamais lancer le fetch métier si la permission `READ` est absente. Avec React Query, utiliser `enabled: !permissionsLoading && hasPermission(...)`.
7. Actions : `WRITE`, `DELETE`, etc. contrôlent leurs boutons/actions indépendamment de `READ`. Permission absente → action masquée ou désactivée selon la convention définie.
8. Ne pas perdre les données utilisateur en cas de 403. Une erreur de mutation doit conserver l'état du formulaire.
9. Gérer loading et double-submit : boutons désactivés pendant les mutations, état visuel cohérent.
10. Si `/me/permissions` échoue, fail closed : ne pas afficher les actions/pages protégées ni supposer que l'utilisateur possède les permissions.
11. Le backend reste le dernier filet de sécurité : si une permission devient obsolète entre le chargement frontend et l'action, le 403 backend doit être traité proprement par toast/erreur sans faux succès ni état incohérent.

### Découpage en 6 étapes d'implémentation

- **Étape 1 — Socle : source frontend unique + cache partagé** (principes 1, 2, 10)
  - [x] `usePermissions()` + React Query comme unique source ; aucun mapping `ROLE_PERMISSIONS`.
  - [x] `/users/me/permissions` chargé une seule fois, cache partagé.
  - [x] Fail closed si `/me/permissions` échoue.

- **Étape 2 — Layout : shell affiché, contenu permission-dépendant en attente** (principe 3)
  - [x] Le shell admin (Sidebar/Navbar) s'affiche ; le contenu dépendant des permissions reste en état de chargement jusqu'à résolution de `usePermissions()` (pas de blocage global inutile).
  - [x] Principe conservé : **permissions inconnues → aucune décision d'autorisation → aucun contenu métier protégé → aucun fetch métier**.

- **Étape 3 — Sidebar** (principe 4)
  - [x] Afficher un item uniquement si la permission `READ` correspondante est présente (Sidebar + MobileNav).

- **Étape 4 — Gardes de pages + fetch conditionnel** (principes 5, 6)
  - [x] Vérifier `READ` avant de monter le contenu métier ; absent → `AccessDenied`.
  - [x] `enabled: !permissionsLoading && hasPermission(...)` sur le fetch métier.

- **Étape 5 — Actions** (principes 7, 9)
  - [x] `WRITE`/`DELETE` contrôlent les boutons/actions, indépendamment de `READ`.
  - [x] Loading + anti-double-submit sur les mutations.

- **Étape 6 — Robustesse** (principes 8, 11)
  - [x] Conserver l'état des formulaires en cas de 403.
  - [x] Traiter le 403 backend proprement (toast/erreur), sans faux succès ni état incohérent.

---

## 6. PHASE B — Sécurité Better Auth (items 17, 18)

**Objectif** : durcir la gestion de session Better Auth.

### 17 — Configurer Better Auth (session) ✅ Validée (27/08)
- [x] **Étape 1 — Vérification de la documentation Better Auth** (version installée) par l'implémenteur : les notions `expiresIn`, `freshAge`, renouvellement et `rememberMe` ont des rôles distincts — **ne pas figer la formulation** avant vérification.
- [x] `session.expiresIn` : définir une durée explicite (ex. 7 jours).
- [x] Rotation de session : vérifier le mécanisme réel (`freshAge` ou équivalent) dans la version installée avant de le configurer.
- [x] `rememberMe` : configurer la durée étendue (ex. 30 jours).
- [x] Cookies : vérifier/forcer `Secure`, `HttpOnly`, `SameSite` (selon `useSecureCookies` et l'environnement). Solution : sera appliqué automatiquement par Better Auth en dectant ".env NODE_ENV=production"
- **Fichier concerné** : `onepips-backend/src/modules/auth/auth.ts`.
- **Note** : ne pas activer `requireEmailVerification` globalement (le signup public reste inchangé — décision déjà prise).

### 18 — Vérifier session fixation / rotation (test) ✅ Validée (27/08)
- [x] Tester 2 logins consécutifs → vérifier qu'une nouvelle session/token est émise (rotation, pas de fixation).
- [x] Tester `rememberMe` on/off → durées de session différentes.
- [x] Tester l'expiration de session (après `expiresIn`).
- [x] Vérifier les attributs de cookie (`HttpOnly`, `Secure`, `SameSite`) dans la réponse.
- **Critère** : documenter le comportement observé ici (résultat des tests).

---

## 7. PHASE C — Observabilité (item 19)

### 19 — Logs structurés (JSON) + intégrer `console.log` AuthGuard ✅ Validée (27/08)
- [x] Remplacer les `console.log` d'`AuthGuard` par le `Logger` Nest (structuré).
- [x] Adopter un format JSON pour les logs (via `Logger` + éventuellement un formatter). Decision : pour l'instant on active pas le json, ConsoleLogger est installé si besoin
- [x] Corréler avec `requestId` (déjà présent via `RequestIdMiddleware`).
- **Fichiers concernés** : `onepips-backend/src/modules/auth/guards/auth.guard.ts`, `logger.middleware.ts`.
- **Note** : ne jamais logger de donnée sensible (token, mot de passe, cookie, header Authorization).

---

## 8. PHASE D — Reporté (items 20, 21) dans les améliorations possible RBAC P3

### 20 — N+1 `findAllWithPermissions()` (reporté P3, optionnel)
- Optimisation en requête groupée (`groupBy`/`in`) **reportée en fin de plan** — non bloquante tant que la liste d'utilisateurs reste petite.
- À réévaluer avec la pagination (#21).

### 21 — Pagination + tri sur `GET /users` (reporté P3 , optionnel)
- Ajouter `page`/`limit` + tri sur `GET /users` — **optionnel, reporté en fin de plan**.
- Le frontend `UsersStats`/liste devra consommer cette pagination (à coordonner).

### 22 — DTO sur `payments.controller` (reporté, dernière phase à validé après implémentation Payments)
- `@Body() any` → DTO dédié, **à faire quand Payments sera réellement implémenté** (voir Error Handling Phase 8).
- Dépendance : le service Payments n'existe pas encore.

---

## 9. DÉPENDANCES & BLOCAGES

| Blocage | Impact | À traiter dans |
|---|---|---|
| `User.status` non implémenté (P0 #36-39) | bloque le bouton « Désactiver » (#13) et la révocation | RBAC P0 (hors ce plan) |
| `deletedAt` / `anonymizedAt` non décidés (GDPR) | reste ouvert de #10 | Décision GDPR ultérieure |
| `effectivePermissions` indisponibles côté frontend | tant que #14 n'est pas fait, le frontend se limite à la gestion **réactive** du 403 | #14 (ce plan) |
| Payments non implémenté | reporte #22 | Error Handling Phase 8 |

---

## 10. SUIVI / VALIDATION

Chaque phase (A, B, C) doit être validée séparément avant de passer à la suivante. Checklist type :
- [ ] Implémentation (backend et/ou frontend)
- [ ] Build / typecheck
- [ ] Tests ciblés
- [ ] Validation humaine

**Ordre proposé** : Phase A (RBAC frontend) → Checkpoint (§5) → Phase B (sécurité session) → Phase C (logs) → Phase D (reporté).

---

## 11. LÉGENDE

| Symbole | Signification |
|---|---|
| ✅ | Fait / Décidé |
| ⬜ | À faire |
| ⏸ | Reporté |
