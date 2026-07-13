# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `1.x` (main) | Yes |
| Older untagged | Best effort |

## Reporting a vulnerability

**Do not** open a public GitHub issue for security vulnerabilities.

Please report privately to:

- **Email:** mundoturisticomg@gmail.com  
- **Subject:** `[SECURITY] Mundo Turístico MG`

Include:

1. Description of the issue  
2. Steps to reproduce / proof of concept (non-destructive)  
3. Affected component (API, web, auth, deps)  
4. Your contact details for follow-up  

We will acknowledge receipt when possible and work on a fix before any public disclosure.

## Security baseline (application)

- Passwords hashed with **bcrypt** (cost 12)  
- **JWT** access tokens with short TTL + **rotating refresh** tokens stored hashed  
- **Helmet**, rate limiting, DTO whitelist validation  
- **CORS** allow-list via `CORS_ORIGINS`  
- Role-based access: `CUSTOMER` / `AGENT` / `ADMIN`  

## Hardening checklist for deployers

- [ ] Replace all secrets in `.env` (JWT, DB, Redis, seed admin)  
- [ ] Never commit `.env` or private keys  
- [ ] Serve only over **HTTPS** in production  
- [ ] Restrict database and Redis to private networks  
- [ ] Use strong, unique DB/Redis passwords  
- [ ] Run `prisma migrate deploy` from CI/CD with least privilege  
- [ ] Rotate JWT secrets if compromise is suspected  
- [ ] Review dependency advisories regularly (`npm audit`)  
- [ ] Disable or change demo seed users in production  

## Out of scope (current product stage)

- Live payment PCI DSS compliance (gateway not integrated yet)  
- Full 2FA / email verification (planned)  
- External GDS credential management (planned)

Thank you for helping keep travelers’ data safe.
