/* =====================================================================
   PIMSy · Maqueta. Lógica de la aplicación.
   Alpine.js (vendor/alpine.min.js) maneja la interactividad de los formularios;
   TanStack Form (form-core, por CDN) valida y envía; con respaldo si no carga.
   Esquemas de campos: esquema.js · catálogos: catalogos.js
   ===================================================================== */
const $=s=>document.querySelector(s);
const UA=UI.atoms,UM=UI.molecules,UO=UI.organisms;
const esc=UI.esc,ic=UA.icon;
function rel(iso){const m=Math.round((Date.now()-new Date(iso))/60000);if(m<1)return 'hace un momento';if(m<60)return `hace ${m} min`;const h=Math.round(m/60);if(h<24)return `hace ${h} h`;return `hace ${Math.round(h/24)} d`}

/* ===== Departamentos, permisos y piezas ===== */
const DK=['ceri','tel','policia','coord','barandilla','juridico','plataforma','analista'];
const DEPTS={ceri:{n:'CERI / origen'},tel:{n:'Teléfono Comunitario',q:'Q-02'},policia:{n:'Policía'},coord:{n:'Coordinación General',q:'Q-02'},barandilla:{n:'Barandilla'},juridico:{n:'Jurídico'},plataforma:{n:'Plataforma'},analista:{n:'Analista'}};
// S = lo dice la spec · P = propuesta · ? = por validar · - = no le corresponde. Orden: ceri,tel,policia,coord,barandilla,juridico,plataforma,analista
const PERM={
  crearA:{l:'Crear evento (Ruta A, origen)',q:'Q-01',r:['S','?','P','?','-','-','P','-']},
  levantarB:{l:'Levantar evento (Ruta B, provisional)',q:'Q-01',r:['-','?','P','?','P','P','P','-']},
  agentes:{l:'Agregar agentes',q:'Q-08',r:['-','-','P','S','-','P','-','-']},
  detencion:{l:'Detención, detenido y sus datos legales',q:'Q-04',r:['-','-','S','-','P','P','-','-']},
  iphEditar:{l:'Crear/editar IPH (borrador)',q:'Q-04',r:['-','-','P','-','-','S','-','-']},
  iphAsignar:{l:'Asignar tipo, fuero y autoridad',q:'Q-04',r:['-','-','-','-','-','S','-','-']},
  bienes:{l:'Aseguramiento y bienes',q:'Q-04',r:['-','-','P','-','-','S','-','-']},
  parte:{l:'Parte informativa',q:'Q-04',r:['-','-','S','S','-','-','-','-']},
  fuerza:{l:'Uso de la fuerza',q:'Q-21',r:['-','-','S','-','-','-','-','-']},
  otros:{l:'Emergencia, entrega de hechos, resguardo, personas y víctimas (no está en la matriz)',q:'Q-04',r:['-','-','P','-','-','-','-','-']},
  fusionar:{l:'Conciliar y fusionar',q:'Q-05',r:['-','-','-','-','-','-','S','-']},
  cerrar:{l:'Cerrar evento',q:'Q-06',r:['-','-','-','-','-','-','S','-']},
  reabrir:{l:'Reabrir evento',q:'Q-06',r:['-','-','-','-','-','S','-','-']},
  anular:{l:'Anular evento',q:'Q-06',r:['-','-','-','-','-','?','S','-']}};
const COMP={
  detencion:{n:'Detención',a:'detencion'},
  aseguramiento:{n:'Aseguramiento y bienes',a:'bienes',q:'Q-19'},
  resguardo:{n:'Resguardo (personas, vehículos y objetos)',a:'otros'},
  emergencia:{n:'Atención a emergencia',a:'otros',q:'Q-14'},
  entrega:{n:'Entrega de hechos',a:'otros',q:'Q-13'},
  victimas:{n:'Atención a víctimas y personas',a:'otros'},
  fuerza:{n:'Uso de la fuerza (mínimo)',a:'fuerza',q:'Q-21'},
  parte:{n:'Parte informativa',a:'parte'},
  iph:{n:'IPH',a:'iphEditar'}};
const AGENTES_MONGO={ // simulacro de MongoDB (sintético)
  'E-0001':{nombre:'Agente',ap:'Sintético',am:'Uno',distrito:'CENTRO',area:'Operaciones',subarea:'Patrullas',puesto:'Policía',unidad:'U-101'},
  'E-0002':{nombre:'Agente',ap:'Sintético',am:'Dos',distrito:'ORIENTE',area:'Operaciones',subarea:'Patrullas',puesto:'Policía',unidad:'U-205'},
  'E-0003':{nombre:'Agente',ap:'Sintético',am:'Tres',distrito:'SUR',area:'Coordinación',subarea:'Mando',puesto:'Supervisor',unidad:'U-310'}};
const DCOL={ceri:'var(--dept-ceri)',tel:'var(--dept-tel)',policia:'var(--dept-policia)',coord:'var(--dept-coord)',barandilla:'var(--dept-barandilla)',juridico:'var(--dept-juridico)',plataforma:'var(--dept-plataforma)',analista:'var(--dept-analista)'};
const ROL={ceri:'Importo el reporte de CERI y abro eventos',tel:'Consulto y doy mi opinión sobre mi parte del flujo',policia:'Registro lo que pasó: detenidos, bienes, parte informativa',coord:'Agrego agentes y capturo la parte informativa',barandilla:'Registro detenidos y sus anexos',juridico:'Armo el IPH, lo enruto, lo firmo y lo envío',plataforma:'Concilio duplicados y cierro eventos',analista:'Consulto resúmenes y fichas'};
const CADUCA_DIAS=30; // VALOR DE EJEMPLO, POR VALIDAR(Q-29)
const UMBRAL_MIN=60;  // VALOR DE EJEMPLO, POR VALIDAR(Q-05)
const Q={'Q-01':'¿Quién puede levantar un evento y por cuál ruta?','Q-02':'¿Coordinación General y Teléfono Comunitario son áreas con permisos propios o unidades? ¿Levantan eventos o solo supervisan?','Q-03':'¿Teléfono Comunitario genera folio CERI o uno propio?','Q-04':'¿Quién agrega cada pieza al evento (agentes, IPH, detenidos, aseguramientos, parte)?','Q-05':'¿Quién concilia y fusiona duplicados y en cuánto tiempo? (umbrales de duplicado)','Q-06':'¿Plataforma cierra y jurídico reabre? ¿Qué se edita tras el cierre y quién anula?','Q-07':'Login compartido: ¿de qué sistema nace el usuario?','Q-08':'¿Quién captura agentes y cuándo? ¿El cierre exige al menos uno?','Q-09':'¿Cómo se enlaza SIPROB con el evento?','Q-10':'¿Quién es dueño del dato de detención, PIMSy o SIPROB?','Q-11':'¿SIPROB ya captura condición del detenido, familiar, pertenencias y atención médica?','Q-12':'¿Cómo se registra un delito/falta sin detenido?','Q-13':'¿Qué pasa con un detenido que va a entrega de hechos o parte informativo y no a IPH?','Q-14':'¿La atención a emergencia se permite siempre o solo sin detención ni aseguramiento?','Q-15':'¿Dónde va el dinero: objeto especial o sustancia?','Q-16':'¿Catálogo único de armas y sustancias para parte e IPH?','Q-17':'¿Los testigos de aseguramiento son persona maestra o dato libre?','Q-18':'¿La inspección y preservación del lugar son del IPH o del evento?','Q-19':'¿Se registran vehículos inspeccionados que no se aseguran?','Q-20':'¿Cómo se registran agentes de otra institución?','Q-21':'¿El anexo de uso de la fuerza del IPH se deriva del informe? (IUF sin mapear)','Q-22':'¿Fecha/hora de conocimiento y arribo vienen de CERI o se capturan?','Q-23':'¿La marca de documentación complementaria se captura a mano?','Q-24':'¿Cuál es la lista vigente de campos del IPH?','Q-25':'¿Recorridos y patrullajes se registran siempre o solo si derivan en algo?','Q-26':'¿La clasificación de la intervención se captura al abrir o se deriva?','Q-27':'¿Se restituyen agrupamientos, autoridades participantes y denominación? ¿Cómo el motivo activa datos?','Q-28':'¿Se alinean los criterios de inclusión con el requerimiento original?','Q-29':'¿Formato regular del reporte de CERI? ¿Días para caducar un preregistro?','Q-30':'¿Google o geocodificador/mapa locales?','Q-31':'¿Dónde se guardan los croquis?','Q-32':'¿Cómo es la transición desde MongoDB?','Q-33':'¿Qué protección de datos se fija desde ahora (menores, víctimas, domicilios)?','Q-34':'¿Usuarios concurrentes y registros por año?','Q-35':'¿Política de refresco de las vistas?'};
const QDEPT={ceri:['Q-03','Q-22','Q-29'],tel:['Q-01','Q-02','Q-03'],policia:['Q-01','Q-04','Q-08','Q-14','Q-19','Q-25','Q-26'],coord:['Q-02','Q-08','Q-20','Q-27'],barandilla:['Q-09','Q-10','Q-11','Q-13','Q-17'],juridico:['Q-06','Q-12','Q-13','Q-15','Q-16','Q-18','Q-21','Q-24'],plataforma:['Q-05','Q-06','Q-07','Q-29','Q-31','Q-32','Q-34','Q-35'],analista:['Q-28','Q-33','Q-35']};
const pv=q=>UA.tagValidar(q,Q[q]);

/* ===== Coordenadas: UTM zona 13N (reporte CERI) a latitud/longitud. Aproximación de la maqueta; en producción lo hace PostGIS. ===== */
function utm2ll(E,N,zone=13){const a=6378137,f=1/298.257223563,k0=.9996,e2=f*(2-f),ep2=e2/(1-e2),x=E-500000,M=N/k0,
 mu=M/(a*(1-e2/4-3*e2*e2/64-5*e2**3/256)),e1=(1-Math.sqrt(1-e2))/(1+Math.sqrt(1-e2)),
 p1=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1*e1/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu)+(1097*e1**4/512)*Math.sin(8*mu),
 s=Math.sin(p1),c=Math.cos(p1),t=Math.tan(p1),N1=a/Math.sqrt(1-e2*s*s),T1=t*t,C1=ep2*c*c,R1=a*(1-e2)/Math.pow(1-e2*s*s,1.5),D=x/(N1*k0);
 const lat=p1-(N1*t/R1)*(D*D/2-(5+3*T1+10*C1-4*C1*C1-9*ep2)*D**4/24+(61+90*T1+298*C1+45*T1*T1-252*ep2-3*C1*C1)*D**6/720);
 const lon=(D-(1+2*T1+C1)*D**3/6+(5-2*C1+28*T1-3*C1*C1+8*ep2+24*T1*T1)*D**5/120)/c;
 return [+(lat*180/Math.PI).toFixed(6),+((zone*6-183)+lon*180/Math.PI).toFixed(6)]}

/* ===== Estado ===== */
let S,dept='policia',view='eventos',cur=null,seenVer=0,FL={q:'',st:'',mio:false,listo:false,dup:false},tab='resumen';
const uid=()=>crypto.randomUUID();
const now=()=>new Date().toISOString();
const short=id=>id.slice(0,8);
function comps(){const o={};Object.keys(COMP).forEach(k=>o[k]={estado:'pendiente',hijos:[]});return o}
function hijo(p){return {id:uid(),area:dept,en:now(),d:{},...p}}
function agSnap(emp,roles){const a=AGENTES_MONGO[emp];return {id:uid(),emp,es_externo:false,institucion_externa:'',nombre:a.nombre,apellido_paterno:a.ap,apellido_materno:a.am,distrito:a.distrito,area:a.area,subarea:a.subarea,puesto:a.puesto,unidad:a.unidad,numero_empleado:emp,roles,en:now(),area_aporta:dept}}
const motivoDe=cod=>(CAT.motivo.find(m=>m.includes('('+cod+')'))||'');
/* Eventos de ejemplo extra: uno por situación que cada departamento quiere probar */
function eventosEjemplo(){
  const O=(folio,f,hr,arr,col,calle,dis,sec,cod,x,y)=>{const [la,lo]=utm2ll(x,y);return {tipo_origen:CAT.tipo_origen[0],medio_conocimiento:CAT.medio_conocimiento[0],folio_ceri:folio,motivo:motivoDe(cod),fecha_evento:f,hora_evento:hr,fecha_hora_conocimiento:f+'T'+hr,fecha_hora_arribo:f+'T'+arr,calle,cruce_1:'CALLE CRUCE',numero_exterior:'100',colonia:col,codigo_postal:CP_COLONIA[col]||'',referencia:'REFERENCIA FICTICIA',municipio:'Juárez',entidad:'Chihuahua',distrito:dis,sector:sec,latitud:la,longitud:lo,fuente_geocodificacion:CAT.fuente_geo[0]}};
  const E=(n,creada,origen,agentes)=>({id:uid(),ref:'EVT-000'+n,estado:'en_proceso',ruta:'A',version:2,creada,narrativa:'',canonico:null,origen,agentes,comp:comps()});
  const R=CAT.rol_agente,sn=(e,...ks)=>ks.forEach(k=>e.comp[k].estado='sin_novedad');
  // EVT-0004 · un detenido por delito federal y otro por falta: dos IPH por enrutar
  const iF=uid(),iC=uid(),dA=uid(),dB=uid();
  const e4=E(4,'ceri',O('9000002','2026-07-01','17:56','18:08','HIDALGO','CALLE EJEMPLO 2','ORIENTE','309','31003',361031.37,3498363.44),[agSnap('E-0001',[R[0],R[2]])]);
  e4.comp.detencion.hijos=[hijo({area:'policia',ent:'detencion',d:{fecha_hora:'2026-07-01T18:20',tipo_detencion:CAT.tipo_detencion[0],observaciones:'Detención sintética'}}),
    hijo({id:dA,area:'policia',ent:'detenido',iphId:iF,d:{nombre_snap:'Detenido Sintético B',apellido_paterno_snap:'Federal',sexo_snap:'Hombre',edad_al_momento_evento:'28',lectura_derechos:'Sí'}}),
    hijo({id:dB,area:'policia',ent:'detenido',iphId:iC,d:{nombre_snap:'Detenida Sintética C',apellido_paterno_snap:'Cívica',sexo_snap:'Mujer',edad_al_momento_evento:'35',lectura_derechos:'Sí'}}),
    hijo({area:'policia',ent:'delito',d:{detenido:dA,cat_delito:CAT.delito[0],fuero:CAT.fuero[0],hubo_violencia:'No'}}),
    hijo({area:'policia',ent:'falta',d:{detenido:dB,cat_falta:CAT.falta_administrativa[0],fraccion:'III'}})];
  e4.comp.iph.hijos=[hijo({id:iF,area:'juridico',ent:'iph',estado:'borrador',d:{folio_sistema:'IPH-000004',tipo:'Delito',fuero:CAT.fuero[0],autoridad_destino:CAT.autoridad[0]}}),
    hijo({id:iC,area:'juridico',ent:'iph',estado:'borrador',d:{folio_sistema:'IPH-000005',tipo:'Falta administrativa',fuero:CAT.fuero[2],autoridad_destino:CAT.autoridad[2]}})];
  sn(e4,'aseguramiento');
  // EVT-0005 · aseguramiento sin detenido: falta su propio IPH
  const aS=uid();
  const e5=E(5,'policia',O('9000011','2026-07-02','10:00','10:12','PARAJES DEL SUR','CALLE EJEMPLO 5','RIVERAS','519','50301',366679.98,3492663.5),[agSnap('E-0002',[R[0]])]);
  e5.comp.aseguramiento.hijos=[hijo({id:aS,area:'juridico',ent:'aseguramiento',iphId:null,d:{descripcion:'Aseguramiento sin detenido (sintético)'}}),
    hijo({area:'juridico',ent:'sustancia',d:{aseguramiento:aS,categoria_sustancia:CAT.categoria_sustancia[0],unidad_peso:'Gramos',cantidad_peso:'25',procedencia_hallazgo:CAT.procedencia_hallazgo[1]}}),
    hijo({area:'juridico',ent:'vehiculo',d:{pertenece_a:'Aseguramiento',aseguramiento:aS,inspeccionado:'Sí',tipo_vehiculo:CAT.tipo_vehiculo[0],procedencia:'Nacional',placas:'FICT-123',situacion:CAT.situacion_vehiculo[1]}})];
  sn(e5,'detencion');
  // EVT-0006 · completo y listo para que Plataforma lo cierre
  const e6=E(6,'ceri',O('9000012','2026-07-03','09:30','09:41','VILLAS DEL BRAVO I','CALLE EJEMPLO 6','PONIENTE','702','50301',371369.4,3502612.52),[agSnap('E-0003',[R[0],R[1]])]);
  sn(e6,'detencion','aseguramiento','resguardo','entrega','victimas','fuerza','iph');
  e6.comp.emergencia.hijos=[hijo({area:'policia',ent:'emergencia',d:{clasificacion:CAT.clasificacion_emergencia[0],tipo_emergencia:CAT.tipo_emergencia[0],descripcion:'Atención sintética'}})];
  e6.comp.parte.hijos=[hijo({area:'policia',ent:'parte',d:{tipo:CAT.tipo_parte[0],estatus:CAT.estatus_parte[1]}})];
  // EVT-0007 · ya cerrado: Jurídico puede reabrirlo
  const e7=E(7,'ceri',O('9000013','2026-07-03','14:10','14:22','LOS ALCALDES AMPLIACION','CALLE EJEMPLO 7','SUR','701','31002',369793.52,3493614.53),[agSnap('E-0001',[R[0]])]);
  e7.estado='cerrado';sn(e7,'detencion','aseguramiento','resguardo','entrega','victimas','fuerza','iph');
  e7.comp.emergencia.hijos=[hijo({area:'policia',ent:'emergencia',d:{clasificacion:CAT.clasificacion_emergencia[0],descripcion:'Atención sintética'}})];
  e7.comp.parte.hijos=[hijo({area:'policia',ent:'parte',d:{tipo:CAT.tipo_parte[0],estatus:CAT.estatus_parte[1]}})];
  // EVT-0008 · víctima con atención especializada y resguardo de una persona; faltan agentes
  const pV=uid(),rg=uid();
  const e8=E(8,'ceri',O('9000014','2026-07-04','11:20','11:30','AMERICAS','CALLE EJEMPLO 8','CENTRO','505','31002',361823.81,3498363.44),[]);
  e8.comp.victimas.hijos=[hijo({id:pV,area:'policia',ent:'participante',d:{rol:'Víctima',nombre:'Persona Sintética D',apellido_paterno:'Ficticia',sexo:CAT.sexo[1],edad_al_momento_evento:'33',requirio_canalizacion:'Sí',atencion_psicologica:CAT.atencion_psicologica[0]}}),
    hijo({area:'policia',ent:'atencion_esp',d:{participante:pV,unidad_especializada:CAT.unidad_especializada[0],fecha_hora:'2026-07-04T12:00',observaciones:'Atención sintética'}})];
  e8.comp.resguardo.hijos=[hijo({id:rg,area:'policia',ent:'resguardo',d:{tipo:'Persona',motivo:'Riesgo para la persona',institucion_resguardo:CAT.institucion_resguardo[0]}}),
    hijo({area:'policia',ent:'persona_resguardada',d:{resguardo:rg,nombre:'Persona Sintética E',apellido_paterno:'Ficticia',edad_al_momento_evento:'8'}})];
  return [e4,e5,e6,e7,e8]}
