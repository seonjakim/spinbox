import React from 'react'

const SquareButton = ({ useLongPress, onClick, buttonName, emphasis }) => {
  return (
    <button
      {...useLongPress}
      onClick={onClick}
      className={`button-common ${emphasis}`}
    >
      {buttonName}
    </button>
  )
}

export default SquareButton
