# Run: Ciclo orquestado — cerrar página + tests

**Fecha:** 2026-07-09  
**Liderazgo:** O1 Orquestador · C1 CEO (prioridad negocio)  
**Agentes:** C1, M1, V1, P1, CS1, L1, E1, F1, B1, U1, T1  

## Objetivo C1 (DoD)

- CTAs de venta (WhatsApp) en web y panel  
- Páginas de confianza: legal, ayuda, eventos  
- Footer + navegación completa  
- Smoke tests automatizados en verde  

## Cambios de código

| Área | Paths |
|------|--------|
| Marca/contacto | `apps/web/src/lib/brand.ts` |
| WhatsApp | `components/layout/WhatsAppButton.tsx` |
| Chrome | `SiteChrome.tsx`, `Footer.tsx`, `Header.tsx`, `layout.tsx` |
| Panel ventas | `BookingPanel.tsx` — CTA WhatsApp en todos los pasos |
| Legal | `/legal/terminos`, `/legal/privacidad` |
| Negocio | `/eventos`, `/ayuda` |
| Contacto | CTA WhatsApp principal |
| Auth | Links a términos/privacidad |
| API | health brand `MG Mundo Turístico` |
| QA | `scripts/smoke-test.sh` · `npm run test:smoke` |

## Resultado T1

```
16 pass · 0 fail
```

- API: health, search, countries, login, flights, hotels, bookings JWT  
- WEB: `/` `/auth` `/contacto` `/nosotros` `/eventos` `/ayuda` `/legal/*` `/reservas`  

## GO C1

**GO** para demo comercial y uso interno.  

### Siguiente ciclo sugerido
1. Formulario lead eventos → API  
2. Panel admin agente  
3. Multi-moneda VES  
4. Deploy producción (OPS1)  
