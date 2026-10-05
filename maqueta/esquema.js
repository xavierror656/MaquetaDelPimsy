/* =====================================================================
   Esquema de formularios de la maqueta PIMSy.
   Cada entidad sale de una tabla de 03-modelo-datos/PIMSy_DB.dbml (v0.2).
   Tipos de campo: text (por defecto), textarea, number, date, time, datetime-local,
   select, lista (con búsqueda), bool (Sí/No), multi (varias casillas), checkbox, calc (solo lectura).
   Atributos: r obligatorio · show(v,e) condición · o catálogo (nombre de CAT, arreglo o función(e))
              pv Q-xx POR VALIDAR · act permiso propio del campo · ayuda texto breve.
   ===================================================================== */
const F=(k,l,x={})=>({k,l,...x});
const SEC=(sec,x={})=>({sec,...x});
const BO=(k,l,x={})=>F(k,l,{t:'bool',...x});
const SI=v=>v==='Sí';

/* ---- opciones dinámicas que dependen del evento ---- */
const hs=(e,c,ent)=>e.comp[c].hijos.filter(h=>h.ent===ent);
const nomDet=h=>[h.d.nombre_snap,h.d.apellido_paterno_snap,h.d.apellido_materno_snap].filter(Boolean).join(' ')||'Detenido sin nombre';
const nomPer=h=>[h.d.nombre,h.d.apellido_paterno,h.d.apellido_materno].filter(Boolean).join(' ')||'Persona sin nombre';
const nomAg=a=>[a.nombre,a.apellido_paterno,a.apellido_materno].filter(Boolean).join(' ')||'Agente';
const oDet=e=>hs(e,'detencion','detenido').map(h=>({v:h.id,l:nomDet(h)}));
const oVic=e=>hs(e,'victimas','participante').filter(h=>h.d.rol==='Víctima').map(h=>({v:h.id,l:nomPer(h)}));
const oPart=e=>hs(e,'victimas','participante').map(h=>({v:h.id,l:nomPer(h)+' ('+h.d.rol+')'}));
const oIph=e=>hs(e,'iph','iph').map(h=>({v:h.id,l:'IPH '+h.id.slice(0,8)+(h.d.tipo?' · '+h.d.tipo:'')}));
const oAseg=e=>hs(e,'aseguramiento','aseguramiento').map((h,i)=>({v:h.id,l:'Aseguramiento '+(i+1)+(h.d.descripcion?' · '+h.d.descripcion.slice(0,30):'')}));
const oResg=e=>hs(e,'resguardo','resguardo').map((h,i)=>({v:h.id,l:'Resguardo '+(i+1)+' · '+(h.d.tipo||'')}));
const oAg=e=>e.agentes.map(a=>({v:a.id,l:nomAg(a)+(a.roles&&a.roles.length?' ('+a.roles.join(', ')+')':'')}));
const oBienes=e=>['arma','sustancia','objeto','vehiculo'].flatMap(t=>hs(e,'aseguramiento',t).map(h=>({v:h.id,l:t+': '+(h.d.descripcion||h.d.nombre_arma||h.d.objeto_especifique||h.d.placas||h.id.slice(0,6))})));

/* ---- bloques reutilizables ---- */
const DONDE=[
  SEC('Hallazgo y quién lo aseguró'),
  F('procedencia_hallazgo','Procedencia del hallazgo',{t:'select',o:'procedencia_hallazgo'}),
  F('ubicacion_hallazgo','Ubicación del hallazgo'),
  F('agente_asegura','Agente que asegura el bien',{t:'select',o:oAg,ayuda:'Rol «asegura el bien».'}),
  F('destino','Destino / observaciones')];
const UBIC=pre=>[
  F(pre+'calle','Calle'),F(pre+'cruce_1','Cruce 1'),F(pre+'cruce_2','Cruce 2'),
  F(pre+'numero_exterior','Número exterior'),F(pre+'numero_interior','Número interior'),
  F(pre+'colonia','Colonia (catálogo)',{t:'lista',o:'colonia',auto:{[pre+'codigo_postal']:v=>CP_COLONIA[v]},ayuda:'El catálogo prevalece sobre la geolocalización.'}),
  F(pre+'codigo_postal','Código postal',{val:v=>/^\d{5}$/.test(v)?undefined:'5 dígitos'}),
  F(pre+'referencia','Referencia',{t:'textarea'})];
