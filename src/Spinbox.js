import React, { useReducer } from 'react'
import useLongPress from './library/useLongPress'

const Spinbox = () => {
  const reducer = (number, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return Number(number) + 1
      case 'DECREMENT':
        return Number(number) - 1
      default:
        return action
    }
  }
  const [number, dispatch] = useReducer(reducer, 0)

  const increment = () => {
    dispatch({ type: 'INCREMENT' })
  }
  const decrement = () => {
    dispatch({ type: 'DECREMENT' })
  }
  const longPressIncrement = useLongPress(increment, 1000)
  const longPressDecrement = useLongPress(decrement, 1000)

  return (
    <div className="card-container">
      <input
        value={number}
        onChange={(e) => dispatch(e.target.value)}
        className="input-window"
      />
      <button
        onClick={increment}
        {...longPressIncrement}
        className="button-common"
      >
        +
      </button>
      <button
        onClick={decrement}
        {...longPressDecrement}
        className="button-common"
      >
        -
      </button>
    </div>
  )
}

export default Spinbox
