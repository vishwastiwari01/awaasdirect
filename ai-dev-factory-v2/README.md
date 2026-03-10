# 🏭 AI Dev Factory v2

A complete multi-agent system for building production-grade software with AI — websites, mobile apps, SaaS platforms, AI tools, and more.

---

## What's Inside

```
ai-dev-factory/
│
├── agents/                    ← 16 specialized agents
│   ├── orchestrator/          ← controls all other agents
│   ├── product-manager/       ← PRD, features, user stories
│   ├── architect/             ← system design, tech stack
│   ├── designer/              ← UI/UX, design system, wireframes
│   ├── frontend/              ← React, Next.js, Flutter
│   ├── backend/               ← Node.js, Express, APIs
│   ├── database/              ← PostgreSQL, Prisma, Redis
│   ├── ai/                    ← LLM, RAG, LangChain
│   ├── integrations/          ← Stripe, email, OAuth, S3
│   ├── security/              ← vulnerability audit
│   ├── qa/                    ← Jest, Playwright, tests
│   ├── performance/           ← Lighthouse, optimization
│   ├── devops/                ← Docker, CI/CD, deployment
│   ├── reflection/            ← final code review
│   ├── marketing/             ← copy, Product Hunt, social
│   ├── data/                  ← analytics, metrics, tracking
│   └── one-man-army/          ← single agent = entire team
│       ├── brain.md
│       ├── planner.md
│       ├── execution-engine.md
│       ├── skill-registry.md
│       └── skills/            ← embedded expert modules
│
├── templates/                 ← 7 ready-to-use project templates
│   ├── saas-web-app/
│   ├── mobile-app/
│   ├── ai-chatbot/
│   ├── ecommerce/
│   ├── dashboard/
│   ├── landing-page/
│   └── api-only/
│
└── workflows/                 ← step-by-step build guides
    ├── build-saas.md
    ├── build-mobile-app.md
    ├── build-ai-tool.md
    └── build-landing-page.md
```

---

## How to Use

### Option A — Full Team (16 agents working together)

**Step 1:** Open Antigravity agent chat (`Ctrl + L`)

**Step 2:** Paste this to start any project:
```
Use the skill at agents/orchestrator/SKILL.md

I want to build: [YOUR IDEA]

Follow the workflow at: workflows/build-saas.md  (or build-mobile-app.md etc.)
Use the template at: templates/saas-web-app/TEMPLATE.md

Start with the product-manager agent.
```

**Step 3:** Review and approve the plan the Product Manager produces before anything is built.

**Step 4:** Call each agent in order (the orchestrator will guide you).

---

### Option B — One-Man-Army (single autonomous agent)

For when you want one agent to handle everything:
```
Use all files in agents/one-man-army/

I want to build: [YOUR IDEA]

Read brain.md, then planner.md, produce the plan.
Wait for my approval, then execute using execution-engine.md.
Load the appropriate skill from skill-registry.md for each domain.
```

---

### Option C — Single Agent (just one specific task)

For specific jobs:
```
Use agents/designer/SKILL.md
Design the complete UI system for [project] based on docs/architecture.md
```

---

## Agent Pipeline (Full Build)

```
product-manager → architect → designer → database → backend
→ frontend → ai (if needed) → integrations → data
→ security → qa → performance → devops → reflection → marketing
```

## Quick Reference — What Each Agent Does

| Agent | Job | Key Output |
|-------|-----|-----------|
| orchestrator | controls all agents | docs/project-state.md |
| product-manager | idea → PRD | docs/prd.md, docs/features.md |
| architect | plan → tech blueprint | docs/architecture.md |
| designer | blueprint → visual system | design/design-system.md |
| database | schema + migrations | prisma/schema.prisma |
| backend | REST API | src/routes/, src/services/ |
| frontend | UI + pages | app/, components/ |
| ai | LLM features | ai/services/, ai/prompts/ |
| integrations | Stripe, email, OAuth | lib/stripe.ts, emails/ |
| security | vulnerability audit | security/security-report.md |
| qa | automated tests | tests/, bug-reports/ |
| performance | speed optimization | performance/report.md |
| devops | deploy pipeline | Dockerfile, .github/workflows/ |
| reflection | final review | docs/reflection-report.md, README |
| marketing | launch assets | marketing/ |
| data | analytics setup | analytics/events.md |

## The Golden Rules

1. **Always start with product-manager** — never skip the plan
2. **Always end with reflection** — never skip the review
3. **Never let agents code without an approved architecture**
4. **Never deploy without security + QA green**
5. **You are the CTO** — review key decisions, don't just rubber stamp

---

*AI Dev Factory v2 — built for Antigravity*
