/* ============================================================
   TEMA CENTRAL — Mi Mercadito
   Fuente única de verdad para colores, tipografía y tamaños.
   Todos los componentes importan desde aquí.
   ============================================================ */

/* --- PALETA (contraste AAA sobre fondos claros) --- */
export const COLORS = {
  /* Fondos */
  bgPage:        '#f0f4f8',   /* gris muy claro, no blanco puro */
  bgCard:        '#ffffff',
  bgCardHover:   '#e8f4fd',

  /* Marca */
  primary:       '#1a5276',   /* azul marino oscuro */
  primaryLight:  '#2e86c1',
  primaryDark:   '#154360',

  /* Acciones principales */
  actionGreen:   '#1e8449',   /* botón correcto / confirmar */
  actionGreenHover: '#196f3d',
  actionRed:     '#c0392b',   /* botón incorrecto / cancelar */
  actionRedHover:'#a93226',

  /* Neutros */
  textPrimary:   '#0d1b2a',   /* casi negro, no negro puro */
  textSecondary: '#2c3e50',
  textOnDark:    '#ffffff',
  border:        '#aab7c4',
  borderFocus:   '#f4d03f',   /* amarillo brillante para foco */

  /* Retroalimentación */
  feedbackCorrect: '#1e8449',
  feedbackWrong:   '#c0392b',
  feedbackSelected:'#1a5276',

  /* Temporizador */
  timerFull:     '#1e8449',
  timerLow:      '#e67e22',
  timerCritical: '#c0392b',
}

/* --- TIPOGRAFÍA --- */
export const FONT_SIZE = {
  xs:   '0.85rem',   /* ~17px  — solo para labels pequeños */
  sm:   '1rem',      /* 20px   — mínimo absoluto */
  base: '1.1rem',    /* 22px   — cuerpo de texto normal */
  md:   '1.3rem',    /* 26px   — instrucciones / opciones */
  lg:   '1.6rem',    /* 32px   — títulos secundarios */
  xl:   '2rem',      /* 40px   — títulos de sección */
  xxl:  '2.6rem',    /* 52px   — título principal */
}

export const FONT_WEIGHT = {
  regular: 400,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

/* --- ESPACIADO --- */
export const SPACING = {
  xs:  '0.4rem',
  sm:  '0.75rem',
  md:  '1.25rem',
  lg:  '2rem',
  xl:  '3rem',
  xxl: '4.5rem',
}

/* --- BOTONES (touch targets mínimo 64px) --- */
export const BUTTON = {
  minHeight:     '72px',
  minWidth:      '72px',
  paddingV:      '1rem',
  paddingH:      '1.75rem',
  borderRadius:  '14px',
  fontSize:      FONT_SIZE.md,
  fontWeight:    FONT_WEIGHT.bold,
  borderWidth:   '3px',
  /* Separación mínima entre botones para evitar toques accidentales */
  gap:           '1rem',
}

/* --- TARJETAS --- */
export const CARD = {
  borderRadius:  '20px',
  padding:       '1.75rem',
  shadow:        '0 4px 16px rgba(0,0,0,0.12)',
  shadowHover:   '0 8px 28px rgba(0,0,0,0.18)',
  border:        `3px solid transparent`,
}

/* --- BREAKPOINTS (mobile-first) --- */
export const BP = {
  sm:  '480px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
}

/* --- EMOJIS DE JUEGO (sin imágenes externas, funciona offline) --- */
export const GAME_EMOJIS = {
  /* Frutas y verduras */
  manzana:     { emoji: '🍎', label: 'Manzana' },
  naranja:     { emoji: '🍊', label: 'Naranja' },
  banana:      { emoji: '🍌', label: 'Banana' },
  uva:         { emoji: '🍇', label: 'Uvas' },
  limon:       { emoji: '🍋', label: 'Limón' },
  tomate:      { emoji: '🍅', label: 'Tomate' },
  zanahoria:   { emoji: '🥕', label: 'Zanahoria' },
  lechuga:     { emoji: '🥬', label: 'Lechuga' },
  brocoli:     { emoji: '🥦', label: 'Brócoli' },
  pera:        { emoji: '🍐', label: 'Pera' },
  frutilla:    { emoji: '🍓', label: 'Frutilla' },
  sandia:      { emoji: '🍉', label: 'Sandía' },
  durazno:     { emoji: '🍑', label: 'Durazno' },
  mango:       { emoji: '🥭', label: 'Mango' },
  mandarina:   { emoji: '🍊', label: 'Mandarina' },
  /* Otros productos */
  leche:       { emoji: '🥛', label: 'Leche' },
  pan:         { emoji: '🍞', label: 'Pan' },
  queso:       { emoji: '🧀', label: 'Queso' },
  huevo:       { emoji: '🥚', label: 'Huevo' },
  pollo:       { emoji: '🍗', label: 'Pollo' },
  pescado:     { emoji: '🐟', label: 'Pescado' },
  zapato:      { emoji: '👟', label: 'Zapato' },
  sombrero:    { emoji: '👒', label: 'Sombrero' },
  lapiz:       { emoji: '✏️', label: 'Lápiz' },
}
