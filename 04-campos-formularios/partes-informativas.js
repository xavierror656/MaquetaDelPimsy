// ============================================================
// CATALOGS
// ============================================================
const CATALOGS = {
  distritos_pi: [
    "SUR","CENTRO","UNIVERSIDAD","VALLE","ORIENTE","PONIENTE","RIVERAS",
    "ACADEMIA DE POLICIA","SEGURIDAD VIAL","CERECITO",
    "ALCAIDIA","DIR. DE INVESTIGACION","G.O.E","DEVIFG",
    "POLICIA COMERCIAL","POLICIA K9","CERI","PREVENCION SOCIAL",
  ],
  distritos_pi29: [
    "ACADEMIA DE POLICIA","CENTRO","CERECITO","ORIENTE","PONIENTE",
    "RIVERAS","SEGURIDAD VIAL","SUR","UNIVERSIDAD","VALLE",
  ],
  sectores: [
    "101","102","103","104","105","201","202","203","301","302","303",
    "401","402","403","501","502","503","601","602","603","701","702",
  ],
  colonias: [
    "CENTRO","LOMAS DE CHAPULTEPEC","POLANCO","TEPITO","DOCTORES",
    "ROMA NORTE","ROMA SUR","CONDESA","NARVARTE","DEL VALLE",
    "SANTA FE","PEDREGAL","COYOACÁN","XOCHIMILCO","TLALPAN",
  ],
  codigos_postales: [
    "06000","06010","06020","06050","06600","06700","06800",
    "11000","11010","11550","14000","16000",
  ],
  paises: [
    "MEXICO","ESTADOS UNIDOS","GUATEMALA","HONDURAS","EL SALVADOR",
    "COLOMBIA","VENEZUELA","CUBA","OTROS",
  ],
  estados_mexico: [
    "CIUDAD DE MÉXICO","JALISCO","NUEVO LEÓN","PUEBLA","GUANAJUATO",
    "VERACRUZ","CHIAPAS","OAXACA","TAMAULIPAS","MICHOACÁN","GUERRERO",
    "SINALOA","BAJA CALIFORNIA","SONORA","CHIHUAHUA","COAHUILA",
    "HIDALGO","MORELOS","QUERÉTARO","TABASCO","OTROS",
  ],
  etnias: [
    "NÁHUATL","MAYA","ZAPOTECA","MIXTECA","OTOMÍ","TOTONACA",
    "TZELTAL","TZOTZIL","MAZAHUA","OTRA","N/A",
  ],
  barandillas: ["RIVERAS","CENTRO","CERESITO"],
  fueros: ["ESTATAL","FEDERAL","JUEZ CÍVICO","TRABAJO SOCIAL","OTRO"],
  presentado_ante: [
    "Ministerio Público","Fiscal Cívico","Entrega de Hechos","Parte Informativo",
  ],
  hospitales: [
    "Hospital General","Cruz Roja","IMSS","ISSSTE","Clínica Particular","Otro",
  ],
  // armas_pi catalog: clasificacion → tipos → nombres
  armas_clasificaciones: ["ARMA DE FUEGO","ARMA BLANCA","OBJETO CONTUNDENTE","OTRO"],
  armas_tipos: {
    "ARMA DE FUEGO": ["PISTOLA","REVÓLVER","RIFLE","ESCOPETA","SUBAMETRALLADORA","OTRO"],
    "ARMA BLANCA": ["CUCHILLO","NAVAJA","MACHETE","OTRO"],
    "OBJETO CONTUNDENTE": ["TUBO","PALO","PIEDRA","OTRO"],
    "OTRO": ["OTRO"],
  },
  armas_calibres: [".22",".25",".380","9mm",".38",".40",".45","5.56mm","12 GA","OTRO"],
  sustancias_tipos: [
    "MARIHUANA","COCAINA","CRISTAL","HEROINA",
    "MEDICAMENTO CONTROLADO","FENTANILO (PASTILLAS)","CRACK","OTRA",
  ],
  unidades_medida: ["GRAMOS","KILOGRAMOS","DOSIS","ENVOLTORIOS","RECIPIENTE","PAQUETE","PLANTA","LITROS","PASTILLAS","CIGARRILLOS","OTRO"],
  objetos_tipos: [
    "TELÉFONO CELULAR","COMPUTADORA PORTÁTIL","TABLET","DINERO EN EFECTIVO",
    "JOYERÍA","TARJETA BANCARIA","HERRAMIENTA","DOCUMENTO","OTRO",
  ],
  vehiculos_tipos: ["AUTOMÓVIL","CAMIONETA","MOTOCICLETA","CAMIÓN","BICICLETA","OTRO"],
  marcas_autos: [
    "NISSAN","VOLKSWAGEN","CHEVROLET","FORD","TOYOTA","HONDA","SEAT",
    "MAZDA","KIA","HYUNDAI","DODGE","JEEP","BMW","MERCEDEZ BENZ","OTRO",
  ],
  marcas_motos: ["HONDA","YAMAHA","KAWASAKI","SUZUKI","ITALIKA","BENELLI","OTRO"],
  colores_vehiculo: [
    "BLANCO","NEGRO","GRIS","PLATA","ROJO","AZUL","VERDE","AMARILLO",
    "NARANJA","MORADO","CAFÉ","BEIGE","OTRO",
  ],
  entidades_placa: [
    "CIUDAD DE MÉXICO","JALISCO","NUEVO LEÓN","PUEBLA","GUANAJUATO","VERACRUZ",
    "CHIAPAS","OAXACA","TAMAULIPAS","MICHOACÁN","GUERRERO","BAJA CALIFORNIA",
    "SONORA","CHIHUAHUA","EXTRANJERO","OTRO",
  ],
  motivos_aseg_vehiculo: [
    "INVOLUCRADO EN DELITOS",
    "VEHICULO RECUPERDO CON REPORTE DE ROBO",
    "PLACAS SOBRE PUESTAS",
    "SERIE ALTERADA",
    "ABANDONO",
    "POR FALTA",
    "OTRO",
  ],
  lugares_deposito: [
    "CERESITO RIVERAS","CERESITO CENTRO","CERESITO SUR","OTRO",
  ],
  // falta_admin catalog
  falta_clasificaciones: [
    "RIÑAS Y ESCÁNDALOS",
    "EBRIEDAD",
    "DAÑO EN PROPIEDAD AJENA",
    "FALTAS CONTRA LA MORAL",
    "DESOBEDIENCIA A AUTORIDAD",
    "POSESIÓN DE DROGAS (CANTIDAD PERSONAL)",
    "OTRO",
  ],
  falta_fracciones: {
    "RIÑAS Y ESCÁNDALOS": ["Fracción I","Fracción II","Fracción III"],
    "EBRIEDAD": ["Fracción I","Fracción II"],
    "DAÑO EN PROPIEDAD AJENA": ["Fracción I","Fracción II","Fracción III"],
    "FALTAS CONTRA LA MORAL": ["Fracción I","Fracción II"],
    "DESOBEDIENCIA A AUTORIDAD": ["Fracción I","Fracción II"],
    "POSESIÓN DE DROGAS (CANTIDAD PERSONAL)": ["Fracción I"],
    "OTRO": ["Otro"],
  },
  // emergencias catalog
  emergencias_tipos: [
    "ACCIDENTE VIAL","INCENDIO","PERSONA LESIONADA","PERSONA ENFERMA",
    "PERSONA EN CRISIS","FUGA DE GAS","DERRUMBE","INUNDACIÓN",
    "RESCATE","EMERGENCIA MÉDICA","OTRO",
  ],
  emergencias_clasificaciones: {
    "ACCIDENTE VIAL": "ACCIDENTE",
    "INCENDIO": "INCENDIO",
    "PERSONA LESIONADA": "SALUD",
    "PERSONA ENFERMA": "SALUD",
    "PERSONA EN CRISIS": "SALUD MENTAL",
    "FUGA DE GAS": "RIESGO QUÍMICO",
    "DERRUMBE": "DESASTRE NATURAL",
    "INUNDACIÓN": "DESASTRE NATURAL",
    "RESCATE": "RESCATE",
    "EMERGENCIA MÉDICA": "SALUD",
    "OTRO": "OTRO",
  },
  // diligencias
  diligencias_tipos: [
    "APOYO A DEPENDENCIA","CONTROL DE MULTITUDES","OPERATIVO ESPECIAL",
    "TRASLADO DE DETENIDO","CUSTODIA","PATRULLAJE","OTRO",
  ],
  // para conocimiento
  para_conocimiento_tipos: [
    "PERSONA SOSPECHOSA","ABANDONO DE VEHÍCULO","SITUACIÓN INUSUAL",
    "INFORMACIÓN CIUDADANA","OTRO",
  ],
  // delitos
  delitos: [
    { nombre: "ROBO SIMPLE", clasificacion: "PATRIMONIAL" },
    { nombre: "ROBO CON VIOLENCIA", clasificacion: "PATRIMONIAL" },
    { nombre: "ROBO A TRANSEÚNTE", clasificacion: "PATRIMONIAL" },
    { nombre: "ROBO A CASA HABITACIÓN", clasificacion: "PATRIMONIAL" },
    { nombre: "ROBO DE VEHÍCULO", clasificacion: "PATRIMONIAL" },
    { nombre: "LESIONES", clasificacion: "CONTRA LA PERSONA" },
    { nombre: "HOMICIDIO DOLOSO", clasificacion: "CONTRA LA PERSONA" },
    { nombre: "HOMICIDIO CULPOSO", clasificacion: "CONTRA LA PERSONA" },
    { nombre: "VIOLACIÓN", clasificacion: "SEXUAL" },
    { nombre: "ABUSO SEXUAL", clasificacion: "SEXUAL" },
    { nombre: "SECUESTRO", clasificacion: "CONTRA LA LIBERTAD" },
    { nombre: "EXTORSIÓN", clasificacion: "PATRIMONIAL" },
    { nombre: "NARCOMENUDEO", clasificacion: "CONTRA LA SALUD" },
    { nombre: "PORTACIÓN DE ARMAS PROHIBIDAS", clasificacion: "SEGURIDAD PÚBLICA" },
    { nombre: "FRAUDE", clasificacion: "PATRIMONIAL" },
    { nombre: "DAÑO EN PROPIEDAD AJENA", clasificacion: "PATRIMONIAL" },
    { nombre: "ORDEN DE APREHENSIÓN / PRESENTACIÓN", clasificacion: "JUDICIAL" },
    { nombre: "OTROS", clasificacion: "" },
  ],
  canalizaciones: [
    "Trabajo Social","DIF","CAVI","LUNAS","INMUJERES","Cruz Roja","Hospital General","OTRO",
  ],
  atencion_medica_opciones: ["Hospital General","Cruz Roja","IMSS","ISSSTE","Clínica Particular","No requirió","OTRO"],
  atencion_legal_opciones: ["Ministerio Público","CAVI","LUNAS","Defensoría Pública","No requirió","OTRO"],
  atencion_psicologica_opciones: ["Trabajo Social","CAVI","INMUJERES","DIF","No requirió","OTRO"],
};

