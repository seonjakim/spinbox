import { useState, useEffect, useMemo, useRef } from 'react'

/**
 * with useEffect
 */
const useLongPress = (onLongPress = () => {}, ms = 1000) => {
  const [isLongPress, setIsLongPress] = useState(false)
  const timer = useRef(false)
  let delay = ms

  const doInterval = () => {
    timer.current = setTimeout(() => {
      onLongPress(), doInterval()
    }, delay)
    /** shorten the delay time */
    delay > 100 ? (delay -= 90) : ''
  }

  useEffect(() => {
    if (isLongPress) {
      doInterval()
    } else {
      clearTimeout(timer.current)
    }
    return () => {
      clearTimeout(timer.current)
    }
  }, [isLongPress])

  const onPress = () => {
    setIsLongPress(true)
  }
  const offPress = () => {
    setIsLongPress(false)
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
