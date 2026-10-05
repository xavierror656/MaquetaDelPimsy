# PIMSy — Sistema Integrador de Información Policial

## Especificación Técnica para el Equipo de Desarrollo · v1.0

**Organización:** Secretaría de Seguridad Pública Municipal de Ciudad Juárez (SSPM) **Fecha:** Junio 2026 **Estado:** Propuesta para revisión y aprobación **Audiencia:** Equipo de desarrollo, área jurídica, área de plataforma y mandos de la SSPM

Este documento es una especificación técnica, pero está redactado para ser entendible por todas las partes interesadas. Las secciones 1 a 6 describen el *qué* y el *por qué* en lenguaje accesible; las secciones 7 en adelante entran al detalle técnico del modelo, las reglas y la arquitectura.

## 1. Resumen ejecutivo

La información de la SSPM hoy vive dispersa en sistemas poco interconectados (CAD CERI, SID, SIPROB, IPH de delitos, IPH de faltas administrativas, partes informativas, informes de uso de la fuerza), con doble captura, campos no homologados y sin una unidad común que relacione todo lo que ocurre en una misma intervención policial.

**PIMSy** establece una **única fuente de verdad relacional en PostgreSQL** organizada alrededor de una entidad raíz: el **EVENTO**. Cada intervención policial se registra una sola vez como evento, y de él se derivan —sin volver a capturar lo ya capturado— todos los formularios: detención, aseguramiento, resguardo, atención a emergencia, entrega de hechos, uso de la fuerza, IPH y parte informativa.

El principio rector es **"****capturar una vez, aprovechar en todos****"**: cada formulario *aporta* datos al modelo y *consume* los que otro formulario ya aportó. Si el detenido ya se registró en SIPROB, el IPH no lo recaptura; si los agentes ya se registraron en el IPH, la parte informativa no los recaptura.

## 2. Contexto y problemática

### 2.1 Sistemas actuales

| **Sistema** | **Tecnología** | **Rol respecto a PIMSy** |
| --- | --- | --- |
| CAD CERI | Gobierno Estatal (sin acceso a arquitectura) | Externo; no integrable. Su despacho se reproduce con una captura simplificada de origen. |
| SID (Sistema Integral de Detenciones) | Gobierno Estatal (sin acceso) | **Legacy.** Se deja de usar; deja de existir la doble captura SID↔SIPROB. |
| SIPROB | Python + PostgreSQL | **Se conserva.** Fuente de verdad del **detenido** (deduplicación por CURP y huella). Se integra por esquema/vistas. |
| IPH Delitos / IPH Faltas / Uso de Fuerza / Partes Informativas | Laravel + MongoDB | **Legacy.** Se reconstruyen como formularios de PIMSy. |
| Plataforma de gestión digital (catálogo de agentes) | MongoDB | Fuente del **catálogo de agentes** (consulta viva; PIMSy guarda snapshot). |

### 2.2 Problemas que resuelve PIMSy

- Doble captura entre sistemas (especialmente SID↔SIPROB y entre los formularios MongoDB).

- Falta de homologación de campos y de una entidad que relacione la actuación con sus formularios derivados.

- Vinculación parcial e incompleta entre IPH y partes informativas.

- Imposibilidad de explotación estadística y geoestadística confiable en tiempo real.

## 3. Principios de diseño

- **El EVENTO es la entidad raíz.** Todo cuelga de un evento_id (UUID interno, inmutable). Los folios operativos (CERI, IPH, parte, SIPROB) son referencias, nunca la llave del modelo.

- **Capturar una vez, aprovechar en todos.** Cada formulario lo llena el área especializada (CERI: ubicación; SIPROB: detenido; jurídico/IPH: entidades aseguradas y enrutamiento; coordinación: agentes y parte informativa) y el dato queda disponible para los demás.

- **SIPROB es autoritativo para el detenido**; PIMSy lo referencia, no lo recaptura.

- **Los sistemas SID y los MongoDB quedan como legacy**; PIMSy los reemplaza con formularios simplificados.

- **El conteo estadístico es un resultado del modelo**, no condiciona su forma. El modelo se diseña por corrección relacional; la estadística se deriva por vistas analíticas.

- **Integridad histórica vía snapshot.** Los datos que pueden cambiar después del evento (adscripción del agente) se congelan al momento del registro.