// ============================================================
// STATE
// ============================================================
const state = {
  folio: generarFolio(),
  agentes: [],
  detenidos: [],
  victimas: [],
  personas_resguardadas: [],
  clasi_hechos: [],
  emergencias: [],
  falta_admin: [],
  diligencias: [],
  para_conocimiento: [],
  aseg_armas: [],
  aseg_sustancias: [],
  aseg_objetos: [],
  ins_vehiculos: [],
};

function generarFolio() {
  const now = new Date();
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `PI-ELEMENTO-${num}-${now.getFullYear()}`;
}

// ============================================================
// DOM HELPERS
// ============================================================
function buildSelect(options, placeholder = "Seleccionar...") {
  const opts = options.map(o => {
    const val = typeof o === "object" ? o.nombre : o;
    const label = typeof o === "object" ? o.nombre : o;
    return `<option value="${val}">${label}</option>`;
  });
  return `<option value="">${placeholder}</option>${opts.join("")}`;
}

function setSelectValue(el, val) {
  if (el && val !== undefined && val !== null) el.value = val;
}

function badge(text, color = "blue") {
  return `<span class="badge badge-${color}">${text}</span>`;
}

// ============================================================
// SECTION TOGGLE
// ============================================================
function toggleSection(id) {
  const body = document.getElementById(`${id}-body`);
  const icon = document.getElementById(`${id}-icon`);
  if (!body) return;
  const isOpen = body.style.display !== "none";
  body.style.display = isOpen ? "none" : "";
  if (icon) icon.textContent = isOpen ? "▶" : "▼";
}
function openSection(id) {
  const body = document.getElementById(`${id}-body`);
  const icon = document.getElementById(`${id}-icon`);
  if (body) body.style.display = "";
  if (icon) icon.textContent = "▼";
}

// ============================================================
// CONDITIONAL LOGIC — fiel al código real (informacion_pi.blade.php)
// ============================================================
function applyMotivoLogic() {
  const motivo = document.getElementById("PI_19")?.value || "";

  // ── Sección "Asunto" (solo una visible a la vez) ───────────
  show("sec-delitos",      motivo === "Presunto delito");
  show("sec-emergencias",  motivo === "Emergencias");
  show("sec-faltas",       motivo === "Falta Administrativa");
  show("sec-diligencias",  motivo === "Diligencias");
  show("sec-conocimiento", motivo === "Para Conocimiento");

  // ── IPH — solo para Presunto delito y Falta Administrativa ─
  show("sec-iph", motivo === "Presunto delito" || motivo === "Falta Administrativa");

  // ── lista-delitos-detenidos — solo Presunto delito ─────────
  // (clasi_hechos embebida en cada detenido; el indicador avisa)
  show("nota-clasi-detenidos", motivo === "Presunto delito");

  // ── Personas resguardadas — ocultas solo para Falta Admin. ─
  show("sec-resguardados", motivo !== "Falta Administrativa");

  // ── Emergencias: PI_32 / PI_34 / PI_35 → forzar NO + disabled
  // PI_36 y PI_37 NO se fuerzan (están comentados en el código real)
  const forzarEmergencia = motivo === "Emergencias";
  ["PI_32","PI_34","PI_35"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.disabled = forzarEmergencia;
    if (forzarEmergencia) el.value = "NO";
  });
  ["PI_36","PI_37"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = false;
  });

  applyDetenidosLogic();
  applyAseguramientoLogic();
}

function applyQuejosaLogic() {
  const hubo = document.getElementById("PI_31")?.value === "SI";
  show("sec-quejoso-datos", hubo);
  if (hubo) {
    const pi22 = document.getElementById("PI_22");
    if (pi22 && !pi22.value) { pi22.value = "MEXICO"; applyPaisLogic(); }
  }
}

function applyPaisLogic() {
  const pais = document.getElementById("PI_22")?.value || "";
  show("wrap-PI_23-mex",  pais === "MEXICO");
  show("wrap-PI_23-otro", pais !== "" && pais !== "MEXICO");
}

function applyEdadQuejosaLogic() {
  const edad = parseInt(document.getElementById("PI_20")?.value || "0");
  const esMenor = edad > 0 && edad < 18;
  // igual que el código real: auto-marca el checkbox cuando edad < 18
  const cb = document.getElementById("quejoso_es_menor");
  if (cb) cb.checked = esMenor;
  show("badge-menor-quejoso", esMenor);
}

function applyDetenidosLogic() {
  const hubo = document.getElementById("PI_32")?.value === "SI";
  show("sec-lista-detenidos", hubo);
  show("btn-add-detenido",    hubo);
}

function applyVictimasLogic() {
  const hubo = document.getElementById("PI_33")?.value === "SI";
  show("sec-lista-victimas", hubo);
  show("btn-add-victima",    hubo);
}

// PI_51 — ¿Hubo Personas Resguardadas? (campo real)
function applyPI51Logic() {
  const hubo = document.getElementById("PI_51")?.value === "SI";
  show("sec-lista-resguardados", hubo);
  show("btn-add-resguardado",    hubo);
}

function applyAseguramientoLogic() {
  const pi34 = document.getElementById("PI_34")?.value === "SI";
  const pi35 = document.getElementById("PI_35")?.value === "SI";
  const pi36 = document.getElementById("PI_36")?.value === "SI";
  const pi37 = document.getElementById("PI_37")?.value === "SI";
  show("sec-armas",      pi34);
  show("sec-sustancias", pi35);
  show("sec-objetos",    pi36);
  show("sec-vehiculos",  pi37);
}

function show(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? "" : "none";
}

// ============================================================
// WORD COUNT
// ============================================================
function validarNarrativa() {
  const ta = document.getElementById("PI_17");
  const counter = document.getElementById("narrativa-counter");
  if (!ta || !counter) return;
  const palabras = ta.value.trim().split(/\s+/).filter(Boolean).length;
  counter.textContent = `${palabras} / 60 palabras mínimo`;
  counter.className = "word-counter " + (palabras >= 60 ? "ok" : "warn");
}

