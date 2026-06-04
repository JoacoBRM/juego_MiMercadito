import styles from './WelcomeScreen.module.css'
import heroImage from '../../assets/imagen_mimercadito.webp'

export default function WelcomeScreen({ onStart }) {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <img src={heroImage} alt="Mi Mercadito" className={styles.heroImage} />
        
        <div className={styles.action}>
          <button
            className={styles.startButton}
            onClick={onStart}
            aria-label="Empezar a jugar"
          >
            Empezar a jugar <span className={styles.buttonIcon}>✨</span>
          </button>
        </div>
      </div>
    </main>
  )
}
