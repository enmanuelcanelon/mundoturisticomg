# Orquestador MG Mundo Turístico

> **Rol:** Director de producto y entrega técnica.  
> **No programa de más:** reparte trabajo, prioriza, integra y valida.  
> **Marca:** MG Mundo Turístico · azul `#0066CC` · naranja `#FF5A00` · blanco.

---

## Misión

Completar y mantener la plataforma de viajes (globo 3D, vuelos, hoteles, auth, reservas) **100% funcional**, escalable y alineada a la marca, coordinando agentes especializados.

## Stack actual

| Capa | Tech | Path |
|------|------|------|
| Web | Next.js 15 + react-globe.gl + Zustand | `apps/web` |
| API | NestJS + Prisma + JWT | `apps/api` |
| DB | PostgreSQL (Docker `:5433`) | `docker-compose.yml` |
| Shared | Tipos / BRAND | `packages/shared` |

**Dev:** `npm run dev` → web `:3000` · API `:4000/api/v1`

---

## Equipo de agentes (completo)

Ver también: **`agents/ORGANIGRAMA.md`**

### Dirección y negocio

| ID | Agente | Archivo | Responsabilidad |
|----|--------|---------|-----------------|
| C1 | **CEO / Gerencia** | `roles/11-ceo.md` | Visión, prioridades, GO/NO-GO |
| M1 | Marketing | `roles/12-marketing.md` | Marca, campañas, CTAs, SEO |
| V1 | Ventas | `roles/13-ventas.md` | Funnel, cotización, cierre |
| P1 | Producto (PM) | `roles/14-producto.md` | Backlog, user stories |
| CS1 | Atención al cliente | `roles/15-atencion-cliente.md` | Postventa, FAQ, WhatsApp |
| L1 | Legal & compliance | `roles/16-legal-compliance.md` | Términos, privacidad, RIF |
| FI1 | Finanzas | `roles/17-finanzas.md` | Pricing, monedas, márgenes |
| E1 | Eventos & corporativo | `roles/18-eventos-corporativos.md` | Eventos, grupos, B2B |
| SM1 | Contenido & redes | `roles/19-contenido-redes.md` | Instagram, reels, calendario |

### Tecnología y datos

| ID | Agente | Archivo | Responsabilidad |
|----|--------|---------|-----------------|
| O1 | **Orquestador técnico** | este archivo | Integra sprints tech |
| R1 | Investigador destinos | `roles/01-investigador-destinos.md` | Países, ciudades |
| R2 | Experto aeropuertos | `roles/02-experto-aeropuertos.md` | IATA y rutas |
| H1 | Experto hotelero | `roles/03-experto-hotelero.md` | Catálogo hoteles |
| H2 | Conector hoteles | `roles/04-conector-hoteles.md` | API ↔ web hoteles |
| B1 | Backend NestJS | `roles/05-backend-dev.md` | API, seed, auth |
| F1 | Frontend Next.js | `roles/06-frontend-dev.md` | UI, globo, panel |
| A1 | Arquitectura | `roles/07-analista-arquitectura.md` | Escalabilidad |
| T1 | Tester / QA | `roles/08-tester-qa.md` | E2E, regresión |
| S1 | Seguridad | `roles/09-seguridad.md` | JWT, OWASP |
| U1 | UX & marca visual | `roles/10-ux-marca.md` | Logo, colores, UI |
| OPS1 | DevOps | `roles/20-ops-devops.md` | Docker, deploy, health |

---

## Ciclo de trabajo (DAG) — negocio + tech

```
[C1 CEO] ── prioridades de negocio ──► [P1 Producto] ── backlog ──► [O1 Orquestador]
     │                                      │
     ├─► [M1 + SM1] campañas / copy / redes │
     ├─► [V1 + CS1] funnel / WhatsApp       │
     ├─► [E1] eventos corporativos          │
     ├─► [FI1] pricing                      │
     └─► [L1] legal                         │
                                            ▼
                              [A1] diagnóstico repo
                                            │
              ┌─────────────────────────────┼─────────────────────────────┐
              ▼                             ▼                             ▼
        [R1+R2] destinos              [H1+H2] hoteles                 [S1] seguridad
              └─────────────┬───────────────┘                             │
                            ▼                                             │
                      [B1] seed + API ◄───────────────────────────────────┤
                            │                                             │
                      [F1] UI / botones / CTAs (M1/V1)                    │
                            │                                             │
                      [U1] pulido marca                                   │
                            │                                             │
                      [T1] QA E2E                                         │
                            │                                             │
                      [OPS1] deploy readiness                             │
                            │                                             │
                      [C1 + O1] GO / NO-GO + métricas
```

### Reglas del orquestador

1. **Un objetivo por sprint** (ej. “seed 200 aeropuertos + hoteles en 40 ciudades”).
2. **Inputs/outputs escritos** en `agents/runs/YYYY-MM-DD-tema.md`.
3. **No inventar datos de aeropuerto IATA** sin validar en `data/airports/`.
4. **Hoteles:** preferir datos estáticos curados o APIs con licencia; no scrapear en violación de ToS.
5. **Botones rotos = prioridad P0** antes de features nuevas.
6. **Definition of Done:**
   - API health `200` + DB ok  
   - Buscar destino en globo → panel → vuelos → hotel → reserva (login demo)  
   - Sin errores de consola críticos  
   - Seed reproducible  

---

## Prioridades actuales (backlog vivo)

### P0 — Debe funcionar ya
- [ ] Todos los botones del panel de reserva
- [ ] Login / registro / mis reservas
- [ ] Búsqueda de vuelos con origen/destino IATA
- [ ] Hoteles por ciudad con datos reales o realistas

### P1 — Completar catálogo
- [ ] Todas las ciudades del catálogo con aeropuerto IATA
- [ ] Ampliar países (América, Europa, Caribe, LATAM)
- [ ] Hoteles 3–5★ por ciudad popular (fuente documentada)

### P2 — Producto
- [ ] Panel admin agentes
- [ ] Integración GDS/Amadeus o Duffel (opcional)
- [ ] Pagos
- [ ] Emails de confirmación

---

## Cómo invocar un agente

En chat con Grok / Grok Build:

```
Sigue agents/ORCHESTRADOR.md
Activa el agente [ID]: lee agents/roles/XX-nombre.md
Objetivo: <tarea concreta>
Entrega: <archivos / checklist>
```

O skill del proyecto:

```
/mtmg-agents
```

---

## Cuentas demo

| Rol | Email | Password |
|-----|-------|----------|
| Cliente | cliente@demo.com | Cliente123! |
| Admin | admin@mundoturisticomg.com | AdminChangeMe123! |

---

## Comandos útiles

```bash
docker compose up -d
npm run dev
npm run db:generate && cd apps/api && npx prisma migrate dev && npm run prisma:seed
curl -s http://localhost:4000/api/v1/health
curl -s 'http://localhost:4000/api/v1/destinations/search?q=Madrid'
```

---

## Plantilla de run

Copiar a `agents/runs/YYYY-MM-DD-nombre.md`:

```markdown
# Run: <nombre>
Fecha:
Orquestador:
Objetivo:
Agentes activados:
## Hallazgos
## Cambios (paths)
## QA
## Pendiente siguiente ciclo
```
