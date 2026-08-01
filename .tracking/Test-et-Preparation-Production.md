# OnePips — Tests & Préparation Production

> Dernière mise à jour : 30/07/2026
> Statut global : 📝 Document stratégique (aucune implémentation)
> Lié à : `.tracking/RBAC-v3-audit.md`

> Objectif : passer d'un « projet qui fonctionne » à un « produit exploitable en production ».
> Avant les nouvelles fonctionnalités, la priorité est : **tests, sauvegardes, secrets**.

---

## 1. STRATÉGIE DE TESTS

### 1.1 Pourquoi / Que veut-on garantir ?

Le problème n'est pas « faire des tests » mais « qu'est-ce qu'on veut garantir ».

Chaque couche peut casser :

```
Frontend
   ↓
API Nest
   ↓
AuthGuard
   ↓
PermissionsGuard
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

Les tests servent à **détecter OÙ** ça casse.

### 1.2 La pyramide

```
               E2E          ← lent, teste tout, localisation imprécise
         Intégration        ← moyen, teste plusieurs couches
         Unitaires          ← rapide, teste UNE classe, localisation précise
```

| Niveau | Vitesse | Périmètre | Diagnostic |
|--------|---------|-----------|------------|
| Unitaire | secondes | 1 classe | précis (la classe fautive) |
| Intégration | minutes | Service + Prisma + BDD | moyen (l'ORM, la DB) |
| E2E | dizaines de minutes | Flux HTTP complet | global (tout, du cookie au retour) |

---

### 1.3 Tests unitaires — UNE classe

Exemple : `PermissionsService.hasPermissions()`.

On veut vérifier **l'algorithme**, pas Prisma, pas PostgreSQL, pas Nest.

```
ADMIN   → READ_USERS   → true
VIEWER  → READ_USERS   → false
EDITOR  → WRITE_EVENTS → true
```

Exemple de suite :

```ts
describe("Role permissions", () => {
  it("SUPER_ADMIN possède toutes les permissions");
  it("VIEWER ne possède aucune permission d'écriture");
  it("EDITOR peut modifier un Event");
  it("CUSTOMER ne peut pas lire les leads");
  // ~150 tests, exécutés en quelques secondes
});
```

**Pourquoi c'est vital** : tu modifies `role-permissions.ts`, tu retires par erreur `PAYMENTS_READ` → les tests explosent immédiatement, en local/CI, **jamais en prod**.

---

### 1.4 Tests d'intégration — plusieurs couches

`UsersService` + `PermissionsService` + Prisma + PostgreSQL réels.

On vérifie que ça marche **réellement en base** :

```
updatePermissions(user, FILES_UPLOAD, granted=true)
        ↓
lecture BDD
        ↓
