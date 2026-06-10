import { useState, useCallback, useEffect } from 'react'
import { getMathLevel, formatMoney } from '../../constants/gameData.js'
import LevelSelector from '../../components/LevelSelector/LevelSelector.jsx'
import FeedbackOverlay from '../../components/FeedbackOverlay/FeedbackOverlay.jsx'
import GameResult from '../../components/GameResult/GameResult.jsx'
import TimerBar from '../../components/TimerBar/TimerBar.jsx'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'
import styles from './MathGame.module.css'

export default function MathGame({ onBack }) {
  const [phase, setPhase]       = useState('level')
  const [level, setLevel]       = useState(null)
  const [roundIndex, setRound]  = useState(0)
  const [score, setScore]       = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [selected, setSelected] = useState(null)

  const startGame = useCallback((levelId) => {
    const lvl = getMathLevel(levelId)
    setLevel(lvl)
    setRound(0)
    setScore(0)
    setFeedback(null)
    setSelected(null)
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
    }
  }, [level, roundIndex])

  const handleAnswer = useCallback((cents) => {
    if (feedback) return
    const round = level.rounds[roundIndex]
    const isCorrect = cents === round.answer

    setSelected(cents)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    /* Un poco más de tiempo que en otros modos para ver
       cuál era la respuesta correcta */
    setTimeout(goNext, isCorrect ? 1500 : 2500)
  }, [feedback, level, roundIndex, goNext])

  const handleTimeUp = useCallback(() => {
    if (feedback) return
    setFeedback('wrong')
    setTimeout(goNext, 2500)
  }, [feedback, goNext])

  if (phase === 'level') {
    return (
      <LevelSelector
        gameTitle="Problemas del Mercado"
        gameEmoji="💰"
        easyDesc="Cuentas sencillas, sin tiempo"
        mediumDesc="Cuentas con vuelto, con tiempo ⏱️"
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

      {/* Problema */}
      <div className={styles.problemCard}>
        <div className={styles.problemEmojis} aria-hidden="true">
          {round.emojis.join(' ')}
        </div>
        <p className={styles.problemText}>{round.text}</p>
      </div>

      {/* Opciones de dinero */}
      <div className={styles.options} role="group" aria-label="Opciones de respuesta">
        {round.options.map((cents) => {
          const isSel = selected === cents
          const isCorrect = cents === round.answer

          let variant = 'option'
          if (feedback && isSel && isCorrect)  variant = 'correct'
          if (feedback && isSel && !isCorrect) variant = 'wrong'
          /* Al fallar (o agotarse el tiempo) se muestra cuál era la correcta */
          if (feedback === 'wrong' && isCorrect) variant = 'correct'

          return (
            <AccessibleButton
              key={cents}
              variant={variant}
              size="xl"
              selected={isSel && !feedback}
              onClick={() => handleAnswer(cents)}
              disabled={!!feedback}
              ariaLabel={`Respuesta: ${formatMoney(cents)}`}
            >
              {formatMoney(cents)}
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
