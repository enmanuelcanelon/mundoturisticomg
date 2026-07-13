# Organigrama de agentes — MG Mundo Turístico

```
                         ┌─────────────────────┐
                         │   C1  CEO / Gerencia │
                         │   Mariela López      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
     ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
     │  NEGOCIO       │   │  PRODUCTO      │   │  TECNOLOGÍA    │
     └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
             │                    │                    │
    ┌────────┼────────┐          │           ┌────────┼────────┐
    ▼        ▼        ▼          ▼           ▼        ▼        ▼
  M1       V1       E1         P1          O1       OPS1      S1
Marketing Ventas  Eventos    Producto  Orquestador  DevOps  Seguridad
    │        │        │          │           │
    ▼        ▼        │          │     ┌─────┴─────┐
   SM1      CS1       │          │     ▼           ▼
  Redes  Atención     │          │    A1          T1
                      │          │  Arquitectura   QA
                      │          │
                      │     ┌────┴────┐
                      │     ▼         ▼
                      │    B1        F1
                      │  Backend   Frontend
                      │     │         │
              ┌───────┴─────┼─────────┘
              ▼             ▼
            R1/R2         H1/H2
         Destinos/IATA   Hoteles
              │             │
              └──────┬──────┘
                     ▼
                   L1 / FI1
                 Legal / Finanzas
                     │
                     ▼
                    U1
                 UX & Marca
```

## Cómo leerlo

| Capa | Quién manda | Quién ejecuta |
|------|-------------|---------------|
| Estrategia | **C1 CEO** | P1, M1, V1 |
| Ingresos | **V1 Ventas** + M1 | F1 CTAs, CS1, WhatsApp |
| Producto digital | **P1** + **O1** | B1, F1, R*, H* |
| Calidad | **T1** + **S1** | todos |
| Marca | **U1** + **M1** + **SM1** | F1 |

## Cadena de decisión rápida

1. ¿Es de negocio/precio/prioridad? → **C1**  
2. ¿Es campaña o copy? → **M1 / SM1**  
3. ¿Es cerrar venta o lead? → **V1 / CS1**  
4. ¿Es feature de software? → **P1 → O1 → B1/F1**  
5. ¿Es dato de destino/hotel? → **R1/R2/H1/H2**  
6. ¿Es bug o QA? → **T1**  
7. ¿Es seguridad/legal? → **S1 / L1**  
