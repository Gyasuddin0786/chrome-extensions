import React, { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const positions: Record<string, React.CSSProperties> = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '6px' },
    bottom: { top: '100%',   left: '50%', transform: 'translateX(-50%)', marginTop: '6px' },
    left:   { right: '100%', top: '50%',  transform: 'translateY(-50%)', marginRight: '6px' },
    right:  { left: '100%',  top: '50%',  transform: 'translateY(-50%)', marginLeft: '6px' },
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs rounded-md whitespace-nowrap pointer-events-none animate-fade-in"
          style={{
            ...positions[side],
            backgroundColor: 'var(--tooltip-bg)',
            color: 'var(--tooltip-text)',
            border: '1px solid var(--tooltip-border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
