/* ============================================================
   DATOS DE JUEGO — Mi Mercadito
   Configuración de niveles y GENERADORES ALEATORIOS de rondas.
   Cada partida genera rondas nuevas: nunca se repite lo mismo.
   ============================================================ */

import { GAME_EMOJIS as E } from './theme.js'

/* ---- Utilidades de azar ---- */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)]
}

function pickN(arr, n) {
  return shuffle(arr).slice(0, n)
}

/* Pool de productos sin emojis duplicados (naranja y mandarina
   comparten 🍊 y serían ambiguos como respuesta) */
const ITEM_POOL = (() => {
  const seen = new Set()
  const out = []
  for (const item of Object.values(E)) {
    if (seen.has(item.emoji)) continue
    seen.add(item.emoji)
    out.push(item)
  }
  return out
})()

/* ============================================================
   MODO: "¿Cómo se llama?" (Asociación Imagen-Palabra)
   ============================================================ */
export const WEIGHT_GAME_LEVELS = {
  easy:   { id: 'easy',   label: 'Fácil', optionCount: 2, timerSeconds: null, roundCount: 5 },
  medium: { id: 'medium', label: 'Medio', optionCount: 4, timerSeconds: 15,   roundCount: 5 },
}

export function getWeightLevel(levelId) {
  const cfg = WEIGHT_GAME_LEVELS[levelId]
  const corrects = pickN(ITEM_POOL, cfg.roundCount)
  const rounds = corrects.map((correct) => {
    const others = pickN(
      ITEM_POOL.filter(i => i.emoji !== correct.emoji),
      cfg.optionCount - 1,
    )
    return { correct, options: shuffle([correct, ...others]) }
  })
  return { ...cfg, rounds }
}

/* ============================================================
   MODO: "La Lista del Súper" (Memoria Secuencial)
   ============================================================ */
export const LIST_GAME_LEVELS = {
  easy:   { id: 'easy',   label: 'Fácil', itemCount: 3, displaySeconds: 5, distractorCount: 4, timerSeconds: null, roundCount: 5 },
  medium: { id: 'medium', label: 'Medio', itemCount: 4, displaySeconds: 5, distractorCount: 5, timerSeconds: 20,   roundCount: 4 },
}

export function getListLevel(levelId) {
  const cfg = LIST_GAME_LEVELS[levelId]
  const rounds = Array.from({ length: cfg.roundCount }, () => ({
    items: pickN(ITEM_POOL, cfg.itemCount),
  }))
  return { ...cfg, rounds }
}

/* ============================================================
   MODO: "Las Cuentas Claras" (Conteo)
   ============================================================ */
export const COUNT_GAME_LEVELS = {
  easy:   { id: 'easy',   label: 'Fácil', minCount: 2, maxItems: 5, distractors: false, timerSeconds: null, roundCount: 5 },
  medium: { id: 'medium', label: 'Medio', minCount: 3, maxItems: 6, distractors: true,  timerSeconds: 20,   roundCount: 5 },
}

export function getCountLevel(levelId) {
  const cfg = COUNT_GAME_LEVELS[levelId]
  const targets = pickN(ITEM_POOL, cfg.roundCount)
  const rounds = targets.map((item) => {
    const round = { item, count: randInt(cfg.minCount, cfg.maxItems) }
    if (cfg.distractors) {
      round.distractor = pick(ITEM_POOL.filter(i => i.emoji !== item.emoji))
      round.distractorCount = randInt(1, 3)
    }
    return round
  })
  return { ...cfg, rounds }
}

/* ============================================================
   MODO: "Problemas del Mercado" (Problemas matemáticos)
   Problemas de compras con dinero, generados al azar.
   Todo se calcula en CENTAVOS (enteros) para evitar errores
   de redondeo con decimales.
   ============================================================ */
export const MATH_GAME_LEVELS = {
  easy:   { id: 'easy',   label: 'Fácil', timerSeconds: null, roundCount: 5 },
  medium: { id: 'medium', label: 'Medio', timerSeconds: 45,   roundCount: 5 },
}

/* Productos con nombre en singular/plural y género para que
   las oraciones queden bien escritas */
const MATH_ITEMS = [
  { emoji: '🍎', singular: 'manzana',   plural: 'manzanas',   gender: 'f' },
  { emoji: '🥚', singular: 'huevo',     plural: 'huevos',     gender: 'm' },
  { emoji: '🍊', singular: 'naranja',   plural: 'naranjas',   gender: 'f' },
  { emoji: '🍌', singular: 'banana',    plural: 'bananas',    gender: 'f' },
  { emoji: '🍞', singular: 'pan',       plural: 'panes',      gender: 'm' },
  { emoji: '🍅', singular: 'tomate',    plural: 'tomates',    gender: 'm' },
  { emoji: '🍋', singular: 'limón',     plural: 'limones',    gender: 'm' },
  { emoji: '🥕', singular: 'zanahoria', plural: 'zanahorias', gender: 'f' },
  { emoji: '🥛', singular: 'leche',     plural: 'leches',     gender: 'f' },
  { emoji: '🧀', singular: 'queso',     plural: 'quesos',     gender: 'm' },
]

export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