function seed(){
  const ph=uid(),ag=uid();
  const [la,lo]=utm2ll(360869.24,3500717.64);
  const e1={id:uid(),ref:'EVT-0001',estado:'en_proceso',ruta:'A',version:3,creada:'ceri',narrativa:'',canonico:null,
    origen:{tipo_origen:'Llamada de emergencia / despacho CERI',medio_conocimiento:'CERI',folio_ceri:'9000001',motivo:motivoDe('30416'),fecha_evento:'2026-07-01',hora_evento:'13:31',
      fecha_hora_conocimiento:'2026-07-01T13:31',fecha_hora_arribo:'2026-07-01T13:42',calle:'CALLE EJEMPLO 1',cruce_1:'CALLE CRUCE 1',numero_exterior:'1000',colonia:'PIE DE CASA (EL GRANJERO)',codigo_postal:'32693',
      referencia:'REFERENCIA FICTICIA',municipio:'Juárez',entidad:'Chihuahua',distrito:'CENTRO',sector:'505',latitud:la,longitud:lo,fuente_geocodificacion:'Manual'},
    agentes:[agSnap('E-0001',['Primer respondiente'])],comp:comps()};
  e1.comp.detencion.hijos=[hijo({area:'policia',ent:'detenido',iphId:ph,d:{nombre_snap:'Detenido Sintético A',sexo_snap:'Masculino',edad_al_momento_evento:'30'}})];
  e1.comp.aseguramiento.hijos=[hijo({id:ag,area:'juridico',ent:'aseguramiento',iphId:null,d:{descripcion:'Aseguramiento sintético'}}),
    hijo({area:'juridico',ent:'arma',d:{aseguramiento:ag,subtipo:'Corta',nombre_arma:'Pistola',calibre:'9 mm (ejemplo)',serie:'SERIE-FICTICIA-1',cantidad:'1'}})];
  e1.comp.iph.hijos=[hijo({id:ph,area:'juridico',ent:'iph',estado:'borrador',d:{folio_sistema:'IPH-000001'}})];
  const e2={id:uid(),ref:'EVT-0002',estado:'borrador_sin_origen',ruta:'B',version:1,creada:'juridico',narrativa:'',canonico:null,origen:{municipio:'Juárez',entidad:'Chihuahua'},agentes:[],comp:comps()};
  e2.comp.iph.hijos=[hijo({area:'juridico',ent:'iph',estado:'borrador',d:{folio_sistema:'IPH-000002'}})];
  const e3={id:uid(),ref:'EVT-0003',estado:'borrador_sin_origen',ruta:'B',version:1,creada:'policia',narrativa:'',canonico:null,
    origen:{fecha_evento:'2026-07-01',hora_evento:'13:50',colonia:'PIE DE CASA (EL GRANJERO)',municipio:'Juárez',entidad:'Chihuahua'},agentes:[agSnap('E-0002',['Apoyo'].filter(x=>CAT.rol_agente.includes(x)))],comp:comps()};
  e3.comp.parte.hijos=[hijo({area:'policia',ent:'parte',d:{tipo:CAT.tipo_parte[0],estatus:CAT.estatus_parte[0]}})];
  const P=(folio,ini,acu,inc,col,dis,sec,x,y,calle,cp,nx,ev)=>({folio,fecha:ini,arribo:acu,incidente:inc,colonia:col,distrito:dis,sector:sec,x,y,calle,cruce:'CALLE CRUCE '+folio.slice(-1),cp,nx,evento:ev});
  const extra=eventosEjemplo();
  S={eventos:[e1,e2,e3,...extra],audit:[],pre:[
    P('9000001','2026-07-01T13:31','2026-07-01T13:42','ROBO A ESCUELA SIN VIOLENCIA','PIE DE CASA (EL GRANJERO)','CENTRO','505',360869.24,3500717.64,'CALLE EJEMPLO 1','32693','1000',e1.id),
    P('9000002','2026-07-01T17:56','2026-07-01T18:08','DAÑO A BIENES PUBLICOS, INSTITUCIONES, MONUMENTOS, ENTRE OTROS','HIDALGO','ORIENTE','309',361031.37,3498363.44,'CALLE EJEMPLO 2','32300','1037',null),
    P('9000003','2026-07-01T09:32','2026-07-01T09:39','EXTORSION TELEFONICA','VILLAS DEL BRAVO I','PONIENTE','702',371369.4,3502612.52,'CALLE EJEMPLO 3','32417','1074',null),
    P('9000004','2026-07-01T09:03','2026-07-01T09:03','RIÑA / PELEA CLANDESTINA','PARAJES DEL SUR','RIVERAS','519',366679.98,3492663.5,'CALLE EJEMPLO 4','32575','1111',null)]};
  S.pre[1].evento=extra[0].id;
  S.eventos.forEach(e=>aud(e,'INSERT','evento','Semilla sintética'));
}
function aud(e,op,tabla,det){S.audit.push(Object.freeze({n:S.audit.length+1,en:now(),evento:e?e.ref:'-',op,tabla,det,usuario:'usuario simulado',area:dept}))}

/* ===== Permisos ===== */
function can(a){
  if(Array.isArray(a)){const r=a.map(can);return r.find(x=>x.ok)||r[0]}
  const P=PERM[a],v=P.r[DK.indexOf(dept)];
  if(v==='S'||v==='P')return {ok:true,v};
  if(v==='?')return {ok:false,why:`Falta definir si ${DEPTS[dept].n} puede hacerlo`,q:P.q};
  const who=DK.filter((k,i)=>P.r[i]==='S'||P.r[i]==='P').map(k=>DEPTS[k].n).join(' / ');
  return {ok:false,why:'Lo aporta '+(who||'nadie aún')};
}
function B(label,act,perm,extra='',cls=''){
  const p=perm?can(perm):{ok:true};
  return UM.actionButton({label,act,kind:cls,allowed:p.ok,why:p.why||'',tagQ:p.q||'',tagTitle:p.q?Q[p.q]:'',attrs:extra})}
function Bm(label,act,perm,extra='',cls='sec'){const p=can(perm);return UM.compactButton({label,act,kind:cls,allowed:p.ok,why:p.why||'',attrs:extra})}

/* ===== Reglas de dominio ===== */
const estC=c=>c.hijos.length?'registrado':c.estado;
const fechaEv=o=>o&&o.fecha_evento?new Date(o.fecha_evento+'T'+(o.hora_evento||'00:00')):null;
const origenOk=e=>{const o=e.origen;return !!(o.tipo_origen&&o.fecha_evento&&(o.calle||o.colonia||(o.latitud&&o.longitud)))};
const tieneDet=e=>hs(e,'detencion','detenido').length+hs(e,'detencion','detencion').length>0;
const tieneAseg=e=>e.comp.aseguramiento.hijos.some(h=>['aseguramiento','arma','sustancia'].includes(h.ent)||(['objeto','vehiculo'].includes(h.ent)&&h.d.pertenece_a==='Aseguramiento'));
function indicadores(e){const c=e.comp,any=(k,f)=>c[k].hijos.some(f),n=k=>c[k].hijos.length>0;return [
  ['tiene_detenciones',tieneDet(e)],['tiene_aseguramientos',tieneAseg(e)],['tiene_entrega_hechos',n('entrega')],
  ['tiene_atencion_victimas',any('victimas',h=>h.ent==='atencion_esp'||(h.ent==='participante'&&h.d.rol==='Víctima'))],
  ['tiene_quejoso_denunciante',any('victimas',h=>h.ent==='participante'&&['Quejoso','Denunciante'].includes(h.d.rol))],
  ['tiene_resguardo_personas',any('resguardo',h=>h.ent==='persona_resguardada'||(h.ent==='resguardo'&&h.d.tipo==='Persona'))],
  ['tiene_resguardo_objetos',any('resguardo',h=>['objeto','vehiculo'].includes(h.ent)||(h.ent==='resguardo'&&h.d.tipo!=='Persona'))],
  ['tiene_ordenes_aprehension',any('detencion',h=>h.ent==='orden')],['tiene_atencion_emergencia',n('emergencia')],['tiene_uso_fuerza',n('fuerza')]]}
const IND={tiene_detenciones:'Hubo detenidos',tiene_aseguramientos:'Hubo aseguramientos',tiene_entrega_hechos:'Hubo entrega de hechos',tiene_atencion_victimas:'Se atendió a víctimas',tiene_quejoso_denunciante:'Hay quejoso o denunciante',tiene_resguardo_personas:'Hubo resguardo de personas',tiene_resguardo_objetos:'Hubo resguardo de objetos',tiene_ordenes_aprehension:'Hay órdenes de aprehensión',tiene_atencion_emergencia:'Hubo atención a emergencia',tiene_uso_fuerza:'Hubo uso de la fuerza'};
const pendientes=e=>Object.values(e.comp).filter(c=>estC(c)==='pendiente').length;
function cierre(e){
  const c=e.comp,n=k=>c[k].hijos.length,r=[],det=tieneDet(e),aseg=tieneAseg(e);
  r.push({ok:origenOk(e),t:'Origen completo (tipo de origen, fecha y ubicación)'});
  r.push({ok:e.agentes.some(a=>a.roles&&a.roles.length),t:'Al menos un agente con rol',q:'Q-08'});
  r.push({ok:pendientes(e)===0,t:`Ningún componente pendiente (${pendientes(e)} pendientes)`});
  if(det||aseg)r.push({ok:hs(e,'iph','iph').length>0,t:'Con detención o aseguramiento: al menos un IPH'});
  if(det||aseg||n('emergencia')||n('resguardo')||n('entrega'))r.push({ok:n('parte')>0,t:'Con detención, aseguramiento, emergencia, resguardo o entrega: parte informativa'});
  if(det)r.push({ok:hs(e,'detencion','detenido').every(h=>h.iphId),t:'Todos los detenidos tienen IPH asignado (un detenido pertenece a exactamente un IPH)',q:'Q-13'});
  if(aseg&&!det)r.push({ok:hs(e,'aseguramiento','aseguramiento').every(h=>h.iphId),t:'Aseguramiento sin detenido: cada aseguramiento va a su propio IPH'});
  if(n('fuerza'))r.push({ok:c.fuerza.hijos.some(h=>h.d.informe),t:'Con uso de la fuerza: informe de uso de la fuerza',q:'Q-21'});
  return r}
function duplicado(e){
  if(e.estado==='anulado')return null;const f=fechaEv(e.origen);
  return S.eventos.find(o=>o.id!==e.id&&o.estado!=='anulado'&&(
    (e.origen.folio_ceri&&o.origen.folio_ceri===e.origen.folio_ceri)||
    (e.origen.colonia&&f&&o.origen.colonia===e.origen.colonia&&fechaEv(o.origen)&&Math.abs(fechaEv(o.origen)-f)<=UMBRAL_MIN*60000)))||null}
const ev=()=>S.eventos.find(e=>e.id===cur);
const findH=(e,id)=>{for(const k of Object.keys(e.comp)){const h=e.comp[k].hijos.find(x=>x.id===id);if(h)return h}};
const compOf=(e,id)=>Object.keys(e.comp).find(k=>e.comp[k].hijos.some(x=>x.id===id));

/* ===== Avisos, deshacer, confirmación ===== */
function toast(m,t,act){ // t===1 → error; otro → éxito. act={label,fn}
  const el=UM.toast({mensaje:m,tipo:t===1?'e':'o',accion:act});
  el.querySelector('.x').onclick=()=>el.remove();if(act)el.querySelector('.lnk').onclick=()=>{el.remove();act.fn()};
  $('#toasts').appendChild(el);setTimeout(()=>el.remove(),act?9000:5500);return false}
let prevS=null;
const snapUndo=()=>{prevS=JSON.stringify(S.eventos)};
function deshacer(){if(!prevS)return;S.eventos=JSON.parse(prevS);prevS=null;aud(ev(),'UPDATE','evento','Cambio deshecho');const z=ev();seenVer=z?z.version:0;render();toast('Cambio deshecho.')}
const UNDO={label:'Deshacer',fn:()=>deshacer()};
function confirmar(t,txt,label,fn,danger){
  const d=$('#dlg');d.className='';d.oncancel=null;
  d.innerHTML=UO.confirmDialog({titulo:t,texto:txt,etiqueta:label,peligro:!!danger});
  d.querySelector('form').onsubmit=x=>{x.preventDefault();d.close();fn()};d.showModal()}

