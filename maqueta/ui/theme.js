/* =============================================================================
   TEMA (runtime) — mueve las PERILLAS declaradas en css/theme.css y resuelve
   claro / oscuro / automático. No define colores: solo escribe variables CSS.
   ============================================================================= */
const THEME=(()=>{
  const KEY_KNOBS='pimsy_knobs',KEY_SCHEME='pimsy_tema';
  const root=document.documentElement;
  const knobs=[
    {id:'font-scale',var:'--font-scale',etiqueta:'Tamaño del texto',min:.9,max:1.25,paso:.05,def:1,unidad:'×'},
    {id:'density',var:'--density',etiqueta:'Espaciado',min:.85,max:1.25,paso:.05,def:1,unidad:'×'},
    {id:'radius-scale',var:'--radius-scale',etiqueta:'Redondeo de las esquinas',min:0,max:2,paso:.25,def:1,unidad:'×'}];
  const matices=[{n:'Azul',h:221},{n:'Verde azulado',h:174},{n:'Verde',h:152},{n:'Violeta',h:262},{n:'Rosa',h:330},{n:'Naranja',h:24}];
  const defaults=()=>({hue:221,...Object.fromEntries(knobs.map(k=>[k.id,k.def]))});
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const values=()=>({...defaults(),...read(KEY_KNOBS,{})});
  function apply(v){
    root.style.setProperty('--brand-h',v.hue);
    knobs.forEach(k=>root.style.setProperty(k.var,v[k.id]));}
  function set(partial){const v={...values(),...partial};write(KEY_KNOBS,v);apply(v);return v}
  function reset(){try{localStorage.removeItem(KEY_KNOBS)}catch(e){}apply(defaults());return defaults()}

  /* claro / oscuro / automático. Siempre se escribe data-theme resuelto; el CSS solo conoce light|dark. */
  const mq=window.matchMedia?matchMedia('(prefers-color-scheme:dark)'):null;
  let pref=read(KEY_SCHEME,'auto');
  const resolver=()=>pref==='auto'?(mq&&mq.matches?'dark':'light'):pref;
  function aplicarEsquema(){root.dataset.theme=resolver();root.dataset.pref=pref}
  function setScheme(p){pref=p;write(KEY_SCHEME,p);aplicarEsquema();return p}
  const scheme=()=>pref;
  if(mq)mq.addEventListener('change',()=>{if(pref==='auto')aplicarEsquema()});

  apply(values());aplicarEsquema();
  return {knobs,matices,values,set,reset,apply,setScheme,scheme};
})();
