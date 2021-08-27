import React, { useState } from 'react'
import Container from '../components/Container'
import RoundButton from '../components/RoundButton'
import InputWindow from '../components/InputWindow'
import SpinboxCard from './midAbstraction/SpinboxCard'

const App = () => {
  const [newSpinbox, setNewSpinbox] = useState([[1, 2, 3]])
  const [input, setInput] = useState([1, 2, 3])

  /** check the order of spinbox and make new spinbox */
  const checkInputAddSpinbox = () => {
    if (input && input.some((el) => el < '1' || el > '3')) {
      alert('please put number from 1 to 3')
    } else {
      setNewSpinbox([...newSpinbox, input])
    }
  }
  /** when there is no input, set initial value as [1, 2, 3] */
  const getUserInput = (userInput) => {
    if (!userInput) {
      setInput([1, 2, 3])
    } else {
      setInput(userInput.split(''))
    }
  }

  const createSpinboxes = newSpinbox.map((el, idx) => (
    <SpinboxCard key={idx} order={el} />
  ))
  const addSpinboxButtonName = (
    <>
      <div>Add</div>
      <div>Spinbox</div>
    </>
  )
  const bottomAreaItems = (
    <>
      <InputWindow
        placeholder="rearrange spinbox ex) 213"
        size="small"
        onChange={getUserInput}
      />
      <RoundButton
        onClick={checkInputAddSpinbox}
        buttonName={addSpinboxButtonName}
        emphasis="low"
      />
    </>
  )

  return (
    <Container
      upperArea={createSpinboxes}
      bottomArea={bottomAreaItems}
    ></Container>
  )
}
export default App
