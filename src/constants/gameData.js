/* ============================================================
   DATOS DE JUEGO — Mi Mercadito
   Configuración de niveles, ítems y rondas para cada modo.
   ============================================================ */

import { GAME_EMOJIS as E } from './theme.js'

/* ---- MODO 2: "¿Cómo se llama?" (Asociación Imagen-Palabra) ---- */
export const WEIGHT_GAME_LEVELS = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    optionCount: 2,
    rounds: [
      {
        correct: E.manzana,
        options: [E.manzana, E.naranja],
      },
      {
        correct: E.banana,
        options: [E.banana, E.mango],
      },
      {
        correct: E.leche,
        options: [E.leche, E.queso],
      },
      {
        correct: E.zanahoria,
        options: [E.zanahoria, E.brocoli],
      },
      {
        correct: E.pan,
        options: [E.pan, E.huevo],
      },
    ],
  },
  medium: {
    id: 'medium',
    label: 'Medio',
    optionCount: 4,
    rounds: [
      {
        correct: E.manzana,
        options: [E.manzana, E.mandarina, E.mango, E.pera],
      },
      {
        correct: E.naranja,
        options: [E.mandarina, E.naranja, E.limon, E.uva],
      },
      {
        correct: E.uva,
        options: [E.frutilla, E.sandia, E.uva, E.durazno],
      },
      {
        correct: E.zanahoria,
        options: [E.zanahoria, E.brocoli, E.lechuga, E.tomate],
      },
      {
        correct: E.queso,
        options: [E.leche, E.huevo, E.queso, E.pan],
      },
    ],
  },
}

/* ---- MODO 1: "La Lista del Súper" (Memoria Secuencial) ---- */
export const LIST_GAME_LEVELS = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    itemCount: 3,
    displaySeconds: 5,
    distractorCount: 4,
    timerSeconds: null,
    rounds: [
      { items: [E.manzana, E.leche, E.pan] },
      { items: [E.huevo, E.banana, E.queso] },
      { items: [E.naranja, E.tomate, E.pollo] },
      { items: [E.zanahoria, E.uva, E.pescado] },
      { items: [E.frutilla, E.limon, E.brocoli] },
    ],
  },
  medium: {
    id: 'medium',
    label: 'Medio',
    itemCount: 4,
    displaySeconds: 5,
    distractorCount: 5,
    timerSeconds: 20,
    rounds: [
      { items: [E.manzana, E.leche, E.pan, E.huevo] },
      { items: [E.banana, E.queso, E.naranja, E.tomate] },
      { items: [E.zanahoria, E.pollo, E.pescado, E.uva] },
      { items: [E.frutilla, E.limon, E.brocoli, E.lechuga] },
    ],
  },
}

/* ---- MODO 3: "Las Cuentas Claras" (Conteo) ---- */
export const COUNT_GAME_LEVELS = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    maxItems: 5,
    distractors: false,
    rounds: [
      { item: E.manzana, count: 3 },
      { item: E.banana,  count: 5 },
      { item: E.huevo,   count: 4 },
      { item: E.naranja, count: 3 },
      { item: E.pan,     count: 5 },
    ],
  },
  medium: {
    id: 'medium',
    label: 'Medio',
    maxItems: 6,
    distractors: true,
    rounds: [
      { item: E.manzana,   count: 4, distractor: E.naranja,  distractorCount: 2 },
      { item: E.zanahoria, count: 5, distractor: E.brocoli,  distractorCount: 1 },
      { item: E.huevo,     count: 3, distractor: E.tomate,   distractorCount: 3 },
      { item: E.banana,    count: 6, distractor: E.limon,    distractorCount: 2 },
      { item: E.frutilla,  count: 4, distractor: E.uva,      distractorCount: 2 },
    ],
  },
}
