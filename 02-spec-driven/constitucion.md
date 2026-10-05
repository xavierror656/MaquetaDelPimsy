# Constitución de PIMSy (principios no negociables)

Todo plan, tarea y código debe poder justificarse con estos principios. Si algo los contradice, se detiene y se registra
en `decisiones_asumidas.md` o se convierte en pregunta abierta.

| # | Principio | Estado |
|---|---|---|
| C1 | El EVENTO es la entidad raíz; `evento_id` UUID inmutable; folios = referencias. | DECIDIDO (spec v1.0) |
| C2 | El evento se construye por aportaciones de distintas áreas, partiendo de un registro mínimo. | DECIDIDO (acordado con Javier) |
| C3 | Capturar una vez, aprovechar en todos; derivar lo equivalente entre formularios (nacionalidad → extranjero / país de origen). | DECIDIDO (spec v1.0 §3 y §7.12) |
| C4 | Indicadores de derivación calculados por existencia de registros; no son columnas capturadas. | PROPUESTO (consecuencia de C2) |
| C5 | Ausencia no es inexistencia: estado por pieza (`pendiente / registrado / sin_novedad`). | PROPUESTO |
| C6 | SIPROB es autoritativo del detenido; PIMSy referencia y guarda snapshot mínimo. | DECIDIDO |
| C7 | Agentes: fuente de verdad MongoDB; snapshot al agregarlos al evento. | DECIDIDO |
| C8 | Un detenido pertenece a exactamente un IPH; un evento puede tener varios IPH. | DECIDIDO |
| C9 | Cierra plataforma; reabre jurídico; anulación auditada. | DECIDIDO |
| C10 | Auditoría inmutable por triggers en cada escritura, incluidas las fusiones. | DECIDIDO |
| C11 | El catálogo prevalece sobre la georreferencia; el usuario siempre puede editar a mano. | DECIDIDO |
| C12 | Lo no decidido se marca `POR VALIDAR`; no se inventan reglas. | PROPUESTO |
| C13 | Solo datos sintéticos en desarrollo y pruebas. Protección de datos personales es requisito desde el diseño. | PROPUESTO (la spec la pospone; aquí se adelanta) |
| C14 | El conteo estadístico es resultado del modelo, no lo condiciona. | DECIDIDO |