// Toda escritura pasa por aquí: permiso, estado, versión (bloqueo optimista), auditoría
function mut(e,act,desc,fn,tabla='evento'){
  const p=can(act);if(!p.ok)return toast(p.why,1);
  if(e.estado==='cerrado'||e.estado==='anulado')return toast(`Evento ${e.estado}: no se edita. Qué se puede editar tras el cierre está POR VALIDAR(Q-06).`,1);
  if(seenVer!==e.version)return toast('Versión obsoleta: otra área guardó antes. Se recargó el evento (REQ-EVT-05).',1),render();
  snapUndo();
  try{fn()}catch(x){prevS=null;return toast(x.message,1)}
  e.version++;seenVer=e.version;aud(e,'UPDATE',tabla,desc);
  if(e.estado==='abierto')e.estado='en_proceso';
  if(e.estado==='borrador_sin_origen'&&origenOk(e)){e.estado='abierto';aud(e,'UPDATE','evento','borrador_sin_origen → abierto')}
  render();toast('Guardado.','ok',UNDO);return true}

/* ===== Motor de formularios: Alpine.js (interactividad) + TanStack Form (validación) ===== */
const optsOf=(f,e)=>{const o=f.o;if(!o)return [];const L=typeof o==='function'?o(e):(typeof o==='string'?CAT[o]:o);return (L||[]).map(x=>typeof x==='string'?{v:x,l:x}:x)};
const comKey=()=>'pimsy_coment_'+dept;
function comLoad(){try{return JSON.parse(localStorage.getItem(comKey())||'{}')}catch(e){return {}}}
function comSave(o){try{localStorage.setItem(comKey(),JSON.stringify(o))}catch(e){}}
let comActual=null;
function abrirComentario(key,etq){
  comActual=key;const d=$('#dlg2');d.className='';
  d.innerHTML=UO.commentDialog({titulo:'Comentar un campo',campo:etq,valor:comLoad()[key]||''});d.showModal();setTimeout(()=>$('#com-txt').focus(),50)}
function guardarComentario(borrar){
  const o=comLoad(),v=borrar?'':$('#com-txt').value.trim();
  if(v)o[comActual]=v;else delete o[comActual];comSave(o);$('#dlg2').close();
  document.querySelectorAll(`#dlg [data-com="${comActual}"]`).forEach(b=>b.classList.toggle('on',!!v));
  toast(v?'Comentario guardado en tu hoja de validación.':'Comentario quitado.')}
function infoCampo(key){ // 'entidad.campo' → nombres legibles
  const [ent,...r]=key.split('.'),campo=r.join('.');
  const falso={comp:Object.fromEntries(Object.keys(COMP).map(k=>[k,{hijos:[]}])),agentes:[]};
  const lista=ent==='evento'?EVENTO:ent==='agente'?AGENTE:(ENT[ent]?ENT[ent].fields(falso):[]);
  const f=lista.find(x=>x.k===campo);
  return {formulario:ent==='evento'?'Datos del evento':ent==='agente'?'Agente':(ENT[ent]?ENT[ent].n:ent),campo:f?f.l:campo}}

function campo(f,i,e){
  const k=f.k;
  if(f.sec)return `<h4 class="fsec" id="sec_${i}" x-show="vis(${i})">${esc(f.sec)}${f.pv?pv(f.pv):''}</h4>`;
  const bloq=f.act&&!can(f.act).ok,dis=bloq?'disabled':'';
  const full=['textarea','multi','calc'].includes(f.t)||f.t==='checkbox';
  const ej=typeof f.o==='string'&&CATSRC[f.o]==='ejemplo'?UA.tagEjemplo():'';
  const m=`x-model="v['${k}']"`,cls=`:class="{inv:bad('${k}')}"`,ar=`:aria-invalid="bad('${k}')"`;
  let ctl='';
  if(f.t==='checkbox')return `<div class="fld full" x-show="vis(${i})"><label class="chkl big"><input id="f_${k}" type="checkbox" ${m} ${dis}> ${esc(f.l)}${f.pv?pv(f.pv):''}</label>${f.ayuda?`<small class="ay">${esc(f.ayuda)}</small>`:''}</div>`;
  if(f.t==='textarea')ctl=`<textarea id="f_${k}" rows="3" ${m} ${cls} ${ar} ${dis}></textarea>`;
  else if(f.t==='select')ctl=`<select id="f_${k}" ${m} ${cls} ${ar} ${dis}><option value="">Elige una opción</option>${optsOf(f,e).map(o=>`<option value="${esc(o.v)}">${esc(o.l)}</option>`).join('')}</select>`;
  else if(f.t==='bool')ctl=UM.yesNo({modelo:`v['${k}']`,etiqueta:f.l,disabled:bloq});
  else if(f.t==='lista')ctl=`<input id="f_${k}" list="dl_${k}" autocomplete="off" placeholder="Escribe para buscar" ${m} ${cls} ${ar} ${dis}><datalist id="dl_${k}">${optsOf(f,e).map(o=>`<option value="${esc(o.v)}">`).join('')}</datalist>`;
  else if(f.t==='multi')ctl=`<div class="multi">${optsOf(f,e).map(o=>`<label class="chkl"><input type="checkbox" value="${esc(o.v)}" :checked="(v['${k}']||[]).includes($el.value)" @change="tog('${k}',$el.value,$el.checked)" ${dis}> ${esc(o.l)}</label>`).join('')||'<span class="mut small">No hay opciones todavía.</span>'}</div>`;
  else if(f.t==='calc')ctl=`<div class="calc" x-text="calc(${i})"></div>`;
  else{
    const tel=/telefono/.test(k),cp=/codigo_postal/.test(k),curp=k==='curp',num=f.t==='number';
    const extra=[tel?'type="tel" inputmode="tel"':num?'type="number" inputmode="decimal" step="any"':`type="${f.t||'text'}"`,cp?'inputmode="numeric" maxlength="5"':'',curp?'maxlength="18" autocapitalize="characters"':'','autocomplete="off"'].join(' ');
    ctl=`<input id="f_${k}" ${extra} ${m} ${cls} ${ar} ${dis}>`}
  const ck=`${window.__F.entKey||'evento'}.${k}`;
  return UM.field({id:k,clave:k,indice:i,etiqueta:f.l,obligatorio:!!f.r,tagsHtml:(f.pv?pv(f.pv):'')+ej,controlHtml:ctl,ayuda:f.ayuda||'',nota:bloq?can(f.act).why:'',ancho:full,extraHtml:UM.commentButton({clave:ck,etiqueta:f.l,tiene:!!(window.__COM||{})[ck]})})}
function abrirForm(c){ // c:{titulo,fields,values,e,ok,okLabel,pv,aviso,draftKey}
  const d=$('#dlg');window.__F=c;window.__COM=comLoad();d.className='big';
  const chips=c.fields.map((f,i)=>f.sec?{i,t:f.sec}:null).filter(Boolean);
  d.innerHTML=UO.formDialog({titulo:c.titulo,tagHtml:c.pv?pv(c.pv):'',aviso:c.aviso||'',chips,camposHtml:c.fields.map((f,i)=>campo(f,i,c.e)).join(''),okLabel:c.okLabel||'Guardar',otroLabel:c.otro?'Guardar y registrar otro':''});
  d.oncancel=x=>{const fa=window.__fa;if(fa&&fa.dirty()){x.preventDefault();fa.descartando=true}};
  d.showModal()}
function formApp(){
  const c=window.__F,fl=c.fields;
  return {v:JSON.parse(JSON.stringify(c.values||{})),errs:{},touched:{},sent:false,api:null,flds:{},prev:'',ini:'',restored:false,descartando:false,otro:false,savedAt:'',tmr:null,
   init(){
     window.__fa=this;
     fl.forEach(f=>{if(f.k&&this.v[f.k]===undefined)this.v[f.k]=f.t==='multi'?[]:f.t==='checkbox'?false:''});
     this.ini=JSON.stringify(this.v);
     if(c.draftKey){try{const g=localStorage.getItem(c.draftKey);if(g){this.v={...this.v,...JSON.parse(g)};this.restored=true}}catch(x){}}
     const TF=window.TSForm;
     if(TF){
       this.api=new TF.FormApi({defaultValues:JSON.parse(JSON.stringify(this.v)),onSubmit:()=>this.fin()});this.api.mount();
       fl.filter(f=>f.k&&f.t!=='calc').forEach(f=>{
         const fld=new TF.FieldApi({form:this.api,name:f.k,validators:{onChange:({value})=>this.chk(f,value),onSubmit:({value})=>this.chk(f,value)}});fld.mount();
         fld.store.subscribe(()=>{const er=fld.state.meta.errors.filter(Boolean);this.errs[f.k]=er[0]||''});this.flds[f.k]=fld;fld.handleChange(JSON.parse(JSON.stringify(this.v[f.k])))})}
     this.prev=JSON.stringify(this.v);
     this.$watch('v',nv=>{
       const old=JSON.parse(this.prev);this.prev=JSON.stringify(nv);
       fl.forEach(f=>{if(!f.k)return;if(JSON.stringify(nv[f.k])===JSON.stringify(old[f.k]))return;
         if(f.auto&&nv[f.k])Object.entries(f.auto).forEach(([t,fn])=>{if(!nv[t]){const r=fn(nv[f.k]);if(r)this.v[t]=r}});
         if(this.flds[f.k])this.flds[f.k].handleChange(JSON.parse(JSON.stringify(nv[f.k])));
         else if(!this.api)this.errs[f.k]=this.chk(f,nv[f.k])||''});
       this.guardarBorrador()});
     this.$nextTick(()=>{if(!matchMedia('(pointer:fine)').matches)return;const el=this.$el.querySelector('.fld input:not([type=checkbox]):not([disabled]),.fld select:not([disabled])');if(el)el.focus()})},
   vis(i){const f=fl[i];return !f.show||!!f.show(this.v,c.e)},
   calc(i){try{return fl[i].fn(this.v)}catch(x){return ''}},
   vacio(val){return Array.isArray(val)?!val.length:!String(val??'').trim()},
   bad(k){return !!this.errs[k]&&(this.touched[k]||this.sent)},
   okf(k){return !!this.touched[k]&&!this.errs[k]&&!this.vacio(this.v[k])},
   tog(k,val,on){const a=this.v[k]||[];this.v[k]=on?[...new Set([...a,val])]:a.filter(x=>x!==val)},
   chk(f,val){
     if(f.show&&!f.show(this.v,c.e))return undefined;
     if(f.r&&this.vacio(val))return 'Este campo es obligatorio';
     if(f.val&&!this.vacio(val))return f.val(String(val));
     return undefined},
   reqs(){return fl.map((f,i)=>f.r&&f.k&&this.vis(i)?f:null).filter(Boolean)},
   tot(){return this.reqs().length},
   hechos(){return this.reqs().filter(f=>!this.vacio(this.v[f.k])).length},
   pct(){const t=this.tot();return t?Math.round(100*this.hechos()/t):100},
   txtProg(){return `${this.hechos()} de ${this.tot()} campos obligatorios`},
   dirty(){return JSON.stringify(this.v)!==this.ini},
   estado(){return this.savedAt?`Borrador guardado a las ${this.savedAt}`:(this.dirty()?'Cambios sin guardar':'Sin cambios')},
   guardarBorrador(){if(!c.draftKey)return;clearTimeout(this.tmr);this.tmr=setTimeout(()=>{try{if(this.dirty()){localStorage.setItem(c.draftKey,JSON.stringify(this.v));this.savedAt=new Date().toTimeString().slice(0,5)}}catch(x){}},600)},
   limpiarBorrador(){try{if(c.draftKey)localStorage.removeItem(c.draftKey)}catch(x){}},
   descartarBorrador(){this.limpiarBorrador();this.v=JSON.parse(this.ini);this.restored=false;this.savedAt='';this.touched={};this.sent=false},
   irA(i){const el=document.getElementById('sec_'+i);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},
   cancelar(){if(this.dirty())this.descartando=true;else $('#dlg').close()},
   descartar(){this.limpiarBorrador();$('#dlg').close()},
   enviarOtro(){return this.enviar(true)},
   async enviar(otro=false){
     this.otro=otro;this.sent=true;
     if(this.api){fl.forEach(f=>{if(f.k&&this.flds[f.k])this.flds[f.k].handleChange(JSON.parse(JSON.stringify(this.v[f.k])))});await this.api.handleSubmit()}
     else{let ok=true;fl.forEach(f=>{if(!f.k||f.t==='calc')return;const er=this.chk(f,this.v[f.k]);this.errs[f.k]=er||'';if(er)ok=false});if(ok)this.fin()}
     const bad=this.$el.querySelector('.ferr:not(:empty)');if(bad){const w=bad.closest('.fld');w.scrollIntoView({block:'center',behavior:'smooth'});const i=w.querySelector('input,select,textarea');if(i)i.focus({preventScroll:true})}},
   fin(){const out={};fl.forEach(f=>{if(f.k&&f.t!=='calc'&&(!f.show||f.show(this.v,c.e)))out[f.k]=JSON.parse(JSON.stringify(this.v[f.k]))});this.limpiarBorrador();$('#dlg').close();c.ok(out,this.otro)}}}

/* ===== Vistas ===== */
const SCHEMES=['auto','light','dark'],TL={auto:'Tema: automático',light:'Tema: claro',dark:'Tema: oscuro'};
function theme(m){THEME.setScheme(m);$('#theme').innerHTML=ic({auto:'auto',light:'sun',dark:'moon'}[m]);$('#theme').title=TL[m];$('#theme').setAttribute('aria-label',TL[m])}
function abrirDiseno(){
  const d=$('#dlg');d.className='big';d.oncancel=null;const v=THEME.values();
  d.innerHTML=UO.themePanel({perillas:THEME.knobs.map(k=>({id:k.id,etiqueta:k.etiqueta,min:k.min,max:k.max,paso:k.paso,unidad:k.unidad,valor:v[k.id]})),matices:THEME.matices});
  d.showModal()}
