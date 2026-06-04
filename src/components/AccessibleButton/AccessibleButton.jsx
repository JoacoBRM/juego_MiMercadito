import { COLORS, BUTTON, FONT_SIZE, FONT_WEIGHT } from '../../constants/theme.js'
import styles from './AccessibleButton.module.css'

/**
 * Botón base accesible para Mi Mercadito.
 *
 * Props:
 *  variant   — 'primary' | 'secondary' | 'correct' | 'wrong' | 'option' | 'ghost'
 *  size      — 'md' | 'lg' | 'xl'
 *  selected  — boolean (resalta el botón como seleccionado)
 *  disabled  — boolean
 *  fullWidth — boolean
 *  onClick   — function
 *  children  — ReactNode
 *  ariaLabel — string (descripción para lectores de pantalla)
 */
export default function AccessibleButton({
  variant = 'primary',
  size = 'md',
  selected = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  ariaLabel,
  className,
  ...rest
}) {
  const classNames = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    selected  ? styles['btn--selected']  : '',
    disabled  ? styles['btn--disabled']  : '',
    fullWidth ? styles['btn--fullWidth'] : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classNames}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  )
}
