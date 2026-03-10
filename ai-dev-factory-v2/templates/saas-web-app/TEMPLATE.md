# 🚀 SaaS Web App Template

Use this for: CRM tools, project managers, invoicing apps, booking systems, any subscription-based web product.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Google + Email) |
| Payments | Stripe (subscriptions) |
| Email | Resend |
| Storage | AWS S3 |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## 📁 Folder Structure

```
saas-app/
├── apps/
│   ├── web/                    ← Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── settings/
│   │   │   │   └── billing/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx    ← Landing page
│   │   │   │   └── pricing/
│   │   │   └── api/
│   │   │       └── auth/
│   │   ├── components/
│   │   │   ├── ui/             ← ShadCN components
│   │   │   ├── layout/         ← Navbar, Sidebar, Footer
│   │   │   └── features/       ← Feature-specific components
│   │   └── lib/
│   │       ├── auth.ts
│   │       ├── stripe.ts
│   │       └── utils.ts
│   │
│   └── api/                    ← Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── services/
│       │   └── utils/
│       └── prisma/
│           ├── schema.prisma
│           └── seed.ts
│
├── packages/
│   └── types/                  ← Shared TypeScript types
│
├── docker-compose.yml
└── .env.example
```

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  passwordHash  String?
  role          Role      @default(USER)
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  subscription  Subscription?
  accounts      Account[]
  sessions      Session[]
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  stripeCustomerId     String   @unique
  stripeSubscriptionId String?  @unique
  plan                 Plan     @default(FREE)
  status               String   @default("active")
  currentPeriodEnd     DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user  User @relation(fields: [userId], references: [id])
}

enum Role { USER ADMIN }
enum Plan { FREE PRO ENTERPRISE }
```

---

## 📄 Pages to Build

### Marketing Pages
- `/` — Hero + Features + Testimonials + Pricing + CTA + Footer
- `/pricing` — Plan comparison table + FAQ
- `/blog` — (optional) content marketing

### Auth Pages
- `/login` — Email/password + Google OAuth
- `/register` — Sign up form
- `/forgot-password` — Request reset email
- `/reset-password` — New password form
- `/verify-email` — Email verification screen

### Dashboard Pages
- `/dashboard` — Overview stats + recent activity
- `/settings` — Profile, password, notifications
- `/settings/billing` — Current plan, invoices, upgrade/cancel

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token

GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me

GET    /api/billing/subscription
POST   /api/billing/create-checkout
POST   /api/billing/create-portal
POST   /api/billing/webhook         ← Stripe webhooks
```

---

## 🎨 UI Components to Build

- `<Navbar />` — Logo + nav links + CTA button
- `<Sidebar />` — Dashboard navigation
- `<PricingCard />` — Plan card with feature list
- `<StatsCard />` — Dashboard metric card
- `<DataTable />` — Sortable, filterable table
- `<UserAvatar />` — Profile picture with fallback initials
- `<LoadingSpinner />` — Centered loading state
- `<EmptyState />` — Empty list placeholder

---

## 🌍 Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/saas_db

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
RESEND_API_KEY=re_...

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

---

## 🚀 How to Use This Template

Tell your Architect Agent:
> "Use `templates/saas-web-app/TEMPLATE.md` as the base. Build a [your idea] SaaS app."

Then agents will follow this structure automatically.
