# BACKEND NESTJS

## 📦 1. STACK BACKEND

`
nestjs
typescript
prisma
postgresql
class-validator
class-transformer
passport + jwt
bcrypt
stripe
`

## 📁 2. ARBORESCENCE COMPLÈTE

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── utils/
│
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   │   └── schema.prisma
│
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │
│   │   ├── leads/
│   │   │   ├── leads.module.ts
│   │   │   ├── leads.controller.ts
│   │   │   ├── leads.service.ts
│   │   │   └── dto/
│   │
│   │   ├── applications/
│   │   │   ├── applications.module.ts
│   │   │   ├── applications.controller.ts
│   │   │   ├── applications.service.ts
│   │   │   └── dto/
│   │
│   │   ├── booking/
│   │   │   ├── booking.module.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.service.ts
│   │   │   └── dto/
│   │
│   │   ├── payments/
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── stripe.service.ts
│   │   │   └── dto/
│   │
│   │   ├── events/
│   │   │   ├── events.module.ts
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   └── dto/
│   │
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── dto/
│
│   └── jobs/
│       ├── cron.service.ts
│       └── queues/
│
├── prisma/
│   └── migrations/
│
├── .env
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

🧠 3. SCHÉMA PRISMA

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())

  bookings  Booking[]
  payments  Payment[]
}

enum Role {
  ADMIN
  USER
}

model Lead {
  id        String   @id @default(uuid())
  name      String
  email     String
  source    String?
  status    LeadStatus @default(NEW)
  score     Int?
  createdAt DateTime @default(now())

  application Application?
}

enum LeadStatus {
  NEW
  QUALIFIED
  REJECTED
}

model Application {
  id                String   @id @default(uuid())
  leadId            String   @unique
  lead              Lead     @relation(fields: [leadId], references: [id])

  answers           Json
  score             Int
  status            ApplicationStatus

  interests         String[]
  budgetFormation   Int?
  capitalTrading    Int?

  createdAt         DateTime @default(now())
}

enum ApplicationStatus {
  HOT
  WARM
  COLD
}

model Booking {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  date      DateTime
  status    String
  notes     String?

  createdAt DateTime @default(now())
}

model Payment {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  amount    Float
  type      String
  status    String

  createdAt DateTime @default(now())
}

model Event {
  id          String   @id @default(uuid())
  title       String
  date        DateTime
  participants Json?

  createdAt   DateTime @default(now())
}
```

## 🐳 4. DOCKER

#### Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
```

#### docker-compose.yml

```YAML
version: '3.8'

services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: onepips
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "3001:3001"
    depends_on:
      - db
```