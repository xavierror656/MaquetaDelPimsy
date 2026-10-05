# Decisiones asumidas durante la implementación

Claude Code: registra aquí cada supuesto que tomes para avanzar sin preguntar.

| Fecha | Qué asumiste | Por qué | Cómo revertirlo | Pregunta relacionada |
|---|---|---|---|---|
| 2026-10-05 | Alcance reducido a **solo la maqueta** (T-12, T-13, T-14): un único `maqueta/index.html` HTML + JS sin backend ni build. No se hizo Laravel/PostgreSQL (T-01..T-11, T-15). | Indicación del usuario ("solo maqueta"). | Ejecutar de nuevo el one-shot completo sin esa restricción. | — |
| 2026-10-05 | Datos solo en memoria; se reinician al recargar. Solo la hoja de validación persiste (localStorage). | Maqueta para validar flujo, no para guardar. | Sustituir `S` por llamadas a la API. | — |
| 2026-10-05 | Celdas `?` de la matriz (Teléfono Comunitario y Coordinación General en crear/levantar evento; Jurídico en anular) se **deshabilitan** con etiqueta POR VALIDAR. | Opción más conservadora. | Cambiar `?` por `◐` en `PERM`. | Q-01, Q-02, Q-06 |
| 2026-10-05 | Acciones que no están en la matriz (emergencia, entrega de hechos, resguardo, víctimas) las puede aportar solo Policía (◐). | Alguien debe poder registrarlas para recorrer el flujo. | Editar la fila `otros` de `PERM`. | Q-04 |
| 2026-10-05 | Umbral de duplicado: misma colonia y ≤ 60 min, o mismo folio CERI. Caducidad del preregistro: 30 días. Ambos marcados como valor de ejemplo. | La spec dice "umbrales POR VALIDAR". | Constantes `UMBRAL_MIN` y `CADUCA_DIAS`. | Q-05, Q-29 |
| 2026-10-05 | Catálogos de roles de agente, tipo/fuero/autoridad del IPH y colonias son ficticios o tomados de ejemplos de la spec/muestra sintética. | No inventar catálogos oficiales. | Reemplazar por catálogos reales. | Q-08, Q-24 |
| 2026-10-05 | Bienes: «uno u otro» (aseguramiento/resguardo) se simula comparando la descripción del bien. | La maqueta no tiene entidad `bien` maestra. | Usar CHECK real en BD. | — |
| 2026-10-05 | Cierre exige informe de uso de la fuerza solo si hay declaración, con casilla mínima. IUF completo sigue sin mapear. | REQ-CIE-01 + IUF sin mapear. | Mapear IUF. | Q-21 |
| 2026-10-05 | Se puede anular un evento con una acción simple de Plataforma. | La matriz lo permite; quién anula es dudoso. | Quitar botón. | Q-06 |
| 2026-10-05 | Formularios con **@tanstack/form-core** (agnóstico de framework) cargado por CDN esm.sh, con respaldo de validación simple si no hay internet. | Pedido del usuario; no obliga a decidir el framework del frontend. | Quitar el `<script type="module">` y la rama `TF` de `form()`. | plan.md (framework sin decidir) |
| 2026-10-05 | **shadcn/ui** aplicado solo como estilo (tokens zinc, botones, badges, tarjetas, diálogos) en CSS puro; NO se usa la librería. La librería real exige React + Tailwind + build, lo que decide el framework. | Mantener la maqueta sin build y no pre-decidir el stack. | Migrar a Vite + React + shadcn/ui + adaptador React de TanStack Form, cuando Héctor confirme el framework. | plan.md |
| 2026-10-05 | La maqueta se separó en `index.html` + `app.js` + `esquema.js` + `catalogos.js` + `vendor/alpine.min.js`. **Alpine.js** (incluido en el repo) maneja la interactividad de los formularios; TanStack Form valida si carga por CDN, con respaldo propio. | Pedido de usar un framework JS sin build; Alpine no obliga a decidir el framework final. | Migrar a React + shadcn/ui cuando se decida el framework. | plan.md |
| 2026-10-05 | Los formularios cubren todos los campos del DBML v0.2, incluidas las 7 tablas «Por validar» (visibles y marcadas con su Q-xx para validarlas; no son definitivas). | Pedido: que la maqueta tenga todos los campos necesarios. | Ocultar entidades con `pv` en `POR_PIEZA` de `esquema.js`. | Q-11, Q-17, Q-18 |
| 2026-10-05 | Catálogos: reales los de `05-ceri/catalogos-semilla` (colonias, distritos, sectores, motivos) y los valores del SQL (sexo, situación del vehículo, categoría de sustancia, etc.); el resto son ejemplos ficticios marcados «ejemplo». | No inventar catálogos oficiales. | Regenerar `catalogos.js` con los catálogos de la SSPM. | Q-16 |
| 2026-10-05 | Cierre exige que todo detenido tenga IPH asignado (regla tomada de `schema.sql`). | Coincide con el trigger de cierre del SQL. | Quitar la regla en `cierre()`. | Q-13 |
| 2026-10-05 | Un vehículo «solo inspeccionado» se guarda en la pieza Aseguramiento y no cuenta como aseguramiento en los indicadores. | El modelo permite vehículo sin aseguramiento ni resguardo. | Mover a una pieza propia. | Q-19 |

