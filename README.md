# PIMSy — paquete de contexto para Claude Code

Este paquete le da a Claude Code todo lo necesario para construir un prototipo (one-shot) de PIMSy con las partes ya claras
y dejar marcadas las que no lo están.

## Cómo usarlo
1. Descomprime el zip en una carpeta nueva (será la raíz del proyecto o su carpeta `contexto/`).
2. Abre Claude Code en esa carpeta. Lee `CLAUDE.md` automáticamente.
3. Pega el prompt corto de arranque (está en `PROMPT_ONESHOT.md`, sección "Prompt de arranque") o dile:
   *"Lee PROMPT_ONESHOT.md y ejecútalo completo."*
4. Revisa al final `REPORTE_FINAL.md`, `02-spec-driven/decisiones_asumidas.md` y las marcas `POR VALIDAR(Q-xx)`.

## Qué hay dentro
| Carpeta / archivo | Contenido |
|---|---|
| `CLAUDE.md` | Contexto permanente, principios, convenciones y reglas de trabajo. |
| `PROMPT_ONESHOT.md` | El prompt completo del one-shot. |
| `01-requerimiento/` | Requerimiento original y Especificación Técnica v1.0. |
| `02-spec-driven/` | Constitución, spec con criterios de aceptación, plan, tareas, decisiones, preguntas abiertas (35), glosario, matriz de permisos. |
| `03-modelo-datos/` | `PIMSy_DB.dbml` (v0.2), `schema.sql`, diagramas, mapeo campo por campo (517 campos), brechas y conflictos. |
| `04-campos-formularios/` | Listas de campos de Parte Informativa, IPH Delitos, IPH Faltas e IUF; artefactos legacy de referencia. |
| `05-ceri/` | Reglas de importación del export de CERI, catálogos semilla y una muestra sintética. |
| `06-analisis/` | Análisis de brechas e historial del chat de diseño. |
| `99-legacy-obsoleto/` | Documentos superados (no decidir desde aquí). |

## Estado del diseño (5-oct-2026)
- **Sólido:** núcleo del evento, rutas de nacimiento, estados, detenido vs persona, IPH y enrutamiento, reglas de bienes, snapshot de agentes.
- **Propuesto, falta validar:** indicadores derivados, estado por pieza, IPH en borrador, delito a nivel evento, preregistro CERI.
- **Abierto:** 35 preguntas (`02-spec-driven/preguntas_abiertas.md`). Hay reunión de flujo con Héctor el miércoles 7-oct-2026.
- **Sin mapear:** informe de uso de la fuerza (IUF).
- Las hojas de IPH del análisis de origen están marcadas "pendiente por cambios en aplicación": el mapeo debe confirmarse contra el formato oficial (Q-24).

## Qué NO incluye (a propósito)
El export original de CERI (trae teléfonos y nombres), credenciales, datos personales reales y las integraciones reales con SIPROB, MongoDB y Google.

## Maqueta navegable
Está en `maqueta/` (HTML + JS estáticos, sin build). Ábrela con `maqueta/index.html` o publícala en GitHub Pages con
`.github/workflows/pages.yml` (Settings > Pages > Source = GitHub Actions). Todos los datos son sintéticos.
Detalle de lo implementado y de los supuestos: `REPORTE_FINAL.md` y `02-spec-driven/decisiones_asumidas.md`.
Las leyes de diseño (atómico estricto, tema centralizado) están en `maqueta/DESIGN.md` y se verifican con `node maqueta/tools/lint-design.mjs`.
