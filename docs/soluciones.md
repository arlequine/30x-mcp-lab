# Soluciones · prácticas y ejercicios A–F

Esta rama (`solutions`) agrega sobre `main`:

| Archivo | Qué es |
|---|---|
| `.mcp.json` | Servers `filesystem` (práctica 1) e `incidents` (ejercicio C) en scope project |
| `.claude/settings.json` | Aprobación de los servers + reglas allow / ask / deny de ejemplo |
| `.claude/skills/changelog/` | Skill de la práctica 2 |
| `.claude/skills/incident-report/` | Skill del ejercicio E (con `template.md`) |
| `.claude/skills/release-notes/` | Skill del ejercicio D |
| `reports/incidentes.md` | Ejemplo de resultado de la práctica 1 |
| `CHANGELOG.md` | Ejemplo de resultado de la práctica 2 (`/changelog v0.2.0..v0.3.0` + `/changelog`) |
| `docs/guia-mentor.md` | Guion de la sesión para quien la imparte |

---

## Práctica 1

Cifras que debe tener el reporte (salen de los logs, no hay interpretación):

| Servicio | Errores | Más frecuente | Desglose |
|---|---|---|---|
| payments | 42 | TIMEOUT_PSP | TIMEOUT_PSP 27 · DUPLICATE_WEBHOOK 9 · FX_RATE_STALE 6 |
| auth | 17 | TOKEN_EXPIRED | TOKEN_EXPIRED 11 · INVALID_SIGNATURE 4 · RATE_LIMITED 2 |
| notifications | 9 | SMTP_REJECTED | SMTP_REJECTED 6 · TEMPLATE_MISSING 3 |

Top 3 incidentes:
1. **PSP sin respuesta** · 2026-09-29 14:02–14:18 UTC · 20 timeouts · latencia alta un minuto antes.
2. **Deslogueo masivo** · 2026-10-01 09:00–09:10 UTC · 8 TOKEN_EXPIRED justo después de `KEY_ROTATION_COMPLETED` (llave anterior revocada sin periodo de gracia).
3. **Recibos rechazados** · 2026-10-03 22:40–23:01 UTC · 6 SMTP_REJECTED "SPF check failed" después de `DNS_CHANGE_APPLIED`.

Ejemplo completo: [`reports/incidentes.md`](../reports/incidentes.md).

**"Verifica, no supongas":** con Claude Code, `list_allowed_directories` responde la raíz del repo y no `data/` y `reports/`. Claude Code anuncia roots con el directorio del proyecto y el filesystem server (2026.8.31) reemplaza sus argumentos por esos roots. `npm run demo:roots` lo demuestra sin Claude.

## Práctica 2

`/changelog v0.2.0..v0.3.0` produce la sección `[0.3.0] - 2026-09-25`; `/changelog` sin argumentos agrega `[Unreleased]`. Resultado esperado: [`CHANGELOG.md`](../CHANGELOG.md). Los hashes coinciden con el historial del repo.

---

## A · Filesystem read-only

`.claude/settings.local.json`:

```json
{
  "permissions": {
    "deny": [
      "mcp__filesystem__write_file",
      "mcp__filesystem__edit_file",
      "mcp__filesystem__move_file",
      "mcp__filesystem__create_directory"
    ]
  }
}
```

Lo que pasa: las tools denegadas desaparecen o fallan, y Claude normalmente propone escribir el reporte con **su propia tool Write** (que te pide permiso). Lección: una regla `deny` aplica a la tool que nombra, no "al archivo". Para cerrar también ese camino agrega `"Edit(./reports/**)"`, que cubre las tools integradas que modifican archivos.

## B · Scopes en conflicto

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem@2026.8.31 ./data
claude mcp list
claude mcp get filesystem
```

- `project` vive en `.mcp.json` (en git); `local` y `user` viven en `~/.claude.json`.
- Con el mismo nombre en varios scopes gana **local**, luego project, luego user.
- Ojo: aunque ahora el server local sólo declara `./data`, `list_allowed_directories` sigue mostrando el repo completo por los roots (práctica 1).
- Limpieza: `claude mcp remove filesystem -s local`.

## C · Resource vs Tool

- **Resource** (`@incidents:incidents://summary`): lo adjuntas tú, entra al contexto como un archivo. No hay tool call.
- **Tool** (`get_incident_stats`): la decide el modelo y pasa por permisos (normalmente pregunta la primera vez, salvo que esté en `allow`).
- **Prompt** (`/mcp__incidents__triage payments`): lo disparas tú; inyecta instrucciones que luego hacen que el modelo llame tools.

Quién controla: resource → la app/el usuario · tool → el modelo · prompt → el usuario.

## D · Skill con argumentos

`.claude/skills/release-notes/SKILL.md` (incluido en esta rama):

```markdown
---
name: release-notes
description: Convierte la sección [Unreleased] de CHANGELOG.md en un release con versión y fecha.
argument-hint: "<versión> <fecha YYYY-MM-DD>"
arguments: [version, date]
allowed-tools: Read Edit
disable-model-invocation: true
---
1. Abre CHANGELOG.md. Si no hay sección [Unreleased], dilo y detente.
2. Renómbrala a `## [$version] - $date`, quitando la "v" inicial de la versión si la trae.
3. No modifiques otras secciones ni hagas commit: muestra el diff y espera.
```

Uso: `/release-notes v0.4.0 2026-10-14`. Equivalente con índices: `$0` y `$1` en lugar de `$version` y `$date`.

## E · Del prompt al Skill

Ver `.claude/skills/incident-report/SKILL.md` y `template.md`. Puntos clave:
- La descripción dice qué hace y **cuándo** usarlo, con las palabras que diría alguien del equipo.
- `template.md` sólo se lee cuando el skill lo necesita (carga progresiva).
- `allowed-tools` pre-aprueba las lecturas MCP; la escritura queda fuera a propósito para que el humano apruebe.

## F · Audita un server (ejemplo: filesystem 2026.8.31)

| Punto | Hallazgo |
|---|---|
| Origen | Server de referencia del proyecto MCP (`modelcontextprotocol/servers`), código público |
| Versión | Fijada: `@modelcontextprotocol/server-filesystem@2026.8.31` |
| Superficie | 14 tools; lectura (`read_text_file`, `list_directory`, `search_files`…) y escritura (`write_file`, `edit_file`, `move_file`, `create_directory`) |
| Permisos | Acceso de lectura y escritura dentro de los directorios permitidos. **Hallazgo:** con un cliente que anuncia roots, los roots reemplazan a los argumentos |
| Red | No hace llamadas de red |
| Contenido externo | Lee archivos locales: riesgo de prompt injection si esos archivos vienen de terceros |

**Decisión:** aprobar con restricciones.

```json
{
  "permissions": {
    "allow": ["mcp__filesystem__read_text_file", "mcp__filesystem__list_directory", "mcp__filesystem__list_allowed_directories"],
    "ask": ["mcp__filesystem__write_file", "mcp__filesystem__edit_file"],
    "deny": ["mcp__filesystem__move_file"]
  }
}
```
