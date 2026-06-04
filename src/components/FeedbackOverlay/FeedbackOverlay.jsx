import styles from './FeedbackOverlay.module.css'

export default function FeedbackOverlay({ correct, message }) {
  return (
    <div
      className={`${styles.overlay} ${correct ? styles.correct : styles.wrong}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.card}>
        <span className={styles.symbol} aria-hidden="true">
          {correct ? '✓' : '✗'}
        </span>
        <span className={styles.text}>
          {message || (correct ? '¡Correcto!' : 'Incorrecto')}
        </span>
      </div>
    </div>
  )
}
