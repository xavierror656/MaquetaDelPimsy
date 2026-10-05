Planteamiento del problema:

Actualmente la información de la Secretaría de Seguridad Pública de Ciudad Juárez (SSPM) se encuentra diseminada en diversos sistemas poco interconectados y carentes de consistencia en cuanto a entidades y relaciones entre las entidades.

La SSPM requiere de un sistema integrador que le permita contar con estadística e información confiable y consistente entre sus diversos sistemas.

El flujo con el que actualmente opera la SSPM es el siguiente:

- El Centro de Emergencias y Respuesta Inmediata (CERI) recibe llamadas de emergencia y genera los despachos a los diversos agrupamientos con que cuenta la SSPM esto se registra en su propio sistema al cual no tenemos acceso, esto deriva en múltiples tipos de actuación:

- Si del despacho se deriva una detención el flujo es el siguiente:

- Los policías atienden la situación e inician el registro de un IPH Delitos, el cual es otro sistema en el que se hace el registro si el detenido es por causa de un probable delito o en IPH Faltas Administrativas, el cual funciona para el caso de que la detención sea por una falta administrativa.

- Los policías trasladan al detenido a una barandilla especializada, ya sea en faltas administrativas o en delitos, donde se hace el registro del detenido en un sistema denominado SIPROB, este sistema es compartido por los dos tipos de barandilla, así mismo la información también se adiciona al sistema SID (Sistema Integral de Detenciones) en una doble captura. A partir de los datos que se registran en SID y SIPROB, el área jurídica en conjunto con el policía concluyen el llenado del IPH ya sea para delitos o para faltas. 

- Una vez procesado el detenido ya sea para continuar en barandilla su proceso de justicia cívica (faltas administrativas) o puesto a disposición del ministerio público (delitos). El policía se retira a la coordinación de su agrupamiento para el llenado de información de su Parte Informativa (otro sistema)

- Si el despacho se deriva en un aseguramiento el flujo es semejante solo que puede darse con o sin detenido. En caso de que no cuente con detenido se hace el registro dual en SID y SIPROB, así mismo se genera el IPH Delitos para poner a disposición del Ministerio Público el aseguramiento.

- Si el despacho se orienta a una atención a emergencias sin que medie una detención o un aseguramiento, el policía puede realizar el resguardo de personas, vehículos u objetos y lleva a cabo el registro de su parte informativa.

- Si el despacho deriva en una atención menor, esto no se registra en ningún sistema.

- En caso de que los policías hayan tenido que llevar a cabo el uso de la fuerza hacen el llenado de un Informe de uso de la fuerza que es otro sistema.

- En caso de que los policías hayan realizado la atención primaria a una escena del crimen y se haya resuelto en sitio la entrega de la escena, se hace el registro de una entrega de hechos, en este caso hace solo el llenado de la parte informativa.

- En caso de que el despacho no lleve mayor trascendencia no se hace un registro de ninguno de los sistemas de interés.

- Existen eventos que no pasan por CERI sino que son en cierto modo derivados de otros casos como son las diligencias de acompañamiento de la fuerza pública a un evento, los recorridos, los patrullajes y los operativos propios o conjuntos, estos actualmente no se registran en algún sistema.

Contexto:

En la carpeta del proyecto podrás identificar dos archivos de excel en los que se han realizado intentos por hacer la separar las entidades y atributos, sin embargo se han orientado a los formularios (IPH Delitos, IPH Faltas Administrativas, Partes Informativas, Informe de uso de la fuerza).

Adicionalmente encontrarás un análisis que comencé con la IA pero que no se concluyó en formato markdown.

Los sistemas que he mencionado cuentan con las siguientes características:

SIPROB: desarrollado en Python con base de datos en PostgreSQL

SID: sistema desarrollado por el Gobierno Estatal, sin acceso a su arquitectura

IPH Delitos, IPH faltas administrativas, Informe de uso de la fuerza, Partes Informativas: desarrollados en laravel con base de datos en MongoDB

CAD CERI: sistema desarrollado por el Gobierno Estatal, sin acceso a su arquitectura

Objetivo:

Generar la documentación para el equipo de desarrollo que le permita establecer un modelo de entidad - relación en PostgreSQL y que de este modelo deriven todos los formularios con excepción de SIPROB, para evitar la doble captura y la inconsistencia de información, adicionalmente a este mismo modelo se conectará un dashboard y analitico de mapas que permitirá una mayor explotación de la información en tiempo real.

Riesgos del modelo:

- La información no cuenta con un flujo constante, ni un estándar de flujo como se puede observar en los planteamientos.

- No es posible conectar el sistema CAD CERI con el flujo ya que no es propiedad de la SSPM, aunque puede proponerse algún tipo de doble captura simplificado que genere el origen de la intervención policial.

- La información cuenta con cierta constante en el caso de detenciones o aseguramientos que son la mayoría de los casos, pero en caso de atención a emergencias o situaciones de resguardo de personas, esto cambia.

- Se observa que la entidad independiente dentro del modelo pudiera der el “Evento” en el cual se crea el registro que permite relacionar todas las otras entidades identificadas por el momento que corresponden a los datos identificados en los documentos de excel.

Hazme las preguntas que consideres pertinentes y todavía no quiero que generes ningún documento, solo que me ayudes a hacer los planteamientos necesarios para realizar una propuesta a la SSPM de este posible nuevo sistema.

Ya revisé los tres archivos: el borrador **PIMSy v0.1**, la **matriz/diccionario ER** (que está bastante más madura) y el análisis de Oscar y Roberto orientado a los formularios. Los dos modelos coinciden en lo esencial —**Evento como entidad raíz**— pero divergen en puntos que conviene resolver *antes* de proponer nada. Te dejo primero esas divergencias y luego las preguntas que considero necesarias para armar la propuesta a la SSPM.

### **Inconsistencias entre tus dos modelos que hay que cerrar**

- **Detenido vs. Detención.** La matriz separa detencion (proceso) → detenido (rol de la persona). El PIMSy doc cuelga DETENCION directo de id_persona sin rol intermedio. Son modelos distintos de normalización; hay que elegir uno.

- **Persona/rol.** La matriz modela roles explícitos (detenido, victima, agente_involucrado) con datos históricos del rol. El PIMSy doc lo resuelve con tablas por tipo y booleanos. ¿Cuál es el canónico?

- **Emergencia.** La matriz tiene entidad emergencia colgada del evento; el PIMSy doc no la modela como tal. ¿Entra o no?

- **Aseguramiento.** La matriz lo desglosa en objeto/vehiculo/arma/sustancia como tablas hijas; el PIMSy doc usa herencia de tablas. Misma idea, implementación distinta.

La detención corresponde a una perspectiva de proceso, el detenido corresponde a una entidad que llevará control individual posterior a través de SIPROB, se asocian pero son entidades distintas.

Es importante hacer una distinción entre la entidad detenido y el resto de las personas, veo como propuesta que existan atributos generales para las personas y uno de estos atributos sea el rol (víctima, persona resguardada, quejoso) de ahí derivarían atributos específicos por rol, de igual manera agente involucrado debe ser una entidad independiente de las personas ya que guarda trascendencia distinta.

La entidad emergencia ocurrirá cuando no se cuente con detenciones o aseguramientos y debe colgarse al evento.

Los objetos, armas, vehículos y sustancias son entidades individuales con sus propios atributos, en el caso de armas se subdividen en cortas, largas y blancas (las armas blancas no cuentan con calibre por ejemplo), en el caso de vehículos y objetos pueden ser parte de un aseguramiento o de un resguardo (en caso de que no tenga relación con el delito o que se trate de la recuperación de un vehículo robado).

### **Preguntas para encuadrar la propuesta**

**1. Propósito y audiencia de la propuesta**

¿La propuesta a la SSPM es un documento de visión/decisión (para que aprueben e inviertan en el sistema) o ya es la especificación técnica para el equipo de desarrollo? El nivel de detalle, lenguaje y secciones cambian por completo según esto. ¿Quién la firma/presenta y ante qué nivel (mando operativo, dirección de tecnología, secretario)?

**2. Origen del Evento sin acceso a CERI**

Dado que CAD/CERI no es de la SSPM, ¿la SSPM está dispuesta a capturar manualmente un "folio de origen CERI" + datos mínimos al inicio de cada evento? ¿O existe la posibilidad real de pedir al Gobierno Estatal una integración (API/exportación) del CAD? La viabilidad de todo el modelo "una sola captura" depende de cómo nace el Evento.

**3. Qué doble captura se elimina realmente**

El objetivo dice derivar todos los formularios *excepto SIPROB*, pero hoy la doble captura crítica es **SID ↔ SIPROB** (ambos del detenido), y SID es del Estado sin acceso. ¿El nuevo sistema (a) solo deja de duplicar entre los formularios propios —IPH, Partes, Uso de Fuerza—, o (b) aspira también a alimentar SID/SIPROB para que la barandilla no recapture? ¿Qué pasa con SIPROB: se mantiene como sistema aparte solo referenciado, o se busca integrarlo a futuro?

