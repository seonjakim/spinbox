import { useRef, useMemo } from 'react'

/**
 * without useEffect
 */
const useLongPress = (longPress = () => {}, ms = 1000) => {
  const timerId = useRef(false)
  let delay = ms

  const pressBegin = () => {
    timerId.current = setTimeout(() => {
      longPress()
      pressBegin()
    }, delay)
    /** shorten the delay time */
    delay > 100 ? (delay -= 90) : ''
  }

  const pressEnd = () => {
    if (timerId.current) {
      clearTimeout(timerId.current)
      timerId.current = false
    }
  }

  return useMemo(
    () => ({
      onMouseDown: pressBegin,
      onMouseUp: pressEnd,
      onMouseLeave: pressEnd,
      onTouchStart: pressBegin,
      onTouchEnd: pressEnd,
    }),
    [pressBegin, pressEnd]
  )
}

export default useLongPress
