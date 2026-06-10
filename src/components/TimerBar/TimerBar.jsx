import { useEffect, useState, useRef } from 'react'
import styles from './TimerBar.module.css'

/**
 * Barra de progreso de tiempo descendente.
 * Cambia de color: verde → naranja → rojo.
 * Sin números parpadeantes — barra visual + segundos en grande.
 */
export default function TimerBar({ totalSeconds, onTimeUp, running }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [running])

  /* Avisar fuera del updater de estado: llamar onTimeUp dentro de
     setRemaining provoca un setState del padre durante el render */
  useEffect(() => {
    if (remaining === 0 && running) {
      clearInterval(intervalRef.current)
      onTimeUpRef.current?.()
    }
  }, [remaining, running])

  const pct = (remaining / totalSeconds) * 100

  const colorClass =
    pct > 50 ? styles.full :
    pct > 25 ? styles.low  :
    styles.critical

  return (
    <div className={styles.wrap} role="timer" aria-label={`${remaining} segundos restantes`}>
      <span className={styles.icon} aria-hidden="true">⏱️</span>
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`${styles.label} ${colorClass === styles.critical ? styles.labelCritical : ''}`}>
        {remaining}s
      </span>
    </div>
  )
}
