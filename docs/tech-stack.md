# Tech Stack — AwaasDirect MVP

> Full dependency list with pinned versions for both the `web/` (Next.js) and `api/` (Express) packages.

---

## Frontend — `web/package.json`

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `14.2.x` | React framework with App Router, SSR, SSG |
| `react` | `18.3.x` | UI library |
| `react-dom` | `18.3.x` | DOM renderer |
| `typescript` | `5.4.x` | Type safety |

### Authentication

| Package | Version | Purpose |
|---------|---------|---------|
| `next-auth` | `5.0.0-beta.x` (Auth.js) | Session management, Google OAuth, custom Credentials provider |

### Styling & UI

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `3.4.x` | Utility-first CSS |
| `postcss` | `8.4.x` | CSS processing for Tailwind |
| `autoprefixer` | `10.4.x` | CSS vendor prefixes |
| `@radix-ui/react-*` | `latest` | Accessible primitive components (via shadcn/ui) |
| `class-variance-authority` | `0.7.x` | Variant-based component styling |
| `clsx` | `2.1.x` | Conditional class merging |
| `tailwind-merge` | `2.3.x` | Tailwind class conflict resolution |
| `lucide-react` | `0.378.x` | Icon library |

### Data Fetching & State

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | `5.40.x` | Server state, caching, background refetch |
| `axios` | `1.7.x` | HTTP client for API calls |
| `zustand` | `4.5.x` | Global client state (auth, chat unread) |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | `7.51.x` | Performant form management |
| `@hookform/resolvers` | `3.3.x` | Zod integration for react-hook-form |
| `zod` | `3.23.x` | Schema validation |

### Real-Time

| Package | Version | Purpose |
|---------|---------|---------|
| `socket.io-client` | `4.7.x` | WebSocket client for in-app chat |

### UI Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `react-dropzone` | `14.2.x` | Drag-and-drop photo upload |
| `yet-another-react-lightbox` | `3.18.x` | Full-screen photo gallery |
| `react-image-gallery` | `1.3.x` | Property photo carousel |
| `@react-pdf/renderer` | `3.4.x` | Floor plan PDF download generation |
| `date-fns` | `3.6.x` | Date formatting (chat timestamps, availability) |
| `react-hot-toast` | `2.4.x` | Toast notifications |

### SEO & Meta

| Package | Version | Purpose |
|---------|---------|---------|
| (built-in) | Next.js `metadata` API | Page title, description, Open Graph |

---

## Backend — `api/package.json`

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | `4.19.x` | HTTP server framework |
| `typescript` | `5.4.x` | Type safety |
| `tsx` | `4.10.x` | TypeScript execution (dev) |
| `ts-node` | `10.9.x` | TypeScript REPL + scripts |

### Database & ORM

| Package | Version | Purpose |
|---------|---------|---------|
| `prisma` | `5.14.x` | ORM CLI + migration runner |
| `@prisma/client` | `5.14.x` | Auto-generated type-safe DB client |
| `pg` | `8.11.x` | PostgreSQL native driver (used by Prisma) |

### Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| `jsonwebtoken` | `9.0.x` | JWT sign + verify |
| `@types/jsonwebtoken` | `9.0.x` | Types |
| `bcryptjs` | `2.4.x` | OTP hash comparison |
| `helmet` | `7.1.x` | HTTP security headers |
| `cors` | `2.8.x` | CORS policy |
| `express-rate-limit` | `7.3.x` | Rate limiting (OTP, AI endpoints) |

### Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | `3.23.x` | Request validation schemas |

### File Upload & Storage

| Package | Version | Purpose |
|---------|---------|---------|
| `multer` | `1.4.x` | Multipart form handling |
| `multer-s3` | `3.0.x` | Stream uploads directly to S3 |
| `@aws-sdk/client-s3` | `3.575.x` | AWS S3 SDK v3 |
| `@aws-sdk/s3-request-presigner` | `3.575.x` | Presigned URL generation |
| `sharp` | `0.33.x` | Image compression before S3 upload |

### AI Services

| Package | Version | Purpose |
|---------|---------|---------|
| `openai` | `4.47.x` | OpenAI JS SDK (GPT-4o + DALL·E 3) |
| `axios` | `1.7.x` | HTTP calls to Kuula virtual tour API |

### Real-Time

| Package | Version | Purpose |
|---------|---------|---------|
| `socket.io` | `4.7.x` | WebSocket server for in-app chat |

### Email

| Package | Version | Purpose |
|---------|---------|---------|
| `resend` | `3.3.x` | Transactional email API |
| `react-email` | `2.1.x` | Email template components |

### Logging & Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| `morgan` | `1.10.x` | HTTP request logging |
| `winston` | `3.13.x` | Structured application logging |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `uuid` | `9.0.x` | Generate UUIDs for OTPs, request IDs |
| `date-fns` | `3.6.x` | Date math (OTP expiry, rate limit windows) |
| `dotenv` | `16.4.x` | Load `.env` file in development |

---

## Shared — `packages/types/package.json`

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `5.4.x` | Type definitions only; no runtime dependencies |

---

## Dev Tools (Root / Both)

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | `8.57.x` | Linting |
| `@typescript-eslint/parser` | `7.10.x` | TypeScript ESLint parser |
| `@typescript-eslint/eslint-plugin` | `7.10.x` | TS-specific lint rules |
| `eslint-config-next` | `14.2.x` | Next.js ESLint config |
| `prettier` | `3.2.x` | Code formatter |
| `eslint-config-prettier` | `9.1.x` | Disable ESLint rules that conflict with Prettier |
| `jest` | `29.7.x` | Unit + integration test runner |
| `@types/jest` | `29.5.x` | Jest types |
| `ts-jest` | `29.1.x` | TypeScript transformer for Jest |
| `supertest` | `7.0.x` | HTTP assertion for Express route tests |
| `@playwright/test` | `1.44.x` | E2E browser testing |
| `husky` | `9.0.x` | Git hooks |
| `lint-staged` | `15.2.x` | Run linters on staged files only |

---

## Environment Variables

### `web/.env.local`

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-char-string>

# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### `api/.env`

```bash
# Server
PORT=4000
NODE_ENV=development

# Database (Railway Postgres)
DATABASE_URL=postgresql://user:pass@host:5432/awaasdirect

# JWT
JWT_SECRET=<random-64-char-string>
JWT_EXPIRES_IN=7d

# OTP / SMS (MSG91)
MSG91_AUTH_KEY=...
MSG91_TEMPLATE_ID=...

# Aadhaar / DigiLocker
DIGILOCKER_CLIENT_ID=...
DIGILOCKER_CLIENT_SECRET=...
DIGILOCKER_REDIRECT_URI=http://localhost:4000/api/auth/aadhaar/callback

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=awaasdirect-photos

# OpenAI
OPENAI_API_KEY=sk-...

# Kuula (Virtual Tour)
KUULA_API_KEY=...

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@awaasdirect.in

# CORS
ALLOWED_ORIGIN=http://localhost:3000
```

---

## Node & Runtime Requirements

| Requirement | Version |
|------------|---------|
| Node.js | `>= 20.0.0 LTS` |
| npm | `>= 10.0.0` |
| PostgreSQL | `>= 15.0` |

---

## Version Pinning Strategy

- All production dependencies are pinned to **minor version** (e.g., `4.19.x`) to allow patch updates but prevent breaking minor changes in CI.
- Dev dependencies use `^` (caret) for flexibility.
- `package-lock.json` is committed to both `web/` and `api/` for fully reproducible installs.
