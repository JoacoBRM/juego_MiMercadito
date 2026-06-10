import { useState, useCallback, useEffect } from 'react'
import { WEIGHT_GAME_LEVELS } from '../../constants/gameData.js'
import LevelSelector from '../../components/LevelSelector/LevelSelector.jsx'
import FeedbackOverlay from '../../components/FeedbackOverlay/FeedbackOverlay.jsx'
import GameResult from '../../components/GameResult/GameResult.jsx'
import TimerBar from '../../components/TimerBar/TimerBar.jsx'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'
import styles from './WeightGame.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WeightGame({ onBack }) {
  const [phase, setPhase]           = useState('level')
  const [level, setLevel]           = useState(null)
  const [roundIndex, setRound]      = useState(0)
  const [score, setScore]           = useState(0)
  const [feedback, setFeedback]     = useState(null)
  const [selected, setSelected]     = useState(null)
  const [shuffledOpts, setShuffled] = useState([])

  const startGame = useCallback((levelId) => {
    const lvl = WEIGHT_GAME_LEVELS[levelId]
    setLevel(lvl)
    setRound(0)
    setScore(0)
    setSelected(null)
    setFeedback(null)
    setShuffled(shuffle(lvl.rounds[0].options))
    setPhase('play')
  }, [])

  useEffect(() => {
    if (phase === 'play') document.activeElement?.blur()
  }, [roundIndex, phase])

  const goNext = useCallback(() => {
    setFeedback(null)
    setSelected(null)
    const next = roundIndex + 1
    if (next >= level.rounds.length) {
      setPhase('end')
    } else {
      setRound(next)
      setShuffled(shuffle(level.rounds[next].options))
    }
  }, [level, roundIndex])

  const handleAnswer = useCallback((option) => {
    if (feedback) return
    const round = level.rounds[roundIndex]
    const isCorrect = option.label === round.correct.label

    setSelected(option.label)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    setTimeout(goNext, 1300)
  }, [feedback, level, roundIndex, goNext])

  const handleTimeUp = useCallback(() => {
    if (feedback) return
    setFeedback('wrong')
    setTimeout(goNext, 1300)
  }, [feedback, goNext])

  if (phase === 'level') {
    return (
      <LevelSelector
        gameTitle="¿Cómo se llama?"
        gameEmoji="🏷️"
        easyDesc="2 opciones, sin tiempo"
        mediumDesc="4 opciones, con tiempo ⏱️"
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
  const progressPct = ((roundIndex) / total) * 100

  return (
    <main className={styles.game}>
      {feedback && <FeedbackOverlay correct={feedback === 'correct'} />}

      <div className={styles.progressWrap} aria-label={`Pregunta ${roundIndex + 1} de ${total}`}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <span className={styles.progressLabel}>{roundIndex + 1} / {total}</span>
      </div>

      {level.timerSeconds && (
        <TimerBar
          key={roundIndex}
          totalSeconds={level.timerSeconds}
          onTimeUp={handleTimeUp}
          running={!feedback}
        />
      )}

      <p className={styles.instruction}>¿Cómo se llama esto?</p>

      <div className={styles.imageWrap} aria-label={`Imagen de ${round.correct.label}`}>
        <span className={styles.mainEmoji} role="img" aria-label={round.correct.label}>
          {round.correct.emoji}
        </span>
      </div>

      <div
        className={`${styles.options} ${styles[`options--${shuffledOpts.length}`]}`}
        role="group"
        aria-label="Opciones de respuesta"
      >
        {shuffledOpts.map((opt) => {
          const isSelected = selected === opt.label
          const isCorrect  = opt.label === round.correct.label

          let variant = 'option'
          if (feedback && isSelected && isCorrect)  variant = 'correct'
          if (feedback && isSelected && !isCorrect) variant = 'wrong'

          return (
            <AccessibleButton
              key={opt.label}
              variant={variant}
              size="lg"
              selected={isSelected && !feedback}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              fullWidth
              ariaLabel={`Respuesta: ${opt.label}`}
            >
              {opt.label}
            </AccessibleButton>
          )
        })}
      </div>

      <AccessibleButton variant="ghost" size="md" onClick={onBack} ariaLabel="Salir al menú principal">
        ← Salir
      </AccessibleButton>
    </main>
  )
}
