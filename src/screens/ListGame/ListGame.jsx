import { useState, useCallback, useEffect, useRef } from 'react'
import { LIST_GAME_LEVELS } from '../../constants/gameData.js'
import { GAME_EMOJIS } from '../../constants/theme.js'
import LevelSelector from '../../components/LevelSelector/LevelSelector.jsx'
import FeedbackOverlay from '../../components/FeedbackOverlay/FeedbackOverlay.jsx'
import GameResult from '../../components/GameResult/GameResult.jsx'
import TimerBar from '../../components/TimerBar/TimerBar.jsx'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'
import styles from './ListGame.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(exclude, count) {
  const all = Object.values(GAME_EMOJIS)
  const available = all.filter(e => !exclude.some(x => x.label === e.label))
  return shuffle(available).slice(0, count)
}

export default function ListGame({ onBack }) {
  const [phase, setPhase]           = useState('level')
  const [level, setLevel]           = useState(null)
  const [roundIndex, setRound]      = useState(0)
  const [score, setScore]           = useState(0)

  // memorize → pick → feedback → (next round or end)
  const [subPhase, setSubPhase]     = useState('memorize')
  const [selectedLabels, setSelected] = useState(new Set())
  const [gridItems, setGrid]        = useState([])
  const [feedback, setFeedback]     = useState(null)
  const [timerRunning, setTimer]    = useState(false)
  const [countdown, setCountdown]   = useState(null)
  const timerRef = useRef(null)

  const startGame = useCallback((levelId) => {
    const lvl = LIST_GAME_LEVELS[levelId]
    setLevel(lvl)
    setRound(0)
    setScore(0)
    setFeedback(null)
    prepareRound(lvl, 0)
    setPhase('play')
  }, [])

  function prepareRound(lvl, idx) {
    setSelected(new Set())
    setFeedback(null)
    setTimer(false)

    const round = lvl.rounds[idx]
    setCountdown(lvl.displaySeconds)
    setSubPhase('memorize')

    // Build grid after memorize phase
    const distractors = pickDistractors(round.items, lvl.distractorCount)
    const all = shuffle([...round.items, ...distractors])
    setGrid(all)
  }

  // Countdown for memorize phase
  useEffect(() => {
    if (subPhase !== 'memorize' || !level) return
    clearInterval(timerRef.current)

    let remaining = level.displaySeconds
    setCountdown(remaining)

    timerRef.current = setInterval(() => {
      remaining--
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        setSubPhase('pick')
        if (level.timerSeconds) setTimer(true)
      }
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [subPhase, level, roundIndex])

  useEffect(() => {
    if (subPhase === 'pick') document.activeElement?.blur()
  }, [subPhase])

  const toggleItem = useCallback((label) => {
    if (subPhase !== 'pick' || feedback) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [subPhase, feedback])

  const handleConfirm = useCallback(() => {
    if (!level) return
    setTimer(false)
    const round = level.rounds[roundIndex]
    const correctSet = new Set(round.items.map(i => i.label))
    const isCorrect =
      selectedLabels.size === correctSet.size &&
      [...selectedLabels].every(l => correctSet.has(l))

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      const next = roundIndex + 1
      if (next >= level.rounds.length) {
        setPhase('end')
      } else {
        setRound(next)
        prepareRound(level, next)
      }
    }, 1500)
  }, [level, roundIndex, selectedLabels])

  const handleTimeUp = useCallback(() => {
    if (feedback) return
    handleConfirm()
  }, [feedback, handleConfirm])

  /* ---- Renders ---- */

  if (phase === 'level') {
    return (
      <LevelSelector
        gameTitle="La Lista del Súper"
        gameEmoji="🛒"
        onSelect={startGame}
        onBack={onBack}
      />
    )
  }

  if (phase === 'end') {
    return (
      <GameResult
        score={score}
        total={level.rounds.length}
        onReplay={() => startGame(level.id)}
        onChangeLevel={() => setPhase('level')}
        onHome={onBack}
      />
    )
  }

  const round = level.rounds[roundIndex]
  const total = level.rounds.length
  const correctSet = new Set(round.items.map(i => i.label))
  const expectedCount = round.items.length

  return (
    <main className={styles.game}>
      {feedback && <FeedbackOverlay correct={feedback === 'correct'} />}

      {/* Progress */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${(roundIndex / total) * 100}%` }} />
        </div>
        <span className={styles.progressLabel}>{roundIndex + 1} / {total}</span>
      </div>

      {/* Timer (medium only) */}
      {level.timerSeconds && subPhase === 'pick' && (
        <TimerBar
          totalSeconds={level.timerSeconds}
          onTimeUp={handleTimeUp}
          running={timerRunning}
        />
      )}

      {/* MEMORIZE PHASE */}
      {subPhase === 'memorize' && (
        <div className={styles.memorizeWrap}>
          <p className={styles.instruction}>
            ¡Memoriza estos productos!
          </p>
          <div className={styles.countdown} aria-live="polite">
            {countdown}
          </div>
          <div className={styles.shelf}>
            <div className={styles.shelfLabel} aria-hidden="true">Estantería</div>
            <div className={styles.shelfItems}>
              {round.items.map((item, i) => (
                <div key={i} className={styles.shelfItem}>
                  <span className={styles.shelfEmoji} aria-label={item.label}>{item.emoji}</span>
                  <span className={styles.shelfName}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PICK PHASE */}
      {subPhase === 'pick' && (
        <div className={styles.pickWrap}>
          <p className={styles.instruction}>
            ¡Toca los {expectedCount} productos que viste!
          </p>

          <div
            className={styles.cartGrid}
            role="group"
            aria-label="Productos en el carrito"
          >
            {gridItems.map((item, i) => {
              const isSelected = selectedLabels.has(item.label)
              return (
                <button
                  key={`${item.label}-${i}`}
                  className={`${styles.cartItem} ${isSelected ? styles.cartItemSelected : ''}`}
                  onClick={() => toggleItem(item.label)}
                  disabled={!!feedback}
                  aria-pressed={isSelected}
                  aria-label={item.label}
                >
                  <span className={styles.cartEmoji} aria-hidden="true">{item.emoji}</span>
                  <span className={styles.cartLabel}>{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className={styles.confirmArea}>
            <span className={styles.selCount}>
              Seleccionados: {selectedLabels.size} / {expectedCount}
            </span>
            <AccessibleButton
              variant="correct"
              size="lg"
              fullWidth
              onClick={handleConfirm}
              disabled={!!feedback || selectedLabels.size === 0}
            >
              ✓ Confirmar selección
            </AccessibleButton>
          </div>
        </div>
      )}

      <AccessibleButton variant="ghost" size="md" onClick={onBack}>
        ← Salir
      </AccessibleButton>
    </main>
  )
}
