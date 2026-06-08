import React from 'react'
import { cn } from '../../utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
    ghost: 'hover:bg-white/10 text-white/70 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    outline: 'border border-white/20 hover:bg-white/10 text-white/80 hover:text-white',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    icon: 'p-2',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  )
}