- **Derivación lógica de atributos entre formularios.** Una sola captura debe derivar, mediante lógica de negocio, los valores equivalentes que requieren otros formularios, evitando recapturar lo que ya puede inferirse (ver sección 7.12).

## 4. Alcance

### 4.1 Dentro del alcance (v1)

Se registran como evento las intervenciones que deriven en al menos una de estas situaciones: **detención, aseguramiento, resguardo (de personas, vehículos u objetos), atención a emergencia, o entrega de hechos.** También se registran, mediante una interfaz de origen semejante a la de CERI, los eventos que **no nacen de un despacho CERI**: recorridos, patrullajes, operativos (propios o conjuntos) y diligencias de acompañamiento de la fuerza pública.

### 4.2 Fuera del alcance (v1)

- **Atenciones menores** sin trascendencia documental (no se registran).

- Gestión de turnos y asignación operativa de personal.

- Sistema de despacho y comunicación radial (CAD CERI permanece externo).

- **Vinculación entre eventos** (análisis de inteligencia/investigación): cada evento es independiente; la vinculación la harán las áreas de investigación fuera de PIMSy.

- **Evidencias y adjuntos** (fotos, PDFs) — etapa posterior. **Excepción:** el croquis estático del lugar sí se genera en v1.

- Migración masiva de datos históricos de todos los sistemas legados.

## 5. Actores y áreas

| **Actor / área** | **Responsabilidad en PIMSy** |
| --- | --- |
| **CERI** (externo) | Origina la mayoría de los eventos. PIMSy captura un origen simplificado con su folio. |
| **Policía / primer respondiente** | Inicia la actuación; aporta datos de campo y la parte informativa. |
| **Barandilla / SIPROB** | Registra al detenido (CURP, huella). PIMSy lo referencia. |
| **Área jurídica** | Concluye y enruta los IPH; decide la autoridad destino de detenidos y aseguramientos. **Reabre** eventos. |
| **Área de plataforma** | Administra catálogos, concilia eventos provisionales y **cierra** eventos. |
| **Analistas / mando** | Consumen dashboard, mapas y reportes. |

## 6. Flujo operativo y ciclo de vida del evento

### 6.1 Nacimiento del evento (modelo de doble ruta con conciliación)

El nacimiento del evento es el punto más delicado porque la captura es multiorigen y multietapa. PIMSy lo resuelve con **dos rutas de creación** y una **bandeja de conciliación** administrada por plataforma.

**Ruta A — Origen primero (flujo normal).** La interfaz "Registro de Origen" (semejante a CERI) crea el evento con su tipo_origen, folio CERI cuando aplique, ubicación georreferenciada y motivo. Los demás formularios únicamente **seleccionan** un evento existente.

**Ruta B — Formulario primero (contingencia).** Si un formulario (IPH, parte, detención) se inicia sin evento_id, el sistema crea automáticamente un **evento provisional** (estado = borrador_sin_origen) para darle raíz inmediata y lo asocia.

**Conciliación (área de plataforma).** Plataforma trabaja una bandeja de eventos provisionales y, por cada uno, decide entre:

- **Completar** el origen y promover el evento a abierto; o

- **Fusionar** el provisional con el evento real al que pertenece (identificado por folio CERI, hora+ubicación o agentes): se reasigna el evento_id de todos los registros hijos al evento canónico y el provisional se marca anulado. La operación queda auditada.

**Salvaguardas.** El evento_id nunca cambia. Un formulario puede guardarse en borrador contra un evento provisional, pero **no puede cerrarse** hasta que el evento tenga origen completo. Al registrar un nuevo origen, el sistema **alerta si coincide** con uno existente (folio CERI único + heurística de proximidad espacio-temporal) para evitar duplicados.

### 6.2 Máquina de estados del evento

borrador_sin_origen ──► abierto ──► en_proceso ──► cerrado ──► reabierto

        │                                              ▲   (jurídica)  │

        └───────────────► anulado ◄────────────────────┘──────────────┘

   (fusión / error)        (cierre = área de plataforma)

- **Cerrar:** únicamente el **área de plataforma**.

- **Reabrir:** únicamente el **área jurídica**.

- **Anular:** producto de fusión o error, auditado.

