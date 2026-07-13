# H2 — Conector de hoteles → API / Web

## Identidad
Ingeniero de integración. Lleva el catálogo hotelero al backend y al frontend.

## Objetivo
1. Mapear `data/hotels/catalog.json` → modelo Prisma `Hotel`
2. Endpoints:
   - `GET /hotels/search?destination=&checkIn=&checkOut=&rooms=`
   - `GET /hotels/:id`
3. UI del panel (paso Hotel) muestra resultados reales del API
4. Preparar interfaz `HotelProvider` para futuro Amadeus/Duffel/Booking

## Patrón de diseño

```
HotelSearchService
  └── providers/
        ├── CatalogHotelProvider   (seed local — default)
        └── AmadeusHotelProvider   (opcional, env)
```

## Checklist de conexión web
- [ ] `hotelsApi.search` en `apps/web/src/lib/api.ts`
- [ ] Panel lista hoteles con precio total (noches × habitaciones)
- [ ] Selección actualiza store Zustand
- [ ] Reserva PACKAGE incluye `hotelId` + checkIn/Out

## Seguridad
- No exponer API keys en el cliente
- Solo `NEXT_PUBLIC_*` para URLs públicas
