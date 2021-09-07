import React, { useState } from 'react'
import SpinboxCard from './midAbstraction/SpinboxCard'
import SquareButton from '../components/SquareButton'

const App = () => {
  const [newSpinbox, setNewSpinbox] = useState([1])

  const createSpinboxes = newSpinbox.map((el, idx) => <SpinboxCard key={idx} />)

  return (
    <div className="container-background">
      <div className="spinbox-container">
        <div className="spinbox-window">{createSpinboxes}</div>
        <div className="add-spinbox-area">
          <SquareButton
            onClick={() => setNewSpinbox([...newSpinbox, 1])}
            buttonName="more spinbox"
            emphasis="low"
          />
        </div>
      </div>
    </div>
  )
}
export default App
