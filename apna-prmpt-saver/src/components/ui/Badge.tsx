import React from 'react'
import { X } from 'lucide-react'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
  onClick?: () => void
}

export function Badge({ children, color, onClick }: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: color ? color + '22' : 'var(--bg-hover)',
        color: color ?? 'var(--text-secondary)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </span>
  )
}

interface TagProps {
  tag: string
  onRemove?: () => void
}

export function Tag({ tag, onRemove }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}
    >
      #{tag}
      {onRemove && (
        <button onClick={onRemove} className="transition-colors" style={{ color: '#a5b4fc' }}>
          <X size={10} />
        </button>
      )}
    </span>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, style, onFocus, onBlur, ...props }: SelectProps) {
  // Detect current theme by checking if .dark is on <html>
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const optionBg = isDark ? '#1a1a2e' : '#ffffff'
  const optionColor = isDark ? '#f1f5f9' : '#0f172a'

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-primary)',
          padding: '8px 12px',
          outline: 'none',
          cursor: 'pointer',
          colorScheme: isDark ? 'dark' : 'light',
          ...style,
        }}
        onFocus={e => { e.target.style.borderColor = '#6366f1'; onFocus?.(e) }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; onBlur?.(e) }}
        {...props}
      >
        {options.map(o => (
          <option
            key={o.value}
            value={o.value}
            style={{ backgroundColor: optionBg, color: optionColor }}
          >
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
