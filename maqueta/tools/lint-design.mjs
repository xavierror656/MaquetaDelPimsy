#!/usr/bin/env node
/* Linter de las LEYES DE DISEÑO (maqueta/DESIGN.md). Sin dependencias: `node maqueta/tools/lint-design.mjs`.
   Falla (código 1) si algún archivo rompe una ley. Se ejecuta antes de publicar en GitHub Pages. */
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const RAIZ=join(dirname(fileURLToPath(import.meta.url)),'..');
const errores=[];
const falla=(ley,archivo,linea,texto)=>errores.push(`  [${ley}] ${relative(RAIZ,archivo)}:${linea}  ${texto.trim().slice(0,120)}`);
const leer=f=>readFileSync(f,'utf8');
const lista=(dir,ext)=>readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?(n==='vendor'||n==='tools'?[]:lista(p,ext)):(ext.some(e=>n.endsWith(e))?[p]:[])});

const css=lista(join(RAIZ,'css'),['.css']);
const cssSinTema=css.filter(f=>!f.endsWith('theme.css'));
const jsUi=lista(join(RAIZ,'ui'),['.js']);
const jsApp=['app.js','esquema.js'].map(n=>join(RAIZ,n));
const todosTexto=[...css,...jsUi,...jsApp,join(RAIZ,'index.html'),join(RAIZ,'DESIGN.md')];

const porLinea=(archivo,fn)=>leer(archivo).split('\n').forEach((t,i)=>fn(t,i+1));

/* L1 · Un solo lugar para los valores: ni colores, ni tamaños de letra, ni capas, ni sombras literales fuera de theme.css */
const reColor=/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
for(const f of cssSinTema){
  porLinea(f,(t,n)=>{
    const s=t.replace(/\/\*.*?\*\//g,'');
    if(reColor.test(s))falla('L1 color literal',f,n,t);
    if(/font-size\s*:\s*[\d.]+(px|rem|em)/.test(s))falla('L1 tamaño de letra literal',f,n,t);
    if(/z-index\s*:\s*-?\d/.test(s))falla('L1 z-index literal',f,n,t);
    if(/box-shadow\s*:/.test(s)&&!/none|var\(/.test(s))falla('L1 sombra literal',f,n,t);
    if(/border-radius\s*:\s*[\d.]+(px|rem)/.test(s))falla('L1 radio literal',f,n,t);
    if(/(?:^|[;{\s])(?:color|background(?:-color)?|border(?:-[a-z]+)?|outline|fill|stroke)\s*:[^;}]*\b(white|black|red|blue|green|gray|grey|orange|purple|pink|yellow)\b/.test(s))falla('L1 color con nombre',f,n,t);
  });
}
for(const f of [...jsUi,...jsApp]){
  porLinea(f,(t,n)=>{
    if(/^\s*\/[/*]/.test(t))return;
    if(/#[0-9a-fA-F]{6}\b|\brgba?\(/.test(t))falla('L1 color literal en JS',f,n,t);
    for(const m of t.matchAll(/hsla?\([^)]*\)/g))if(!m[0].includes('var('))falla('L1 color literal en JS',f,n,t);
    for(const m of t.matchAll(/style="([^"]*)"/g)){
      for(const d of m[1].split(';')){
        if(/^\s*(color|background|font-size|z-index|box-shadow|border-color)\s*:/.test(d)&&!d.includes('var('))falla('L1 estilo en línea con valor literal',f,n,t);
      }
    }
  });
}

/* L2 · Dependencias de capas: átomos → moléculas → organismos; la capa UI no conoce el dominio */
const dominio=/\b(DEPTS|PERM|COMP|ENT|CAT|CATSRC|AGENTES_MONGO|POR_PIEZA|ROL|QDEPT)\b|\bcan\(|\bdept\b|\bS\.eventos\b|\bseed\(/;
for(const f of jsUi){
  const nombre=f.split(/[\\/]/).pop();
  porLinea(f,(t,n)=>{
    if(/^\s*\/[/*]/.test(t))return;
    if(dominio.test(t)&&nombre!=='theme.js')falla('L2 la capa UI no conoce el dominio',f,n,t);
    if(nombre==='atoms.js'&&/UI\.(molecules|organisms)\b/.test(t)&&!/^UI=|const UI=/.test(t)&&!/const UI=\{atoms/.test(t))falla('L2 un átomo no usa moléculas ni organismos',f,n,t);
    if(nombre==='molecules.js'&&/UI\.organisms\b/.test(t))falla('L2 una molécula no usa organismos',f,n,t);
  });
}

/* L3 · Sin emojis (iconos solo del set Lucide en UI.ICONS) */
const reEmoji=/\p{Emoji_Presentation}|️/u;
for(const f of todosTexto)porLinea(f,(t,n)=>{if(reEmoji.test(t))falla('L3 emoji',f,n,t)});

/* L4 · Todo token usado existe en theme.css (o es una variable local declarada) */
const tema=leer(join(RAIZ,'css','theme.css'));
const definidos=new Set([...tema.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m=>m[1]));
const locales=new Set(['--rc','--kc','--pc','--dc']);
for(const f of [...cssSinTema,...jsUi,...jsApp])porLinea(f,(t,n)=>{
  for(const m of t.matchAll(/var\((--[a-z0-9-]+)/g))if(!definidos.has(m[1])&&!locales.has(m[1]))falla('L4 token inexistente '+m[1],f,n,t)});

/* L5 · Cada archivo CSS de capa solo contiene su capa (existencia y orden de carga) */
const indice=leer(join(RAIZ,'index.html'));
const orden=['theme','base','atoms','molecules','organisms','responsive'].map(n=>indice.indexOf(`css/${n}.css`));
if(orden.some(i=>i<0)||orden.some((v,i)=>i&&v<orden[i-1]))falla('L5 orden de capas',join(RAIZ,'index.html'),1,'css/theme → base → atoms → molecules → organisms → responsive');
const orden2=['atoms','molecules','organisms','theme'].map(n=>indice.indexOf(`ui/${n}.js`));
if(orden2.some(i=>i<0)||orden2.some((v,i)=>i&&v<orden2[i-1]))falla('L5 orden de capas JS',join(RAIZ,'index.html'),1,'ui/atoms → molecules → organisms → theme');

if(errores.length){console.error(`Leyes de diseño rotas (${errores.length}):\n`+errores.join('\n')+'\n\nVer maqueta/DESIGN.md');process.exit(1)}
console.log('Leyes de diseño: todo en orden ('+todosTexto.length+' archivos revisados).');