### 6.3 Reglas de completitud por tipo de derivación

No hay "disparadores" automáticos; hay **reglas de completitud** que el sistema valida antes de permitir cerrar un evento:

| **Si el evento tiene…** | **…el sistema exige** |
| --- | --- |
| Detención o aseguramiento | Al menos **un IPH** asociado |
| Detención, aseguramiento, atención a emergencia, resguardo o entrega de hechos | Una **parte informativa** |
| Declaración de uso de la fuerza | Un **informe de uso de la fuerza** |

El **IPH se llena antes** de registrar detenidos y aseguramientos (no al revés). El uso de la fuerza solo se llena si se declaró que la hubo.

## 7. Modelo entidad-relación

### 7.1 Visión general por capas

| **Capa** | **Entidades** | **Regla de diseño** |
| --- | --- | --- |
| **Raíz** | evento | Única entidad que concentra origen, fecha, ubicación y narrativa general. |
| **Origen / geo** | origen_evento, ubicacion | El origen es cómo nace el evento; la ubicación deriva geo del punto validado. |
| **Documental** | iph, parte_informativa | Documentos formales del evento. SIPROB queda externo referenciado. |
| **Proceso** | detencion, aseguramiento, resguardo, emergencia, entrega_hechos, uso_fuerza | Agrupan las distintas actuaciones derivadas. |
| **Maestras** | persona, agentes (en MongoDB) | Entidades reutilizables; no se confunden con el rol que juegan en un evento. |
| **Roles** | participacion_persona, agente_involucrado | Participación por evento; guardan datos históricos del rol, no toda la entidad maestra. |
| **Detenido y legales** | detenido (ref. SIPROB), delito, falta_administrativa, orden_aprehension | Cuelgan del detenido dentro de una detención. |
| **Bienes** | vehiculo, objeto, arma, sustancia | Cuelgan de un aseguramiento o (vehículo/objeto) de un resguardo. |
| **Catálogos** | cat_* | Administrables por la SSPM, homologados a la informática nacional. |
| **Analítica** | vistas mv_* | Desnormalización para dashboard, mapas y reportes; no afecta el modelo transaccional. |

### 7.2 Entidad raíz: EVENTO

EVENTO

├── evento_id            UUID, PK, inmutable

├── folio                VARCHAR  (operativo; no es PK)

├── tipo_origen_id       FK → CAT_TIPO_ORIGEN

├── folio_ceri           VARCHAR  (cuando el origen es despacho/llamada CERI)

├── id_ubicacion         FK → UBICACION

├── fecha_evento         DATE

├── hora_evento          TIME

├── motivo               VARCHAR / FK → CAT_MOTIVOS

├── narrativa            TEXT     (narrativa general del evento; reutilizable por los formularios)

├── estado              ENUM(borrador_sin_origen, abierto, en_proceso, cerrado, reabierto, anulado)

├── fecha_registro       TIMESTAMPTZ DEFAULT now()

├── id_usuario_registro  FK → USUARIO

├── id_usuario_cierre    FK → USUARIO (plataforma)

└── id_usuario_reapertura FK → USUARIO (jurídica)

**Narrativa:** vive a nivel evento y puede ser utilizada por cualquier formulario. **Solo cuando un evento tiene más de un IPH**, cada IPH puede llevar su propia narrativa adicional (atributo narrativa en IPH).

### 7.3 Origen del evento y ubicación

CAT_TIPO_ORIGEN   (catálogo configurable)

  · llamada de emergencia / despacho CERI

  · recorrido

  · patrullaje

  · operativo (propio / conjunto)

  · diligencia de acompañamiento

**Distinción de términos:** *"**llamada de emergencia**"* es la situación **previa** al despacho CERI (un tipo de origen). *"**Atención a emergencia**"* es una **entidad de resultado** (sección 7.8), usada cuando el evento no deriva en detención ni aseguramiento. No deben confundirse.

UBICACION

├── id_ubicacion     UUID, PK

├── calle            VARCHAR

├── cruce_1          VARCHAR

├── cruce_2          VARCHAR

├── id_colonia       FK → CAT_COLONIAS      (el catálogo PREVALECE sobre la georreferencia)

├── id_distrito      FK → CAT_DISTRITOS     (autollenado por point-in-polygon)

