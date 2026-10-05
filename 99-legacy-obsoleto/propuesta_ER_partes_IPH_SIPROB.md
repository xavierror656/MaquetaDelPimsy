Propuesta de Normalización del Modelo Entidad-Relación: SIPROB

Esta propuesta técnica redefine la arquitectura de datos del Sistema de Procesamiento en Barandillas (SIPROB), estableciendo el **Evento** como el núcleo lógico del sistema. Bajo este esquema, la *Parte Informativa* deja de ser el eje central para convertirse en uno de los múltiples documentos o reportes derivados de un hecho delictivo o administrativo.

# 1. Arquitectura Conceptual del Modelo

La jerarquía normalizada organiza la información en tres niveles: el origen (Evento), los registros operativos (Parte, IPH, Emergencia, etc.) y los detalles específicos (Detenidos, Objetos, Delitos).

- **Evento (Entidad Raíz)**

- **Parte Informativa** (Relación 1:N)

- **IPH** (Relación 1:N)

- **Emergencia** (Relación 1:N)

- **Detención** (Relación 1:N)

- Detenido

- Delito

- Falta Administrativa

- Orden de Aprehensión

- **Aseguramiento** (Relación 1:N)

- Objeto

- Vehículo

- Arma

- **Agente Involucrado** (Relación 1:N)

- **Víctima** (Relación 1:N)

# 2. Matriz de Relaciones Corregida

| Entidad Origen | Entidad Destino | Relación | Comentario |
| --- | --- | --- | --- |
| Evento | Parte Informativa | 1:N | Un evento puede tener una o más partes informativas. |
| Evento | IPH | 1:N | Un evento puede generar uno o varios IPH. |
| Evento | Emergencia | 1:N | Emergencias asociadas directamente al mismo evento. |
| Evento | Detención | 1:N | Un evento puede derivar en múltiples detenciones. |
| Evento | Aseguramiento | 1:N | Un evento puede incluir diversos aseguramientos. |
| Evento | Agente Involucrado | 1:N | Registro de los elementos participantes. |
| Evento | Víctima | 1:N | Relación de personas afectadas en el hecho. |
| Detención | Detenido | 1:N | Una detención individualiza a uno o varios sujetos. |
| Detención | Delito | 1:N | Tipificación penal del hecho. |
| Detención | Falta Administrativa | 1:N | Aplicable en procesos de justicia cívica. |
| Aseguramiento | Objeto / Vehículo / Arma | 1:N | Clasificación detallada de los bienes retenidos. |

# 3. Especificación Técnica de Tablas

## Núcleo Operativo y Evento

La tabla **evento** centraliza la geolocalización, narrativa y tiempos del suceso.

- **Table evento:** evento_id (PK), folio, fecha_evento, hora_evento, distrito_id, sector_id, colonia_id, calle, cruce_1, cruce_2, latitud, longitud, motivo, narrativa.

- **Table parte_informativa:** parte_informativa_id (PK), evento_id (FK), folio, num_folio, tipo, estatus, numero_elemento.

- **Table iph:** iph_id (PK), evento_id (FK), parte_informativa_id (FK), folio, tipo_iph, estatus.

## Gestión de Personas (Normalización)

Para evitar redundancias de datos biográficos, se implementa una tabla maestra de personas que alimenta tanto a víctimas como a detenidos.

- **Table persona:** persona_id (PK), nombre, apellido_paterno, apellido_materno, fecha_nacimiento, genero_id, domicilio.

- **Table detenido:** detenido_id (PK), evento_id (FK), detencion_id (FK), persona_id (FK), edad_al_momento_evento.

- **Table victima:** victima_id (PK), evento_id (FK), persona_id (FK), edad_al_momento_evento, canalizacion.

## Detalle de Detenciones y Aseguramientos

- **Table delito:** delito_id (PK), detencion_id (FK), detenido_id (FK), nombre_delito, modalidad.

- **Table vehiculo:** vehiculo_id (PK), aseguramiento_id (FK), tipo_vehiculo_id, marca_id, modelo, num_serie, placas.

- **Table arma:** arma_id (PK), aseguramiento_id (FK), clasificacion_arma_id, calibre_id, cantidad.

# 4. Beneficios del Modelo Propuesto

- **Integridad Referencial:** Al usar el evento_id como núcleo, se garantiza que todos los registros (desde una patrulla involucrada hasta un casquillo asegurado) pertenezcan al mismo contexto espacial y temporal.

- **Reducción de Redundancia:** El uso de la tabla persona elimina la necesidad de capturar múltiples veces los datos generales de un ciudadano involucrado en distintos roles.

- **Flexibilidad Analítica:** Permite generar estadísticas basadas en el hecho (Evento) independientemente del flujo administrativo (si se generó IPH o solo un Parte Informativo).

- **Escalabilidad:** Facilita la adición de nuevos tipos de registros (ej. grabaciones de cámaras, peritajes) sin alterar la estructura base del modelo.