#!/usr/bin/env bash
# T1 — Smoke tests MG Mundo Turístico
set -euo pipefail

API="${API_URL:-http://localhost:4000/api/v1}"
WEB="${WEB_URL:-http://localhost:3000}"
PASS=0
FAIL=0

ok() { echo "  PASS  $1"; PASS=$((PASS+1)); }
ko() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }

echo "=== MG Mundo Turístico — Smoke QA ==="
echo "API=$API  WEB=$WEB"
echo

# Health
if curl -sf --max-time 5 "$API/health" | grep -q healthy; then
  ok "API health"
else
  ko "API health"
fi

# Destinations
if curl -sf --max-time 5 "$API/destinations/search?q=Madrid" | grep -q Madrid; then
  ok "Search Madrid"
else
  ko "Search Madrid"
fi

# Countries count
CC=$(curl -sf --max-time 8 "$API/destinations/countries" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);console.log((j.data||j).length)})")
if [ "${CC:-0}" -ge 10 ]; then ok "Countries >=10 ($CC)"; else ko "Countries ($CC)"; fi

# Login
LOGIN=$(curl -sf --max-time 8 -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"cliente@demo.com","password":"Cliente123!"}' || true)
if echo "$LOGIN" | grep -q accessToken; then ok "Login demo"; else ko "Login demo"; fi

TOKEN=$(echo "$LOGIN" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log((j.data||j).accessToken||'')}catch{console.log('')}})")

# Flights — try several dates
FLIGHT_OK=0
for d in 10 11 12 13 14 15; do
  DEP=$(date -u -d "+$d days" +%F 2>/dev/null || date -u -v+${d}d +%F)
  N=$(curl -sf --max-time 8 \
    "$API/flights/search?origin=CCS&destination=MIA&departureDate=$DEP&tripType=oneway&adults=1" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(((j.data||j).outbound||[]).length)}catch{console.log(0)}})" || echo 0)
  if [ "${N:-0}" -gt 0 ]; then FLIGHT_OK=1; break; fi
done
if [ "$FLIGHT_OK" -eq 1 ]; then ok "Flights CCS→MIA"; else ko "Flights CCS→MIA"; fi

# Hotels Madrid
MID=$(curl -sf --max-time 8 "$API/destinations/cities?q=Madrid" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const a=j.data||j;console.log(a[0]?.id||'')}catch{console.log('')}})")
CI=$(date -u -d '+12 days' +%F 2>/dev/null || date -u -v+12d +%F)
CO=$(date -u -d '+15 days' +%F 2>/dev/null || date -u -v+15d +%F)
HN=$(curl -sf --max-time 8 \
  "$API/hotels/search?destination=$MID&checkIn=$CI&checkOut=$CO&rooms=1" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(((j.data||j).hotels||[]).length)}catch{console.log(0)}})" || echo 0)
if [ "${HN:-0}" -gt 0 ]; then ok "Hotels Madrid ($HN)"; else ko "Hotels Madrid"; fi

# Bookings list (auth)
if [ -n "$TOKEN" ]; then
  if curl -sf --max-time 8 -H "Authorization: Bearer $TOKEN" "$API/bookings" | grep -q success; then
    ok "Bookings list JWT"
  else
    ko "Bookings list JWT"
  fi
else
  ko "Bookings list JWT (no token)"
fi

# Web pages
for path in / /auth /contacto /nosotros /eventos /ayuda /legal/terminos /legal/privacidad /reservas; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$WEB$path" || echo 000)
  if [ "$CODE" = "200" ]; then ok "WEB $path ($CODE)"; else ko "WEB $path ($CODE)"; fi
done

echo
echo "=== Resultado: $PASS pass · $FAIL fail ==="
if [ "$FAIL" -gt 0 ]; then exit 1; fi
exit 0
