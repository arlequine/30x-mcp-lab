---
name: incident-report
description: >
  Genera el reporte semanal de incidentes en reports/ a partir de los logs de
  data/incidents. Úsalo cuando pidan el reporte de incidentes, un resumen de
  errores por servicio o el postmortem de la semana.
argument-hint: "[archivo de salida, ej. reports/incidentes.md]"
allowed-tools: mcp__filesystem__list_directory mcp__filesystem__read_text_file mcp__filesystem__read_multiple_files mcp__incidents__get_incident_stats mcp__incidents__search_incidents
---
## Instrucciones

1. Archivo de salida: $ARGUMENTS. Si está vacío, usa `reports/incidentes.md`.
2. Obtén los datos sólo con tools MCP:
   - Si el server `incidents` está conectado, usa `get_incident_stats` y `search_incidents`.
   - Si no, usa las tools `mcp__filesystem__*` para leer `data/incidents/*.log`.
3. Llena la plantilla [template.md](template.md) sin cambiar sus secciones.
4. Cada incidente del top 3 lleva hora de inicio y fin (UTC), evidencia
   (1–2 líneas de log copiadas tal cual) y causa probable.
5. No inventes cifras: si un dato no está en los logs, escribe "sin evidencia".
6. Escribe el archivo con `mcp__filesystem__write_file` (pedirá permiso) y muestra
   un resumen de 3 líneas en el chat.
