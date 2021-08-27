import { useRef, useMemo } from 'react'

/**
 * without useEffect
 */
const useLongPress = (onLongPress = () => {}, ms = 1000) => {
  const timerRef = useRef(false)
  let delay = ms

  const onPress = () => {
    timerRef.current = setTimeout(() => {
      onLongPress()
      onPress()
    }, delay)
    /** shorten the delay time */
    delay > 100 ? (delay -= 90) : ''
  }

  const offPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = false
    }
  }

  return useMemo(
    () => ({
      onMouseDown: onPress,
      onMouseUp: offPress,
      onMouseLeave: offPress,
      onTouchStart: onPress,
      onTouchEnd: offPress,
    }),
    [onPress, offPress]
  )
}

export default useLongPress
