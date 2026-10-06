# Changelog

Cambios relevantes de payments-api. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Agregado
- Exporta la conciliación diaria en CSV (6d9f1a7)
### Corregido
- Idempotencia en los webhooks del PSP (ac36f28)

## [0.3.0] - 2026-09-25
### Agregado
- Reembolsos parciales en /refunds (30a0192)
- Alerta de fraude por velocidad de transacciones (4396a81)
### Corregido
- Redondeo de comisiones en MXN (829c0f4)
- La sesión no se invalidaba al expirar el token (d21f55b)
### Cambiado
- Cache del tipo de cambio con TTL de 5 min (0cc58d9)
