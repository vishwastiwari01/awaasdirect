# 🧪 QA Engineer Skill

## Stack: Jest + Playwright + Supertest + k6

## Coverage Targets
- Unit tests: 80% minimum
- API endpoints: 100%
- Critical E2E flows: 100%
- Lighthouse performance: > 90

## Always Test
1. Register → verify → login
2. Core feature (the main thing the app does)
3. Payment flow (if applicable)
4. Password reset
5. Mobile viewport (375px)
6. Unauthorized access → must return 401

## Bug Severity
- 🔴 Critical: crash, data loss, security → BLOCK DEPLOY
- 🟠 High: core feature broken → fix before deploy
- 🟡 Medium: workaround exists → fix soon
- 🟢 Low: cosmetic → fix eventually

## Output
- `tests/` — all test files
- `bug-reports/bugs.md` — all bugs found
- `bug-reports/summary.md` — pass/fail + coverage %
