import React, { useState } from 'react'
import { Star, Copy, Edit2, Trash2, Archive, ArchiveRestore, MoreVertical, Check, GitBranch } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Prompt } from '../../types'
import { useStore } from '../../store'
import { copyToClipboard, truncate, timeAgo, MODEL_COLORS } from '../../utils'
import { Tag } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'
import { PromptForm } from './PromptForm'

interface PromptCardProps {
  prompt: Prompt
  view?: 'grid' | 'list'
}

export function PromptCard({ prompt, view = 'grid' }: PromptCardProps) {
  const { toggleFavorite, toggleArchive, deletePrompt, duplicatePrompt, incrementUsage } = useStore()
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopy = async () => {
    if (await copyToClipboard(prompt.content)) {
      await incrementUsage(prompt.id)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Delete "${prompt.title}"?`)) {
      await deletePrompt(prompt.id)
      toast.success('Prompt deleted')
    }
  }

  const modelColor = MODEL_COLORS[prompt.model] ?? '#6366f1'

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    transition: 'all 0.15s',
  }

  if (view === 'list') {
    return (
      <>
        <div className="group flex items-center gap-4 px-4 py-3 transition-all duration-150" style={cardStyle}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{prompt.title}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0" style={{ backgroundColor: modelColor + '22', color: modelColor }}>
                {prompt.model}
              </span>
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{truncate(prompt.content, 80)}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButtons prompt={prompt} copied={copied} onCopy={handleCopy} onFavorite={() => toggleFavorite(prompt.id)} onEdit={() => setEditing(true)} onDelete={handleDelete} onArchive={() => toggleArchive(prompt.id)} onDuplicate={() => duplicatePrompt(prompt.id)} />
          </div>
        </div>
        <PromptForm open={editing} onClose={() => setEditing(false)} prompt={prompt} />
      </>
    )
  }

  return (
    <>
      <div className="group relative flex flex-col gap-3 p-4 animate-fade-in" style={cardStyle}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{prompt.title}</h3>
            {prompt.description && (
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{truncate(prompt.description, 60)}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Tooltip content={prompt.isFavorite ? 'Remove favorite' : 'Favorite'}>
              <button
                onClick={() => toggleFavorite(prompt.id)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: prompt.isFavorite ? '#eab308' : 'var(--text-muted)' }}
              >
                <Star size={13} fill={prompt.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </Tooltip>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <MoreVertical size={13} />
              </button>
              {menuOpen && (
                <DropdownMenu
                  onClose={() => setMenuOpen(false)}
                  onEdit={() => { setMenuOpen(false); setEditing(true) }}
                  onDelete={() => { setMenuOpen(false); handleDelete() }}
                  onArchive={() => { setMenuOpen(false); toggleArchive(prompt.id) }}
                  onDuplicate={() => { setMenuOpen(false); duplicatePrompt(prompt.id) }}
                  isArchived={prompt.isArchived}
                />
              )}
            </div>
          </div>
        </div>

        {/* Content preview */}
        <p className="text-xs leading-relaxed line-clamp-2 font-mono px-2.5 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-hover)' }}>
          {truncate(prompt.content, 120)}
        </p>

        {/* Tags + copy */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: modelColor + '22', color: modelColor }}>
              {prompt.model}
            </span>
            {prompt.tags.slice(0, 2).map(t => <Tag key={t} tag={t} />)}
            {prompt.tags.length > 2 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{prompt.tags.length - 2}</span>}
          </div>
          <Tooltip content="Copy prompt">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={copied
                ? { backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }
                : { backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }
              }
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </Tooltip>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{prompt.category}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {prompt.usageCount > 0 ? `Used ${prompt.usageCount}×` : timeAgo(prompt.createdAt)}
          </span>
        </div>
      </div>
      <PromptForm open={editing} onClose={() => setEditing(false)} prompt={prompt} />
    </>
  )
}

function ActionButtons({ prompt, copied, onCopy, onFavorite, onEdit, onDelete, onArchive, onDuplicate }: {
  prompt: Prompt; copied: boolean
  onCopy: () => void; onFavorite: () => void; onEdit: () => void
  onDelete: () => void; onArchive: () => void; onDuplicate: () => void
}) {
  const btn: React.CSSProperties = { color: 'var(--text-muted)' }
  return (
    <>
      <Tooltip content="Copy">
        <button onClick={onCopy} className="p-1.5 rounded-lg transition-colors" style={btn}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </Tooltip>
      <Tooltip content="Favorite">
        <button onClick={onFavorite} className="p-1.5 rounded-lg transition-colors" style={{ color: prompt.isFavorite ? '#eab308' : 'var(--text-muted)' }}>
          <Star size={13} fill={prompt.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </Tooltip>
      <Tooltip content="Edit">
        <button onClick={onEdit} className="p-1.5 rounded-lg transition-colors" style={btn}><Edit2 size={13} /></button>
      </Tooltip>
      <Tooltip content={prompt.isArchived ? 'Restore' : 'Archive'}>
        <button onClick={onArchive} className="p-1.5 rounded-lg transition-colors" style={btn}>
          {prompt.isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
        </button>
      </Tooltip>
      <Tooltip content="Delete">
        <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
      </Tooltip>
    </>
  )
}

function DropdownMenu({ onClose, onEdit, onDelete, onArchive, onDuplicate, isArchived }: {
  onClose: () => void; onEdit: () => void; onDelete: () => void
  onArchive: () => void; onDuplicate: () => void; isArchived: boolean
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl shadow-xl overflow-hidden animate-scale-in" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        {[
          { icon: Edit2, label: 'Edit', action: onEdit, danger: false },
          { icon: GitBranch, label: 'Duplicate', action: onDuplicate, danger: false },
          { icon: isArchived ? ArchiveRestore : Archive, label: isArchived ? 'Restore' : 'Archive', action: onArchive, danger: false },
          { icon: Trash2, label: 'Delete', action: onDelete, danger: true },
        ].map(({ icon: Icon, label, action, danger }) => (
          <button
            key={label} onClick={action}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors"
            style={{ color: danger ? '#ef4444' : 'var(--text-secondary)' }}
          >
            <Icon size={13} />{label}
          </button>
        ))}
      </div>
    </>
  )
}
