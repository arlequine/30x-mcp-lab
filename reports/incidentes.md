# Incidentes · semana 40 (2026-09-28 a 2026-10-04)

> Ejemplo de resultado de la práctica 1. Tu reporte no tiene que ser idéntico: lo que importa es que las cifras salgan de los logs.

## Resumen ejecutivo
68 errores en la semana: payments concentra el 62 % (42), casi todos por timeouts del PSP.
Hubo tres incidentes con impacto a usuarios: caída del PSP (martes), deslogueo masivo tras rotar llaves (jueves) y recibos rechazados por SPF (sábado).
Prioridad: idempotencia de webhooks, periodo de gracia en la rotación de llaves y validar el SPF antes de cambiar DNS.

## Errores por servicio
| Servicio | Errores | Error más frecuente |
|---|---|---|
| payments | 42 | TIMEOUT_PSP (27) |
| auth | 17 | TOKEN_EXPIRED (11) |
| notifications | 9 | SMTP_REJECTED (6) |

## Top 3 incidentes
### 1. El PSP pagonet dejó de responder
- **Cuándo:** 2026-09-29 14:02 – 14:18 UTC (circuit breaker abierto a las 14:08, recuperado a las 14:19)
- **Impacto:** 20 cargos con timeout; tickets SUP-1201 y SUP-1202 (comercio sin poder cobrar con tarjeta)
- **Evidencia:** `2026-09-29T14:01:30.000Z WARN  [payments] code=PSP_LATENCY_HIGH psp=pagonet p95_ms=8420`
- **Causa probable:** degradación del PSP; la latencia ya estaba alta un minuto antes del primer timeout.

### 2. Deslogueo masivo tras la rotación de llaves
- **Cuándo:** 2026-10-01 09:00 – 09:10 UTC
- **Impacto:** 8 sesiones invalidadas en 10 minutos; tickets SUP-1205 y SUP-1206
- **Evidencia:** `code=KEY_ROTATION_COMPLETED kid=2026-10 msg="Nueva llave de firma activa; la anterior se revocó"`
- **Causa probable:** la llave anterior (kid=2026-09) se revocó sin periodo de gracia.

### 3. Recibos por correo rechazados por SPF
- **Cuándo:** 2026-10-03 22:40 – 23:01 UTC
- **Impacto:** 6 recibos no entregados; tickets SUP-1208 y SUP-1209
- **Evidencia:** `code=SMTP_REJECTED smtp=550 detail="5.7.1 SPF check failed"`
- **Causa probable:** el cambio de DNS de las 22:37 dejó un registro SPF inválido.

## Recomendaciones
1. Desplegar la idempotencia de webhooks (ya está en `main`, sin release): explica los 9 DUPLICATE_WEBHOOK y el ticket SUP-1210. · Pagos
2. Rotar llaves con periodo de gracia: aceptar el kid anterior durante 24 h. · Auth
3. Validar el SPF en staging antes de aplicar cambios de DNS. · Plataforma
4. Alertar sobre la latencia p95 del PSP (aviso temprano antes del timeout). · Pagos
5. Crear las plantillas faltantes `refund_partial` y `fraud_review`. · Notificaciones
