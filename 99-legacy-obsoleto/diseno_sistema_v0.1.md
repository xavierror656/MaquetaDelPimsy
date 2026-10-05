# PIMSy — Police Information Manager System
## Documento de Diseño del Sistema · v0.1

**Organización:** Secretaría de Seguridad Pública de Ciudad Juárez  
**Fecha:** Junio 2026  
**Estado:** Borrador — en revisión

---

## 1. Resumen ejecutivo

PIMSy es un sistema integrador de información de fuentes múltiples que centraliza los datos de eventos de atención policial (EAP) de la Secretaría de Seguridad Pública de Ciudad Juárez. Su objetivo principal es unificar bases de datos fragmentadas, eliminar el retrabajo en el llenado de formularios y establecer una única fuente de verdad relacional que permita la explotación estadística, geoestadística y operativa de la información policial.

El sistema se orienta al principio de **"llenar una vez, aprovechar en todos"**: cualquier dato capturado desde alguno de sus formularios o sistemas fuente queda disponible para todos los demás sin necesidad de volver a ingresarlo.

---

## 2. Contexto y problemática actual

### 2.1 Sistemas existentes

| Sistema | Tecnología | Función |
|---|---|---|
| SIPROB | PostgreSQL | Control de detenciones, justicia cívica, trabajo social |
| Partes Informativas | MongoDB | Actuaciones policiales |
| IPH Delitos | MongoDB | Puestas a disposición en materia penal + informe homologado |
| IPH Faltas Administrativas | MongoDB | Puestas a disposición en materia de faltas + informe homologado |
| Informe de Uso de la Fuerza | MongoDB | Detalle de uso de la fuerza por agentes |
| Estadísticas | Sybase + Excel | Series históricas y reportes internos |

### 2.2 Problemáticas identificadas

- Bases de datos divididas y tecnológicamente incompatibles (PostgreSQL, MongoDB, Sybase, Excel).
- Múltiple retrabajo al llenar formatos distintos para el mismo evento.
- Falta de homologación en la denominación de campos entre sistemas.
- Vinculación parcial e incompleta entre IPH y partes informativas.
- Ausencia de un modelo de documentación a nivel de evento que relacione la actuación policial con sus múltiples formularios derivados.
- Dificultades para supervisión y control de calidad de datos.
- Imposibilidad de cuantificación confiable de eventos, delitos y actuaciones con fines estadísticos.

---

## 3. Alcance del sistema

### 3.1 Criterios de inclusión de eventos

Solo se capturarán en PIMSy los **eventos de atención policial (EAP)** que cumplan al menos una de las siguientes condiciones:

- Incluyen al menos una detención o aseguramiento.
- Incluyen al menos una entrega de hechos a otra autoridad.
- Incluyen atención a víctimas u otras personas en Trabajo Social o unidad especializada en violencia familiar.
- Incluyen la identificación de hechos posiblemente constitutivos de delitos o faltas administrativas.
- Incluyen el resguardo de personas, vehículos u objetos.

### 3.2 Fuera de alcance (v1)

- Eventos de patrullaje preventivo sin derivaciones documentales.
- Gestión de turnos y asignación operativa de personal.
- Sistema de despacho y comunicación radial.
- Migración automática de datos históricos de todos los sistemas legados.

---

## 4. Requerimientos

### 4.1 Requerimientos funcionales

**RF-01** El sistema debe generar un identificador único (UUID) y denominación para cada EAP registrado.

**RF-02** El primer formulario de captura debe registrar los datos generales del evento: fecha/hora, motivo de participación, ubicación georreferenciada, agrupamientos y elementos intervinientes con sus roles, autoridades participantes y booleanos de derivación.

**RF-03** Cada booleano de derivación (`tiene_detenciones`, `tiene_aseguramientos`, etc.) debe habilitar dinámicamente el formulario correspondiente en la interfaz, sin obligar a llenar formularios no aplicables.

**RF-04** El sistema debe permitir registrar múltiples narrativas por evento, vinculando cada una al IPH que la originó cuando corresponda.