const PERSONA=[
  SEC('Datos de la persona'),
  F('nombre','Nombre',{r:1}),F('apellido_paterno','Apellido paterno'),F('apellido_materno','Apellido materno'),
  F('fecha_nacimiento','Fecha de nacimiento',{t:'date'}),F('sexo','Sexo',{t:'select',o:'sexo'}),
  F('curp','CURP (opcional)',{val:v=>v.length===18?undefined:'La CURP tiene 18 caracteres'}),
  F('telefono','Teléfono',{pv:'Q-33'}),F('ocupacion','Ocupación'),
  F('pais_origen','País de origen',{t:'select',o:'pais'}),F('estado_origen','Estado de origen'),F('ciudad_origen','Ciudad de origen'),
  F('etnia','Etnia',{t:'select',o:'etnia'}),F('etnia_otro','Etnia (otra)',{show:v=>v.etnia==='Otra'}),
  SEC('Domicilio',{pv:'Q-33'}),
  F('domicilio_calle','Calle'),F('domicilio_numero_exterior','Número exterior'),F('domicilio_numero_interior','Número interior'),
  F('domicilio_colonia','Colonia',{t:'lista',o:'colonia',auto:{domicilio_codigo_postal:v=>CP_COLONIA[v]}}),
  F('domicilio_codigo_postal','Código postal',{val:v=>/^\d{5}$/.test(v)?undefined:'5 dígitos'})];

/* ---- datos del evento (tabla evento + ubicacion + agrupamiento + autoridad) ---- */
const EVENTO=[
  SEC('Origen del evento'),
  F('denominacion','Denominación del evento'),
  F('tipo_origen','Tipo de origen',{t:'select',o:'tipo_origen',r:1,ayuda:'Cómo nace el evento.'}),
  F('medio_conocimiento','Medio de conocimiento',{t:'select',o:'medio_conocimiento',ayuda:'Por qué medio se supo del hecho.'}),
  F('folio_ceri','Folio CERI (único)',{val:v=>/^\d+$/.test(v)?undefined:'Solo dígitos'}),
  F('motivo','Motivo de la participación policial',{t:'lista',o:'motivo'}),
  F('clasificacion','Clasificación de la intervención',{t:'select',o:'clasif_intervencion',pv:'Q-26',ayuda:'Podría derivarse de lo agregado.'}),
  SEC('Cuándo'),
  F('fecha_evento','Fecha del evento',{t:'date',r:1,val:v=>new Date(v)>new Date()?'La fecha no puede ser futura':undefined}),
  F('hora_evento','Hora del evento',{t:'time'}),
  F('fecha_hora_conocimiento','Fecha y hora de conocimiento',{t:'datetime-local',pv:'Q-22'}),
  F('fecha_hora_arribo','Fecha y hora de arribo',{t:'datetime-local',pv:'Q-22'}),
  SEC('Dónde'),
  ...UBIC(''),
  F('municipio','Municipio'),F('entidad','Entidad'),
  F('distrito','Distrito (catálogo)',{t:'select',o:'distrito',ayuda:'En producción se autollena por punto en polígono.'}),
  F('cuadrante','Cuadrante',{t:'select',o:'cuadrante'}),
  F('sector','Sector',{t:'lista',o:'sector'}),
  F('latitud','Latitud',{t:'number',val:v=>Math.abs(+v)<=90?undefined:'Entre -90 y 90'}),
  F('longitud','Longitud',{t:'number',val:v=>Math.abs(+v)<=180?undefined:'Entre -180 y 180'}),
  F('fuente_geocodificacion','Fuente de la ubicación',{t:'select',o:'fuente_geo',ayuda:'Siempre editable a mano.'}),
  BO('punto_validado','El punto fue validado por el usuario'),
  F('croquis','Croquis',{t:'calc',fn:()=>'Se genera de la coordenada. Dónde se guarda: POR VALIDAR(Q-31).',pv:'Q-31'}),
  SEC('Quién participó'),
  F('agrupamientos','Agrupamientos que atienden',{t:'multi',o:'agrupamiento',pv:'Q-27'}),
  F('autoridades','Autoridades participantes',{t:'multi',o:'autoridad',pv:'Q-27'}),
  F('rol_autoridades','Rol de participación de las autoridades',{ayuda:'Ej. «apoyo», «coadyuvante».'})];

