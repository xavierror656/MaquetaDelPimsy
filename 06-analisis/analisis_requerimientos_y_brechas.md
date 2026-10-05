PIMSy — Sistema Integrador de Información Policial

**Análisis de requerimientos y brechas del modelo**

Revisión de la Especificación Técnica v1.0 frente al requerimiento original y al principio de evento acumulativo

**Organización:** Secretaría de Seguridad Pública Municipal de Ciudad Juárez (SSPM)   |   **Fecha:** 5 de octubre de 2026   |   **Estado:** Borrador para validación

# **1. Resumen**

Se revisaron los 16 archivos del proyecto: el requerimiento original, el planteamiento y las decisiones del chat de diseño, la Especificación Técnica v1.0, el borrador v0.1, las propuestas de ER previas, el análisis de Oscar y Roberto, las vistas de MongoDB y un reporte macro de CERI. La Especificación v1.0 es el documento más avanzado y cubre bien el núcleo del modelo, pero necesita ajustes antes de presentarse a la SSPM.

La aclaración más reciente cambia la lectura de varios puntos: **el evento no se captura completo en un solo formulario; nace con un registro mínimo (desde CERI o desde cualquier área autorizada) y cada área le va agregando lo suyo** (IPH, detención, aseguramientos, agentes, parte informativa). Con ese principio, el objetivo del sistema es normalizar y estandarizar todo el proceso actual, no solo unir formularios.

- **Se resuelven solos con el principio acumulativo:** los booleanos de derivación, la dependencia circular del IPH, el momento del snapshot de agentes y el nacimiento "contingente" del evento.

- **Siguen abiertos y bloquean el diseño:** cómo SIPROB se enlaza con el evento, dónde viven delito y falta cuando no hay detenido, qué pasa con un detenido que no va a IPH, y quién captura a los agentes en eventos sin IPH.

- **Aparece un riesgo nuevo:** en un modelo acumulativo, la ausencia de un registro no significa que no exista (puede estar pendiente de captura). Se necesita una forma explícita de declarar "sin novedad" por área.

# **2. Principio ajustado: el evento se construye por aportaciones**

La tabla compara cómo quedaba cada aspecto en la v1.0 con cómo debe quedar si se adopta el principio acumulativo.

| **Aspecto** | **En la v1.0** | **Con el principio acumulativo** |
| --- | --- | --- |
| Nacimiento del evento | Ruta A (origen primero) como flujo normal; Ruta B (formulario primero) como contingencia. | Dos rutas legítimas de igual rango: (A) el evento llega de CERI o de la interfaz de origen; (B) cualquier rol autorizado lo levanta (policía, jurídico, barandilla, plataforma). Cambia el nivel de completitud del origen, no la validez de la ruta. La conciliación se conserva para duplicados. |
| Booleanos de derivación | Estaban como columnas en el borrador v0.1; desaparecieron en la v1.0, sin decisión explícita. | Se vuelven indicadores derivados: se calculan por la existencia de registros hijos (vista), no se capturan. Solo se capturan declaraciones que no se pueden inferir (uso de la fuerza, "sin novedad" por área). |
| Completitud | Reglas que se validan al intentar cerrar. | Pendientes por área, visibles durante toda la vida del evento. El cierre exige cero pendientes. |
| Responsabilidad del dato | Definida solo en texto (CERI = ubicación, SIPROB = detenido, etc.). | Cada registro guarda quién lo agregó, de qué área y cuándo. Permite supervisión y control de calidad por área. |
| IPH y detenidos | Dependencia circular: el IPH se llena antes, pero su tipo y destino dependen de los delitos del detenido. | El IPH nace en borrador; jurídico asigna tipo, fuero y autoridad destino antes de firmar; detenidos y aseguramientos se enlazan después. |
| Snapshot de agentes | "Al registrar el evento". | Al momento en que el agente se agrega al evento, por cualquier área. |
| Edición concurrente | No considerada. | Varias áreas editan el mismo evento en momentos distintos: requiere control de versiones (bloqueo optimista) y bitácora por cambio. |
| Entrada desde CERI | Captura manual simplificada. | Posible preregistro a partir del reporte de CERI (ver sección 6), con un estado que lo distinga de un evento confirmado. |