function render(){
  try{localStorage.setItem('pimsy_estado3',JSON.stringify({S,AGENTES_MONGO}))}catch(x){}
  $('#dept').value=dept;document.documentElement.style.setProperty('--dc',DCOL[dept]);
  const tabs=[['eventos','Eventos'],['pre','Preregistros CERI'],['conc','Conciliación'],['guia','Guía paso a paso'],['perm','Permisos'],['hoja','Hoja de validación'],['aud','Auditoría'],['reset','Reiniciar datos']];
  $('#nav').innerHTML=UO.navBar({items:tabs,actual:view==='det'?'eventos':view,act:'nav'});
  const dd=DEPTS[dept];
  const head=`<p class="legend noprint">Maqueta con datos 100% sintéticos. Departamento activo: <b>${dd.n}</b>${dd.q?pv(dd.q):''}. Lo que no le corresponde aparece deshabilitado con su leyenda. Las etiquetas ${pv('Q-xx')} marcan lo no decidido. Los catálogos marcados «ejemplo» son ficticios.</p>`;
  renderSesion();
  $('#app').innerHTML=head+({eventos:vLista,det:vDetalle,ficha:vFicha,guia:vGuia,pre:vPre,conc:vConc,perm:vPerm,hoja:vHoja,aud:vAud}[view])();
}
function vFicha(){
  const e=ev();if(!e)return '';const o=e.origen;
  const piezas=Object.keys(COMP).map(k=>{const c=e.comp[k],s=estC(c);
    return `<h3>${COMP[k].n} ${stB(s)}</h3>`+(c.hijos.length?c.hijos.map(hh=>{const E=ENT[hh.ent];return `<p><b>${E.n}</b> · ${esc(E.res(hh.d,e,hh))} <span class="small mut">[${DEPTS[hh.area]?.n||hh.area}]</span></p>${fichaHtml(E.fields(e),hh.d,e)}`}).join(''):'<p class="mut small">Sin registros.</p>')}).join('');
  return `<div class="fp"><p class="noprint"><button class="sec" data-act="nav" data-k="det">${ic('back')} Volver al evento</button> <button data-act="print">Imprimir o guardar como PDF</button></p>
  <div class="card"><h2>Ficha del evento ${e.ref} ${stB(e.estado)}</h2><p class="small mut">Datos sintéticos de la maqueta · ${new Date().toLocaleString('es-MX')}</p>
  <h3>Datos del evento</h3>${fichaHtml(EVENTO,o,e)}
  <h3>Narrativa</h3><p>${e.narrativa?esc(e.narrativa):'<span class="mut">Sin narrativa.</span>'}</p>
  <h3>Agentes</h3>${e.agentes.length?'<ul>'+e.agentes.map(a=>`<li>${esc(nomAg(a))} · ${esc((a.roles||[]).join(', ')||'sin rol')} · ${esc(a.puesto||'')} ${a.es_externo?'(externo: '+esc(a.institucion_externa)+')':''}</li>`).join('')+'</ul>':'<p class="mut small">Sin agentes.</p>'}
  ${piezas}
  <h3>¿Se puede cerrar?</h3><ul class="chk">${cierre(e).map(x=>`<li class="${x.ok?'ok':'no'}">${ic(x.ok?'check':'x')}<span>${x.t}</span></li>`).join('')}</ul></div></div>`}
const ETQ={pendiente:ic('clock')+' Falta',registrado:ic('check')+' Registrado',sin_novedad:ic('minus')+' Sin novedad',borrador_sin_origen:'Borrador sin origen',abierto:'Abierto',en_proceso:'En proceso',cerrado:ic('lock')+' Cerrado',reabierto:'Reabierto',anulado:'Anulado',borrador:'Borrador',firmado:'Firmado',enviado:'Enviado'};
const stB=s=>UA.badge(s,ETQ[s]||s);
const motCorto=m=>m?m.replace(/\s*\(\d+\)$/,'').split(' > ').pop():'';
function pasos(e){
  const L=[];
  if(['cerrado','anulado'].includes(e.estado)){if(e.estado==='cerrado'&&can('reabrir').ok)L.push('Si hay que corregir algo, usa «Reabrir».');return L}
  if(!origenOk(e)&&can(['crearA','levantarB']).ok)L.push('Completa el <b>origen</b> (tipo de origen, fecha y ubicación).');
  if(!e.agentes.length&&can('agentes').ok)L.push('Agrega al menos un <b>agente</b> con su rol.');
  Object.entries(COMP).forEach(([k,m])=>{if(estC(e.comp[k])==='pendiente'&&can(m.a).ok)L.push(`En <b>${m.n}</b>: usa «+ Registrar» si hubo, o «Sin novedad» si no.`)});
  hs(e,'iph','iph').forEach(i=>{const d=i.d;
    if(i.estado==='borrador'&&(!d.tipo||!d.fuero||!d.autoridad_destino)&&can('iphAsignar').ok)L.push(`IPH ${short(i.id)}: asigna <b>tipo, fuero y autoridad</b>.`);
    else if(i.estado==='borrador'&&can('iphEditar').ok&&d.tipo&&d.fuero&&d.autoridad_destino)L.push(`IPH ${short(i.id)}: ya puede <b>firmarse</b>.`)});
  if(cierre(e).every(x=>x.ok)&&can('cerrar').ok)L.push('Todo está completo: ya puedes <b>cerrar</b> el evento.');
  return L}

function filas(){
  const q=FL.q.trim().toLowerCase();
  const L=S.eventos.filter(e=>(!FL.st||e.estado===FL.st)&&(!q||[e.ref,e.origen.folio_ceri,e.origen.colonia,e.origen.motivo,e.origen.calle].join(' ').toLowerCase().includes(q))&&(!FL.mio||pasos(e).length>0)&&(!FL.listo||(!['cerrado','anulado'].includes(e.estado)&&cierre(e).every(x=>x.ok)))&&(!FL.dup||!!duplicado(e)));
  if(!L.length)return `<tr><td colspan="7">${UM.emptyState({texto:'No hay eventos con esos filtros.',accionHtml:UA.button({label:'Limpiar filtros',act:'limpiar',kind:'sec'})})}</td></tr>`;
  return L.map(e=>{const d=duplicado(e);return `<tr class="click" tabindex="0" data-act="abrir" data-id="${e.id}"><td data-l="Evento"><b>${e.ref}</b></td>
   <td class="hm" data-l="Folio CERI">${esc(e.origen.folio_ceri||'—')}</td><td data-l="Estado">${stB(e.estado)}</td><td class="hm" data-l="Cómo nació">${e.ruta==='A'?'Desde el origen':'Desde un formulario'}<div class="small mut">${DEPTS[e.creada].n}</div></td>
   <td data-l="De qué trata">${esc(motCorto(e.origen.motivo)||e.origen.colonia||'(sin origen)')}</td><td data-l="Faltan">${pendientes(e)?`<b>${pendientes(e)}</b> piezas`:'—'}</td><td data-l="Aviso">${d?`<span class="b pendiente">posible duplicado de ${d.ref}</span>`:''}</td></tr>`}).join('')}
function vLista(){
  let oculto=false;try{oculto=localStorage.getItem('pimsy_hero')==='1'}catch(x){}
  const hero=oculto?'':UO.welcome({titulo:'¿Cómo funciona PIMSy?',intro:'Cada situación atendida es un <b>evento</b>. Entre todas las áreas lo van armando: <b>cada quien agrega solo lo suyo, una sola vez</b>.',
    pasos:[{titulo:'1. Elige quién eres',texto:'Arriba, en «Soy del departamento». Verás solo lo que te toca.'},{titulo:'2. Abre un evento',texto:'Haz clic en una fila. Te diré cuál es tu siguiente paso.'},{titulo:'3. Aporta tu parte',texto:'Registra lo que hubo o marca «Sin novedad».'},{titulo:'4. Valida y comenta',texto:'En «Hoja de validación» dinos qué falta o sobra.'}],
    pieHtml:`<p class="small mut">Las etiquetas ${pv('Q-xx')} son cosas que aún no se deciden. Todo es de prueba: nada es real. Atajos: <b>/</b> buscar, <b>Esc</b> cerrar.</p>`,
    botonOcultar:UA.button({label:'Entendido, ocultar',act:'heroOff',kind:'sec'})});
  const ests=['borrador_sin_origen','abierto','en_proceso','cerrado','reabierto','anulado'];
  const vivos=S.eventos.filter(e=>!['cerrado','anulado'].includes(e.estado));
  const kpis=UO.kpiRow([{etiqueta:'Todos los eventos',valor:S.eventos.length,clave:'todos:'},{etiqueta:'Donde me falta aportar',valor:S.eventos.filter(e=>pasos(e).length>0).length,clave:'mio:',pulsada:FL.mio},
    {etiqueta:'Listos para cerrar',valor:vivos.filter(e=>cierre(e).every(x=>x.ok)).length,clave:'listo:',pulsada:FL.listo},{etiqueta:'Provisionales',valor:S.eventos.filter(e=>e.estado==='borrador_sin_origen').length,clave:'st:borrador_sin_origen',pulsada:FL.st==='borrador_sin_origen'},
    {etiqueta:'Posibles duplicados',valor:S.eventos.filter(e=>duplicado(e)).length,clave:'dup:',pulsada:FL.dup}]);
  return hero+kpis+`<div class="card"><div class="row"><h2 style="margin:0">Eventos</h2><span class="grow"></span>
   ${B('Nuevo evento (Ruta A)','nuevoA',['crearA'])}${B('Levantar evento (Ruta B)','nuevoB',['levantarB'])}</div>
   <div class="filtros">${UM.searchBox({id:'q',clave:'q',valor:FL.q,placeholder:'Filtrar esta lista',etiqueta:'Filtrar eventos'})}
    <select data-f="st" aria-label="Filtrar por estado"><option value="">Todos los estados</option>${ests.map(k=>`<option value="${k}" ${FL.st===k?'selected':''}>${ETQ[k].replace(/<[^>]+>/g,'').trim()}</option>`).join('')}</select>
    <label class="chkl"><input type="checkbox" data-f="mio" ${FL.mio?'checked':''}> Solo donde me falta aportar</label></div>
   <div class="sc"><table class="rs"><tr><th>Evento</th><th>Folio CERI</th><th>Estado</th><th>Cómo nació</th><th>De qué trata</th><th>Faltan</th><th>Aviso</th></tr><tbody id="rows">${filas()}</tbody></table></div></div>`}

function linea(a){return UO.timeline({items:a.map(x=>({titulo:x.det,detalle:`${DEPTS[x.area].n} · ${rel(x.en)} · ${x.tabla}`})),vacio:'Todavía no hay movimientos.'})}

/* Ficha: todos los campos con dato de un registro */
function valTxt(f,val,e){
  if(Array.isArray(val))return val.map(x=>valTxt({...f,t:'select'},x,e)).join(', ');
  if(f.t==='select'&&typeof f.o!=='string'&&typeof f.o!=='undefined'&&!Array.isArray(f.o)){const o=optsOf(f,e).find(x=>x.v===val);return o?o.l:val}
  if(f.t==='datetime-local')return String(val).replace('T',' ');
  if(f.t==='checkbox')return val?'Sí':'No';
  return val}
function fichaHtml(fields,d,e){
  return UM.dataList(fields.filter(f=>f.k&&f.t!=='calc'&&d[f.k]!==undefined&&d[f.k]!==''&&!(Array.isArray(d[f.k])&&!d[f.k].length)).map(f=>[f.l,valTxt(f,d[f.k],e)]))}

function filaHijo(e,k,h){
  const E=ENT[h.ent],act=h.ent==='iph'?['iphEditar','iphAsignar']:E.act;let extra='',bt='';
  if(E.iph){const ip=hs(e,'iph','iph').find(i=>i.id===h.iphId);extra=` · <span class="mut">${ip?'IPH '+short(ip.id):'sin IPH asignado'+(h.ent==='detenido'?pv('Q-13'):'')}</span>`;bt+=Bm('Asignar IPH','asigIph',E.act,`data-id="${h.id}"`)}
  if(h.ent==='iph'){extra=` ${stB(h.estado)} · detenidos: ${e.comp.detencion.hijos.filter(x=>x.iphId===h.id).length} · aseguramientos: ${e.comp.aseguramiento.hijos.filter(x=>x.iphId===h.id).length}`;
    if(h.estado==='borrador')bt+=Bm('Firmar','firma','iphEditar',`data-id="${h.id}"`);if(h.estado==='firmado')bt+=Bm('Enviar','envia','iphEditar',`data-id="${h.id}"`)}
  return `<div class="hj"><div class="hj-t"><span class="mut">[${DEPTS[h.area]?.n||h.area}]</span> ${esc(E.res(h.d,e,h))}${extra}</div>
   <div class="row">${bt}${Bm('Editar','edit',act,`data-id="${h.id}" data-k="${k}"`)}${Bm('Quitar','quitar',act,`data-id="${h.id}" data-k="${k}"`)}</div>
   ${UM.disclosure({resumen:'Ver todos los campos',html:fichaHtml(E.fields(e),h.d,e)})}</div>`}
function pieza(e,k){
  const m=COMP[k],c=e.comp[k],s=estC(c),ents=POR_PIEZA[k];
  const actDe=en=>en==='iph'?['iphEditar','iphAsignar']:ENT[en].act;
  const itemsHtml=ents.map(en=>{const E=ENT[en],p=can(actDe(en));return UM.menuItem({label:E.n+(E.pv?pv(E.pv):''),act:'add',attrs:`data-k="${k}" data-ent="${en}"`,allowed:p.ok,why:p.why||''})}).join('');
  const any=ents.some(en=>can(actDe(en)).ok),p0=can(m.a);
  const grupos=ents.map(en=>{const L=c.hijos.filter(h=>h.ent===en);if(!L.length)return '';const E=ENT[en];
    return UO.recordGroup({titulo:E.n,tagsHtml:(E.pv?pv(E.pv):'')+(E.restr?UA.badge('anulado','acceso restringido'):''),filasHtml:L.map(h=>filaHijo(e,k,h)).join('')})}).join('');
  const acciones=(any?UM.menu({etiqueta:'Registrar',itemsHtml}):UA.hint(p0.why))+(c.hijos.length?'':Bm('Sin novedad','sn',m.a,`data-k="${k}"`)+Bm('Pendiente','pend',m.a,`data-k="${k}"`));
  return UO.pieceBlock({clase:{pendiente:'pen',registrado:'reg',sin_novedad:'sin'}[s],titulo:m.n,tagsHtml:m.q?pv(m.q):'',estadoHtml:stB(s),conteo:`${c.hijos.length} registro${c.hijos.length===1?'':'s'}`,accionesHtml:acciones,cuerpoHtml:grupos})}