/* ---- agente involucrado (se congela un snapshot al agregarlo) ---- */
const AGENTE=[
  BO('es_externo','El agente es de otra institución',{pv:'Q-20'}),
  F('agente_mongo','Agente (consulta viva a MongoDB)',{t:'select',o:()=>Object.keys(AGENTES_MONGO).map(k=>({v:k,l:k+' · '+AGENTES_MONGO[k].nombre+' '+AGENTES_MONGO[k].ap})),show:v=>!SI(v.es_externo),r:1}),
  F('vista_snap','Datos que se congelarán',{t:'calc',show:v=>!SI(v.es_externo),fn:v=>{const a=AGENTES_MONGO[v.agente_mongo];return a?`${a.nombre} ${a.ap} ${a.am} · ${a.puesto} · ${a.area}/${a.subarea} · distrito ${a.distrito} · unidad ${a.unidad}`:'Elige un agente.'}}),
  F('institucion_externa','Institución',{show:v=>SI(v.es_externo),r:1}),
  F('nombre','Nombre',{show:v=>SI(v.es_externo),r:1}),F('apellido_paterno','Apellido paterno',{show:v=>SI(v.es_externo)}),F('apellido_materno','Apellido materno',{show:v=>SI(v.es_externo)}),
  F('puesto','Puesto',{show:v=>SI(v.es_externo)}),F('numero_empleado','Número de empleado / placa',{show:v=>SI(v.es_externo)}),
  F('roles','Roles en el evento',{t:'multi',o:'rol_agente',pv:'Q-08',ayuda:'Un agente puede tener varios roles.'})];

