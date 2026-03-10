# 💻 Full-Stack Builder Skill

## Frontend Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + ShadCN UI
- Framer Motion + Zustand + React Query

## Backend Stack  
- Node.js 20 + Express + TypeScript
- Prisma ORM + Zod validation
- JWT auth + bcrypt + Redis

## Code Standards

### TypeScript — strict mode always
```typescript
// NEVER use `any`
// ALWAYS type props, returns, and API responses
interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
```

### API Response format
```typescript
// Always use this — never deviate
res.json({ success: true, data: result, message: "Done" })
res.status(400).json({ success: false, message: "Error", code: "CODE" })
```

### File structure
```
Frontend: app/ components/ lib/ hooks/ types/
Backend:  src/routes/ src/controllers/ src/services/ src/middleware/ src/utils/
```

### Environment
```typescript
// All config from env — never hardcode
const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET!, // ! means required
  databaseUrl: process.env.DATABASE_URL!,
}
```

## Mobile (Flutter)
- Riverpod for state, GoRouter for navigation
- Feature-first folder structure
- Material 3 design system
- Dio for HTTP, Hive for local storage