| **Consecuencia clave: ausencia no es inexistencia** Si un evento no tiene registros de detención, el sistema no puede saber si no hubo detenidos o si todavía no se capturan. Se propone que cada área marque su estado sobre el evento: **pendiente**, **registrado** o **sin novedad**. Con eso, los indicadores derivados y la regla de cierre son confiables, y también se evita que un evento quede abierto indefinidamente. |
| --- |

# **3. Brechas frente al requerimiento original**

Elementos que el requerimiento original pide y que la v1.0 omite o deja incompletos.

| **Requerimiento** | **Estado en la v1.0** | **Acción propuesta** |
| --- | --- | --- |
| Booleanos de derivación (detenciones, aseguramientos, entrega de hechos, atención a víctimas, quejoso, resguardos, órdenes ejecutadas) | Ausentes en la entidad EVENTO. | Definirlos como indicadores derivados (sección 2) y documentarlo para que el requerimiento quede trazado. |
| Agrupamientos que atienden (catálogo) | No existe CAT_AGRUPAMIENTOS ni el campo en el evento. | Agregar catálogo y relación evento–agrupamiento. |
| Autoridades participantes (catálogo) | Se perdió EVENTO_AUTORIDAD; solo quedan autoridades como destino de IPH y entrega de hechos. | Restituir la relación evento–autoridad con su rol de participación. |
| ID y denominación del evento | Solo existe folio; la denominación se perdió. | Agregar denominación o aclarar que el folio la sustituye. |
| Motivo, con vinculación a datos adicionales | Solo hay un campo motivo. | Definir cómo el motivo habilita campos adicionales (catálogo con "plantilla de datos"). |
| Criterios de inclusión | Omite "atención a víctimas en Trabajo Social o violencia familiar" e "identificación de hechos posiblemente constitutivos de delito o falta"; agrega "atención a emergencia". | Alinear la lista de la sección 4.1 con el requerimiento o documentar el cambio como decisión. |
| Atención a víctimas y canalización | Las extensiones por rol (PART_VICTIMA, etc.) no están definidas. | Definir los atributos de canalización, atención legal, psicológica y médica que hoy captura el Parte Informativo. |
| Narrativa con posibilidad de una segunda por IPH | Cubierta. | Sin acción. |

# **4. Inconsistencias de lógica y huecos**

## **4.1 Abiertos: requieren decisión**

- **Vínculo SIPROB–evento.** La integración es de solo lectura por vistas, pero SIPROB identifica al detenido después de que el policía lo traslada, y no puede guardar el evento_id si no se modifica. Opciones: (a) modificación mínima de SIPROB para capturar el evento; (b) que barandilla seleccione el evento por folio en una vista de PIMSy; (c) conciliación por fecha, hora y datos del detenido. Esta pregunta quedó sin respuesta en el chat de diseño. También debe quedar claro quién es dueño del dato de detención, porque SIPROB sirve a justicia cívica.

- **Delito y falta a nivel evento.** En la v1.0 solo cuelgan del detenido. Pero el criterio de inclusión incluye hechos posiblemente constitutivos de delito o falta, y las vistas actuales (clasificación de hechos, faltas administrativas) ya admiten registros sin detenido. Un evento con presunto delito y solo víctima no tiene dónde guardar la clasificación. Propuesta: relación opcional con el detenido y obligatoria con el evento.

- **Detenido sin IPH.** El Parte Informativo actual presenta al detenido ante ministerio público, fiscal cívico, entrega de hechos o parte informativo. La v1.0 exige exactamente un IPH por detenido. Falta definir el caso de entrega de hechos con detenido.

- **Quién captura a los agentes.** El requerimiento dice que en el primer formulario; el chat dice que los registra el IPH; la v1.0 dice que coordinación. En eventos sin IPH (resguardo, atención a emergencia) no queda claro quién lo hace. Con el principio acumulativo basta definir que cualquier área autorizada puede agregarlos, y que el cierre exige al menos un agente con rol.

- **Atención a emergencia excluyente.** Se define solo para eventos sin detención ni aseguramiento. Se pierde la clasificación de emergencia en eventos que sí los tienen. Propuesta: permitirla siempre y dejar que la regla de completitud dependa de la derivación, no de la exclusión.

