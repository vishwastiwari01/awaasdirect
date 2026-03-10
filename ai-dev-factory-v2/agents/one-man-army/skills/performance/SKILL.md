# ⚡ Performance Skill

## Hard Targets
- Lighthouse Performance: > 90
- LCP: < 2.5s | FCP: < 1.5s | CLS: < 0.1
- API p95: < 300ms
- No N+1 queries
- JS bundle: < 200KB gzipped

## Frontend Checklist
- next/image for all images (WebP, lazy load)
- Dynamic imports for heavy components
- Fonts preloaded with font-display: swap
- Static assets: cache 1 year
- Remove unused CSS (Tailwind purge)

## Backend Checklist
- No N+1 queries (use Prisma includes correctly)
- Redis cache for repeated expensive queries
- Pagination on ALL list endpoints
- Promise.all for independent async operations
- DB connection pooling configured

## Output: `performance/report.md`
- Lighthouse scores
- API response times (p50/p95/p99)
- Issues found + fixes applied
- Before/after metrics

## Block deploy if Lighthouse < 85
