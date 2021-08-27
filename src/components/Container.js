import React from 'react'

const Container = ({ upperArea, bottomArea }) => {
  return (
    <div className="container-background">
      <div className="spinbox-container">
        <div className="spinbox-window">{upperArea}</div>
        <div className="add-spinbox-area">{bottomArea}</div>
      </div>
    </div>
  )
}

export default Container