function vDetalle(){
  const e=ev();if(!e)return '<p>Evento no encontrado.</p>';
  const d=duplicado(e),chk=cierre(e),listo=chk.every(x=>x.ok),o=e.origen,cerr=e.estado==='cerrado',anul=e.estado==='anulado';
  const ag=e.agentes.map(a=>`<tr><td>${esc(a.numero_empleado||'—')}</td><td>${esc(nomAg(a))}${a.es_externo?`<div class="small mut">Externo: ${esc(a.institucion_externa)}${pv('Q-20')}</div>`:''}</td><td>${esc((a.roles||[]).join(', ')||'—')}</td>
   <td>${esc(a.distrito||'—')} · ${esc(a.puesto||'—')}${a.unidad?' · '+esc(a.unidad):''}${AGENTES_MONGO[a.emp]&&AGENTES_MONGO[a.emp].distrito!==a.distrito?`<div class="small mut">Mongo hoy: ${AGENTES_MONGO[a.emp].distrito} (el snapshot no cambia)</div>`:''}</td>
   <td class="row">${Bm('Roles','rolesAg','agentes',`data-id="${a.id}"`)}${Bm('Quitar','quitarAg','agentes',`data-id="${a.id}"`)}</td></tr>`).join('');
  const nOk=chk.filter(x=>x.ok).length,lug=[o.calle,o.numero_exterior,o.colonia].filter(Boolean).join(' ');
  const T={
   resumen:`<div class="grid">
   <div class="card"><h3>Origen y ubicación</h3>
    <table><tr><td>Tipo de origen</td><td>${esc(o.tipo_origen||'—')}</td></tr><tr><td>Folio CERI</td><td>${esc(o.folio_ceri||'—')}</td></tr><tr><td>Fecha y hora</td><td>${esc((o.fecha_evento||'—')+' '+(o.hora_evento||''))}</td></tr>
    <tr><td>Motivo</td><td>${esc(motCorto(o.motivo)||'—')}</td></tr><tr><td>Lugar</td><td>${esc(lug||'—')}</td></tr><tr><td>Distrito / sector</td><td>${esc((o.distrito||'—')+' / '+(o.sector||'—'))}</td></tr>
    <tr><td>Coordenadas</td><td>${esc(o.latitud&&o.longitud?o.latitud+', '+o.longitud:'—')}</td></tr></table>
    <details class="fi"><summary>Ver todos los campos del evento</summary>${fichaHtml(EVENTO,o,e)}</details>
    <p class="small mut">Geocodificación no se invoca: se captura a mano ${pv('Q-30')} · croquis ${pv('Q-31')}</p>
    ${B('Completar / editar origen','origen',['crearA','levantarB'])}</div>
   <div class="card"><h3>Resumen automático <span class="small mut">(se calcula solo, no se captura)</span></h3><div class="ind">
    ${indicadores(e).map(([k,v])=>`<div>${v?`<span class="ok">${ic('check')}</span>`:`<span class="mut">${ic('x')}</span>`} ${IND[k]}</div>`).join('')}<div><b>Piezas que faltan: ${pendientes(e)}</b></div></div></div></div>
  <div class="card" style="margin-top:var(--space-4)"><h3>¿Se puede cerrar? ${listo?`${UA.badge('registrado',ic('check')+' Sí')}`:UA.badge('pendiente','Aún no')}</h3><ul class="chk">${chk.map(x=>`<li class="${x.ok?'ok':'no'}">${ic(x.ok?'check':'x')}<span>${x.t}${x.q?pv(x.q):''}</span></li>`).join('')}</ul>
   <p class="small mut">Cierra solo Plataforma; reabre solo Jurídico. ${listo?'':'Cerrar queda bloqueado hasta cumplir todas.'}</p></div>`,
   piezas:`<p class="small mut">Cada área marca si hubo o no. Ausencia no es inexistencia: «Sin novedad» no exige registros; «Registrado» exige al menos uno. Las entidades con etiqueta ${pv('Q-xx')} se muestran para validarlas con el área; no son definitivas.</p>${Object.keys(COMP).map(k=>pieza(e,k)).join('')}`,
   agentes:`<div class="card"><div class="row"><h3 style="margin:0">Agentes (snapshot desde MongoDB simulado)</h3><span class="grow"></span>
   ${ag?B('+ Agregar agente','agente','agentes'):''}<button class="sec" data-act="mongo" title="Demuestra que el snapshot no cambia">Probar: cambia el dato en Mongo</button></div>
   ${ag?`<div class="sc"><table><tr><th>Empleado</th><th>Nombre</th><th>Roles</th><th>Snapshot</th><th></th></tr>${ag}</table></div>`:UM.emptyState({texto:'Este evento todavía no tiene agentes.',accionHtml:B('Agregar el primero','agente','agentes')})}
   <p class="small mut">Un agente puede tener varios roles. Agentes de otra institución ${pv('Q-20')}</p></div>
  <div class="card"><div class="row"><h3 style="margin:0">Narrativa del evento</h3><span class="grow"></span>${B('Editar narrativa','narra',['iphEditar','parte'])}</div>
   <p>${e.narrativa?esc(e.narrativa):'<span class="mut">Sin narrativa todavía.</span>'}</p><p class="small mut">La narrativa vive en el evento; cada IPH tiene la suya solo si el evento tiene más de un IPH.</p></div>`,
   historial:`<div class="card"><h3>Historial del evento</h3>${linea(S.audit.filter(a=>a.evento===e.ref).slice(-15).reverse())}</div>`}[tab];
  const tabs=[['resumen','Resumen'],['piezas','Piezas'+(pendientes(e)?` (${pendientes(e)} faltan)`:'')],['agentes','Agentes y narrativa'],['historial','Historial']];
  return `<p><button class="sec" data-act="nav" data-k="eventos">${ic('back')} Volver a eventos</button></p>
  ${d?UM.alert({html:`Posible duplicado de <b>${d.ref}</b> (mismo folio CERI o misma colonia a ≤ ${UMBRAL_MIN} min, umbral de ejemplo ${pv('Q-05')}). Plataforma puede fusionarlos en <i>Conciliación</i>.`}):''}
  ${e.canonico?UM.alert({tipo:'err',html:`Anulado por fusión. Evento canónico: ${S.eventos.find(x=>x.id===e.canonico)?.ref}`}):''}
  ${UO.guide({titulo:`Tu siguiente paso como ${DEPTS[dept].n}`,pasosHtml:pasos(e).map(x=>'<li>'+x+'</li>').join(''),sinPasos:'No tienes pendientes en este evento. Lo demás lo aportan otras áreas.',hechos:nOk,total:chk.length})}
  <div class="card"><div class="row"><h2 style="margin:0">${e.ref}</h2>${stB(e.estado)}<details class="tec"><summary>Datos técnicos</summary><span class="small mut">versión ${e.version} · ruta ${e.ruta} · ${e.id}</span></details><span class="grow"></span>
   <button class="sec" data-act="ficha" title="Todos los datos del evento en una sola hoja">Ficha / imprimir</button>
   <button class="sec" data-act="otra" title="Demuestra qué pasa si otra área guarda al mismo tiempo">Probar: otra área edita a la vez</button>
   ${B('Cerrar evento','cerrar','cerrar')}${B('Reabrir','reabrir','reabrir','','sec')}${B('Anular','anular','anular','','bad')}</div>
   ${cerr||anul?`<p class="small">Edición bloqueada. ${pv('Q-06')}</p>`:''}</div>
  ${UM.tabs({items:tabs,actual:tab,act:'tab',etiqueta:'Secciones del evento'})}
  ${T}`}

/* ===== Lector del reporte macro de CERI (xlsx, xls o csv) ===== */
const normC=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'');
const PERSONALES=['TELEFONO','NOMBRE_DEL_RELATOR','GENERO_RELATOR']; // nunca se leen ni se guardan
function cargarXLSX(){return window.XLSX?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='vendor/xlsx.full.min.js';s.onload=ok;s.onerror=()=>no(new Error('No se pudo cargar el lector de Excel.'));document.head.appendChild(s)})}
const p2=n=>String(n).padStart(2,'0');
function fechaCeri(v){ // dd/mm/aaaa hh:mm:ss a. m. | p. m., número de Excel o fecha → 'aaaa-mm-ddThh:mm'
  if(v===''||v==null)return '';
  if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);return d?`${d.y}-${p2(d.m)}-${p2(d.d)}T${p2(d.H)}:${p2(d.M)}`:''}
  if(v instanceof Date)return `${v.getFullYear()}-${p2(v.getMonth()+1)}-${p2(v.getDate())}T${p2(v.getHours())}:${p2(v.getMinutes())}`;
  const s=String(v).trim();
  let m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T]+(\d{1,2}):(\d{2})(?::\d{2})?\s*(?:([ap])\.?\s*m\.?)?/i);
  if(m){let H=+m[4];const ap=(m[6]||'').toLowerCase();if(ap==='p'&&H<12)H+=12;if(ap==='a'&&H===12)H=0;return `${m[3]}-${p2(m[2])}-${p2(m[1])}T${p2(H)}:${m[5]}`}
  m=s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);return m?`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`:''}
const numC=v=>{const n=parseFloat(String(v).replace(',','.'));return isNaN(n)?0:n};
function analizarCeri(rows,archivo){
  const cont={leidas:rows.length,sinFolio:0,noProcedente:0,sinSPM:0,duplicadas:0},flags={},ok=[],vistos=new Set();
  const cols=rows.length?Object.keys(rows[0]).map(normC):[];
  const personales=PERSONALES.filter(c=>cols.includes(c));
  if(!cols.includes('FOLIO')||!cols.includes('FECHA_Y_HORA_INICIO_LLAMADA'))return {error:'No parece el reporte de CERI: faltan las columnas FOLIO y FECHA_Y_HORA_INICIO_LLAMADA.'};
  const yaFolios=new Set([...S.pre.map(p=>String(p.folio)),...S.eventos.map(e=>String(e.origen.folio_ceri||''))]);
  const f=(fl,t)=>flags[t]=(flags[t]||0)+1;
  rows.forEach(r0=>{
    const r={};Object.keys(r0).forEach(k=>{const n=normC(k);if(!PERSONALES.includes(n))r[n]=r0[k]}); // los datos personales se descartan aquí
    const folio=String(r.FOLIO??'').trim().replace(/\.0$/,'');
    if(!folio){cont.sinFolio++;return}
    if(normC(r.ESTATUS||'')!=='TERMINO'){cont.noProcedente++;return}
    if(!/\bSPM\b/.test(String(r.CORPORACION||''))){cont.sinSPM++;return}
    if(yaFolios.has(folio)||vistos.has(folio)){cont.duplicadas++;return}
    vistos.add(folio);
    const fl=[],ini=fechaCeri(r.FECHA_Y_HORA_INICIO_LLAMADA),desp=fechaCeri(r.FECHA_Y_HORA_DESPACHO);let arr=fechaCeri(r.FECHA_Y_HORA_ACUDIO);
    if(arr&&arr===ini){arr='';fl.push('arribo_igual_a_inicio');f(0,'Arribo igual al inicio (se importa vacío)')}
    else if(arr&&desp&&arr<desp){fl.push('arribo_antes_del_despacho');f(0,'Arribo anterior al despacho (inconsistente)')}
    const x=numC(r.COORDENADA_X),y=numC(r.COORDENADA_Y);let lat='',lon='';
    if(x&&y){[lat,lon]=utm2ll(x,y)}else{fl.push('sin_geolocalizar');f(0,'Sin coordenadas (se marca «sin geolocalizar»)')}
    let cp=String(r.CODIGO_POSTAL??'').trim().replace(/\.0$/,'');if(cp==='0')cp='';
    const colO=String(r.COLONIA||'').trim(),col=CAT.colonia.find(c=>c.toLowerCase()===colO.toLowerCase())||'';
    if(colO&&!col){fl.push('colonia_fuera_de_catalogo');f(0,'Colonia que no está en el catálogo (queda pendiente)')}
    const ne=String(r.NUMERO_EXTERIOR??'').trim(),ni=String(r.NUMERO_INTERIOR??'').trim();
    if(ni&&!ne){fl.push('numeros_por_validar');f(0,'Número interior lleno y exterior vacío: posible inversión (POR VALIDAR)')}
    if(!String(r.SPM_DISTRITO||'').trim()){fl.push('sin_distrito');f(0,'Sin distrito en el reporte')}
    ok.push({folio,fecha:ini,arribo:arr,incidente:String(r.INCIDENTE||'').trim(),codigo:String(r.CODIGO||'').trim().replace(/\.0$/,''),tipo:String(r.TIPO||'').trim(),subtipo:String(r.SUBTIPO||'').trim(),prioridad:String(r.PRIORIDAD||'').trim(),
      colonia:col,coloniaOrig:colO,distrito:String(r.SPM_DISTRITO||'').trim(),sector:String(r.SPM_SECTOR??'').trim().replace(/\.0$/,''),x:x||'',y:y||'',lat,lon,
      calle:String(r.CALLE||'').trim(),cruce:String(r.CALLE_ESQUINA||'').trim(),cp,nx:ne,ni,referencia:String(r.REFERENCIA||'').trim(),flags:fl,evento:null,estado:'pendiente',
      caduca:new Date(Date.now()+CADUCA_DIAS*864e5).toISOString().slice(0,10),archivo})});
  return {ok,cont,flags,personales}}
async function leerArchivoCeri(buf,nombre){
  await cargarXLSX();
  const wb=XLSX.read(buf,{type:'array',cellDates:false});
  const hoja=wb.SheetNames.includes('Exportacion')?'Exportacion':wb.SheetNames.find(n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1}).length>1)||wb.SheetNames[0];
  const rows=XLSX.utils.sheet_to_json(wb.Sheets[hoja],{defval:'',raw:true});
  const res=analizarCeri(rows,nombre);if(res.error)return toast(res.error,1);res.hoja=hoja;vistaPrevia(res,nombre)}
function vistaPrevia(res,nombre){
  const d=$('#dlg');d.className='big';d.oncancel=null;const c=res.cont;
  const fila=(l,n,cls='')=>`<tr class="${cls}"><td>${l}</td><td style="text-align:right"><b>${n}</b></td></tr>`;
  d.innerHTML=`<form method="dialog"><div class="dh"><h3 id="dlgt">Vista previa de la importación</h3></div>
   <div class="pvb"><p class="small mut">Archivo: <b>${esc(nombre)}</b> · hoja «${esc(res.hoja)}». Nada se guarda hasta que confirmes.</p>
   <table><tr><th>Resultado</th><th></th></tr>${fila('Filas leídas',c.leidas)}${fila('Sin folio',c.sinFolio)}${fila('Excluidas: no procedentes (estatus distinto de TERMINO)',c.noProcedente)}${fila('Excluidas: no incluyen a la SSPM (sin «SPM»)',c.sinSPM)}${fila('Excluidas: folio ya existente',c.duplicadas)}${fila('Se importarán como preregistro',res.ok.length,'tot')}</table>
   ${Object.keys(res.flags).length?`<h4>Avisos de calidad</h4><ul>${Object.entries(res.flags).map(([k,n])=>`<li>${n} · ${esc(k)}</li>`).join('')}</ul>`:''}
   ${res.personales.length?`<div class="alert">Se ignoraron las columnas con datos personales: <b>${res.personales.join(', ')}</b>. No se leen ni se guardan.</div>`:''}
   ${res.ok.length?`<h4>Primeros registros</h4><div class="sc"><table><tr><th>Folio</th><th>Fecha</th><th>Incidente</th><th>Colonia</th></tr>${res.ok.slice(0,5).map(r=>`<tr><td>${r.folio}</td><td>${r.fecha.replace('T',' ')}</td><td>${esc(r.incidente)}</td><td>${esc(r.colonia||r.coloniaOrig||'—')}</td></tr>`).join('')}</table></div>`:'<p>No hay registros importables.</p>'}
   <p class="small mut">Las coordenadas UTM se convierten de forma aproximada; en producción lo hace PostGIS. Caducidad de ${CADUCA_DIAS} días <span class="b pendiente">valor de ejemplo</span>${pv('Q-29')}.</p></div>
   <div class="foot"><div class="row end"><button type="button" class="sec" onclick="$('#dlg').close()">Cancelar</button><button type="submit" ${res.ok.length?'':'disabled'}>Importar ${res.ok.length} preregistros</button></div></div></form>`;
  d.querySelector('form').onsubmit=x=>{x.preventDefault();d.close();S.pre=[...res.ok,...S.pre];aud(null,'INSERT','evento_preregistro_ceri',`Importados ${res.ok.length} preregistros desde ${nombre}`);render();toast(`${res.ok.length} preregistros importados.`,'ok')};
  d.showModal()}
