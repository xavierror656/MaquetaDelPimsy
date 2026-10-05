/* =============================================================================
   ORGANISMOS (UI.organisms) — secciones completas hechas de moléculas y átomos.
   Leyes: usan UI.atoms y UI.molecules; no conocen el dominio; reciben todo por
   parámetros ya preparados por quien llama (app.js adapta el dominio).
   ============================================================================= */
(()=>{
const A=UI.atoms,M=UI.molecules,esc=UI.esc;

/* Barra de navegación principal */
UI.organisms.navBar=({items,actual,act})=>items.map(([k,l])=>{const on=actual===k;return `<button data-act="${esc(act)}" data-k="${esc(k)}" class="${on?'on':''}" ${on?'aria-current="page"':''}>${esc(l)}</button>`}).join('');

/* Fila de tarjetas de resumen */
UI.organisms.kpiRow=tarjetas=>`<div class="kpis">${tarjetas.map(M.kpi).join('')}</div>`;

/* Guía «Tu siguiente paso» con barra de avance */
UI.organisms.guide=({titulo,pasosHtml,sinPasos,hechos,total})=>
  `<div class="guia"><h3>${A.icon('go')} ${titulo}</h3>${pasosHtml?`<ol>${pasosHtml}</ol>`:`<p style="margin:0">${esc(sinPasos)}</p>`}
   <div class="small" style="margin-top:var(--space-2)">Avance para cerrar: <b>${hechos} de ${total}</b> requisitos</div>${A.bar(total?100*hechos/total:100,100)}</div>`;

/* Explicación inicial en pasos */
UI.organisms.welcome=({titulo,intro,pasos,pieHtml,botonOcultar})=>
  `<div class="hero"><div class="row"><h2 style="margin:0">${esc(titulo)}</h2><span class="grow"></span>${botonOcultar}</div><p>${intro}</p><div class="pasos">${pasos.map(M.stepCard).join('')}</div>${pieHtml}</div>`;

/* Bloque de una pieza del evento */
UI.organisms.pieceBlock=({clase,titulo,tagsHtml,estadoHtml,conteo,accionesHtml,cuerpoHtml})=>
  `<div class="pz ${clase}"><div class="pzh"><b>${titulo}</b>${tagsHtml}${estadoHtml}<span class="small mut">${esc(conteo)}</span><span class="grow"></span>${accionesHtml}</div>${cuerpoHtml}</div>`;

/* Grupo de registros dentro de una pieza */
UI.organisms.recordGroup=({titulo,tagsHtml,filasHtml})=>`<div class="eg">${titulo}${tagsHtml}</div>${filasHtml}`;

/* Línea de tiempo: items = [{titulo, detalle}] */
UI.organisms.timeline=({items,vacio})=>items.length?`<ol class="tl">${items.map(i=>`<li><b>${esc(i.titulo)}</b><div class="small mut">${esc(i.detalle)}</div></li>`).join('')}</ol>`:M.emptyState({texto:vacio});

/* Cuadrícula de roles (primera visita) */
UI.organisms.roleGrid=tarjetas=>`<div class="roles">${tarjetas.map(M.roleCard).join('')}</div>`;

/* Diálogo de confirmación */
UI.organisms.confirmDialog=({titulo,texto,etiqueta,peligro=false})=>
  `<form method="dialog"><h3 id="dlgt">${esc(titulo)}</h3><p>${texto}</p><div class="row end">${A.button({label:'Cancelar',kind:'sec',type:'button',attrs:`onclick="this.closest('dialog').close()"`})}<button type="submit" class="${peligro?'bad':''}" autofocus>${esc(etiqueta)}</button></div></form>`;

/* Diálogo con encabezado (cabecera de color + cuerpo + pie) */
UI.organisms.dialogShell=({titulo,tagHtml='',cuerpoHtml,pieHtml='',formAttrs=''})=>
  `<form ${formAttrs}><div class="dh"><h3 id="dlgt">${esc(titulo)}${tagHtml}</h3></div>${cuerpoHtml}${pieHtml?`<div class="foot">${pieHtml}</div>`:''}</form>`;

/* Formulario de captura (hooks de Alpine: formApp en app.js) */
UI.organisms.formDialog=({titulo,tagHtml='',aviso='',chips=[],camposHtml,okLabel='Guardar',otroLabel=''})=>
  `<form novalidate x-data="formApp()" @submit.prevent="enviar()">
   <div class="dh"><h3 id="dlgt">${esc(titulo)}${tagHtml}</h3>${A.button({label:A.icon('x'),kind:'ghost',type:'button',attrs:'aria-label="Cerrar" @click="cancelar()"'})}</div>
   ${aviso?`<p class="small mut" style="margin:var(--space-2) 0">${aviso}</p>`:''}
   <div class="alert" x-show="restored" x-cloak>Recuperamos un borrador sin guardar. ${A.button({label:'Empezar de nuevo',kind:'sec',size:'sm',type:'button',attrs:'@click="descartarBorrador()"'})}</div>
   <div class="rp" x-show="tot()>0"><div class="bar"><i :style="'width:'+pct()+'%'"></i></div><span class="small mut" x-text="txtProg()"></span></div>
   ${chips.length>2?`<div class="chips">${chips.map(c=>A.button({label:esc(c.t),kind:'chip',type:'button',attrs:`@click="irA(${c.i})"`})).join('').replace(/class="chip"/g,'class="chip"')}</div>`:''}
   <div class="fg">${camposHtml}</div>
   <div class="foot"><div class="alert" x-show="descartando" x-cloak style="margin:0 0 var(--space-2)">¿Descartar lo que capturaste? ${A.button({label:'Seguir editando',kind:'sec',size:'sm',type:'button',attrs:'@click="descartando=false"'})} ${A.button({label:'Descartar',kind:'bad',size:'sm',type:'button',attrs:'@click="descartar()"'})}</div>
    <div class="row end"><span class="small mut grow" x-text="estado()"></span>${A.button({label:'Cancelar',kind:'sec',type:'button',attrs:'@click="cancelar()"'})}${otroLabel?A.button({label:esc(otroLabel),kind:'sec',type:'button',attrs:'@click="enviarOtro()"'}):''}<button type="submit" title="Ctrl + Enter">${esc(okLabel)}</button></div></div></form>`;

/* Recorrido guiado: contenido del globo */
UI.organisms.tourStep=({titulo,texto,pos,total,siguiente})=>
  `<h4>${esc(titulo)}</h4><p>${esc(texto)}</p><div class="row end"><span class="small mut grow">${pos} de ${total}</span>${A.button({label:'Omitir',act:'tourFin',kind:'sec'})}${A.button({label:siguiente,act:'tourSig',attrs:`data-k="${pos}"`})}</div>`;

/* Resultados de la búsqueda global: items = [{tipo,titulo,detalle,act,attrs}] */
UI.organisms.searchResults=({items,vacio})=>items.length
  ?`<ul class="gres-l">${items.map(i=>`<li><button type="button" class="mi sec" data-act="${esc(i.act)}" ${i.attrs||''}>${A.badge('sin_novedad',esc(i.tipo))} <b>${esc(i.titulo)}</b><span class="small mut">${esc(i.detalle)}</span></button></li>`).join('')}</ul>`
  :`<p class="small mut gres-v">${esc(vacio)}</p>`;

/* Panel flotante de la sesión de validación */
UI.organisms.taskPanel=({titulo,tareas,hechas,total,colapsado})=>
  `<div class="tp"><div class="tp-h"><b>${A.icon('tasks')} ${esc(titulo)}</b><span class="grow"></span>${A.button({label:colapsado?'Mostrar':'Ocultar',act:'sesionToggle',kind:'ghost',size:'sm'})}</div>
   ${colapsado?`<p class="small mut tp-c">${hechas} de ${total} tareas</p>`:`${A.bar(total?100*hechas/total:0,100)}<p class="small mut tp-c">${hechas} de ${total} tareas</p><ul class="tp-l">${tareas.map(UI.molecules.taskItem).join('')}</ul>
   <div class="row end">${A.button({label:'Terminar y comentar',act:'sesionFin'})}</div>`}</div>`;

/* Diálogo para comentar un campo */
UI.organisms.commentDialog=({titulo,campo,valor})=>
  `<form method="dialog"><div class="dh"><h3 id="dlgt2">${esc(titulo)}</h3></div>
   <div class="knobs"><p class="small mut" style="margin:0">Campo: <b>${esc(campo)}</b>. Cuéntanos si falta, sobra o se llama distinto en tu área. Se junta en tu hoja de validación.</p>
   <textarea id="com-txt" rows="4" aria-label="Tu comentario">${esc(valor)}</textarea></div>
   <div class="foot"><div class="row end">${A.button({label:'Quitar comentario',kind:'sec',type:'button',attrs:'data-act="comBorrar"'})}${A.button({label:'Cancelar',kind:'sec',type:'button',attrs:'onclick="this.closest(\'dialog\').close()"'})}${A.button({label:'Guardar',type:'button',attrs:'data-act="comGuardar"'})}</div></div></form>`;

/* Panel «Diseño»: perillas del tema. perillas = [{id,etiqueta,min,max,paso,valor,unidad}] */
UI.organisms.themePanel=({perillas,matices})=>
  `<form method="dialog"><div class="dh"><h3 id="dlgt">Diseño</h3>${A.button({label:A.icon('x'),kind:'ghost',type:'button',attrs:'aria-label="Cerrar" onclick="this.closest(\'dialog\').close()"'})}</div>
   <p class="small mut" style="margin:var(--space-3) var(--space-5) 0">Todo el aspecto sale de un solo archivo de valores (<code>css/theme.css</code>). Aquí mueves las perillas y se guardan en este navegador.</p>
   <div class="knobs"><div class="knob"><label>Color de la marca</label><span class="swatches">${matices.map(m=>`<button type="button" class="swatch" data-matiz="${m.h}" style="background:hsl(${m.h} var(--brand-s) var(--brand-l))" aria-label="${esc(m.n)}" title="${esc(m.n)}"></button>`).join('')}</span></div>
   ${perillas.map(p=>`<div class="knob"><label for="k_${p.id}">${esc(p.etiqueta)}</label><output id="o_${p.id}">${p.valor}${p.unidad||''}</output><input id="k_${p.id}" type="range" min="${p.min}" max="${p.max}" step="${p.paso}" value="${p.valor}" data-knob="${p.id}"></div>`).join('')}</div>
   <div class="foot"><div class="row end">${A.button({label:'Restablecer',kind:'sec',type:'button',attrs:'data-act="knobsReset"'})}${A.button({label:'Listo',attrs:'onclick="this.closest(\'dialog\').close()" type="button"'})}</div></div></form>`;
})();