**RF-05** La entidad PERSONA debe ser única y reutilizable en todos los formularios (detenciones, víctimas, quejosos, resguardos) con búsqueda y deduplicación por CURP.

**RF-06** El sistema debe conectarse a SIPROB y registrar la referencia cruzada del id de detención generado en ese sistema.

**RF-07** El sistema debe leer y hacer snapshot de los atributos de elementos policiales (distrito, área, subárea) desde la colección MongoDB al momento del registro del evento.

**RF-08** Los catálogos (motivos, agrupamientos, autoridades, sectores, roles) deben ser administrables desde la plataforma con control de versiones.

**RF-09** El sistema debe exponer una API REST consumible por la plataforma de gestión digital para reportes geoestadísticos.

**RF-10** El sistema debe generar reportes estadísticos configurables por tipo de evento, fecha, sector, agrupamiento y tipo de actuación.

### 4.2 Requerimientos no funcionales

| Atributo | Especificación |
|---|---|
| Escala | 100,000 – 1,000,000 usuarios/registros |
| Disponibilidad | 99.5 % (permite ~43 h de mantenimiento/año) |
| Latencia de escritura | < 500 ms para formularios de captura |
| Latencia de lectura | < 200 ms para consultas simples; < 3 s para reportes |
| Seguridad | RBAC con roles: operador / supervisor / analista / administrador |
| Auditoría | Registro inmutable de cada escritura con usuario y timestamp |
| Integridad | Restricciones de integridad referencial en base de datos; validación en API |
| Portabilidad | Desplegable en infraestructura on-premise o nube privada |

---

## 5. Modelo entidad-relación

### 5.1 Entidad central: EVENTO

El **EVENTO** es la unidad de control del sistema. Todos los formularios derivados se relacionan con él mediante su identificador y heredan su contexto.

```
EVENTO
├── id_evento           UUID, PK, generado automáticamente
├── denominacion        VARCHAR(255)
├── fecha_hora_evento   TIMESTAMPTZ, NOT NULL
├── id_motivo           FK → CAT_MOTIVOS_PARTICIPACION
├── id_ubicacion        FK → UBICACION
├── estado              ENUM(abierto, en_proceso, cerrado, anulado)
├── fecha_registro      TIMESTAMPTZ DEFAULT now()
├── id_usuario_registro FK → USUARIO
│
│   ── Booleanos de derivación ──────────────────────────
├── tiene_detenciones           BOOLEAN DEFAULT false
├── tiene_aseguramientos        BOOLEAN DEFAULT false
├── tiene_entrega_hechos        BOOLEAN DEFAULT false
├── tiene_atencion_victimas     BOOLEAN DEFAULT false
├── tiene_quejoso_denunciante   BOOLEAN DEFAULT false
├── tiene_resguardo_personas    BOOLEAN DEFAULT false
├── tiene_resguardo_objetos     BOOLEAN DEFAULT false
└── tiene_ordenes_aprehension   BOOLEAN DEFAULT false
```

### 5.2 Entidades derivadas del evento

#### NARRATIVA_EVENTO
Permite múltiples narrativas por evento. Cada una puede estar vinculada al IPH que la originó.

```
NARRATIVA_EVENTO
├── id_narrativa    UUID, PK
├── id_evento       FK → EVENTO
├── id_iph          FK → IPH (nullable)
├── texto           TEXT, NOT NULL
├── fecha_registro  TIMESTAMPTZ
└── id_usuario      FK → USUARIO
```

#### UBICACION
Almacena la localización del evento con soporte geoespacial vía PostGIS.

```
UBICACION
├── id_ubicacion      UUID, PK
├── calle_principal   VARCHAR(200)
├── calle_secundaria  VARCHAR(200)
├── numero_exterior   VARCHAR(20)
├── referencias       TEXT
├── id_colonia        FK → CAT_COLONIAS
├── id_sector         FK → CAT_SECTORES
├── latitud           DECIMAL(10,8)
├── longitud          DECIMAL(11,8)
└── geom              GEOMETRY(Point, 4326)   ← PostGIS
```

