# 📚 One-Man-Army Agent — Skill Registry

This file maps each domain to its skill module. Load the appropriate skill before working in that domain.

---

## Skill Map

| Domain | Skill File | When to Use |
|--------|-----------|-------------|
| UI/UX Design | `skills/uiux-master/SKILL.md` | Designing any visual component, page, or design system |
| Frontend Code | `skills/fullstack-builder/SKILL.md` | Writing React, Next.js, or Flutter code |
| Backend Code | `skills/fullstack-builder/SKILL.md` | Writing API routes, controllers, services |
| Database | `skills/database-architect/SKILL.md` | Schema design, migrations, queries |
| AI/ML | `skills/ai-engineer/SKILL.md` | LLM integration, RAG, embeddings, AI features |
| Security | `skills/security-guardian/SKILL.md` | Auth implementation, security audit, OWASP checks |
| Testing | `skills/qa-engineer/SKILL.md` | Writing tests, bug detection, coverage |
| Performance | `skills/performance/SKILL.md` | Bundle optimization, query optimization, Lighthouse |
| DevOps | `skills/devops-engineer/SKILL.md` | Docker, CI/CD, deployment, monitoring |

---

## How to Load a Skill

Before starting work in any domain:
1. Reference the skill file for that domain
2. Apply its standards, patterns, and rules
3. Produce the outputs it defines

---

## Skill Combination Examples

### Building a Dashboard Page
Load: `uiux-master` (design) + `fullstack-builder` (code) + `qa-engineer` (test)

### Setting Up Auth
Load: `fullstack-builder` (API) + `database-architect` (schema) + `security-guardian` (audit)

### Adding AI Chat Feature
Load: `ai-engineer` (LLM) + `fullstack-builder` (API + UI) + `security-guardian` (input validation)

### Deploying to Production
Load: `security-guardian` (audit) + `qa-engineer` (tests) + `performance` (optimize) + `devops-engineer` (deploy)