/* ---- entidades hijas del evento ---- */
const ENT={
 detencion:{n:'Detención (proceso)',comp:'detencion',act:'detencion',fields:e=>[
   F('fecha_hora','Fecha y hora de la detención',{t:'datetime-local'}),
   F('tipo_detencion','Tipo de detención',{t:'select',o:'tipo_detencion'}),
   BO('lugar_distinto','El lugar de detención es distinto al del evento'),
   ...UBIC('lugar_').map(f=>({...f,show:v=>SI(v.lugar_distinto)})),
   F('observaciones','Observaciones',{t:'textarea'})],
   res:d=>[d.fecha_hora&&d.fecha_hora.replace('T',' '),d.tipo_detencion].filter(Boolean).join(' · ')||'Detención sin datos'},
 detenido:{n:'Detenido',comp:'detencion',act:'detencion',iph:true,fields:e=>[
   SEC('Identidad (vive en SIPROB; aquí solo el snapshot mínimo)'),
   F('id_siprob','ID SIPROB',{pv:'Q-09',ayuda:'Vacío hasta que barandilla lo registre en SIPROB.'}),
   F('rnd_snap','RND (Registro Nacional de Detenidos)'),
   F('nombre_snap','Nombre',{r:1}),F('apellido_paterno_snap','Apellido paterno'),F('apellido_materno_snap','Apellido materno'),
   F('fecha_nacimiento_snap','Fecha de nacimiento',{t:'date'}),F('sexo_snap','Sexo',{t:'select',o:'sexo'}),
   F('pais_origen_snap','País de origen',{t:'select',o:'pais'}),
   F('edad_al_momento_evento','Edad al momento del evento',{t:'number',val:v=>+v>=0&&+v<=120?undefined:'Edad no válida'}),
   BO('lectura_derechos','Se le leyeron sus derechos')],
   res:d=>`${nomDet({d})} · ${d.sexo_snap||'sexo s/d'}${d.edad_al_momento_evento?' · '+d.edad_al_momento_evento+' años':''}`},
 delito:{n:'Delito',comp:'detencion',act:'detencion',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,pv:'Q-12',ayuda:'Puede quedar vacío (presunto delito sin detenido): se decide en Q-12.'}),
   F('victima','Víctima asociada',{t:'select',o:oVic}),
   F('cat_delito','Delito',{t:'select',o:'delito'}),F('cat_subdelito','Subdelito',{t:'select',o:'subdelito'}),
   F('delito_especifique','Especifique el delito'),F('consecutivo','Consecutivo',{t:'number'}),
   F('fuero','Fuero',{t:'select',o:'fuero'}),BO('hubo_violencia','Hubo violencia'),F('modalidad','Modalidad',{t:'select',o:'modalidad_delito'})],
   res:d=>[d.cat_delito,d.cat_subdelito,d.delito_especifique].filter(Boolean).join(' · ')||'Delito sin datos'},
 falta:{n:'Falta administrativa',comp:'detencion',act:'detencion',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet}),F('cat_falta','Falta',{t:'select',o:'falta_administrativa'}),
   F('fraccion','Fracción'),F('descripcion','Descripción',{t:'textarea'})],
   res:d=>[d.cat_falta,d.fraccion&&'fracción '+d.fraccion].filter(Boolean).join(' · ')||'Falta sin datos'},
 orden:{n:'Orden de aprehensión',comp:'detencion',act:'detencion',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('mandamiento_judicial','Mandamiento judicial'),
   F('autoridad_emisora','Autoridad emisora',{t:'select',o:'autoridad'}),F('delito_orden','Delito de la orden'),BO('vigente','Vigente')],
   res:d=>`Mandamiento ${d.mandamiento_judicial||'s/n'}${d.vigente?' · vigente: '+d.vigente:''}`},
 pertenencia:{n:'Pertenencia del detenido',comp:'detencion',act:'detencion',pv:'Q-11',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('nombre','Nombre de la pertenencia'),F('descripcion','Descripción',{t:'textarea'}),F('destino','Destino')],
   res:d=>`${d.nombre||'Pertenencia'} → ${d.destino||'destino s/d'}`},
 contacto:{n:'Familiar de contacto del detenido',comp:'detencion',act:'detencion',pv:'Q-11',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('nombre','Nombre'),F('apellido_paterno','Apellido paterno'),F('apellido_materno','Apellido materno'),F('telefono','Teléfono')],
   res:d=>[d.nombre,d.apellido_paterno,d.apellido_materno].filter(Boolean).join(' ')||'Contacto'},
 condicion:{n:'Condición del detenido (acceso restringido)',comp:'detencion',act:'detencion',pv:'Q-11',restr:true,fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('descripcion_fisica','Descripción física',{t:'textarea'}),
   BO('lesiones','Presenta lesiones'),BO('padecimiento','Tiene algún padecimiento'),F('tipo_padecimiento','¿Cuál?',{show:v=>SI(v.padecimiento)}),
   BO('grupo_vulnerable','Pertenece a un grupo vulnerable'),F('cual_grupo_vulnerable','¿Cuál?',{show:v=>SI(v.grupo_vulnerable)}),
   BO('grupo_delictivo','Pertenece a un grupo delictivo'),F('cual_grupo_delictivo','¿Cuál?',{show:v=>SI(v.grupo_delictivo)}),
   BO('atencion_medica','Se le brindó atención médica'),F('lugar_atencion_medica','Lugar de la atención',{show:v=>SI(v.atencion_medica)})],
   res:d=>`Lesiones: ${d.lesiones||'s/d'} · padecimiento: ${d.padecimiento||'s/d'}`},
 traslado:{n:'Traslado del detenido',comp:'detencion',act:'detencion',pv:'Q-11',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('destino_traslado','Destino del traslado',{t:'select',o:'destino_traslado'}),
   F('dependencia_otra','Dependencia',{show:v=>v.destino_traslado==='Otra dependencia'}),F('observaciones','Observaciones / ruta',{t:'textarea'})],
   res:d=>`Traslado a ${d.destino_traslado||'destino s/d'}`},
 lectura_menor:{n:'Lectura de derechos del menor infractor',comp:'detencion',act:'detencion',pv:'Q-11',fields:e=>[
   F('detenido','Detenido',{t:'select',o:oDet,r:1}),F('dependencia','Dependencia'),F('entidad','Entidad'),F('ciudad','Ciudad'),F('lugar','Lugar'),
   F('fecha_hora','Fecha y hora',{t:'datetime-local'}),BO('comprendio','El menor comprendió sus derechos'),F('notas','Notas',{t:'textarea'})],
   res:d=>`${d.lugar||'Lugar s/d'} · comprendió: ${d.comprendio||'s/d'}`},

 aseguramiento:{n:'Aseguramiento (agrupa los bienes)',comp:'aseguramiento',act:'bienes',iph:true,fields:e=>[
   F('descripcion','Descripción general del aseguramiento',{t:'textarea'})],
   res:d=>d.descripcion||'Aseguramiento'},
 arma:{n:'Arma',comp:'aseguramiento',act:'bienes',fields:e=>[
   F('aseguramiento','Aseguramiento al que pertenece',{t:'select',o:oAseg,r:1,ayuda:'Las armas siempre van por aseguramiento. Si no hay, primero crea el aseguramiento.'}),
   F('subtipo','Subtipo',{t:'select',o:'subtipo_arma',r:1}),
   F('clasificacion_arma','Clasificación',{t:'select',o:'clasificacion_arma',pv:'Q-16'}),F('tipo_arma','Tipo',{t:'select',o:'tipo_arma',pv:'Q-16'}),
   F('nombre_arma','Nombre del arma',{t:'select',o:'nombre_arma',pv:'Q-16'}),
   F('calibre','Calibre',{t:'select',o:'calibre',show:v=>v.subtipo!=='Blanca'}),
   F('matricula','Matrícula'),F('serie','Serie'),F('color','Color'),F('cantidad','Cantidad',{t:'number',val:v=>+v>=1?undefined:'Mínimo 1'}),
   F('descripcion','Descripción / observaciones',{t:'textarea'}),...DONDE],
   res:d=>[d.subtipo,d.nombre_arma,d.calibre,d.serie&&'serie '+d.serie].filter(Boolean).join(' · ')||'Arma'},
 sustancia:{n:'Sustancia',comp:'aseguramiento',act:'bienes',fields:e=>[
   F('aseguramiento','Aseguramiento al que pertenece',{t:'select',o:oAseg,r:1,ayuda:'Las sustancias siempre van por aseguramiento.'}),
   F('categoria_sustancia','Categoría',{t:'select',o:'categoria_sustancia',pv:'Q-16'}),F('tipo_sustancia','Tipo',{t:'select',o:'tipo_sustancia',pv:'Q-16'}),
   F('sustancia_especifique','Especifique'),
   F('unidad_peso','Unidad de peso',{t:'select',o:'unidad_peso'}),F('cantidad_peso','Cantidad en esa unidad',{t:'number'}),
   F('unidad_presentacion','Unidad de presentación',{t:'select',o:'unidad_presentacion'}),F('cantidad_presentacion','Cantidad de presentación',{t:'number'}),
   F('calculado','Equivalencia calculada',{t:'calc',fn:v=>{const c=+v.cantidad_peso;if(!c)return 'Se calcula al capturar el peso.';const g=v.unidad_peso==='Kilogramos'?c*1000:c;return `${g} g · ${g/1000} kg`}}),
   F('descripcion','Descripción',{t:'textarea'}),...DONDE],
   res:d=>[d.categoria_sustancia,d.tipo_sustancia,d.cantidad_peso&&d.cantidad_peso+' '+(d.unidad_peso||'')].filter(Boolean).join(' · ')||'Sustancia'},
 objeto:{n:'Objeto (incluye dinero)',comp:'aseguramiento',act:'bienes',fields:e=>[
   F('pertenece_a','¿Por dónde entra?',{t:'select',o:['Aseguramiento','Resguardo'],r:1,ayuda:'Un objeto va por aseguramiento O por resguardo, nunca ambos.'}),
   F('aseguramiento','Aseguramiento',{t:'select',o:oAseg,r:1,show:v=>v.pertenece_a==='Aseguramiento'}),
   F('resguardo','Resguardo',{t:'select',o:oResg,r:1,show:v=>v.pertenece_a==='Resguardo'}),
   F('tipo','Tipo',{t:'select',o:['Dinero','Otro'],r:1,pv:'Q-15',ayuda:'El dinero es un objeto especial, no una sustancia.'}),
   F('tipo_objeto','Tipo de objeto',{t:'select',o:'tipo_objeto',show:v=>v.tipo!=='Dinero'}),F('objeto_especifique','Especifique'),
   F('cantidad','Cantidad',{t:'number'}),F('unidad_medida','Unidad de medida',{t:'select',o:'unidad_medida'}),
   F('descripcion','Descripción',{t:'textarea'}),...DONDE],
   res:d=>[d.tipo,d.tipo_objeto,d.objeto_especifique,d.cantidad&&d.cantidad+' '+(d.unidad_medida||'')].filter(Boolean).join(' · ')||'Objeto'},
 vehiculo:{n:'Vehículo',comp:'aseguramiento',act:'bienes',fields:e=>[
   F('pertenece_a','¿Por dónde entra?',{t:'select',o:['Aseguramiento','Resguardo','Ninguno (solo inspección)'],r:1,pv:'Q-19',ayuda:'Aseguramiento o resguardo, o ninguno si solo se inspeccionó.'}),
   F('aseguramiento','Aseguramiento',{t:'select',o:oAseg,r:1,show:v=>v.pertenece_a==='Aseguramiento'}),
   F('resguardo','Resguardo',{t:'select',o:oResg,r:1,show:v=>v.pertenece_a==='Resguardo'}),
   BO('inspeccionado','Fue inspeccionado'),F('fecha_hora_inspeccion','Fecha y hora de la inspección',{t:'datetime-local',show:v=>SI(v.inspeccionado)}),
   F('tipo_vehiculo','Tipo de vehículo',{t:'select',o:'tipo_vehiculo'}),F('procedencia','Procedencia',{t:'select',o:'procedencia_vehiculo'}),F('uso','Uso',{t:'select',o:'uso_vehiculo'}),
   F('marca','Marca',{t:'select',o:'marca_vehiculo'}),F('submarca','Submarca'),F('modelo','Modelo'),F('color','Color',{t:'select',o:'color'}),
   F('placas','Placas'),F('entidad_emplacado','Entidad de emplacado'),F('num_serie','Número de serie'),
   F('situacion','Situación',{t:'select',o:'situacion_vehiculo'}),
   F('motivo_aseguramiento','Motivo del aseguramiento',{t:'select',o:'motivo_aseguramiento_vehiculo',show:v=>v.pertenece_a==='Aseguramiento'}),
   F('lugar_deposito','Lugar de depósito',{t:'select',o:'lugar_deposito'}),
   F('descripcion','Descripción / observaciones de la inspección',{t:'textarea'}),
   F('procedencia_hallazgo','Procedencia del hallazgo',{t:'select',o:'procedencia_hallazgo'}),F('ubicacion_hallazgo','Ubicación del hallazgo'),
   F('agente_asegura','Agente que asegura el bien',{t:'select',o:oAg})],
   res:d=>[d.tipo_vehiculo,d.marca,d.submarca,d.modelo,d.placas&&'placas '+d.placas,d.pertenece_a].filter(Boolean).join(' · ')||'Vehículo'},
 testigo:{n:'Testigo de un bien asegurado',comp:'aseguramiento',act:'bienes',pv:'Q-17',fields:e=>[
   F('bien','Bien asegurado',{t:'select',o:oBienes,r:1}),F('orden','Testigo número',{t:'select',o:['1','2'],r:1,ayuda:'Hasta 2 por bien.'}),
   F('nombre','Nombre'),F('apellido_paterno','Apellido paterno'),F('apellido_materno','Apellido materno')],
   res:d=>[d.nombre,d.apellido_paterno,d.apellido_materno].filter(Boolean).join(' ')||'Testigo'},

 resguardo:{n:'Resguardo',comp:'resguardo',act:'otros',fields:e=>[
   F('tipo','Tipo de resguardo',{t:'select',o:'tipo_resguardo',r:1,ayuda:'Nunca armas ni sustancias.'}),F('motivo','Motivo',{t:'textarea'}),
   F('institucion_resguardo','Institución de resguardo',{t:'select',o:'institucion_resguardo'}),
   F('institucion_otra','Otra institución',{show:v=>v.institucion_resguardo==='Otra'}),
   F('fecha_inicio','Inicio',{t:'datetime-local'}),F('fecha_fin','Fin',{t:'datetime-local'})],
   res:d=>`${d.tipo||'Resguardo'}${d.institucion_resguardo?' · '+d.institucion_resguardo:''}`},
 persona_resguardada:{n:'Persona resguardada',comp:'resguardo',act:'otros',fields:e=>[
   F('resguardo','Resguardo',{t:'select',o:oResg,r:1}),F('edad_al_momento_evento','Edad al momento del evento',{t:'number'}),...PERSONA],
   res:d=>nomPer({d})},

 participante:{n:'Persona (víctima, quejoso, denunciante, ofendido)',comp:'victimas',act:'otros',fields:e=>[
   SEC('Participación en el evento'),
   F('rol','Rol',{t:'select',o:'rol_persona',r:1}),F('edad_al_momento_evento','Edad al momento del evento',{t:'number'}),
   ...PERSONA,
   SEC('Atención a la víctima',{show:v=>v.rol==='Víctima'}),
   ...[BO('requirio_canalizacion','Requirió canalización'),
   F('atencion_legal','Atención legal',{t:'select',o:'atencion_legal'}),F('atencion_legal_otro','Atención legal (otra)',{show:v=>v.atencion_legal==='Otro'}),
   F('atencion_psicologica','Atención psicológica',{t:'select',o:'atencion_psicologica'}),
   F('atencion_medica','Atención médica',{t:'select',o:'atencion_medica'}),F('atencion_medica_otro','Atención médica (otra)',{show:v=>v.atencion_medica==='Otro'})].map(f=>({...f,show:f.show?(v=>v.rol==='Víctima'&&f.show(v)):(v=>v.rol==='Víctima')}))],
   res:d=>`${nomPer({d})} · ${d.rol}${d.edad_al_momento_evento?' · '+d.edad_al_momento_evento+' años':''}`},
 atencion_esp:{n:'Atención especializada',comp:'victimas',act:'otros',fields:e=>[
   F('participante','Persona atendida',{t:'select',o:oPart,r:1}),F('unidad_especializada','Unidad especializada',{t:'select',o:'unidad_especializada'}),
   F('fecha_hora','Fecha y hora',{t:'datetime-local'}),F('observaciones','Observaciones',{t:'textarea'})],
   res:d=>`${d.unidad_especializada||'Atención'} · ${d.fecha_hora?d.fecha_hora.replace('T',' '):'sin fecha'}`},

 emergencia:{n:'Atención a emergencia',comp:'emergencia',act:'otros',fields:e=>[
   F('clasificacion','Clasificación',{t:'select',o:'clasificacion_emergencia'}),F('tipo_emergencia','Tipo de emergencia',{t:'select',o:'tipo_emergencia'}),
   F('subtipo','Subtipo'),F('descripcion','Descripción',{t:'textarea'})],
   res:d=>[d.clasificacion,d.tipo_emergencia,d.subtipo].filter(Boolean).join(' · ')||'Emergencia'},
 entrega:{n:'Entrega de hechos',comp:'entrega',act:'otros',fields:e=>[
   F('autoridad','Autoridad que recibe',{t:'select',o:'autoridad'}),F('fecha_hora','Fecha y hora',{t:'datetime-local'}),F('descripcion','Descripción',{t:'textarea'})],
   res:d=>`${d.autoridad||'Autoridad s/d'} · ${d.fecha_hora?d.fecha_hora.replace('T',' '):'sin fecha'}`},
 fuerza:{n:'Uso de la fuerza (mínimo)',comp:'fuerza',act:'fuerza',fields:e=>[
   F('nivel_fuerza','Nivel de fuerza',{t:'select',o:'nivel_fuerza'}),F('descripcion','Declaración de uso de la fuerza',{t:'textarea'}),
   BO('asistencia_medica','Hubo asistencia médica'),F('descripcion_asistencia_medica','Descripción de la asistencia',{t:'textarea',show:v=>SI(v.asistencia_medica)}),
   F('lesionados_autoridad','Lesionados (autoridad)',{t:'number'}),F('lesionados_personas','Lesionados (personas)',{t:'number'}),
   F('fallecidos_autoridad','Fallecidos (autoridad)',{t:'number'}),F('fallecidos_personas','Fallecidos (personas)',{t:'number'}),
   F('agentes','Agentes que usaron la fuerza',{t:'multi',o:oAg}),F('detenidos','Detenidos sobre quienes se usó',{t:'multi',o:oDet}),
   F('informe','Informe de uso de la fuerza (IUF) capturado',{t:'checkbox',pv:'Q-21',ayuda:'El informe completo aún no está mapeado.'})],
   res:d=>`${d.nivel_fuerza||'Nivel s/d'} · ${d.informe?'con informe':'sin informe'}`},
 parte:{n:'Parte informativa',comp:'parte',act:'parte',fields:e=>[
   F('folio','Folio',{t:'calc',fn:()=>'Lo genera el sistema.'}),F('tipo','Tipo de parte',{t:'select',o:'tipo_parte'}),F('estatus','Estatus',{t:'select',o:'estatus_parte'}),
   F('iph','IPH relacionado',{t:'select',o:oIph}),F('agente_capturista','Agente capturista',{t:'select',o:oAg,ayuda:'Número y nombre salen del agente; no se vuelven a capturar.'}),
   SEC('Documentación complementaria',{pv:'Q-23'}),
   F('dc_fotografia','Fotografía',{t:'checkbox'}),F('dc_audio','Audio',{t:'checkbox'}),F('dc_video','Video',{t:'checkbox'}),F('dc_certificado_medico','Certificado médico',{t:'checkbox'})],
   res:d=>`${d.tipo||'Parte'} · ${d.estatus||'sin estatus'}`},
 iph:{n:'IPH',comp:'iph',act:'iphEditar',fields:e=>[
   SEC('Enrutamiento (lo asigna Jurídico)'),
   F('tipo','Tipo',{t:'select',o:['Delito','Falta administrativa'],act:'iphAsignar'}),F('fuero','Fuero',{t:'select',o:'fuero',act:'iphAsignar'}),
   F('autoridad_destino','Autoridad destino',{t:'select',o:'autoridad',act:'iphAsignar'}),
   SEC('Referencias y puesta a disposición'),
   F('folio_referencia','Folio de referencia'),F('folio_sistema','Folio del sistema',{t:'calc',fn:v=>v.folio_sistema||'Se genera al guardar.'}),
   F('no_remision','Número de remisión'),F('no_expediente','Número de expediente'),
   F('fecha_puesta','Fecha de puesta a disposición',{t:'date'}),F('hora_puesta','Hora de puesta a disposición',{t:'time'}),
   F('agente_puesta','Agente que realiza la puesta',{t:'select',o:oAg}),
   SEC('Autoridad que recibe'),
   F('fiscal_nombre','Fiscal: nombre'),F('fiscal_cargo','Fiscal: cargo'),F('fiscal_adscripcion','Fiscal: adscripción'),
   F('circunstancias','Circunstancias de la infracción',{t:'textarea',show:v=>v.tipo==='Falta administrativa',pv:'Q-24',ayuda:'Lo pide el IPH de Faltas; no está en el DBML v0.2.'}),
   F('narrativa','Narrativa propia del IPH',{t:'textarea',show:(v,e)=>hs(e,'iph','iph').length>1,ayuda:'Solo cuando el evento tiene más de un IPH; si no, usa la del evento.'}),
   SEC('Inspección y preservación del lugar',{pv:'Q-18',show:v=>v.tipo!=='Falta administrativa'}),
   ...[BO('insp_inspeccion','Se inspeccionó el lugar'),BO('insp_positiva','La inspección fue positiva'),BO('insp_preservacion','Se preservó el lugar'),BO('insp_priorizacion','Se priorizó'),
   F('insp_riesgo_tipo','Tipo de riesgo',{t:'select',o:'riesgo_tipo'}),F('insp_riesgo_especificar','Especifique el riesgo')].map(f=>({...f,show:v=>v.tipo!=='Falta administrativa'}))],
   res:d=>`${d.tipo||'Tipo sin asignar'} · ${d.fuero||'fuero sin asignar'} · ${d.autoridad_destino||'autoridad sin asignar'}`}
};
/* Entidades que se ofrecen en cada pieza (orden del menú «+ Registrar») */
const POR_PIEZA={
 detencion:['detencion','detenido','delito','falta','orden','pertenencia','contacto','condicion','traslado','lectura_menor'],
 aseguramiento:['aseguramiento','arma','sustancia','objeto','vehiculo','testigo'],
 resguardo:['resguardo','persona_resguardada','objeto','vehiculo'],
 emergencia:['emergencia'],entrega:['entrega'],victimas:['participante','atencion_esp'],fuerza:['fuerza'],parte:['parte'],iph:['iph']};
