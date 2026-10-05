# Plan técnico

## Arquitectura (decidida en spec v1.0)
Laravel (servicios por dominio) sobre PostgreSQL + PostGIS. Integraciones: SIPROB por vistas de solo lectura, MongoDB para
agentes, Google para geocodificación. Despliegue on-premise.

## Dominios de la aplicación
1. **Evento**: creación (rutas A/B), estados, concurrencia, fusión, preregistro CERI, ubicación.
2. **Agentes**: consulta a MongoDB y snapshot.
3. **Personas**: persona maestra, participación por rol, extensiones (víctima, resguardada).
4. **Detención y legal**: detención, detenido (+ referencia SIPROB), delito, falta, orden de aprehensión.
5. **Documentos**: IPH (borrador → firmado → enviado), parte informativa, uso de la fuerza (mínimo), entrega de hechos, emergencia.
6. **Bienes**: aseguramiento, arma, sustancia, objeto, vehículo, resguardo.
7. **Seguridad y auditoría**: RBAC por área, perfil local de usuario, triggers de auditoría.
8. **Catálogos**: `cat_*` administrables (semillas mínimas; los valores reales los define la SSPM).

## Orden de construcción
1. Migraciones desde `03-modelo-datos/PIMSy_DB.dbml` (solo lo no marcado "Por validar"); vista `v_evento_indicadores` como migración SQL.
2. Modelos Eloquent y relaciones; restricciones en BD (CHECK de pertenencia de bienes, únicos, FKs).
3. Servicios de dominio con las reglas (completitud, cierre, fusión, estado por pieza).
4. Triggers de auditoría y bloqueo de UPDATE/DELETE sobre `auditoria_log`.
5. Políticas de acceso por área (matriz propuesta en `matriz_permisos.md`).
6. Importador de CERI (`artisan`), con transformación de coordenadas en SQL (PostGIS) y reglas de limpieza.
7. API REST (recursos del evento y sus piezas).
8. Maqueta navegable por departamento sobre esa API, con datos sintéticos.
9. Pruebas de reglas y reporte final.

## Decisiones técnicas que se dejan al implementador (registrar en decisiones_asumidas.md)
- Framework del frontend (spec dice solo "SPA con formularios dinámicos").
- Mecanismo de autenticación mientras no se defina el login compartido (Q-07): usar un adaptador simulado detrás de una interfaz.
- Lectura de SIPROB y MongoDB: interfaces con implementación simulada (fakes) y puntos de extensión para la real.
- Partición de `evento` por mes: opcional en el prototipo.

## Riesgos conocidos
Ver `06-analisis/analisis_requerimientos_y_brechas.md` §5.
