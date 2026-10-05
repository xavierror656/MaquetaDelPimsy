# Matriz de permisos por área (PROPUESTA, para validar con Héctor — Q-01, Q-02, Q-04, Q-06)

Origen: ✔ = lo dice la spec v1.0; ◐ = propuesta de trabajo; ? = por validar. Coordinación General y Teléfono Comunitario
aparecen como columnas separadas solo para decidir si son áreas o unidades (Q-02).

| Acción | CERI/origen | Tel. Comunitario | Policía | Coord. General | Barandilla | Jurídico | Plataforma | Analista | Origen |
|---|---|---|---|---|---|---|---|---|---|
| Crear evento (Ruta A, origen) | ✔ | ? | ◐ | ? | — | — | ◐ | — | spec §4.1 y §6.1 |
| Levantar evento (Ruta B, provisional) | — | ? | ◐ | ? | ◐ | ◐ | ◐ | — | spec §6.1; Q-01 |
| Agregar agentes al evento | — | — | ◐ | ✔ | — | ◐ | — | — | spec §3 (coordinación: agentes); Q-08 |
| Registrar detención y detenido | — | — | ✔ | — | ◐ | ◐ | — | — | spec §7.6 |
| Crear / editar IPH (borrador) | — | — | ◐ | — | — | ✔ | — | — | spec §5 |
| Asignar tipo, fuero y autoridad destino del IPH | — | — | — | — | — | ✔ | — | — | spec §5 y §7.7 |
| Aseguramiento y bienes | — | — | ◐ | — | — | ✔ | — | — | spec §3 (jurídico/IPH: bienes) |
| Parte informativa | — | — | ✔ | ✔ | — | — | — | — | spec §3, §5 |
| Declarar y registrar uso de la fuerza | — | — | ✔ | — | — | — | — | — | spec §6.3 |
| Conciliar y fusionar provisionales | — | — | — | — | — | — | ✔ | — | spec §6.1 |
| Cerrar evento | — | — | — | — | — | — | ✔ | — | spec §6.2 |
| Reabrir evento | — | — | — | — | — | ✔ | — | — | spec §6.2 |
| Anular evento | — | — | — | — | — | ? | ✔ | — | spec §6.2 (auditado); quién: Q-06 |
| Administrar catálogos | — | — | — | — | — | — | ✔ | — | spec §5 |
| Consultar tablero y reportes | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | spec §5 |

Toda acción de escritura guarda `aportado_por`, `area_aporta_id` y `aportado_en`.
