# 🚀 Workflow: Build SaaS Web App

Use this workflow when building any subscription-based web product.

---

## Trigger Prompt (paste this to start)

```
Use the skill at agents/orchestrator/SKILL.md

I want to build a SaaS app: [DESCRIBE YOUR IDEA]

Follow this workflow: workflows/build-saas.md
Use this template: templates/saas-web-app/TEMPLATE.md

Start with the product-manager agent.
```

---

## Agent Execution Order

### Step 1 — Product Manager
```
Use agents/product-manager/SKILL.md
Produce: docs/prd.md, docs/features.md, docs/user-stories.md, tasks/tasklist.json
```
**→ USER REVIEWS AND APPROVES BEFORE CONTINUING**

### Step 2 — Architect
```
Use agents/architect/SKILL.md
Read: docs/prd.md, docs/features.md, templates/saas-web-app/TEMPLATE.md
Produce: docs/architecture.md, docs/folder-structure.md, docs/tech-stack.md
```

### Step 3 — Designer
```
Use agents/designer/SKILL.md
Read: docs/architecture.md, docs/features.md
Produce: design/design-system.md, design/wireframes.md, design/components.md
```

### Step 4 — Database
```
Use agents/database/SKILL.md
Read: docs/architecture.md, docs/user-stories.md
Produce: prisma/schema.prisma, prisma/seed.ts, docs/database-diagram.md
```

### Step 5 — Backend
```
Use agents/backend/SKILL.md
Read: docs/architecture.md, prisma/schema.prisma
Produce: src/routes/, src/controllers/, src/services/, src/middleware/
```

### Step 6 — Frontend
```
Use agents/frontend/SKILL.md
Read: design/design-system.md, design/wireframes.md, docs/architecture.md
Produce: app/, components/, lib/
```

### Step 7 — Integrations
```
Use agents/integrations/SKILL.md
Read: docs/features.md, docs/architecture.md
Produce: Stripe, email, OAuth, S3 setup
```

### Step 8 — Data & Analytics
```
Use agents/data/SKILL.md
Produce: analytics/events.md, lib/analytics.ts, analytics/dashboard.sql
```

### Step 9 — Security
```
Use agents/security/SKILL.md
Produce: security/security-report.md
⚠️ Fix all CRITICAL issues before proceeding
```

### Step 10 — QA
```
Use agents/qa/SKILL.md
Produce: tests/, bug-reports/
⚠️ Fix all 🔴 Critical bugs before proceeding
```

### Step 11 — Performance
```
Use agents/performance/SKILL.md
Produce: performance/report.md
⚠️ Fix if Lighthouse < 85
```

### Step 12 — DevOps
```
Use agents/devops/SKILL.md
Produce: Dockerfile, docker-compose.yml, .github/workflows/
```

### Step 13 — Reflection (ALWAYS LAST)
```
Use agents/reflection/SKILL.md
Produce: docs/reflection-report.md, README.md
```

### Step 14 — Marketing (optional)
```
Use agents/marketing/SKILL.md
Produce: marketing/landing-page.md, marketing/product-hunt.md, marketing/social-posts.md
```

---

## Definition of Done
- [ ] All features from PRD implemented
- [ ] Security report: no CRITICAL issues
- [ ] QA: no 🔴 Critical bugs
- [ ] Lighthouse: > 85 on all pages
- [ ] Reflection: APPROVED
- [ ] README complete
- [ ] Deploy pipeline working
