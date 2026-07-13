# Setup guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 (LTS recommended) |
| npm | ≥ 9 |
| Docker Desktop / Engine | Recent stable |
| Docker Compose | v2 (`docker compose`) |
| Git | Any recent version |

Optional: Prisma Studio UI (`npm run db:studio`), `curl` for smoke tests.

---

## 1. Clone and install

```bash
git clone https://github.com/<your-org>/mundoturisticomg.git
cd mundoturisticomg
npm install
```

This installs root workspace packages plus `apps/api`, `apps/web`, and `packages/shared`.

---

## 2. Environment file

```bash
cp .env.example .env
```

Edit at least:

- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — long random strings  
- `SEED_ADMIN_PASSWORD` — if you keep the seed admin  
- Database/Redis passwords if you change `docker-compose.yml`

**Never commit `.env`.** It is listed in `.gitignore`.

Default local ports:

| Service | Host port |
|---------|-----------|
| Web (Next.js) | 3000 |
| API (NestJS) | 4000 |
| PostgreSQL | **5433** → container 5432 |
| Redis | 6379 |

PostgreSQL uses **5433** on the host to avoid clashing with a local Postgres on 5432.

---

## 3. Infrastructure (Docker)

```bash
npm run docker:up
# equivalent: docker compose up -d
```

Services:

- `mtmg-postgres` — PostgreSQL 16  
- `mtmg-redis` — Redis 7 (password from compose / `REDIS_URL`)

Check health:

```bash
docker compose ps
docker compose logs -f postgres
```

Stop:

```bash
npm run docker:down
```

Volumes `mtmg_pg_data` and `mtmg_redis_data` persist data between restarts.

---

## 4. Database: generate, migrate, seed

```bash
npm run db:generate   # Prisma Client
npm run db:migrate    # Apply migrations (dev)
npm run db:seed       # Catalogs + demo users
```

One-shot from a clean machine:

```bash
npm run setup
```

(`setup` = install + docker up + generate + migrate + seed)

### Demo accounts after seed

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mundoturisticomg.com | AdminChangeMe123! |
| Customer | cliente@demo.com | Cliente123! |

Seed data also loads airport/city/hotel catalogs under `data/`.

---

## 5. Run development servers

```bash
npm run dev
```

Or separately:

```bash
npm run dev:api   # http://localhost:4000/api/v1
npm run dev:web   # http://localhost:3000
```

Verify:

```bash
curl -s http://localhost:4000/api/v1/health
```

---

## 6. Production-style build

```bash
npm run build
```

Order: `@mtmg/shared` → `@mtmg/api` → `@mtmg/web`.

Start API after build (from workspace or with process manager):

```bash
npm run start:prod -w @mtmg/api
# or: node apps/api/dist/main.js
```

Web:

```bash
npm run start -w @mtmg/web
```

Use real secrets, HTTPS, and managed Postgres/Redis in production. Prefer `prisma migrate deploy` over `migrate dev`.

---

## 7. Smoke tests

With both servers up:

```bash
npm run test:smoke
```

Override URLs if needed:

```bash
API_URL=http://localhost:4000/api/v1 WEB_URL=http://localhost:3000 npm run test:smoke
```

---

## Troubleshooting

### Port already in use

- Change `API_PORT` / Next port, or free 3000 / 4000 / 5433 / 6379.  
- Redis password must match `REDIS_URL` and `docker-compose.yml`.

### Prisma cannot connect

- Confirm `docker compose ps` shows Postgres healthy.  
- Confirm `DATABASE_URL` uses port **5433** for local Docker mapping.  
- Wait a few seconds after `docker:up` before migrating.

### Module not found / workspace issues

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
npm run db:generate
npm run build -w @mtmg/shared
```

### Three.js / globe blank

- Use a modern browser with WebGL.  
- Check browser console; ensure `npm install` completed (Three is pinned via root `overrides`).

### Windows notes

- Prefer WSL2 for Docker + bash smoke script.  
- Line endings: keep `LF` for shell scripts under `scripts/`.

---

## Next steps

- [Architecture](ARCHITECTURE.md)  
- [API reference](API.md)  
- [Contributing](../CONTRIBUTING.md)  
