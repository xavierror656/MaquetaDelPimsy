// Pruebas de navegador de la maqueta de PIMSy. Cada prueba parte de datos de ejemplo limpios.
import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const RAIZ=join(dirname(fileURLToPath(import.meta.url)),'..');

async function abrir(page,dept='policia'){
  const errores=[];
  page.on('pageerror',e=>errores.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon|tile\.openstreetmap|esm\.sh|net::ERR/i.test(m.text()))errores.push(m.text())});
  await page.addInitScript(d=>{localStorage.clear();if(d){localStorage.setItem('pimsy_dept',d);localStorage.setItem('pimsy_tour','1');localStorage.setItem('pimsy_hero','1')}},dept);
  await page.goto('/');
  await page.waitForFunction(()=>typeof S!=='undefined'&&!!S&&!!window.Alpine);
  return errores;
}
// Abre el evento por su referencia en la pestaña indicada
const irAEvento=(page,ref,tab='resumen')=>page.evaluate(([r,t])=>{const e=S.eventos.find(z=>z.ref===r);cur=e.id;view='det';tab=t;seenVer=e.version;render()},[ref,tab]);
const cambiarDept=(page,d)=>page.evaluate(k=>{dept=k;render()},d);

test('la primera visita pide elegir el departamento',async({page})=>{
  await abrir(page,null);
  await expect(page.locator('#dlg .rol')).toHaveCount(8);
  await page.locator('[data-rol=juridico]').click();
  await expect(page.locator('#dept')).toHaveValue('juridico');
});

test('carga sin errores y muestra los eventos de ejemplo',async({page})=>{
  const errores=await abrir(page);
  await expect(page.locator('#rows tr.click')).toHaveCount(8);
  expect(errores).toEqual([]);
});

test('abren los 26 formularios de entidad con sus campos',async({page})=>{
  await abrir(page,'juridico');
  await irAEvento(page,'EVT-0001','piezas');
  const res=await page.evaluate(async()=>{
    const e=ev(),malos=[];let total=0;
    for(const en of Object.keys(ENT)){total++;entForm(e,en,null);await new Promise(r=>setTimeout(r,60));
      if(!document.querySelectorAll('#dlg .fld').length||!document.querySelector('#dlg form[x-data]'))malos.push(en);$('#dlg').close()}
    return {total,malos}});
  expect(res.total).toBeGreaterThanOrEqual(25);
  expect(res.malos).toEqual([]);
});

test('un formulario vacío marca los obligatorios y oculta campos según la respuesta',async({page})=>{
  await abrir(page,'juridico');
  await irAEvento(page,'EVT-0001','piezas');
  await page.evaluate(()=>entForm(ev(),'arma',null));
  await page.locator('#dlg button[type=submit]').click();
  await expect(page.locator('#dlg .ferr:not(:empty)')).toHaveCount(2);
  await page.locator('#dlg #f_subtipo').selectOption('Blanca');
  await expect(page.locator('#dlg .fld',{hasText:'Calibre'})).toBeHidden();
  await page.locator('#dlg #f_subtipo').selectOption('Corta');
  await expect(page.locator('#dlg .fld',{hasText:'Calibre'})).toBeVisible();
});

test('guardar y registrar otro deja el formulario listo para otro registro',async({page})=>{
  await abrir(page,'policia');
  await irAEvento(page,'EVT-0004','piezas');
  await page.evaluate(()=>entForm(ev(),'emergencia',null));
  await page.locator('#dlg #f_subtipo').fill('Primera');
  await page.getByRole('button',{name:'Guardar y registrar otro'}).click();
  await expect(page.locator('#dlg #f_subtipo')).toHaveValue('');
  expect(await page.evaluate(()=>ev().comp.emergencia.hijos.length)).toBe(1);
});

