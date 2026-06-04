import styles from './GameCard.module.css'

/**
 * Tarjeta grande para seleccionar un modo de juego en el menú principal.
 */
export default function GameCard({ emoji, title, description, color, onClick }) {
  return (
    <button
      className={styles.card}
      style={{ '--card-accent': color }}
      onClick={onClick}
      aria-label={`Jugar ${title}`}
    >
      <span className={styles.emoji} aria-hidden="true">{emoji}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
      <span className={styles.cta}>¡Jugar!</span>
    </button>
  )
}
