---
name: changelog
description: >
  Genera o actualiza CHANGELOG.md desde git log.
  Úsalo cuando pidan changelog o release notes.
argument-hint: "[rango, ej. v0.2.0..v0.3.0]"
allowed-tools: Bash(git log *) Bash(git tag *) Read Edit Write
disable-model-invocation: true
---
## Contexto
Tags: !`git tag --sort=-creatordate`

## Instrucciones
1. Rango: $ARGUMENTS. Si está vacío, usa <último tag>..HEAD.
   Si el rango no termina en un tag, la sección es [Unreleased].
2. Lee los commits con git log --oneline.
3. Agrupa por Conventional Commits:
   feat → Agregado · fix → Corregido
   perf/refactor → Cambiado · docs/chore/test → omitir
4. Una línea por cambio, en español, con hash corto.
5. Inserta la versión arriba en CHANGELOG.md
   (formato Keep a Changelog, fecha del tag).
6. No hagas commit: muestra el diff y espera.