**4. Estrategia con los sistemas Laravel/MongoDB existentes**

Los IPH, Partes y Uso de Fuerza están en Laravel/Mongo. ¿El plan es **reconstruirlos** sobre el nuevo Postgres, o **conservarlos** y sincronizar? ¿Quién los desarrolló/mantiene —el mismo equipo (Karsam) o terceros— y hay libertad para modificarlos? Esto define si la propuesta es "sistema nuevo" o "capa integradora sobre lo existente".

**5. Unidad de conteo estadístico**

Para el dashboard y los mapas, ¿cuál es la unidad que la SSPM quiere contar y reportar oficialmente: el evento, la detención, el IPH, la persona detenida? Hoy, ¿cómo reportan sus cifras y a quién (SESNSP/CNI, cabildo, prensa)? Definir la unidad canónica evita que el integrador produzca cifras que no cuadren con lo que ya reportan.

**6. Identidad de personas sin CURP**

La deduplicación por CURP es frágil: muchos detenidos no la traen o dan datos falsos. ¿Qué identificadores alternos manejan hoy (huella, fotografía, registro previo en SIPROB) y qué política quieren para personas no identificadas o reincidentes?

**7. Alcance de eventos sin detención/aseguramiento**

El planteamiento menciona recorridos, patrullajes, operativos y diligencias de acompañamiento que hoy no se registran. ¿Quieren incluirlos en v1 (aunque sea ligero) o dejarlos fuera como en el borrador PIMSy? Y las "atenciones menores" que hoy no se registran, ¿deben empezar a registrarse?

**8. Restricciones regulatorias del IPH y catálogos**

El IPH es un formato **homologado a nivel nacional**; sus campos obligatorios no son negociables. ¿Tienen la especificación oficial vigente del IPH (delitos y faltas) a la que el modelo debe ajustarse? ¿Y quién es dueño de los catálogos canónicos (delitos, motivos, sectores/colonias) —los define la SSPM o deben alinearse a catálogos estatales/federales?

**9. Flujo de captura multietapa (máquina de estados)**

Un mismo evento lo tocan varias personas en momentos distintos: policía en sitio → barandilla → jurídico → coordinación. ¿Confirmamos que el Evento es un registro vivo, editable por varios roles a lo largo del tiempo, con estados (abierto → en proceso → cerrado)? ¿Quién tiene autoridad para cerrarlo?

**10. Protección de datos y restricciones del proyecto**

¿Hay requisitos de protección de datos personales (detenidos, víctimas, menores), retención y auditoría que deba contemplar la propuesta? Y en lo práctico: ¿hay plazo, presupuesto o infraestructura (on-premise vs. nube) ya definidos que acoten el alcance?

¿Quieres que abordemos estas en orden, o prefieres que priorice un subconjunto? Con tus respuestas a las primeras 4–5 ya podríamos definir el esqueleto correcto de la propuesta.

La detención corresponde a una perspectiva de proceso, el detenido corresponde a una entidad que llevará control individual posterior a través de SIPROB, se asocian pero son entidades distintas.

Es importante hacer una distinción entre la entidad detenido y el resto de las personas, veo como propuesta que existan atributos generales para las personas y uno de estos atributos sea el rol (víctima, persona resguardada, quejoso) de ahí derivarían atributos específicos por rol, de igual manera agente involucrado debe ser una entidad independiente de las personas ya que guarda trascendencia distinta.

La entidad emergencia ocurrirá cuando no se cuente con detenciones o aseguramientos y debe colgarse al evento.

Los objetos, armas, vehículos y sustancias son entidades individuales con sus propios atributos, en el caso de armas se subdividen en cortas, largas y blancas (las armas blancas no cuentan con calibre por ejemplo), en el caso de vehículos y objetos pueden ser parte de un aseguramiento o de un resguardo (en caso de que no tenga relación con el delito o que se trate de la recuperación de un vehículo robado).

- La propuesta es una especificación técnica para el equipo de desarrollo, sin embargo debe conservar en este momento un lenguaje entendible por todas las partes interesadas.

- La SSPM pudiera capturar un evento no se considera la opción de una API.

