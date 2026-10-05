# Preguntas abiertas

Cada pregunta tiene un ID `Q-xx` que se usa en el código como `// POR VALIDAR(Q-xx)`.

## Flujo y roles (Héctor, miércoles 7-oct-2026)
- **Q-01** ¿Quién puede levantar un evento y por cuál ruta (policía, jurídico, barandilla, plataforma, Coordinación General, Teléfono Comunitario)?
- **Q-02** ¿Coordinación General y Teléfono Comunitario son áreas con permisos propios o unidades dentro de un área? ¿Levantan eventos propios o solo supervisan?
- **Q-03** ¿Teléfono Comunitario genera folio CERI o uno propio?
- **Q-04** ¿Quién agrega cada pieza al evento (agentes, IPH, detenidos, aseguramientos, parte informativa)?
- **Q-05** ¿Quién concilia y fusiona eventos duplicados, y en cuánto tiempo?
- **Q-06** ¿Plataforma cierra y jurídico reabre? ¿Qué se puede editar después del cierre y quién anula?
- **Q-07** Login compartido: ¿de cuál sistema nace el usuario (MySQL o Mongo)? ¿PIMSy guarda solo el perfil y los permisos?
- **Q-08** ¿Quién captura a los agentes y cuándo, sobre todo en eventos sin IPH? ¿El cierre exige al menos uno?

## SIPROB y jurídico
- **Q-09** ¿Cómo se enlaza SIPROB con el evento: se modifica SIPROB para guardar el evento o barandilla lo busca por folio?
- **Q-10** ¿Quién es dueño del dato de detención, PIMSy o SIPROB?
- **Q-11** ¿SIPROB ya captura condición del detenido (lesiones, padecimiento, grupos), familiar de contacto, pertenencias y atención médica?
- **Q-12** ¿Cómo se registra un delito o falta cuando no hay detenido? (propuesta P-04)
- **Q-13** ¿Qué pasa con un detenido que va a 'entrega de hechos' o 'parte informativo' y no a IPH?
- **Q-14** ¿La atención a emergencia se permite siempre o solo cuando no hay detención ni aseguramiento?

## Mapeo de formularios
- **Q-15** ¿Dónde va el dinero: objeto especial (spec v1.0) o sustancia como lo trata el IPH?
- **Q-16** ¿Catálogo único de armas y sustancias que unifique parte e IPH?
- **Q-17** ¿Los testigos de aseguramiento son persona maestra o dato libre?
- **Q-18** ¿La inspección y preservación del lugar son del IPH o del evento?
- **Q-19** ¿Se registran vehículos inspeccionados que no se aseguran?
- **Q-20** ¿Cómo se registran agentes de otra institución, si el catálogo de Mongo es solo SSPM?
- **Q-21** ¿El anexo de uso de la fuerza del IPH se deriva del informe? (queda pendiente mapear el IUF)
- **Q-22** ¿La fecha y hora de conocimiento y de arribo vienen de CERI o se capturan?
- **Q-23** ¿La marca de documentación complementaria (foto, audio, video) se captura a mano mientras no haya adjuntos?
- **Q-24** ¿Cuál es la lista vigente de campos del IPH? Las hojas del análisis dicen 'pendiente por cambios en aplicación'.

## Alcance del requerimiento
- **Q-25** ¿Los recorridos y patrullajes se registran siempre o solo si derivan en algo?
- **Q-26** ¿La clasificación de la intervención (falta, presunto delito, emergencia) se captura al abrir el evento o se deriva de lo agregado?
- **Q-27** ¿Se restituyen agrupamientos que atienden, autoridades participantes y denominación del evento? ¿Cómo el motivo activa datos adicionales?
- **Q-28** ¿Se alinean los criterios de inclusión con el requerimiento original?

## Integración y arquitectura
- **Q-29** ¿El reporte macro de CERI estará disponible regularmente y con el mismo formato? ¿En cuántos días caduca un preregistro sin consecuencias?
- **Q-30** ¿Google o geocodificador y mapa locales? Falta revisar con jurídico los términos de uso sobre almacenar resultados.
- **Q-31** ¿Dónde se guardan los croquis? La v1.0 quitó el almacenamiento de archivos.
- **Q-32** ¿Cómo es la transición desde MongoDB: corte por formulario, periodo de coexistencia e histórico?
- **Q-33** ¿Qué requisitos de protección de datos se fijan desde ahora (menores, víctimas de violencia familiar, domicilios)?
- **Q-34** ¿Cuántos usuarios concurrentes y cuántos registros por año? La v1.0 los mezclaba.
- **Q-35** ¿Qué política de refresco se usa para las vistas, si 'tiempo real' no aplica a vistas materializadas?