UserPermission (créée) ✓
```

**Pourquoi** : une logique peut être correcte mais l'ORM faux.
Exemple : `updateMany` au lieu de `upsert` → le test unitaire passe, le test d'intégration échoue.

---

### 1.5 Tests E2E — ce que fera ton frontend

Flux HTTP complet, cookies compris :

```
POST /login → cookie → GET /users → 200
```

| Scénario | Login | Route | Attendu |
|----------|-------|-------|---------|
| SUPER_ADMIN | OK | `GET /users` | **200** |
| VIEWER | OK | `GET /users` | **403** |
| Non connecté | — | `GET /users` | **401** |
| Session expirée | — | `GET /users` | **401** |

Ça vérifie : Frontend → HTTP → Guards → Controller → Service → BDD → Retour. **Tout.**

---

### 1.6 Tests RBAC — le RBAC est un produit à part

Matrice **Tous les rôles × Toutes les permissions** :

```
SUPER_ADMIN  → LEADS_READ     → OK
SUPER_ADMIN  → PAYMENTS_WRITE → OK
EDITOR       → PAYMENTS_WRITE → 403
VIEWER       → FILES_UPLOAD   → 403
```

**Génération automatique** : on peut générer ces tests à partir de la matrice `ROLE_PERMISSIONS` + `@Permissions()` de chaque route. Tout oubli de permission = test qui échoue.

---

### 1.7 Tests des Guards — le guard décide 401 ou 200

Testé seul, sans le reste :

| Scénario | Attendu |
|----------|---------|
| Cookie valide | `AuthGuard → true` |
| Cookie expiré | **401** |
| Cookie supprimé | **401** |
| User supprimé (en BDD) | **401** |
| Session expirée | **401** |

`PermissionsGuard` : overrides accordés/refusés, bypass SUPER_ADMIN, ordre des guards.

---

### 1.8 Tests Better Auth — TON intégration, pas la librairie

On ne teste pas Better Auth, on teste que **sa config** dans OnePips fait ce qu'on attend :

| Scénario | Attendu |
|----------|---------|
| Signup | Utilisateur créé |
| Login | Cookie créée |
| Logout | Cookie supprimée |
| Session expirée | 401 sur route protégée |
| Mot de passe faux | 401 |

---

### 1.9 Tests des permissions effectives — le cœur du RBAC

`Role` + `Overrides` → `Permissions effectives` :

| Rôle | Permission de base | Override | Effectif attendu |
|------|--------------------|----------|------------------|
| EDITOR | FILES_UPLOAD → false | grant true | **true** |
| ADMIN | PAYMENTS_READ → true | deny false | **false** |
| SUPER_ADMIN | tout → true | deny false | **true** (bypass) |

C'est exactement la logique de `getEffectivePermissions()` — la plus critique du système.

---

### 1.10 Tests des invitations — le futur onboarding

Le flux invitation va devenir un gros morceau :

```
SUPER_ADMIN → Invite → email → token → création compte → login
```

| Scénario | Attendu |
|----------|---------|
| Token expiré | **400** |
| Token déjà utilisé | **409** |
| Token modifié/trafiqué | **403** |
| Token valide | Création user + rôle + permissions + login OK |

Sinon l'onboarding peut casser **sans qu'on s'en rende compte**.

---

### 1.11 Stack & outils recommandés

| Type | Outil | Où ça tourne |
|------|-------|--------------|
| Unitaires | Vitest (ou Jest) | Local + CI, à chaque commit |
| Intégration | Vitest + Prisma sur PostgreSQL dédiée (Testcontainers) | CI |
| E2E | Supertest / Testcontainers | CI |
| RBAC matrix | Généré depuis `ROLE_PERMISSIONS` + routes | CI |

**Principe** : rapide → à chaque commit ; lent → sur CI, avant merge.

---

### 1.12 CI — pipeline type

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ lint + types │→│ unitaires    │→│ intégration  │→│ E2E + RBAC   │
│ (1 min)      │  │ (2 min)      │  │ (5 min)      │  │ (15 min)     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

- Chaque PR : lint + types + unitaires obligatoires.
- Merge vers `main` : intégration + E2E + RBAC matrix.
- Backup de production : test de restauration régulier (§2.2).

---

## 2. SAUVEGARDES & REPRISE

> « Que se passe-t-il si ton serveur brûle ? »
> 800 clients, 1200 paiements, 4000 leads. Si le disque meurt et que tu réponds « je n'ai plus rien », tu fermes l'entreprise.

### 2.1 Backup PostgreSQL

| Question | Réponse à décider | Guidance |
|----------|-------------------|----------|
| Fréquence | Toutes les nuits 02h00 / toutes les heures / 15 min | Selon l'activité. Daily minimum, hourly si ventes fréquentes |
| Où | **Jamais sur le même serveur** | S3 compatible (Backblaze, Cloudflare R2), autre serveur, ou service de l'hébergeur |
| Outil | `pg_dump` / service hébergeur (RDS, Neon, Supabase, etc.) | Choisir selon l'hébergeur |

Règle absolue : **serveur mort = backup morte si même disque.** Toujours un stockage indépendant.

### 2.2 Restauration — le backup ne sert à rien tant qu'on n'a pas restauré

Beaucoup d'entreprises découvrent après un incident que leur sauvegarde est inutilisable.

**Procédure de test régulière** :

```
backup
  ↓
