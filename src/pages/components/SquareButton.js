import React from 'react'

const SquareButton = ({ useLongPress, onClick, buttonName, emphasis }) => {
  return (
    <div
      {...useLongPress}
      onClick={onClick}
      className={`button-common ${emphasis}`}
    >
      {buttonName}
    </div>
  )
}

export default SquareButton