test('Ctrl+Enter guarda el formulario abierto',async({page})=>{
  await abrir(page,'policia');
  await irAEvento(page,'EVT-0004','piezas');
  await page.evaluate(()=>entForm(ev(),'emergencia',null));
  await page.locator('#dlg #f_subtipo').fill('Con teclado');
  await page.keyboard.press('Control+Enter');
  await expect(page.locator('#dlg')).not.toHaveAttribute('open','');
  expect(await page.evaluate(()=>ev().comp.emergencia.hijos.length)).toBe(1);
});

test('permisos: Policía ve «Cerrar» deshabilitado con la razón',async({page})=>{
  await abrir(page,'policia');
  await irAEvento(page,'EVT-0006');
  await expect(page.locator('[data-act=cerrar]')).toBeDisabled();
  await expect(page.getByText('Lo aporta Plataforma').first()).toBeVisible();
});

test('Plataforma cierra un evento completo con confirmación y puede deshacer',async({page})=>{
  await abrir(page,'plataforma');
  await irAEvento(page,'EVT-0006');
  await page.locator('[data-act=cerrar]').click();
  await page.getByRole('button',{name:'Cerrar evento'}).last().click();
  expect(await page.evaluate(()=>ev().estado)).toBe('cerrado');
  await page.getByRole('button',{name:'Deshacer'}).click();
  expect(await page.evaluate(()=>ev().estado)).toBe('en_proceso');
});

test('un evento incompleto no se puede cerrar y dice qué falta',async({page})=>{
  await abrir(page,'plataforma');
  await irAEvento(page,'EVT-0001');
  await page.locator('[data-act=cerrar]').click();
  await expect(page.locator('.toast.e')).toContainText('No se puede cerrar');
  expect(await page.evaluate(()=>ev().estado)).toBe('en_proceso');
});

test('el IPH no se firma sin tipo, fuero y autoridad; con ellos sí',async({page})=>{
  await abrir(page,'juridico');
  await irAEvento(page,'EVT-0001','piezas');
  await page.locator('[data-act=firma]').first().click();
  await expect(page.locator('.toast.e')).toContainText('No puede firmarse');
  await irAEvento(page,'EVT-0004','piezas');
  await page.locator('[data-act=firma]').first().click();
  expect(await page.evaluate(()=>hs(ev(),'iph','iph').filter(i=>i.estado==='firmado').length)).toBe(1);
});

test('solo Jurídico reabre un evento cerrado',async({page})=>{
  await abrir(page,'plataforma');
  await irAEvento(page,'EVT-0007');
  await expect(page.locator('[data-act=reabrir]')).toBeDisabled();
  await cambiarDept(page,'juridico');
  await page.locator('[data-act=reabrir]').click();
  await page.getByRole('button',{name:'Reabrir'}).last().click();
  expect(await page.evaluate(()=>ev().estado)).toBe('reabierto');
});

test('las reglas de bienes: un objeto va por aseguramiento o por resguardo, nunca ambos',async({page})=>{
  await abrir(page,'juridico');
  await irAEvento(page,'EVT-0001','piezas');
  await page.evaluate(()=>entForm(ev(),'objeto',null));
  await expect(page.locator('#dlg #f_aseguramiento')).toBeHidden();
  await page.locator('#dlg #f_pertenece_a').selectOption('Aseguramiento');
  await expect(page.locator('#dlg #f_aseguramiento')).toBeVisible();
  await expect(page.locator('#dlg #f_resguardo')).toBeHidden();
  await page.locator('#dlg #f_pertenece_a').selectOption('Resguardo');
  await expect(page.locator('#dlg #f_resguardo')).toBeVisible();
  await expect(page.locator('#dlg #f_aseguramiento')).toBeHidden();
});

