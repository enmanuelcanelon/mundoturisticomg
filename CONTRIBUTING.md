# Contributing

Thanks for helping improve **Mundo Turístico MG**. This guide keeps the monorepo consistent and safe for production travel workflows.

## Before you start

1. Read [README.md](README.md) and [docs/SETUP.md](docs/SETUP.md).  
2. Use Node.js ≥ 20 and Docker for local Postgres/Redis.  
3. Never commit secrets (`.env`, keys, production credentials).  
4. Prefer small, focused pull requests.

## Development workflow

```bash
cp .env.example .env
npm install
npm run docker:up
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

In another terminal (with API + web running):

```bash
npm run test:smoke
```

### Branch naming

- `feat/<short-description>` — new features  
- `fix/<short-description>` — bug fixes  
- `docs/<short-description>` — documentation only  
- `chore/<short-description>` — tooling, deps, CI  

### Commit messages

Use clear, imperative English (or Spanish if the team prefers), for example:

- `feat(web): improve globe country search`
- `fix(api): rotate refresh tokens on logout`
- `docs: add English setup guide`

## Code guidelines

| Area | Expectation |
|------|-------------|
| TypeScript | Strict typing; avoid `any` unless justified |
| API | DTO validation, guards, modular Nest services |
| Web | App Router, reusable components, brand tokens |
| Shared types | Prefer `@mtmg/shared` for cross-app enums/types |
| Security | No secrets in logs; validate all inputs |
| Brand | Blue + orange + white MG identity |

### UI / brand

- Contact and social links should match production brand data.  
- Keep Spanish customer-facing copy consistent with the Venezuelan market unless localizing.

### Database

- Schema changes go through **Prisma migrations** (`apps/api/prisma/migrations`).  
- Do not hand-edit production DBs without a migration.  
- Seed changes should remain idempotent where possible.

## Pull requests

1. Branch from `main` (or the agreed default).  
2. Implement + self-test (`npm run build`, `npm run test:smoke` when relevant).  
3. Open a PR with:  
   - What changed and why  
   - How to test  
   - Screenshots for UI changes  
4. Keep PRs reviewable (avoid mixing unrelated refactors).

## Reporting bugs

Include:

- Steps to reproduce  
- Expected vs actual behavior  
- Environment (OS, Node version, Docker yes/no)  
- Relevant logs (redact secrets)

Security issues: see [SECURITY.md](SECURITY.md) — do not open public issues for vulnerabilities.

## License

By contributing, you agree that your contributions are owned by Mundo Turístico MG under the project [LICENSE](LICENSE), unless a separate agreement states otherwise.