- Se busca dejar el SID como un sistema Legacy para conservar únicamente SIPROB, se busca eliminar cualquier doble captura entre los sistemas de MongoDB, de igual forma los sistemas actuales en MongoDB se dejarían como Legacy para adoptar nuevos formularios que simplifiquen la captura a cada parte desde su propio formulario, por ejemplo sin un detenido ya se capturó en SIPROB, no será necesario que en el IPH se capture información del detenido pues provendrá de SIPROB, sin en el IPH se establecieron los agentes involucrados, no será necesario que en parte informativa se registren los agentes involucrados, pues ya se registraron en IPH. Cada formulario aportará y aprovechará la información del modelo.

- El plan es reconstruirlos con la finalidad de reducir la cantidad de datos que se pide por formulario y que sea llenado por cada especialización. Quienes llenan SIPROB tiene la especialización en detenidos, quienes apoyan al policía con sus IPH tiene especialización en entidades asociadas al aseguramiento, quienes llenan Partes informativas tienen plena identificación de los elementos que participaron. Quienes están en CERI cuentan con plena identificación de la ubicación del evento.

- En este momento considera el conteo estadístico como un resultado del modelo, no debe guardar relevancia con su conformación.

- SIPROB resolverá el problema de deduplicación a través de CURP y huellas dactilares para las detenciones, sin embargo en caso el resto de las personas se puede adoptar el riesgo de deduplicación.

- Las atenciones menores no se registarán y en el caso de origen de los eventos por las otras causas, se pudieran registrar en una interfaz semejante a la que utilice CERI.

- Actualmente se cuenta con ambas situaciones, la idea es resolver en código la transformación de datos para el adecuado llenado de IPH, actualmente se cuenta con catálogos que administra la propia SSPM que se homologaron a la informática nacional.

- La autoridad para cerrarlo/reabrirlo es el área de plataforma y para reabrirlo es el área jurídica.

- Los requisitos de protección de datos personales deberán resolverse en la fase de desarrollo. Todos los sistemas deben operar en los propios servidores de la SSPM, aunque existen apartados con acceso desde internet, sobre el costo monetario o de tiempo, no se plantea en este momento.

Todavía no me entregues ningún documento, si tienes más preguntas o conclusiones que debamos validar a partir de mis respuestas, hazlas en este momento.

Gracias, con esto el modelo se aclara bastante. Déjame devolverte **conclusiones para que confirmes** y luego las **preguntas que aún quedan abiertas** y que sí cambian el diseño.

### **Conclusiones que quiero validar**

- **Tres familias de ****"****personas****"****, no una.** (a) persona maestra con un atributo rol (víctima, resguardada, quejoso/denunciante) y atributos específicos por rol; (b) detenido como entidad propia, cuyo control individual vive en SIPROB; (c) agente_involucrado como entidad independiente. Las tres se relacionan con el evento pero no se mezclan.

- **SIPROB es la fuente de verdad del detenido.** El nuevo modelo NO recaptura al detenido: lo referencia desde SIPROB (que ya resolvió CURP + huella). En el nuevo modelo vive la detención como *proceso* (con sus delitos, faltas, órdenes de aprehensión), asociada al detenido de SIPROB.

- **detención**** (proceso) ≠ ****detenido**** (persona).** De detención cuelgan delito, falta administrativa y orden de aprehensión.

- **emergencia**** cuelga del evento y aplica cuando NO hubo detención ni aseguramiento.**

- **Bienes como entidades propias**, reutilizables: objeto, vehiculo, arma (subtipos: corta, larga, blanca — sin calibre en blanca), sustancia. Un objeto o vehiculo puede pertenecer a un **aseguramiento** *o* a un **resguardo** (p. ej. recuperación de vehículo robado, sin relación con delito).

- **Cada formulario aporta y consume del modelo** ("llenar una vez"): si el detenido ya está en SIPROB, el IPH no lo recaptura; si los agentes ya están en el IPH, la parte informativa no los recaptura. SID y los sistemas MongoDB quedan como **legacy**; SIPROB se conserva.

- **El conteo estadístico es resultado del modelo**, no condiciona su forma. No lo optimizamos ahora.

- **La especificación es técnica pero con lenguaje entendible por todas las partes** (mando, jurídico, TI).

### **Preguntas abiertas (estas sí afectan el diseño)**

**A. Mecanismo de integración con SIPROB.** ¿El nuevo modelo y SIPROB comparten el mismo PostgreSQL (mismo servidor/clúster, accesible por esquema o vistas), o son bases separadas que se comunican por API/lectura? Y la dirección del cruce: ¿SIPROB guardará el evento_id del nuevo sistema, o el nuevo sistema guardará el id_detenido de SIPROB? Como SIPROB es el único que se conserva, necesito saber si **puede modificarse mínimamente** para sostener ese enlace.

