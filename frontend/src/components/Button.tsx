import React from 'react'
import { cn } from '@/lib/utils' 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'icon'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 transition"
  
  const variantClasses = {
    default: "bg-gray-800 text-gray-300 hover:text-white hover:bg-sky-500",
    outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-700",
    ghost: "bg-transparent text-zinc-300 hover:bg-zinc-700"
  }
  
  const sizeClasses = {
    default: "px-4 py-2",
    icon: "p-2"
  }

  return (
    <button 
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} 
      {...props}
    >
      {children}
    </button>
  )
}
