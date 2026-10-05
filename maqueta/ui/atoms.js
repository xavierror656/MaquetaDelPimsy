/* =============================================================================
   ÁTOMOS (UI.atoms) — funciones puras que devuelven HTML de la pieza más pequeña.
   Leyes (DESIGN.md): no conocen el dominio (eventos, departamentos, permisos…),
   no usan moléculas ni organismos, no escriben colores ni tamaños literales.
   ============================================================================= */
const UI={atoms:{},molecules:{},organisms:{}};

UI.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Iconos (Lucide, SVG en línea; funcionan sin internet) */
UI.ICONS={
  check:'<path d="M20 6 9 17l-5-5"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',
  alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',minus:'<path d="M5 12h14"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  back:'<path d="m12 19-7-7 7-7M19 12H5"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  auto:'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  go:'<path d="M5 12h14m-7-7 7 7-7 7"/>',
  inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z"/>',
  comment:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',tasks:'<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
  download:'<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>',
  plus:'<path d="M5 12h14M12 5v14"/>',chev:'<path d="m6 9 6 6 6-6"/>',
  palette:'<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.8-10-8.8Z"/>'
};
UI.atoms.icon=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI.ICONS[n]||''}</svg>`;

/* Insignia de estado: la clase pinta el color (ver atoms.css) */
UI.atoms.badge=(estado,html)=>`<span class="b ${UI.esc(estado)}">${html}</span>`;

/* Etiquetas */
UI.atoms.tagValidar=(q,titulo)=>`<span class="pv" title="${UI.esc(titulo||'')}">POR VALIDAR(${UI.esc(q)})</span>`;
UI.atoms.tagEjemplo=()=>'<span class="ej" title="Catálogo de ejemplo: el oficial lo carga la SSPM">ejemplo</span>';

/* Botón. kind: '' (primario) | 'sec' | 'ghost' | 'bad'; size: '' | 'sm' */
UI.atoms.button=({label,act,kind='',size='',disabled=false,title='',attrs='',type=''})=>
  `<button ${type?`type="${type}"`:''} class="${[kind,size].filter(Boolean).join(' ')}" ${act?`data-act="${UI.esc(act)}"`:''} ${attrs} ${disabled?`disabled${title?` title="${UI.esc(title)}"`:''}`:''}>${label}</button>`;

/* Textos de apoyo */
UI.atoms.hint=texto=>`<span class="why">${UI.esc(texto)}</span>`;

/* Barra de progreso (pct 0–100) */
UI.atoms.bar=(pct,max=100)=>`<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="${max}"><i style="width:${Math.round(pct)}%"></i></div>`;

/* Pin del mapa (el color lo da el acento del departamento) */
UI.atoms.mapPin=()=>'<span class="pin" aria-hidden="true"></span>';