#### EVENTO_ELEMENTO
Vincula los elementos policiales participantes al evento. Almacena snapshot de los atributos de adscripción para preservar la integridad histórica del registro.

```
EVENTO_ELEMENTO
├── id              UUID, PK
├── id_evento       FK → EVENTO
├── id_elemento_mongo   VARCHAR(100)   ← referencia a MongoDB
├── distrito_snap   VARCHAR(100)       ← snapshot al momento del evento
├── area_snap       VARCHAR(100)
├── subarea_snap    VARCHAR(100)
└── id_rol          FK → CAT_ROLES
```

#### EVENTO_AUTORIDAD

```
EVENTO_AUTORIDAD
├── id_evento       FK → EVENTO
├── id_autoridad    FK → CAT_AUTORIDADES
└── rol_participacion   VARCHAR(100)
```

### 5.3 Formularios derivados

#### IPH (Informe Policial Homologado)
Entidad puente entre el evento y los procesos formales de denuncia. Un evento puede generar múltiples IPH.

```
IPH
├── id_iph          UUID, PK
├── id_evento       FK → EVENTO
├── tipo            ENUM(delito, falta_administrativa)
├── folio           VARCHAR(50), UNIQUE
├── estado          ENUM(borrador, firmado, enviado)
└── fecha_generacion TIMESTAMPTZ
```

#### DETENCION

```
DETENCION
├── id_detencion        UUID, PK
├── id_evento           FK → EVENTO
├── id_persona          FK → PERSONA
├── id_tipo_detencion   FK → CAT_TIPOS_DETENCION
├── fecha_hora          TIMESTAMPTZ
├── tipo_detencion      ENUM(flagrancia, orden_aprehension, administrativa)
└── id_siprob           VARCHAR(100)   ← referencia cruzada SIPROB
```

#### ORDEN_APREHENSION

```
ORDEN_APREHENSION
├── id_orden            UUID, PK
├── id_evento           FK → EVENTO
├── id_detencion        FK → DETENCION
├── numero_expediente   VARCHAR(100)
├── id_autoridad_emisora FK → CAT_AUTORIDADES
└── fecha_emision       DATE
```

#### ASEGURAMIENTO
Tabla base con herencia para subtipos. Los atributos específicos de cada subtipo (vehículo, objeto, sustancia) se definirán al entregar el catálogo completo de atributos.

```
ASEGURAMIENTO (tabla base)
├── id_aseguramiento    UUID, PK
├── id_evento           FK → EVENTO
├── tipo                ENUM(vehiculo, objeto, sustancia, animal, dinero, otro)
├── cantidad            INTEGER
└── observaciones       TEXT

ASEGURAMIENTO_VEHICULO  ← hereda de ASEGURAMIENTO
├── placas, marca, modelo, color, num_serie, tipo_vehiculo ...

ASEGURAMIENTO_OBJETO    ← hereda de ASEGURAMIENTO
├── descripcion, tipo_bien, unidad_medida ...

ASEGURAMIENTO_SUSTANCIA ← hereda de ASEGURAMIENTO
├── tipo_sustancia, cantidad_gramos, unidad_medida ...

[Atributos completos por confirmar]
```

#### ENTREGA_HECHOS

```
ENTREGA_HECHOS
├── id_entrega          UUID, PK
├── id_evento           FK → EVENTO
├── id_autoridad        FK → CAT_AUTORIDADES
├── fecha_hora          TIMESTAMPTZ
└── descripcion         TEXT
```

#### ATENCION_VICTIMA

```
ATENCION_VICTIMA
├── id_atencion         UUID, PK
├── id_evento           FK → EVENTO
├── id_persona          FK → PERSONA
├── id_unidad           FK → CAT_UNIDADES_ESPECIALIZADAS
└── tipo_atencion       ENUM(trabajo_social, violencia_familiar, otro)
```

#### QUEJOSO_DENUNCIANTE

```
QUEJOSO_DENUNCIANTE
├── id_quejoso          UUID, PK
├── id_evento           FK → EVENTO
├── id_persona          FK → PERSONA
└── tipo                ENUM(quejoso, denunciante)
```

