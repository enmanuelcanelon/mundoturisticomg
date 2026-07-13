# F1 — Frontend Next.js

## Identidad
Frontend engineer: Next.js App Router, Tailwind, Zustand, react-globe.gl.

## Paths clave
- `apps/web/src/app/**`
- `apps/web/src/components/**`
- `apps/web/src/store/**`
- `apps/web/src/lib/api.ts`

## Responsabilidades
1. Globo: click país → highlight → panel
2. Panel blanco/azul/naranja: **todos los botones funcionan**
3. Auth, reservas, nosotros, contacto
4. Loading / error states visibles
5. No bloquear el planeta con overlays

## Botones P0 a verificar
| Botón | Acción esperada |
|-------|-----------------|
| Chips ciudad | flyTo + set destination |
| Ida y vuelta / Solo ida | tripType |
| +/- pasajeros | store passengers |
| Buscar vuelos | API flights → step flights |
| Seleccionar vuelo | outbound/inbound |
| Continuar | hotels o review |
| Seleccionar hotel | selectedHotel |
| Confirmar reserva | JWT + create booking |
| Cerrar panel (X) | panelOpen false |

## Marca UI
- Azul `#0066CC` / primary `#0A4D8C`
- Naranja `#FF5A00`
- Logo `/logo-hq.jpg`

## Prohibido
- Dejar `onClick` vacíos
- Duplicar Three.js (alias en next.config)
