import React, { useState, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import {
  Plus, Upload, Download, RefreshCw, LayoutGrid, Star, Clock,
  Archive, BarChart2, Zap, ChevronRight, Settings,
} from 'lucide-react'
import { StoreProvider, useStore } from '../store'
import { useSearch } from '../hooks/useSearch'
import { useTheme } from '../hooks/useTheme'
import { useStats } from '../hooks/useStats'
import { SearchBar } from '../components/layout/SearchBar'
import { PromptGrid } from '../components/prompts/PromptGrid'
import { PromptForm } from '../components/prompts/PromptForm'
import { AnalyticsCharts, StatCards } from '../components/analytics/Charts'
import { FolderList } from '../components/folders/FolderList'
import { Button } from '../components/ui/Button'
import { StorageService } from '../services/storage'
import { exportAsCSV, exportAsMarkdown, cn } from '../utils'
import type { ViewFilter, SearchFilters } from '../types'
import '../index.css'

const DEFAULT_FILTERS: SearchFilters = { query: '', category: '', tags: [], model: '', folderId: null }
type Tab = 'prompts' | 'analytics' | 'import-export'

const NAV_ITEMS: { id: ViewFilter; icon: React.ElementType; label: string }[] = [
  { id: 'all', icon: LayoutGrid, label: 'All Prompts' },
  { id: 'favorites', icon: Star, label: 'Favorites' },
  { id: 'recent', icon: Clock, label: 'Recently Used' },
  { id: 'archived', icon: Archive, label: 'Archived' },
]

function DashboardApp() {
  useTheme()
  const { state, reload } = useStore()
  const stats = useStats(state.prompts)
  const [view, setView] = useState<ViewFilter>('all')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [displayView, setDisplayView] = useState<'grid' | 'list'>(state.settings.defaultView)
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('prompts')

  const counts: Record<ViewFilter, number> = {
    all: state.prompts.filter(p => !p.isArchived).length,
    favorites: state.prompts.filter(p => p.isFavorite && !p.isArchived).length,
    recent: state.prompts.filter(p => p.lastUsed).length,
    archived: state.prompts.filter(p => p.isArchived).length,
  }

  const filteredByView = useMemo(() => {
    const base = state.prompts
    switch (view) {
      case 'favorites': return base.filter(p => p.isFavorite && !p.isArchived)
      case 'recent': return [...base.filter(p => p.lastUsed && !p.isArchived)].sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      case 'archived': return base.filter(p => p.isArchived)
      default: return base.filter(p => !p.isArchived)
    }
  }, [state.prompts, view])

  const searchable = useMemo(() => {
    if (selectedFolder !== null) return filteredByView.filter(p => p.folderId === selectedFolder)
    return filteredByView
  }, [filteredByView, selectedFolder])

  const results = useSearch(searchable, filters)

  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = async () => {
    downloadBlob(new Blob([await StorageService.exportData()], { type: 'application/json' }), 'apna-promptvault-export.json')
    toast.success('Exported as JSON')
  }
  const handleExportCSV = () => {
    downloadBlob(new Blob([exportAsCSV(state.prompts)], { type: 'text/csv' }), 'apna-promptvault-export.csv')
    toast.success('Exported as CSV')
  }
  const handleExportMarkdown = () => {
    downloadBlob(new Blob([exportAsMarkdown(state.prompts)], { type: 'text/markdown' }), 'apna-promptvault-export.md')
    toast.success('Exported as Markdown')
  }
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try { await StorageService.importData(ev.target?.result as string); await reload(); toast.success('Import successful!') }
      catch { toast.error('Invalid file format') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const sidebarNavBtn = (active: boolean) => ({
    backgroundColor: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    color: active ? '#a5b4fc' : 'var(--text-muted)',
  })

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-56 shrink-0 overflow-y-auto" style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Apna PromptVault</span>
        </div>

        <nav className="flex flex-col gap-0.5 p-2 mt-1">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const active = view === id && !selectedFolder && tab === 'prompts'
            return (
              <button
                key={id}
                onClick={() => { setView(id); setSelectedFolder(null); setTab('prompts') }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left"
                style={sidebarNavBtn(active)}
              >
                <Icon size={14} />
                <span className="flex-1">{label}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{counts[id]}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-2 py-2" style={{ borderTop: '1px solid var(--border-color)' }}>
          <FolderList selectedId={selectedFolder} onSelect={(id) => { setSelectedFolder(id); setTab('prompts') }} />
        </div>

        <div className="mt-auto p-2 flex flex-col gap-0.5" style={{ borderTop: '1px solid var(--border-color)' }}>
          {([
            { id: 'analytics' as Tab, icon: BarChart2, label: 'Analytics' },
            { id: 'import-export' as Tab, icon: Download, label: 'Import / Export' },
          ]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full"
              style={sidebarNavBtn(tab === id)}
            >
              <Icon size={14} /><span className="flex-1">{label}</span><ChevronRight size={11} />
            </button>
          ))}
          <a
            href="options.html" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Settings size={14} /><span className="flex-1">Settings</span><ChevronRight size={11} />
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h1 className="text-base font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
            {tab === 'prompts'
              ? (selectedFolder ? (state.folders.find(f => f.id === selectedFolder)?.name ?? 'Folder') : view + ' prompts')
              : tab.replace('-', ' ')}
          </h1>
          {tab === 'prompts' && <Button onClick={() => setFormOpen(true)} size="sm"><Plus size={13} /> New Prompt</Button>}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'prompts' && (
            <div className="flex flex-col gap-4">
              <SearchBar filters={filters} onChange={f => setFilters(prev => ({ ...prev, ...f }))} view={displayView} onViewChange={setDisplayView} onNew={() => setFormOpen(true)} />
              <PromptGrid prompts={results} view={displayView} onNew={() => setFormOpen(true)} />
            </div>
          )}

          {tab === 'analytics' && (
            <div className="flex flex-col gap-6 max-w-4xl">
              <StatCards stats={stats} />
              <AnalyticsCharts stats={stats} />
              {stats.mostUsed && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Most Used Prompt</h3>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{stats.mostUsed.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Used {stats.mostUsed.usageCount} times</p>
                </div>
              )}
              {stats.recentlyUsed.length > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Recently Used</h3>
                  <div className="flex flex-col gap-1">
                    {stats.recentlyUsed.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.title}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.usageCount} uses</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'import-export' && (
            <div className="max-w-xl flex flex-col gap-4">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Export Prompts ({state.prompts.length} total)</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'JSON', action: handleExportJSON }, { label: 'CSV', action: handleExportCSV }, { label: 'Markdown', action: handleExportMarkdown }].map(({ label, action }) => (
                    <Button key={label} variant="outline" onClick={action}><Download size={13} /> {label}</Button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Import Prompts</h3>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl cursor-pointer transition-colors group" style={{ border: '2px dashed var(--border-color)' }}>
                  <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Click to import JSON file</span>
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </div>
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Backup</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  {state.lastBackup ? `Last backup: ${new Date(state.lastBackup).toLocaleString()}` : 'No backup created yet'}
                </p>
                <Button variant="secondary" onClick={async () => { await StorageService.createBackup(); toast.success('Backup created!') }}>
                  <RefreshCw size={13} /> Create Backup
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <PromptForm open={formOpen} onClose={() => setFormOpen(false)} />
      <Toaster position="bottom-right" toastOptions={{ style: { background: 'var(--tooltip-bg)', color: 'var(--tooltip-text)', fontSize: '13px', border: '1px solid var(--tooltip-border)' } }} />
    </div>
  )
}

export default function Dashboard() {
  return <StoreProvider><DashboardApp /></StoreProvider>
}
