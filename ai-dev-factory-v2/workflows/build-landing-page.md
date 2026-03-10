# 🌐 Workflow: Build Landing Page

Fast workflow — no backend needed.

---

## Trigger Prompt
```
Use agents/orchestrator/SKILL.md

I want to build a landing page for: [PRODUCT NAME]
Target audience: [WHO]
Main value prop: [WHAT IT DOES]

Follow: workflows/build-landing-page.md
Use template: templates/landing-page/TEMPLATE.md
```

## Agent Order (fast — 4 steps)

### Step 1 — Product Manager (lite)
Just produce: one-page brief with headline, 3 features, target user, CTA

### Step 2 — Designer
Page sections layout, color palette, typography, component plan

### Step 3 — Frontend
Build complete Next.js or plain HTML landing page
Must include: Hero, Features, How It Works, Pricing, FAQ, CTA, Footer

### Step 4 — Marketing
Copy for all sections, Product Hunt tagline, 3 social posts

**Skip:** backend, database, security, QA, devops (not needed for landing page)

---

# ⚡ Workflow: Quick Prototype

Use when you just want to test an idea fast — skip non-essentials.

---

## Trigger Prompt
```
I want a quick prototype of: [IDEA]
Skip tests, skip deployment, just build the core.

Use agents/architect/SKILL.md then agents/frontend/SKILL.md then agents/backend/SKILL.md
```

## Minimal Agent Order
1. Architect (lite — 15 min plan max)
2. Database (schema only)
3. Backend (core endpoints only)
4. Frontend (core screens only)
5. Skip: security deep audit, full QA, devops, marketing

**Use for:** hackathons, demos, proof of concepts, client previews

---

# 🔌 Workflow: Add Feature to Existing Project

---

## Trigger Prompt
```
I have an existing project at [folder].
I want to add: [FEATURE DESCRIPTION]

Use agents/architect/SKILL.md to plan the addition.
Then call the relevant agents for implementation.
```

## Steps
1. Architect reviews existing code + plans the new feature
2. Database agent — adds new tables/columns if needed
3. Backend agent — adds new endpoints
4. Frontend agent — adds new UI
5. Integrations agent — if new third-party service needed
6. QA agent — tests new feature + regression tests
7. Reflection agent — reviews the addition
