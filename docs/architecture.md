# System Architecture — AwaasDirect

> **Version**: 1.0 MVP  
> **Date**: March 2026  
> **Stack**: Next.js 14 · Express · PostgreSQL · Prisma · NextAuth.js · OpenAI · AWS S3 · Vercel · Railway

---

## Overview

AwaasDirect is a **two-sided marketplace** connecting verified property owners with verified buyers/renters in India. The system comprises:

1. **Web Frontend** — Next.js 14 (App Router) served via Vercel CDN
2. **REST API Backend** — Node.js + Express (TypeScript) hosted on Railway
3. **PostgreSQL Database** — hosted on Railway (managed Postgres)
4. **Real-Time Layer** — Socket.io for in-app chat (same Express process)
5. **AI Services** — OpenAI GPT-4o for floor plan generation; third-party virtual tour API
6. **File Storage** — AWS S3 (ap-south-1 Mumbai) for property photos and generated assets
7. **Auth** — NextAuth.js with custom credentials (phone OTP) + Google OAuth
8. **Email** — Resend (transactional email notifications)

All user data is stored in India (AWS Mumbai / Railway ap-south-1 equivalent) to comply with Indian data localisation norms.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS (Browser)                          │
│              Buyers / Owners / Admins                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │  HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL EDGE / CDN                             │
│         Next.js 14 App  (SSR + Static Pages)                    │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Public     │  │  Auth Pages  │  │  Protected Pages    │   │
│  │  / search   │  │  /login      │  │  /dashboard         │   │
│  │  /property  │  │  /verify-kyc │  │  /messages          │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
│                                                                 │
│  NextAuth.js session (JWT stored in HttpOnly cookie)            │
└─────────────────────┬──────────────────────┬────────────────────┘
                      │  REST API calls       │ WebSocket (Socket.io)
                      │  (HTTPS)              │ (WSS)
                      ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAILWAY — Express API                        │
│               Node.js 20 + Express + TypeScript                 │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ /auth    │ │/properties│ │ /chat    │ │ /ai              │  │
│  │  router  │ │  router  │ │  router  │ │  router          │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬──────────┘  │
│       │             │             │               │             │
│  ┌────┴─────────────┴─────────────┴───────────────┴──────────┐ │
│  │               Service Layer (Business Logic)               │ │
│  │  AuthService · ListingService · ChatService · AIService    │ │
│  └────┬─────────────────────────────────────────────────┬────┘ │
│       │  Prisma ORM                                      │      │
└───────┼──────────────────────────────────────────────────┼──────┘
        │                                                  │
        ▼                                                  ▼
┌───────────────────┐                       ┌─────────────────────┐
│ RAILWAY POSTGRES  │                       │   EXTERNAL SERVICES  │
│  PostgreSQL 15    │                       │                      │
│  (Managed)        │                       │ ┌──────────────────┐ │
│                   │                       │ │  AWS S3 (Mumbai) │ │
│  Tables:          │                       │ │  Property Photos │ │
│  users            │                       │ │  Floor Plan PNGs │ │
│  properties       │                       │ └────────┬─────────┘ │
│  property_photos  │                       │          │           │
│  virtual_tours    │                       │ ┌────────▼─────────┐ │
│  floor_plans      │                       │ │  OpenAI API      │ │
│  chat_threads     │                       │ │  GPT-4o          │ │
│  chat_messages    │                       │ │  Floor Plans     │ │
│  saved_properties │                       │ └──────────────────┘ │
│  reports          │                       │                      │
└───────────────────┘                       │ ┌──────────────────┐ │
                                            │ │ Virtual Tour API │ │
                                            │ │ (Kuula / 3rd     │ │
                                            │ │  party embed)    │ │
                                            │ └──────────────────┘ │
                                            │                      │
                                            │ ┌──────────────────┐ │
                                            │ │  Resend Email    │ │
                                            │ │  (Notifications) │ │
                                            │ └──────────────────┘ │
                                            │                      │
                                            │ ┌──────────────────┐ │
                                            │ │ DigiLocker API   │ │
                                            │ │ (Aadhaar KYC)    │ │
                                            │ └──────────────────┘ │
                                            └─────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Reason |
