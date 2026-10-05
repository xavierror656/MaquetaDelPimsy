# DESIGN — la biblia de leyes de diseño de PIMSy

Estas leyes son **estrictas**: se revisan solas con `node maqueta/tools/lint-design.mjs` (también en GitHub Actions antes de publicar).
Si una ley estorba, se cambia **aquí** primero y luego el código; nunca al revés.

## 0. Mapa

```
css/theme.css        TOKENS  — único lugar con valores (colores, tamaños, espacios, radios, sombras, capas)
css/base.css         base    — reset, tipografía de elementos, utilidades neutras
css/atoms.css        ÁTOMOS
css/molecules.css    MOLÉCULAS
css/organisms.css    ORGANISMOS
css/responsive.css   umbrales, táctil, movimiento reducido, impresión

ui/atoms.js          UI.atoms        funciones puras → HTML
ui/molecules.js      UI.molecules    usan solo átomos
ui/organisms.js      UI.organisms    usan átomos y moléculas
ui/theme.js          THEME           mueve las perillas y resuelve claro/oscuro

app.js               PÁGINAS y adaptadores del dominio (compone organismos; traduce dominio → props)
esquema.js           datos de formularios (campos, catálogos, permisos)  ·  catalogos.js  datos
```

Dirección de dependencias (solo hacia abajo, nunca saltarse ni subir):
`tokens → átomos → moléculas → organismos → páginas (app.js)`

## 1. Leyes de arquitectura

1. **Una capa solo usa capas inferiores.** Un átomo no usa moléculas; una molécula no usa organismos; la capa `ui/` no usa `app.js`.
2. **La capa `ui/` no conoce el dominio.** Prohibido mencionar eventos, departamentos, permisos, catálogos (`DEPTS`, `PERM`, `COMP`, `ENT`, `CAT`, `can()`…). Recibe todo ya preparado por parámetros.
3. **Las páginas no inventan apariencia.** `app.js` compone organismos y moléculas; si necesita una pieza nueva, primero se crea en la capa que le toca.
4. **Funciones puras.** Un componente recibe un objeto de props y devuelve HTML (excepción documentada: `UI.molecules.toast` devuelve un elemento DOM).
5. **Un componente, una responsabilidad.** Si necesita «y además», se divide.

## 2. Leyes de tokens (el tema centraliza TODO)

6. **Todo valor de diseño vive en `css/theme.css`.** Ningún otro `.css` ni `.js` puede escribir un color, tamaño de letra, `z-index`, sombra o radio literal. Solo `var(--token)`.
7. **Tres capas de tokens:** *perillas* (las mueve el panel «Diseño»), *primitivos* (valores crudos) y *semánticos* (lo que usan los componentes). Los componentes usan **solo semánticos**.
8. **Las perillas** son: matiz de la marca, tamaño del texto, espaciado (densidad) y redondeo. Cambiarlas debe verse bien en toda la interfaz sin tocar un componente.
9. **El tema oscuro solo redefine semánticos** (`html[data-theme=dark]`). Un componente nunca pregunta por el tema.
10. **Un token nuevo** se agrega en `theme.css` con nombre semántico (`--color-danger`, no `--rojo`) y se documenta en la sección 6.

## 3. Leyes visuales

11. **Color con significado fijo:** éxito (verde), atención (ámbar), peligro (rojo), por validar (violeta), información (azul cielo). Nunca se usa un color con otro significado.
12. **El color nunca va solo:** todo estado lleva también texto o icono (accesibilidad y daltonismo).
13. **Contraste:** texto normal ≥ 4.5:1, texto grande e iconos ≥ 3:1, en claro y en oscuro.
14. **Tipografía:** solo la escala `--text-xs … --text-display`. Pesos `--weight-*`. Prohibido un tamaño nuevo.
15. **Espacio:** solo `--space-1 … --space-7` (base 4 px × densidad). Prohibido un margen o padding literal en componentes de `css/` (en JS, solo `var(--space-*)`).
16. **Forma:** radios `--radius-sm|md|lg|pill`. El filo de color a la izquierda de una tarjeta es `--accent-w`.
17. **Elevación:** `--shadow-sm|md|lg`. Una tarjeta en reposo usa `sm`; lo flotante (menús, diálogos, avisos) usa `md`/`lg`.
18. **Acento por departamento:** `--dc` (lo fija la app). Se usa en el filo del encabezado, tarjetas y pestañas activas; nunca para texto de cuerpo.
19. **Iconos:** solo el set Lucide embebido (`UI.ICONS`), a `1.1em`, heredan el color del texto. **Prohibidos los emojis** en cualquier archivo.

## 4. Leyes de interacción y accesibilidad