- **Dos catálogos de origen mezclados.** El Parte Informativo usa "medio por el que se supo" (CERI, comunitario, recorrido, monitoreo, ciudadano); CAT_TIPO_ORIGEN usa tipo de actividad (patrullaje, operativo, diligencia). Son dimensiones distintas y conviene separarlas.

- **Alcance de eventos sin CERI.** El requerimiento dice que solo se capturan eventos con consecuencias; la v1.0 (sección 4.1) incluye recorridos y patrullajes. Definir si se registran siempre o solo cuando derivan en algo.

- **Datos del detenido que vienen de SIPROB.** Edad, sexo, origen y domicilio llegan por vista. Si SIPROB corrige un dato, las estadísticas históricas cambian. Propuesta: congelar en PIMSy un snapshot mínimo del detenido.

## **4.2 Se resuelven con el principio acumulativo**

- **Dependencia circular del IPH:** el IPH nace en borrador y jurídico lo completa (sección 2).

- **Booleanos de derivación:** pasan a ser indicadores derivados.

- **Momento del snapshot de agentes:** al agregarlos al evento.

## **4.3 Detalle de campos**

- USO_FUERZA es mínimo frente al informe actual; falta el responsable o encargado de turno como rol.

- PERSONA necesita teléfono, ocupación, etnia, origen estructurado (país, estado, ciudad) y colonia del domicilio, que hoy capturan las vistas.

- Falta especificar los campos "otro" que hoy se capturan (etnia, atención legal, atención médica, tipo de sustancia, unidad de medida).

# **5. Riesgos de arquitectura y operación**

| **Riesgo** | **Impacto** | **Mitigación propuesta** |
| --- | --- | --- |
| Dependencia de Google para georreferenciar. La pregunta sobre enviar ubicaciones policiales a un servicio externo quedó sin respuesta. | Fuga de datos sensibles; dependencia de conectividad y de términos de uso. | Validar con jurídico los términos de uso vigentes sobre almacenar resultados y croquis. Evaluar un geocodificador y mapa local, dado que la SSPM ya tiene catálogos y capas propias. |
| El croquis se guarda como archivo (croquis_path), pero la v1.0 quitó el almacenamiento de archivos de la arquitectura. | Croquis sin lugar donde residir. | Reincorporar almacenamiento de objetos on-premise (por ejemplo MinIO) o definir ruta de archivos con respaldo. |
| Transición: se quitó la sincronización con MongoDB sin reemplazo. | Doble captura temporal, o pérdida de continuidad. | Definir una estrategia de corte por formulario y un periodo de coexistencia con fecha. |
| Cuello de botella en plataforma: solo ella cierra eventos y concilia provisionales. | Eventos abiertos indefinidamente. | Tiempos máximos de atención, alertas y reglas de cierre automático o por delegación. |
| Estadística "en tiempo real" con vistas materializadas. | Datos desfasados en el tablero. | Política de refresco por vista, o vistas normales para lo que debe ser inmediato. |
| Protección de datos personales pospuesta a la fase de desarrollo. | Afecta el esquema (menores, víctimas de violencia familiar, domicilios). | Fijar ahora los requisitos: clasificación, retención, campos restringidos y acceso por rol. |
| Requisitos no funcionales: la v1.0 perdió los cuantitativos del borrador (disponibilidad, latencias, escala). "100k–1M usuarios/registros" mezclaba dos métricas. | Sin criterios de aceptación. | Recuperarlos y separar usuarios concurrentes de volumen de registros por año. |
| Edición concurrente de un evento por varias áreas. | Pérdida de cambios o inconsistencias. | Bloqueo optimista con número de versión y bitácora inmutable. |
| Ausencia confundida con inexistencia en indicadores derivados. | Estadísticas subestimadas. | Estado por área: pendiente, registrado o sin novedad (sección 2). |

# **6. Oportunidad: preregistro desde el reporte macro de CERI**