// ============================================================
// COORDINATES
// ============================================================
function actualizarCoords() {
  const lat = document.getElementById("PI_52")?.value;
  const lng = document.getElementById("PI_53")?.value;
  const preview = document.getElementById("coords-preview");
  if (!preview) return;
  if (lat && lng) { preview.textContent = `📍 ${lat}, ${lng}`; preview.style.display = ""; }
  else preview.style.display = "none";
}

// ============================================================
// RENDER HELPERS
// ============================================================
function cardHeader(title, removeCall, badges = "") {
  return `<div class="card-item-header">
    <strong>${title}</strong>${badges}
    <button type="button" class="btn-remove" onclick="${removeCall}">✕ Eliminar</button>
  </div>`;
}

// ============================================================
// AGENTES
// ============================================================
function renderAgentes() {
  const c = document.getElementById("lista-agentes");
  if (!c) return;
  if (!state.agentes.length) { c.innerHTML = '<p class="empty-hint">Sin agentes agregados.</p>'; return; }
  c.innerHTML = state.agentes.map((a, i) => `
    <div class="card-item">
      ${cardHeader(`Agente ${i+1}: ${a.nombre||"(sin nombre)"}  ${a.apellido_paterno||""}`, `removeAgente(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group">
          <label>No. Empleado</label>
          <input value="${a.numero_empleado||""}" placeholder="Ej. 12345" onchange="state.agentes[${i}].numero_empleado=this.value">
        </div>
        <div class="field-group">
          <label>Nombre(s)</label>
          <input value="${a.nombre||""}" onchange="state.agentes[${i}].nombre=this.value">
        </div>
        <div class="field-group">
          <label>Apellido Paterno</label>
          <input value="${a.apellido_paterno||""}" onchange="state.agentes[${i}].apellido_paterno=this.value">
        </div>
        <div class="field-group">
          <label>Apellido Materno</label>
          <input value="${a.apellido_materno||""}" onchange="state.agentes[${i}].apellido_materno=this.value">
        </div>
        <div class="field-group">
          <label>Puesto</label>
          <input value="${a.puesto||""}" placeholder="Ej. Policía de Grupo" onchange="state.agentes[${i}].puesto=this.value">
        </div>
        <div class="field-group">
          <label>Distrito</label>
          <select id="ag-dist-${i}" onchange="state.agentes[${i}].distrito=this.value">
            ${buildSelect(CATALOGS.distritos_pi)}
          </select>
        </div>
        <div class="field-group">
          <label>Unidad / Vehículo</label>
          <input value="${a.unidad||""}" placeholder="Ej. PATRULLA-01" onchange="state.agentes[${i}].unidad=this.value">
        </div>
      </div>
    </div>`).join("");
  state.agentes.forEach((a, i) => setSelectValue(document.getElementById(`ag-dist-${i}`), a.distrito));
}
function addAgente() { state.agentes.push({}); renderAgentes(); openSection("sec-agentes"); }
function removeAgente(i) { state.agentes.splice(i,1); renderAgentes(); }

// ============================================================
// DETENIDOS
// ============================================================
function renderDetenidos() {
  const c = document.getElementById("lista-detenidos");
  if (!c) return;
  if (!state.detenidos.length) { c.innerHTML = '<p class="empty-hint">Sin detenidos registrados.</p>'; return; }
  c.innerHTML = state.detenidos.map((d, i) => `
    <div class="card-item">
      ${cardHeader(
        `Detenido ${i+1}: ${d.nombre||""} ${d.apellido_paterno||""}`,
        `removeDetenido(${i})`,
        (d.es_menor==="SI"?badge("MENOR","orange"):"") + (d.es_migrante==="SI"?badge("MIGRANTE","purple"):"")
      )}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Nombre(s)</label>
          <input value="${d.nombre||""}" onchange="state.detenidos[${i}].nombre=this.value"></div>
        <div class="field-group"><label>Apellido Paterno</label>
          <input value="${d.apellido_paterno||""}" onchange="state.detenidos[${i}].apellido_paterno=this.value"></div>
        <div class="field-group"><label>Apellido Materno</label>
          <input value="${d.apellido_materno||""}" onchange="state.detenidos[${i}].apellido_materno=this.value"></div>
        <div class="field-group"><label>Fecha de Nacimiento</label>
          <input type="date" value="${d.fecha_nacimiento||""}" onchange="calcEdadDetenido(${i},this.value)"></div>
        <div class="field-group"><label>Edad (auto-calculada)</label>
          <input type="number" id="edad-det-${i}" value="${d.edad||""}" readonly></div>
        <div class="field-group"><label>Sexo</label>
          <select id="det-gen-${i}" onchange="state.detenidos[${i}].genero=this.value">
            ${buildSelect(["MASCULINO","FEMENINO"])}</select></div>
        <div class="field-group"><label>País de Origen</label>
          <select id="det-pais-${i}" onchange="state.detenidos[${i}].pais_origen=this.value">
            ${buildSelect(CATALOGS.paises)}</select></div>
        <div class="field-group"><label>Estado de Origen</label>
          <input value="${d.estado_origen||""}" onchange="state.detenidos[${i}].estado_origen=this.value"></div>
        <div class="field-group"><label>Ciudad de Origen</label>
          <input value="${d.ciudad_origen||""}" onchange="state.detenidos[${i}].ciudad_origen=this.value"></div>
        <div class="field-group col-span-2"><label>Domicilio</label>
          <input value="${d.domicilio||""}" onchange="state.detenidos[${i}].domicilio=this.value"></div>
        <div class="field-group"><label>Grupo Delictivo</label>
          <input value="${d.grupo_delictivo||""}" onchange="state.detenidos[${i}].grupo_delictivo=this.value"></div>
        <div class="field-group"><label>Situación Jurídica</label>
          <input value="${d.situacion_juridica||""}" onchange="state.detenidos[${i}].situacion_juridica=this.value"></div>
        <div class="field-group"><label>Presentado Ante</label>
          <select id="det-pres-${i}" onchange="state.detenidos[${i}].presentado_ante=this.value">
            ${buildSelect(CATALOGS.presentado_ante)}</select></div>
        <div class="field-group"><label>Fuero</label>
          <select id="det-fuero-${i}" onchange="state.detenidos[${i}].fuero=this.value">
            ${buildSelect(CATALOGS.fueros)}</select></div>
        <div class="field-group"><label>Barandilla</label>
          <select id="det-baran-${i}" onchange="state.detenidos[${i}].barandilla=this.value">
            ${buildSelect(CATALOGS.barandillas)}</select></div>
        <div class="field-group"><label>Atención Médica</label>
          <select id="det-atmed-${i}" onchange="state.detenidos[${i}].atencion_medica=this.value">
            ${buildSelect(["SI","NO"])}</select></div>
        <div class="field-group"><label>Lugar Atención Médica</label>
          <select id="det-lugar-${i}" onchange="state.detenidos[${i}].lugar_atencion_medica=this.value">
            ${buildSelect(["Hospital General","Hospital Infantil","Cruz Roja","IMSS","ISSSTE","Clínica Particular","Otro"])}</select></div>
        <div class="field-group"><label>Especifique Lugar Atención</label>
          <input value="${d.especifique_lugar_atencion_medica||""}" onchange="state.detenidos[${i}].especifique_lugar_atencion_medica=this.value"></div>
        <div class="field-group"><label>No. Delitos</label>
          <input type="number" min="0" value="${d.num_delitos||0}" onchange="state.detenidos[${i}].num_delitos=this.value"></div>
        <div class="field-group"><label>No. Órdenes de Aprehensión</label>
          <input type="number" min="0" value="${d.num_ordenes_aprehension||0}" onchange="state.detenidos[${i}].num_ordenes_aprehension=this.value"></div>
        <div class="field-group"><label>Es Menor</label>
          <select id="det-menor-${i}" onchange="state.detenidos[${i}].es_menor=this.value;renderDetenidos()">
            ${buildSelect(["SI","NO"])}</select></div>
        <div class="field-group"><label>Es Migrante</label>
          <select id="det-migr-${i}" onchange="state.detenidos[${i}].es_migrante=this.value;renderDetenidos()">
            ${buildSelect(["SI","NO"])}</select></div>
      </div>
      <div style="padding:0 14px 14px">
        <div class="sub-label">Delitos del Detenido (clasi_hechos)</div>
        <div id="clasi-det-${i}"></div>
        <button type="button" class="btn-add-sm" onclick="addClasiDetenido(${i})">＋ Agregar Delito al Detenido</button>
      </div>
    </div>`).join("");

  state.detenidos.forEach((d, i) => {
    setSelectValue(document.getElementById(`det-gen-${i}`),   d.genero);
    setSelectValue(document.getElementById(`det-pais-${i}`),  d.pais_origen);
    setSelectValue(document.getElementById(`det-pres-${i}`),  d.presentado_ante);
    setSelectValue(document.getElementById(`det-fuero-${i}`), d.fuero);
    setSelectValue(document.getElementById(`det-baran-${i}`), d.barandilla);
    setSelectValue(document.getElementById(`det-atmed-${i}`), d.atencion_medica);
    setSelectValue(document.getElementById(`det-lugar-${i}`), d.lugar_atencion_medica);
    setSelectValue(document.getElementById(`det-menor-${i}`), d.es_menor);
    setSelectValue(document.getElementById(`det-migr-${i}`),  d.es_migrante);
    renderClasiDetenido(i);
  });
}

function calcEdadDetenido(i, fecha) {
  if (!fecha) return;
  const hoy = new Date(), nac = new Date(fecha);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m===0 && hoy.getDate()<nac.getDate())) edad--;
  state.detenidos[i].fecha_nacimiento = fecha;
  state.detenidos[i].edad = edad;
  state.detenidos[i].es_menor = edad < 18 ? "SI" : "NO";
  const el = document.getElementById(`edad-det-${i}`);
  if (el) el.value = edad;
}
function addDetenido() { state.detenidos.push({ clasi_hechos:[] }); renderDetenidos(); }
function removeDetenido(i) { state.detenidos.splice(i,1); renderDetenidos(); }

// ─── clasi_hechos por detenido ────────────────────────────
function renderClasiDetenido(di) {
  const c = document.getElementById(`clasi-det-${di}`);
  if (!c) return;
  const list = state.detenidos[di].clasi_hechos || [];
  if (!list.length) { c.innerHTML = '<p class="empty-hint" style="font-size:.75rem">Sin delitos agregados.</p>'; return; }
  c.innerHTML = list.map((ch, ci) => `
    <div class="card-mini">
      <strong>Delito ${ci+1}</strong>
      <button type="button" class="btn-remove-sm" onclick="removeClasiDetenido(${di},${ci})">✕</button>
      <div class="grid-3" style="margin-top:8px">
        <div class="field-group"><label>Nombre Delito</label>
          <select id="cdet-nd-${di}-${ci}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].nombre_delito=this.value;autofillClasDelito(${di},${ci})">
            ${buildSelect(CATALOGS.delitos.map(d=>d.nombre))}</select></div>
        <div class="field-group"><label>Especifique</label>
          <input value="${ch.especifique_delito||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].especifique_delito=this.value"></div>
        <div class="field-group"><label>Clasificación</label>
          <input id="cdet-cl-${di}-${ci}" value="${ch.clasificacion_delito||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].clasificacion_delito=this.value"></div>
        <div class="field-group"><label>¿Hubo Violencia?</label>
          <select id="cdet-viol-${di}-${ci}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].hubo_violencia=this.value">
            ${buildSelect(["SI","NO","N/A"])}</select></div>
        <div class="field-group"><label>Modalidad</label>
          <input value="${ch.modalidad||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].modalidad=this.value"></div>
        <div class="field-group"><label>Orden de Aprehensión</label>
          <select id="cdet-oa-${di}-${ci}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].orden_aprehension=this.value">
            ${buildSelect(["NO","SI"])}</select></div>
        <div class="field-group"><label>Mandamiento Judicial</label>
          <input value="${ch.mandamiento_judicial||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].mandamiento_judicial=this.value"></div>
        <div class="field-group"><label>Delito (Orden Aprehensión)</label>
          <input value="${ch.delito_orden_aprehension||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].delito_orden_aprehension=this.value"></div>
        <div class="field-group"><label>Lugar Vigente de Orden</label>
          <input value="${ch.lugar_vigente_orden||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].lugar_vigente_orden=this.value"></div>
        <div class="field-group"><label>Fecha de Orden</label>
          <input type="date" value="${ch.fecha_orden||""}" onchange="state.detenidos[${di}].clasi_hechos[${ci}].fecha_orden=this.value"></div>
      </div>
    </div>`).join("");
  list.forEach((ch,ci) => {
    setSelectValue(document.getElementById(`cdet-nd-${di}-${ci}`),   ch.nombre_delito);
    setSelectValue(document.getElementById(`cdet-viol-${di}-${ci}`), ch.hubo_violencia);
    setSelectValue(document.getElementById(`cdet-oa-${di}-${ci}`),   ch.orden_aprehension);
  });
}
function addClasiDetenido(di) {
  if (!state.detenidos[di].clasi_hechos) state.detenidos[di].clasi_hechos = [];
  state.detenidos[di].clasi_hechos.push({});
  renderClasiDetenido(di);
}
function removeClasiDetenido(di, ci) { state.detenidos[di].clasi_hechos.splice(ci,1); renderClasiDetenido(di); }
function autofillClasDelito(di, ci) {
  const nombre = state.detenidos[di].clasi_hechos[ci].nombre_delito;
  const found = CATALOGS.delitos.find(d => d.nombre === nombre);
  if (found) {
    state.detenidos[di].clasi_hechos[ci].clasificacion_delito = found.clasificacion;
    const el = document.getElementById(`cdet-cl-${di}-${ci}`);
    if (el) el.value = found.clasificacion;
  }
}

// ============================================================
// VÍCTIMAS
// ============================================================
function renderVictimas() {
  const c = document.getElementById("lista-victimas");
  if (!c) return;
  if (!state.victimas.length) { c.innerHTML = '<p class="empty-hint">Sin víctimas registradas.</p>'; return; }
  c.innerHTML = state.victimas.map((v, i) => `
    <div class="card-item">
      ${cardHeader(
        `Víctima ${i+1}: ${v.nombre||""} ${v.apellido_paterno||""}`,
        `removeVictima(${i})`,
        v.es_menor==="SI"?badge("MENOR","orange"):""
      )}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Nombre(s)</label>
          <input value="${v.nombre||""}" onchange="state.victimas[${i}].nombre=this.value"></div>
        <div class="field-group"><label>Apellido Paterno</label>
          <input value="${v.apellido_paterno||""}" onchange="state.victimas[${i}].apellido_paterno=this.value"></div>
        <div class="field-group"><label>Apellido Materno</label>
          <input value="${v.apellido_materno||""}" onchange="state.victimas[${i}].apellido_materno=this.value"></div>
        <div class="field-group"><label>Edad</label>
          <input type="number" min="0" value="${v.edad||""}" onchange="state.victimas[${i}].edad=this.value"></div>
        <div class="field-group"><label>Sexo</label>
          <select id="vic-gen-${i}" onchange="state.victimas[${i}].genero=this.value">
            ${buildSelect(["MASCULINO","FEMENINO"])}</select></div>
        <div class="field-group"><label>País de Origen</label>
          <select id="vic-pais-${i}" onchange="state.victimas[${i}].pais_origen=this.value">
            ${buildSelect(CATALOGS.paises)}</select></div>
        <div class="field-group"><label>Estado de Origen</label>
          <input value="${v.estado_origen||""}" onchange="state.victimas[${i}].estado_origen=this.value"></div>
        <div class="field-group"><label>Ciudad de Origen</label>
          <input value="${v.ciudad_origen||""}" onchange="state.victimas[${i}].ciudad_origen=this.value"></div>
        <div class="field-group col-span-2"><label>Domicilio</label>
          <input value="${v.domicilio||""}" onchange="state.victimas[${i}].domicilio=this.value"></div>
        <div class="field-group"><label>Delito Sufrido</label>
          <select id="vic-del-${i}" onchange="state.victimas[${i}].delito=this.value">
            ${buildSelect(CATALOGS.delitos.map(d=>d.nombre))}</select></div>
        <div class="field-group"><label>Etnia Indígena</label>
          <select id="vic-etnia-${i}" onchange="state.victimas[${i}].etnia=this.value">
            ${buildSelect(CATALOGS.etnias)}</select></div>
        <div class="field-group"><label>¿Requirió Canalización?</label>
          <select id="vic-can-${i}" onchange="state.victimas[${i}].canalizacion=this.value">
            ${buildSelect(["SI","NO"])}</select></div>
        <div class="field-group"><label>Atención Legal</label>
          <select id="vic-atleg-${i}" onchange="state.victimas[${i}].orientacion_legal=this.value">
            ${buildSelect(["Ministerio Publico","Justicia Civica","Trabajo Social","Otro"])}</select></div>
        <div class="field-group"><label>Especifique Atención Legal</label>
          <input value="${v.especifique_orientacion_legal||""}" onchange="state.victimas[${i}].especifique_orientacion_legal=this.value"></div>
        <div class="field-group"><label>Atención Psicológica</label>
          <select id="vic-atpsi-${i}" onchange="state.victimas[${i}].orientacion_psicologica=this.value">
            ${buildSelect(["Institucion Publica","Asociacion Civil","No requirió"])}</select></div>
        <div class="field-group"><label>Atención Médica</label>
          <select id="vic-atmed-${i}" onchange="state.victimas[${i}].orientacion_medica=this.value">
            ${buildSelect(["Hospital General","Hospital Infantil","Cruz Roja","IMSS","ISSSTE","Otro","No requirió"])}</select></div>
        <div class="field-group"><label>Especifique Atención Médica</label>
          <input value="${v.especifique_orientacion_medica||""}" onchange="state.victimas[${i}].especifique_orientacion_medica=this.value"></div>
        <div class="field-group"><label>Es Menor</label>
          <select id="vic-menor-${i}" onchange="state.victimas[${i}].es_menor=this.value;renderVictimas()">
            ${buildSelect(["SI","NO"])}</select></div>
        <div class="field-group"><label>Es Migrante</label>
          <select id="vic-migr-${i}" onchange="state.victimas[${i}].es_migrante=this.value">
            ${buildSelect(["SI","NO"])}</select></div>
      </div>
    </div>`).join("");
  state.victimas.forEach((v,i) => {
    setSelectValue(document.getElementById(`vic-gen-${i}`),   v.genero);
    setSelectValue(document.getElementById(`vic-pais-${i}`),  v.pais_origen);
    setSelectValue(document.getElementById(`vic-del-${i}`),   v.delito);
    setSelectValue(document.getElementById(`vic-etnia-${i}`), v.etnia);
    setSelectValue(document.getElementById(`vic-can-${i}`),   v.canalizacion);
    setSelectValue(document.getElementById(`vic-atleg-${i}`), v.orientacion_legal);
    setSelectValue(document.getElementById(`vic-atpsi-${i}`), v.orientacion_psicologica);
    setSelectValue(document.getElementById(`vic-atmed-${i}`), v.orientacion_medica);
    setSelectValue(document.getElementById(`vic-menor-${i}`), v.es_menor);
    setSelectValue(document.getElementById(`vic-migr-${i}`),  v.es_migrante);
  });
}
function addVictima() { state.victimas.push({}); renderVictimas(); openSection("sec-victimas"); }
function removeVictima(i) { state.victimas.splice(i,1); renderVictimas(); }

// ============================================================
// PERSONAS RESGUARDADAS
// ============================================================
function renderResguardados() {
  const c = document.getElementById("lista-resguardados");
  if (!c) return;
  if (!state.personas_resguardadas.length) { c.innerHTML = '<p class="empty-hint">Sin personas resguardadas.</p>'; return; }
  c.innerHTML = state.personas_resguardadas.map((p, i) => `
    <div class="card-item">
      ${cardHeader(
        `Persona ${i+1}: ${p.nombre||""} ${p.paterno||""}`,
        `removeResguardado(${i})`,
        p.es_menor==="SI"?badge("MENOR","orange"):""
      )}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Nombre(s)</label>
          <input value="${p.nombre||""}" onchange="state.personas_resguardadas[${i}].nombre=this.value"></div>
        <div class="field-group"><label>Apellido Paterno</label>
          <input value="${p.paterno||""}" onchange="state.personas_resguardadas[${i}].paterno=this.value"></div>
        <div class="field-group"><label>Apellido Materno</label>
          <input value="${p.materno||""}" onchange="state.personas_resguardadas[${i}].materno=this.value"></div>
        <div class="field-group"><label>Edad</label>
          <input type="number" min="0" value="${p.edad||""}" onchange="state.personas_resguardadas[${i}].edad=this.value"></div>
        <div class="field-group"><label>Sexo</label>
          <select id="res-gen-${i}" onchange="state.personas_resguardadas[${i}].genero=this.value">
            ${buildSelect(["MASCULINO","FEMENINO"])}</select></div>
        <div class="field-group"><label>Teléfono</label>
          <input value="${p.telefono||""}" onchange="state.personas_resguardadas[${i}].telefono=this.value"></div>
        <div class="field-group col-span-2"><label>Domicilio</label>
          <input value="${p.domicilio||""}" onchange="state.personas_resguardadas[${i}].domicilio=this.value"></div>
        <div class="field-group"><label>Colonia</label>
          <input value="${p.colonia||""}" onchange="state.personas_resguardadas[${i}].colonia=this.value"></div>
        <div class="field-group"><label>No. Exterior</label>
          <input value="${p.no_exterior||""}" onchange="state.personas_resguardadas[${i}].no_exterior=this.value"></div>
        <div class="field-group"><label>No. Interior</label>
          <input value="${p.no_interior||""}" onchange="state.personas_resguardadas[${i}].no_interior=this.value"></div>
        <div class="field-group"><label>Ocupación</label>
          <input value="${p.ocupacion||""}" onchange="state.personas_resguardadas[${i}].ocupacion=this.value"></div>
        <div class="field-group col-span-2"><label>Motivo de Resguardo</label>
          <select id="res-mot-${i}" onchange="state.personas_resguardadas[${i}].motivo=this.value">
            ${buildSelect(CATALOGS.emergencias_tipos)}</select></div>
        <div class="field-group"><label>Canalización / Institución</label>
          <select id="res-inst-${i}" onchange="state.personas_resguardadas[${i}].canalizacion_institucion=this.value">
            ${buildSelect(["Trabajo Social","DEVIFG","Institucion Medica","Otro"])}</select></div>
        <div class="field-group"><label>Especifique Institución</label>
          <input value="${p.especifique_institucion||""}" onchange="state.personas_resguardadas[${i}].especifique_institucion=this.value"></div>
        <div class="field-group"><label>Es Menor</label>
          <select id="res-menor-${i}" onchange="state.personas_resguardadas[${i}].es_menor=this.value;renderResguardados()">
            ${buildSelect(["SI","NO"])}</select></div>
      </div>
    </div>`).join("");
  state.personas_resguardadas.forEach((p,i) => {
    setSelectValue(document.getElementById(`res-gen-${i}`),   p.genero);
    setSelectValue(document.getElementById(`res-menor-${i}`), p.es_menor);
    setSelectValue(document.getElementById(`res-mot-${i}`),   p.motivo);
    setSelectValue(document.getElementById(`res-inst-${i}`),  p.canalizacion_institucion);
  });
}
function addResguardado() { state.personas_resguardadas.push({ canalizacion_institucion:"Trabajo Social" }); renderResguardados(); openSection("sec-resguardados"); }
function removeResguardado(i) { state.personas_resguardadas.splice(i,1); renderResguardados(); }

// ============================================================
// CLASI_HECHOS (top-level)
// ============================================================
function renderClasiHechos() {
  const c = document.getElementById("lista-clasi-hechos");
  if (!c) return;
  if (!state.clasi_hechos.length) { c.innerHTML = '<p class="empty-hint">Sin delitos clasificados.</p>'; return; }
  c.innerHTML = state.clasi_hechos.map((ch, i) => `
    <div class="card-item">
      ${cardHeader(`Delito ${i+1}: ${ch.nombre_delito||"(sin seleccionar)"}`, `removeClasiHecho(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Nombre Delito</label>
          <select id="ch-nd-${i}" onchange="state.clasi_hechos[${i}].nombre_delito=this.value;autofillClasiHecho(${i})">
            ${buildSelect(CATALOGS.delitos.map(d=>d.nombre))}</select></div>
        <div class="field-group"><label>Especifique</label>
          <input value="${ch.especifique_delito||""}" onchange="state.clasi_hechos[${i}].especifique_delito=this.value"></div>
        <div class="field-group"><label>Clasificación</label>
          <input id="ch-cl-${i}" value="${ch.clasificacion_delito||""}" onchange="state.clasi_hechos[${i}].clasificacion_delito=this.value"></div>
        <div class="field-group"><label>Nombre Sub-delito</label>
          <input value="${ch.nombre_subdelito||""}" onchange="state.clasi_hechos[${i}].nombre_subdelito=this.value"></div>
        <div class="field-group"><label>Especifique Sub-delito</label>
          <input value="${ch.especifique_subdelito||""}" onchange="state.clasi_hechos[${i}].especifique_subdelito=this.value"></div>
        <div class="field-group"><label>Clasificación Sub-delito</label>
          <input value="${ch.clasificacion_subdelito||""}" onchange="state.clasi_hechos[${i}].clasificacion_subdelito=this.value"></div>
        <div class="field-group"><label>¿Hubo Violencia?</label>
          <select id="ch-viol-${i}" onchange="state.clasi_hechos[${i}].hubo_violencia=this.value">
            ${buildSelect(["SI","NO","N/A"])}</select></div>
        <div class="field-group"><label>Modalidad</label>
          <input value="${ch.modalidad||""}" onchange="state.clasi_hechos[${i}].modalidad=this.value"></div>
      </div>
    </div>`).join("");
  state.clasi_hechos.forEach((ch,i) => {
    setSelectValue(document.getElementById(`ch-nd-${i}`),   ch.nombre_delito);
    setSelectValue(document.getElementById(`ch-viol-${i}`), ch.hubo_violencia);
  });
}
function addClasiHecho() { state.clasi_hechos.push({}); renderClasiHechos(); }
function removeClasiHecho(i) { state.clasi_hechos.splice(i,1); renderClasiHechos(); }
function autofillClasiHecho(i) {
  const nombre = state.clasi_hechos[i].nombre_delito;
  const found = CATALOGS.delitos.find(d => d.nombre === nombre);
  if (found) {
    state.clasi_hechos[i].clasificacion_delito = found.clasificacion;
    const el = document.getElementById(`ch-cl-${i}`);
    if (el) el.value = found.clasificacion;
  }
}

// ============================================================
// EMERGENCIAS
// ============================================================
function renderEmergencias() {
  const c = document.getElementById("lista-emergencias");
  if (!c) return;
  if (!state.emergencias.length) { c.innerHTML = '<p class="empty-hint">Sin emergencias registradas.</p>'; return; }
  c.innerHTML = state.emergencias.map((e, i) => `
    <div class="card-item">
      ${cardHeader(`Emergencia ${i+1}: ${e.descripcion||""}`, `removeEmergencia(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Tipo de Emergencia</label>
          <select id="em-desc-${i}" onchange="state.emergencias[${i}].descripcion=this.value;autofillEmergencia(${i})">
            ${buildSelect(CATALOGS.emergencias_tipos)}</select></div>
        <div class="field-group"><label>Especifique Sub-tipo</label>
          <input value="${e.especifique_subtipo||""}" onchange="state.emergencias[${i}].especifique_subtipo=this.value"></div>
        <div class="field-group"><label>Clasificación (auto)</label>
          <input id="em-cl-${i}" value="${e.clasificacion||""}" readonly></div>
        <div class="field-group"><label>¿Hubo Violencia?</label>
          <select id="em-viol-${i}" onchange="state.emergencias[${i}].hubo_violencia=this.value">
            ${buildSelect(["SI","NO"])}</select></div>
        <div class="field-group"><label>Tipo de Arma (si aplica)</label>
          <input value="${e.tipo_arma||""}" onchange="state.emergencias[${i}].tipo_arma=this.value"></div>
      </div>
    </div>`).join("");
  state.emergencias.forEach((e,i) => {
    setSelectValue(document.getElementById(`em-desc-${i}`), e.descripcion);
    setSelectValue(document.getElementById(`em-viol-${i}`), e.hubo_violencia);
  });
}
function addEmergencia() { state.emergencias.push({}); renderEmergencias(); openSection("sec-emergencias"); }
function removeEmergencia(i) { state.emergencias.splice(i,1); renderEmergencias(); }
function autofillEmergencia(i) {
  const desc = state.emergencias[i].descripcion;
  const cl = CATALOGS.emergencias_clasificaciones[desc] || "";
  state.emergencias[i].clasificacion = cl;
  const el = document.getElementById(`em-cl-${i}`);
  if (el) el.value = cl;
}

// ============================================================
// FALTA ADMIN
// ============================================================
function renderFaltas() {
  const c = document.getElementById("lista-faltas");
  if (!c) return;
  if (!state.falta_admin.length) { c.innerHTML = '<p class="empty-hint">Sin faltas registradas.</p>'; return; }
  c.innerHTML = state.falta_admin.map((f, i) => `
    <div class="card-item">
      ${cardHeader(`Falta ${i+1}: ${f.clasificacion||""}`, `removeFalta(${i})`)}
      <div class="card-item-body grid-3">
        <div class="field-group"><label>Clasificación</label>
          <select id="fa-cl-${i}" onchange="state.falta_admin[${i}].clasificacion=this.value;updateFaltaFracciones(${i})">
            ${buildSelect(CATALOGS.falta_clasificaciones)}</select></div>
        <div class="field-group"><label>Fracción</label>
          <select id="fa-fr-${i}" onchange="state.falta_admin[${i}].fraccion=this.value">
            <option value="">Seleccionar clasificación primero...</option>
          </select></div>
        <div class="field-group"><label>Descripción</label>
          <input value="${f.descripcion||""}" onchange="state.falta_admin[${i}].descripcion=this.value"></div>
      </div>
    </div>`).join("");
  state.falta_admin.forEach((f,i) => {
    setSelectValue(document.getElementById(`fa-cl-${i}`), f.clasificacion);
    if (f.clasificacion) updateFaltaFracciones(i, f.fraccion);
  });
}
function updateFaltaFracciones(i, currentVal) {
  const cl = state.falta_admin[i].clasificacion;
  const sel = document.getElementById(`fa-fr-${i}`);
  if (!sel || !cl) return;
  const opts = CATALOGS.falta_fracciones[cl] || [];
  sel.innerHTML = buildSelect(opts);
  if (currentVal) sel.value = currentVal;
}
function addFalta() { state.falta_admin.push({}); renderFaltas(); openSection("sec-faltas"); }
function removeFalta(i) { state.falta_admin.splice(i,1); renderFaltas(); }

// ============================================================
// DILIGENCIAS
// ============================================================
function renderDiligencias() {
  const c = document.getElementById("lista-diligencias");
  if (!c) return;
  if (!state.diligencias.length) { c.innerHTML = '<p class="empty-hint">Sin diligencias registradas.</p>'; return; }
  c.innerHTML = state.diligencias.map((d, i) => `
    <div class="card-item">
      ${cardHeader(`Diligencia ${i+1}: ${d.tipo||""}`, `removeDiligencia(${i})`)}
      <div class="card-item-body grid-2">
        <div class="field-group"><label>Tipo de Diligencia</label>
          <select id="dil-tipo-${i}" onchange="state.diligencias[${i}].tipo=this.value">
            ${buildSelect(CATALOGS.diligencias_tipos)}</select></div>
      </div>
    </div>`).join("");
  state.diligencias.forEach((d,i) => setSelectValue(document.getElementById(`dil-tipo-${i}`), d.tipo));
}
function addDiligencia() { state.diligencias.push({}); renderDiligencias(); openSection("sec-diligencias"); }
function removeDiligencia(i) { state.diligencias.splice(i,1); renderDiligencias(); }

// ============================================================
// PARA CONOCIMIENTO
// ============================================================
function renderConocimiento() {
  const c = document.getElementById("lista-conocimiento");
  if (!c) return;
  if (!state.para_conocimiento.length) { c.innerHTML = '<p class="empty-hint">Sin registros.</p>'; return; }
  c.innerHTML = state.para_conocimiento.map((p, i) => `
    <div class="card-item">
      ${cardHeader(`Registro ${i+1}: ${p.tipo||""}`, `removeConocimiento(${i})`)}
      <div class="card-item-body grid-2">
        <div class="field-group"><label>Tipo</label>
          <select id="con-tipo-${i}" onchange="state.para_conocimiento[${i}].tipo=this.value">
            ${buildSelect(CATALOGS.para_conocimiento_tipos)}</select></div>
      </div>
    </div>`).join("");
  state.para_conocimiento.forEach((p,i) => setSelectValue(document.getElementById(`con-tipo-${i}`), p.tipo));
}
function addConocimiento() { state.para_conocimiento.push({}); renderConocimiento(); openSection("sec-conocimiento"); }
function removeConocimiento(i) { state.para_conocimiento.splice(i,1); renderConocimiento(); }

// ============================================================
// ASEG_ARMAS
// ============================================================
function renderArmas() {
  const c = document.getElementById("lista-armas");
  if (!c) return;
  if (!state.aseg_armas.length) { c.innerHTML = '<p class="empty-hint">Sin armas registradas.</p>'; return; }
  c.innerHTML = state.aseg_armas.map((a, i) => `
    <div class="card-item">
      ${cardHeader(`Arma ${i+1}: ${a.nombre_arma||a.clasificacion_arma||""}`, `removeArma(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Clasificación</label>
          <select id="arm-cl-${i}" onchange="state.aseg_armas[${i}].clasificacion_arma=this.value;updateArmasTipos(${i})">
            ${buildSelect(CATALOGS.armas_clasificaciones)}</select></div>
        <div class="field-group"><label>Tipo</label>
          <select id="arm-tp-${i}" onchange="state.aseg_armas[${i}].tipo_arma=this.value">
            <option value="">Seleccionar clasificación...</option></select></div>
        <div class="field-group"><label>Nombre / Descripción</label>
          <input value="${a.nombre_arma||""}" onchange="state.aseg_armas[${i}].nombre_arma=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
        <div class="field-group"><label>Calibre</label>
          <select id="arm-cal-${i}" onchange="state.aseg_armas[${i}].calibre_arma=this.value">
            ${buildSelect(CATALOGS.armas_calibres)}</select></div>
        <div class="field-group"><label>Cantidad</label>
          <input type="number" min="1" value="${a.cantidad_arma||1}" onchange="state.aseg_armas[${i}].cantidad_arma=this.value"></div>
        <div class="field-group col-span-2"><label>Descripción del Arma</label>
          <input value="${a.descripcion_arma||""}" onchange="state.aseg_armas[${i}].descripcion_arma=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
        <div class="field-group"><label>No. de Serie</label>
          <input value="${a.num_serie||""}" onchange="state.aseg_armas[${i}].num_serie=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
        <div class="field-group"><label>Marca / Fabricante</label>
          <input value="${a.marca||""}" onchange="state.aseg_armas[${i}].marca=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
        <div class="field-group"><label>Cargadores</label>
          <input type="number" min="0" value="${a.cargadores||""}" onchange="state.aseg_armas[${i}].cargadores=this.value"></div>
        <div class="field-group"><label>Cartuchos</label>
          <input type="number" min="0" value="${a.cartuchos||""}" onchange="state.aseg_armas[${i}].cartuchos=this.value"></div>
        <div class="field-group"><label>Revólver / Automática</label>
          <select id="arm-rev-${i}" onchange="state.aseg_armas[${i}].revolver_automatica=this.value">
            ${buildSelect(["REVÓLVER","SEMIAUTOMÁTICA","AUTOMÁTICA","N/A"])}</select></div>
        <div class="field-group"><label>Puesta a Disposición</label>
          <input value="${a.puesta_disposicion||""}" onchange="state.aseg_armas[${i}].puesta_disposicion=this.value"></div>
        <div class="field-group"><label>Consignación FGR</label>
          <input value="${a.consignacion_fgr||""}" onchange="state.aseg_armas[${i}].consignacion_fgr=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
        <div class="field-group"><label>Consignación FGE</label>
          <input value="${a.consignacion_fge||""}" onchange="state.aseg_armas[${i}].consignacion_fge=this.value.toUpperCase();this.value=this.value.toUpperCase()"></div>
      </div>
    </div>`).join("");
  state.aseg_armas.forEach((a,i) => {
    setSelectValue(document.getElementById(`arm-cl-${i}`),  a.clasificacion_arma);
    if (a.clasificacion_arma) updateArmasTipos(i, a.tipo_arma);
    setSelectValue(document.getElementById(`arm-cal-${i}`), a.calibre_arma);
    setSelectValue(document.getElementById(`arm-rev-${i}`), a.revolver_automatica);
  });
}
function updateArmasTipos(i, current) {
  const cl = state.aseg_armas[i].clasificacion_arma;
  const sel = document.getElementById(`arm-tp-${i}`);
  if (!sel || !cl) return;
  const tipos = CATALOGS.armas_tipos[cl] || [];
  sel.innerHTML = buildSelect(tipos);
  if (current) sel.value = current;
}
function addArma() { state.aseg_armas.push({ cantidad_arma:1 }); renderArmas(); openSection("sec-armas"); }
function removeArma(i) { state.aseg_armas.splice(i,1); renderArmas(); }

// ============================================================
// ASEG_SUSTANCIAS
// ============================================================
function renderSustancias() {
  const c = document.getElementById("lista-sustancias");
  if (!c) return;
  if (!state.aseg_sustancias.length) { c.innerHTML = '<p class="empty-hint">Sin sustancias registradas.</p>'; return; }
  c.innerHTML = state.aseg_sustancias.map((s, i) => `
    <div class="card-item">
      ${cardHeader(`Sustancia ${i+1}: ${s.tipo_sustancia||""}`, `removeSustancia(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Tipo de Sustancia</label>
          <select id="sus-tp-${i}" onchange="state.aseg_sustancias[${i}].tipo_sustancia=this.value">
            ${buildSelect(CATALOGS.sustancias_tipos)}</select></div>
        <div class="field-group"><label>Especifique</label>
          <input value="${s.especifique_sustancia||""}" onchange="state.aseg_sustancias[${i}].especifique_sustancia=this.value"></div>
        <div class="field-group"><label>Unidad de Medida</label>
          <select id="sus-um-${i}" onchange="state.aseg_sustancias[${i}].unidad_medida=this.value">
            ${buildSelect(CATALOGS.unidades_medida)}</select></div>
        <div class="field-group"><label>Especifique Unidad</label>
          <input value="${s.especifique_unidad_medida||""}" onchange="state.aseg_sustancias[${i}].especifique_unidad_medida=this.value"></div>
        <div class="field-group"><label>Cantidad</label>
          <input value="${s.cantidad_sustancia||""}" onchange="state.aseg_sustancias[${i}].cantidad_sustancia=this.value"></div>
        <div class="field-group"><label>Peso en</label>
          <select id="sus-pe-${i}" onchange="state.aseg_sustancias[${i}].peso_en=this.value;calcPeso(${i})">
            ${buildSelect(["GRAMOS","KG"])}</select></div>
        <div class="field-group"><label>Cantidad de Peso</label>
          <input type="number" step="0.001" min="0" value="${s.cantidad_peso||""}" onchange="state.aseg_sustancias[${i}].cantidad_peso=parseFloat(this.value);calcPeso(${i})"></div>
        <div class="field-group"><label>Total en Gramos (auto)</label>
          <input id="sus-gr-${i}" value="${s.cantidad_gramos||""}" readonly></div>
        <div class="field-group"><label>Total en KG (auto)</label>
          <input id="sus-kg-${i}" value="${s.cantidad_kg||""}" readonly></div>
      </div>
    </div>`).join("");
  state.aseg_sustancias.forEach((s,i) => {
    setSelectValue(document.getElementById(`sus-tp-${i}`), s.tipo_sustancia);
    setSelectValue(document.getElementById(`sus-um-${i}`), s.unidad_medida);
    setSelectValue(document.getElementById(`sus-pe-${i}`), s.peso_en);
  });
}
function calcPeso(i) {
  const s = state.aseg_sustancias[i];
  if (!s.cantidad_peso) return;
  s.cantidad_gramos = s.peso_en === "KG" ? s.cantidad_peso * 1000 : s.cantidad_peso;
  s.cantidad_kg     = s.peso_en === "KG" ? s.cantidad_peso        : s.cantidad_peso / 1000;
  const gr = document.getElementById(`sus-gr-${i}`);
  const kg = document.getElementById(`sus-kg-${i}`);
  if (gr) gr.value = s.cantidad_gramos.toFixed(3);
  if (kg) kg.value = s.cantidad_kg.toFixed(3);
}
function addSustancia() { state.aseg_sustancias.push({}); renderSustancias(); openSection("sec-sustancias"); }
function removeSustancia(i) { state.aseg_sustancias.splice(i,1); renderSustancias(); }

// ============================================================
// ASEG_OBJETOS
// ============================================================
function renderObjetos() {
  const c = document.getElementById("lista-objetos");
  if (!c) return;
  if (!state.aseg_objetos.length) { c.innerHTML = '<p class="empty-hint">Sin objetos registrados.</p>'; return; }
  c.innerHTML = state.aseg_objetos.map((o, i) => `
    <div class="card-item">
      ${cardHeader(`Objeto ${i+1}: ${o.tipo_objeto||""}`, `removeObjeto(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Tipo de Objeto</label>
          <select id="obj-tp-${i}" onchange="state.aseg_objetos[${i}].tipo_objeto=this.value">
            ${buildSelect(CATALOGS.objetos_tipos)}</select></div>
        <div class="field-group"><label>Especifique</label>
          <input value="${o.especifique_objeto||""}" onchange="state.aseg_objetos[${i}].especifique_objeto=this.value"></div>
        <div class="field-group"><label>Cantidad</label>
          <input value="${o.cantidad_objeto||""}" onchange="state.aseg_objetos[${i}].cantidad_objeto=this.value"></div>
        <div class="field-group"><label>Unidad de Medida</label>
          <input value="${o.unidad_medida||""}" onchange="state.aseg_objetos[${i}].unidad_medida=this.value"></div>
      </div>
    </div>`).join("");
  state.aseg_objetos.forEach((o,i) => setSelectValue(document.getElementById(`obj-tp-${i}`), o.tipo_objeto));
}
function addObjeto() { state.aseg_objetos.push({}); renderObjetos(); openSection("sec-objetos"); }
function removeObjeto(i) { state.aseg_objetos.splice(i,1); renderObjetos(); }

// ============================================================
// INS_VEHICULOS
// ============================================================
function renderVehiculos() {
  const c = document.getElementById("lista-vehiculos");
  if (!c) return;
  if (!state.ins_vehiculos.length) { c.innerHTML = '<p class="empty-hint">Sin vehículos registrados.</p>'; return; }
  c.innerHTML = state.ins_vehiculos.map((v, i) => `
    <div class="card-item">
      ${cardHeader(`Vehículo ${i+1}: ${v.marca||""} ${v.submarca||""} ${v.modelo||""}`, `removeVehiculo(${i})`)}
      <div class="card-item-body grid-4">
        <div class="field-group"><label>Tipo</label>
          <select id="veh-tp-${i}" onchange="state.ins_vehiculos[${i}].tipo=this.value;updateMarcasVehiculo(${i})">
            ${buildSelect(CATALOGS.vehiculos_tipos)}</select></div>
        <div class="field-group"><label>Marca</label>
          <select id="veh-ma-${i}" onchange="state.ins_vehiculos[${i}].marca=this.value">
            ${buildSelect(CATALOGS.marcas_autos)}</select></div>
        <div class="field-group"><label>Sub-marca</label>
          <input value="${v.submarca||""}" onchange="state.ins_vehiculos[${i}].submarca=this.value"></div>
        <div class="field-group"><label>Modelo / Año</label>
          <input value="${v.modelo||""}" placeholder="Ej. Sentra 2020" onchange="state.ins_vehiculos[${i}].modelo=this.value"></div>
        <div class="field-group"><label>No. de Serie (NIV)</label>
          <input value="${v.num_serie||""}" onchange="state.ins_vehiculos[${i}].num_serie=this.value"></div>
        <div class="field-group"><label>Placas</label>
          <input value="${v.placas||""}" onchange="state.ins_vehiculos[${i}].placas=this.value"></div>
        <div class="field-group"><label>Entidad Emplacado</label>
          <select id="veh-ent-${i}" onchange="state.ins_vehiculos[${i}].entidad_emplacado=this.value">
            ${buildSelect(CATALOGS.entidades_placa)}</select></div>
        <div class="field-group"><label>Color</label>
          <select id="veh-col-${i}" onchange="state.ins_vehiculos[${i}].color=this.value">
            ${buildSelect(CATALOGS.colores_vehiculo)}</select></div>
        <div class="field-group col-span-2"><label>Descripción del Vehículo</label>
          <input value="${v.descripcion_vehiculo||""}" onchange="state.ins_vehiculos[${i}].descripcion_vehiculo=this.value"></div>
        <div class="field-group"><label>Motivo de Aseguramiento</label>
          <select id="veh-mot-${i}" onchange="state.ins_vehiculos[${i}].motivo_aseguramiento=this.value">
            ${buildSelect(CATALOGS.motivos_aseg_vehiculo)}</select></div>
        <div class="field-group"><label>Lugar de Depósito</label>
          <select id="veh-lug-${i}" onchange="state.ins_vehiculos[${i}].lugar_deposito=this.value">
            ${buildSelect(CATALOGS.lugares_deposito)}</select></div>
        <div class="field-group"><label>Estado del Vehículo</label>
          <select id="veh-est-${i}" onchange="state.ins_vehiculos[${i}].estado_vehiculo=this.value">
            ${buildSelect(["ASEGURAMIENTO","ACCIDENTADO","ABANDONADO","RECUPERADO","OTRO"])}</select></div>
      </div>
    </div>`).join("");
  state.ins_vehiculos.forEach((v,i) => {
    setSelectValue(document.getElementById(`veh-tp-${i}`),  v.tipo);
    setSelectValue(document.getElementById(`veh-ma-${i}`),  v.marca);
    setSelectValue(document.getElementById(`veh-ent-${i}`), v.entidad_emplacado);
    setSelectValue(document.getElementById(`veh-col-${i}`), v.color);
    setSelectValue(document.getElementById(`veh-mot-${i}`), v.motivo_aseguramiento);
    setSelectValue(document.getElementById(`veh-lug-${i}`), v.lugar_deposito);
    setSelectValue(document.getElementById(`veh-est-${i}`), v.estado_vehiculo);
  });
}
function addVehiculo() { state.ins_vehiculos.push({ estado_vehiculo:"ASEGURAMIENTO" }); renderVehiculos(); openSection("sec-vehiculos"); }
function removeVehiculo(i) { state.ins_vehiculos.splice(i,1); renderVehiculos(); }

// ============================================================
// EXPORT JSON
// ============================================================
function exportarJSON() {
  const campos = {};
  document.querySelectorAll("[id^='PI_']").forEach(el => {
    if (el.value !== undefined) campos[el.id] = el.value;
  });
  const doc = {
    folio: state.folio,
    tipo: "Parte Informativo",
    estatus: "EN PROCESO",
    fecha_creacion: new Date().toISOString(),
    quejoso_es_menor:    document.getElementById("PI_20") ? (parseInt(document.getElementById("PI_20").value||0)<18&&document.getElementById("PI_31")?.value==="SI" ? "SI":"NO") : "NO",
    quejoso_es_migrante: document.getElementById("quejoso_es_migrante")?.value || "NO",
    folio_iuf: document.getElementById("folio_iuf")?.value || "",
    iph_id: document.getElementById("iph_id")?.value || "",
    campos,
    agentes: state.agentes,
    detenidos: state.detenidos,
    victimas: state.victimas,
    personas_resguardadas: state.personas_resguardadas,
    clasi_hechos: state.clasi_hechos,
    emergencias: state.emergencias,
    falta_admin: state.falta_admin,
    diligencias: state.diligencias,
    para_conocimiento: state.para_conocimiento,
    aseg_armas: state.aseg_armas,
    aseg_sustancias: state.aseg_sustancias,
    aseg_objetos: state.aseg_objetos,
    ins_vehiculos: state.ins_vehiculos,
  };
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${state.folio}.json`; a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// INIT
// ============================================================
function init() {
  const folioEl = document.getElementById("folio-display");
  if (folioEl) folioEl.textContent = state.folio;

  const pi8 = document.getElementById("PI_8");
  if (pi8) pi8.max = new Date().toISOString().split("T")[0];

  document.getElementById("PI_19")?.addEventListener("change", applyMotivoLogic);
  document.getElementById("PI_31")?.addEventListener("change", applyQuejosaLogic);
  document.getElementById("PI_22")?.addEventListener("change", applyPaisLogic);
  document.getElementById("PI_20")?.addEventListener("input",  applyEdadQuejosaLogic);
  document.getElementById("PI_32")?.addEventListener("change", applyDetenidosLogic);
  document.getElementById("PI_33")?.addEventListener("change", applyVictimasLogic);
  document.getElementById("PI_51")?.addEventListener("change", applyPI51Logic);
  ["PI_34","PI_35","PI_36","PI_37"].forEach(id =>
    document.getElementById(id)?.addEventListener("change", applyAseguramientoLogic));
  document.getElementById("PI_17")?.addEventListener("input",  validarNarrativa);
  document.getElementById("PI_52")?.addEventListener("input",  actualizarCoords);
  document.getElementById("PI_53")?.addEventListener("input",  actualizarCoords);

  // Populate catalog selects
  const maps = {
    PI_5:  "distritos_pi", PI_29: "distritos_pi29", PI_4: "sectores",
    PI_11: "colonias",     PI_30: "codigos_postales",
    PI_22: "paises",       PI_23: "estados_mexico",
  };
  Object.entries(maps).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    (CATALOGS[key]||[]).forEach(item => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = item;
      el.appendChild(opt);
    });
  });

  applyMotivoLogic();
  applyQuejosaLogic();
  applyPaisLogic();
  applyDetenidosLogic();
  applyVictimasLogic();
  applyPI51Logic();
  applyAseguramientoLogic();
  validarNarrativa();

  renderAgentes();
  renderDetenidos();
  renderVictimas();
  renderResguardados();
  renderClasiHechos();
  renderEmergencias();
  renderFaltas();
  renderDiligencias();
  renderConocimiento();
  renderArmas();
  renderSustancias();
  renderObjetos();
  renderVehiculos();
}

document.addEventListener("DOMContentLoaded", init);
