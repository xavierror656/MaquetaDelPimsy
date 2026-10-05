# PIMSy — contexto permanente para Claude Code

## Qué es
PIMSy (Police Information Manager System) es el sistema integrador de información policial de la
Secretaría de Seguridad Pública Municipal (SSPM) de Ciudad Juárez. Centraliza los **eventos de atención
policial (EAP)** y de ellos deriva, sin recapturar, los formularios: IPH (delitos y faltas), parte
informativa, uso de la fuerza, detención, aseguramiento, resguardo, entrega de hechos y atención a emergencia.
Responsable del IPH y de todo PIMSy: **Javier**. Contraparte de flujo y plataforma: **Héctor**.
El idioma del proyecto, del código de dominio (tablas, columnas, textos de UI) y de los commits es **español**.

## Stack (decidido en la Especificación Técnica v1.0)
- PostgreSQL + PostGIS (única fuente de verdad relacional). On-premise en servidores de la SSPM.
- Backend Laravel (PHP). Migraciones y Eloquent sobre PostgreSQL. Servicios por dominio.
- Frontend: SPA con formularios dinámicos (el framework NO está decidido: ver `02-spec-driven/decisiones.md`).
- Integraciones: SIPROB (PostgreSQL, **solo lectura por vistas**), MongoDB (catálogo de agentes, lectura viva),
  Google (georreferenciación, siempre editable a mano). CAD CERI es externo y no se integra por API.
- Dashboard/mapas: Metabase o PowerBI sobre vistas `mv_*` (fuera de este alcance).

## Principios que no se rompen
1. El **EVENTO** es la entidad raíz (`evento_id` UUID inmutable). Los folios son referencias, nunca llaves.
2. **El evento se construye por aportaciones**: nace con un registro mínimo (desde CERI/origen o desde cualquier
   área autorizada) y cada área agrega lo suyo conforme avanza el proceso.
3. **Capturar una vez, aprovechar en todos.** Lo que ya está en el evento no se vuelve a pedir.
4. Los indicadores "hubo detenidos / aseguramientos…" **no se capturan**: se calculan (`v_evento_indicadores`).
5. **Ausencia no es inexistencia**: cada pieza del evento tiene estado `pendiente | registrado | sin_novedad`
   (`evento_componente_estado`). El cierre exige cero pendientes.
6. El **detenido no es un rol de persona**: es entidad propia; su identidad vive en SIPROB (referencia `id_siprob`
   + snapshot mínimo). Un detenido pertenece a **exactamente un IPH**.
7. **Snapshot de agentes**: se congela al agregar el agente al evento (la fuente de verdad es MongoDB).
8. Reglas de bienes: armas y sustancias **solo** por aseguramiento; vehículos y objetos por aseguramiento
   **o** resguardo; el dinero es un **objeto** especial (no sustancia).
9. El IPH nace en **borrador**; jurídico asigna tipo, fuero y autoridad destino antes de firmar.
10. Cierra solo **plataforma**; reabre solo **jurídico**; toda escritura se **audita** (triggers, inmutable).

## Cómo distinguir lo decidido de lo que no
Cada decisión en `02-spec-driven/decisiones.md` y cada requisito en `02-spec-driven/spec.md` lleva una etiqueta:
`DECIDIDO` (spec v1.0 o acuerdo explícito), `PROPUESTO` (propuesta de trabajo, falta validar) o `POR VALIDAR`.
Lo `POR VALIDAR` **no se implementa como si fuera definitivo**: se deja detrás de un punto de extensión o se omite,
y se marca en el código con un comentario `// POR VALIDAR(Q-xx)` donde `Q-xx` es la pregunta de
`02-spec-driven/preguntas_abiertas.md`. Las tablas del grupo "Por validar" del DBML no se crean en migraciones activas.

## Mapa del repositorio de contexto
- `01-requerimiento/` requerimiento original y Especificación Técnica v1.0 (fuente de verdad del diseño).
- `02-spec-driven/` constitución, spec con criterios de aceptación, plan, tareas, decisiones, preguntas, glosario, permisos.
- `03-modelo-datos/` `PIMSy_DB.dbml` (modelo v0.2), `schema.sql` (generado), diagramas, mapeo campo por campo (517 campos).
- `04-campos-formularios/` listas de campos de Parte Informativa, IPH Delitos, IPH Faltas e IUF (este último **sin mapear**),
  y los artefactos legacy (`partes-informativas.html/js`, vistas Mongo) como referencia de campos y catálogos.
- `05-ceri/` cómo usar el export de CERI: reglas de importación, catálogos semilla y una muestra **sintética**.
- `06-analisis/` análisis de brechas e historial del chat de diseño (de aquí salen las decisiones).
- `99-legacy-obsoleto/` documentos superados. **No tomar decisiones desde aquí.**

## Reglas de trabajo
- No inventes catálogos, reglas legales ni valores de negocio. Usa lo que está en estos archivos; lo demás, `POR VALIDAR`.
- Si tienes que asumir algo para avanzar, regístralo en `02-spec-driven/decisiones_asumidas.md` (qué, por qué, cómo revertirlo).
- **Datos 100% sintéticos.** Nunca uses ni generes datos personales reales. El teléfono y el nombre del relator del export
  de CERI **no se importan** (ver `05-ceri/`).
- Convenciones: tablas y columnas en `snake_case` español; llaves técnicas `uuid`; catálogos `cat_*` con `<nombre>_id`
  entero; columnas de aportación en tablas hijas del evento (`aportado_por`, `area_aporta_id`, `aportado_en`);
  snapshots con sufijo `_snap`; fechas en `timestamptz`.
- Antes de dar algo por terminado: migraciones corren desde cero, seeders pasan, pruebas de reglas en verde, y
  `REPORTE_FINAL.md` lista qué cubre cada requisito y qué quedó `POR VALIDAR`.
