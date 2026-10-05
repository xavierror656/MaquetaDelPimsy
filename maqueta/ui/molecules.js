/* =============================================================================
   MOLÉCULAS (UI.molecules) — combinan átomos para UNA función concreta.
   Leyes: solo usan UI.atoms; no conocen el dominio; reciben todo por parámetros.
   ============================================================================= */
(()=>{
const A=UI.atoms,esc=UI.esc;

/* Botón con la razón por la que está deshabilitado (REQ-MAQ-01) */
UI.molecules.actionButton=({label,act,kind='',size='',allowed=true,why='',tagQ='',tagTitle='',attrs=''})=>
  `<span>${A.button({label,act,kind,size,disabled:!allowed,attrs})}${allowed?'':A.hint(why)+(tagQ?' '+A.tagValidar(tagQ,tagTitle):'')}</span>`;

/* Botón compacto: la razón va en el tooltip */
UI.molecules.compactButton=({label,act,kind='sec',allowed=true,why='',attrs=''})=>
  A.button({label,act,kind,size:'sm',disabled:!allowed,title:why,attrs});

/* Tarjeta de resumen que filtra (KPI) */
UI.molecules.kpi=({valor,etiqueta,clave,pulsada=false})=>
  `<button class="kpi" data-act="kpi" data-k="${esc(clave)}" aria-pressed="${pulsada===true}"><b>${esc(valor)}</b><span>${esc(etiqueta)}</span></button>`;

/* Estado vacío con acción opcional */
UI.molecules.emptyState=({icono='inbox',texto,accionHtml=''})=>
  `<div class="vacio">${A.icon(icono)}<p>${esc(texto)}</p>${accionHtml}</div>`;

/* Aviso en la página. tipo: '' (atención) | 'err' */
UI.molecules.alert=({tipo='',html})=>`<div class="alert ${tipo}">${html}</div>`;

/* Pestañas accesibles */
UI.molecules.tabs=({items,actual,act,etiqueta})=>
  `<div class="tabs" role="tablist" aria-label="${esc(etiqueta)}">${items.map(([k,l])=>`<button role="tab" aria-selected="${actual===k}" data-act="${esc(act)}" data-k="${esc(k)}">${l}</button>`).join('')}</div>`;

/* Aviso emergente (devuelve un elemento DOM). tipo: 'o' éxito | 'e' error */
UI.molecules.toast=({mensaje,tipo='o',accion})=>{
  const el=document.createElement('div');el.className='toast '+tipo;el.setAttribute('role',tipo==='e'?'alert':'status');
  el.innerHTML=`${A.icon(tipo==='e'?'alert':'check')}<span>${esc(mensaje)}</span>${accion?`<button class="lnk">${esc(accion.label)}</button>`:''}<button class="x" aria-label="Cerrar aviso">${A.icon('x')}</button>`;
  return el};

/* Paso numerado (explicación inicial) */
UI.molecules.stepCard=({titulo,texto})=>`<div class="paso"><b>${titulo}</b>${texto}</div>`;

/* Tarjeta de rol/departamento. color: valor CSS de un token de departamento */
UI.molecules.roleCard=({clave,titulo,texto,color})=>
  `<button type="button" class="rol" style="--rc:${esc(color)}" data-rol="${esc(clave)}"><b>${esc(titulo)}</b><span>${esc(texto)}</span></button>`;

/* Desplegable (<details>) */
UI.molecules.disclosure=({resumen,html,clase='fi',abierto=false})=>`<details class="${clase}" ${abierto?'open':''}><summary>${resumen}</summary>${html}</details>`;

/* Menú desplegable: botón + lista de acciones */
UI.molecules.menu=({etiqueta,itemsHtml})=>`<details class="menu"><summary class="btnlike">${A.icon('plus')} ${etiqueta} ${A.icon('chev')}</summary><div class="mlist">${itemsHtml}</div></details>`;

/* Elemento de menú */
UI.molecules.menuItem=({label,act,attrs='',allowed=true,why=''})=>
  `<button class="mi sec" data-act="${esc(act)}" ${attrs} ${allowed?'':`disabled title="${esc(why)}"`}>${label}</button>`;

/* Caja de búsqueda con icono */
UI.molecules.searchBox=({id,clave,valor,placeholder,etiqueta})=>
  `<div class="bx">${A.icon('search')}<input id="${esc(id)}" data-f="${esc(clave)}" type="search" placeholder="${esc(placeholder)}" aria-label="${esc(etiqueta)}" value="${esc(valor)}"></div>`;

/* Ficha: pares término / valor (ya escapados por quien llama) */
UI.molecules.dataList=pares=>pares.length?`<dl class="ficha">${pares.map(([t,v])=>`<dt>${esc(t)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`:'<p class="small mut">Sin datos capturados todavía.</p>';

/* Control segmentado Sí / No ligado a Alpine (model = ruta en x-model) */
UI.molecules.yesNo=({modelo,etiqueta,disabled=false})=>
  `<div class="seg" role="group" aria-label="${esc(etiqueta)}"><button type="button" :class="{on:${modelo}==='Sí'}" @click="${modelo}=${modelo}==='Sí'?'':'Sí'" ${disabled?'disabled':''}>Sí</button><button type="button" :class="{on:${modelo}==='No'}" @click="${modelo}=${modelo}==='No'?'':'No'" ${disabled?'disabled':''}>No</button></div>`;

/* Botón para comentar un campo (la hoja de validación junta los comentarios) */
UI.molecules.commentButton=({clave,etiqueta,tiene=false})=>
  `<button type="button" class="ghost sm fc ${tiene?'on':''}" data-com="${esc(clave)}" data-etq="${esc(etiqueta)}" title="${tiene?'Ver o cambiar tu comentario':'Comentar este campo'}" aria-label="Comentar el campo ${esc(etiqueta)}">${A.icon('comment')}</button>`;

/* Tarea de una sesión de validación */
UI.molecules.taskItem=({id,texto,hecha})=>
  `<li class="tk ${hecha?'hecha':''}"><label class="chkl"><input type="checkbox" data-tarea="${esc(id)}" ${hecha?'checked':''}> <span>${esc(texto)}</span></label>${A.button({label:'Ir',act:'tareaIr',kind:'sec',size:'sm',attrs:`data-k="${esc(id)}"`})}</li>`;

/* Campo de formulario: etiqueta + control + ayuda + nota + error (ligado a Alpine) */
UI.molecules.field=({id,clave,indice,etiqueta,obligatorio=false,tagsHtml='',controlHtml,ayuda='',nota='',ancho=false,extraHtml=''})=>
  `<div class="fld ${ancho?'full':''}" x-show="vis(${indice})" @focusout="touched['${clave}']=true"><label for="f_${id}">${esc(etiqueta)}${obligatorio?' <b class="no" title="Obligatorio">*</b>':''}${tagsHtml}<span class="vok" x-show="okf('${clave}')" title="Correcto">${A.icon('check')}</span>${extraHtml}</label>${controlHtml}${ayuda?`<small class="ay">${esc(ayuda)}</small>`:''}${nota?`<small class="ay">${esc(nota)}</small>`:''}<span class="ferr" role="alert" x-text="bad('${clave}')?errs['${clave}']:''"></span></div>`;
})();
