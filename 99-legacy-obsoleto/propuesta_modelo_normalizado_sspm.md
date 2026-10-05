Propuesta de modelo normalizado para SSPM

# 1. Contexto

El modelo actual parte de la colección ParteInformativa de MongoDB y genera vistas lógicas tipo mv_er_* para análisis, reportes y visualización ER en dbdiagram.io. Este enfoque es útil para explotación analítica, porque permite consultar detenidos, víctimas, agentes, armas, vehículos, sustancias, objetos, emergencias y faltas administrativas de forma directa.

Sin embargo, desde el punto de vista de normalización, el modelo presenta redundancia porque muchos datos del evento se repiten en cada vista: folio, fecha del evento, distrito, sector, colonia, latitud, longitud e identificadores operativos. Por ello, se propone separar el modelo en una estructura normalizada basada en una entidad principal llamada Evento.

# 2. Problema del modelo actual

El modelo actual usa ParteInformativa como origen principal y después desnormaliza sus arreglos internos hacia vistas como:

- mv_er_agentes

- mv_er_detenidos

- mv_er_victimas

- mv_er_armas

- mv_er_vehiculos

- mv_er_sustancias

- mv_er_objetos

- mv_er_emergencias

- mv_er_faltas_admin

- mv_er_clasi_hechos

Este diseño tiene valor para BI, pero no representa un modelo normalizado puro. Las principales limitaciones son:

- Repetición de datos del evento en múltiples vistas.

- Uso de folio como relación alternativa, aunque no necesariamente es una llave técnica única.

- Mezcla entre modelo transaccional y modelo analítico.

- Duplicación de datos personales en detenidos y víctimas.

- Falta de catálogos para distrito, sector, colonia, género, tipo de arma, tipo de vehículo, unidad de medida, fuero, clasificación y otros valores controlados.

- Uso de identificadores derivados de índices de arreglos de MongoDB.

- Relación débil entre detenido y clasificación de hechos cuando solo se usa id_detenido.

- Campos genéricos como PI_1, PI_2, PI_8, PI_52, PI_53, que dificultan mantenimiento, trazabilidad y validación.

# 3. Propuesta conceptual

La propuesta es usar Evento como entidad raíz. Un evento representa el hecho operativo ocurrido en una fecha, hora, ubicación y contexto determinado.

A partir del evento, se relacionan los documentos, procesos y personas involucradas:

Evento

 ├── Parte Informativa

 ├── IPH

 ├── Emergencia

 ├── Detención

 │    ├── Detenido

 │    ├── Delito

 │    ├── Falta administrativa

 │    └── Orden de aprehensión

 ├── Aseguramiento

 │    ├── Objeto

 │    ├── Vehículo

 │    ├── Sustancia

 │    └── Arma

 ├── Agente involucrado

 └── Víctima

# 4. Matriz de relaciones propuesta

| Entidad origen | Entidad destino | Relación | Descripción |
| --- | --- | --- | --- |
| Evento | Parte Informativa | 1:N | Un evento puede tener una o varias partes informativas asociadas. |
| Evento | IPH | 1:N | Un evento puede generar uno o varios IPH. |
| Evento | Emergencia | 1:N | Un evento puede tener una o varias emergencias relacionadas. |
| Evento | Detención | 1:N | Un evento puede contener una o varias detenciones. |
| Evento | Aseguramiento | 1:N | Un evento puede contener uno o varios aseguramientos. |
| Evento | Agente involucrado | 1:N | Un evento puede tener varios agentes participantes. |
| Evento | Víctima | 1:N | Un evento puede tener una o varias víctimas. |
| Evento | Detenido | 1:N | Un evento puede tener uno o varios detenidos. |
| Detención | Detenido | 1:N | Una detención puede involucrar uno o varios detenidos. |
| Detención | Delito | 1:N | Una detención puede tener uno o varios delitos clasificados. |
| Detención | Falta Administrativa | 1:N | Una detención puede relacionarse con una o varias faltas administrativas. |
| Detención | Orden de Aprehensión | 1:N | Una detención puede estar relacionada con una o varias órdenes de aprehensión. |
| Aseguramiento | Objeto | 1:N | Un aseguramiento puede incluir varios objetos. |
| Aseguramiento | Vehículo | 1:N | Un aseguramiento puede incluir varios vehículos. |
| Aseguramiento | Sustancia | 1:N | Un aseguramiento puede incluir varias sustancias aseguradas. |
| Aseguramiento | Arma | 1:N | Un aseguramiento puede incluir varias armas. |

# 5. Ventajas de la propuesta

5.1 Menor duplicidad

Los datos comunes del hecho, como fecha, hora, distrito, sector, colonia, calle, latitud, longitud y narrativa, se concentran en evento. Las demás tablas solo referencian evento_id.

