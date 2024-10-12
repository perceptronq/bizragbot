import React, { useEffect, useRef } from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ className = '', children, ...props }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${className}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4b5563 #0f172a',
      }}
      {...props}
    >
      {children}
      <style jsx>{`
        .${className}::-webkit-scrollbar {
          width: 8px;
          position: absolute;
          right: 0;
        }
        .${className}::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .${className}::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .${className}::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};
