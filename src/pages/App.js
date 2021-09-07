import React, { useState } from 'react'
import SpinboxCard from './SpinboxCard'
import SquareButton from './components/SquareButton'

const App = () => {
  const [spinboxKey, setSpinboxKey] = useState([0])

  const spinboxes = spinboxKey.map((el) => <SpinboxCard key={el} />)

  return (
    <div className="container-background">
      <div className="spinbox-container">
        <div className="spinbox-window">{spinboxes}</div>
        <div className="add-spinbox-area">
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
    </div>
  )
}
export default App
