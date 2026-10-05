# Especificación funcional (spec-driven)

Formato: cada requisito tiene ID, estado (`DECIDIDO / PROPUESTO / POR VALIDAR`) y criterios de aceptación
Dado/Cuando/Entonces. El modelo de datos de referencia es `03-modelo-datos/PIMSy_DB.dbml`.

## A. Evento y ciclo de vida
**REQ-EVT-01 · Crear evento (Ruta A, origen primero)** — DECIDIDO
- Dado un usuario autorizado, cuando registra origen con tipo de origen, fecha y ubicación, entonces se crea un evento con `evento_id` UUID y estado `abierto`.
- Si el origen es llamada o despacho CERI, `folio_ceri` es único; un duplicado se rechaza.
- Los demás formularios solo seleccionan un evento existente.

**REQ-EVT-02 · Crear evento (Ruta B, formulario primero)** — DECIDIDO
- Dado que un formulario (IPH, parte, detención) se inicia sin `evento_id`, entonces el sistema crea un evento provisional en estado `borrador_sin_origen` y lo asocia.
- Un formulario puede guardarse en borrador contra un provisional, pero no puede cerrarse hasta que el evento tenga origen completo.
- Quién puede levantarlo: POR VALIDAR (Q-01, Q-02).

**REQ-EVT-03 · Registro mínimo** — PROPUESTO
- Un evento se crea solo con los campos mínimos (origen, fecha/hora, área creadora). Ubicación, motivo y el resto se pueden completar después por cualquier área autorizada.

**REQ-EVT-04 · Máquina de estados** — DECIDIDO
- Transiciones: `borrador_sin_origen → abierto → en_proceso → cerrado → reabierto`; `anulado` por fusión o error.
- Cada transición registra usuario y momento.

**REQ-EVT-05 · Control de concurrencia** — PROPUESTO
- Dado que dos áreas editan el mismo evento, cuando la segunda guarda con una `version` obsoleta, entonces se rechaza y se pide recargar (bloqueo optimista).

**REQ-EVT-06 · Alerta de duplicado** — DECIDIDO
- Al registrar un origen nuevo, el sistema alerta si coincide con uno existente por folio CERI único o por proximidad espacio-temporal (umbrales: POR VALIDAR).

## B. Aportaciones y estado por pieza
**REQ-APO-01 · Aportación trazable** — PROPUESTO
- Toda tabla hija del evento guarda `aportado_por`, `area_aporta_id`, `aportado_en`.

**REQ-APO-02 · Estado por componente** — PROPUESTO
- Cada evento tiene un registro por componente (detención, aseguramiento, resguardo, atención a emergencia, entrega de hechos, atención a víctimas, uso de la fuerza, parte informativa, IPH) con estado `pendiente | registrado | sin_novedad`.
- Dado un componente en `sin_novedad`, entonces no exige registros hijos. Dado uno en `registrado`, exige al menos un registro hijo.

**REQ-APO-03 · Indicadores derivados** — PROPUESTO
- `v_evento_indicadores` calcula `tiene_detenciones, tiene_aseguramientos, tiene_entrega_hechos, tiene_atencion_victimas, tiene_quejoso_denunciante, tiene_resguardo_personas, tiene_resguardo_objetos, tiene_ordenes_aprehension, tiene_atencion_emergencia, tiene_uso_fuerza, componentes_pendientes` por existencia de registros. Ninguno es columna capturada.

## C. Agentes
**REQ-AGE-01 · Agente con snapshot** — DECIDIDO
- Al agregar un agente a un evento, se guarda referencia a MongoDB y snapshot (número de empleado, nombre, distrito, área, subárea, puesto, unidad). Un cambio posterior en MongoDB no altera el snapshot.
- Un agente puede tener varios roles (catálogo propio). Único por (evento, agente).
- Agentes de otra institución: POR VALIDAR (Q-20).

## D. IPH y enrutamiento
**REQ-IPH-01 · IPH en borrador** — PROPUESTO
- Un IPH puede crearse con `tipo`, `fuero` y `autoridad_destino` nulos. Solo jurídico los asigna. No puede pasar a `firmado` si falta alguno.

**REQ-IPH-02 · Varios IPH por evento** — DECIDIDO
- Un evento puede tener varios IPH (por delito, por falta, por fuero/autoridad).

**REQ-IPH-03 · Detenido en un solo IPH** — DECIDIDO
- Un detenido pertenece a exactamente un IPH (al firmar). Ejemplo canónico: tres detenidos (delito federal, delito común, falta) producen IPH→MP Federal, IPH→MP Estatal, IPH falta→Justicia Cívica.

**REQ-IPH-04 · Aseguramiento sin detenido** — DECIDIDO
- Un aseguramiento sin detenido genera su propio IPH hacia la autoridad que jurídico defina.

