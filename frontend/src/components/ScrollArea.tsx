import React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#38bdf8 #0f172a', /* Firefox */
      }}
      {...props}
    >
      {children}

      {/* Custom Scrollbar using Tailwind and inline styles */}
      <style jsx>{`
        .${className}::-webkit-scrollbar {
          width: 12px;
        }
        .${className}::-webkit-scrollbar-track {
          background: #0f172a; /* gray-900 */
          border-radius: 6px;
        }
        .${className}::-webkit-scrollbar-thumb {
          background: #38bdf8; /* sky-500 */
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.8), 0 0 10px rgba(56, 189, 248, 0.5); /* Glowing effect */
        }
        .${className}::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9; /* sky-400 on hover */
        }
      `}</style>
    </div>
  )
}
