import React, { useReducer } from 'react'
import InputWindow from '../../components/InputWindow'
import SquareButton from '../../components/SquareButton'
import useLongPress from '../../library/useLongPress'
import useLongPressCompare from '../../library/useLongPressNoUseEffect'

/**
 * each spinbox should work separately
 * so that this component contains its own functions
 */
const SpinboxCard = ({ order }) => {
  /** could define it outside of this scope for reusability */
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

  // leave this for the test purpose
  const longPressIncrease = useLongPress(increase, 1000)
  const longPressDecrease = useLongPress(decrease, 1000)

  const spinboxList = {
    1: <InputWindow key="1" number={number} onChange={dispatchNumber} />,
    2: (
      <SquareButton
        key="2"
        emphasis="high"
        onClick={increase}
        useLongPress={longPressIncreaseCompare}
        buttonName={<ArrowIcon up="up" />}
      />
    ),
    3: (
      <SquareButton
        key="3"
        emphasis="high"
        onClick={decrease}
        useLongPress={longPressDecreaseCompare}
        buttonName={<ArrowIcon />}
      />
    ),
  }
  const spinboxOrder = order.map((el) => spinboxList[el])

  return <div className="card-container">{spinboxOrder}</div>
}

// the arrow icon in the square button
const ArrowIcon = ({ up }) => {
  return <div className={`arrow-i ${up}`}></div>
}

export default SpinboxCard