├── id_cuadrante     FK → CAT_CUADRANTES    (autollenado por point-in-polygon)

├── id_sector        FK → CAT_SECTORES      (autollenado por point-in-polygon)

├── latitud          DECIMAL(10,8)

├── longitud         DECIMAL(11,8)

├── geom             GEOMETRY(Point, 4326)  ← PostGIS

└── croquis_path     VARCHAR  (imagen estática del croquis, generada del punto)

**Georreferenciación.** Al registrar el evento se usan los catálogos de calles y colonias y una conexión a la **API de Google** para obtener el punto, con **validación del punto por el usuario**. A partir del punto se autollenan **Distrito, Cuadrante y Sector** mediante point-in-polygon contra las capas geográficas (que la SSPM ya tiene resueltas). **El catálogo siempre prevalece sobre la georreferencia** en caso de discrepancia. El sistema **siempre permite editar manualmente** los datos asociados a la API de Google (cubre también la operación sin conectividad). El **croquis es estático**: se genera a partir de la coordenada y se almacena como imagen del lugar.

### 7.4 Personas: maestra + participación + roles

PERSONA  (maestra; se asume riesgo de duplicación para no-detenidos)

├── persona_id       UUID, PK

├── nombre, primer_apellido, segundo_apellido

├── fecha_nacimiento, sexo

├── curp             VARCHAR(18)  (nullable)

├── domicilio, nacionalidad, documento_id …

PARTICIPACION_PERSONA  (rol de una persona en un evento — N roles posibles)

├── id_participacion  UUID, PK

├── evento_id         FK → EVENTO

├── persona_id        FK → PERSONA

├── rol               ENUM(victima, quejoso, denunciante, resguardada)

└── (atributos comunes del rol: edad_al_momento_evento, etc.)

Una misma persona puede tener **varios roles en un mismo evento** (p. ej. quejoso y víctima) y roles distintos en eventos distintos. Por eso el rol vive en PARTICIPACION_PERSONA, no como atributo de PERSONA. Los atributos específicos por rol se modelan en extensiones (PART_VICTIMA, PART_QUEJOSO, PART_RESGUARDO_PERSONA) ligadas a la participación.

**El detenido NO es un rol de persona** (sección 7.6): es una entidad propia con trascendencia distinta, controlada en SIPROB.

### 7.5 Agente involucrado (con snapshot)

AGENTE_INVOLUCRADO   (participación de un agente en un evento)

├── id_agente_involucrado  UUID, PK

├── evento_id              FK → EVENTO

├── id_agente_mongo        VARCHAR  (referencia al catálogo en MongoDB)

│   ── snapshot al momento del evento ──

├── numero_empleado_snap   VARCHAR

├── nombre_snap            VARCHAR

├── distrito_snap          VARCHAR

├── area_snap              VARCHAR

├── subarea_snap           VARCHAR

├── puesto_snap            VARCHAR

└── unidad_snap            VARCHAR

AGENTE_INVOLUCRADO_ROL   (un agente puede tener VARIOS roles en el evento)

├── id_agente_involucrado  FK → AGENTE_INVOLUCRADO

└── id_rol                 FK → CAT_ROLES_AGENTE   (catálogo configurable propio)

El **catálogo maestro de agentes vive en MongoDB** (plataforma de gestión digital, etapa 1) y se consulta en vivo. Al registrar el evento, PIMSy **persiste un snapshot** de los campos del agente para preservar la integridad histórica. El **rol en el evento** es un catálogo propio configurable y un mismo agente involucrado puede tener **varios roles**.

### 7.6 Detención, detenido y detalles legales

DETENCION   (proceso; agrupa a todos los detenidos del evento y sus consecuencias)

├── detencion_id     UUID, PK

├── evento_id        FK → EVENTO

├── fecha_detencion  TIMESTAMPTZ

└── …

DETENIDO   (entidad propia; control individual en SIPROB)

├── detenido_id      UUID, PK

├── detencion_id     FK → DETENCION

├── id_siprob        VARCHAR   ← referencia al detenido en SIPROB (CURP + huella)

├── iph_id           FK → IPH  ← un detenido pertenece a EXACTAMENTE UN IPH

└── (datos históricos del rol, no toda la persona)

DELITO              FALTA_ADMINISTRATIVA       ORDEN_APREHENSION

