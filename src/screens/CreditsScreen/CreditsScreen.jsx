import styles from './CreditsScreen.module.css'
import AccessibleButton from '../../components/AccessibleButton/AccessibleButton.jsx'

const DEVELOPERS = [
  { name: 'Joaquín Bermeo',      initials: 'JB' },
  { name: 'Carlos Ortega',       initials: 'CO' },
  { name: 'Emilio Jiménez',      initials: 'EJ' },
  { name: 'Juan Esteban Vivero', initials: 'JV' },
]

export default function CreditsScreen({ onBack }) {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <span className={styles.emoji} aria-hidden="true">🛒</span>
        <h2 className={styles.title}>Mi Mercadito</h2>
        <p className={styles.subtitle}>Desarrollado por</p>
      </div>

      <ul className={styles.list} role="list">
        {DEVELOPERS.map((dev) => (
          <li key={dev.name} className={styles.card}>
            <span className={styles.avatar} aria-hidden="true">{dev.initials}</span>
            <span className={styles.name}>{dev.name}</span>
          </li>
        ))}
      </ul>

      <p className={styles.year}>{new Date().getFullYear()} — Proyecto académico</p>

      <AccessibleButton variant="ghost" size="md" onClick={onBack} ariaLabel="Volver al menú principal">
        ← Volver al menú
      </AccessibleButton>
    </main>
  )
}
