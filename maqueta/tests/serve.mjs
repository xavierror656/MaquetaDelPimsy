// Servidor estático mínimo para las pruebas (sin dependencias). Sirve la carpeta maqueta/.
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,join,normalize,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const RAIZ=join(dirname(fileURLToPath(import.meta.url)),'..');
const TIPOS={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8'};

createServer(async (req,res)=>{
  try{
    let ruta=decodeURIComponent(new URL(req.url,'http://x').pathname);
    if(ruta.endsWith('/'))ruta+='index.html';
    const archivo=normalize(join(RAIZ,ruta));
    if(!archivo.startsWith(RAIZ)){res.writeHead(403).end();return}
    if(!(await stat(archivo)).isFile())throw new Error('no es archivo');
    res.writeHead(200,{'Content-Type':TIPOS[extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(archivo));
  }catch(e){res.writeHead(404).end('No encontrado')}
}).listen(4173,()=>console.log('Maqueta en http://localhost:4173'));