/* Texto natural para usar dentro de las oraciones */
function moneyText(cents) {
  if (cents < 100) return `${cents} centavos`
  if (cents === 100) return '1 dólar'
  if (cents % 100 === 0) return `${cents / 100} dólares`
  return formatMoney(cents)
}

const each = (item) => (item.gender === 'f' ? 'cada una' : 'cada uno')
const art  = (item) => (item.gender === 'f' ? 'una' : 'un')
const artPl = (item) => (item.gender === 'f' ? 'Las' : 'Los')

/* --- Plantillas de problemas: cada una devuelve
       { emojis, text, answer } (answer en centavos) --- */

/* "n productos a X cada uno → total" */
function tplUnitPrice(items) {
  const it = pick(items)
  const price = pick([25, 50, 75, 100])
  const n = randInt(2, 5)
  return {
    emojis: [it.emoji],
    text: `Vas a la tienda y compras ${n} ${it.plural}. ${each(it).replace('cada', 'Cada')} cuesta ${moneyText(price)}. ¿Cuánto debes pagar?`,
    answer: n * price,
  }
}

/* "compra de A + compra de B → total" */
function tplTwoItems(items) {
  const [a, b] = pickN(items, 2)
  const pa = pick([25, 50, 75, 100, 150])
  const pb = pick([25, 50, 75, 100, 150])
  return {
    emojis: [a.emoji, b.emoji],
    text: `Compras ${art(a)} ${a.singular} por ${moneyText(pa)} y ${art(b)} ${b.singular} por ${moneyText(pb)}. ¿Cuánto pagas en total?`,
    answer: pa + pb,
  }
}

/* "gasto X, pago con billete → vuelto" */
function tplChange() {
  const bill = pick([200, 500, 1000])
  const cost = 25 * randInt(1, bill / 25 - 1)
  return {
    emojis: ['🛍️', '💵'],
    text: `En la tienda gastas ${moneyText(cost)}. Pagas con un billete de ${bill / 100} dólares. ¿Cuánto te dan de vuelto?`,
    answer: bill - cost,
  }
}

/* Estilo del ejemplo: "$X de huevos + n manzanas a Y → total" */
function tplMixed(items) {
  const [a, b] = pickN(items, 2)
  const amountA = pick([100, 150, 200])
  const price = pick([25, 50])
  const n = randInt(4, 10)
  return {
    emojis: [a.emoji, b.emoji],
    text: `Compras ${moneyText(amountA)} de ${a.plural}. ${artPl(b)} ${b.plural} cuestan ${moneyText(price)} ${each(b)} y llevas ${n}. ¿Cuánto debes pagar en total?`,
    answer: amountA + price * n,
  }
}

/* "n productos a X cada uno, pago con billete → vuelto" */
function tplChangeWithItems(items) {
  const it = pick(items)
  const price = pick([25, 50, 75])
  const n = randInt(2, 6)
  const total = n * price
  const bill = total <= 500 ? pick([500, 1000]) : 1000
  return {
    emojis: [it.emoji, '💵'],
    text: `Compras ${n} ${it.plural} a ${moneyText(price)} ${each(it)} y pagas con un billete de ${bill / 100} dólares. ¿Cuánto te dan de vuelto?`,
    answer: bill - total,
  }
}

/* "tres productos → total" */
function tplThreeItems(items) {
  const [a, b, c] = pickN(items, 3)
  const pa = pick([25, 50, 75, 100])
  const pb = pick([25, 50, 75, 100])
  const pc = pick([25, 50, 75, 100, 150])
  return {
    emojis: [a.emoji, b.emoji, c.emoji],
    text: `Compras ${art(a)} ${a.singular} por ${moneyText(pa)}, ${art(b)} ${b.singular} por ${moneyText(pb)} y ${art(c)} ${c.singular} por ${moneyText(pc)}. ¿Cuánto pagas en total?`,
    answer: pa + pb + pc,
  }
}

const MATH_TEMPLATES = {
  easy:   [tplUnitPrice, tplTwoItems, tplChange],
  medium: [tplMixed, tplChangeWithItems, tplThreeItems, tplChange],
}

/* 4 opciones: la correcta + 3 cercanas y creíbles, ordenadas */
function buildMoneyOptions(answer) {
  const deltas = shuffle([25, 50, 75, 100, 150, 200])
  const options = new Set([answer])
  for (const d of deltas) {
    if (options.size >= 4) break
    const wrong = pick([answer + d, answer - d])
    if (wrong > 0 && !options.has(wrong)) options.add(wrong)
    else if (!options.has(answer + d)) options.add(answer + d)
  }
  return [...options].sort((x, y) => x - y)
}

export function getMathLevel(levelId) {
  const cfg = MATH_GAME_LEVELS[levelId]
  const templates = MATH_TEMPLATES[levelId]

  /* Mezclar plantillas para que cada partida varíe el orden
     y los tipos de problema */
  const order = []
  while (order.length < cfg.roundCount) {
    order.push(...shuffle(templates))
  }

  const rounds = order.slice(0, cfg.roundCount).map((tpl) => {
    const problem = tpl(MATH_ITEMS)
    return { ...problem, options: buildMoneyOptions(problem.answer) }
  })

  return { ...cfg, rounds }
}
