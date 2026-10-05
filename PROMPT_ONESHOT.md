# PROMPT ONE-SHOT — PIMSy

## Prompt de arranque (lo que pegas en Claude Code)
```
Eres el implementador de PIMSy (SSPM Ciudad Juárez). Lee primero CLAUDE.md y luego, en este orden:
02-spec-driven/constitucion.md, spec.md, plan.md, tasks.md, decisiones.md y preguntas_abiertas.md;
03-modelo-datos/PIMSy_DB.dbml y mapeo_campos.csv; 05-ceri/ceri_reglas_importacion.md.
Ejecuta TODAS las tareas de tasks.md (T-01 a T-16) en una sola pasada, sin pedirme confirmación:
si dudas, aplica el supuesto más conservador y regístralo en 02-spec-driven/decisiones_asumidas.md.
No implementes como definitivo nada marcado POR VALIDAR: déjalo detrás de un punto de extensión y
márcalo con // POR VALIDAR(Q-xx). Usa solo datos sintéticos. Al terminar corre migraciones desde cero,
seeders y pruebas, y escribe REPORTE_FINAL.md.
```

## Prompt completo

### ROL
Eres un desarrollador senior de Laravel/PostgreSQL con criterio de producto. Vas a construir, en una sola pasada, un prototipo
funcional de PIMSy sobre el stack decidido en la Especificación Técnica v1.0, con las partes ya claras del diseño, y una
maqueta navegable para validar el flujo con cada departamento de la SSPM.

### OBJETIVO
1. Una base de datos PostgreSQL/PostGIS que materialice el modelo v0.2 **solo en lo claro** (todo menos el grupo "Por validar").
2. Reglas de negocio ejecutables y probadas: nacimiento del evento (rutas A y B), estado por pieza, indicadores derivados,
   completitud para cerrar, IPH en borrador y enrutamiento, pertenencia de bienes, fusión, cierre/reapertura, auditoría.
3. Un importador del reporte de CERI que crea preregistros.
4. Una maqueta por departamento donde cada área vea su parte, valide y exporte su hoja de respuestas.

### CÓMO TRABAJAR
- Lee `CLAUDE.md` y respeta la constitución. Si un requisito contradice un principio, gana el principio y lo anotas.
- Spec-driven: implementa requisito por requisito (`spec.md`) siguiendo el orden de `tasks.md`. No añadas funcionalidad que no esté en la spec.
- No inventes catálogos, reglas legales ni valores. Siembra solo lo mínimo para que el prototipo corra (catálogos semilla de
  `05-ceri/catalogos-semilla/` y valores ficticios marcados como tales).
- No preguntes: si algo bloquea, toma la opción más conservadora, regístrala en `decisiones_asumidas.md` y sigue.

### STACK Y RESTRICCIONES
- Laravel (versión estable actual) + PHP compatible, PostgreSQL + PostGIS. Migraciones en español. Docker Compose con PostGIS para correr todo localmente.
- Frontend: elige la opción más simple que no requiera servidor de build complejo (por ejemplo Blade + Alpine.js servido por Laravel) y regístrala como supuesto. Interfaz en español, usable en escritorio y tableta, para personal no técnico.
- SIPROB y MongoDB se acceden por interfaces con implementación simulada (fakes con datos sintéticos) y un punto de extensión para la real. Google no se invoca: la ubicación se captura a mano en la maqueta.
- Autenticación: adaptador simulado detrás de una interfaz (el login compartido no está definido, Q-07). El usuario de la maqueta elige departamento.
- Datos personales: ninguno real. El teléfono y el relator del export CERI nunca se importan.