restauration sur base vide
  ↓
application démarre
  ↓
données présentes ✓
```

Fréquence : au moins 1x/mois, et obligatoirement après un changement de schéma.

### 2.3 Rétention

On peut découvrir un problème longtemps après son apparition.

| Backup | Rétention recommandée |
|--------|------------------------|
| Quotidienne | 7 jours |
| Hebdomadaire | 30 jours |
| Mensuelle | 12 mois |

Politique graduée : plus d'historique pour les backups espacés que pour les quotidiens.

### 2.4 PRA — Plan de Reprise d'Activité (document d'exploitation)

Le serveur est mort, que fais-tu ? Un document qu'on peut suivre **sous pression** :

```
1. Créer un nouveau serveur
2. Installer Docker (ou l'environnement de prod)
3. Déployer l'application (images, env)
4. Restaurer PostgreSQL depuis le backup externe
5. Pointer le DNS
6. Vérifier (health check, données présentes, login OK)
```

> Rédiger ce document **maintenant**, le versionner dans le repo (hors code), et le tester au moins une fois.

### 2.5 PCA — Plan de Continuité d'Activité

Différent : le serveur est mort **mais on ne veut pas arrêter le service**.
Redondance : plusieurs instances, réplication BDD, bascule automatique, etc.

**Pour OnePips au lancement** : un **PRA bien documenté est largement suffisant**. Le PCA devient pertinent avec du trafic élevé ou des exigences de disponibilité fortes.

---

## 3. GESTION DES SECRETS

### 3.1 Inventaire des secrets

| Secret | Source actuelle |
|--------|-----------------|
| `DATABASE_URL` | `.env` |
| `BETTER_AUTH_SECRET` | `.env` |
| `JWT_SECRET` | `.env` |
| `STRIPE_SECRET_KEY` | `.env` |
| `STRIPE_WEBHOOK_SECRET` | `.env` (à ajouter) |
| `CALCOM_API_KEY` | `.env` (à ajouter) |
| `SMTP_PASSWORD` | `.env` (à ajouter) |
| `S3_ACCESS_KEY` / `S3_SECRET` | `.env` (à ajouter) |
| `FRONT_URL` / `BETTER_AUTH_URL` | `.env` (non-secret mais sensible) |

On peut facilement dépasser une dizaine de secrets.

### 3.2 Le risque

Ton dépôt GitHub devient public → `.env` poussé → **toutes les clés compromises**.

Actions immédiates :
- Vérifier que `.env` est dans `.gitignore`.
- Vérifier l'historique git (un `.env` commité une fois = clés à faire tourner).
- Scanner le repo (`gitleaks` / `git-secrets`).

### 3.3 Rotation — prévue et documentée

Chaque secret doit pouvoir être changé sans panique :

```
Stripe :
  ancienne clé → nouvelle clé → redéploiement → ancienne supprimée
```

Cas d'usage : fuite, départ d'un prestataire, compromission, politique de sécurité.

### 3.4 Séparation des environnements

**Jamais** : DEV → Stripe Production, ou STAGING → base de production.

| Environnement | Base de données | Stripe | Better Auth |
|---------------|-----------------|--------|-------------|
| Développement | Locale | Test | Secret DEV |
| Staging | PostgreSQL dédiée | Test | Secret STAGING |
| Production | PostgreSQL PROD | Production | Secret PROD |

Une erreur de config ne doit jamais impacter les données réelles.

### 3.5 Stockage — jamais un `.env` copié à la main en prod

| Type d'hébergement | Solution |
|--------------------|----------|
| Plateformes managées (Vercel, Railway, Render, Fly.io) | Gestionnaire de secrets intégré |
| Self-hosted | Coffre dédié : HashiCorp Vault, ou gestionnaire cloud (AWS/GCP/Azure) |
| Dans tous les cas | Secrets **injectés au démarrage**, jamais stockés dans le dépôt Git |

### 3.6 Politique de renouvellement

Tous les secrets n'ont pas la même criticité :

| Secret | Rotation |
|--------|----------|
| Clés API de test | À la demande |
| Mot de passe SMTP | Tous les 6 à 12 mois, ou après incident |
| Secret Better Auth | En cas de compromission ou selon politique (attention impact sessions) |
| Clés Stripe | Rotation planifiée ou après incident |
| Accès S3 | Rotation périodique, et immédiate en cas de fuite |

L'objectif n'est pas de tout changer chaque semaine, mais d'avoir **un processus clair quand c'est nécessaire**.

---

## 4. CHECKLIST PRÉ-PRODUCTION

| # | Tâche | Domaine | Statut |
|---|-------|---------|--------|
| 1 | Écrire les tests unitaires `PermissionsService` (+ matrice `RolePermissions`) | Tests | ⬜ |
| 2 | Écrire les tests RBAC générés (rôles × permissions × routes) | Tests | ⬜ |
| 3 | Écrire les tests des guards (AuthGuard : cookie valide/expiré/supprimé/user supprimé) | Tests | ⬜ |
| 4 | Écrire les tests intégration Better Auth (signup/login/logout/expiration) | Tests | ⬜ |
| 5 | Écrire les tests `getEffectivePermissions` (role + overrides) | Tests | ⬜ |
| 6 | Écrire les tests invitations (token expiré/déjà utilisé/trafiqué/valide) | Tests | ⬜ |
| 7 | Configurer la CI (lint → unitaires → intégration → E2E/RBAC) | CI | ⬜ |
| 8 | Mettre en place le backup PostgreSQL (fréquence + stockage externe) | Sauvegarde | ⬜ |
| 9 | Tester une restauration complète (procédure écrite + exécutée) | Sauvegarde | ⬜ |
| 10 | Définir la rétention (7j quot / 30j hebdo / 12 mois mensuel) | Sauvegarde | ⬜ |
| 11 | Rédiger le **PRA** (document pas-à-pas versionné + testé) | Reprise | ⬜ |
| 12 | Vérifier `.gitignore` + scanner l'historique git (aucun secret) | Secrets | ⬜ |
| 13 | Créer un gestionnaire de secrets pour chaque env (DEV/STAGING/PROD séparés) | Secrets | ⬜ |
| 14 | Documenter la rotation de chaque secret (procédure) | Secrets | ⬜ |
| 15 | Appliquer le plan sécurité de l'audit (Helmet, CSRF, rate limiting Redis, audit log…) | Sécurité | ⬜ |

---

## 5. DÉCISIONS À TRANCHER

| Décision | Options | Recommandation |
|----------|---------|----------------|
| Hébergeur prod | Vercel/Railway/Render/Fly/self-hosted | Détermine backup, secrets, redondance |
| Fréquence backup | Nuit / heure / 15 min | Daily min, hourly si ventes fréquentes |
| Stockage backup | S3 compatible / Backblaze / hébergeur | Jamais le même serveur |
| Outil de test | Vitest / Jest | Vitest (moderne, rapide, TS natif) |
| Testcontainers ou BDD de test dédiée | — | Selon l'effort acceptable en CI |

---

## 6. LÉGENDE

| Symbole | Signification |
|---------|---------------|
| ✅ | Fait / Validé |
| ⚠️ | Partiel / À améliorer |
| ❌ | Manquant / Pas fait |
| 🔴 | Critique |
| ⬜ | À faire (todo) |
| ❓ | À vérifier |
