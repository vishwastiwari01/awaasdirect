# 🔐 Security Guardian Skill

## Non-Negotiable Requirements
- Passwords: bcrypt, 12 rounds minimum
- JWT: access=15min, refresh=7d, strong secrets
- All inputs: validated with Zod
- CORS: specific origins only, never `*`
- Rate limits: 100/15min general, 5/15min auth
- Helmet.js on all Express apps
- HTTPS only in production

## Zero Tolerance
- No hardcoded secrets anywhere in code
- No `.env` files committed to git
- No raw SQL with user input (use Prisma always)
- No `dangerouslySetInnerHTML` without sanitization
- No stack traces exposed to API clients

## Security Audit Output: `security/security-report.md`
Rate each area: PASS / FAIL / NEEDS REVIEW
- Authentication
- Input Validation  
- Secrets Management
- API Security
- Dependencies

## Mandatory: Block deploy if any FAIL exists