### QUÉ SÍ CONSTRUIR (partes claras)
- Núcleo del evento, ubicación, agrupamientos y autoridades del evento, componentes con estado, fusión, preregistro CERI, auditoría.
- Agentes con snapshot (consulta simulada a MongoDB) y roles múltiples.
- Personas con participación por rol, víctima, resguardada, atención especializada, resguardo.
- Detención, detenido (con `id_siprob` simulado y snapshot mínimo), delito, falta, orden de aprehensión.
- IPH (borrador → firmado → enviado), parte informativa, uso de la fuerza (mínimo), entrega de hechos, emergencia.
- Aseguramiento, armas, sustancias, objetos (incluye dinero), vehículos, con las reglas de pertenencia.
- Vista `v_evento_indicadores`.
- Importador CERI: `php artisan pimsy:ceri-importar <archivo>`; filtra procedentes con SPM; excluye datos personales; transforma coordenadas con PostGIS; aplica las reglas de limpieza de `05-ceri/ceri_reglas_importacion.md`.
- RBAC por área con la matriz propuesta (`matriz_permisos.md`).
- API REST de evento y piezas.
- Maqueta por departamento: selector de departamento; lista y detalle del evento con panel de estado (pendiente / registrado / sin novedad e indicadores derivados); formularios mínimos de aportación por pieza; bandeja de conciliación y fusión; cierre y reapertura con sus bloqueos; hoja de validación por departamento con exportación JSON e imprimible; etiquetas POR VALIDAR visibles con su `Q-xx`.

### QUÉ NO CONSTRUIR
- Las tablas del grupo "Por validar" del DBML (testigo, pertenencias, familiar, condición del detenido, traslado, lectura de derechos del menor, inspección del lugar): no las crees en migraciones activas; menciónalas en `REPORTE_FINAL.md`.
- Evidencias y adjuntos, tablero y mapas, informe de uso de la fuerza completo (IUF sin mapear), integraciones reales, migración de históricos, gestión de turnos.
- Reglas `POR VALIDAR`: delito sin detenido (Q-12) y detenido sin IPH (Q-13) se implementan solo como punto de extensión; edición después del cierre (Q-06); caducidad del preregistro (Q-29) parametrizable con valor de ejemplo claramente marcado.

### DATOS DE EJEMPLO (seeders)
Tres eventos sintéticos: (1) Ruta A desde un preregistro CERI de la muestra sintética, con detención, IPH y aseguramiento;
(2) Ruta B levantado desde un formulario, en `borrador_sin_origen`; (3) un duplicado del evento 1, para probar la fusión.
Más un usuario simulado por departamento: CERI/origen, Teléfono Comunitario (POR VALIDAR), Policía, Coordinación General (POR VALIDAR),
Barandilla, Jurídico, Plataforma, Analista.

### PRUEBAS (mínimo)
Completitud para cerrar (las tres reglas + ningún componente pendiente); pertenencia de bienes (arma/sustancia sin aseguramiento falla; objeto con aseguramiento **y** resguardo falla);
fusión atómica y auditada; `auditoria_log` rechaza UPDATE/DELETE; solo plataforma cierra y solo jurídico reabre; snapshot de agente no cambia al cambiar el origen;
importador (excluye improcedentes y datos personales, coordenadas en cero → nulo, arribo igual a inicio → nulo, CP 0 → nulo); concurrencia por `version`.

### DEFINICIÓN DE TERMINADO
- `docker compose up`, `php artisan migrate:fresh --seed` y la suite de pruebas pasan desde cero.
- Cada REQ DECIDIDO o PROPUESTO de `spec.md` está implementado o explicado en `REPORTE_FINAL.md`.
- Nada POR VALIDAR quedó como definitivo; todo punto de extensión está marcado `// POR VALIDAR(Q-xx)`.
- Un departamento recorre su parte del flujo en la maqueta y exporta su hoja en menos de 15 minutos.
- `REPORTE_FINAL.md` incluye: cómo correr todo, tabla requisito → archivo, lista de POR VALIDAR, supuestos tomados y deuda técnica.

### ENTREGABLE
El proyecto Laravel funcionando, `REPORTE_FINAL.md` y `02-spec-driven/decisiones_asumidas.md` actualizado.
