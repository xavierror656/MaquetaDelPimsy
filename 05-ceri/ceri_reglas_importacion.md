# Export de CERI (reporte macro) — cómo usarlo en PIMSy

Archivo analizado: `reporte-macro-dia_01_de_julio_2026_Registros_Limpios.xlsx` (hoja `Exportacion`, 102 columnas; la hoja "Hoja 1" está vacía).
**El archivo original NO está en este paquete** porque trae teléfonos y nombres de relatores. Aquí hay una muestra **sintética**
(`ceri_muestra_SINTETICA.csv`, 12 filas inventadas con casos límite) y catálogos semilla sin datos personales.

## Volumen del día de muestra (1-jul-2026) — solo es un techo
- 2,779 registros: 2,001 improcedentes y 778 procedentes (todos con estatus `TERMINO`).
- 617 procedentes incluyen a la SSPM (el campo `CORPORACIÓN` contiene `SPM`): 418 SEGURIDAD, 147 ASISTENCIA, 34 MEDICO, 18 PROTECCION CIVIL.
- Son **despachos**, no eventos de PIMSy. La mayoría no tendrá consecuencias, por eso existe el preregistro con caducidad.
- Es un solo día. Falta confirmar si el archivo estará disponible regularmente y con el mismo formato (Q-29).

## Qué columna alimenta qué
| Columna CERI | Destino en PIMSy | Regla |
|---|---|---|
| `FOLIO` | `evento_preregistro_ceri.folio_ceri` → `evento.folio_ceri` | Único. Si ya existe, no se duplica. |
| `FECHA_Y_HORA_INICIO_LLAMADA` | `evento.fecha_evento`, `hora_evento`, `fecha_hora_conocimiento` | Formato `dd/mm/aaaa hh:mm:ss a. m.|p. m.` (español). |
| `TIPO`, `SUBTIPO`, `CÓDIGO`, `INCIDENTE` | `motivo` (semilla `catalogos-semilla/motivos_ceri.csv`, 103 incidentes) | `tipo_origen` = llamada de emergencia / despacho CERI. |
| `CALLE`, `CALLE_ESQUINA` | `ubicacion.calle`, `cruce_1` | |
| `COLONIA`, `CODIGO_POSTAL` | `ubicacion.colonia_id` (por nombre), `codigo_postal` | CP `0` → nulo. Colonia que no exista en el catálogo → queda pendiente. |
| `REFERENCIA` | `ubicacion.referencia` | |
| `NÚMERO_EXTERIOR`, `NÚMERO_INTERIOR` | `ubicacion.numero_exterior`, `numero_interior` | **Ojo:** en la muestra `NÚMERO_INTERIOR` viene lleno (527 de 617) y `NÚMERO_EXTERIOR` casi vacío (30 de 617) con valores que parecen números exteriores. Posible inversión de columnas: no asumir, dejar marcado (POR VALIDAR). |
| `COORDENADA_X`, `COORDENADA_Y` | `ubicacion.geom` | Parecen UTM (zona 13N, EPSG:32613 — **sin confirmar**). Convertir con PostGIS: `ST_Transform(ST_SetSRID(ST_MakePoint(x,y),32613),4326)`. Si X o Y = 0 → nulo y marcar "sin geolocalizar" (3 de 617). |
| `SPM_DISTRITO`, `SPM_SECTOR` | contraste contra el distrito y sector que calcula PIMSy por polígono | 16 de 617 sin distrito. El catálogo/polígono prevalece. |
| `FECHA_Y_HORA_DESPACHÓ` | referencia (tiempos) | |
| `FECHA_Y_HORA_ACUDIÓ` | `evento.fecha_hora_arribo` | Si es **igual** a `FECHA_Y_HORA_INICIO_LLAMADA` → arribo no registrado: dejar nulo (49 de 617). Si es anterior al despacho → marcar inconsistente (8 de 617). |
| `FECHA_Y_HORA_CIERRE` | solo referencia (cierre en CERI, no cierre del evento PIMSy) | |
| `CORPORACIÓN` | filtro: solo filas donde aparezca `SPM` | Formato `P [SPM, CES] V [PV] ...` (grupos entre corchetes). |
| `ESTATUS` | filtro: solo procedentes (`TERMINO`); descartar `IMPROCEDENTE` | |
| `FOLIO_2DA_LLAMADA` | detección de duplicados / llamadas relacionadas | Vacío en las filas SPM de la muestra. |
| `PRIORIDAD` | informativa | ALTA/MEDIA/BAJA. |
| `Precategoria_incidente` | pista de atención a víctimas | "Violencia contra la mujer" aparece en 106 de las 617. No es criterio de inclusión por sí solo (Q-26/Q-28). |

## Columnas que NO se importan (datos personales o sin valor)
`TELÉFONO` (99.7% lleno), `NOMBRE_DEL_RELATOR`, `GÉNERO_RELATOR`, y las columnas vacías o casi vacías
(instrucciones/asesoría/regulación médica, traslados, kilómetro, origen/destino, otras corporaciones).
`TARJETA_DE_SEGURIDAD`, `ALTO_IMPACTO`, `SIMULACRO`, `CODIGO_NARANJA`, `AGREGO_INFORMACIÓN` son banderas casi constantes: ignorar salvo decisión contraria.

## Ciclo del preregistro (PROPUESTO)
`pendiente` → (un área agrega una consecuencia) → `promovido` (se crea el evento, estado `abierto`) · o → `archivado` al llegar `caduca_en`.
Plazo de caducidad: POR VALIDAR (Q-29). Un preregistro no cuenta en estadísticas.

## Catálogos semilla (`catalogos-semilla/`)
Sacados de un solo día; **no son completos ni oficiales**: sirven para sembrar y contrastar.
`motivos_ceri.csv` (103) · `colonias_ceri.csv` (390) · `distritos_spm.csv` (7) · `sectores_spm.csv` (162 números) ·
`corporaciones_ceri_frecuencia.csv` (49 combinaciones tal como vienen).