**B. Nacimiento y secuencia del evento.** ¿El evento lo crea primero la SSPM en la interfaz tipo-CERI (ubicación, origen, motivo) y *después* se enganchan detención/SIPROB, IPH, etc.? Es decir, ¿el evento_id ya existe cuando barandilla captura al detenido en SIPROB, o el evento puede nacer desde cualquier formulario?

**C. Origen del evento: ¿atributo o entidad?** Mencionaste que recorridos, patrullajes, operativos y diligencias se registrarían en una interfaz semejante a CERI. ¿Modelamos un tipo_origen del evento (despacho CERI / recorrido / patrullaje / operativo / diligencia) con su folio CERI cuando aplique? ¿Y ese "origen" es distinto de la entidad emergencia, o se solapan?

**D. Persona con múltiples roles.** Si rol es atributo de persona, ¿qué pasa cuando una misma persona es víctima **y** quejosa en el mismo evento, o víctima en un evento y resguardada en otro? ¿Aceptamos que persona sea en realidad una *aparición por evento* (un registro por rol, con riesgo de duplicado asumido), o quieres una persona maestra única con varias *participaciones*? Esto define si el rol va en la persona o en una tabla puente.

**E. Resguardo como entidad.** ¿Confirmas resguardo como entidad colgada del evento (paralela a aseguramiento), que puede contener personas, objetos y vehículos? ¿Armas y sustancias van **solo** por aseguramiento, nunca por resguardo?

**F. Catálogo maestro de agentes.** El agente_involucrado por evento, ¿referencia a un padrón maestro de elementos? ¿De dónde sale ese padrón —de los elementos hoy en MongoDB— y conservamos el *snapshot* de adscripción (distrito/área) al momento del evento, por trascendencia histórica?

**G. IPH y reglas de derivación.** ¿iph es una sola entidad con tipo {delito, falta}? ¿Y qué reglas disparan cada formulario? Tentativamente: detención/aseguramiento → IPH (+ parte); emergencia, entrega de hechos, resguardo → solo parte informativa; uso de fuerza → cuando hubo. ¿Lo confirmas o ajusto?

**H. Uso de la fuerza.** ¿Cuelga del evento y se asocia al agente_involucrado que la ejerció (uno o varios agentes por evento)?

**I. Autoridad sobre el evento.** Para que quede sin ambigüedad: **cerrar** = área de plataforma; **reabrir** = área jurídica. ¿Correcto?

Con A, B, D y E principalmente, ya tendría firme el esqueleto entidad-relación. ¿Las revisamos?

**Respecto de la detención**** (proceso) ≠ ****detenido**** (persona).** De detención cuelgan delito, falta administrativa y orden de aprehensión; el delito, falta administrativa y orden de aprehensión se asocian a un detenido, la detención en su conjunto tendrá toda la asociación entre todos los detenidos y todas sus entidades asociadas como delito, falta administrativa u orden de aprehensión.

Respecto de los objetos, realiza una adición del dinero como objeto especial, guarda un tratamiento distinto del resto de los objetos, entonces pueden quedar: vehículos, sustancias, armas (cortas, largas, blancas) y objetos (dinero, otros objetos).

- El mecanismo de integración de SIPROB es accesible por esquema o vistas.

- El nacimiento del evento es el problema más complejo que debe resolverse y sobre el que me interesa entender alguna propuesta que tengas. Yo había pensado que debe existir el formulario que cree los eventos, si un IPH comienza a ser llenado sin Evento_ID,  él area de plataforma pudiera crear el evento y luego asociarlo, o solamente asociarlo a algún Evento_ID ya creado.

- Efectivamente me interesa ese modelado de origen del evento. En el caso de Emergencia se deben identificar dos términos “llamada de emergencia” que es una situación previa al despacho CERI y “atención a emergencia” que corresponde a los eventos que no llevan detención o aseguramiento.

- Una persona puede tener un rol en un evento y otro rol en otro evento distinto, incluso en el mismo evento pudiera ser quejoso y víctima.

- Confirmo resguardo como entidad colgada del evento.

- El catálogo de agentes provendrá de la colección de MongoDB que opera la plataforma de gestión digital en su etapa 1, aunque el sistema deberá registrar en su propia Base de datos a los agentes involucrados, las consultas se harán a MongoDB para atraer los datos del agente, con excepción del rol que desempeñó en el evento, el cual debe ser otro catálogo configurable.