const GUIA={
 ceri:{n:'CERI / origen',pasos:[['Importa el reporte de CERI','En «Preregistros CERI» sube el Excel o el CSV. Revisa la vista previa y confirma.','pre'],['Revisa los avisos','Mira «sin geolocalizar», «arribo igual a inicio» o «colonia fuera de catálogo». Son datos a corregir, no errores tuyos.','pre'],['Promueve a evento solo lo que tenga consecuencias','Un preregistro se vuelve evento cuando un área le agrega algo. Si nadie lo hace, caduca.','pre'],['Completa el origen','Folio, fecha y hora, motivo y ubicación. Lo demás lo agregan las otras áreas.','eventos'],['No captures teléfono ni nombre del relator','Esos datos nunca se importan ni se guardan.',null]]},
 tel:{n:'Teléfono Comunitario',pasos:[['Hoy solo puedes consultar','Si Teléfono Comunitario levanta eventos o solo supervisa está por decidir (Q-01, Q-02, Q-03).','perm'],['Cuéntanos cómo trabajas','Llena tu hoja de validación: qué aportas, cuándo y qué folio usas.','hoja']]},
 policia:{n:'Policía',pasos:[['Busca tu evento','En «Eventos» filtra por folio o colonia. Si no existe, usa «Levantar evento (Ruta B)».','eventos'],['Completa el origen si falta','Tipo de origen, fecha y ubicación.',null],['Agrega a los agentes y sus roles','En la pestaña «Agentes y narrativa». Se congela una copia de sus datos.',null],['Marca cada pieza','En «Piezas»: registra lo que hubo (detenidos, delitos, bienes, vehículos, personas, uso de la fuerza) o marca «Sin novedad». Ausencia no es inexistencia.',null],['Registra el parte informativo','Obligatorio si hubo detención, aseguramiento, emergencia, resguardo o entrega de hechos.',null],['Deja el IPH en borrador','Jurídico asigna tipo, fuero y autoridad después.',null]]},
 coord:{n:'Coordinación General',pasos:[['Agrega a los agentes del evento','Con sus roles (primer respondiente, responsable de turno…).','eventos'],['Captura la parte informativa','Su número y nombre salen del agente; no se vuelven a escribir.',null],['Dinos si es área o unidad','Q-02: llena tu hoja de validación.','hoja']]},
 barandilla:{n:'Barandilla',pasos:[['Registra al detenido','En «Piezas», Detención y Detenido. El ID de SIPROB lo asignas cuando lo registres allá.','eventos'],['Captura sus anexos','Pertenencias, familiar de contacto, condición y traslado. Están marcados POR VALIDAR: dinos si SIPROB ya los captura.',null],['Avisa a Jurídico','Cada detenido debe quedar asignado a exactamente un IPH.',null]]},
 juridico:{n:'Jurídico',pasos:[['Abre el IPH en borrador','En «Piezas» > IPH, edita los datos de puesta a disposición y fiscal.','eventos'],['Asigna tipo, fuero y autoridad destino','Sin estos tres datos el IPH no se puede firmar.',null],['Asigna cada detenido y cada aseguramiento a su IPH','Un detenido pertenece a un solo IPH. Un aseguramiento sin detenido lleva su propio IPH.',null],['Registra aseguramientos y bienes','Armas y sustancias solo por aseguramiento; vehículos y objetos por aseguramiento o resguardo.',null],['Firma y envía el IPH','Pasa de borrador a firmado y luego a enviado.',null],['Reabre si hay que corregir','Solo Jurídico reabre un evento cerrado.',null]]},
 plataforma:{n:'Plataforma',pasos:[['Concilia los provisionales','En «Conciliación», fusiona cada borrador sin origen con su evento real. La operación es atómica y queda auditada.','conc'],['Revisa que el evento esté completo','En el detalle, «¿Se puede cerrar?» te dice qué falta.','eventos'],['Cierra el evento','Solo Plataforma cierra. Pide confirmación y se puede deshacer.',null],['Anula si fue un error','Queda en la auditoría.',null]]},
 analista:{n:'Analista',pasos:[['Consulta los eventos y su resumen automático','Los indicadores («Hubo detenidos», «Hubo aseguramientos»…) se calculan solos.','eventos'],['Imprime la ficha','Botón «Ficha / imprimir» en el detalle del evento.',null],['Danos tu opinión','Llena la hoja de validación.','hoja']]}};
const CICLO=[['Nace el evento','Desde CERI (preregistro) o desde cualquier formulario autorizado. Nace con lo mínimo: origen y fecha.'],['Se arma por aportaciones','Cada área agrega lo suyo, una sola vez. Lo ya capturado no se vuelve a pedir.'],['Cada pieza se marca','Pendiente, registrado o sin novedad. Ausencia no es inexistencia.'],['Jurídico enruta el IPH','Tipo, fuero y autoridad destino; cada detenido a un solo IPH.'],['Plataforma concilia y cierra','Fusiona duplicados y cierra cuando no quedan pendientes.'],['Jurídico reabre si hace falta','Todo cambio queda en la auditoría, que no se puede borrar.']];
const FAQ=[['¿Por qué un botón está gris?','Porque esa acción le toca a otra área. Debajo del botón dice a cuál. Cambia de departamento arriba para ver cómo se ve para cada quien.'],['¿Qué significa POR VALIDAR?','Que todavía no se decide. Lleva la pregunta (Q-xx) que lo desbloquea. Pasa el cursor para leerla.'],['¿Se pierde lo que capturo?','Se guarda en este navegador. Para llevarlo a otro equipo usa Auditoría > Exportar datos.'],['¿Puedo deshacer?','Sí, el último cambio, con el botón «Deshacer» del aviso. Queda registrado en la auditoría.'],['¿Todo es real?','No. Todos los datos son sintéticos y los catálogos marcados «ejemplo» son ficticios.']];
function vGuia(){
  const orden=[dept,...DK.filter(k=>k!==dept)];
  return `<div class="card"><h2>El camino de un evento</h2><ol class="ciclo">${CICLO.map(([t,x])=>`<li><b>${t}</b><div class="small mut">${x}</div></li>`).join('')}</ol></div>
  ${orden.map((k,i)=>{const g=GUIA[k];return `<details class="card gd" ${i===0?'open':''}><summary><b>${g.n}</b>${k===dept?'<span class="b abierto">tu departamento</span>':''}</summary><ol class="pasos-l">${g.pasos.map(([t,x,go])=>`<li><b>${t}</b><div class="small mut">${x}</div>${go?`<button class="sec sm" data-act="nav" data-k="${go}">Ir a ${{pre:'Preregistros',eventos:'Eventos',conc:'Conciliación',hoja:'la hoja de validación',perm:'Permisos'}[go]}</button>`:''}</li>`).join('')}</ol></details>`}).join('')}
  <div class="card"><h2>Preguntas frecuentes</h2>${FAQ.map(([q,r])=>`<details class="fi"><summary><b>${q}</b></summary><p>${r}</p></details>`).join('')}<p><button class="sec" data-act="tour">Repetir el recorrido guiado</button></p></div>`}
function vPre(){
  return `<div class="card"><h2>Preregistros CERI <span class="small mut">(sin teléfono ni relator; solo procedentes con SPM)</span></h2>
  <p class="small">Caduca si ningún área le agrega una consecuencia: <b>${CADUCA_DIAS} días</b> <span class="b pendiente">VALOR DE EJEMPLO</span>${pv('Q-29')}. Las coordenadas UTM se convierten a latitud/longitud de forma aproximada; en producción lo hace PostGIS. Si la hora de arribo es igual a la de inicio, se importa vacía.</p>
  <div class="card soft noprint"><h3>Importar el reporte de CERI</h3><p class="small">Sube el Excel (.xlsx o .xls) o el CSV del reporte macro. Se aplican las reglas de <code>05-ceri</code>: solo procedentes con SPM, sin folios repetidos, sin teléfono ni relator.</p><div class="row"><label class="btnlike" style="cursor:pointer">${ic('plus')} Elegir archivo<input type="file" accept=".xlsx,.xls,.csv" data-f="ceri" hidden></label><button class="sec" data-act="muestraCeri">Probar con la muestra sintética</button></div></div>
  <div class="sc"><table class="rs"><tr><th>Folio</th><th>Fecha</th><th>Incidente</th><th>Colonia</th><th>Distrito/Sector</th><th>Avisos</th><th>Vence</th><th></th></tr>
  ${S.pre.map(p=>`<tr><td data-l="Folio">${p.folio}</td><td data-l="Fecha">${p.fecha.replace('T',' ')}</td><td data-l="Incidente">${p.incidente}</td><td data-l="Colonia">${esc(p.colonia||p.coloniaOrig||'—')}</td><td data-l="Distrito/Sector">${esc(p.distrito||'—')} / ${esc(p.sector||'—')}</td><td data-l="Avisos">${(p.flags||[]).map(f=>`<span class="b pendiente" title="${esc(f)}">${esc(f.replace(/_/g,' '))}</span>`).join(' ')||'—'}</td><td data-l="Vence">${p.evento?'—':esc(p.caduca||'—')}</td>
   <td>${p.evento?`<span class="b registrado">promovido → ${S.eventos.find(e=>e.id===p.evento).ref}</span>`:B('Promover a evento','promover','crearA',`data-k="${p.folio}"`)}</td></tr>`).join('')}</table></div></div>`}

function vConc(){
  const prov=S.eventos.filter(e=>e.estado==='borrador_sin_origen'),dest=S.eventos.filter(e=>!['borrador_sin_origen','anulado','cerrado'].includes(e.estado));
  return `<div class="card"><h2>Bandeja de conciliación y fusión</h2>
  <p class="small">Plataforma fusiona un provisional con el evento real: se reasignan los hijos, el provisional queda <i>anulado</i> con su evento canónico y queda en auditoría. Operación atómica. Quién y en cuánto tiempo ${pv('Q-05')}.</p>
  ${prov.length?`<div class="sc"><table class="rs"><tr><th>Provisional</th><th>Sugerencia</th><th>Fusionar en</th><th></th></tr>${prov.map(p=>{const d=duplicado(p);return `<tr><td data-l="Provisional"><b>${p.ref}</b> ${stB(p.estado)}<div class="small mut">${esc(p.origen.colonia||'sin colonia')} · ${p.origen.fecha_evento||'sin fecha'}</div></td>
   <td data-l="Sugerencia">${d?'Posible duplicado de '+d.ref:'—'}</td><td data-l="Fusionar en"><select id="f-${p.id}">${dest.map(x=>`<option value="${x.id}" ${d&&d.id===x.id?'selected':''}>${x.ref}</option>`).join('')}</select></td>
   <td>${B('Fusionar','fusionar','fusionar',`data-id="${p.id}"`)}</td></tr>`}).join('')}</table></div>`:`<div class="vacio">${ic('inbox')}<p>No hay eventos provisionales por conciliar.</p></div>`}</div>`}

const SIM={S:'Sí',P:'Propuesta','?':'Por validar','-':'·'};
function vPerm(){
  return `<div class="card"><h2>Matriz de permisos <span class="small mut">(PROPUESTA)</span></h2><p class="small mut">Sí = lo dice la spec · Propuesta = propuesta de trabajo · Por validar = falta decidirlo · punto = no le corresponde.</p><div class="sc"><table>
  <tr><th>Acción</th>${DK.map(k=>`<th>${DEPTS[k].n}</th>`).join('')}</tr>
  ${Object.values(PERM).map(p=>`<tr><td>${p.l} ${pv(p.q)}</td>${p.r.map((v,i)=>`<td class="${DK[i]===dept?'activa':''}">${SIM[v]}</td>`).join('')}</tr>`).join('')}</table></div></div>`}

const hojaKey=d=>'pimsy_hoja_'+d;
function hojaLoad(d){try{return JSON.parse(localStorage.getItem(hojaKey(d))||'{}')}catch(x){return {}}}
function hojaSave(d,o){try{localStorage.setItem(hojaKey(d),JSON.stringify(o))}catch(x){}}
function vHoja(){
  const h=hojaLoad(dept),FF=[['aporta','¿Qué aporta tu departamento al evento?'],['momento','¿En qué momento lo aporta?'],['necesita','¿Qué necesita ver de los demás?'],['noCorresponde','¿Qué NO le corresponde a tu departamento?'],['faltan','¿Qué campos faltan o sobran en los formularios?'],['comentarios','Comentarios']];
  return `<div class="card hoja"><div class="row"><h2 style="margin:0">Hoja de validación — ${DEPTS[dept].n}</h2><span style="flex:1"></span>
   <button data-act="expJson">Exportar JSON</button><button class="sec" data-act="print">Imprimir</button></div>
   <p class="small mut noprint">Se guarda sola en este navegador.</p>
   ${FF.map(([k,l])=>`<label><b>${l}</b></label><textarea data-h="${k}">${esc(h[k]||'')}</textarea>`).join('')}
   <h3>Revisión de formularios</h3><p class="small mut">Marca si a cada formulario le falta o le sobra algún campo. Los tuyos van primero.</p>
   ${Object.keys(ENT).sort((p,q)=>(can(ENT[q].act==='iphEditar'?['iphEditar','iphAsignar']:ENT[q].act).ok?1:0)-(can(ENT[p].act==='iphEditar'?['iphEditar','iphAsignar']:ENT[p].act).ok?1:0)).map(en=>{const E=ENT[en],mio=can(en==='iph'?['iphEditar','iphAsignar']:E.act).ok,n=E.fields({comp:Object.fromEntries(Object.keys(COMP).map(k=>[k,{hijos:[]}])),agentes:[]}).filter(f=>f.k&&f.t!=='calc').length;
     return `<div class="rev"><div><b>${E.n}</b>${mio?'<span class="tu">te toca</span>':''}${E.pv?pv(E.pv):''}<div class="small mut">${n} campos</div></div>
      <select data-h="rev_${en}" aria-label="Revisión de ${esc(E.n)}"><option value="">Sin revisar</option>${['Está bien','Falta algún campo','Sobra algún campo','No es de mi área'].map(o=>`<option ${h['rev_'+en]===o?'selected':''}>${o}</option>`).join('')}</select>
      <textarea data-h="revn_${en}" placeholder="¿Qué campo falta o sobra? ¿Cómo lo llaman en tu área?">${esc(h['revn_'+en]||'')}</textarea></div>`}).join('')}
   <h3>Comentarios por campo</h3>${(()=>{const c=comLoad(),ks=Object.keys(c);return ks.length?ks.map(k=>{const i=infoCampo(k);return `<div class="rev"><div><b>${esc(i.formulario)} · ${esc(i.campo)}</b></div>${UA.button({label:'Quitar',act:'comDel',kind:'sec',size:'sm',attrs:`data-k="${esc(k)}"`})}<p style="margin:0;grid-column:1/-1">${esc(c[k])}</p></div>`}).join(''):'<p class="small mut">Aún no comentaste ningún campo. En cualquier formulario, usa el icono de globo junto al nombre del campo.</p>'})()}
   <h3>Preguntas abiertas de tu área</h3>
   ${QDEPT[dept].map(q=>`<label><b>${q}</b> ${esc(Q[q])}</label><textarea data-h="${q}">${esc(h[q]||'')}</textarea>`).join('')}</div>`}
function auditTabla(a){return a.length?`<div class="sc"><table><tr><th>#</th><th>Cuándo</th><th>Evento</th><th>Op.</th><th>Tabla</th><th>Detalle</th><th>Área</th></tr>${a.map(x=>`<tr><td>${x.n}</td><td>${x.en.slice(11,19)}</td><td>${x.evento}</td><td>${x.op}</td><td>${x.tabla}</td><td>${esc(x.det)}</td><td>${DEPTS[x.area].n}</td></tr>`).join('')}</table></div>`:'<p class="mut">Sin movimientos.</p>'}
function vAud(){return `<div class="card noprint"><h2>Respaldo de datos</h2><p class="small mut">Guarda todos los eventos capturados en un archivo para llevarlos a otra computadora o compartirlos con tu equipo.</p>
   <div class="row"><button data-act="expDatos">Exportar datos (JSON)</button><label class="btnlike sec">Importar datos<input type="file" accept="application/json" data-f="imp" hidden></label></div></div>
  <div class="card"><h2>Auditoría <span class="small mut">(solo se agrega; sin UPDATE ni DELETE)</span></h2>${auditTabla(S.audit.slice().reverse())}</div>`}

/* ===== Acciones de dominio ===== */
function entForm(e,ent,hid,preset){
  const E=ENT[ent],h=hid?findH(e,hid):null;
  const values=h?JSON.parse(JSON.stringify(h.d)):{...(preset||{})};
  if(!h&&ent==='arma'&&!values.cantidad)values.cantidad='1';
  abrirForm({titulo:(h?'Editar: ':'Registrar: ')+E.n,pv:E.pv,e,fields:E.fields(e),values,entKey:ent,otro:!h,draftKey:h?null:'pimsy_borrador_'+e.id+'_'+ent+'_'+(preset&&preset.pertenece_a||''),
    aviso:E.restr?'Datos sensibles: acceso restringido. '+pv('Q-33'):'',ok:(vals,otro)=>{const r=guardarEnt(e,ent,h,vals);if(otro&&r)setTimeout(()=>entForm(e,ent,null,preset),80)}})}
