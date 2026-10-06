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
