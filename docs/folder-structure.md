# Folder Structure — AwaasDirect

> The project is a **monorepo** with two deployable applications: `web/` (Next.js → Vercel) and `api/` (Express → Railway). Shared types live in `packages/types/`.

---

```
awaasdirect/                          # Monorepo root
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + test on every PR
│       └── deploy.yml                # Deploy on merge to main
│
├── packages/
│   └── types/                        # Shared TypeScript types (used by web + api)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── user.types.ts         # User, VerificationStatus
│           ├── property.types.ts     # Property, PropertyType, ListingStatus
│           ├── chat.types.ts         # ChatThread, ChatMessage
│           └── api.types.ts          # API request/response shapes
│
├── web/                              # Next.js 14 Frontend (→ Vercel)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .env.local.example
│   │
│   ├── public/
│   │   ├── logo.svg
│   │   ├── og-image.png              # Open Graph image for SEO
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.tsx            # Root layout (fonts, providers)
│   │   │   ├── page.tsx              # Homepage (SSG)
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── api/                  # Next.js Route Handlers (auth only)
│   │   │   │   └── auth/
│   │   │   │       └── [...nextauth]/
│   │   │   │           └── route.ts  # NextAuth handler
│   │   │   │
│   │   │   ├── (public)/             # Public routes (no auth required)
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx      # Search results page (CSR)
│   │   │   │   └── properties/
│   │   │   │       └── [id]/
│   │   │   │           ├── page.tsx  # Property detail (SSR)
│   │   │   │           └── loading.tsx
│   │   │   │
│   │   │   ├── (auth)/               # Auth flow pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx      # Phone OTP login
│   │   │   │   └── verify-kyc/
│   │   │   │       └── page.tsx      # Aadhaar DigiLocker KYC
│   │   │   │
│   │   │   └── (protected)/          # Auth-gated routes (middleware protected)
│   │   │       ├── dashboard/
│   │   │       │   ├── page.tsx      # Owner dashboard (listing table)
│   │   │       │   └── listings/
│   │   │       │       ├── new/
│   │   │       │       │   └── page.tsx   # Create listing wizard
│   │   │       │       └── [id]/
│   │   │       │           └── edit/
│   │   │       │               └── page.tsx # Edit listing
│   │   │       ├── messages/
│   │   │       │   └── page.tsx      # Chat inbox + real-time thread
│   │   │       └── saved/
│   │   │           └── page.tsx      # Saved/shortlisted properties
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   └── toast.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   │
│   │   │   ├── property/
│   │   │   │   ├── PropertyCard.tsx       # Search result tile
│   │   │   │   ├── PropertyGrid.tsx       # Grid of cards + pagination
│   │   │   │   ├── PropertyGallery.tsx    # Lightbox photo gallery
│   │   │   │   ├── PropertyFilters.tsx    # Filter panel sidebar
│   │   │   │   ├── VirtualTourEmbed.tsx   # Kuula iframe wrapper
│   │   │   │   ├── FloorPlanGenerator.tsx # AI floor plan form + display
│   │   │   │   └── RERABadge.tsx          # RERA verified badge
│   │   │   │
│   │   │   ├── listing/
│   │   │   │   ├── ListingWizard.tsx      # Multi-step create/edit form
│   │   │   │   ├── PhotoUploader.tsx      # Drag-and-drop S3 upload
│   │   │   │   ├── ListingTable.tsx       # Dashboard listing table
│   │   │   │   └── VirtualTourStatus.tsx  # Processing/Ready indicator
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatInbox.tsx          # Thread list sidebar
│   │   │   │   ├── ChatWindow.tsx         # Message bubbles + input
│   │   │   │   └── ChatBubble.tsx         # Single message component
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── OtpInput.tsx           # 6-digit OTP component
│   │   │       └── VerifiedBadge.tsx      # Aadhaar verified shield icon
│   │   │
│   │   ├── lib/
│   │   │   ├── auth.ts               # NextAuth config (providers, callbacks)
│   │   │   ├── api-client.ts         # Axios instance pointing to Express API
│   │   │   ├── socket.ts             # Socket.io client singleton
│   │   │   ├── utils.ts              # cn(), formatPrice(), formatArea()
│   │   │   └── validations.ts        # Zod schemas for forms
│   │   │
│   │   ├── hooks/
│   │   │   ├── useProperties.ts      # TanStack Query hooks for listings
│   │   │   ├── useChat.ts            # Socket.io chat hook
│   │   │   ├── useFloorPlan.ts       # Floor plan generation hook
│   │   │   └── useAuth.ts            # Session + verification status
│   │   │
│   │   └── store/
│   │       ├── authStore.ts          # Zustand: user session, kyc status
│   │       └── chatStore.ts          # Zustand: unread counts, active thread
│
├── api/                              # Express.js Backend (→ Railway)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   │
│   ├── prisma/
│   │   ├── schema.prisma             # Full DB schema (all models)
│   │   └── migrations/               # Prisma migration files
│   │
│   └── src/
│       ├── app.ts                    # Express app setup (middleware, routers)
│       ├── server.ts                 # HTTP + Socket.io server bootstrap
│       │
│       ├── config/
│       │   ├── env.ts                # Validated env vars (Zod)
│       │   ├── database.ts           # Prisma client singleton
│       │   ├── s3.ts                 # AWS S3 client config
│       │   └── openai.ts             # OpenAI client config
│       │
│       ├── routes/
│       │   ├── auth.routes.ts        # /api/auth/*
│       │   ├── property.routes.ts    # /api/properties/*
│       │   ├── chat.routes.ts        # /api/chat/*
│       │   ├── saved.routes.ts       # /api/saved/*
│       │   └── report.routes.ts      # /api/reports/*
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── property.controller.ts
│       │   ├── photo.controller.ts
│       │   ├── chat.controller.ts
│       │   ├── ai.controller.ts
│       │   └── saved.controller.ts
│       │
│       ├── services/
│       │   ├── auth.service.ts       # OTP logic, DigiLocker integration
│       │   ├── listing.service.ts    # Property CRUD, search query builder
│       │   ├── photo.service.ts      # S3 upload, presigned URLs
│       │   ├── chat.service.ts       # Thread + message operations
│       │   ├── ai.service.ts         # OpenAI floor plan + virtual tour
│       │   ├── email.service.ts      # Resend email notifications
│       │   └── rera.service.ts       # RERA number format validation
│       │
│       ├── middleware/
│       │   ├── authenticate.ts       # JWT verification → req.user
│       │   ├── requireVerified.ts    # Aadhaar KYC gate
│       │   ├── rateLimiter.ts        # express-rate-limit instances
│       │   ├── upload.ts             # Multer S3 upload middleware
│       │   └── errorHandler.ts       # Global error → JSON response
│       │
│       ├── socket/
│       │   ├── socket.server.ts      # Socket.io setup + namespace
│       │   └── chat.socket.ts        # Chat event handlers
│       │
│       ├── utils/
│       │   ├── jwt.ts                # Sign + verify JWT
│       │   ├── otp.ts                # OTP generation + MSG91 send
│       │   ├── rera.ts               # State-specific RERA regex patterns
│       │   └── s3.ts                 # S3 helper: upload, presign, delete
│       │
│       └── types/
│           └── express.d.ts          # Extend Express Request with req.user
│
├── docs/                             # All product + architecture docs
│   ├── prd.md
│   ├── features.md
│   ├── user-stories.md
│   ├── architecture.md
│   ├── folder-structure.md
│   └── tech-stack.md
│
├── tasks/
│   └── tasklist.json                 # Agent task breakdown
│
├── .gitignore
├── README.md
└── package.json                      # Root: workspace config (npm workspaces)
```

---

## Key Conventions

| Convention | Detail |
|-----------|--------|
| **Naming** | `kebab-case` for files; `PascalCase` for React components; `camelCase` for functions/variables |
| **Barrel exports** | Each component folder has `index.ts` re-exporting public members |
| **Colocation** | Tests live next to source: `component.test.tsx`, `service.spec.ts` |
| **Env vars** | All env vars validated by Zod in `config/env.ts` at startup — app fails fast if any required var is missing |
| **Error handling** | All controller functions wrapped in `asyncHandler()`; errors propagate to global `errorHandler` middleware |
| **Type sharing** | `packages/types` is a workspace package — imported as `@awaasdirect/types` in both `web` and `api` |
