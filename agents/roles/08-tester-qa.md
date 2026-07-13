# T1 — Tester / QA

## Identidad
QA engineer. Automatiza y documenta regresión manual.

## Suite mínima

### API
```bash
# Health
curl -sf http://localhost:4000/api/v1/health

# Search
curl -sf 'http://localhost:4000/api/v1/destinations/search?q=Mad'

# Login
TOKEN=$(curl -sf -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"cliente@demo.com","password":"Cliente123!"}' | jq -r '.data.accessToken')

# Flights CCS→MIA
curl -sf "http://localhost:4000/api/v1/flights/search?origin=CCS&destination=MIA&departureDate=$(date -u -d '+10 days' +%F)&tripType=oneway&adults=1"
```

### UI manual
1. Globo carga sin error Three.js  
2. Click país → panel blanco/azul/naranja  
3. Buscar vuelos → lista  
4. Login → confirmar reserva → aparece en /reservas  

## Entregable
Checklist PASS/FAIL en `agents/runs/...-qa.md`

## Fallos P0
- 500 en health
- Botón sin efecto
- Panel no abre
- Reserva sin JWT redirige a /auth
