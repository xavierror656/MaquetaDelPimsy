-- Generado automáticamente desde PIMSy_DB.dbml (borrador v0.2). PostGIS: CREATE EXTENSION postgis; antes de ejecutar.
-- Las vistas (v_evento_indicadores) y los catálogos aparecen como tablas: ver notas del DBML.
CREATE TYPE "evento_estado" AS ENUM (
  'preregistro_ceri',
  'borrador_sin_origen',
  'abierto',
  'en_proceso',
  'cerrado',
  'reabierto',
  'anulado'
);

CREATE TYPE "estado_componente" AS ENUM (
  'pendiente',
  'registrado',
  'sin_novedad'
);

CREATE TYPE "iph_tipo" AS ENUM (
  'delito',
  'falta_administrativa'
);

CREATE TYPE "iph_estatus" AS ENUM (
  'borrador',
  'firmado',
  'enviado'
);

CREATE TYPE "rol_persona" AS ENUM (
  'victima',
  'quejoso',
  'denunciante',
  'ofendido',
  'resguardada'
);

CREATE TYPE "arma_subtipo" AS ENUM (
  'corta',
  'larga',
  'blanca'
);

CREATE TYPE "objeto_tipo" AS ENUM (
  'dinero',
  'otro'
);

CREATE TYPE "resguardo_tipo" AS ENUM (
  'persona',
  'vehiculo',
  'objeto'
);

CREATE TYPE "preregistro_estado" AS ENUM (
  'pendiente',
  'promovido',
  'archivado'
);

CREATE TYPE "bien_tipo" AS ENUM (
  'arma',
  'sustancia',
  'objeto'
);

CREATE TABLE "evento" (
  "evento_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "folio" varchar UNIQUE,
  "denominacion" varchar,
  "tipo_origen_id" int,
  "medio_conocimiento_id" int,
  "folio_ceri" varchar UNIQUE,
  "motivo_id" int,
  "fecha_evento" date,
  "hora_evento" time,
  "fecha_hora_conocimiento" timestamptz,
  "fecha_hora_arribo" timestamptz,
  "ubicacion_id" uuid UNIQUE,
  "narrativa" text,
  "estado" evento_estado NOT NULL DEFAULT 'borrador_sin_origen',
  "evento_canonico_id" uuid,
  "version" int NOT NULL DEFAULT 1,
  "creado_por" uuid,
  "area_creadora_id" int,
  "creado_en" timestamptz DEFAULT (now()),
  "cerrado_por" uuid,
  "cerrado_en" timestamptz,
  "reabierto_por" uuid,
  "reabierto_en" timestamptz
);

CREATE TABLE "evento_componente_estado" (
  "evento_id" uuid,
  "componente_id" int,
  "estado" estado_componente NOT NULL DEFAULT 'pendiente',
  "area_responsable_id" int,
  "actualizado_por" uuid,
  "actualizado_en" timestamptz DEFAULT (now()),
  PRIMARY KEY ("evento_id", "componente_id")
);

CREATE TABLE "evento_agrupamiento" (
  "evento_id" uuid,
  "agrupamiento_id" int,
  PRIMARY KEY ("evento_id", "agrupamiento_id")
);

CREATE TABLE "evento_autoridad" (
  "evento_id" uuid,
  "autoridad_id" int,
  "rol_participacion" varchar,
  PRIMARY KEY ("evento_id", "autoridad_id")
);

CREATE TABLE "evento_fusion" (
  "fusion_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_origen_id" uuid,
  "evento_destino_id" uuid,
  "motivo" text,
  "fusionado_por" uuid,
  "fusionado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "evento_preregistro_ceri" (
  "preregistro_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "folio_ceri" varchar UNIQUE NOT NULL,
  "archivo_origen" varchar,
  "fecha_importacion" timestamptz DEFAULT (now()),
  "datos_origen" jsonb,
  "estado" preregistro_estado NOT NULL DEFAULT 'pendiente',
  "evento_id" uuid,
  "caduca_en" timestamptz
);

CREATE TABLE "ubicacion" (
  "ubicacion_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "calle" varchar,
  "cruce_1" varchar,
  "cruce_2" varchar,
  "numero_exterior" varchar(20),
  "numero_interior" varchar(20),
  "referencia" text,
  "codigo_postal" varchar(5),
  "municipio" varchar DEFAULT 'Juárez',
  "entidad" varchar DEFAULT 'Chihuahua',
  "colonia_id" int,
  "distrito_id" int,
  "cuadrante_id" int,
  "sector_id" int,
  "latitud" decimal(10,8),
  "longitud" decimal(11,8),
  "geom" "geometry(Point,4326)",
  "fuente_geocodificacion" varchar,
  "punto_validado_por" uuid,
  "punto_validado_en" timestamptz,
  "croquis_path" varchar,
  "croquis_generado_en" timestamptz
);

CREATE TABLE "v_evento_indicadores" (
  "evento_id" uuid,
  "tiene_detenciones" boolean,
  "tiene_aseguramientos" boolean,
  "tiene_entrega_hechos" boolean,
  "tiene_atencion_victimas" boolean,
  "tiene_quejoso_denunciante" boolean,
  "tiene_resguardo_personas" boolean,
  "tiene_resguardo_objetos" boolean,
  "tiene_ordenes_aprehension" boolean,
  "tiene_atencion_emergencia" boolean,
  "tiene_uso_fuerza" boolean,
  "componentes_pendientes" int
);

CREATE TABLE "mongo_agente" (
  "agente_mongo_id" varchar PRIMARY KEY,
  "numero_empleado" varchar,
  "nombre" varchar,
  "apellido_paterno" varchar,
  "apellido_materno" varchar,
  "distrito" varchar,
  "area" varchar,
  "subarea" varchar,
  "puesto" varchar,
  "unidad" varchar
);

