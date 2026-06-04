import { useEffect, useState, useRef } from 'react'
import styles from './TimerBar.module.css'

/**
 * Barra de progreso de tiempo descendente.
 * Cambia de color: verde → naranja → rojo.
 * Sin números parpadeantes — solo la barra visual.
 */
export default function TimerBar({ totalSeconds, onTimeUp, running }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [running, onTimeUp])

  const pct = (remaining / totalSeconds) * 100

  const colorClass =
    pct > 50 ? styles.full :
    pct > 25 ? styles.low  :
    styles.critical

  return (
    <div className={styles.wrap} role="timer" aria-label={`${remaining} segundos restantes`}>
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.label}>{remaining}s</span>
    </div>
  )
}
