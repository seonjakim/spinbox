import React from 'react'

const InputWindow = ({ placeholder, onChange, number, size }) => {
  return (
    <div className={`number-window ${size}`}>
      <input
        value={number}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`input-window`}
      />
    </div>
  )
}

export default InputWindow
