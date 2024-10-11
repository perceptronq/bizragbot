import React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`overflow-auto ${className}`} {...props}>
      {children}
    </div>
  )
}
