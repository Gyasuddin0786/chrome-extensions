import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const sizes = { sm: '380px', md: '448px', lg: '560px', xl: '672px' }

export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div
        className="relative w-full flex flex-col animate-scale-in"
        style={{
          maxWidth: sizes[size],
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={15} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className ?? ''}`}>{children}</div>
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-2 px-5 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
      {children}
    </div>
  )
}
