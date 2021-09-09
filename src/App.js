import React, { useState } from 'react'
import Spinbox from './Spinbox'

const App = () => {
  const [spinboxKey, setSpinboxKey] = useState([0])

  const spinboxes = spinboxKey.map((el) => <Spinbox key={el} />)

  return (
    <div className="container">
      <div className="spinbox-container">{spinboxes}</div>
      <div className="button-container">
        <button
          onClick={() =>
            setSpinboxKey([
              ...spinboxKey,
              spinboxKey[spinboxKey.length - 1] + 1,
            ])
          }
          className="button-common"
        >
          스핀박스 추가
        </button>
      </div>
    </div>
  )
}
export default App