- El IPH se llena antes de registrar los detenidos y aseguramientos no existe un disparador, sin embargo en caso de existencia de detenidos o aseguramientos el sistema debe esperar por lo menos un IPH asociado. En el caso de uso de la fuerza solo se llena si se declara que hubo uso de la fuerza. Todo evento que trascienda en detención, aseguramiento, atención a emergencia o resguardo deberá esperar una parte informativa.

- El uso de la fuerza guarda una relación de muchos a muchos con los detenidos y los agentes involucrados.

- Es correcta la apreciación sobre que el área jurídica reabre y plataforma puede cerrar el evento.

Perfecto, esto cierra casi todo el esqueleto. Te devuelvo las **conclusiones actualizadas**, una **propuesta concreta para el nacimiento del evento** (que pediste) y **nuevas preguntas**.

### **Conclusiones que valido**

- **Detención (proceso) agrupadora.** detención agrupa a *todos* sus detenido. Los delito, falta_administrativa y orden_aprehension no cuelgan de la detención en bloque, sino de **cada detenido**; la detención es la suma de todas esas asociaciones. (Detención 1:N detenido; detenido 1:N delito/falta/orden.)

- **Bienes reestructurados:** vehiculo, sustancia, arma (corta / larga / blanca — blanca sin calibre) y objeto, donde dinero es un **objeto especial con tratamiento propio** y "otros objetos" el resto.

- **SIPROB se integra por esquema/vistas** (lectura a nivel base de datos, no API).

- **Persona multi-rol:** una persona puede ser quejoso y víctima en el mismo evento, o tener roles distintos en eventos distintos. → El rol **no puede vivir como atributo de persona** (ver pregunta 2).

- **Agente involucrado:** se registra en la BD propia, pero sus datos se traen de MongoDB (plataforma de gestión, etapa 1); el rol_en_evento es catálogo configurable propio.

- **Reglas de completitud (no disparadores):** el IPH se llena *antes* de detenidos/aseguramientos; si hay detenidos o aseguramientos, el evento exige **≥1 IPH** asociado. Uso de la fuerza solo si se declara. Todo evento con detención, aseguramiento, atención a emergencia o resguardo exige **parte informativa**.

- **Uso de la fuerza:** M:N con detenido y con agente_involucrado.

- **Autoridad:** plataforma **cierra**; jurídica **reabre**. resguardo confirmado como entidad del evento.

### **Propuesta para el nacimiento del evento**

El evento_id (UUID interno, inmutable) es la columna vertebral; todo cuelga de él. Como la captura es multiorigen y multietapa, propongo **dos rutas de creación con una bandeja de conciliación**, que cubre las dos opciones que ya intuías:

**Ruta A — Origen primero (normal).** La interfaz tipo-CERI ("Registro de Origen") crea el evento con tipo_origen, folio CERI, ubicación y motivo. Los demás formularios solo *seleccionan* un evento existente.

**Ruta B — Formulario primero (contingencia).** Si alguien empieza un IPH/parte/detención sin evento_id, el sistema crea automáticamente un **evento provisional** (estado = borrador_sin_origen) para que el formulario tenga raíz de inmediato y lo asocia.

**Conciliación (área de plataforma).** Plataforma trabaja una bandeja de eventos provisionales y, por cada uno, decide entre:

- **Completar** el origen y promoverlo a abierto; o

- **Fusionarlo** con el evento real al que pertenece (identificado por folio CERI, hora+ubicación o agentes): se reasigna el evento_id de todos los registros hijos al evento canónico y el provisional se anula. Operación auditada.

**Salvaguardas:** el evento_id nunca cambia (los folios sí son referencias mutables); un formulario puede guardarse en borrador contra un evento provisional, pero **no puede cerrarse** hasta que el evento tenga origen completo; al registrar un nuevo origen, el sistema alerta si coincide con uno existente (folio CERI único + heurística de proximidad) para evitar eventos duplicados.

**Máquina de estados:** borrador_sin_origen → abierto → en_proceso → cerrado (plataforma) → reabierto (jurídica), con anulado para fusiones/errores.

¿Te late este enfoque de dos rutas + conciliación, o prefieres forzar siempre la Ruta A (evento creado antes que cualquier formulario)?

### **Preguntas nuevas**

