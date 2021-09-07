import { useState, useEffect, useMemo, useRef } from 'react'

/**
 * with useEffect
 */
const useLongPress = (callback = () => {}, ms = 1000) => {
  const [longPress, setLongPress] = useState(false)
  const timerId = useRef(false)
  let delay = ms

  const doInterval = () => {
    timerId.current = setTimeout(() => {
      callback(), doInterval()
    }, delay)
    /** shorten the delay time */
    delay > 100 ? (delay -= 90) : ''
  }

  useEffect(() => {
    if (longPress) {
      doInterval()
    } else {
      clearTimeout(timerId.current)
    }
    return () => {
      clearTimeout(timerId.current)
    }
  }, [longPress])

  const pressBegin = () => {
    setLongPress(true)
  }
  const pressEnd = () => {
    setLongPress(false)
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