20. **Todo control tiene sus estados:** reposo, hover, foco visible, deshabilitado, activo. Los campos además tienen error y correcto.
21. **Un botón deshabilitado dice por qué** (`UI.molecules.actionButton`: «Lo aporta Jurídico» + etiqueta POR VALIDAR si aplica).
22. **Alturas de control:** 36 px (`--control-h`), 42 px en formularios (`--control-h-lg`), 44 px en pantallas táctiles (`--control-h-touch`).
23. **Teclado completo:** todo se alcanza y se opera con teclado; `Esc` cierra; el foco nunca se pierde. El foco usa `--focus-ring`.
24. **Semántica:** `label` en cada campo, `role`/`aria-*` en pestañas, avisos (`role=status|alert`) y barras de progreso.
25. **Movimiento** solo con `--motion-*` y se apaga con `prefers-reduced-motion`.
26. **Errores:** aparecen al salir del campo o al enviar, nunca mientras se escribe por primera vez. Siempre dicen qué hacer.
27. **Acciones destructivas** (cerrar, anular, fusionar, quitar, reiniciar) piden confirmación y ofrecen «Deshacer» cuando se puede.

## 5. Leyes de contenido

28. **Español sencillo, voz «tú»**, frases cortas, sin jerga técnica en pantalla (los nombres de tablas/columnas van en «Datos técnicos»).
29. **Todo lo no decidido lleva `POR VALIDAR(Q-xx)`** con la pregunta que lo desbloquea (`UI.atoms.tagValidar`). Los catálogos ficticios llevan `ejemplo`.
30. **Datos 100 % sintéticos.** Nunca datos personales reales.
31. **Responsivo con un solo umbral:** 720 px. Debajo, la navegación pasa abajo, las tablas se vuelven tarjetas y los formularios ocupan toda la pantalla.

## 6. Catálogo de componentes

| Capa | Componente | Archivo | Para qué |
|---|---|---|---|
| Átomo | `icon` · `badge` · `tagValidar` · `tagEjemplo` · `button` · `hint` · `bar` · `mapPin` | `ui/atoms.js` | piezas indivisibles |
| Molécula | `actionButton` · `compactButton` · `kpi` · `emptyState` · `alert` · `tabs` · `toast` · `stepCard` · `roleCard` · `disclosure` · `menu` · `menuItem` · `searchBox` · `dataList` · `yesNo` · `field` · `commentButton` · `taskItem` · `statTile` · `barChart` | `ui/molecules.js` | una función concreta |
| Organismo | `navBar` · `kpiRow` · `guide` · `welcome` · `pieceBlock` · `recordGroup` · `timeline` · `roleGrid` · `confirmDialog` · `dialogShell` · `formDialog` · `tourStep` · `themePanel` · `searchResults` · `taskPanel` · `commentDialog` · `dashboard` · `comparison` · `mapCard` | `ui/organisms.js` | secciones completas |

**Tokens principales** (ver `css/theme.css`): `--color-brand|surface|text|text-muted|border|success|warning|danger|validate|info`, `--cat-1…5`, `--dept-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--control-h*`, `--z-*`, `--motion-*`.

## 7. Cómo agregar un componente (lista de verificación)

1. ¿Existe ya? Busca en la sección 6.
2. Decide la capa: ¿es indivisible (átomo)? ¿combina átomos para una función (molécula)? ¿es una sección completa (organismo)?
3. Escribe su estilo en el `.css` de su capa, solo con tokens. Si falta un valor, agrégalo a `theme.css`.
4. Escribe su función en el `.js` de su capa, sin dominio, recibiendo props.
5. Úsalo desde `app.js` mediante un adaptador que traduce el dominio a props.
6. Corre `node maqueta/tools/lint-design.mjs` y revisa en claro, oscuro y a 390 px de ancho.
7. Anótalo en la sección 6.

## 8. Cómo cambiar el aspecto

- **Rápido, por persona:** botón de la paleta (Diseño) en el encabezado: matiz, tamaño del texto, espaciado y redondeo. Se guarda en el navegador.
- **Para todos:** edita los valores por defecto de las perillas y los tokens en `css/theme.css`. Un solo archivo.

## 9. Correspondencia con el backend (Laravel)

El stack decidido es Laravel, no Symfony. Esta arquitectura se traslada así: `ui/atoms|molecules|organisms` → componentes Blade anónimos en `resources/views/components/{atoms,molecules,organisms}`; `css/theme.css` → se copia tal cual (variables CSS); las leyes 1–5 se mantienen. (Equivalente en Symfony UX: TwigComponents anónimos; no aplica a este proyecto.)

## 10. Gráficas (método de dataviz)

- **Una serie, un matiz** (`--chart-mark`, validado con `validate_palette.js` en claro y oscuro). Más de una serie exigiría una paleta categórica validada y leyenda.
- **Marcas delgadas** (≤ 24 px), extremo de datos redondeado 4 px, base cuadrada; ejes recesivos; valor al extremo; el texto nunca usa el color de la serie.
- **Siempre con vista de tabla** y tooltip al pasar o enfocar. Nunca eje doble.

## 11. Pruebas

`cd maqueta && npm install && npx playwright install chromium && npm test` corre 23 pruebas de navegador (formularios, permisos, cierre, fusión, Excel, búsqueda, sesión, comentarios, tablero, mapa, tema, accesibilidad) y el linter de leyes. GitHub Actions las corre antes de publicar.
