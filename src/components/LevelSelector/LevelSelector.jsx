import styles from './LevelSelector.module.css'
import AccessibleButton from '../AccessibleButton/AccessibleButton.jsx'

export default function LevelSelector({
  gameTitle,
  gameEmoji,
  onSelect,
  onBack,
  easyDesc = 'Sin tiempo, menos opciones',
  mediumDesc = 'Más opciones, con tiempo',
}) {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <span className={styles.emoji} aria-hidden="true">{gameEmoji}</span>
        <h2 className={styles.title}>{gameTitle}</h2>
        <p className={styles.prompt}>Elige el nivel:</p>
      </div>

      <div className={styles.levels}>
        <button
          className={`${styles.levelBtn} ${styles.easy}`}
          onClick={() => onSelect('easy')}
          aria-label="Nivel Fácil"
        >
          <span className={styles.levelIcon} aria-hidden="true">😊</span>
          <span className={styles.levelText}>
            <span className={styles.levelLabel}>Fácil</span>
            <span className={styles.levelDesc}>{easyDesc}</span>
          </span>
        </button>

        <button
          className={`${styles.levelBtn} ${styles.medium}`}
          onClick={() => onSelect('medium')}
          aria-label="Nivel Medio"
        >
          <span className={styles.levelIcon} aria-hidden="true">🤔</span>
          <span className={styles.levelText}>
            <span className={styles.levelLabel}>Medio</span>
            <span className={styles.levelDesc}>{mediumDesc}</span>
          </span>
        </button>
      </div>

      <AccessibleButton
        variant="ghost"
        size="md"
        onClick={onBack}
        ariaLabel="Volver al menú principal"
      >
        ← Volver al menú
      </AccessibleButton>
    </main>
  )
}
