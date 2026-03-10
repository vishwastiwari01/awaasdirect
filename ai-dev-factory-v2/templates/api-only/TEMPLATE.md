# ⚙️ API-Only Backend Template

Use this for: REST APIs, microservices, backend for mobile apps, webhook handlers, background job systems.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js + TypeScript |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Auth | JWT + refresh tokens |
| Validation | Zod |
| Docs | Swagger / OpenAPI |
| Testing | Jest + Supertest |
| Queue | BullMQ + Redis |
| Deploy | Railway OR Docker + VPS |

---

## 📁 Folder Structure

```
api/
├── src/
│   ├── index.ts                  ← Entry point, Express app
│   │
│   ├── routes/
│   │   ├── index.ts              ← Combine all routers
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   └── [feature].routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   └── [feature].controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    ← JWT verification
│   │   ├── validate.middleware.ts ← Zod validation
│   │   ├── rateLimit.middleware.ts
│   │   ├── error.middleware.ts   ← Global error handler
│   │   └── logger.middleware.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts       ← Business logic
│   │   ├── email.service.ts
│   │   ├── storage.service.ts
│   │   └── [feature].service.ts
│   │
│   ├── jobs/                     ← BullMQ background jobs
│   │   ├── queue.ts
│   │   └── processors/
│   │       └── email.processor.ts
│   │
│   ├── utils/
│   │   ├── response.ts           ← Standard API response helpers
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   └── logger.ts
│   │
│   └── types/
│       ├── express.d.ts          ← Extend Express Request type
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

---

## 📐 Standard Response Format

```typescript
// utils/response.ts — use these everywhere

export const success = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({ success: true, message, data })
}

export const error = (res, message, status = 400, code?) => {
  return res.status(status).json({ success: false, message, code })
}

// Examples:
success(res, { user }, 'User created', 201)
error(res, 'Email already exists', 409, 'EMAIL_TAKEN')
```

---

## 🔐 Auth Flow

```
REGISTER:
POST /api/v1/auth/register
→ Validate input (Zod)
→ Check email doesn't exist
→ Hash password (bcrypt, 12 rounds)
→ Create user in DB
→ Send verification email
→ Return user + access token + refresh token

LOGIN:
POST /api/v1/auth/login
→ Find user by email
→ Compare password hash
→ Generate access token (15min) + refresh token (7days)
→ Store refresh token in DB
→ Return tokens

REFRESH:
POST /api/v1/auth/refresh
→ Verify refresh token
→ Check it exists in DB
→ Generate new access token
→ Return new access token

LOGOUT:
POST /api/v1/auth/logout
→ Delete refresh token from DB
```

---

## ✅ Zod Validation Examples

```typescript
// schemas/auth.schema.ts
import { z } from 'zod'

export const RegisterSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  )
})

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1)
})
```

---

## 🔌 Standard API Endpoints

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/verify-email/:token

# Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
DELETE /api/v1/users/me
POST   /api/v1/users/me/avatar

# Health
GET    /health                     ← Always include this for monitoring
```

---

## 🌍 Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# Auth
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Redis
REDIS_URL=redis://localhost:6379

# Email
RESEND_API_KEY=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# App
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/api-only/TEMPLATE.md` as the base. Build a REST API for [your app]. The app needs [list your main features]."
