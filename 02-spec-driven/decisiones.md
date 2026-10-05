# Registro de decisiones

Estados: **DECIDIDO** (spec v1.0 o acuerdo explícito) · **PROPUESTO** (propuesta de trabajo) · **POR VALIDAR** (pregunta abierta, ver `preguntas_abiertas.md`).

## Decididas
| ID | Decisión | Fuente |
|---|---|---|
| D-01 | Evento como entidad raíz con UUID inmutable; folios como referencias. | Spec v1.0 §3, §7.2 |
| D-02 | Dos rutas de nacimiento (A origen primero; B formulario primero → provisional) con bandeja de conciliación de plataforma. | Spec v1.0 §6.1 |
| D-03 | Estados: borrador_sin_origen, abierto, en_proceso, cerrado, reabierto, anulado. | Spec v1.0 §6.2 |
| D-04 | Cierra plataforma; reabre jurídico. | Spec v1.0 §6.2 |
| D-05 | El IPH se llena antes de registrar detenidos y aseguramientos. | Spec v1.0 §6.3 |
| D-06 | Detención (proceso) ≠ detenido (entidad); delito, falta y orden cuelgan del detenido. | Spec v1.0 §7.6 |
| D-07 | Un detenido pertenece a un solo IPH; un evento puede tener varios; aseguramiento sin detenido genera su propio IPH. | Spec v1.0 §7.7 |
| D-08 | Pertenencia de bienes: armas/sustancias solo aseguramiento; vehículos/objetos aseguramiento o resguardo; dinero = objeto especial. | Spec v1.0 §7.8 |
| D-09 | Snapshot de agentes al registrar; roles múltiples por agente (catálogo propio). | Spec v1.0 §7.5 |
| D-10 | PostgreSQL + PostGIS; Laravel; on-premise; auditoría por triggers; RBAC por áreas. | Spec v1.0 §10 |
| D-11 | Georreferencia: catálogos + Google con validación del usuario; distrito/cuadrante/sector por punto en polígono; catálogo prevalece; croquis estático. | Spec v1.0 §7.3 |
| D-12 | SIPROB se conserva y se integra por vistas de solo lectura; SID y los MongoDB (IPH, partes, IUF) quedan como legacy. | Spec v1.0 §2.1 |
| D-13 | El evento se construye por aportaciones; puede nacer desde CERI o desde otra área que lo levante. | Conversación con Javier (5-oct-2026) |
| D-14 | Javier es responsable del IPH y de todo PIMSy. | Conversación con Javier |
| D-15 | Login compartido; la fuente de verdad de los agentes es MongoDB. | Chat con Héctor (5-oct-2026) |

## Propuestas de trabajo (modelo v0.2)
| ID | Propuesta | Razón |
|---|---|---|
| P-01 | Booleanos de derivación como vista `v_evento_indicadores`, no como columnas. | Consecuencia de D-13. |
| P-02 | `evento_componente_estado` con `pendiente / registrado / sin_novedad`; el cierre exige cero pendientes. | Ausencia ≠ inexistencia. |
| P-03 | IPH "cascarón" en borrador con tipo/fuero/destino nulos hasta que jurídico los asigna; `detenido.iph_id` nulable al inicio. | Rompe la dependencia circular del IPH. |
| P-04 | `delito` obligatorio al evento y opcional al detenido/víctima. | Presunto delito sin detenido. |
| P-05 | `evento_preregistro_ceri` con estado y caducidad; el preregistro no cuenta en estadísticas hasta promoverse. | La mayoría de los despachos CERI no tiene consecuencias. |
| P-06 | `evento_fusion` + `evento_canonico_id` para la trazabilidad de fusiones. | Reversibilidad y auditoría. |
| P-07 | Separar `medio_conocimiento` (CERI, comunitario, recorrido…) de `tipo_origen` (actividad). | Son dimensiones distintas (parte informativa vs spec). |
| P-08 | Auditoría con `evento_id` para reconstruir la historia del evento. | Supervisión. |
| P-09 | Separar "área" (permisos) de "unidad orgánica" (Coordinación General, Teléfono Comunitario). | Chat con Héctor; ver Q-02. |
| P-10 | Importación diaria del reporte macro de CERI como preregistros (sin teléfono ni relator). | Entrada simplificada sin API. |

Lo demás está en `preguntas_abiertas.md`.
