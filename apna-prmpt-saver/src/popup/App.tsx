import React, { useState, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import { Settings, ExternalLink, Zap } from 'lucide-react'
import { StoreProvider, useStore } from '../store'
import { useSearch } from '../hooks/useSearch'
import { useTheme } from '../hooks/useTheme'
import { SearchBar } from '../components/layout/SearchBar'
import { PromptGrid } from '../components/prompts/PromptGrid'
import { PromptForm } from '../components/prompts/PromptForm'
import type { ViewFilter, SearchFilters } from '../types'
import '../index.css'

const DEFAULT_FILTERS: SearchFilters = { query: '', category: '', tags: [], model: '', folderId: null }

const NAV: { id: ViewFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'favorites', label: '★ Favs' },
  { id: 'recent', label: 'Recent' },
  { id: 'archived', label: 'Archived' },
]

function PopupApp() {
  useTheme()
  const { state } = useStore()
  const [view, setView] = useState<ViewFilter>('all')
  const [displayView, setDisplayView] = useState<'grid' | 'list'>(state.settings.defaultView)
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(() => {
    const base = state.prompts
    switch (view) {
      case 'favorites': return base.filter(p => p.isFavorite && !p.isArchived)
      case 'recent': return [...base.filter(p => p.lastUsed && !p.isArchived)].sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      case 'archived': return base.filter(p => p.isArchived)
      default: return base.filter(p => !p.isArchived)
    }
  }, [state.prompts, view])

  const results = useSearch(filtered, filters)

  const openDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') })
    }
  }

  const openSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.openOptionsPage()
    }
  }

  return (
    <div className="flex flex-col" style={{ width: 420, height: 580, backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Apna PromptVault</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={openSettings} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            <Settings size={14} />
          </button>
          <button onClick={openDashboard} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-2 shrink-0">
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: view === n.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: view === n.id ? '#a5b4fc' : 'var(--text-muted)',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 py-2 shrink-0">
        <SearchBar
          filters={filters}
          onChange={f => setFilters(prev => ({ ...prev, ...f }))}
          view={displayView}
          onViewChange={setDisplayView}
          onNew={() => setFormOpen(true)}
        />
      </div>

      {/* Prompt list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <PromptGrid prompts={results} view={displayView} onNew={() => setFormOpen(true)} />
      </div>

      <PromptForm open={formOpen} onClose={() => setFormOpen(false)} />
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: 'var(--tooltip-bg)', color: 'var(--tooltip-text)', fontSize: '13px', border: '1px solid var(--tooltip-border)' } }}
      />
    </div>
  )
}

export default function Popup() {
  return (
    <StoreProvider>
      <PopupApp />
    </StoreProvider>
  )
}
