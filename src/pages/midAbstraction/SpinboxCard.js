import React, { useReducer } from 'react'
import SquareButton from '../../components/SquareButton'
import useLongPressCompare from '../../library/useLongPressNoUseEffect'

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
  const [number, dispatchNumber] = useReducer(reducer, 0)

  const increase = () => {
    dispatchNumber({ type: 'INCREMENT' })
  }
  const decrease = () => {
    dispatchNumber({ type: 'DECREMENT' })
  }

  const longPressIncreaseCompare = useLongPressCompare(increase, 1000)
  const longPressDecreaseCompare = useLongPressCompare(decrease, 1000)

  return (
    <div className="card-container">
      <input
        value={number}
        onChange={dispatchNumber}
        className="input-window"
      />
      <SquareButton
        emphasis="high"
        onClick={increase}
        useLongPress={longPressIncreaseCompare}
        buttonName="+"
      />
      <SquareButton
        emphasis="high"
        onClick={decrease}
        useLongPress={longPressDecreaseCompare}
        buttonName="-"
      />
    </div>
  )
}

export default SpinboxCard
