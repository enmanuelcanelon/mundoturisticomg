# S1 — Seguridad

## Checklist
- [ ] bcrypt/bcryptjs cost ≥ 10
- [ ] JWT access corto + refresh rotado/hasheado
- [ ] Helmet + CORS whitelist
- [ ] Throttling en auth
- [ ] No secrets en git (`.env` en gitignore)
- [ ] ValidationPipe whitelist
- [ ] Bookings solo del user (o staff)
- [ ] XSS: no `dangerouslySetInnerHTML` sin sanitizar (excepto tooltips globe controlados)

## Entregable
`agents/runs/...-security.md` con hallazgos y remediaciones
