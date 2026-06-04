import styles from './Header.module.css'
import AccessibleButton from '../AccessibleButton/AccessibleButton.jsx'

export default function Header({ onHome, showHomeButton = false, subtitle }) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {showHomeButton && (
          <AccessibleButton
            variant="secondary"
            size="md"
            onClick={onHome}
            ariaLabel="Volver al menú principal"
            className={styles.homeBtn}
          >
            ← Inicio
          </AccessibleButton>
        )}

        <div className={styles.titleWrap}>
          <h1 className={styles.title}>
            🛒 Mi Mercadito
          </h1>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>

        {/* Espacio espejo para centrar el título cuando hay botón */}
        {showHomeButton && <div className={styles.spacer} aria-hidden="true" />}
      </div>
    </header>
  )
}
