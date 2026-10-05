/* Service worker de la maqueta: permite instalarla y abrirla sin conexión.
   Estrategia: lo propio (y TanStack Form desde esm.sh) se sirve del caché y se actualiza en segundo plano.
   Los mosaicos del mapa (OpenStreetMap) siempre van a la red. Para forzar una actualización, sube V. */
const V='pimsy-v1';
const NUCLEO=['./','index.html','app.js','esquema.js','catalogos.js','manifest.webmanifest','icon.svg',
  'css/theme.css','css/base.css','css/atoms.css','css/molecules.css','css/organisms.css','css/responsive.css',
  'ui/atoms.js','ui/molecules.js','ui/organisms.js','ui/theme.js','vendor/alpine.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(NUCLEO)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin&&u.hostname!=='esm.sh')return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const red=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>hit||(r.mode==='navigate'?c.match('index.html'):Response.error()));
    return hit||red}))});