├── …_id  PK         ├── …_id  PK               ├── …_id  PK

├── detenido_id FK   ├── detenido_id FK         ├── detenido_id FK

├── nombre_delito    ├── clasificacion          ├── mandamiento_judicial

├── clasificacion    ├── fraccion               ├── autoridad_emisora

├── fuero            ├── descripcion            ├── delito_orden

├── hubo_violencia   └── …                      └── vigente

**Detención (proceso) ≠ Detenido (persona).** La detención agrupa a *todos* sus detenidos; **delito, falta y orden de aprehensión cuelgan de cada detenido** (no de la detención en bloque). La detención es la suma de todas esas asociaciones.

**El detenido y sus detalles legales se capturan en el nuevo modelo** (no en SIPROB/SID); SIPROB solo provee la identidad del detenido por referencia.

### 7.7 IPH (Informe Policial Homologado) y enrutamiento

IPH

├── iph_id              UUID, PK

├── evento_id           FK → EVENTO

├── tipo                ENUM(delito, falta_administrativa)

├── fuero               ENUM(federal, comun_estatal, justicia_civica_local)

├── id_autoridad_destino FK → CAT_AUTORIDADES   (MP Federal, MP Estatal, Justicia Cívica)

├── folio               VARCHAR

├── estatus             ENUM(borrador, firmado, enviado)

└── narrativa           TEXT  (solo cuando el evento tiene más de un IPH)

**Reglas de enrutamiento (las define el área jurídica):**

- Un **evento puede tener varios IPH**: por delito y por falta, e incluso varios por delito (uno por fuero/autoridad).

- Un **IPH puede tener varios detenidos**; pero un **detenido pertenece a un solo IPH** (jurídico decide a qué autoridad lo destina).

- **Ejemplo:** tres detenidos —uno por delito federal, uno por delito del fuero común y uno por falta administrativa— producen: un IPH delito → MP Federal, un IPH delito → MP Estatal, y un IPH falta → Justicia Cívica local.

- Un **aseguramiento sin detenido genera su propio IPH**, dirigido a la autoridad que el área jurídica defina para la entrega del aseguramiento.

### 7.8 Aseguramiento, resguardo, emergencia y entrega de hechos

ASEGURAMIENTO                         RESGUARDO

├── aseguramiento_id  PK              ├── resguardo_id  PK

├── evento_id         FK → EVENTO     ├── evento_id     FK → EVENTO

├── iph_id            FK → IPH        ├── tipo          ENUM(persona, vehiculo, objeto)

├── tipo_aseguramiento               ├── motivo, fecha_inicio, fecha_fin

└── descripcion                       └── …

**Bienes (entidades propias):**

VEHICULO          OBJETO                ARMA                       SUSTANCIA

├── vehiculo_id    ├── objeto_id          ├── arma_id                ├── sustancia_id

├── aseguramiento_id│ ├── aseguramiento_id │ ├── aseguramiento_id      ├── aseguramiento_id

│   o resguardo_id │ │   o resguardo_id   │ │  (SIEMPRE aseguram.)    │  (SIEMPRE aseguram.)

├── marca, modelo  ├── tipo_objeto        ├── subtipo ENUM(corta,    ├── tipo_sustancia

├── placas, color  │   ENUM(dinero, otro) │   larga, blanca)          ├── cantidad_gramos

├── num_serie      ├── descripcion        ├── calibre (NULL si blanca)├── cantidad_kg

└── …              ├── cantidad           ├── nombre_arma            └── …

                   └── (dinero = objeto   └── …

                       especial, trato propio)

**Reglas de pertenencia de bienes:**

- **Armas y sustancias** siempre pertenecen a un **aseguramiento**.

- **Vehículos y objetos** pueden pertenecer a un **aseguramiento o a un resguardo** (p. ej. recuperación de vehículo robado sin relación con delito → resguardo).

- **Dinero** es un **objeto especial** con tratamiento propio (subtipo de objeto).

EMERGENCIA   (atención a emergencia: evento SIN detención ni aseguramiento)

├── emergencia_id   PK

├── evento_id       FK → EVENTO

├── clasificacion_id, tipo_emergencia_id, subtipo

└── descripcion

ENTREGA_HECHOS   (entidad propia; obliga parte informativa)

