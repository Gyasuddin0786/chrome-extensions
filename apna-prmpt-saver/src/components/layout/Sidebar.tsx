import React from 'react'
import { LayoutGrid, Star, Clock, Archive, BarChart2, Zap, ChevronRight } from 'lucide-react'
import type { ViewFilter } from '../../types'
import { useStore } from '../../store'
import { FolderList } from '../folders/FolderList'

interface SidebarProps {
  view: ViewFilter
  onViewChange: (v: ViewFilter) => void
  selectedFolder: string | null
  onFolderSelect: (id: string | null) => void
  onOpenDashboard?: () => void
}

const NAV_ITEMS: { id: ViewFilter; icon: React.ElementType; label: string }[] = [
  { id: 'all',      icon: LayoutGrid, label: 'All Prompts' },
  { id: 'favorites',icon: Star,       label: 'Favorites' },
  { id: 'recent',   icon: Clock,      label: 'Recently Used' },
  { id: 'archived', icon: Archive,    label: 'Archived' },
]

export function Sidebar({ view, onViewChange, selectedFolder, onFolderSelect, onOpenDashboard }: SidebarProps) {
  const { state } = useStore()
  const counts: Record<ViewFilter, number> = {
    all:      state.prompts.filter(p => !p.isArchived).length,
    favorites:state.prompts.filter(p => p.isFavorite && !p.isArchived).length,
    recent:   state.prompts.filter(p => p.lastUsed).length,
    archived: state.prompts.filter(p => p.isArchived).length,
  }

  const navBtn = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    color: active ? '#a5b4fc' : 'var(--text-muted)',
    fontWeight: active ? 600 : 400,
  })

  return (
    <aside
      className="flex flex-col w-56 shrink-0 h-full overflow-y-auto"
      style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Apna PromptVault</span>
      </div>

      <nav className="flex flex-col gap-0.5 p-2 mt-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const active = view === id && !selectedFolder
          return (
            <button
              key={id}
              onClick={() => { onViewChange(id); onFolderSelect(null) }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left"
              style={navBtn(active)}
            >
              <Icon size={14} />
              <span className="flex-1">{label}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{counts[id]}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-2 py-2" style={{ borderTop: '1px solid var(--border-color)' }}>
        <FolderList selectedId={selectedFolder} onSelect={onFolderSelect} />
      </div>

      <div className="mt-auto p-2 flex flex-col gap-0.5" style={{ borderTop: '1px solid var(--border-color)' }}>
        {onOpenDashboard && (
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full"
            style={{ color: 'var(--text-muted)' }}
          >
            <BarChart2 size={14} /><span className="flex-1">Analytics</span><ChevronRight size={11} />
          </button>
        )}
      </div>
    </aside>
  )
}