**REQ-IPH-05 · Narrativa** — DECIDIDO
- La narrativa vive en el evento. Cada IPH solo tiene narrativa propia cuando el evento tiene más de un IPH.

## E. Detención, delito y bienes
**REQ-DET-01 · Detención vs detenido** — DECIDIDO
- Una detención agrupa detenidos. Delito, falta y orden de aprehensión cuelgan del detenido.
- `id_siprob` es nulo hasta que barandilla registra al detenido (cómo se enlaza: Q-09).

**REQ-DET-02 · Delito sin detenido** — POR VALIDAR (Q-12, propuesta P-04: `delito.evento_id` obligatorio, `detenido_id` opcional).

**REQ-DET-03 · Detenido sin IPH** (entrega de hechos / parte informativo) — POR VALIDAR (Q-13).

**REQ-BIE-01 · Pertenencia de bienes** — DECIDIDO
- Armas y sustancias: siempre aseguramiento. Vehículos y objetos: aseguramiento o resguardo (uno u otro; restricción CHECK). Dinero: `objeto.tipo = 'dinero'`.

**REQ-BIE-02 · Catálogos de armas y sustancias** — POR VALIDAR (Q-15, Q-16).

## F. Conciliación, cierre y reapertura
**REQ-CON-01 · Fusión** — DECIDIDO
- Plataforma fusiona un provisional con el evento real: se reasigna el `evento_id` de todos los hijos al canónico, el provisional queda `anulado` con `evento_canonico_id`, y se registra en `evento_fusion` y en la auditoría. La operación es atómica.

**REQ-CIE-01 · Reglas de completitud para cerrar** — DECIDIDO (spec §6.3) + PROPUESTO (estado por pieza)
- Con detención o aseguramiento → al menos un IPH. Con detención, aseguramiento, atención a emergencia, resguardo o entrega de hechos → una parte informativa. Con declaración de uso de la fuerza → un informe de uso de la fuerza.
- Además: ningún componente en `pendiente`, origen completo y al menos un agente con rol (este último: Q-08).

**REQ-CIE-02 · Cerrar y reabrir** — DECIDIDO
- Solo plataforma cierra; solo jurídico reabre. Qué se puede editar tras el cierre: POR VALIDAR (Q-06).

## G. Auditoría y seguridad
**REQ-AUD-01 · Auditoría inmutable** — DECIDIDO
- Cada INSERT/UPDATE/DELETE y cada fusión escribe en `auditoria_log` (tabla, registro, `evento_id`, operación, valores anteriores y nuevos, usuario, momento). La tabla no admite UPDATE ni DELETE.

**REQ-SEG-01 · RBAC por área** — DECIDIDO (principio) / PROPUESTO (matriz en `matriz_permisos.md`)
- Login compartido: PIMSy no guarda contraseñas ni es dueño de los usuarios (Q-07).

**REQ-SEG-02 · Datos personales** — PROPUESTO
- Datos sensibles (condición del detenido, domicilios, menores) con acceso restringido. Política de protección: Q-33.

## H. Ubicación
**REQ-UBI-01 · Ubicación georreferenciada** — DECIDIDO
- Colonia por catálogo (prevalece). Distrito, cuadrante y sector por punto en polígono. Punto validado por el usuario. Siempre editable a mano. Croquis estático (dónde se guarda: Q-31).

## I. Entrada desde CERI
**REQ-CER-01 · Preregistro desde el reporte macro** — PROPUESTO
- Un comando importa el Excel de CERI y crea filas en `evento_preregistro_ceri` (sin teléfono ni relator), solo procedentes con SPM. Un preregistro se promueve a evento cuando un área le agrega una consecuencia; si no, caduca (plazo: Q-29). Reglas y limpieza: `05-ceri/ceri_reglas_importacion.md`.

## J. Maqueta por departamento
**REQ-MAQ-01 · Selector de departamento** — PROPUESTO
- Dado que abro la maqueta, cuando elijo mi departamento, entonces solo veo las acciones que le corresponden; las demás aparecen deshabilitadas con la leyenda "Lo aporta <departamento>".

**REQ-MAQ-02 · Hoja de validación** — PROPUESTO
- Cada departamento registra: qué aporta, en qué momento, qué necesita ver de los demás, qué no le corresponde, comentarios y respuestas a las preguntas abiertas de su área. Exportable a JSON y vista imprimible.

**REQ-MAQ-03 · Marcas POR VALIDAR** — PROPUESTO
- Todo elemento no decidido lleva etiqueta visible y la pregunta `Q-xx` que lo desbloquea.

## Fuera de alcance (v1)
Atenciones menores, gestión de turnos, despacho/radio, vinculación entre eventos, evidencias y adjuntos (excepto el croquis), migración masiva de históricos, informe de uso de la fuerza completo (IUF sin mapear), tablero y mapas (vistas `mv_*`).