function guardarEnt(e,ent,h,vals){
  const E=ENT[ent];let dest=E.comp;
  if(ent==='objeto'||ent==='vehiculo')dest=vals.pertenece_a==='Resguardo'?'resguardo':'aseguramiento';
  const act=ent==='iph'?['iphEditar','iphAsignar']:E.act,keys=E.fields(e).map(f=>f.k).filter(Boolean);
  return mut(e,act,(h?'Actualizado: ':'Registrado: ')+E.n,()=>{
    if(h){
      const from=compOf(e,h.id);if(from&&from!==dest){e.comp[from].hijos=e.comp[from].hijos.filter(x=>x.id!==h.id);e.comp[dest].hijos.push(h)}
      const keep={};Object.keys(h.d).forEach(k=>{if(!keys.includes(k))keep[k]=h.d[k]});h.d={...keep,...vals};
    }else{
      const n=hijo({ent,d:vals});
      if(ent==='iph'){n.estado='borrador';n.d.folio_sistema='IPH-'+String(Date.now()).slice(-6)}
      if(E.iph)n.iphId=null;
      e.comp[dest].hijos.push(n)}
    e.comp[dest].estado='registrado'},dest)}
function quitarEnt(e,k,id){
  const h=findH(e,id),E=ENT[h.ent];
  const dep=Object.keys(e.comp).flatMap(c=>e.comp[c].hijos).find(x=>x.id!==id&&Object.values(x.d).some(v=>v===id||(Array.isArray(v)&&v.includes(id)))||x.iphId===id);
  if(dep)return toast(`No se puede quitar: «${ENT[dep.ent].n}» depende de este registro. Quita o cambia ese primero.`,1);
  confirmar('Quitar registro',`Se quitará «${esc(E.res(h.d,e,h))}». Queda en la auditoría.`,'Quitar',()=>mut(e,h.ent==='iph'?['iphEditar','iphAsignar']:E.act,'Quitado: '+E.n,()=>{e.comp[k].hijos=e.comp[k].hijos.filter(x=>x.id!==id)},k),true)}
function agenteForm(e,a){
  const roles=a?[{k:'roles',l:'Roles en el evento',t:'multi',o:'rol_agente',pv:'Q-08',ayuda:'Un agente puede tener varios roles.'}]:AGENTE;
  abrirForm({entKey:'agente',titulo:a?'Roles de '+nomAg(a):'Agregar agente',e,fields:roles,values:a?{roles:[...(a.roles||[])]}:{es_externo:'No'},
    aviso:a?'':'Al agregarlo se congela un snapshot de sus datos; si cambian en MongoDB, el snapshot no se modifica.',
    ok:vals=>mut(e,'agentes',a?'Roles de agente actualizados':'Agente agregado con snapshot',()=>{
      if(a){a.roles=vals.roles;return}
      if(vals.es_externo==='Sí'){e.agentes.push({id:uid(),emp:'',es_externo:true,institucion_externa:vals.institucion_externa,nombre:vals.nombre,apellido_paterno:vals.apellido_paterno||'',apellido_materno:vals.apellido_materno||'',puesto:vals.puesto||'',numero_empleado:vals.numero_empleado||'',distrito:'',area:'',subarea:'',unidad:'',roles:vals.roles||[],en:now(),area_aporta:dept})}
      else{if(e.agentes.some(z=>z.emp===vals.agente_mongo))throw new Error('El agente ya está en el evento.');e.agentes.push(agSnap(vals.agente_mongo,vals.roles||[]))}},'agente_involucrado')})}
function fusion(pid,cid){
  const P=S.eventos.find(e=>e.id===pid),C=S.eventos.find(e=>e.id===cid);
  if(!P||!C||P===C)return toast('Selecciona un evento canónico distinto.',1);
  snapUndo();
  const cp=JSON.parse(JSON.stringify([P,C])),[p,c]=cp; // atómico: se opera sobre copias y luego se confirma
  Object.keys(COMP).forEach(k=>{c.comp[k].hijos.push(...p.comp[k].hijos);p.comp[k].hijos=[];if(c.comp[k].hijos.length)c.comp[k].estado='registrado';else if(p.comp[k].estado==='sin_novedad'&&c.comp[k].estado==='pendiente')c.comp[k].estado='sin_novedad'});
  p.agentes.forEach(a=>{if(!c.agentes.some(x=>x.id===a.id||(x.emp&&x.emp===a.emp)))c.agentes.push(a)});p.agentes=[];
  p.estado='anulado';p.canonico=c.id;p.version++;c.version++;
  S.eventos[S.eventos.indexOf(P)]=p;S.eventos[S.eventos.indexOf(C)]=c;
  aud(c,'FUSION','evento_fusion',`${p.ref} → ${c.ref}`);aud(p,'UPDATE','evento','anulado por fusión');
  render();toast(`${p.ref} fusionado en ${c.ref}.`,'ok',UNDO)}
function mkEv(ruta){const n=S.eventos.length+1;return {id:uid(),ref:'EVT-'+String(n).padStart(4,'0'),estado:'abierto',ruta,version:1,creada:dept,narrativa:'',
  origen:{municipio:'Juárez',entidad:'Chihuahua'},agentes:[],comp:comps(),canonico:null}}
function crearA(o,pre){
  if(o.folio_ceri&&S.eventos.some(z=>z.origen.folio_ceri===o.folio_ceri))return toast('Folio CERI duplicado: se rechaza (REQ-EVT-01).',1);
  const n=mkEv('A');n.origen={municipio:'Juárez',entidad:'Chihuahua',...o};
  const d=duplicado(n);S.eventos.push(n);if(pre)pre.evento=n.id;aud(n,'INSERT','evento','Ruta A');
  view='det';cur=n.id;tab='resumen';seenVer=n.version;render();
  toast(`${n.ref} creado (abierto).`+(d?` Alerta: posible duplicado de ${d.ref}.`:''),d?1:'ok')}
function desdePre(p){
  const [la,lo]=p.lat!==undefined&&p.lat!==''?[p.lat,p.lon]:(p.x&&p.y?utm2ll(p.x,p.y):['','']);
  return {tipo_origen:'Llamada de emergencia / despacho CERI',medio_conocimiento:'CERI',folio_ceri:p.folio,motivo:(p.codigo&&motivoDe(p.codigo))||CAT.motivo.find(m=>m.includes(p.incidente.split(',')[0]))||p.incidente,
   fecha_evento:p.fecha.slice(0,10),hora_evento:p.fecha.slice(11),fecha_hora_conocimiento:p.fecha,fecha_hora_arribo:p.arribo&&p.arribo!==p.fecha?p.arribo:'',
   calle:p.calle,cruce_1:p.cruce,numero_exterior:p.nx,numero_interior:p.ni||'',colonia:p.colonia,codigo_postal:p.cp,referencia:p.referencia||'REFERENCIA FICTICIA',distrito:p.distrito,sector:p.sector,latitud:la,longitud:lo,fuente_geocodificacion:la===''?'':'Manual'}}

/* ===== Búsqueda global ===== */
const sinAcento=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function buscarGlobal(q){
  const n=sinAcento(q.trim());if(n.length<2)return null;
  const R=[],push=x=>{if(R.length<25)R.push(x)},uuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(v);
  S.eventos.forEach(e=>{const o=e.origen;
    if(sinAcento([e.ref,o.folio_ceri,o.motivo,o.colonia,o.calle,e.narrativa].join(' ')).includes(n))push({tipo:'Evento',titulo:e.ref+(o.folio_ceri?' · folio '+o.folio_ceri:''),detalle:motCorto(o.motivo)||o.colonia||'sin origen',act:'abrirRes',attrs:`data-id="${e.id}" data-k="resumen"`});
    e.agentes.forEach(a=>{if(sinAcento([nomAg(a),a.numero_empleado,a.puesto].join(' ')).includes(n))push({tipo:'Agente',titulo:nomAg(a),detalle:e.ref,act:'abrirRes',attrs:`data-id="${e.id}" data-k="agentes"`})});
    Object.keys(e.comp).forEach(k=>e.comp[k].hijos.forEach(h=>{const E=ENT[h.ent],res=E.res(h.d,e,h);
      if(sinAcento([E.n,res,...Object.values(h.d).filter(v=>typeof v==='string'&&!uuid(v))].join(' ')).includes(n))push({tipo:E.n,titulo:res,detalle:e.ref+' · '+COMP[k].n,act:'abrirRes',attrs:`data-id="${e.id}" data-k="piezas"`})}))});
  S.pre.forEach(p=>{if(sinAcento([p.folio,p.incidente,p.colonia].join(' ')).includes(n))push({tipo:'Preregistro CERI',titulo:p.folio+' · '+p.incidente,detalle:p.colonia,act:'nav',attrs:'data-k="pre"'})});
  return R}
function mostrarResultados(){
  const q=$('#gq').value,r=buscarGlobal(q),box=$('#gres');
  if(r===null){box.hidden=true;return}
  box.innerHTML=UO.searchResults({items:r,vacio:'Sin resultados. Prueba con un folio, un nombre, unas placas o una colonia.'});box.hidden=false}

/* ===== Sesión de validación con un departamento ===== */
const TAREAS={
 ceri:[{id:'c1',texto:'Importa la muestra sintética del reporte de CERI',ir:{view:'pre'}},{id:'c2',texto:'Revisa los avisos de calidad de la vista previa',ir:{view:'pre'}},{id:'c3',texto:'Promueve un preregistro a evento',ir:{view:'pre'}},{id:'c4',texto:'Completa el origen de EVT-0008',ir:{ref:'EVT-0008',tab:'resumen'}},{id:'c5',texto:'Comenta en la hoja qué falta del reporte de CERI',ir:{view:'hoja'}}],
 tel:[{id:'t1',texto:'Abre EVT-0001 y mira qué botones tienes habilitados',ir:{ref:'EVT-0001',tab:'resumen'}},{id:'t2',texto:'Revisa la matriz de permisos: ¿qué debería tocarte?',ir:{view:'perm'}},{id:'t3',texto:'Cuéntanos en la hoja cómo trabaja Teléfono Comunitario',ir:{view:'hoja'}}],
 policia:[{id:'p1',texto:'En EVT-0004 registra la parte informativa',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'p2',texto:'En EVT-0004 marca «Sin novedad» en las piezas donde no hubo nada',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'p3',texto:'En EVT-0005 registra otro vehículo por aseguramiento',ir:{ref:'EVT-0005',tab:'piezas'}},{id:'p4',texto:'En EVT-0008 registra un quejoso o denunciante',ir:{ref:'EVT-0008',tab:'piezas'}},{id:'p5',texto:'Comenta en cualquier campo que falte o sobre (icono de globo)',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'p6',texto:'Cierra la sesión llenando tu hoja de validación',ir:{view:'hoja'}}],
 coord:[{id:'o1',texto:'Agrega un agente a EVT-0008 con sus roles',ir:{ref:'EVT-0008',tab:'agentes'}},{id:'o2',texto:'Captura la parte informativa de EVT-0008',ir:{ref:'EVT-0008',tab:'piezas'}},{id:'o3',texto:'Dinos en la hoja si Coordinación es área o unidad',ir:{view:'hoja'}}],
 barandilla:[{id:'b1',texto:'En EVT-0004 captura la pertenencia de un detenido',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'b2',texto:'Captura la condición del detenido (datos sensibles)',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'b3',texto:'Captura el traslado de un detenido',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'b4',texto:'Dinos en la hoja qué de esto ya captura SIPROB',ir:{view:'hoja'}}],
 juridico:[{id:'j1',texto:'En EVT-0004 revisa y firma el IPH por delito federal',ir:{ref:'EVT-0004',tab:'piezas'}},{id:'j2',texto:'En EVT-0005 crea un IPH y asígnalo al aseguramiento sin detenido',ir:{ref:'EVT-0005',tab:'piezas'}},{id:'j3',texto:'Reabre EVT-0007 (ya está cerrado)',ir:{ref:'EVT-0007',tab:'resumen'}},{id:'j4',texto:'Comenta en la hoja qué campos del IPH faltan',ir:{view:'hoja'}}],
 plataforma:[{id:'l1',texto:'Compara y fusiona EVT-0003 con EVT-0001',ir:{view:'conc'}},{id:'l2',texto:'Cierra EVT-0006, que ya está completo',ir:{ref:'EVT-0006',tab:'resumen'}},{id:'l3',texto:'Prueba «Deshacer» después de cerrar',ir:{ref:'EVT-0006',tab:'resumen'}},{id:'l4',texto:'Dinos en la hoja cómo quieren conciliar y en cuánto tiempo',ir:{view:'hoja'}}],
 analista:[{id:'a1',texto:'Abre el tablero y revisa los números',ir:{view:'tablero'}},{id:'a2',texto:'Imprime la ficha de EVT-0001',ir:{ref:'EVT-0001',tab:'resumen'}},{id:'a3',texto:'Dinos en la hoja qué indicadores necesitas',ir:{view:'hoja'}}]};
let SES=null;
const sesLoad=()=>{try{return JSON.parse(localStorage.getItem('pimsy_sesion')||'null')}catch(e){return null}};
const sesSave=()=>{try{localStorage.setItem('pimsy_sesion',JSON.stringify(SES))}catch(e){}};
function renderSesion(){
  const el=$('#sesion');if(!SES||!SES.activa){el.hidden=true;el.innerHTML='';return}
  const T=TAREAS[SES.dept],hechas=T.filter(t=>SES.hechas[t.id]).length;
  el.innerHTML=UO.taskPanel({titulo:'Sesión: '+DEPTS[SES.dept].n,tareas:T.map(t=>({id:t.id,texto:t.texto,hecha:!!SES.hechas[t.id]})),hechas,total:T.length,colapsado:!!SES.oculto});el.hidden=false}
function irA(ir){
  if(ir.ref){const e=S.eventos.find(z=>z.ref===ir.ref);if(!e)return toast('Ese evento ya no existe.',1);cur=e.id;view='det';tab=ir.tab||'resumen';seenVer=e.version}else{view=ir.view}
  render();scrollTo(0,0)}
function iniciarSesion(k){
  seed();dept=k;try{localStorage.setItem('pimsy_dept',k)}catch(e){}
  SES={activa:true,dept:k,hechas:{},oculto:false};sesSave();irA(TAREAS[k][0].ir);toast('Sesión iniciada. Sigue la lista de tareas.')}

