import React, { useReducer } from 'react'
import SquareButton from './components/SquareButton'
import useLongPress from '../library/useLongPressRecursive'

/**
 * each spinbox should work separately
 * so that this component contains its own functions
 */
const SpinboxCard = () => {
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

  const increase = () => {
    dispatch({ type: 'INCREMENT' })
  }
  const decrease = () => {
    dispatch({ type: 'DECREMENT' })
  }

  const longPressIncrease = useLongPress(increase, 1000)
  const longPressDecrease = useLongPress(decrease, 1000)

  return (
    <div className="card-container">
      <input value={number} onChange={dispatch} className="input-window" />
      <SquareButton
        emphasis="high"
        onClick={increase}
        useLongPress={longPressIncrease}
        buttonName="+"
      />
      <SquareButton
        emphasis="high"
        onClick={decrease}
        useLongPress={longPressDecrease}
        buttonName="-"
      />
    </div>
  )
}

export default SpinboxCard