|-------|-----------|---------|--------|
| **Frontend** | Next.js | 14.x (App Router) | SSR for SEO on property pages, file-based routing, built-in API routes for auth callbacks |
| **Frontend Language** | TypeScript | 5.x | Type safety across the full stack |
| **Styling** | Tailwind CSS | 3.x | Utility-first, fast to build with, great for responsive design |
| **UI Components** | shadcn/ui | latest | Accessible, unstyled Radix primitives with Tailwind — no bloat |
| **Backend Framework** | Express.js | 4.x | Well-understood, minimal, fast; TypeScript first-class |
| **Backend Runtime** | Node.js | 20.x LTS | Same language as frontend, large ecosystem |
| **ORM** | Prisma | 5.x | Type-safe queries, auto-generated client, great migration tooling |
| **Database** | PostgreSQL | 15.x | Relational data with JSONB for flexible fields; full-text search built in |
| **Authentication** | NextAuth.js | 5.x (Auth.js) | Handles Google OAuth + custom credentials (phone OTP) with session management |
| **Real-Time** | Socket.io | 4.x | WebSocket abstraction for chat; auto-fallback to long-polling |
| **File Storage** | AWS S3 | SDK v3 | Scalable object storage; Mumbai region for data residency |
| **AI – Floor Plans** | OpenAI API | GPT-4o | Structured prompt → floor plan description → DALL·E 3 image generation |
| **AI – Virtual Tours** | Kuula API | — | Third-party 360° tour hosting; embed via iframe |
| **Email** | Resend | latest | Developer-friendly email API; React Email templates |
| **HTTP Client** | Axios | 1.x | Used on both frontend and backend for external API calls |
| **Validation** | Zod | 3.x | Schema validation shared between frontend forms and backend routes |
| **State Management** | Zustand | 4.x | Lightweight global state (auth session, chat inbox) |
| **Data Fetching** | TanStack Query | 5.x | Server state, caching, background refetch for listings |
| **Frontend Deploy** | Vercel | — | Zero-config Next.js deploy, global CDN, edge functions |
| **Backend Deploy** | Railway | — | Simple Node.js + managed Postgres, auto-deploys from GitHub |
| **CI/CD** | GitHub Actions | — | Lint + test on PR; deploy on merge to main |

---

## Component Breakdown

### 1. Frontend (Next.js 14 — `web/`)

**App Router pages:**

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG | Hero, search bar, featured cities |
| `/search` | CSR | Filter panel + paginated results from API |
| `/properties/[id]` | SSR | Full property detail, SEO-critical, pre-rendered |
| `/login` | CSR | Phone number entry + OTP verification |
| `/verify-kyc` | CSR | Aadhaar DigiLocker KYC flow |
| `/dashboard` | CSR (protected) | Owner listing management + analytics |
| `/dashboard/listings/new` | CSR (protected) | Multi-step listing creation form |
| `/dashboard/listings/[id]/edit` | CSR (protected) | Edit listing |
| `/messages` | CSR (protected) | Chat inbox + real-time thread |
| `/saved` | CSR (protected) | Buyer's shortlisted properties |

**Key Frontend Patterns:**
- **Server Components** for SEO pages (`/properties/[id]`, `/`) — fetch data on server, no loading states
- **Client Components** for interactive UIs (search filters, forms, chat)
- **NextAuth.js middleware** to guard all `/dashboard` and `/messages` routes
- **Route handlers** (`app/api/`) used only for NextAuth callbacks; all other API calls go to Express backend

---

### 2. Backend API (Express — `api/`)

**Router structure:**

| Prefix | Purpose |
|--------|---------|
| `POST /api/auth/otp/request` | Send OTP to phone number |
| `POST /api/auth/otp/verify` | Verify OTP, return JWT |
| `POST /api/auth/aadhaar/initiate` | Start DigiLocker KYC redirect |
| `GET  /api/auth/aadhaar/callback` | Handle DigiLocker OAuth callback |
| `GET  /api/auth/me` | Get current user profile |
| `GET  /api/properties` | Search + filter listings |
| `POST /api/properties` | Create listing (verified users only) |
| `GET  /api/properties/:id` | Get property detail + increment view count |
| `PUT  /api/properties/:id` | Update listing (owner only) |
| `PATCH /api/properties/:id/status` | Set status: active/sold/rented |
| `POST /api/properties/:id/photos` | Upload photos → S3 |
| `DELETE /api/properties/:id/photos/:photoId` | Remove photo |
| `POST /api/properties/:id/virtual-tour` | Trigger virtual tour generation |
| `GET  /api/properties/:id/virtual-tour` | Get tour status + embed URL |
| `POST /api/properties/:id/floor-plan` | Generate AI floor plan (plots only) |
| `GET  /api/chat/threads` | List user's chat threads |
| `POST /api/chat/threads` | Create thread (buyer→listing) |
| `GET  /api/chat/threads/:id/messages` | Paginated message history |
| `POST /api/chat/threads/:id/messages` | Send message |
| `PATCH /api/chat/threads/:id/share-phone` | Owner shares phone |
| `POST /api/saved` | Save a property |
| `GET  /api/saved` | Get saved properties |
| `DELETE /api/saved/:propertyId` | Remove from saved |
| `POST /api/reports` | Report a listing or user |