#### RESGUARDO_PERSONA

```
RESGUARDO_PERSONA
├── id_resguardo        UUID, PK
├── id_evento           FK → EVENTO
├── id_persona          FK → PERSONA
├── motivo              TEXT
├── fecha_inicio        TIMESTAMPTZ
└── fecha_fin           TIMESTAMPTZ (nullable)
```

#### RESGUARDO_OBJETO

```
RESGUARDO_OBJETO
├── id_resguardo_obj    UUID, PK
├── id_evento           FK → EVENTO
├── tipo_objeto         VARCHAR(100)
├── descripcion         TEXT
├── cantidad            INTEGER
└── estado_bien         VARCHAR(100)
```

#### USO_FUERZA

```
USO_FUERZA
├── id_uso_fuerza       UUID, PK
├── id_evento           FK → EVENTO
├── id_iph              FK → IPH
├── id_elemento_mongo   VARCHAR(100)   ← referencia al elemento que usó la fuerza
└── id_nivel_fuerza     FK → CAT_NIVELES_FUERZA
```

#### PARTE_INFORMATIVA

```
PARTE_INFORMATIVA
├── id_parte            UUID, PK
├── id_evento           FK → EVENTO
├── id_iph              FK → IPH (nullable)
├── folio               VARCHAR(50)
└── tipo_actuacion      VARCHAR(100)
```

### 5.4 Entidad compartida: PERSONA

Entidad central para todas las personas registradas en el sistema. La búsqueda por CURP es el mecanismo principal de deduplicación.

```
PERSONA
├── id_persona          UUID, PK
├── nombre              VARCHAR(100), NOT NULL
├── primer_apellido     VARCHAR(100), NOT NULL
├── segundo_apellido    VARCHAR(100)
├── fecha_nacimiento    DATE
├── sexo                ENUM(masculino, femenino, no_especificado)
├── curp                VARCHAR(18), UNIQUE (nullable si extranjero)
├── num_documento_id    VARCHAR(50)
├── tipo_documento      VARCHAR(50)
└── nacionalidad        VARCHAR(60)
```

### 5.5 Catálogos principales

| Catálogo | Descripción |
|---|---|
| CAT_MOTIVOS_PARTICIPACION | Razones de intervención policial con categoría y flag de datos adicionales |
| CAT_AGRUPAMIENTOS | Estructura jerárquica policial (self-join para niveles) |
| CAT_ROLES | Roles de participación en eventos |
| CAT_AUTORIDADES | Autoridades externas (municipal / estatal / federal) |
| CAT_SECTORES | Sectores y zonas geográficas con geometría PostGIS |
| CAT_COLONIAS | Colonias del municipio |
| CAT_TIPOS_DETENCION | Modalidades de detención |
| CAT_NIVELES_FUERZA | Escala de uso de la fuerza (niveles 1–7) |
| CAT_UNIDADES_ESPECIALIZADAS | Unidades de atención (Trabajo Social, UFAM, etc.) |

---

## 6. Arquitectura del sistema

### 6.1 Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Base de datos | PostgreSQL 16 + PostGIS | BD relacional madura, soporte nativo para geometrías, compatible con SIPROB existente |
| Caché | Redis | Catálogos de alta consulta, sesiones JWT, caché de reportes costosos |
| Almacenamiento de archivos | MinIO (on-premise) / S3 | Documentos adjuntos, PDFs generados, evidencias fotográficas |
| Backend de servicios | Node.js (Express/Fastify) o FastAPI (Python) | A definir según capacidades del equipo de desarrollo |
| Frontend | React + Vite | SPA moderna con soporte para formularios dinámicos |
| Panel estadístico | Metabase o PowerBI | Dashboards sobre PostgreSQL sin desarrollo adicional |

