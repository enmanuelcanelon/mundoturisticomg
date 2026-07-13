# API reference

**Base URL (local):** `http://localhost:4000/api/v1`  
**Content-Type:** `application/json`  
**Auth header:** `Authorization: Bearer <accessToken>`

Successful responses are typically wrapped as:

```json
{
  "success": true,
  "data": {}
}
```

---

## Health

### `GET /health`

Public. Liveness probe.

**Example**

```bash
curl -s http://localhost:4000/api/v1/health
```

---

## Auth

### `POST /auth/register`

Public. Create a customer account.

```json
{
  "email": "user@example.com",
  "password": "SecurePass1!",
  "firstName": "Ana",
  "lastName": "Pérez",
  "phone": "+584141112233"
}
```

Password rules: min 8 chars, upper + lower + digit or symbol.

### `POST /auth/login`

Public.

```json
{
  "email": "cliente@demo.com",
  "password": "Cliente123!"
}
```

**Response `data` (typical):** access token, refresh token, user summary.

### `POST /auth/refresh`

Public. Rotate tokens.

```json
{
  "refreshToken": "<token>"
}
```

### `POST /auth/logout`

Requires JWT (or project-specific body with refresh — see controller). Invalidates refresh session.

### `GET /auth/me`

Requires JWT. Current user profile.

---

## Users

### `GET /users/profile`

Requires JWT. Authenticated user profile.

---

## Destinations

### `GET /destinations/search?q=`

Public. Free-text search (country/city).

```bash
curl -s "http://localhost:4000/api/v1/destinations/search?q=Madrid"
```

### `GET /destinations/countries`

Public. List countries.

### `GET /destinations/countries/:code`

Public. Country by ISO-style code.

### `GET /destinations/cities`

Public. Optional query filters (see controller/service for `q` / country filters).

### `GET /destinations/cities/:id`

Public. City by id.

---

## Flights

### `GET /flights/search`

Public. Query parameters:

| Param | Required | Description |
|-------|----------|-------------|
| `origin` | yes | City id or IATA (e.g. `CCS`) |
| `destination` | yes | City id or IATA (e.g. `MIA`) |
| `departureDate` | yes | ISO date `YYYY-MM-DD` |
| `returnDate` | no | ISO date (round-trip) |
| `tripType` | no | `oneway` \| `roundtrip` (default `roundtrip`) |
| `adults` | no | 1–9 (default 1) |
| `children` | no | 0–9 |
| `infants` | no | 0–9 |
| `seniors` | no | 0–9 |
| `cabinClass` | no | `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST` |

```bash
curl -s "http://localhost:4000/api/v1/flights/search?origin=CCS&destination=MIA&departureDate=2026-08-01&tripType=oneway&adults=1"
```

Inventory is currently catalog/seed-based (not a live GDS).

---

## Hotels

### `GET /hotels/search`

Public. Query parameters:

| Param | Required | Description |
|-------|----------|-------------|
| `destination` | yes | City id |
| `checkIn` | yes | ISO date |
| `checkOut` | yes | ISO date |
| `rooms` | no | 1–10 (default 1) |
| `adults` | no | default 1 |
| `children` | no | default 0 |
| `minStars` | no | 1–5 |

### `GET /hotels/:id`

Public. Hotel detail by id.

---

## Bookings

All booking routes require a valid **JWT**.

### `POST /bookings`

Create a booking (flight, hotel, or package). Body includes passenger counts, optional trip dates, and `items` array (`FLIGHT` / `HOTEL` with ids and dates). See `CreateBookingDto` in `apps/api/src/bookings/dto/create-booking.dto.ts`.

### `GET /bookings`

List bookings for the current user (admins/agents may see broader scope depending on service rules).

### `GET /bookings/:id`

Booking detail.

### `PATCH /bookings/:id/confirm`

Confirm a booking.

### `PATCH /bookings/:id/cancel`

Cancel a booking.

---

## Status enums (shared)

From `@mtmg/shared` / Prisma:

- **BookingStatus:** `DRAFT`, `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- **BookingType:** `FLIGHT`, `HOTEL`, `PACKAGE`
- **PaymentStatus:** `PENDING`, `PAID`, `FAILED`, `REFUNDED`
- **UserRole:** `CUSTOMER`, `AGENT`, `ADMIN`

---

## Errors

Validation and domain errors return non-2xx HTTP status with a structured body (message / status code). `forbidNonWhitelisted` rejects unknown body fields.

---

## Versioning

Path prefix `api/v1` is configured via `API_PREFIX`. Breaking changes should introduce `v2` rather than mutating existing contracts silently.
