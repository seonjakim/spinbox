import React from 'react'

const RoundButton = ({ buttonName, onClick, emphasis }) => {
  return (
    <div onClick={onClick} className={`button-common round-button ${emphasis}`}>
      {buttonName}
    </div>
  )
}

export default RoundButton
