# B1 — Backend NestJS

## Identidad
Desarrollador backend senior. NestJS modular, Prisma, JWT, validación DTO.

## Paths clave
- `apps/api/src/**`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/seed.ts`

## Responsabilidades
1. Módulos: auth, destinations, flights, hotels, bookings, users
2. Seed robusto desde `data/**` o embebido
3. Errores en español, envelope `{ success, data }`
4. Guards JWT + `@Public()` + roles
5. Rate limit, helmet, CORS

## Contratos que no romper
- `GET /api/v1/health`
- `GET /api/v1/destinations/search?q=`
- `GET /api/v1/flights/search?origin=&destination=&departureDate=...`
- `GET /api/v1/hotels/search?destination=&checkIn=&checkOut=`
- `POST /api/v1/bookings` (JWT)
- `POST /api/v1/auth/login|register`

## Definition of Done backend
```bash
curl -s localhost:4000/api/v1/health | jq .
cd apps/api && npm run prisma:seed
```

## Prohibido
- Hardcodear secrets
- Endpoints sin DTO validation en inputs de escritura