test('fusión: el provisional se anula, sus registros pasan al real y se puede deshacer',async({page})=>{
  await abrir(page,'plataforma');
  await page.evaluate(()=>{view='conc';render()});
  await page.evaluate(()=>{const ps=S.eventos.filter(e=>e.estado==='borrador_sin_origen');window.__ref=ps.map(e=>e.ref)});
  const antes=await page.evaluate(()=>S.eventos.find(e=>e.ref==='EVT-0001').comp.parte.hijos.length);
  await page.locator('[data-act=fusionar]').nth(1).click(); // EVT-0003 → EVT-0001 (duplicado sugerido)
  await page.getByRole('button',{name:'Fusionar'}).last().click();
  const r=await page.evaluate(()=>({p:S.eventos.find(e=>e.ref==='EVT-0003').estado,partes:S.eventos.find(e=>e.ref==='EVT-0001').comp.parte.hijos.length,aud:S.audit.some(a=>a.op==='FUSION')}));
  expect(r.p).toBe('anulado');expect(r.partes).toBe(antes+1);expect(r.aud).toBe(true);
  await page.getByRole('button',{name:'Deshacer'}).click();
  expect(await page.evaluate(()=>S.eventos.find(e=>e.ref==='EVT-0003').estado)).toBe('borrador_sin_origen');
});

test('comparar muestra qué pasaría antes de fusionar',async({page})=>{
  await abrir(page,'plataforma');
  await page.evaluate(()=>{view='conc';render()});
  await page.locator('[data-act=comparar]').nth(1).click();
  await expect(page.locator('#dlg h3')).toContainText('Comparar');
  await expect(page.locator('#dlg .fsec')).toHaveCount(3);
  await expect(page.getByText('Pasan 1 registro al evento real')).toBeVisible();
});

test('lector de Excel: excluye no procedentes, sin SPM, repetidos y datos personales',async({page})=>{
  await abrir(page,'ceri');
  await page.evaluate(()=>{view='pre';render()});
  const r=await page.evaluate(async()=>{
    await cargarXLSX();
    const aoa=[['FOLIO','FECHA_Y_HORA_INICIO_LLAMADA','ESTATUS','CORPORACIÓN','TELÉFONO','NOMBRE_DEL_RELATOR','INCIDENTE','CÓDIGO','COLONIA','CODIGO_POSTAL','COORDENADA_X','COORDENADA_Y','FECHA_Y_HORA_ACUDIÓ'],
      [9100001,45474.5625,'TERMINO','P [SPM, CES]','6561112233','Persona Real','ROBO',30416,'HIDALGO',0,361031.37,3498363.44,45474.5625],
      [9100002,'01/07/2026 05:56:00 p. m.','IMPROCEDENTE','P [SPM]','1','X','AMENAZA',31002,'HIDALGO',32300,361031,3498363,''],
      [9100003,'01/07/2026 05:56:00 p. m.','TERMINO','V [PV]','1','X','AMENAZA',31002,'HIDALGO',32300,361031,3498363,''],
      [9000001,'01/07/2026 01:31:00 p. m.','TERMINO','P [SPM]','1','X','ROBO',30416,'HIDALGO',32693,361031,3498363,'']];
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([]),'Hoja 1');XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),'Exportacion');
    await leerArchivoCeri(XLSX.write(wb,{type:'array',bookType:'xlsx'}),'prueba.xlsx');
    const filas=[...document.querySelectorAll('#dlg .pvb tr')].map(t=>t.textContent.replace(/\s+/g,' '));
    document.querySelector('#dlg form').requestSubmit();
    const n=S.pre.find(p=>p.folio==='9100001');
    return {filas,personales:document.querySelector('#dlg .alert')?.textContent||'',fecha:n.fecha,cp:n.cp,sinTel:!JSON.stringify(n).includes('6561112233')&&!JSON.stringify(n).includes('Persona Real')}});
  expect(r.filas.join('|')).toContain('Excluidas: no procedentes (estatus distinto de TERMINO)1');
  expect(r.filas.join('|')).toContain('Excluidas: no incluyen a la SSPM (sin «SPM»)1');
  expect(r.filas.join('|')).toContain('Excluidas: folio ya existente1');
  expect(r.filas.join('|')).toContain('Se importarán como preregistro1');
  expect(r.personales).toContain('TELEFONO');
  expect(r.fecha).toBe('2024-07-01T13:30');
  expect(r.cp).toBe('');
  expect(r.sinTel).toBe(true);
});