### 6.2 Capas del sistema

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTES                                               │
│  App Web · Portal supervisión · Panel estadístico       │
│  Plataforma gestión digital · Consumidores API          │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  API GATEWAY + AUTH                                     │
│  JWT · RBAC (operador/supervisor/analista/admin)        │
│  Rate limiting · Registro de auditoría                  │
└──────┬──────────┬──────────┬──────────┬──────────┬──────┘
       │          │          │          │          │
   Svc.       Svc.       Svc.       Svc.       Svc.
  Eventos  Formularios Personas  Integración Reportes
       │          │          │          │          │
┌──────▼──────────▼──────────▼──────────▼──────────▼──────┐
│  DATOS                                                  │
│  PostgreSQL + PostGIS · Redis · Object Storage          │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  SISTEMAS EXTERNOS                                      │
│  SIPROB · MongoDB (IPH/Partes) · Sybase · Plataforma    │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Descripción de servicios

**Svc. Eventos** — Gestiona el ciclo de vida del EAP: creación, validación de booleanos de derivación, generación de ID/folio, manejo de estados y narrativas.

**Svc. Formularios** — Contiene un endpoint dedicado por cada formulario derivado (detenciones, aseguramientos, víctimas, resguardos, entrega de hechos, uso de fuerza). Cada formulario solo está disponible si el booleano correspondiente en el evento está activo.

**Svc. Personas** — Gestiona la entidad PERSONA con lógica de deduplicación por CURP, unificación de registros duplicados e historial de apariciones de una persona en eventos.

**Svc. Integración** — Contiene adaptadores independientes por sistema externo: conector REST para SIPROB, driver de MongoDB para lectura de elementos y snapshot de atributos, ODBC/ETL para estadísticas legacy. Si un sistema externo cambia su interfaz, solo se modifica su adaptador.

**Svc. Reportes** — Consultas OLAP sobre vistas materializadas de PostgreSQL, geo-queries vía PostGIS, exportación a PDF/Excel, caché de reportes costosos en Redis.

### 6.4 Decisiones de base de datos

**Particionado por fecha.** La tabla EVENTO se particionará por rango mensual en `fecha_hora_evento`. A escala grande (>100k registros), esto mantiene el rendimiento en consultas acotadas por periodos de tiempo, que son el patrón dominante en estadísticas policiales.

**Índices recomendados:**

| Tabla | Columna(s) | Tipo | Propósito |
|---|---|---|---|
| EVENTO | fecha_hora_evento | B-Tree | Filtros por periodo |
| EVENTO | estado | B-Tree | Consultas por estado |
| UBICACION | geom | GiST | Consultas geoespaciales |
| PERSONA | curp | B-Tree UNIQUE | Deduplicación |
| DETENCION | id_siprob | B-Tree | Referencia cruzada |
| EVENTO_ELEMENTO | id_elemento_mongo | B-Tree | Referencia cruzada |

**Roles de base de datos:**

| Rol | Permisos |
|---|---|
| `app_rw` | SELECT, INSERT, UPDATE en todas las tablas de negocio |
| `app_ro` | SELECT en todas las tablas de negocio |
| `reporting_ro` | SELECT en vistas materializadas y tablas de reportes |

**Auditoría.** Se implementará mediante una tabla `AUDITORIA_LOG` poblada por triggers de PostgreSQL en cada operación de escritura, registrando: tabla afectada, operación (INSERT/UPDATE), valores anteriores y nuevos, usuario de aplicación y timestamp.

---

## 7. Integraciones con sistemas externos

### 7.1 SIPROB (PostgreSQL)

| Aspecto | Detalle |
|---|---|
| Dirección | Bidireccional |
| Mecanismo | API REST expuesta por SIPROB |
| Flujo de escritura | Al registrar una DETENCION en PIMSy se envía a SIPROB y se almacena `id_siprob` |
| Flujo de lectura | PIMSy puede consultar el estado procesal de una detención en SIPROB |
| Campo clave | `DETENCION.id_siprob` |

### 7.2 MongoDB (IPH, Partes, Uso de Fuerza, Elementos)