**Middleware stack (in order):**
1. `helmet` — HTTP security headers
2. `cors` — allow Vercel frontend origin
3. `express.json` — body parsing
4. `morgan` — request logging
5. `authenticateToken` — JWT validation (applied per-route)
6. `requireVerified` — Aadhaar KYC gate (applied per-route)

---

### 3. Database (PostgreSQL via Prisma)

See `prisma/schema.prisma` (produced by Database Agent). Key entities:

```
User ──────────────────┐
 ├── properties[]      │
 ├── savedProperties[] │
 ├── chatThreads[]     │  as buyer
 └── chatThreads[]        as owner (through Property)

Property
 ├── photos[]          PropertyPhoto
 ├── virtualTour       VirtualTour
 ├── floorPlans[]      FloorPlanRequest
 └── chatThreads[]     ChatThread
         └── messages[] ChatMessage

Report  (polymorphic: targets User or Property)
```

**Full-text search**: `tsvector` column on `properties` table covering `title`, `locality`, `city`, `description` — indexed with GIN. Prisma `rawQuery` used for FTS.

---

### 4. Real-Time Chat (Socket.io)

- Socket.io server runs **in the same Express process** (no separate service for MVP)
- Connection requires valid JWT (validated on `connection` event)
- Rooms: `thread:{threadId}` — both owner and buyer join on thread open
- Events:
  - `message:send` (client → server) → persist to DB → emit `message:receive` to room
  - `thread:read` (client → server) → update `readAt` timestamp
  - `user:typing` (client → server) → broadcast to room (not persisted)

---

### 5. AI – Floor Plan Generator

**Flow:**
1. Buyer submits `{ length, width, floors, rooms }` to `POST /api/properties/:id/floor-plan`
2. Backend constructs prompt:
   > *"You are an Indian residential architect. Generate a practical 2D floor plan layout description for a plot of {length}ft × {width}ft with {floors} floor(s). Include: {rooms}. Describe each room with dimensions and position. Output JSON."*
3. Call **GPT-4o** → receive structured JSON room layout
4. Call **DALL·E 3** with the layout description → receive floor plan image URL
5. Download image, upload to **S3**, store URL in `FloorPlanRequest` table
6. Return image URL + JSON layout to client
7. Client renders image + download button

**Rate limit**: 3 generations per user per property per 24 hours (enforced in DB via `FloorPlanRequest` count query).

---

### 6. AI – Virtual Tour

For MVP, we use **Kuula** (a 360° photo tour SaaS with API):

1. Owner triggers tour generation from dashboard
2. Backend sets `VirtualTour.status = PROCESSING`
3. Backend uploads photos to Kuula API → Kuula processes and returns embed URL
4. Webhook or polling (every 2 min) checks Kuula job status
5. On completion, store embed URL, set `status = READY`
6. Property detail page renders `<iframe src={embedUrl} />`

*Fallback*: If Kuula API is not available in sandbox, store a placeholder embed and show "Coming Soon" badge.

---

### 7. Auth Flow

```
Phone OTP Login:
  Client → POST /api/auth/otp/request { phone }
        ← 200 OK (OTP sent via SMS gateway, e.g. MSG91)
  Client → POST /api/auth/otp/verify { phone, otp }
        ← { token: JWT, user: {...} }
  Client stores JWT in memory; NextAuth session wraps it in HttpOnly cookie.

Aadhaar KYC:
  Client → POST /api/auth/aadhaar/initiate
        ← { redirectUrl: DigiLocker OAuth URL }
  Browser redirect → DigiLocker → user authenticates
  DigiLocker → GET /api/auth/aadhaar/callback?code=...
  Backend exchanges code for Aadhaar data via DigiLocker API
  Backend sets user.aadhaarVerified = true, stores masked Aadhaar hash
  Client receives updated session with verified status.

Google OAuth (convenience login for browsing only):
  Handled by NextAuth.js GoogleProvider
  Google users must still complete phone OTP before listing or chatting.
```

