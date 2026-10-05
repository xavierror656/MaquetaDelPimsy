# Tareas (en este orden)

Marca cada tarea al terminarla. Cada una referencia sus requisitos.

- [ ] **T-01** Migraciones núcleo: `evento`, `ubicacion`, `evento_componente_estado`, `evento_agrupamiento`, `evento_autoridad`, `evento_fusion`, `evento_preregistro_ceri`, catálogos del evento. (REQ-EVT-01..06, REQ-APO-02, REQ-UBI-01)
- [ ] **T-02** Migraciones: agentes, personas, participación, víctima, resguardada, resguardo, atención especializada. (REQ-AGE-01, REQ-APO-01)
- [ ] **T-03** Migraciones: detención, detenido, delito, falta, orden de aprehensión; referencia SIPROB simulada. (REQ-DET-01)
- [ ] **T-04** Migraciones: IPH, parte informativa, uso de la fuerza (mínimo), entrega de hechos, emergencia. (REQ-IPH-*)
- [ ] **T-05** Migraciones: aseguramiento, arma, sustancia, objeto, vehículo con CHECK de pertenencia. (REQ-BIE-01)
- [ ] **T-06** Vista `v_evento_indicadores` y auditoría (triggers, bloqueo de UPDATE/DELETE). (REQ-APO-03, REQ-AUD-01)
- [ ] **T-07** Modelos, relaciones y fábricas de datos sintéticos; seeders con 3 eventos (uno Ruta A desde CERI, uno Ruta B, uno duplicado). 
- [ ] **T-08** Servicios de dominio: crear evento (A/B), estado por pieza, cierre/reapertura, fusión, alerta de duplicado. (REQ-EVT-*, REQ-CIE-*, REQ-CON-01)
- [ ] **T-09** RBAC por área con la matriz propuesta y adaptador de autenticación simulado. (REQ-SEG-01)
- [ ] **T-10** Importador CERI `artisan pimsy:ceri-importar` con las reglas de `05-ceri/`, probado con la muestra sintética. (REQ-CER-01)
- [ ] **T-11** API REST de evento y piezas, con validación y respuestas de error en español.
- [ ] **T-12** Maqueta navegable por departamento: selector, lista y detalle del evento con panel de estado, formularios mínimos de aportación, conciliación y fusión, cierre/reapertura. (REQ-MAQ-01)
- [ ] **T-13** Hoja de validación por departamento y exportación JSON/imprimible, con preguntas abiertas por área. (REQ-MAQ-02)
- [ ] **T-14** Etiquetas `POR VALIDAR(Q-xx)` visibles en UI y comentadas en código. (REQ-MAQ-03)
- [ ] **T-15** Pruebas: una por regla de completitud, una por regla de bienes, fusión atómica, auditoría inmutable, importador CERI, estado por pieza.
- [ ] **T-16** `REPORTE_FINAL.md`: qué requisito cubre cada archivo, qué quedó `POR VALIDAR`, supuestos tomados, cómo correr todo.

## Definición de terminado (global)
- `migrate:fresh --seed` corre sin errores y deja los 3 eventos de ejemplo.
- Todas las pruebas pasan.
- Cada REQ marcado DECIDIDO o PROPUESTO tiene implementación o una nota explícita de por qué no.
- Nada `POR VALIDAR` está implementado como definitivo.
- Un departamento puede recorrer su parte del flujo en la maqueta y exportar su hoja en menos de 15 minutos.