El reporte macro del 1 de julio de 2026 trae folio, coordenadas, calle, colonia, tipo y subtipo, fechas y horas de despacho, arribo y cierre, y distrito y sector por corporación. Aunque no hay API, una **importación diaria del archivo** podría crear preregistros de evento (Ruta A) y reducir mucho la captura manual, además de alimentar el origen simplificado que la SSPM ya aceptó capturar.

| **Dato del archivo (1 de julio)** | **Valor** |
| --- | --- |
| Registros totales | 2,779 |
| Improcedentes | 2,001 |
| Procedentes (terminados) | 778 |
| Procedentes con participación de la SSPM en el campo de corporación | 617 |

Es un solo día y el archivo dice "Registros Limpios", así que hay que confirmar si estará disponible de forma regular y con el mismo formato. Hay una consecuencia importante: la mayoría de esos despachos serían atenciones menores que **no deben registrarse** como evento. Por eso, el preregistro necesita un estado propio (por ejemplo "preregistro CERI") que no cuente en estadísticas y que se promueva a evento solo cuando un área le agregue una consecuencia, o se archive si nadie lo hace en un plazo definido.

# **7. Estado de los documentos del proyecto**

| **Archivo** | **Observación** |
| --- | --- |
| Especificación Técnica v1.0 | Documento vigente. Requiere los ajustes de este análisis. |
| Diseño del Sistema v0.1 | Obsoleto; conserva los booleanos, EVENTO_AUTORIDAD, sincronización con MongoDB y requisitos no funcionales que la v1.0 perdió. |
| Matriz ER y diccionario; propuestas de ER normalizado | Desactualizados: cuelgan IPH y aseguramiento de la detención y tratan al detenido como rol de persona. |
| PDF y DBML de vistas | Corresponden al modelo de MongoDB, no al modelo nuevo. Útiles como fuente de campos. |
| ER_Eventos.xlsx | Vacío. |
| Diagrama draw.io de eventos | Incluye cajas que no están en la v1.0: flagrancia, solicitud de fuerza pública, instancias receptoras y barandilla. Decidir si entran. |
| Análisis de Oscar y Roberto | Mapa útil de campos por formulario; sirve para cerrar el detalle de atributos. |

# **8. Decisiones pendientes**

| **#** | **Decisión** | **Recomendación** | **Responsable** | **Bloquea** |
| --- | --- | --- | --- | --- |
| 1 | Cómo se enlaza SIPROB con el evento | Modificación mínima de SIPROB para capturar el evento; alternativa: búsqueda por folio | TI / SIPROB | Modelo |
| 2 | Delito y falta sin detenido | Relación opcional con detenido, obligatoria con evento | Jurídico | Modelo |
| 3 | Detenido con entrega de hechos (sin IPH) | Definir excepción o IPH de entrega | Jurídico | Modelo |
| 4 | Quién agrega agentes y cuándo | Cualquier área autorizada; cierre exige al menos uno | Plataforma / coordinación | Modelo |
| 5 | Booleanos como indicadores derivados | Aprobar; más estado por área (pendiente, registrado, sin novedad) | Plataforma | Modelo |
| 6 | Roles autorizados para levantar un evento | Policía, jurídico, barandilla y plataforma | Mando | Permisos |
| 7 | Preregistro desde reporte CERI y su caducidad | Estado propio; archivo automático por plazo | Plataforma | Integración |
| 8 | Google u opción local para georreferenciar | Evaluar opción local | TI / jurídico | Arquitectura |
| 9 | Eventos sin CERI: registrar siempre o solo con consecuencia | Solo con consecuencia (alineado al requerimiento) | Mando | Alcance |
| 10 | Requisitos de protección de datos | Fijar ahora | Jurídico / TI | Esquema |

# **9. Siguientes pasos**

- Validar las decisiones 1 a 5, que bloquean el modelo entidad-relación.

- Actualizar la Especificación Técnica a la v1.1 con el principio acumulativo, los indicadores derivados y el estado por área.

- Redibujar el diagrama ER con esos cambios y retirar o archivar los documentos obsoletos.

- Cerrar la lista de atributos por entidad usando el análisis de Oscar y Roberto y las vistas de MongoDB.

- Confirmar con CERI si el reporte macro estará disponible con regularidad.

PIMSy · Análisis de requerimientos y brechas · Página