| Aspecto | Detalle |
|---|---|
| Dirección | Lectura de elementos · Sincronización de actuaciones |
| Mecanismo | MongoDB driver (Node.js/Python) |
| Elementos policiales | Al crear EVENTO_ELEMENTO, se consulta MongoDB por `id_elemento_mongo` y se guarda snapshot de `distrito`, `área`, `subárea` |
| IPH/Partes | Los registros creados en PIMSy se sincronizan hacia MongoDB para no romper flujos existentes durante la transición |
| Campo clave | `EVENTO_ELEMENTO.id_elemento_mongo` |

### 7.3 Estadísticas legacy (Sybase + Excel)

| Aspecto | Detalle |
|---|---|
| Dirección | Lectura (migración) |
| Mecanismo | ODBC para Sybase; parseo de Excel para series históricas |
| Estrategia | ETL de carga inicial para series históricas; PIMSy reemplaza la generación de estadísticas nuevas |

### 7.4 Plataforma de gestión digital

| Aspecto | Detalle |
|---|---|
| Dirección | Salida (push) |
| Mecanismo | API REST + webhooks al cerrar un evento |
| Formato | GeoJSON para capas geoespaciales; JSON estándar para métricas |
| Cadencia | En tiempo real al cierre del evento; reportes agregados por lote noche |

---

## 8. Análisis de trade-offs

### 8.1 Snapshot vs. join en tiempo real para elementos MongoDB

**Decisión adoptada:** snapshot al momento del evento.

**Justificación:** Los registros policiales son documentos históricos inmutables. Si un elemento cambia de área después del evento, el registro debe reflejar la adscripción vigente cuando ocurrió el evento, no la actual. Además, elimina dependencias de disponibilidad de MongoDB para consultar eventos pasados.

**Desventaja:** Los datos del elemento en PIMSy pueden quedar desincronizados con los datos actuales en MongoDB. Se deberá definir una política de actualización para datos de contacto o correcciones administrativas.

### 8.2 Herencia de tablas para ASEGURAMIENTO vs. tabla única con columnas nullable

**Decisión adoptada:** herencia de tablas en PostgreSQL.

**Justificación:** Cada subtipo de aseguramiento tiene atributos cualitativamente distintos (un vehículo tiene placas y número de serie; una sustancia tiene gramos y tipo). Una tabla única generaría una cantidad excesiva de columnas nullable, degradando la integridad del esquema y la legibilidad de las consultas.

**Desventaja:** Las consultas que necesitan todos los aseguramientos de un evento requieren UNION o JOINs adicionales. Se resuelve con una vista que consolida todos los subtipos.

### 8.3 PostgreSQL como base única vs. mantener MongoDB para IPH

**Decisión adoptada:** PostgreSQL como base principal, con sincronización a MongoDB durante la transición.

**Justificación:** La fragmentación actual es el problema raíz. Mantener MongoDB como sistema primario perpetúa la desarticulación. La sincronización bidireccional durante la transición permite que los sistemas que consumen MongoDB sigan funcionando sin cambios mientras se migran gradualmente.

**Desventaja:** La sincronización bidireccional introduce riesgo de conflictos. Se mitiga designando PIMSy como sistema de escritura autoritativo y MongoDB como receptor de solo escritura sincronizada.

---

## 9. Pendientes para próximas iteraciones

| Tema | Descripción |
|---|---|
| Atributos completos por entidad | El usuario entregará los atributos específicos de cada formulario para definir las columnas exactas de cada tabla |
| Subtipos de ASEGURAMIENTO | Definir columnas de ASEGURAMIENTO_VEHICULO, ASEGURAMIENTO_OBJETO, ASEGURAMIENTO_SUSTANCIA |
| Modelo de permisos | Definir qué roles pueden crear, editar y cerrar cada tipo de formulario |
| Diseño de formularios UI | Flujo de pantallas por tipo de evento, validaciones frontend |
| Estrategia de migración | Plan de migración de datos históricos de Sybase/Excel |
| Ambientes de despliegue | Definir infraestructura on-premise (servidores, red, respaldo) |
| Pruebas de carga | Validar rendimiento a escala con datos sintéticos antes del lanzamiento |

---

*Documento generado con apoyo de Claude — PIMSy v0.1 · Junio 2026*
