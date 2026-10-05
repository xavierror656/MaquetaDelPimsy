PIMSy (Police Information Manager System)

El PIMSy es un sistema integrador de información de diversas fuentes de información que centraliza la información de eventos de atención policial (EAP) que conllevan la conformación de múltiples formularios.

El sistema resuelve diversas problemáticas:

- Bases de datos divididas y no compatibles

- Múltiple retrabajo al llenar formatos diversos

- Falta de conectividad entre sistemas de información de la Secretaría de Seguridad Pública de Ciudad Juárez, entre ellos:

- SIPROB: que lleva el control de las detenciones por cualquier motivo, así como el seguimiento a los procesos de justicia cívica y trabajo social.

- Partes Informativas: que integra los procesos a través los cuales se llevan a cabo las actuaciones policiales, con intención de ser un primer sistema integrador de información para fines estadísticos y de explotación de datos.

- IPH delitos que integra información para el llenado de las puestas a disposición de la autoridad investigadora en materia penal y realiza el llenado del informe policial homologado.

- IPH faltas administrativas que integra información para el llenado de las puestas a disposición de la autoridad investigadora en materia de faltas administrativas y realiza el llenado del informe policial homologado.

- Informe de uso de la fuerza: que deriva de la parte informativa y permite contar con información detallada acerca del uso de la fuerza por parte de agentes policiales.

- Sistema interno de información estadística, llevado a cabo a través de excel y un sistema legacy de estadísticas.

- Los sistemas actuales están desarticulados, aunque puede darse una vinculación entre IPH de faltas o delitos hacia parte informativa, este no hace el llenado completo.

- Los sistemas actuales funcionan en múltiples bases de datos, siendo únicamente SIPROB el sistema que utiliza una base de datos relacional en PostgreSQL, y estadísticas desarrollado en Sybase.

- Los sistemas de IPH en sus dos modalidades, uso de la fuerza y parte informativa se manejan en MongoDB.

- Falta homologación en la denominación de campos.

A partir de estas problemáticas se dan múltiples conflictos que impiden un adecuado manejo integral y adecuado aprovechamiento de la información, crean problemas para la supervisión y el control de la calidad de los datos.

El PIMSy busca ser un modelo integrador de información en base de datos relacional que permita la interconexión entre formularios y sistemas, esto para la homologación de información y la adecuada explotación de datos y escalabilidad de fuentes. Se pretende que este sistema cuente con una base de datos desarrollada en PostgreSQL y se oriente a que la información se llene una sola vez por cualquiera de sus fuentes y pueda ser aprovecha por todas las demás. Así mismo establezca un modelo de consistencia de los datos y permita la adecuada cuantificación de eventos, delitos, actuaciones y demás reportes estadísticos y geoestadísticos que se integren desde la plataforma de gestión digital a la que pertenecerá este sistema.

De acuerdo con la información con la que se cuenta, actualmente no se cuenta con un modelo de documentación de la atención policial a nivel de evento que relacione esta actuación con múltiples formularios. 

El control unitario y entidad independiente del modelo deberá ser el evento, aunque existen múltiples eventos que se atienden actualmente por diversos motivos, solo se capturarán en este sistema los eventos que por su relevancia deriven en información consumible por otros sistemas o formularios.

En este sistema se integrará la información de eventos que cumplan con una o varias de las siguientes condiciones:

- Incluyan por lo menos una detención o aseguramiento

- Incluyan por lo menos una entrega de hechos a otra autoridad

- Incluyan por lo menos una atención a víctimas u otras personas en Trabajo Social o la unidad especializada en violencia familiar

- Incluyan la identificación de hechos posiblemente constitutivos de delitos o faltas administrativas

- Incluyan el resguardo de personas, vehículos u objetos

El control unitario de eventos deberá considerar lo siguiente:

- Un primer formulario deberá capturar los datos generales del evento:

- Generación de ID y Denominación

- Fecha y hora de evento

- Motivo de la participación policial, catálogo, vinculación a datos adicionales a partir del motivo.

- Datos de ubicación, atributos principalmente con base en catálogos y modelo de geolocalización

- Agrupamientos que atienden (catálogo), elementos que atienden (Conexión a MongoDB) y rol que desempeñaron en el evento (Catálogo)

- Autoridades participantes (Catálogo)

- Booleanos de los que derivan más formularios y conexiones:

- Detenciones (Si/No)

- Aseguramientos (Si/No)

- Entrega de Hechos (Si/No)

- Atención a Víctimas (Si/No)

- Registro de quejoso / denunciante (Si/No)

- Resguardo de personas (Si/No)

- Resguardo de objetos (Si/No)

- Órdenes de aprehensión ejecutadas (Si/No)

- Narrativa, texto abierto, con posibilidad de adicionar otra narrativa si se genera más de 1 IPH asociado al evento.