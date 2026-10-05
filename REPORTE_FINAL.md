# REPORTE FINAL — Maqueta PIMSy

## Alcance
Solo la **maqueta** (T-12, T-13, T-14). No se construyó backend, migraciones, importador, API ni pruebas automatizadas (T-01..T-11, T-15). Ver `02-spec-driven/decisiones_asumidas.md`.

## Cómo correrla
Abrir `maqueta/index.html` en el navegador (incluye Alpine.js en `vendor/`). Para publicarla: `.github/workflows/pages.yml` despliega `maqueta/` en GitHub Pages (Settings > Pages > Source = GitHub Actions). Datos 100% sintéticos; se guardan en el navegador y el botón «Reiniciar datos» los restaura.

## Requisito → dónde está
| Requisito | Implementación (`maqueta/index.html`) |
|---|---|
| REQ-MAQ-01 selector de departamento | `#dept`, `can()`, `B()`: botones deshabilitados con «Lo aporta …» |
| REQ-MAQ-02 hoja de validación | pestaña «Hoja de validación», exporta JSON e imprime |
| REQ-MAQ-03 marcas POR VALIDAR | `pv(Q-xx)` en toda la UI |
| REQ-EVT-01/02/03 rutas A y B, registro mínimo | `crearA`, botón «Levantar evento (Ruta B)», folio CERI único |
| REQ-EVT-04 estados | `mut()`; borrador_sin_origen → abierto → en_proceso → cerrado → reabierto / anulado |
| REQ-EVT-05 concurrencia | `version` + botón «Simular edición de otra área» |
| REQ-EVT-06 alerta de duplicado | `duplicado()` |
| REQ-APO-01 aportación | cada registro guarda área y momento |
| REQ-APO-02/03 estado por pieza e indicadores | panel de estado y `indicadores()` |
| REQ-AGE-01 snapshot de agentes | agentes con snapshot y «Simular cambio en Mongo» |
| REQ-IPH-01..03 | IPH borrador, asignación por Jurídico, firma bloqueada sin tipo/fuero/autoridad, detenido en un IPH |
| REQ-BIE-01 pertenencia de bienes | `bienChk()` |
| REQ-CON-01 fusión | pestaña «Conciliación», `fusion()` atómica y auditada |
| REQ-CIE-01/02 cierre y reapertura | `cierre()`, solo Plataforma cierra, solo Jurídico reabre |
| REQ-AUD-01 auditoría | pestaña «Auditoría» (solo se agrega) |
| REQ-SEG-01 RBAC | matriz `PERM` y pestaña «Permisos» |
| REQ-CER-01 preregistro | pestaña «Preregistros CERI» (sin teléfono ni relator) |

## Cubierto parcialmente o no cubierto
- REQ-IPH-04/05: implementados (aviso y regla de cierre para aseguramiento sin detenido; narrativa del evento y por IPH cuando hay más de uno).
- Delito/falta sin detenido: solo punto de extensión visible, POR VALIDAR(Q-12).
- REQ-SEG-02 (datos sensibles): no aplica, no hay datos personales.
- REQ-UBI-01: ubicación manual; no hay polígonos ni geocodificación.
- Auditoría simulada en memoria: no hay triggers ni bloqueo real de UPDATE/DELETE.

## POR VALIDAR visibles
Q-01, Q-02, Q-04, Q-05, Q-06, Q-08, Q-13, Q-14, Q-15, Q-20, Q-21, Q-29, Q-30, Q-31, más las preguntas por área de la hoja. Tablas del grupo «Por validar» del DBML: no se crean ni se muestran.

## Deuda técnica
- Se probó con un navegador automatizado (carga, vistas, guía por departamento, fusión, firma de IPH, sin errores de consola). Falta un recorrido manual con usuarios reales.
- 23 pruebas de navegador (Playwright) corren en GitHub Actions antes de publicar.

## Mejoras de usabilidad
Guía «Tu siguiente paso» por departamento y evento, barra de avance para cerrar, explicación inicial en 4 pasos, estados con texto claro, resumen automático en lenguaje normal y datos técnicos ocultos por defecto.

## Librerías de UI
- **TanStack Form** (`@tanstack/form-core`, vía CDN esm.sh): validación de formularios (obligatorios, solo dígitos, fechas no futuras, números). Requiere internet; sin él usa una validación simple.
- **shadcn/ui**: solo su estilo en CSS. La librería real requiere React + build y queda como siguiente paso si se decide el framework.

## Segunda tanda de UX/UI
Sin emojis; iconos Lucide embebidos (SVG en línea, funcionan sin internet). Modo claro/oscuro/automático, búsqueda y filtros, pestañas en el detalle, confirmaciones y «Deshacer» (un nivel; el deshacer queda en la auditoría), avisos apilables, historial como línea de tiempo, diseño para tableta/celular, estados vacíos con acción, recorrido guiado y accesibilidad (foco visible, atajos `/` y `Esc`, ARIA).

## Formularios completos
Cada entidad del DBML v0.2 tiene su formulario en `maqueta/esquema.js` (campos, catálogos, condiciones y permisos por campo). Probado en navegador automatizado: se abren los 26 formularios, validan obligatorios, ocultan campos condicionales, autollenan CP, guardan y recuperan borradores. Falta una revisión manual en celular y con usuarios reales.

## Tercera tanda de mejoras
Tarjetas de resumen con filtros (todos, donde me falta aportar, listos para cerrar, provisionales, posibles duplicados); ficha imprimible del evento (PDF desde el navegador); respaldo de datos (exportar e importar JSON); revisión de cada formulario en la hoja de validación (está bien, falta o sobra algún campo, con comentario), incluida en el JSON exportado; lista compacta y encabezado reducido en celular.

## Primera visita
Al entrar por primera vez se elige el departamento (tarjetas de color con lo que hace cada uno), se recuerda para la siguiente visita y se ofrece el recorrido guiado, que al terminar oculta la explicación inicial. «Reiniciar datos» pide confirmación. Favicon y metadatos agregados.

## Diseño atómico y tema centralizado
`maqueta/DESIGN.md` (31 leyes), `css/` en capas (theme → base → atoms → molecules → organisms → responsive), `ui/` con átomos, moléculas y organismos puros sin dominio, `ui/theme.js` con las perillas (matiz, tamaño del texto, espaciado, redondeo) y un panel «Diseño» en el encabezado. `tools/lint-design.mjs` hace cumplir las leyes (sin colores/tamaños/capas literales fuera del tema, dependencias entre capas, sin emojis, tokens existentes) y corre en GitHub Actions antes de publicar.

## Cuarta tanda (diez mejoras)
Sesión de validación con lista de tareas por departamento · comentarios por campo que llegan a la hoja y al JSON · captura rápida («Guardar y registrar otro», Ctrl+Enter, foco automático) · búsqueda global (`/` o Ctrl+K) · 8 eventos de ejemplo (uno por situación) · mapa para ubicar el evento (Leaflet, incluido en el repo) · comparación lado a lado antes de fusionar · tablero del analista con 6 gráficas y su tabla · instalable y sin conexión (PWA) · pruebas automáticas en GitHub Actions.