CREATE TABLE "agente_involucrado" (
  "agente_involucrado_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "agente_mongo_id" varchar,
  "es_externo" boolean DEFAULT false,
  "institucion_externa" varchar,
  "numero_empleado_snap" varchar,
  "nombre_snap" varchar,
  "apellido_paterno_snap" varchar,
  "apellido_materno_snap" varchar,
  "distrito_snap" varchar,
  "area_snap" varchar,
  "subarea_snap" varchar,
  "puesto_snap" varchar,
  "unidad_snap" varchar,
  "snapshot_en" timestamptz DEFAULT (now()),
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "agente_involucrado_rol" (
  "agente_involucrado_id" uuid,
  "rol_agente_id" int,
  PRIMARY KEY ("agente_involucrado_id", "rol_agente_id")
);

CREATE TABLE "persona" (
  "persona_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nombre" varchar NOT NULL,
  "apellido_paterno" varchar,
  "apellido_materno" varchar,
  "fecha_nacimiento" date,
  "sexo_id" int,
  "curp" varchar(18),
  "telefono" varchar,
  "ocupacion" varchar,
  "pais_origen_id" int,
  "estado_origen" varchar,
  "ciudad_origen" varchar,
  "etnia_id" int,
  "etnia_otro" varchar,
  "domicilio_calle" varchar,
  "domicilio_numero_exterior" varchar(20),
  "domicilio_numero_interior" varchar(20),
  "domicilio_colonia_id" int,
  "domicilio_codigo_postal" varchar(5)
);

CREATE TABLE "participacion_persona" (
  "participacion_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "persona_id" uuid NOT NULL,
  "rol" rol_persona NOT NULL,
  "edad_al_momento_evento" smallint,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "part_victima" (
  "participacion_id" uuid PRIMARY KEY,
  "requirio_canalizacion" boolean,
  "atencion_legal_id" int,
  "atencion_legal_otro" varchar,
  "atencion_psicologica_id" int,
  "atencion_medica_id" int,
  "atencion_medica_otro" varchar
);

CREATE TABLE "part_resguardada" (
  "participacion_id" uuid PRIMARY KEY,
  "resguardo_id" uuid NOT NULL
);

CREATE TABLE "atencion_especializada" (
  "atencion_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "participacion_id" uuid NOT NULL,
  "unidad_especializada_id" int,
  "fecha_hora" timestamptz,
  "observaciones" text
);

CREATE TABLE "resguardo" (
  "resguardo_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "tipo" resguardo_tipo NOT NULL,
  "motivo" text,
  "institucion_resguardo_id" int,
  "institucion_otra" varchar,
  "fecha_inicio" timestamptz,
  "fecha_fin" timestamptz,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "siprob_detenido" (
  "id_siprob" varchar PRIMARY KEY,
  "rnd" varchar,
  "curp" varchar(18),
  "nombre" varchar,
  "apellido_paterno" varchar,
  "apellido_materno" varchar,
  "fecha_nacimiento" date,
  "sexo" varchar,
  "pais_origen" varchar,
  "estado_origen" varchar,
  "ciudad_origen" varchar,
  "domicilio" varchar
);

CREATE TABLE "detencion" (
  "detencion_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "fecha_hora" timestamptz,
  "tipo_detencion_id" int,
  "ubicacion_id" uuid,
  "observaciones" text,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "detenido" (
  "detenido_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "detencion_id" uuid NOT NULL,
  "id_siprob" varchar,
  "iph_id" uuid,
  "rnd_snap" varchar,
  "nombre_snap" varchar,
  "apellido_paterno_snap" varchar,
  "apellido_materno_snap" varchar,
  "fecha_nacimiento_snap" date,
  "sexo_snap" varchar,
  "pais_origen_snap" varchar,
  "edad_al_momento_evento" smallint,
  "lectura_derechos" boolean,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "delito" (
  "delito_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "detenido_id" uuid,
  "participacion_victima_id" uuid,
  "cat_delito_id" int,
  "cat_subdelito_id" int,
  "delito_especifique" varchar,
  "consecutivo" smallint,
  "fuero_id" int,
  "hubo_violencia" boolean,
  "modalidad_id" int,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "falta_administrativa" (
  "falta_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "detenido_id" uuid,
  "cat_falta_id" int,
  "fraccion" varchar,
  "descripcion" text,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "orden_aprehension" (
  "orden_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "detenido_id" uuid NOT NULL,
  "mandamiento_judicial" varchar,
  "autoridad_emisora_id" int,
  "delito_orden" varchar,
  "vigente" boolean,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "iph" (
  "iph_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "tipo" iph_tipo,
  "fuero_id" int,
  "autoridad_destino_id" int,
  "folio_referencia" varchar,
  "folio_sistema" varchar UNIQUE,
  "no_remision" varchar,
  "no_expediente" varchar,
  "fecha_puesta" date,
  "hora_puesta" time,
  "agente_puesta_id" uuid,
  "fiscal_nombre" varchar,
  "fiscal_cargo" varchar,
  "fiscal_adscripcion" varchar,
  "estatus" iph_estatus NOT NULL DEFAULT 'borrador',
  "narrativa" text,
  "version" int NOT NULL DEFAULT 1,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "parte_informativa" (
  "parte_informativa_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "iph_id" uuid,
  "folio" varchar,
  "tipo" varchar,
  "estatus" varchar,
  "agente_capturista_id" uuid,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "uso_fuerza" (
  "uso_fuerza_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "nivel_fuerza_id" int,
  "descripcion" text,
  "asistencia_medica" boolean,
  "descripcion_asistencia_medica" text,
  "lesionados_autoridad" int,
  "lesionados_personas" int,
  "fallecidos_autoridad" int,
  "fallecidos_personas" int,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "uso_fuerza_agente" (
  "uso_fuerza_id" uuid,
  "agente_involucrado_id" uuid,
  PRIMARY KEY ("uso_fuerza_id", "agente_involucrado_id")
);

CREATE TABLE "uso_fuerza_detenido" (
  "uso_fuerza_id" uuid,
  "detenido_id" uuid,
  PRIMARY KEY ("uso_fuerza_id", "detenido_id")
);

CREATE TABLE "entrega_hechos" (
  "entrega_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "autoridad_id" int,
  "fecha_hora" timestamptz,
  "descripcion" text,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "emergencia" (
  "emergencia_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "clasificacion_id" int,
  "tipo_emergencia_id" int,
  "subtipo" varchar,
  "descripcion" text,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "aseguramiento" (
  "aseguramiento_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "evento_id" uuid NOT NULL,
  "iph_id" uuid,
  "descripcion" text,
  "aportado_por" uuid,
  "area_aporta_id" int,
  "aportado_en" timestamptz DEFAULT (now())
);

CREATE TABLE "arma" (
  "arma_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "aseguramiento_id" uuid NOT NULL,
  "subtipo" arma_subtipo NOT NULL,
  "clasificacion_arma_id" int,
  "tipo_arma_id" int,
  "nombre_arma_id" int,
  "calibre_id" int,
  "matricula" varchar,
  "serie" varchar,
  "color" varchar,
  "cantidad" int DEFAULT 1,
  "descripcion" text,
  "procedencia_hallazgo_id" int,
  "ubicacion_hallazgo" varchar,
  "agente_asegura_id" uuid,
  "destino" varchar
);

CREATE TABLE "sustancia" (
  "sustancia_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "aseguramiento_id" uuid NOT NULL,
  "categoria_sustancia_id" int,
  "tipo_sustancia_id" int,
  "sustancia_especifique" varchar,
  "unidad_peso" varchar,
  "cantidad_peso" decimal(14,3),
  "unidad_presentacion_id" int,
  "cantidad_presentacion" decimal(14,3),
  "cantidad_gramos" decimal(14,3),
  "cantidad_kg" decimal(14,3),
  "descripcion" text,
  "procedencia_hallazgo_id" int,
  "ubicacion_hallazgo" varchar,
  "agente_asegura_id" uuid,
  "destino" varchar
);

CREATE TABLE "objeto" (
  "objeto_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "aseguramiento_id" uuid,
  "resguardo_id" uuid,
  "tipo" objeto_tipo NOT NULL DEFAULT 'otro',
  "tipo_objeto_id" int,
  "objeto_especifique" varchar,
  "cantidad" decimal(14,2),
  "unidad_medida_id" int,
  "descripcion" text,
  "procedencia_hallazgo_id" int,
  "ubicacion_hallazgo" varchar,
  "agente_asegura_id" uuid,
  "destino" varchar
);

CREATE TABLE "vehiculo" (
  "vehiculo_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "aseguramiento_id" uuid,
  "resguardo_id" uuid,
  "evento_id" uuid NOT NULL,
  "inspeccionado" boolean DEFAULT false,
  "fecha_hora_inspeccion" timestamptz,
  "tipo_vehiculo_id" int,
  "procedencia" varchar,
  "uso" varchar,
  "marca_id" int,
  "submarca" varchar,
  "modelo" varchar,
  "color_id" int,
  "placas" varchar,
  "entidad_emplacado" varchar,
  "num_serie" varchar,
  "situacion_id" int,
  "motivo_aseguramiento_id" int,
  "lugar_deposito_id" int,
  "descripcion" text,
  "procedencia_hallazgo_id" int,
  "ubicacion_hallazgo" varchar,
  "agente_asegura_id" uuid
);

CREATE TABLE "testigo_bien" (
  "testigo_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "bien_tipo" bien_tipo NOT NULL,
  "bien_id" uuid NOT NULL,
  "orden" smallint,
  "nombre" varchar,
  "apellido_paterno" varchar,
  "apellido_materno" varchar
);

CREATE TABLE "pertenencia_detenido" (
  "pertenencia_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "detenido_id" uuid NOT NULL,
  "nombre" varchar,
  "descripcion" text,
  "destino" varchar
);

CREATE TABLE "contacto_familiar_detenido" (
  "contacto_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "detenido_id" uuid NOT NULL,
  "nombre" varchar,
  "apellido_paterno" varchar,
  "apellido_materno" varchar,
  "telefono" varchar
);

CREATE TABLE "detenido_condicion" (
  "detenido_id" uuid PRIMARY KEY,
  "descripcion_fisica" text,
  "lesiones" boolean,
  "padecimiento" boolean,
  "tipo_padecimiento" varchar,
  "grupo_vulnerable" boolean,
  "cual_grupo_vulnerable" varchar,
  "grupo_delictivo" boolean,
  "cual_grupo_delictivo" varchar,
  "atencion_medica" boolean,
  "lugar_atencion_medica" varchar
);

CREATE TABLE "traslado_detenido" (
  "traslado_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "detenido_id" uuid NOT NULL,
  "destino_traslado_id" int,
  "dependencia_otra" varchar,
  "observaciones" text
);

CREATE TABLE "lectura_derechos_menor" (
  "lectura_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "detenido_id" uuid NOT NULL,
  "dependencia" varchar,
  "entidad" varchar,
  "ciudad" varchar,
  "lugar" varchar,
  "fecha_hora" timestamptz,
  "comprendio" boolean,
  "notas" text
);

CREATE TABLE "iph_inspeccion_lugar" (
  "iph_id" uuid PRIMARY KEY,
  "inspeccion" boolean,
  "inspeccion_positiva" boolean,
  "preservacion" boolean,
  "priorizacion" boolean,
  "riesgo_tipo" varchar,
  "riesgo_especificar" varchar
);

CREATE TABLE "usuario" (
  "usuario_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "numero_empleado" varchar,
  "nombre" varchar NOT NULL,
  "area_id" int,
  "activo" boolean DEFAULT true
);

CREATE TABLE "auditoria_log" (
  "log_id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "tabla" varchar NOT NULL,
  "registro_id" uuid,
  "evento_id" uuid,
  "operacion" varchar,
  "valores_anteriores" jsonb,
  "valores_nuevos" jsonb,
  "usuario_id" uuid,
  "ocurrido_en" timestamptz DEFAULT (now())
);

CREATE TABLE "cat_tipo_origen" (
  "tipo_origen_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_medio_conocimiento" (
  "medio_conocimiento_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_motivo" (
  "motivo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_componente_evento" (
  "componente_evento_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_area" (
  "area_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_autoridad" (
  "autoridad_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "ambito" varchar,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_rol_agente" (
  "rol_agente_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_sexo" (
  "sexo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_pais" (
  "pais_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_etnia" (
  "etnia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_detencion" (
  "tipo_detencion_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_fuero" (
  "fuero_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_modalidad_delito" (
  "modalidad_delito_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_falta_administrativa" (
  "falta_administrativa_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_nivel_fuerza" (
  "nivel_fuerza_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_unidad_especializada" (
  "unidad_especializada_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_atencion_legal" (
  "atencion_legal_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_atencion_psicologica" (
  "atencion_psicologica_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_atencion_medica" (
  "atencion_medica_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_institucion_resguardo" (
  "institucion_resguardo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_clasificacion_emergencia" (
  "clasificacion_emergencia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_procedencia_hallazgo" (
  "procedencia_hallazgo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_destino_traslado" (
  "destino_traslado_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_clasificacion_arma" (
  "clasificacion_arma_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_arma" (
  "tipo_arma_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_nombre_arma" (
  "nombre_arma_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_calibre" (
  "calibre_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_categoria_sustancia" (
  "categoria_sustancia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_sustancia" (
  "tipo_sustancia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_unidad_presentacion" (
  "unidad_presentacion_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_objeto" (
  "tipo_objeto_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_unidad_medida" (
  "unidad_medida_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_vehiculo" (
  "tipo_vehiculo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_marca_vehiculo" (
  "marca_vehiculo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_color" (
  "color_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_situacion_vehiculo" (
  "situacion_vehiculo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_motivo_aseguramiento_vehiculo" (
  "motivo_aseguramiento_vehiculo_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_lugar_deposito" (
  "lugar_deposito_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_agrupamiento" (
  "agrupamiento_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "padre_id" int,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_colonia" (
  "colonia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "codigo_postal" varchar(5),
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_distrito" (
  "distrito_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "geom" "geometry(MultiPolygon,4326)",
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_cuadrante" (
  "cuadrante_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "geom" "geometry(MultiPolygon,4326)",
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_sector" (
  "sector_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "geom" "geometry(MultiPolygon,4326)",
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_delito" (
  "delito_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "clasificacion" varchar,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_subdelito" (
  "subdelito_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "delito_id" int,
  "activo" boolean DEFAULT true
);

CREATE TABLE "cat_tipo_emergencia" (
  "tipo_emergencia_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "clave" varchar,
  "nombre" varchar NOT NULL,
  "activo" boolean DEFAULT true
);

CREATE INDEX ON "evento" ("fecha_evento");

CREATE INDEX ON "evento" ("estado");

CREATE INDEX ON "evento" ("estado", "area_creadora_id");

CREATE INDEX ON "ubicacion" USING GIST ("geom");

CREATE UNIQUE INDEX ON "agente_involucrado" ("evento_id", "agente_mongo_id");

CREATE INDEX ON "agente_involucrado" ("agente_mongo_id");

CREATE INDEX ON "persona" ("curp");

CREATE UNIQUE INDEX ON "participacion_persona" ("evento_id", "persona_id", "rol");

CREATE INDEX ON "detenido" ("id_siprob");

CREATE INDEX ON "detenido" ("iph_id");

CREATE INDEX ON "iph" ("evento_id");

CREATE INDEX ON "auditoria_log" ("evento_id", "ocurrido_en");

COMMENT ON TABLE "evento" IS 'Se particiona por rango mensual de fecha_evento. Puede nacer solo con origen y fecha (Ruta A) o desde cualquier formulario (Ruta B).';

COMMENT ON COLUMN "evento"."evento_id" IS 'inmutable';

COMMENT ON COLUMN "evento"."folio" IS 'folio operativo; no es llave';

COMMENT ON COLUMN "evento"."folio_ceri" IS 'si el origen es llamada o despacho CERI';

COMMENT ON COLUMN "evento"."narrativa" IS 'general; cada IPH solo agrega la suya si el evento tiene más de uno';

COMMENT ON COLUMN "evento"."evento_canonico_id" IS 'se llena al fusionar: apunta al evento vigente';

COMMENT ON COLUMN "evento"."version" IS 'bloqueo optimista: varias áreas editan el mismo evento';

COMMENT ON COLUMN "evento"."cerrado_por" IS 'plataforma';

COMMENT ON COLUMN "evento"."reabierto_por" IS 'jurídico';

COMMENT ON TABLE "evento_componente_estado" IS 'Distingue "aún no se captura" de "no hubo". El cierre exige que ninguna pieza quede pendiente.';

COMMENT ON TABLE "evento_fusion" IS 'Al fusionar se reasigna el evento_id de todos los registros hijos. Operación auditada.';

COMMENT ON COLUMN "evento_fusion"."evento_origen_id" IS 'el provisional que se anula';

COMMENT ON COLUMN "evento_fusion"."evento_destino_id" IS 'el evento canónico';

COMMENT ON TABLE "evento_preregistro_ceri" IS 'Entrada simplificada desde CERI sin API: importación diaria del Excel.';

COMMENT ON COLUMN "evento_preregistro_ceri"."archivo_origen" IS 'reporte macro de CERI del que proviene';

COMMENT ON COLUMN "evento_preregistro_ceri"."datos_origen" IS 'registro tal como llegó (tipo, subtipo, coordenadas, horas)';

COMMENT ON COLUMN "evento_preregistro_ceri"."evento_id" IS 'se llena al promoverlo';

COMMENT ON COLUMN "evento_preregistro_ceri"."caduca_en" IS 'si nadie agrega una consecuencia, se archiva';

COMMENT ON COLUMN "ubicacion"."colonia_id" IS 'el catálogo PREVALECE sobre la georreferencia';

COMMENT ON COLUMN "ubicacion"."distrito_id" IS 'autollenado por punto en polígono';

COMMENT ON COLUMN "ubicacion"."cuadrante_id" IS 'autollenado';

COMMENT ON COLUMN "ubicacion"."sector_id" IS 'autollenado';

COMMENT ON COLUMN "ubicacion"."geom" IS 'PostGIS';

COMMENT ON COLUMN "ubicacion"."fuente_geocodificacion" IS 'Google, manual…; siempre editable';

COMMENT ON COLUMN "ubicacion"."croquis_path" IS 'imagen estática generada de la coordenada';

COMMENT ON TABLE "v_evento_indicadores" IS 'VISTA, no tabla. Reemplaza los booleanos de derivación del requerimiento: se calculan por existencia de registros hijos.';

COMMENT ON TABLE "mongo_agente" IS 'EXTERNA: colección de la plataforma de gestión digital (MongoDB). Consulta viva; PIMSy no la copia.';

COMMENT ON COLUMN "agente_involucrado"."agente_mongo_id" IS 'nulo si es de otra institución';

COMMENT ON COLUMN "agente_involucrado"."snapshot_en" IS 'se congela al agregar al agente al evento';

COMMENT ON COLUMN "agente_involucrado"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "agente_involucrado"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "agente_involucrado_rol" IS 'Un mismo agente puede tener varios roles en el evento.';

COMMENT ON TABLE "persona" IS 'Persona maestra. El detenido NO es un rol de persona: su identidad vive en SIPROB.';

COMMENT ON COLUMN "persona"."curp" IS 'opcional; riesgo de duplicado asumido para no detenidos';

COMMENT ON COLUMN "persona"."pais_origen_id" IS 'de aquí se deriva extranjero / nacionalidad para IPH y parte';

COMMENT ON TABLE "participacion_persona" IS 'Una persona puede tener varios roles en el mismo evento y roles distintos en eventos distintos.';

COMMENT ON COLUMN "participacion_persona"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "participacion_persona"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "part_victima" IS 'Atributos específicos del rol víctima (hoy en el Parte Informativo).';

COMMENT ON TABLE "atencion_especializada" IS 'Atención en Trabajo Social o unidad de violencia familiar (criterio de inclusión del requerimiento).';

COMMENT ON TABLE "resguardo" IS 'Entidad del evento paralela a aseguramiento. Puede contener personas, vehículos y objetos; nunca armas ni sustancias.';

COMMENT ON COLUMN "resguardo"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "resguardo"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "siprob_detenido" IS 'EXTERNA: vista de solo lectura sobre SIPROB (PostgreSQL). Fuente de verdad del detenido (CURP + huella).';

COMMENT ON COLUMN "siprob_detenido"."rnd" IS 'Registro Nacional de Detenidos';

COMMENT ON TABLE "detencion" IS 'Proceso: agrupa a todos los detenidos del evento y sus consecuencias.';

COMMENT ON COLUMN "detencion"."ubicacion_id" IS 'solo si el lugar de detención difiere del evento';

COMMENT ON COLUMN "detencion"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "detencion"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "detenido" IS 'Entidad propia (no rol de persona). Snapshot mínimo para que las estadísticas no cambien si SIPROB corrige un dato.';

COMMENT ON COLUMN "detenido"."id_siprob" IS 'nulo hasta que barandilla lo registre en SIPROB';

COMMENT ON COLUMN "detenido"."iph_id" IS 'un detenido pertenece a EXACTAMENTE UN IPH; nulo hasta que jurídico lo enrute';

COMMENT ON COLUMN "detenido"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "detenido"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "delito" IS 'Relación opcional con el detenido (decisión propuesta): cubre el presunto delito sin detenido.';

COMMENT ON COLUMN "delito"."evento_id" IS 'obligatorio: existe aunque no haya detenido';

COMMENT ON COLUMN "delito"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "delito"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON COLUMN "falta_administrativa"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "falta_administrativa"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON COLUMN "orden_aprehension"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "orden_aprehension"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "iph" IS 'Un evento puede tener varios IPH (por delito, por falta, por fuero). Nace en borrador y se completa conforme se agregan detenidos y aseguramientos. Un aseguramiento sin detenido genera su propio IPH.';

COMMENT ON COLUMN "iph"."tipo" IS 'nulo mientras es borrador cascarón; lo asigna jurídico';

COMMENT ON COLUMN "iph"."autoridad_destino_id" IS 'MP Federal, MP Estatal, Justicia Cívica…';

COMMENT ON COLUMN "iph"."agente_puesta_id" IS 'rol: realiza la puesta a disposición';

COMMENT ON COLUMN "iph"."narrativa" IS 'solo cuando el evento tiene más de un IPH';

COMMENT ON COLUMN "iph"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "iph"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "parte_informativa" IS 'Número y nombre del elemento ya no se capturan: salen del agente involucrado. Aprovecha la narrativa del evento.';

COMMENT ON COLUMN "parte_informativa"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "parte_informativa"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "uso_fuerza" IS 'Solo existe si se declaró uso de la fuerza. Alimenta el anexo del IPH. (Pendiente: mapear el informe completo.)';

COMMENT ON COLUMN "uso_fuerza"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "uso_fuerza"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "entrega_hechos" IS 'Entidad propia del evento; obliga a parte informativa.';

COMMENT ON COLUMN "entrega_hechos"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "entrega_hechos"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "emergencia" IS '"Atención a emergencia": resultado del evento. No confundir con "llamada de emergencia", que es un tipo de origen.';

COMMENT ON COLUMN "emergencia"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "emergencia"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON TABLE "aseguramiento" IS 'Agrupa los bienes asegurados. Con o sin detenido.';

COMMENT ON COLUMN "aseguramiento"."iph_id" IS 'IPH al que se enruta por autoridad';

COMMENT ON COLUMN "aseguramiento"."aportado_por" IS 'usuario que lo agregó al evento';

COMMENT ON COLUMN "aseguramiento"."area_aporta_id" IS 'área que lo agregó (CERI, policía, barandilla, jurídico, plataforma…)';

COMMENT ON COLUMN "arma"."aseguramiento_id" IS 'siempre aseguramiento';

COMMENT ON COLUMN "arma"."calibre_id" IS 'nulo si es blanca';

COMMENT ON COLUMN "arma"."cantidad" IS 'una fila por arma; el parte obtiene la cantidad por conteo';

COMMENT ON COLUMN "arma"."procedencia_hallazgo_id" IS 'aportación / lugar / persona / vehículo';

COMMENT ON COLUMN "arma"."agente_asegura_id" IS 'rol: asegura el bien';

COMMENT ON COLUMN "sustancia"."aseguramiento_id" IS 'siempre aseguramiento';

COMMENT ON COLUMN "sustancia"."unidad_peso" IS 'gramos o kilogramos';

COMMENT ON COLUMN "sustancia"."cantidad_gramos" IS 'calculado';

COMMENT ON COLUMN "sustancia"."cantidad_kg" IS 'calculado';

COMMENT ON COLUMN "sustancia"."procedencia_hallazgo_id" IS 'aportación / lugar / persona / vehículo';

COMMENT ON COLUMN "sustancia"."agente_asegura_id" IS 'rol: asegura el bien';

COMMENT ON COLUMN "objeto"."aseguramiento_id" IS 'aseguramiento O resguardo (check: uno u otro)';

COMMENT ON COLUMN "objeto"."tipo" IS 'dinero = objeto especial con trato propio';

COMMENT ON COLUMN "objeto"."unidad_medida_id" IS 'pieza, litros, kg, pesos, dólares';

COMMENT ON COLUMN "objeto"."procedencia_hallazgo_id" IS 'aportación / lugar / persona / vehículo';

COMMENT ON COLUMN "objeto"."agente_asegura_id" IS 'rol: asegura el bien';

COMMENT ON COLUMN "vehiculo"."aseguramiento_id" IS 'aseguramiento O resguardo, o ninguno si solo se inspeccionó';

COMMENT ON COLUMN "vehiculo"."procedencia" IS 'nacional / extranjero';

COMMENT ON COLUMN "vehiculo"."uso" IS 'particular / transporte público / carga';

COMMENT ON COLUMN "vehiculo"."procedencia_hallazgo_id" IS 'aportación / lugar / persona / vehículo';

COMMENT ON COLUMN "vehiculo"."agente_asegura_id" IS 'rol: asegura el bien';

COMMENT ON TABLE "testigo_bien" IS 'POR VALIDAR: hasta 2 testigos por bien asegurado. ¿Persona maestra o dato libre?';

COMMENT ON COLUMN "testigo_bien"."bien_id" IS 'arma_id, sustancia_id u objeto_id según bien_tipo (relación polimórfica)';

COMMENT ON COLUMN "testigo_bien"."orden" IS '1 o 2';

COMMENT ON TABLE "pertenencia_detenido" IS 'POR VALIDAR: ¿la captura SIPROB al ingreso a barandilla?';

COMMENT ON TABLE "contacto_familiar_detenido" IS 'POR VALIDAR: probable dato de SIPROB.';

COMMENT ON TABLE "detenido_condicion" IS 'POR VALIDAR: datos sensibles; acceso restringido. Si SIPROB ya los captura, se referencian.';

COMMENT ON TABLE "traslado_detenido" IS 'POR VALIDAR: ruta y medio de traslado.';

COMMENT ON COLUMN "traslado_detenido"."destino_traslado_id" IS 'fiscalía, hospital, otra dependencia';

COMMENT ON TABLE "lectura_derechos_menor" IS 'POR VALIDAR: anexo de lectura de derechos del menor infractor (IPH Delitos).';

COMMENT ON TABLE "iph_inspeccion_lugar" IS 'POR VALIDAR: ¿atributo del IPH o del evento?';

COMMENT ON COLUMN "iph_inspeccion_lugar"."riesgo_tipo" IS 'sociales / naturales';

COMMENT ON TABLE "usuario" IS 'RBAC por área. Plataforma cierra eventos; jurídico los reabre.';

COMMENT ON TABLE "auditoria_log" IS 'Inmutable; poblada por triggers en cada escritura.';

COMMENT ON COLUMN "auditoria_log"."evento_id" IS 'permite reconstruir la historia de un evento';

COMMENT ON COLUMN "auditoria_log"."operacion" IS 'INSERT / UPDATE / FUSION';

COMMENT ON TABLE "cat_tipo_origen" IS 'Cómo nace el evento: llamada de emergencia / despacho CERI, recorrido, patrullaje, operativo (propio o conjunto), diligencia de acompañamiento.';

COMMENT ON TABLE "cat_medio_conocimiento" IS 'Por qué medio se supo del hecho: CERI, comunitario, recorrido, monitoreo, ciudadano. Distinto de tipo_origen.';

COMMENT ON TABLE "cat_motivo" IS 'Motivo de la participación policial. Puede llevar plantilla de datos adicionales.';

COMMENT ON TABLE "cat_componente_evento" IS 'Piezas que un evento puede tener: detención, aseguramiento, resguardo, atención a emergencia, entrega de hechos, atención a víctimas, uso de la fuerza, parte informativa, IPH.';

COMMENT ON TABLE "cat_area" IS 'Áreas con permisos distintos: CERI/origen, policía, coordinación, barandilla, jurídico, plataforma, analista.';

COMMENT ON TABLE "cat_autoridad" IS 'Autoridades receptoras o participantes (MP Federal, MP Estatal, Justicia Cívica…).';

COMMENT ON COLUMN "cat_autoridad"."ambito" IS 'municipal / estatal / federal';

COMMENT ON TABLE "cat_rol_agente" IS 'Rol del agente en el evento (primer respondiente, responsable de turno, realiza la puesta a disposición, asegura el bien…). Configurable.';

COMMENT ON TABLE "cat_fuero" IS 'Federal, común/estatal, justicia cívica local.';

COMMENT ON TABLE "cat_nivel_fuerza" IS 'Escala de uso de la fuerza.';

COMMENT ON TABLE "cat_tipo_arma" IS 'Hoy el IPH solo distingue corta/larga y el parte tiene otra clasificación: unificar.';

COMMENT ON TABLE "cat_categoria_sustancia" IS 'Categoría del IPH: narcótico, hidrocarburo, otro. El dinero NO va aquí: es objeto.';

COMMENT ON TABLE "cat_situacion_vehiculo" IS 'Con reporte de robo, sin reporte, no es posible saberlo.';

COMMENT ON TABLE "cat_agrupamiento" IS 'Estructura jerárquica de agrupamientos.';

COMMENT ON TABLE "cat_colonia" IS 'Prevalece sobre la georreferencia.';

COMMENT ON TABLE "cat_distrito" IS 'Capas ya resueltas por la SSPM.';

COMMENT ON TABLE "cat_delito" IS 'Catálogo homologado a la informática nacional.';

ALTER TABLE "evento" ADD FOREIGN KEY ("tipo_origen_id") REFERENCES "cat_tipo_origen" ("tipo_origen_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("medio_conocimiento_id") REFERENCES "cat_medio_conocimiento" ("medio_conocimiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("motivo_id") REFERENCES "cat_motivo" ("motivo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("ubicacion_id") REFERENCES "ubicacion" ("ubicacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("evento_canonico_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("creado_por") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("area_creadora_id") REFERENCES "cat_area" ("area_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("cerrado_por") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento" ADD FOREIGN KEY ("reabierto_por") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_componente_estado" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_componente_estado" ADD FOREIGN KEY ("componente_id") REFERENCES "cat_componente_evento" ("componente_evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_componente_estado" ADD FOREIGN KEY ("area_responsable_id") REFERENCES "cat_area" ("area_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_agrupamiento" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_agrupamiento" ADD FOREIGN KEY ("agrupamiento_id") REFERENCES "cat_agrupamiento" ("agrupamiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_autoridad" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_autoridad" ADD FOREIGN KEY ("autoridad_id") REFERENCES "cat_autoridad" ("autoridad_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_fusion" ADD FOREIGN KEY ("evento_origen_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_fusion" ADD FOREIGN KEY ("evento_destino_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_fusion" ADD FOREIGN KEY ("fusionado_por") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_preregistro_ceri" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ubicacion" ADD FOREIGN KEY ("colonia_id") REFERENCES "cat_colonia" ("colonia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ubicacion" ADD FOREIGN KEY ("distrito_id") REFERENCES "cat_distrito" ("distrito_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ubicacion" ADD FOREIGN KEY ("cuadrante_id") REFERENCES "cat_cuadrante" ("cuadrante_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ubicacion" ADD FOREIGN KEY ("sector_id") REFERENCES "cat_sector" ("sector_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ubicacion" ADD FOREIGN KEY ("punto_validado_por") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "v_evento_indicadores" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "agente_involucrado" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "agente_involucrado" ADD FOREIGN KEY ("agente_mongo_id") REFERENCES "mongo_agente" ("agente_mongo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "agente_involucrado_rol" ADD FOREIGN KEY ("agente_involucrado_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "agente_involucrado_rol" ADD FOREIGN KEY ("rol_agente_id") REFERENCES "cat_rol_agente" ("rol_agente_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona" ADD FOREIGN KEY ("sexo_id") REFERENCES "cat_sexo" ("sexo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona" ADD FOREIGN KEY ("pais_origen_id") REFERENCES "cat_pais" ("pais_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona" ADD FOREIGN KEY ("etnia_id") REFERENCES "cat_etnia" ("etnia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona" ADD FOREIGN KEY ("domicilio_colonia_id") REFERENCES "cat_colonia" ("colonia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "participacion_persona" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "participacion_persona" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("persona_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_victima" ADD FOREIGN KEY ("participacion_id") REFERENCES "participacion_persona" ("participacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_victima" ADD FOREIGN KEY ("atencion_legal_id") REFERENCES "cat_atencion_legal" ("atencion_legal_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_victima" ADD FOREIGN KEY ("atencion_psicologica_id") REFERENCES "cat_atencion_psicologica" ("atencion_psicologica_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_victima" ADD FOREIGN KEY ("atencion_medica_id") REFERENCES "cat_atencion_medica" ("atencion_medica_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_resguardada" ADD FOREIGN KEY ("participacion_id") REFERENCES "participacion_persona" ("participacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "part_resguardada" ADD FOREIGN KEY ("resguardo_id") REFERENCES "resguardo" ("resguardo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "atencion_especializada" ADD FOREIGN KEY ("participacion_id") REFERENCES "participacion_persona" ("participacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "atencion_especializada" ADD FOREIGN KEY ("unidad_especializada_id") REFERENCES "cat_unidad_especializada" ("unidad_especializada_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resguardo" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resguardo" ADD FOREIGN KEY ("institucion_resguardo_id") REFERENCES "cat_institucion_resguardo" ("institucion_resguardo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detencion" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detencion" ADD FOREIGN KEY ("tipo_detencion_id") REFERENCES "cat_tipo_detencion" ("tipo_detencion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detencion" ADD FOREIGN KEY ("ubicacion_id") REFERENCES "ubicacion" ("ubicacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detenido" ADD FOREIGN KEY ("detencion_id") REFERENCES "detencion" ("detencion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detenido" ADD FOREIGN KEY ("id_siprob") REFERENCES "siprob_detenido" ("id_siprob") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detenido" ADD FOREIGN KEY ("iph_id") REFERENCES "iph" ("iph_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("participacion_victima_id") REFERENCES "participacion_persona" ("participacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("cat_delito_id") REFERENCES "cat_delito" ("delito_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("cat_subdelito_id") REFERENCES "cat_subdelito" ("subdelito_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("fuero_id") REFERENCES "cat_fuero" ("fuero_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "delito" ADD FOREIGN KEY ("modalidad_id") REFERENCES "cat_modalidad_delito" ("modalidad_delito_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "falta_administrativa" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "falta_administrativa" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "falta_administrativa" ADD FOREIGN KEY ("cat_falta_id") REFERENCES "cat_falta_administrativa" ("falta_administrativa_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orden_aprehension" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orden_aprehension" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orden_aprehension" ADD FOREIGN KEY ("autoridad_emisora_id") REFERENCES "cat_autoridad" ("autoridad_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "iph" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "iph" ADD FOREIGN KEY ("fuero_id") REFERENCES "cat_fuero" ("fuero_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "iph" ADD FOREIGN KEY ("autoridad_destino_id") REFERENCES "cat_autoridad" ("autoridad_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "iph" ADD FOREIGN KEY ("agente_puesta_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "parte_informativa" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "parte_informativa" ADD FOREIGN KEY ("iph_id") REFERENCES "iph" ("iph_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "parte_informativa" ADD FOREIGN KEY ("agente_capturista_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza" ADD FOREIGN KEY ("nivel_fuerza_id") REFERENCES "cat_nivel_fuerza" ("nivel_fuerza_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza_agente" ADD FOREIGN KEY ("uso_fuerza_id") REFERENCES "uso_fuerza" ("uso_fuerza_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza_agente" ADD FOREIGN KEY ("agente_involucrado_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza_detenido" ADD FOREIGN KEY ("uso_fuerza_id") REFERENCES "uso_fuerza" ("uso_fuerza_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "uso_fuerza_detenido" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "entrega_hechos" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "entrega_hechos" ADD FOREIGN KEY ("autoridad_id") REFERENCES "cat_autoridad" ("autoridad_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "emergencia" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "emergencia" ADD FOREIGN KEY ("clasificacion_id") REFERENCES "cat_clasificacion_emergencia" ("clasificacion_emergencia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "emergencia" ADD FOREIGN KEY ("tipo_emergencia_id") REFERENCES "cat_tipo_emergencia" ("tipo_emergencia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "aseguramiento" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "aseguramiento" ADD FOREIGN KEY ("iph_id") REFERENCES "iph" ("iph_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("aseguramiento_id") REFERENCES "aseguramiento" ("aseguramiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("clasificacion_arma_id") REFERENCES "cat_clasificacion_arma" ("clasificacion_arma_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("tipo_arma_id") REFERENCES "cat_tipo_arma" ("tipo_arma_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("nombre_arma_id") REFERENCES "cat_nombre_arma" ("nombre_arma_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("calibre_id") REFERENCES "cat_calibre" ("calibre_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("procedencia_hallazgo_id") REFERENCES "cat_procedencia_hallazgo" ("procedencia_hallazgo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "arma" ADD FOREIGN KEY ("agente_asegura_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("aseguramiento_id") REFERENCES "aseguramiento" ("aseguramiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("categoria_sustancia_id") REFERENCES "cat_categoria_sustancia" ("categoria_sustancia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("tipo_sustancia_id") REFERENCES "cat_tipo_sustancia" ("tipo_sustancia_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("unidad_presentacion_id") REFERENCES "cat_unidad_presentacion" ("unidad_presentacion_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("procedencia_hallazgo_id") REFERENCES "cat_procedencia_hallazgo" ("procedencia_hallazgo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sustancia" ADD FOREIGN KEY ("agente_asegura_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("aseguramiento_id") REFERENCES "aseguramiento" ("aseguramiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("resguardo_id") REFERENCES "resguardo" ("resguardo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("tipo_objeto_id") REFERENCES "cat_tipo_objeto" ("tipo_objeto_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("unidad_medida_id") REFERENCES "cat_unidad_medida" ("unidad_medida_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("procedencia_hallazgo_id") REFERENCES "cat_procedencia_hallazgo" ("procedencia_hallazgo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "objeto" ADD FOREIGN KEY ("agente_asegura_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("aseguramiento_id") REFERENCES "aseguramiento" ("aseguramiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("resguardo_id") REFERENCES "resguardo" ("resguardo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("tipo_vehiculo_id") REFERENCES "cat_tipo_vehiculo" ("tipo_vehiculo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("marca_id") REFERENCES "cat_marca_vehiculo" ("marca_vehiculo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("color_id") REFERENCES "cat_color" ("color_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("situacion_id") REFERENCES "cat_situacion_vehiculo" ("situacion_vehiculo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("motivo_aseguramiento_id") REFERENCES "cat_motivo_aseguramiento_vehiculo" ("motivo_aseguramiento_vehiculo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("lugar_deposito_id") REFERENCES "cat_lugar_deposito" ("lugar_deposito_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("procedencia_hallazgo_id") REFERENCES "cat_procedencia_hallazgo" ("procedencia_hallazgo_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vehiculo" ADD FOREIGN KEY ("agente_asegura_id") REFERENCES "agente_involucrado" ("agente_involucrado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "pertenencia_detenido" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "contacto_familiar_detenido" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detenido_condicion" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "traslado_detenido" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "traslado_detenido" ADD FOREIGN KEY ("destino_traslado_id") REFERENCES "cat_destino_traslado" ("destino_traslado_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "lectura_derechos_menor" ADD FOREIGN KEY ("detenido_id") REFERENCES "detenido" ("detenido_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "iph_inspeccion_lugar" ADD FOREIGN KEY ("iph_id") REFERENCES "iph" ("iph_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "usuario" ADD FOREIGN KEY ("area_id") REFERENCES "cat_area" ("area_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria_log" ADD FOREIGN KEY ("evento_id") REFERENCES "evento" ("evento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria_log" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cat_agrupamiento" ADD FOREIGN KEY ("padre_id") REFERENCES "cat_agrupamiento" ("agrupamiento_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cat_subdelito" ADD FOREIGN KEY ("delito_id") REFERENCES "cat_delito" ("delito_id") DEFERRABLE INITIALLY IMMEDIATE;
