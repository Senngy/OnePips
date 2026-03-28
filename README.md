# 🟣 OnePips

OnePips est une plateforme complète de gestion de leads, candidatures, bookings, paiements et analytics.
Le projet est composé de deux parties principales :

Backend : NestJS + PostgreSQL + Prisma
Frontend : React/Next.js (ou Angular selon ton choix)

## 🚀 Stack Technique

Partie	| Tech |
Backend	|  NestJS, TypeScript, PostgreSQL, Prisma, Docker | 
Frontend | 	React / Next.js, TypeScript, TailwindCSS / SCSS, Recharts | 
Auth | 	JWT, Roles (admin, client) | 
DevOps | 	Docker + Docker Compose, GitHub Actions (CI/CD) | 
Tests | 	Jest (backend), React Testing Library (frontend) | 

## 🐳 Installation et Setup Local

### Cloner le projet

```bash
git clone https://github.com/<ton-utilisateur>/onepips.git
cd onepips
```

### Backend Setup

Créer le fichier .env dans backend/ :
```env
DATABASE_URL="postgresql://onepips:onepips1998@localhost:5432/onepips?schema=public"
JWT_SECRET="supersecret"
```

Lancer Postgres en Docker :

```bash
cd backend
docker-compose up -d
```

Installer les dépendances et initialiser Prisma :
```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

Lancer le serveur NestJS :
```
npm run start:dev
```

### Frontend Setup

Aller dans le dossier frontend :
```
cd ../frontend
npm install
```

Créer .env pour l’API backend (si nécessaire) :
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Lancer le serveur React/Next.js :
```
npm run dev
```

Le frontend sera disponible sur  ``http://localhost:3001`` ou selon ta config.