Esto evita repetir los mismos datos en detenidos, víctimas, armas, vehículos, sustancias, objetos, emergencias y faltas administrativas.

5.2 Mejor integridad referencial

En lugar de relacionar por folio, el modelo usa llaves técnicas como evento_id, parte_informativa_id, detencion_id, aseguramiento_id, persona_id y agente_id.

El folio puede seguir existiendo como dato operativo, pero no debe ser la llave principal del modelo.

5.3 Separación entre operación y análisis

El modelo normalizado sirve como base ordenada, mientras que las vistas mv_er_* pueden seguir existiendo como capa analítica para Metabase, Power BI, CSV, dashboards o consultas rápidas.

La recomendación es manejar dos capas:

Capa operacional normalizada:

- evento

- parte_informativa

- iph

- detencion

- aseguramiento

- persona

- detenido

- victima

- agente

- delito

- falta_administrativa

- orden_aprehension

- objeto

- vehiculo

- sustancia

- arma

Capa analítica desnormalizada:

- mv_er_detenidos

- mv_er_victimas

- mv_er_agentes

- mv_er_armas

- mv_er_vehiculos

- mv_er_sustancias

- mv_er_objetos

- mv_er_emergencias

- mv_er_faltas_admin

- mv_er_clasi_hechos

5.4 Mejor manejo de personas

Se propone una tabla persona para evitar duplicar nombre, apellidos, fecha de nacimiento, género, origen y domicilio en detenidos y víctimas.

Una persona puede participar en distintos eventos con diferentes roles:

- Detenido

- Víctima

- Quejoso

- Testigo

- Otro rol operativo

5.5 Mejor trazabilidad de detenciones

La entidad detención permite agrupar detenidos, delitos, faltas administrativas y órdenes de aprehensión.

Esto evita colocar delitos o faltas directamente contra el evento sin contexto del proceso de detención.

5.6 Mejor trazabilidad de aseguramientos

La entidad de aseguramiento agrupa objetos, vehículos, sustancias, armas y otros bienes asegurados.

Esto permite saber qué elementos fueron asegurados dentro del mismo acto operativo.

5.7 Uso correcto de catálogos

El modelo puede complementarse con catálogos para evitar inconsistencias de escritura:

- cat_distrito

- cat_sector

- cat_colonia

- cat_genero

- cat_fuero

- cat_tipo_arma

- cat_calibre

- cat_tipo_vehiculo

- cat_marca_vehiculo

- cat_tipo_sustancia

- cat_color

- cat_unidad_medida

- cat_tipo_objeto

- cat_tipo_emergencia

- cat_clasificacion_delito

Esto evita variaciones como masculino, MASCULINO, M, hombre o diferencias de escritura en distritos y colonias.

# 6. Recomendación de implementación

No es necesario eliminar las vistas actuales. La recomendación es usarlas como capa analítica y documentarlas como vistas derivadas.

La estructura recomendada sería:

- Mantener ParteInformativa como documento fuente original de MongoDB.

- Crear un modelo lógico normalizado basado en eventos.

- Generar tablas o vistas normalizadas para entidades principales.

- Conservar las vistas mv_er_* como capa de consulta rápida.

- Documentar claramente que mv_er_* no es el modelo transaccional normalizado, sino una representación analítica.

# 7. Frase recomendada para documentación técnica

El modelo propuesto separa el hecho operativo en una entidad central llamada Evento. A partir de este se relacionan documentos, procesos, personas involucradas y aseguramientos. Esta estructura reduce duplicidad, mejora integridad referencial y permite mantener una capa analítica desnormalizada para reportes sin comprometer la consistencia del modelo lógico.

# 8. Conclusión

La propuesta normalizada permite ordenar mejor la información, reducir inconsistencias y facilitar futuras integraciones con reportes, dashboards, APIs, Metabase, Power BI o procesos ETL.

El modelo actual basado en vistas mv_er_* sigue siendo útil, pero debe considerarse como modelo analítico. Para representar correctamente las relaciones del dominio, se recomienda usar evento como entidad raíz y separar procesos como detención y aseguramiento.

# 9. Cumplimiento y Buenas Prácticas

- ISO/IEC 27001 - Seguridad de la información

- ISO/IEC 27002 - Controles de seguridad

- ISO/IEC 27701 - Privacidad de datos

- NIST Cybersecurity Framework - Gestión de riesgos

- NIST SP 800-53 - Controles de seguridad y privacidad

- OWASP ASVS - Seguridad en aplicaciones

- Principios de protección de datos personales

- Principios de trazabilidad y auditoría

- Principio de mínimo privilegio

- Separación de funciones

- Integridad referencial

- Normalización relacional