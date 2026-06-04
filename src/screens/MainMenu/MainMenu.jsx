import styles from './MainMenu.module.css'
import GameCard from '../../components/GameCard/GameCard.jsx'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'

const MODES = [
  {
    id: 'list',
    emoji: '🛒',
    title: 'La Lista del Súper',
    description: 'Mira los productos, memorízalos y encuéntralos después.',
    color: '#3b82f6',
  },
  {
    id: 'weight',
    emoji: '🏷️',
    title: '¿Cómo se llama?',
    description: 'Mira el producto y escoge su nombre correcto.',
    color: '#10b981',
  },
  {
    id: 'count',
    emoji: '🧮',
    title: 'Las Cuentas Claras',
    description: 'Cuenta cuántos productos iguales hay en la pantalla.',
    color: '#8b5cf6',
  },
]

export default function MainMenu({ onSelectMode, onCredits }) {
  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="welcome-heading">
        <div className={styles.heroEmojis} aria-hidden="true">
          🍎🥕🧀🍞🥛
        </div>
        <h2 id="welcome-heading" className={styles.heroTitle}>
          ¡Bienvenido/a!
        </h2>
        <p className={styles.heroText}>
          Elige un juego para empezar
        </p>
      </section>

      <nav aria-label="Modos de juego">
        <ul className={styles.grid} role="list">
          {MODES.map((mode, i) => (
            <li
              key={mode.id}
              className={styles.gridItem}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GameCard
                emoji={mode.emoji}
                title={mode.title}
                description={mode.description}
                color={mode.color}
                onClick={() => onSelectMode(mode.id)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.creditsRow}>
        <AccessibleButton variant="ghost" size="md" onClick={onCredits} ariaLabel="Ver créditos">
          👥 Créditos
        </AccessibleButton>
      </div>
    </main>
  )
}
