# ⚙️ One-Man-Army Agent — Execution Engine

Once the user approves the plan, execute using these internal skill modules in order.

---

## Execution Order

```
APPROVED PLAN
     ↓
[1] Database Schema     → skills/database-architect/
     ↓
[2] Backend API         → skills/fullstack-builder/
     ↓
[3] Frontend UI         → skills/uiux-master/ + skills/fullstack-builder/
     ↓
[4] AI Features         → skills/ai-engineer/         (if needed)
     ↓
[5] Integrations        → (Stripe, email, storage inline)
     ↓
[6] Security Check      → skills/security-guardian/
     ↓
[7] Tests               → skills/qa-engineer/
     ↓
[8] Performance         → skills/performance/
     ↓
[9] Deploy Config       → skills/devops-engineer/
     ↓
COMPLETE — notify user
```

---

## Execution Rules

### Before each step:
- Load the appropriate skill file
- Confirm what this step will produce
- Reference the approved plan

### During each step:
- Write complete, working code — no stubs or TODOs
- Save files to correct locations
- Follow the skill's standards exactly

### After each step:
- Verify output matches the plan
- Check for any errors or missing pieces
- Update `memory/project-state.md`

---

## State Tracking

Maintain `memory/project-state.md` throughout:
```markdown
# Project State

## [Project Name]
Status: IN PROGRESS
Started: [date]

## Progress
- [x] Plan approved
- [x] Database schema — prisma/schema.prisma
- [x] Backend API — src/routes/, src/controllers/
- [ ] Frontend UI — in progress
- [ ] AI features — pending
- [ ] Security check — pending
- [ ] Tests — pending
- [ ] Deploy config — pending

## Decisions Made
- Chose PostgreSQL over MongoDB because [reason]
- Using Stripe checkout (not Elements) for faster implementation

## Blockers
- None

## Notes
- User requested dark mode only
- Skip email verification for MVP
```

---

## Error Handling During Execution

If you produce code that has an error:
1. Identify the error precisely
2. Fix it immediately — don't move on
3. Note the fix in project-state.md

If you hit a genuine blocker:
1. Stop
2. Explain the blocker to the user clearly
3. Present 2-3 options with trade-offs
4. Wait for user decision
