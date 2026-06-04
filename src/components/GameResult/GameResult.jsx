import styles from './GameResult.module.css'
import AccessibleButton from '../AccessibleButton/AccessibleButton.jsx'

const EMOJIS_BY_SCORE = [
  { threshold: 1.0, emoji: '🏆', title: '¡Perfecto!' },
  { threshold: 0.7, emoji: '🌟', title: '¡Muy bien!' },
  { threshold: 0.4, emoji: '👍', title: '¡Buen intento!' },
  { threshold: 0.0, emoji: '💪', title: '¡Sigue practicando!' },
]

function getResult(score, total) {
  const ratio = total > 0 ? score / total : 0
  return EMOJIS_BY_SCORE.find(e => ratio >= e.threshold) || EMOJIS_BY_SCORE.at(-1)
}

export default function GameResult({ score, total, onReplay, onChangeLevel, onHome }) {
  const { emoji, title } = getResult(score, total)
  const stars = Array.from({ length: total }, (_, i) => i < score)

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <span className={styles.emoji} aria-hidden="true">{emoji}</span>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.starsRow} aria-hidden="true">
          {stars.map((filled, i) => (
            <span key={i} className={filled ? styles.starFilled : styles.starEmpty}>
              {filled ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <p className={styles.score}>
          Acertaste <strong>{score}</strong> de <strong>{total}</strong>
        </p>
      </div>

      <div className={styles.actions}>
        <AccessibleButton variant="correct" size="lg" onClick={onReplay} fullWidth>
          🔄 Jugar de nuevo
        </AccessibleButton>
        <AccessibleButton variant="secondary" size="lg" onClick={onChangeLevel} fullWidth>
          📊 Cambiar nivel
        </AccessibleButton>
        <AccessibleButton variant="ghost" size="md" onClick={onHome} fullWidth>
          ← Menú principal
        </AccessibleButton>
      </div>
    </main>
  )
}
