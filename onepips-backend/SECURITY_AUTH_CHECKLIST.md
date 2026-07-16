**Résumé**
- **Objectif :** Sécuriser l'authentification en centralisant Better Auth et en supprimant tout ancien code d'auth local.
- Changements appliqués :
  - `AuthController` remplacé par un proxy vers Better Auth ([src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts#L1-L40)).
  - `AuthService` supprimé et export supprimé ([src/modules/auth/index.ts](src/modules/auth/index.ts#L1-L3)).
  - Suppression du `console.log` exposant `DATABASE_URL` ([src/modules/auth/auth.ts](src/modules/auth/auth.ts#L1-L40)).
  - Validation des secrets ajoutée via `ConfigModule.forRoot` (vérifie `BETTER_AUTH_SECRET`, `DATABASE_URL`, `JWT_SECRET`) ([src/app.module.ts](src/app.module.ts#L1-L120)).
  - Retrait du fallback `secretKey` dans la config JWT ([src/config/jwt.config.ts](src/config/jwt.config.ts#L1-L20)).
  - CORS centralisé via `FRONT_URL` et `trustedOrigins` aligné ([src/main.ts](src/main.ts#L1-L60), [src/modules/auth/auth.ts](src/modules/auth/auth.ts#L1-L40)).
  - `ValidationPipe` durci (`forbidNonWhitelisted: true`) ([src/main.ts](src/main.ts#L1-L60)).
  - `AuthGuard` (vérifie session via cookie + `prisma.session`) et `RolesGuard` + `@Roles()` ajoutés ([src/modules/auth/guards/auth.guard.ts](src/modules/auth/guards/auth.guard.ts#L1-L200), [src/modules/auth/guards/roles.guard.ts](src/modules/auth/guards/roles.guard.ts#L1-L200), [src/modules/auth/decorators/roles.decorator.ts](src/modules/auth/decorators/roles.decorator.ts#L1-L20)).
  - `GET /api/users` protégé par `@UseGuards(AuthGuard, RolesGuard)` et `@Roles('ADMIN')` ([src/modules/users/users.controller.ts](src/modules/users/users.controller.ts#L1-L80)).
  - Rate-limit middleware ajouté pour endpoints d'auth (`src/common/middleware/auth-rate-limit.middleware.ts`) et monté dans `AppModule`.
  - Tests d'intégration ajoutés pour vérifier 401/403/200 (`test/auth.e2e-spec.ts`).

**Vérifications immédiates (à lancer)**
- Lancer les tests e2e :

```
npm run test:e2e
```

- Vérifier dans la base que l'utilisateur admin existe (tu l'as indiqué). Optionnel :

```
npx prisma studio
```

**Actions recommandées restantes (priorisées)**
- Vérifier la configuration de hachage utilisée par Better Auth (algorithme & coût).
  - Constat: `better-auth` et `bcrypt` sont présents dans `package.json`.
  - Action: vérifier dans la configuration Better Auth (si exposée) ou la doc du package la méthode de hash et ses paramètres; si possible forcer Argon2 ou augmenter le `bcrypt` cost >= 12.
- Documenter la politique de cookies en production : `Secure`, `HttpOnly`, `SameSite=strict` et HSTS.
- Mettre en place une rotation/gestion des secrets (Vault, K8s secrets) et ne pas laisser de fallback en prod.
- Ajouter tests automatiques pour le proxy Better Auth (ex: assert que `/api/auth/sign-in/email` répond via proxy). 
- Revoir la politique de logs pour éviter toute fuite de secret (DB URL, tokens, etc.).

**Commandes utiles**
- Lancer tests : `npm run test` ou `npm run test:e2e`
- Démarrer en dev : `npm run start:dev`
- Ouvrir Prisma Studio : `npx prisma studio`

**Notes sur vérification du hash (procédure)**
1. Vérifier la version de `better-auth` et `bcrypt` dans `package.json`.
2. Rechercher dans `node_modules/better-auth` une option d'initialisation exposant l'algorithme (si accessible localement) ou consulter la doc du package.
3. Si `better-auth` n'expose pas de réglage, contacter la doc/support Better Auth pour connaître le work factor par défaut.
4. Si besoin, migrer les comptes ou configurer l'adapter pour forcer argon2/bcrypt avec un paramètre plus fort.

**Fichiers modifiés**
- [src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts#L1-L40)
- [src/modules/auth/auth.ts](src/modules/auth/auth.ts#L1-L40)
- [src/modules/auth/index.ts](src/modules/auth/index.ts#L1-L3)
- [src/modules/auth/guards/auth.guard.ts](src/modules/auth/guards/auth.guard.ts#L1-L200)
- [src/modules/auth/guards/roles.guard.ts](src/modules/auth/guards/roles.guard.ts#L1-L200)
- [src/modules/auth/decorators/roles.decorator.ts](src/modules/auth/decorators/roles.decorator.ts#L1-L20)
- [src/modules/auth/auth.module.ts](src/modules/auth/auth.module.ts#L1-L40)
- [src/modules/users/users.controller.ts](src/modules/users/users.controller.ts#L1-L80)
- [src/app.module.ts](src/app.module.ts#L1-L120)
- [src/config/jwt.config.ts](src/config/jwt.config.ts#L1-L20)
- [src/main.ts](src/main.ts#L1-L80)
- [src/common/middleware/auth-rate-limit.middleware.ts](src/common/middleware/auth-rate-limit.middleware.ts#L1-L200)
- [test/auth.e2e-spec.ts](test/auth.e2e-spec.ts#L1-L200)

---

Si tu veux, j'essaie maintenant de :
- exécuter la suite de tests ici (si l'environnement a Node+deps installés), ou
- vérifier directement `node_modules/better-auth` localement pour trouver la config de hachage.

Quelle option souhaites-tu ?
