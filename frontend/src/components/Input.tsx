import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`px-4 py-3 rounded-lg border focus:outline-none ${className}`} 
      {...props} 
    />
  )
}