test('subir un archivo de CERI muestra el mapa de la vista previa y el de los preregistros, sin errores',async({page})=>{
  const errores=await abrir(page,'ceri');
  await page.evaluate(()=>{view='pre';render()});
  await page.setInputFiles('[data-f=ceri]',join(RAIZ,'muestra_ceri.csv'));
  await expect(page.locator('#dlg .pvb')).toBeVisible();
  await expect(page.locator('#mapa-prev .pre-pt')).toHaveCount(5); // 6 importables, uno sin coordenadas
  await page.locator('#dlg button[type=submit]').click();
  await expect(page.locator('#mapa-pre .pre-pt')).toHaveCount(9); // 4 de ejemplo + 5 importados con coordenadas
  await page.locator('#pq').fill('RIÑA');
  await expect(page.locator('#prows tr')).not.toHaveCount(0);
  await page.locator('#mapa-pre .pre-pt').first().click({force:true});
  await page.locator('.leaflet-popup [data-act=promover]').click();
  await expect(page.locator('#dlg h3')).toContainText('Revisa el evento');
  await expect(page.locator('#dlg #f_folio_ceri')).not.toHaveValue('');
  expect(errores).toEqual([]);
});

test('se puede arrastrar el Excel a la zona de carga y un archivo que no sirve da un mensaje claro',async({page})=>{
  const errores=await abrir(page,'ceri');
  await page.evaluate(()=>{view='pre';render()});
  await page.evaluate(async()=>{const t=await (await fetch('muestra_ceri.csv')).text();const dt=new DataTransfer();dt.items.add(new File([t],'reporte.csv',{type:'text/csv'}));
    document.querySelector('#ceri-drop').dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}))});
  await expect(page.locator('#dlg .pvb')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.evaluate(()=>{const dt=new DataTransfer();dt.items.add(new File(['hola'],'foto.png',{type:'image/png'}));document.querySelector('#ceri-drop').dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}))});
  await expect(page.locator('#ceri-estado')).toContainText('no es un Excel');
  await page.evaluate(()=>{const dt=new DataTransfer();dt.items.add(new File(['a,b\n1,2'],'otro.csv',{type:'text/csv'}));document.querySelector('#ceri-drop').dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}))});
  await expect(page.locator('#ceri-estado')).toContainText('No parece el reporte de CERI');
  expect(errores).toEqual([]);
});

test('el botón «Elegir archivo» abre el selector de archivos',async({page})=>{
  await abrir(page,'ceri');
  await page.evaluate(()=>{view='pre';render()});
  const [fc]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Elegir archivo'}).click()]);
  await fc.setFiles(join(RAIZ,'muestra_ceri.csv'));
  await expect(page.locator('#dlg .pvb')).toBeVisible();
});

test('Nuevo evento: elegir un preregistro prellena el formulario',async({page})=>{
  await abrir(page,'ceri');
  await page.locator('[data-act=nuevoA]').click();
  await page.locator('#dlg #f_prereg').fill('9000002 · DAÑO A BIENES PUBLICOS, INSTITUCIONES, MONUMENTOS, ENTRE OTROS · HIDALGO');
  await expect(page.locator('#dlg #f_folio_ceri')).toHaveValue('');
  await page.locator('#dlg #f_prereg').fill('9000003 · EXTORSION TELEFONICA · VILLAS DEL BRAVO I');
  await expect(page.locator('#dlg #f_folio_ceri')).toHaveValue('9000003');
  await expect(page.locator('#dlg #f_colonia')).toHaveValue('VILLAS DEL BRAVO I');
});

