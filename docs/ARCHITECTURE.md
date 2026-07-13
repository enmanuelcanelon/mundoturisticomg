# Architecture

## High-level view

```
┌─────────────────────┐     HTTPS/JSON      ┌──────────────────────┐
│  apps/web (Next.js) │ ──────────────────► │  apps/api (NestJS)   │
│  Globe · Booking UI │ ◄────────────────── │  REST /api/v1        │
│  Zustand stores     │                     │  JWT · Guards · DTOs │
└─────────────────────┘                     └──────────┬───────────┘
                                                       │
                              ┌────────────────────────┼────────────────┐
                              ▼                        ▼                ▼
                       PostgreSQL 16                 Redis 7      Catalog JSON
                       (Prisma ORM)                 (ready)       (data/* seed)
```

The system is a **modular monolith**: one deployable API with clear domain modules, shared types package, and a separate SPA-style Next.js app.

---

## Monorepo layout

| Path | Package | Responsibility |
|------|---------|----------------|
| `apps/api` | `@mtmg/api` | NestJS HTTP API, auth, bookings, search |
| `apps/web` | `@mtmg/web` | Next.js App Router UI + 3D globe |
| `packages/shared` | `@mtmg/shared` | Domain enums/types shared by api & web |
| `data/` | — | Static catalogs used by seed (airports, hotels, routes) |
| `agents/` | — | Multi-agent operating playbooks (business + tech) |
| `scripts/` | — | Smoke QA and automation |

Root `package.json` uses **npm workspaces** and orchestrates `dev`, `build`, DB, and Docker scripts.

---

## Backend (`apps/api`)

### Stack

- NestJS 11 + Express platform  
- Prisma 6 → PostgreSQL  
- Passport JWT + bcrypt  
- Helmet, Throttler, cookie-parser  
- Global validation (`class-validator` whitelist)  
- Response transform + HTTP exception filters  

### Modules (domain)

| Module | Purpose |
|--------|---------|
| `AuthModule` | Register, login, refresh, logout, `me` |
| `UsersModule` | User profiles / admin-facing user ops |
| `DestinationsModule` | Countries, cities, search |
| `FlightsModule` | Flight search (catalog / demo inventory) |
| `HotelsModule` | Hotel search by destination & dates |
| `BookingsModule` | Create/list/manage bookings (JWT) |
| `PrismaModule` | Shared DB client |
| `HealthController` | Liveness for ops & smoke tests |

### Auth model

1. User registers or logs in → API returns **access token** (short TTL) + **refresh token**.  
2. Refresh token is stored **hashed** in `RefreshToken`; rotation on refresh; revoke on logout.  
3. Global JWT guard; endpoints marked `@Public()` skip auth.  
4. `@Roles(UserRole.ADMIN | AGENT | …)` for privileged routes.

Roles: `CUSTOMER`, `AGENT`, `ADMIN`.

### API contract

Successful responses are typically shaped as:

```json
{ "success": true, "data": { } }
```

Errors use consistent HTTP status codes and structured messages (see exception filter).

Prefix: configurable via `API_PREFIX` (default `api/v1`).

---

## Frontend (`apps/web`)

### Stack

- Next.js 15 (App Router)  
- React 19 + TypeScript  
- Tailwind CSS  
- `react-globe.gl` + Three.js (globe)  
- Zustand (auth + booking state, with persistence)  
- Framer Motion, Lucide icons  

### Key UI areas

| Route | Purpose |
|-------|---------|
| `/` | Interactive globe + search entry |
| `/reservas` | Booking panel flow |
| `/auth` | Login / register |
| `/nosotros`, `/contacto`, `/eventos`, `/ayuda` | Brand & service pages |
| `/legal/terminos`, `/legal/privacidad` | Legal |

### Client architecture

- `lib/api.ts` — typed fetch helpers against `NEXT_PUBLIC_API_URL`  
- `store/auth-store.ts` — tokens & session  
- `store/booking-store.ts` — multi-step booking wizard state  
- `components/globe/*` — Earth interaction  
- `components/booking/*` — flight/hotel selection UI  
- `components/layout/*` — header, footer, WhatsApp CTA  

Brand colors and contact constants live in `lib/brand.ts` / env `NEXT_PUBLIC_*`.

---

## Data layer

### Prisma models (summary)

- **User** + **RefreshToken** + **PassengerProfile**  
- **Destination** graph (countries/cities as used by search)  
- **Flight** / inventory representations for search  
- **Hotel** catalog  
- **Booking** + related passenger/payment status enums  

See `apps/api/prisma/schema.prisma` for the source of truth.

### Seed & catalogs

- `apps/api/prisma/seed.ts` loads demo users and catalog data.  
- JSON under `data/airports`, `data/hotels` feeds realistic search without external GDS yet.

### Redis

Wired via `REDIS_URL` for future caching, rate limiting storage, or queues. Local compose starts Redis with AOF persistence.

---

## Security architecture

| Control | Implementation |
|---------|----------------|
| Transport (prod) | HTTPS termination at reverse proxy / platform |
| Authn | JWT access + rotating refresh |
| Authz | Role guards |
| Passwords | bcrypt cost 12 |
| Input | DTO validation, whitelist |
| HTTP hardening | Helmet |
| Abuse | Throttler rate limits |
| CORS | Explicit origin allow-list |

Secrets must never land in git. Use `.env.example` as the only committed template.

---

## Deployment sketch

```
Internet → CDN / reverse proxy (TLS)
              ├─ static / SSR → Next.js
              └─ /api/v1/*   → NestJS
                                 ├─ PostgreSQL (managed)
                                 └─ Redis (managed)
```

Recommended production practices:

1. `prisma migrate deploy` on release  
2. Distinct secrets per environment  
3. Health check on `/api/v1/health`  
4. Horizontal scale of API behind load balancer (stateless JWT access)  
5. Private network for DB/Redis  

---

## Multi-agent ops (`agents/`)

Internal playbooks for product/business/tech roles (CEO, marketing, backend, QA, etc.). They guide AI-assisted delivery; they are **not** runtime code. Root `AGENTS.md` maps roles. Public contributors can ignore this folder unless extending ops automation.

---

## Extension points

| Capability | Where to plug in |
|------------|------------------|
| Live flights | `FlightsService` + external GDS SDK |
| Live hotels | `HotelsService` + supplier connector |
| Payments | Booking payment status + gateway webhook module |
| Email/WhatsApp | Notification module after booking confirm |
| Admin UI | New Next.js routes + `AGENT`/`ADMIN` APIs |
