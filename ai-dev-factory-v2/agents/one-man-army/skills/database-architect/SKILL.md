# 🗄️ Database Architect Skill

## Stack: PostgreSQL + Prisma + Redis

## Schema Rules
- Every table: `id (cuid)`, `createdAt`, `updatedAt`
- Soft deletes: `deletedAt DateTime?`
- UUIDs (cuid) not auto-increment
- Normalize to 3NF minimum
- Index all FKs and WHERE/ORDER BY columns

## Naming
- Models: PascalCase singular (`User`, `OrderItem`)
- Fields: camelCase (`firstName`, `createdAt`)
- FKs: `userId`, `productId`

## Always Produce
1. `prisma/schema.prisma` — full schema
2. `prisma/seed.ts` — realistic seed data
3. `docs/database-diagram.md` — text ER diagram

## Seed Credentials
- Admin: `admin@devfactory.com` / `Admin123!`
- User: `user@devfactory.com` / `User123!`

## Redis Usage
- Session storage
- Rate limit counters
- LLM response cache (TTL 1hr)
- Job queues (BullMQ)