- **Ubicación de delito/falta/orden.** Como el detenido vive en SIPROB, ¿estos detalles legales se **capturan en el nuevo modelo** (contenido del IPH delitos/faltas) ligados a la *referencia* SIPROB del detenido, o ya existen en SIPROB/SID y solo se leen?

- **Persona maestra + participación.** Dado el multi-rol, propongo: persona maestra (dedup con riesgo asumido) + participacion (evento_id, persona_id, rol) + tablas de atributos específicos por rol (víctima, quejoso, resguardada). ¿Lo confirmas?

- **Agente: ¿snapshot o consulta viva?** ¿Persistimos un *snapshot* de la adscripción (distrito/área) al momento del evento por integridad histórica/legal, o siempre se consulta el dato vigente en MongoDB (que puede cambiar después del evento)?

- **IPH.** ¿Una sola entidad iph con tipo {delito, falta}? Y la detención/aseguramiento, ¿referencian **un** iph_id, o un mismo bloque puede repartirse en varios IPH?

- **Origen vs emergencia.** ¿Confirmas modelar tipo_origen (llamada de emergencia/despacho CERI, recorrido, patrullaje, operativo, diligencia) con folio CERI cuando aplique, y dejar **"****atención a emergencia****"**** como entidad de resultado** distinta del origen?

- **Bienes por aseguramiento vs resguardo.** ¿arma, sustancia y dinero van **solo** por aseguramiento, mientras objeto (otros) y vehiculo pueden ir por aseguramiento *o* resguardo?

- **Entrega de hechos.** ¿Es entidad propia colgada del evento, o un subtipo de "atención a emergencia" que solo deriva en parte informativa?

- **Evidencias/adjuntos** (fotos, PDFs, croquis): ¿entran en el alcance v1 del modelo o se posponen?

Con tus respuestas a la propuesta de nacimiento del evento y a las preguntas 1, 2 y 5, ya tendría el modelo entidad-relación firme para empezar a redactar la propuesta.

………..

Todas las conclusiones se validan

Está excelente la propuesta para el nacimiento del evento_ID

- El delito / falta / orden de aprehensión se deben capturar en el nuevo modelo y no en SIPROB.

- Confirmo la propuesta de persona maestra, sin embargo siempre debe poderse identificar el rol o roles que llevó dentro de cada evento.

- El agente como consulta viva solo reside en MongoDB, en el caso del registro de un evento los datos se guardan en la BD del evento como snapshot.

- En un evento pueden residir varios IPH, por delito o por falta, varios por delito y varios por falta. Si se cuentan con tres detenidos, uno por delito del fuero federal, uno por delito del fuero comun y uno por falta administrativa, se llenará un IPH delito dirigido al Ministerio Público Federal, un IPH delito dirigido al Ministerio Público Estatal y un IPH falta administrativa para procesamiento por justicia cívica local.

- Se confirma

- Armas y sustancias siempre son aseguramiento; vehículos y objetos pueden ser por aseguramiento o resguardo. 

- Entrega de hechos es una entidad propia colgada al evento que conlleva el llenado de parte informativa.

- Aunque las evidencias y adjuntos quedan para otra etapa, considera que el modelo deberá generar el croquis del lugar a partir de la recepción de la coordenada. Para el registro del evento se contará con catálogos de calles y colonias, así como una conexión a API de Google para la obtención de la georreferenciación del evento con validación por el usuario del punto georreferenciado. A partir del punto georreferenciado se autollenarán los datos de Distrito, Cuadrante y Sector. La narrativa será un atributo colgado al evento, sin embargo en el caso de varios IPH cada uno podrá contar con su narrativa.

No me entregues ningún documento aun, haz la validación de conclusiones y genera las nuevas preguntas que tengas para optimizar la propuesta.

……

### **Conclusiones que valido**

- **Delito / falta / orden de aprehensión se capturan en el nuevo modelo**, ligados a la referencia SIPROB del detenido (no en SIPROB/SID).

- **Persona maestra** confirmada, con identificación de **el o los roles por evento** vía tabla de participación (una persona puede tener varios roles en un mismo evento).

- **Agente:** dato vivo en MongoDB; al registrar el evento se persiste **snapshot** en la BD del evento. El rol_en_evento es catálogo propio configurable.

- **IPH múltiple por evento**, segmentado por **tipo {delito, falta}** y **fuero/autoridad destino** (MP Federal, MP Estatal, Justicia Cívica local). Cada detenido se enruta al IPH que corresponde a la naturaleza y fuero de su delito/falta.

- **Entrega de hechos:** entidad propia del evento que obliga parte informativa.

