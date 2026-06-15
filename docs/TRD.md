# Technical Requirements Document (TRD)
# My Awaas — Platform Architecture

**Version:** 1.0  
**Date:** June 2026  

---

## 1. Architecture Overview

My Awaas uses a **decoupled monorepo** architecture with separate frontend and backend deployed independently.

```
monorepo/
├── web/          ← Next.js 14 frontend (Vercel)
├── api/          ← Express.js backend (Render)
├── prisma/       ← Prisma schema (shared)
└── docs/         ← Project documentation
```

---

## 2. Technology Stack

### 2.1 Frontend (`/web`)
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Server State / Caching | TanStack Query (React Query) |
| HTTP Client | Axios (via api-client.ts) |
| Fonts | Google Fonts — Playfair Display, DM Sans |
| Hosting | Vercel |

### 2.2 Backend (`/api`)
| Layer | Technology |
|---|---|
| Framework | Express.js 4 |
| Language | TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL 15 (Supabase) |
| Auth | JWT (jsonwebtoken) — Access + Refresh tokens |
| Real-time | Socket.io 4 |
| Validation | Zod |
| File Storage | AWS S3 (ap-south-1) |
| Email | Resend |
| Logging | Winston (structured JSON) |
| Security | Helmet, CORS, express-rate-limit |
| Hosting | Render (Web Service) |

### 2.3 Database
| Provider | Supabase (managed PostgreSQL) |
|---|---|
| Connection | Supabase Connection Pooler (PgBouncer, port 6543) |
| ORM | Prisma (type-safe queries, no raw SQL vulnerabilities) |
| Migrations | Prisma Migrate |

---

## 3. Environment Variables

### Backend (`api/.env`)
```env
NODE_ENV=production
PORT=4000
API_URL=https://awaasdirect.onrender.com
FRONTEND_URL=https://myawaas.vercel.app

DATABASE_URL=postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

JWT_ACCESS_SECRET=<32+ chars>
JWT_REFRESH_SECRET=<32+ chars>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<aws key>
AWS_SECRET_ACCESS_KEY=<aws secret>
S3_BUCKET_NAME=myawaas-assets

OPENAI_API_KEY=<openai key>
RESEND_API_KEY=<resend key>
EMAIL_FROM=noreply@myawaas.in

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

### Frontend (`web/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://awaasdirect.onrender.com
```

---

## 4. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /register | None | Register new user |
| POST | /login | None | Login, returns JWT tokens |
| POST | /refresh | None | Refresh access token |
| GET | /me | Bearer | Get current user profile |

### Properties (`/api/properties`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | None | List/search properties |
| GET | /:id | None | Get property detail |
| POST | / | Owner | Create new listing |
| PATCH | /:id | Owner | Update listing |
| DELETE | /:id | Owner | Delete listing |
| POST | /:id/photos | Owner | Upload photos |

### Conversations (`/api/conversations`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | Bearer | List user's conversations |
| POST | / | Bearer | Start conversation |
| GET | /:id | Bearer | Get conversation |

### Messages (`/api/messages`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /:conversationId | Bearer | Get messages |
| POST | / | Bearer | Send message |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /profile | Bearer | Get profile |
| PATCH | /profile | Bearer | Update profile |

---

## 5. Security Architecture

### 5.1 Authentication Flow
```
Client → POST /api/auth/login
       ← { accessToken (15m), refreshToken (7d) }

Client → GET /api/... (Authorization: Bearer <accessToken>)
       ← Protected resource

Client → POST /api/auth/refresh { refreshToken }
       ← { new accessToken }
```

### 5.2 Security Layers
1. **Helmet.js** — Sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
2. **CORS** — Locked to `FRONTEND_URL` only, no wildcard
3. **Rate Limiting** — Global: 100/15min, Auth: 5/15min per IP
4. **Input Validation** — Zod schemas on all request bodies
5. **Parameterized Queries** — Prisma ORM prevents SQL injection
6. **Phone Hashing** — SHA-256 hash stored, never plain phone number
7. **Password Hashing** — bcrypt with 10 salt rounds
8. **JWT Secrets** — Minimum 32-character secrets

### 5.3 Data Privacy
- Phone numbers stored as SHA-256 hash only
- Aadhaar numbers stored as SHA-256 hash only (future)
- No raw PII in logs (Winston redaction)

---

## 6. Deployment

### 6.1 Frontend (Vercel)
- **Root Directory:** `web`
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build`
- **Branch:** `main` → Production

### 6.2 Backend (Render)
- **Type:** Web Service
- **Root Directory:** `api`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Branch:** `main` → Auto-deploy

### 6.3 Database (Supabase)
- Free tier (Nano instance)
- **Connection:** PgBouncer pooler on port 6543 for Render compatibility
- **Migrations:** Run via `npx prisma migrate deploy` on backend startup

---

## 7. Performance
- Next.js Image Optimization for all property photos
- Gzip compression on Express (`compression` middleware)
- TanStack Query client-side caching (5 min stale time)
- Prisma connection pooling via PgBouncer

---

## 8. Monitoring
- Winston logs in JSON format on Render
- Render built-in metrics (CPU, memory, requests)
- Vercel Analytics (Web Vitals)
