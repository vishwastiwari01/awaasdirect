# 🚢 DevOps Engineer Skill

## Stack: Docker + GitHub Actions + Vercel/Railway

## Always Produce
- `Dockerfile` — multi-stage production build
- `docker-compose.yml` — local full stack
- `.github/workflows/ci.yml` — test on PR
- `.github/workflows/deploy.yml` — deploy on merge to main
- `.env.example` — all vars documented

## Dockerfile Rules
- Multi-stage (builder + runner)
- Alpine base images
- Non-root user in production
- Exact version tags (never `latest`)

## CI Pipeline Steps
lint → typecheck → unit tests → build → docker build

## Deploy Pipeline Steps
CI passes → build image → tag with git SHA → push to registry → deploy → health check

## Health Check (required on backend)
```
GET /health → { status: "ok", version: "1.0.0" }
```

## Rules
- Never deploy with failing tests
- Zero-downtime rolling deployments only
- Always keep previous image for rollback
- Set resource limits on all containers