- **Bienes:** armas y sustancias **siempre** aseguramiento; vehículos y objetos (incluido dinero) pueden ir por **aseguramiento o resguardo**.

- **Origen vs. emergencia:** tipo_origen (con folio CERI cuando aplique) separado de **"****atención a emergencia****"** como entidad de resultado.

- **Geo y narrativa:** captura con catálogos de calles/colonias + API de Google para georreferenciar, con **validación del punto por el usuario**; del punto se autollenan **Distrito, Cuadrante y Sector**; el modelo **genera el croquis** a partir de la coordenada. **Narrativa** a nivel evento, y **una narrativa adicional por cada IPH**.

### **Preguntas para optimizar la propuesta**

**1. Enrutamiento detenido → IPH → delito (lo más fino del modelo).** Confirmo que cada delito/falta/orden lleva **dos referencias**: el detenido al que pertenece y el iph_id que lo enruta a su autoridad. Pregunta: ¿un mismo detenido puede aparecer en **más de un IPH** simultáneamente (p. ej. un detenido con un delito federal *y* uno del fuero común → dos IPH delito), repartiendo sus delitos según fuero?

**2. Aseguramiento → IPH.** ¿El aseguramiento también se asocia a un iph_id (por fuero/autoridad), igual que el detenido? ¿Un aseguramiento sin detenido genera su propio IPH delito dirigido al MP?

**3. Capas geográficas para el autollenado.** Para derivar Distrito/Cuadrante/Sector del punto se necesita point-in-polygon. ¿La SSPM ya cuenta con las **capas/polígonos** (shapefiles o GeoJSON) de distrito, cuadrante y sector, o hay que construirlas? Y la **colonia**: ¿se deriva también del punto o se elige del catálogo? Si el punto de Google y la colonia capturada no coinciden, ¿qué prevalece?

**4. Croquis: ¿almacenado o en vivo?** ¿El croquis es una **imagen estática** generada y guardada al cierre (snapshot del mapa, queda como evidencia inmutable), o se **renderiza on-demand** desde la coordenada cada vez que se consulta el evento?

**5. Dependencia de Google y operación on-premise.** Si al registrar **no hay conectividad** a la API de Google, ¿qué hacemos: captura manual de la coordenada / solo calle-colonia como respaldo? ¿Hay alguna restricción para enviar ubicaciones a un servicio externo (datos sensibles)?

**6. Narrativa en otros formularios.** ¿La narrativa adicional es exclusiva de evento e IPH, o la **parte informativa** (relato del policía) y/o entrega de hechos también llevan narrativa propia?

**7. Agente involucrado.** ¿Qué campos exactos snapshotear (número de empleado, nombre, distrito, área, subárea, puesto, unidad)? ¿Y un mismo agente puede tener **varios roles** en un mismo evento (p. ej. primer respondiente + aprehensor)?

**8. Relaciones entre eventos.** ¿Se requiere vincular eventos entre sí —un **operativo** que agrupa varios eventos, o una **diligencia/acompañamiento** derivada de un caso previo— o cada evento es totalmente independiente?

Con tus respuestas a 1, 2 y 3 cierro el modelo entidad-relación completo y quedaría listo para redactar la especificación.

……

Sobre la conclusión 4, cada uno de los IPH puede tener múltiples detenidos; las demás conclusiones se validan.

- Un mismo detenido no puede aparecer en dos IPH, el área jurídica determinará a qué autoridad destina al detenido y por tanto a quién dirige el IPH.

- Un aseguramiento sin detenido genera su propio IPH dependiente de a qué autoridad se entregará el aseguramiento, esto lo deberá definir el área jurídica.

- La SSPM ya tiene resuelto el tema de capas y puntos. Siempre prevalece el catálogo por sobre la georreferencia.

- El croquis es estático.

- El sistema debe permitir siempre la edición de datos asociados con la API de Google.

- La narrativa se cuelga del evento y puede ser utilizada por cualquiera de los otros formularios, solo se agregará una segunda narrativa en caso de que un evento tenga más de 1 IPH.

- Los campos para motivo de la propuesta son número de empleado, nombre, distrito, área, subárea, puesto, unidad, los roles dentro del Evento pueden ser varios para un mismo agente involucrado.

- Cada evento es totalmente independiente, las áreas enfocadas en investigación e inteligencia deberán realizar sus análisis para hacer la vinculación, pero esto sale del alcance de la propuesta.

¿Queda algún punto nuevo por validar o aclarar? en caso negativo genera la propuesta en markdown.