import React, { useState } from 'react'
import SpinboxCard from './SpinboxCard'
import SquareButton from './components/SquareButton'

const App = () => {
  const [spinboxKey, setSpinboxKey] = useState([0])

  const spinboxes = spinboxKey.map((el) => <SpinboxCard key={el} />)

  return (
    <div className="container">
      <div className="spinbox-container">{spinboxes}</div>
      <div className="button-container">
        <SquareButton
          onClick={() =>
            setSpinboxKey([
              ...spinboxKey,
              spinboxKey[spinboxKey.length - 1] + 1,
            ])
          }
          buttonName="more spinbox"
          emphasis="low"
        />
      </div>
    </div>
  )
}
export default App