├── entrega_id      PK

├── evento_id       FK → EVENTO

├── id_autoridad    FK → CAT_AUTORIDADES

├── fecha_hora

└── descripcion

### 7.9 Uso de la fuerza (M:N)

USO_FUERZA

├── uso_fuerza_id   PK

├── evento_id       FK → EVENTO

├── id_nivel_fuerza FK → CAT_NIVELES_FUERZA

└── descripcion

USO_FUERZA_AGENTE          USO_FUERZA_DETENIDO

├── uso_fuerza_id  FK       ├── uso_fuerza_id  FK

└── id_agente_involucrado FK└── detenido_id    FK

El uso de la fuerza tiene relación **muchos a muchos** tanto con agente_involucrado (quién la ejerció) como con detenido (sobre quién). Solo se registra si se declaró que hubo uso de la fuerza.

### 7.10 Parte informativa

PARTE_INFORMATIVA

├── parte_informativa_id  PK

├── evento_id             FK → EVENTO

├── iph_id                FK → IPH (nullable)

├── folio, tipo, estatus

├── numero_elemento, elemento

└── (puede aprovechar la narrativa del evento)

### 7.11 Catálogos principales (administrables por la SSPM, homologados a la informática nacional)

CAT_TIPO_ORIGEN, CAT_MOTIVOS, CAT_COLONIAS, CAT_DISTRITOS, CAT_CUADRANTES, CAT_SECTORES (con geometría PostGIS), CAT_AUTORIDADES, CAT_ROLES_AGENTE, CAT_TIPOS_DETENCION, CAT_NIVELES_FUERZA, catálogos de delitos/faltas, y catálogos de bienes (tipo_objeto, tipo_vehículo, marca, color, calibre, tipo_arma, tipo_sustancia, unidad_medida).

### 7.12 Derivación lógica de atributos entre formularios

Distintos formularios piden el **mismo hecho con representaciones distintas**. PIMSy captura el dato una sola vez y **deriva por lógica de negocio** los valores equivalentes que cada formulario necesita, en lugar de pedir al usuario que los recapture.

**Ejemplo (nacionalidad):** al capturar nacionalidad = "mexicano", el sistema deriva automáticamente:

| **Atributo derivado** | **Valor** | **Formulario que lo consume** |
| --- | --- | --- |
| extranjero | false | IPH (pide tipo de nacionalidad) |
| pais_origen | "México" | Parte informativa (pide país de origen) |

Así, una sola selección alimenta a varios formularios con el formato que cada uno requiere. El mismo patrón aplica a otros pares de campos equivalentes que se identifiquen entre IPH, parte informativa y demás formatos.

**Implementación:** estas reglas de derivación (tablas de mapeo y lógica condicional) **se trabajarán en la etapa de desarrollo**. En el modelo de datos se almacena el dato base canónico; los valores derivados se resuelven en la capa de negocio (Laravel) al generar cada formulario, manteniéndose consistentes con el dato base.

## 8. Diagrama entidad-relación (resumen)

