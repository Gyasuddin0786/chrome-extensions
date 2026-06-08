import React from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
      >
        {icon ?? <Inbox size={32} />}
      </div>
      <div>
        <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {description && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}
