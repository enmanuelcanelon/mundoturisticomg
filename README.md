# Mundo Turístico MG

Full-stack travel agency platform: interactive **3D Earth globe**, destination search, **flight + hotel** booking flow, secure authentication, and a modular REST API.

**Brand:** Mundo Turístico MG · General Manager: Mariela López  
**Contact:** +58 414-9119477 · mundoturisticomg@gmail.com  
**Social:** [Instagram](https://www.instagram.com/mgmundoturistico/) · [Facebook](https://www.facebook.com/mgmundoturistico/)

---

## Overview

| Layer | Stack | Role |
|-------|--------|------|
| Frontend | Next.js 15, React 19, Tailwind CSS, react-globe.gl, Zustand | UI, 3D globe, booking UX |
| Backend | NestJS 11, Passport JWT, class-validator | Modular REST API |
| Database | PostgreSQL 16 + Prisma ORM | Relational data |
| Cache (ready) | Redis 7 | Sessions, rate limits, queues |
| Monorepo | npm workspaces | `apps/*` + `packages/*` |

### Design patterns

- **Modular monolith** (NestJS modules; ready to split later)
- **Prisma** as the data access layer
- **DTO + ValidationPipe** on every endpoint
- **JWT access + rotating refresh tokens** (hashed in DB)
- **Global guards** with `@Public()` / `@Roles()`
- **Client booking state** with Zustand + persistence
- **API envelope** `{ success, data }` (or error payload)

---

## Repository structure

```
mundoturisticomg/
├── apps/
│   ├── api/                 # NestJS REST API · JWT · Prisma
│   └── web/                 # Next.js 15 · globe · booking UI
├── packages/
│   └── shared/              # Shared domain types & constants
├── data/                    # Seed catalogs (airports, hotels, routes)
├── scripts/                 # Smoke tests and utilities
├── agents/                  # Multi-agent team playbooks (ops/product)
├── docker-compose.yml       # PostgreSQL 16 + Redis 7
├── .env.example             # Environment template (copy → .env)
└── package.json             # Workspace root scripts
```

---

## Requirements

- **Node.js** ≥ 20
- **npm** ≥ 9
- **Docker** + Docker Compose (for Postgres & Redis)

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/<your-org>/mundoturisticomg.git
cd mundoturisticomg

# 2. Environment
cp .env.example .env
# Edit secrets in .env before any production use

# 3. Install + DB + migrate + seed (needs Docker running)
npm run setup
# Or step by step:
#   npm install
#   npm run docker:up
#   npm run db:generate
#   npm run db:migrate
#   npm run db:seed

# 4. Dev servers (API :4000 + Web :3000)
npm run dev
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| API base | http://localhost:4000/api/v1 |
| Health | http://localhost:4000/api/v1/health |

### Demo users (seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@mundoturisticomg.com` | `AdminChangeMe123!` |
| Customer | `cliente@demo.com` | `Cliente123!` |

> Change seed passwords in production. Never commit a real `.env` file.

---

## Features

### Interactive globe (home)

- Earth with satellite-style texture and atmosphere
- Click a country → zoom, highlight, main cities
- Country/city search with autocomplete
- Destination marker ring on selection

### Booking flow

1. One-way or round-trip dates  
2. Passengers: adult, child, infant, senior  
3. Cabin class + hotel rooms  
4. Flight selection (outbound / return)  
5. Hotel selection  
6. Confirmation (requires login)

### Core API surface

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/auth/register`, `/login`, `/refresh`, `/logout` | Public |
| `GET` | `/auth/me` | JWT |
| `GET` | `/destinations/search?q=` | Public |
| `GET` | `/destinations/countries`, `/cities` | Public |
| `GET` | `/flights/search?...` | Public |
| `GET` | `/hotels/search?...` | Public |
| CRUD | `/bookings` | JWT |

More detail: [docs/API.md](docs/API.md) · Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · Full setup: [docs/SETUP.md](docs/SETUP.md)

---

## npm scripts

```bash
npm run dev            # API + Web concurrently
npm run dev:api        # API only
npm run dev:web        # Web only
npm run build          # shared → api → web
npm run db:generate    # Prisma client
npm run db:migrate     # Dev migrations
npm run db:seed        # Seed catalogs + demo users
npm run db:studio      # Prisma Studio
npm run docker:up      # Start Postgres + Redis
npm run docker:down    # Stop containers
npm run setup          # install + docker + migrate + seed
npm run test:smoke     # End-to-end smoke checks (API + web up)
npm run lint           # Lint api + web
```

---

## Security checklist

- [x] bcrypt password hashing (cost 12)
- [x] Short-lived JWT access + rotating refresh tokens (hashed in DB)
- [x] Helmet HTTP headers
- [x] Rate limiting (Throttler)
- [x] DTO whitelist validation
- [x] CORS restricted by origin
- [x] Roles: `CUSTOMER` / `AGENT` / `ADMIN`
- [ ] HTTPS + secrets in a vault (production)
- [ ] Email verification / 2FA (next iteration)
- [ ] Real payment gateway (next iteration)

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection (default host port **5433**) |
| `REDIS_URL` | Redis connection |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Auth secrets (min ~32 chars) |
| `API_PORT` / `API_PREFIX` | API bind (default `4000`, `api/v1`) |
| `CORS_ORIGINS` | Allowed front-end origins |
| `NEXT_PUBLIC_API_URL` | Browser → API base URL |
| `SEED_ADMIN_*` | Initial admin credentials |

---

## Testing

With API and web running:

```bash
npm run test:smoke
```

Covers health, destinations, auth login, flights, hotels, bookings (JWT), and main web routes.

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/SETUP.md](docs/SETUP.md) | Detailed local & Docker setup |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & monorepo layout |
| [docs/API.md](docs/API.md) | REST API reference |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [SECURITY.md](SECURITY.md) | Security policy |
| [AGENTS.md](AGENTS.md) | Multi-agent team map (ops; Spanish) |

---

## Roadmap (suggested)

1. Live GDS / Amadeus / Duffel flight inventory  
2. Payment gateway (Stripe / local VE methods)  
3. Agent admin console  
4. Email / WhatsApp notifications  
5. Multi-language & multi-currency (VES / USD)

---

## License

Proprietary — © Mundo Turístico MG. See [LICENSE](LICENSE).

---

Built for quality, scalability, and the Mundo Turístico MG brand.