erDiagram

    EVENTO }o--|| CAT_TIPO_ORIGEN : nace_de

    EVENTO ||--|| UBICACION : se_ubica_en

    EVENTO ||--o{ IPH : genera

    EVENTO ||--o{ PARTE_INFORMATIVA : genera

    EVENTO ||--o{ DETENCION : tiene

    EVENTO ||--o{ ASEGURAMIENTO : tiene

    EVENTO ||--o{ RESGUARDO : tiene

    EVENTO ||--o{ EMERGENCIA : tiene

    EVENTO ||--o{ ENTREGA_HECHOS : tiene

    EVENTO ||--o{ USO_FUERZA : tiene

    EVENTO ||--o{ PARTICIPACION_PERSONA : involucra

    EVENTO ||--o{ AGENTE_INVOLUCRADO : involucra

    PERSONA ||--o{ PARTICIPACION_PERSONA : juega_rol

    DETENCION ||--o{ DETENIDO : agrupa

    DETENIDO }o--|| IPH : se_enruta_a

    DETENIDO ||--o{ DELITO : tiene

    DETENIDO ||--o{ FALTA_ADMINISTRATIVA : tiene

    DETENIDO ||--o{ ORDEN_APREHENSION : tiene

    DETENIDO }o--|| SIPROB_REF : identificado_en

    ASEGURAMIENTO }o--|| IPH : se_enruta_a

    ASEGURAMIENTO ||--o{ ARMA : contiene

    ASEGURAMIENTO ||--o{ SUSTANCIA : contiene

    ASEGURAMIENTO ||--o{ VEHICULO : contiene

    ASEGURAMIENTO ||--o{ OBJETO : contiene

    RESGUARDO ||--o{ VEHICULO : contiene

    RESGUARDO ||--o{ OBJETO : contiene

    AGENTE_INVOLUCRADO ||--o{ AGENTE_INVOLUCRADO_ROL : desempeña

    USO_FUERZA }o--o{ AGENTE_INVOLUCRADO : ejercida_por

    USO_FUERZA }o--o{ DETENIDO : aplicada_a

## 9. Integraciones

| **Sistema** | **Dirección** | **Mecanismo** | **Notas** |
| --- | --- | --- | --- |
| **SIPROB** | Lectura | **Esquema / vistas** sobre PostgreSQL | Fuente del detenido. PIMSy referencia id_siprob; debe poder sostener el enlace al evento_id. |
| **MongoDB (agentes)** | Lectura viva + snapshot | Driver MongoDB | Catálogo de agentes de la plataforma de gestión digital; PIMSy congela snapshot al registrar el evento. |
| **API de Google** | Lectura | REST | Georreferenciación con validación del usuario; siempre editable manualmente. |
| **SID / IPH-Partes-UsoFuerza MongoDB** | — | — | **Legacy**; reemplazados por formularios de PIMSy. |
| **Plataforma de dashboard/mapas** | Salida | API REST / GeoJSON | Explotación geoestadística en tiempo real. |

## 10. Arquitectura técnica

| **Capa** | **Tecnología** | **Justificación** |
| --- | --- | --- |
| Base de datos | **PostgreSQL + PostGIS** | Relacional madura, geometrías nativas para point-in-polygon y mapas, compatible con SIPROB. |
| Backend | **Laravel (PHP)** | Framework del nuevo desarrollo; organiza servicios por dominio: eventos, formularios, personas, integración, reportes. Eloquent/migrations sobre PostgreSQL. |
| Frontend | SPA con formularios dinámicos | Habilita cada formulario según la derivación del evento. |
| Dashboard / mapas | Metabase / PowerBI sobre vistas | Explotación sin desarrollo adicional. |
| Despliegue | **On-premise en servidores de la SSPM** | Apartados con acceso desde internet donde se requiera. |

**Transversales:**

- **RBAC** con roles alineados a las áreas (operador, barandilla, jurídica, plataforma, analista, administrador), incluyendo permisos diferenciados para **cerrar** (plataforma) y **reabrir** (jurídica) eventos.

- **Auditoría inmutable** por triggers en cada escritura (tabla afectada, operación, valores anterior/nuevo, usuario, timestamp), incluyendo las **fusiones de eventos**.

- **Integridad referencial** en base de datos y validación de **reglas de completitud** (sección 6.3) en la capa de servicio antes de permitir el cierre.

- evento_id UUID inmutable; folios como referencias mutables.

## 11. Pendientes para fases posteriores

| **Tema** | **Descripción** |
| --- | --- |
| Atributos finos por entidad | Cerrar la lista exacta de columnas de cada formulario a partir de los catálogos vigentes. |
| Reglas de derivación de atributos | Implementar en Laravel la lógica que deriva valores equivalentes entre formularios (sección 7.12); definir las tablas de mapeo campo a campo. |
| Evidencias y adjuntos | Fotos, PDFs y documentos probatorios (el croquis estático ya entra en v1). |
| Protección de datos personales | Clasificación, retención y resguardo de datos de detenidos, víctimas y menores — a resolver en fase de desarrollo. |
| Modelo de permisos detallado | Qué rol crea/edita/cierra cada tipo de formulario. |
| Estrategia de migración | Plan de migración selectiva desde los sistemas legacy. |
| Estadística y mapas | Diseño de vistas materializadas y tableros (derivados del modelo). |
| Pruebas de carga | Validar rendimiento a escala con datos sintéticos. |

*PIMSy v1.0 · Especificación técnica · Junio 2026 · SSPM Ciudad Juárez*