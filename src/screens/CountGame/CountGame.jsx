import { useState, useCallback, useMemo, useEffect } from 'react'
import { COUNT_GAME_LEVELS } from '../../constants/gameData.js'
import LevelSelector from '../../components/LevelSelector/LevelSelector.jsx'
import FeedbackOverlay from '../../components/FeedbackOverlay/FeedbackOverlay.jsx'
import GameResult from '../../components/GameResult/GameResult.jsx'
import TimerBar from '../../components/TimerBar/TimerBar.jsx'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'
import styles from './CountGame.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildScatteredItems(round, hasDist) {
  const items = Array.from({ length: round.count }, () => ({
    ...round.item,
    isTarget: true,
  }))

  if (hasDist && round.distractor) {
    const dists = Array.from({ length: round.distractorCount }, () => ({
      ...round.distractor,
      isTarget: false,
    }))
    items.push(...dists)
  }

  return shuffle(items).map((item, i) => ({
    ...item,
    id: i,
    rotation: Math.floor(Math.random() * 41) - 20,
    scale: 0.88 + Math.random() * 0.28,
  }))
}

function generateOptions(correct, max) {
  const pool = []
  const highestOption = Math.max(correct + 3, max + 3, 5)
  for (let i = 1; i <= highestOption; i++) {
    if (i !== correct) pool.push(i)
  }
  const shuffled = shuffle(pool).slice(0, 3)
  return [correct, ...shuffled].sort((a, b) => a - b)
}

export default function CountGame({ onBack }) {
  const [phase, setPhase]       = useState('level')
  const [level, setLevel]       = useState(null)
  const [roundIndex, setRound]  = useState(0)
  const [score, setScore]       = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [selected, setSelected] = useState(null)
  const [scattered, setScattered] = useState([])
  const [numOptions, setNumOptions] = useState([])

  const startGame = useCallback((levelId) => {
    const lvl = COUNT_GAME_LEVELS[levelId]
    setLevel(lvl)
    setRound(0)
    setScore(0)
    setFeedback(null)
    setSelected(null)
    prepareRound(lvl, 0)
    setPhase('play')
  }, [])

  function prepareRound(lvl, idx) {
    const round = lvl.rounds[idx]
    setScattered(buildScatteredItems(round, lvl.distractors))
    setNumOptions(generateOptions(round.count, lvl.maxItems))
    setFeedback(null)
    setSelected(null)
  }

  useEffect(() => {
    if (phase === 'play') document.activeElement?.blur()
  }, [roundIndex, phase])

  const goNext = useCallback(() => {
    const next = roundIndex + 1
    if (next >= level.rounds.length) {
      setPhase('end')
    } else {
      setRound(next)
      prepareRound(level, next)
    }
  }, [level, roundIndex])

  const handleAnswer = useCallback((num) => {
    if (feedback) return
    const round = level.rounds[roundIndex]
    const isCorrect = num === round.count

    setSelected(num)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    setTimeout(goNext, 1500)
  }, [feedback, level, roundIndex, goNext])

  const handleTimeUp = useCallback(() => {
    if (feedback) return
    setFeedback('wrong')
    setTimeout(goNext, 1500)
  }, [feedback, goNext])

  if (phase === 'level') {
    return (
      <LevelSelector
        gameTitle="Las Cuentas Claras"
        gameEmoji="🧮"
        easyDesc="Pocos productos, sin tiempo"
        mediumDesc="Más productos, con tiempo ⏱️"
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
  const progressPct = (roundIndex / total) * 100

  return (
    <main className={styles.game}>
      {feedback && <FeedbackOverlay correct={feedback === 'correct'} />}

      {/* Progress */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <span className={styles.progressLabel}>{roundIndex + 1} / {total}</span>
      </div>

      {/* Timer (medium only) */}
      {level.timerSeconds && (
        <TimerBar
          key={roundIndex}
          totalSeconds={level.timerSeconds}
          onTimeUp={handleTimeUp}
          running={!feedback}
        />
      )}

      {/* Question */}
      <p className={styles.question}>
        ¿Cuántas <span className={styles.targetName}>{round.item.emoji} {round.item.label}</span> hay?
      </p>

      {/* Scattered items board */}
      <div className={styles.board} aria-label="Tablero con productos">
        {scattered.map((item) => (
          <div
            key={item.id}
            className={`${styles.boardItem} ${item.isTarget ? styles.target : styles.distractor}`}
            style={{
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            }}
            aria-label={item.isTarget ? item.label : `Distractor: ${item.label}`}
          >
            <span className={styles.boardEmoji} aria-hidden="true">{item.emoji}</span>
          </div>
        ))}
      </div>

      {/* Number options */}
      <div className={styles.numOptions} role="group" aria-label="Opciones numéricas">
        {numOptions.map((num) => {
          const isSel = selected === num
          const isCorrect = num === round.count

          let variant = 'option'
          if (feedback && isSel && isCorrect)  variant = 'correct'
          if (feedback && isSel && !isCorrect) variant = 'wrong'

          return (
            <AccessibleButton
              key={num}
              variant={variant}
              size="xl"
              selected={isSel && !feedback}
              onClick={() => handleAnswer(num)}
              disabled={!!feedback}
              ariaLabel={`Respuesta: ${num}`}
            >
              {num}
            </AccessibleButton>
          )
        })}
      </div>

      <AccessibleButton variant="ghost" size="md" onClick={onBack}>
        ← Salir
      </AccessibleButton>
    </main>
  )
}