---

## Data Flow

### Listing a Property (Owner)

```
Owner fills form → Client validates (Zod)
  → POST /api/properties (JWT + verified required)
  → ListingService.create() → Prisma INSERT
  → S3 photo upload (multipart, each photo separately)
  → DB: PropertyPhoto rows linked to Property
  → RERA regex validation (server-side)
  → Response: { propertyId, status: "active" }
  → Owner Dashboard refreshes listing table
```

### Searching & Viewing (Buyer)

```
Buyer types city + filters
  → GET /api/properties?city=...&bhk=...&type=...
  → Prisma query with WHERE + full-text search (tsvector) + pagination
  → Response: { listings[], totalCount, page }
  → React renders grid cards

Buyer clicks listing
  → Next.js SSR: fetch /api/properties/:id on server
  → Pre-rendered HTML returned (SEO friendly)
  → Client: Socket.io connect if authenticated (for unread count)
```

### Buyer Chats with Owner

```
Buyer clicks "Chat with Owner" (must be verified)
  → POST /api/chat/threads { propertyId }
  → Server creates ChatThread, joins both users to room `thread:{id}`
  → Buyer types message
  → Socket.io emit message:send { threadId, content }
  → Server: INSERT ChatMessage → emit message:receive to room
  → Owner browser receives message (if online) OR
  → Resend email notification triggered (if offline)
```

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| **Monorepo vs. separate repos** | Separate repos (`web/` + `api/`) deployed independently | Simpler Railway + Vercel deploy; teams can move independently |
| **NextAuth vs. custom JWT** | NextAuth.js + custom Credentials provider | NextAuth handles session/cookie complexity; Credentials provider lets us validate phone OTP our way |
| **Socket.io in Express process** | Same process, not separate service | MVP scope — 500–2000 concurrent users does not need a separate WS farm; simpler infra |
| **OpenAI for floor plans** | GPT-4o + DALL·E 3 | Single vendor, well-documented, reliable for structured output + image gen |
| **PostgreSQL over MongoDB** | PostgreSQL | Relational data (listings → photos → threads → messages) needs JOINs and ACID; FTS is built in; Prisma ORM works best with Postgres |
| **Railway over AWS ECS** | Railway | Dramatically simpler for a solo/small team MVP; managed Postgres included; can migrate to ECS later |
| **Vercel for frontend** | Vercel | Zero-config Next.js deployment; automatic preview deployments per PR |
| **No Redis for MVP** | Skip | Rate limiting via Postgres query; session via NextAuth JWT; no caching layer needed until traffic grows |
| **S3 Mumbai region** | AWS ap-south-1 | Data residency in India; low latency for photo upload/download |

---

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| **IDOR on listings/chats** | All write/read operations check `req.user.id === resource.ownerId` |
| **Phone number privacy** | Phone stored hashed in DB; never returned in API response; shared in chat only on explicit owner action |
| **Aadhaar data** | Only store a SHA-256 hash of the Aadhaar number; never store full Aadhaar data |
| **S3 photo access** | S3 bucket is private; all photo URLs are pre-signed (1-hour expiry) |
| **JWT secret rotation** | JWT_SECRET stored in Railway env vars; short 7-day expiry; refresh on login |
| **SQL injection** | Prisma ORM parameterizes all queries; raw queries use `Prisma.sql` tagged template |
| **Rate limiting** | `express-rate-limit` on OTP request endpoint (5 req/min per IP) |
| **XSS** | Next.js escapes JSX by default; `helmet` CSP headers on API |

---

## Scalability Path (Post-MVP)

This architecture scales along simple axes when needed:

1. **Railway → AWS**: Move Express API to ECS Fargate; Postgres to RDS; still same code
2. **Add Redis**: Drop-in for rate limiting, session cache, Socket.io adapter (for multi-instance)
3. **Socket.io → separate process**: Extract to a standalone ws-server with Redis adapter when > 5k concurrent connections
4. **Search → Elasticsearch/Typesense**: Replace Postgres FTS with Typesense on Railway for fuzzy search at scale
5. **CDN for photos**: CloudFront in front of S3 for photo delivery