/* ===== Clics y teclado ===== */
document.addEventListener('click',x=>{
  const cm=x.target.closest('[data-com]');if(cm){abrirComentario(cm.dataset.com,cm.dataset.etq);return}
  if(!x.target.closest('.gsearch'))$('#gres').hidden=true;
  const mz=x.target.closest('[data-matiz]');if(mz){THEME.set({hue:+mz.dataset.matiz});return}
  const t=x.target.closest('[data-act]');if(!t||t.disabled)return;
  const m=t.closest('details.menu');if(m)m.open=false;
  const a=t.dataset.act,k=t.dataset.k,id=t.dataset.id,e=cur&&ev();
  const go=(v,i)=>{if(v==='det'&&cur&&i===undefined){view=v;render();scrollTo(0,0);return}view=v;if(i!==undefined){cur=i;tab='resumen';const z=ev();seenVer=z?z.version:0}render();scrollTo(0,0)};
  switch(a){
   case 'ficha':return go('ficha');
   case 'tab':tab=k;return render();
   case 'abrirRes':{$('#gres').hidden=true;$('#gq').value='';cur=id;view='det';tab=k||'resumen';const z=ev();seenVer=z?z.version:0;render();return scrollTo(0,0)}
   case 'comGuardar':return guardarComentario(false);
   case 'comBorrar':return guardarComentario(true);
   case 'comDel':{const o=comLoad();delete o[k];comSave(o);return render()}
   case 'sesion':return elegirRol(false,'sesion');
   case 'sesionToggle':SES.oculto=!SES.oculto;sesSave();return renderSesion();
   case 'sesionFin':SES.activa=false;sesSave();view='hoja';render();return toast('Sesión terminada. Llena tu hoja de validación.');
   case 'tareaIr':{const t=TAREAS[SES.dept].find(z=>z.id===k);return t&&irA(t.ir)}
   case 'limpiar':FL={q:'',st:'',mio:false,listo:false,dup:false};return render();
   case 'kpi':{const [f,v]=k.split(':');if(f==='todos')FL={q:'',st:'',mio:false,listo:false,dup:false};else if(f==='st')FL.st=FL.st===v?'':v;else FL[f]=!FL[f];return render()}
   case 'heroOff':try{localStorage.setItem('pimsy_hero','1')}catch(x){}return render();
   case 'nav':if(k==='reset')return confirmar('Reiniciar datos','Se borran los eventos que capturaste y vuelven los 3 de ejemplo. Tu hoja de validación no se borra.','Reiniciar',()=>{try{localStorage.removeItem('pimsy_estado3')}catch(x){}seed();view='eventos';cur=null;render();toast('Datos de ejemplo restaurados.')},true);return go(k);
   case 'abrir':return go('det',id);
   case 'otra':e.version++;aud(e,'UPDATE','evento','Edición simulada de otra área');return toast('Otra área guardó. Tu pantalla ya está desactualizada: intenta guardar.');
   case 'nuevoA':return abrirForm({entKey:'evento',titulo:'Nuevo evento (Ruta A, origen primero)',e:null,fields:EVENTO,values:{municipio:'Juárez',entidad:'Chihuahua'},
     aviso:'Basta con tipo de origen y fecha: el resto lo pueden completar después las áreas autorizadas (registro mínimo).',okLabel:'Crear evento',ok:vals=>crearA(vals)});
   case 'nuevoB':{const n=mkEv('B');n.estado='borrador_sin_origen';aud(n,'INSERT','evento','Ruta B: provisional');S.eventos.push(n);go('det',n.id);return toast(`${n.ref} creado en borrador sin origen.`)}
   case 'promover':{const p=S.pre.find(z=>z.folio===k);return crearA(desdePre(p),p)}
   case 'origen':return abrirForm({entKey:'evento',titulo:'Datos del evento, origen y ubicación',e,fields:EVENTO,values:JSON.parse(JSON.stringify(e.origen)),ok:vals=>{
       if(vals.folio_ceri&&S.eventos.some(z=>z.id!==e.id&&z.origen.folio_ceri===vals.folio_ceri))return toast('Folio CERI duplicado: se rechaza (REQ-EVT-01).',1);
       mut(e,['crearA','levantarB'],'Origen y ubicación actualizados',()=>{e.origen=vals})}});
   case 'agente':return agenteForm(e,null);
   case 'rolesAg':return agenteForm(e,e.agentes.find(z=>z.id===id));
   case 'quitarAg':return confirmar('Quitar agente','Se quitará el agente del evento.','Quitar',()=>mut(e,'agentes','Agente quitado',()=>{if(hs(e,'iph','iph').some(i=>i.d.agente_puesta===id)||Object.values(e.comp).some(c=>c.hijos.some(h=>Object.values(h.d).includes(id))))throw new Error('Hay registros que usan a este agente (puesta, aseguramiento, parte…). Cámbialos primero.');e.agentes=e.agentes.filter(z=>z.id!==id)},'agente_involucrado'),true);
   case 'mongo':AGENTES_MONGO['E-0001'].distrito=AGENTES_MONGO['E-0001'].distrito==='CENTRO'?'SUR':'CENTRO';render();return toast('Cambió E-0001 en Mongo: los snapshots ya guardados no cambian.');
   case 'sn':return mut(e,COMP[k].a,`${COMP[k].n}: sin novedad`,()=>{e.comp[k].estado='sin_novedad'},k);
   case 'pend':return mut(e,COMP[k].a,`${COMP[k].n}: pendiente`,()=>{e.comp[k].estado='pendiente'},k);
   case 'add':return entForm(e,t.dataset.ent,null,k==='resguardo'&&(t.dataset.ent==='objeto'||t.dataset.ent==='vehiculo')?{pertenece_a:'Resguardo'}:undefined);
   case 'edit':return entForm(e,findH(e,id).ent,id);
   case 'quitar':return quitarEnt(e,k,id);
   case 'asigIph':{const ips=hs(e,'iph','iph');if(!ips.length)return toast('Primero crea un IPH en la pieza «IPH».',1);const h=findH(e,id);
     return abrirForm({titulo:'Asignar a un IPH',e,fields:[{k:'iph',l:'IPH',t:'select',o:oIph,r:true,ayuda:'Un detenido pertenece a exactamente un IPH.'}],values:{iph:h.iphId||''},ok:vals=>
       mut(e,ENT[h.ent].act,'Asignado a IPH '+short(vals.iph),()=>{if(ips.find(i=>i.id===vals.iph).estado!=='borrador')throw new Error('Ese IPH ya está firmado.');h.iphId=vals.iph},h.ent)})}
   case 'firma':{const ip=findH(e,id);return mut(e,'iphEditar','IPH firmado',()=>{if(!ip.d.tipo||!ip.d.fuero||!ip.d.autoridad_destino)throw new Error('No puede firmarse: Jurídico debe asignar tipo, fuero y autoridad destino.');ip.estado='firmado'},'iph')}
   case 'envia':{const ip=findH(e,id);return mut(e,'iphEditar','IPH enviado',()=>{ip.estado='enviado'},'iph')}
   case 'narra':return abrirForm({titulo:'Narrativa del evento',e,fields:[{k:'n',l:'Narrativa',t:'textarea'}],values:{n:e.narrativa||''},ok:o=>mut(e,['iphEditar','parte'],'Narrativa del evento',()=>{e.narrativa=o.n})});
   case 'fusionar':{const cid=$('#f-'+id).value,P=S.eventos.find(z=>z.id===id),C=S.eventos.find(z=>z.id===cid);
     return confirmar('Fusionar eventos',`${P.ref} se fusionará en ${C.ref}: sus registros pasan al evento canónico y ${P.ref} queda anulado.`,'Fusionar',()=>fusion(id,cid))}
   case 'cerrar':{const c=cierre(e).filter(z=>!z.ok);if(c.length)return toast('No se puede cerrar: '+c.map(z=>z.t).join('; '),1);
     if(!can('cerrar').ok)return toast(can('cerrar').why,1);
     return confirmar('Cerrar evento',`${e.ref} quedará cerrado y ya no se podrá editar. Solo Jurídico puede reabrirlo.`,'Cerrar evento',()=>{snapUndo();e.estado='cerrado';e.version++;seenVer=e.version;aud(e,'UPDATE','evento','Evento cerrado');render();toast('Evento cerrado.','ok',UNDO)})}
   case 'reabrir':{if(e.estado!=='cerrado')return toast('Solo se reabre un evento cerrado.',1);
     return confirmar('Reabrir evento',`${e.ref} volverá a poder editarse.`,'Reabrir',()=>{snapUndo();e.estado='reabierto';e.version++;seenVer=e.version;aud(e,'UPDATE','evento','Evento reabierto');render();toast('Evento reabierto.','ok',UNDO)})}
   case 'anular':{if(e.estado==='anulado')return;
     return confirmar('Anular evento',`${e.ref} quedará anulado por error. Quedará registrado en la auditoría.`,'Anular',()=>{snapUndo();e.estado='anulado';e.version++;aud(e,'UPDATE','evento','Evento anulado (error)');render();toast('Evento anulado.','ok',UNDO)},true)}
   case 'expJson':{const h=hojaLoad(dept),o={departamento:DEPTS[dept].n,exportado:now(),hoja:Object.fromEntries(Object.entries(h).filter(([k])=>!k.startsWith('Q-')&&!k.startsWith('rev'))),
       campos:Object.entries(comLoad()).map(([k,v])=>({...infoCampo(k),comentario:v})),
       formularios:Object.keys(ENT).filter(en=>h['rev_'+en]||h['revn_'+en]).map(en=>({formulario:ENT[en].n,estado:h['rev_'+en]||'',comentario:h['revn_'+en]||''})),
       preguntas:QDEPT[dept].map(q=>({id:q,pregunta:Q[q],respuesta:h[q]||''}))};
     const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));l.download=`hoja_${dept}.json`;l.click();return}
   case 'print':return print();
   case 'muestraCeri':return fetch('muestra_ceri.csv').then(r=>{if(!r.ok)throw new Error();return r.arrayBuffer()}).then(b=>leerArchivoCeri(b,'muestra_ceri.csv (sintética)')).catch(()=>toast('Para usar la muestra abre la maqueta desde un servidor (GitHub Pages o un servidor local).',1));
   case 'expDatos':{const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify({version:2,exportado:now(),S},null,2)],{type:'application/json'}));l.download='pimsy_maqueta_datos.json';l.click();return toast('Datos exportados.')}
   case 'diseno':return abrirDiseno();
   case 'knobsReset':THEME.reset();return abrirDiseno();
   case 'tour':return tour(0);
   case 'tourSig':return tour(+k);
   case 'tourFin':return tourFin();
  }});
document.addEventListener('input',x=>{
  if(x.target.id==='gq'){mostrarResultados();return}
  const kb=x.target.dataset.knob;if(kb){const v=THEME.set({[kb]:+x.target.value}),o=document.getElementById('o_'+kb);if(o)o.textContent=v[kb]+(THEME.knobs.find(k=>k.id===kb).unidad||'');return}
  const f=x.target.dataset.f;if(f){FL[f]=x.target.type==='checkbox'?x.target.checked:x.target.value;$('#rows').innerHTML=filas();return}
  const k=x.target.dataset.h;if(!k)return;const h=hojaLoad(dept);h[k]=x.target.value;hojaSave(dept,h)});
document.addEventListener('change',x=>{const f=x.target.dataset.f;
  if(x.target.dataset.tarea){SES.hechas[x.target.dataset.tarea]=x.target.checked;sesSave();renderSesion();return}
  if(f==='ceri'){const fl=x.target.files[0];if(!fl)return;fl.arrayBuffer().then(b=>leerArchivoCeri(b,fl.name)).catch(er=>toast(er.message||'No se pudo leer el archivo.',1));x.target.value='';return}
  if(f==='imp'){const fl=x.target.files[0];if(!fl)return;fl.text().then(t=>{try{const g=JSON.parse(t);if(!g.S||!Array.isArray(g.S.eventos))throw new Error('x');S=g.S;view='eventos';cur=null;render();toast('Datos importados.')}catch(er){toast('El archivo no es un respaldo válido de la maqueta.',1)}});return}if(f==='st'||f==='mio'){FL[f]=x.target.type==='checkbox'?x.target.checked:x.target.value;$('#rows').innerHTML=filas()}});
document.addEventListener('keydown',x=>{
  const t=x.target;
  if((x.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(t.tagName)&&!$('#dlg').open&&!$('#dlg2').open)||((x.ctrlKey||x.metaKey)&&x.key.toLowerCase()==='k')){x.preventDefault();$('#gq').focus();$('#gq').select()}
  if(t.id==='gq'){if(x.key==='Escape'){$('#gres').hidden=true;t.blur()}if(x.key==='Enter'){const b=$('#gres .mi');if(b)b.click()}}
  if((x.ctrlKey||x.metaKey)&&x.key==='Enter'&&$('#dlg').open&&window.__fa){x.preventDefault();window.__fa.enviar()}
  if(x.key==='Enter'&&t.matches&&t.matches('tr[data-act]'))t.click();
  if(x.key==='Escape'&&!$('#tour').hidden)tourFin()});
$('#dept').innerHTML=DK.map(k=>`<option value="${k}">${DEPTS[k].n}</option>`).join('');
$('#dept').onchange=x=>{dept=x.target.value;try{localStorage.setItem('pimsy_dept',dept)}catch(e){}render()};

/* ===== Primera visita: elegir quién eres ===== */
function elegirRol(primera,modo){
  const d=$('#dlg');d.className='big';d.oncancel=null;
  d.innerHTML=UO.dialogShell({titulo:modo==='sesion'?'¿Con qué departamento es la sesión?':'¿Quién eres?',formAttrs:'method="dialog"',cuerpoHtml:`<p class="small mut" style="margin:var(--space-3) var(--space-5)">${modo==='sesion'?'Se arma una lista de tareas para ese departamento.':'Elige tu departamento. Verás solo lo que te toca; después puedes cambiarlo arriba cuando quieras.'}</p>${UO.roleGrid(DK.map(k=>({clave:k,titulo:DEPTS[k].n,texto:ROL[k],color:DCOL[k]})))}`});
  d.querySelectorAll('[data-rol]').forEach(b=>b.onclick=()=>{
    if(modo==='sesion'){const k=b.dataset.rol;d.close();return confirmar('Empezar sesión de validación',`Vas a probar la maqueta como <b>${DEPTS[k].n}</b> con una lista de tareas. Se restauran los eventos de ejemplo para que todos vean lo mismo (se pierde lo que hayas capturado).`,'Empezar',()=>iniciarSesion(k))}
    dept=b.dataset.rol;try{localStorage.setItem('pimsy_dept',dept)}catch(x){}d.close();render();if(primera){try{if(localStorage.getItem('pimsy_tour')!=='1')setTimeout(()=>tour(0),300)}catch(x){}}});
  d.showModal()}
/* ===== Recorrido guiado y tema ===== */
const TOUR=[['#dept','Elige quién eres','Cambia de departamento aquí. Cada uno ve y puede hacer cosas distintas.'],
 ['#nav','Secciones','Eventos, preregistros de CERI, conciliación, permisos, tu hoja de validación y la auditoría.'],
 ['#app tr.click','Abre un evento','Haz clic en una fila. Arriba verás tu siguiente paso y cuánto falta para cerrarlo. En «Piezas» registras lo que te toca.'],
 ['#help','Ayuda','Puedes repetir este recorrido cuando quieras.']];
function tourFin(){$('#tour').hidden=true;document.querySelectorAll('.tour-hl').forEach(z=>z.classList.remove('tour-hl'));try{localStorage.setItem('pimsy_tour','1');localStorage.setItem('pimsy_hero','1')}catch(x){};if(view==='eventos')render()}
function tour(i){
  document.querySelectorAll('.tour-hl').forEach(z=>z.classList.remove('tour-hl'));
  if(i>=TOUR.length)return tourFin();
  if(view!=='eventos'){view='eventos';render()}
  const [sel,t,txt]=TOUR[i],el=$(sel);if(!el)return tour(i+1);
  el.classList.add('tour-hl');el.scrollIntoView({block:'center',behavior:'smooth'});
  const b=$('#tour');b.hidden=false;
  b.innerHTML=UO.tourStep({titulo:t,texto:txt,pos:i+1,total:TOUR.length,siguiente:i+1===TOUR.length?'Terminar':'Siguiente'});
  setTimeout(()=>{const r=el.getBoundingClientRect(),w=Math.min(320,innerWidth-24);
    b.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';
    const abajo=r.bottom+12+b.offsetHeight<innerHeight;b.style.top=(abajo?r.bottom+12:Math.max(12,r.top-b.offsetHeight-12))+'px'},250)}
$('#sesionBtn').innerHTML=ic('tasks');$('#design').innerHTML=ic('palette');$('#help').innerHTML=ic('help');$('#help').onclick=()=>tour(0);
$('#theme').onclick=()=>theme(SCHEMES[(SCHEMES.indexOf(THEME.scheme())+1)%3]);
theme(THEME.scheme());

try{const g=JSON.parse(localStorage.getItem('pimsy_estado3')||'null');if(g&&g.S){S=g.S;Object.assign(AGENTES_MONGO,g.AGENTES_MONGO)}else seed()}catch(x){seed()}
try{const dd=localStorage.getItem('pimsy_dept');if(dd&&DEPTS[dd])dept=dd}catch(x){}
SES=sesLoad();
render();
try{if(!localStorage.getItem('pimsy_dept'))setTimeout(()=>elegirRol(true),300);else if(localStorage.getItem('pimsy_tour')!=='1')setTimeout(()=>tour(0),400)}catch(x){}