test('la búsqueda global encuentra unas placas y abre el evento',async({page})=>{
  await abrir(page,'policia');
  await page.locator('#gq').fill('FICT-123');
  await expect(page.locator('#gres .mi')).toHaveCount(1);
  await page.locator('#gres .mi').click();
  expect(await page.evaluate(()=>ev().ref)).toBe('EVT-0005');
});

test('la sesión de validación arma la lista de tareas del departamento',async({page})=>{
  await abrir(page,'policia');
  await page.evaluate(()=>iniciarSesion('juridico'));
  await expect(page.locator('#sesion .tk')).toHaveCount(4);
  await page.locator('#sesion [data-tarea]').first().check();
  expect(await page.evaluate(()=>SES.hechas.j1)).toBe(true);
  await page.locator('[data-act=sesionFin]').click();
  expect(await page.evaluate(()=>view)).toBe('hoja');
});

test('un comentario por campo llega a la hoja de validación',async({page})=>{
  await abrir(page,'barandilla');
  await irAEvento(page,'EVT-0004','piezas');
  await page.evaluate(()=>entForm(ev(),'detenido',null));
  await page.locator('#dlg [data-com="detenido.nombre_snap"]').click();
  await page.locator('#com-txt').fill('Aquí le decimos nombre completo');
  await page.locator('[data-act=comGuardar]').click();
  await page.evaluate(()=>{$('#dlg').close();view='hoja';render()});
  await expect(page.locator('.rev',{hasText:'Aquí le decimos nombre completo'})).toBeVisible();
});

test('el tablero muestra gráficas con su tabla',async({page})=>{
  await abrir(page,'analista');
  await page.evaluate(()=>{view='tablero';render()});
  await expect(page.locator('.chart')).toHaveCount(6);
  await expect(page.locator('.stat').first()).toContainText('8');
  await page.locator('.chart details summary').first().click();
  await expect(page.locator('.chart details table').first()).toBeVisible();
});

test('el mapa carga y permite fijar un punto nuevo',async({page})=>{
  await abrir(page,'ceri');
  await irAEvento(page,'EVT-0001');
  await expect(page.locator('#mapa.leaflet-container')).toBeVisible();
  await expect(page.locator('#mapaGuardar')).toBeDisabled();
  await page.evaluate(()=>{const c=MAPA.getCenter();MAPA.fire('click',{latlng:L.latLng(c.lat+.001,c.lng+.001)})});
  await expect(page.locator('#mapaGuardar')).toBeEnabled();
  await page.locator('#mapaGuardar').click();
  expect(await page.evaluate(()=>ev().origen.punto_validado)).toBe('Sí');
});

test('el panel «Diseño» mueve las perillas del tema',async({page})=>{
  await abrir(page,'policia');
  await page.locator('#design').click();
  await page.locator('#dlg [data-matiz="152"]').click();
  await page.locator('#dlg [data-knob=radius-scale]').fill('2');
  const v=await page.evaluate(()=>({h:getComputedStyle(document.documentElement).getPropertyValue('--brand-h').trim(),r:getComputedStyle(document.documentElement).getPropertyValue('--radius-scale').trim()}));
  expect(v).toEqual({h:'152',r:'2'});
  await page.locator('#dlg [data-act=knobsReset]').click();
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--brand-h').trim())).toBe('221');
});

test('todos los botones tienen nombre accesible en las vistas principales',async({page})=>{
  await abrir(page,'juridico');
  const sinNombre=await page.evaluate(()=>{
    const malos=[];
    for(const v of ['eventos','pre','conc','tablero','guia','perm','hoja','aud']){view=v;render();
      document.querySelectorAll('button').forEach(b=>{if(!(b.textContent.trim()||b.getAttribute('aria-label')||b.title))malos.push(v+': '+b.outerHTML.slice(0,80))})}
    return malos});
  expect(sinNombre).toEqual([]);
});

test('las leyes de diseño se cumplen',()=>{
  const salida=execFileSync('node',[join(RAIZ,'tools','lint-design.mjs')],{encoding:'utf8'});
  expect(salida).toContain('todo en orden');
});
