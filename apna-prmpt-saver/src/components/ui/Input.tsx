import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  fontSize: '13px',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

export function Input({ label, error, icon, style, onFocus, onBlur, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            {icon}
          </span>
        )}
        <input
          style={{ ...fieldStyle, padding: icon ? '8px 12px 8px 36px' : '8px 12px', ...style }}
          onFocus={e => { e.target.style.borderColor = '#6366f1'; onFocus?.(e) }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; onBlur?.(e) }}
          className={className}
          {...props}
        />
      </div>
      {error && <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, style, onFocus, onBlur, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <textarea
        style={{ ...fieldStyle, padding: '8px 12px', resize: 'none', ...style }}
        onFocus={e => { e.target.style.borderColor = '#6366f1'; onFocus?.(e) }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; onBlur?.(e) }}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>}
    </div>
  )
}
