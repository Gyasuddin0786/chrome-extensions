import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { Zap, Palette, Shield, Keyboard, Tag, Info, Plus, Trash2, Monitor, Sun, Moon } from 'lucide-react'
import { StoreProvider, useStore } from '../store'
import { useTheme } from '../hooks/useTheme'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import '../index.css'

type Section = 'appearance' | 'categories' | 'shortcuts' | 'storage' | 'about'

function SettingsApp() {
  const { state, updateSettings, addCategory, deleteCategory } = useStore()
  const [section, setSection] = useState<Section>('appearance')
  const [newCategory, setNewCategory] = useState('')
  const { theme, setTheme } = useTheme()

  const save = async (updates: Partial<typeof state.settings>) => {
    await updateSettings(updates)
    toast.success('Saved')
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    await addCategory(newCategory.trim())
    setNewCategory('')
    toast.success('Category added')
  }

  const NAV: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'categories', icon: Tag, label: 'Categories' },
    { id: 'shortcuts', icon: Keyboard, label: 'Shortcuts' },
    { id: 'storage', icon: Shield, label: 'Storage' },
    { id: 'about', icon: Info, label: 'About' },
  ]

  const ACCENT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#06b6d4']

  const card = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }
  const label = { color: 'var(--text-secondary)', fontSize: '13px' }
  const muted = { color: 'var(--text-muted)', fontSize: '12px' }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-52 shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Apna PromptVault</div>
            <div style={muted}>Settings</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 mt-2">
          {NAV.map(({ id, icon: Icon, label: lbl }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left"
              style={{
                backgroundColor: section === id ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: section === id ? '#a5b4fc' : 'var(--text-muted)',
                fontWeight: section === id ? 600 : 400,
              }}
            >
              <Icon size={14} />{lbl}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 max-w-2xl">

        {section === 'appearance' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h2>

            <div style={card} className="flex flex-col gap-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Theme</h3>
              <div className="flex gap-3">
                {([
                  { id: 'light' as const, icon: Sun, label: 'Light' },
                  { id: 'dark' as const, icon: Moon, label: 'Dark' },
                  { id: 'system' as const, icon: Monitor, label: 'System' },
                ]).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                    style={{
                      border: `2px solid ${theme === id ? '#6366f1' : 'var(--border-color)'}`,
                      backgroundColor: theme === id ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                      color: theme === id ? '#a5b4fc' : 'var(--text-muted)',
                    }}
                  >
                    <Icon size={18} /><span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={card} className="flex flex-col gap-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Accent Color</h3>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => save({ accentColor: c })}
                    className="w-8 h-8 rounded-full transition-transform"
                    style={{ backgroundColor: c, transform: state.settings.accentColor === c ? 'scale(1.25)' : 'scale(1)', outline: state.settings.accentColor === c ? '2px solid rgba(255,255,255,0.5)' : 'none', outlineOffset: '2px' }}
                  />
                ))}
              </div>
            </div>

            <div style={card} className="flex flex-col gap-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Layout</h3>
              {[
                {
                  label: 'Default View',
                  control: (
                    <div className="flex gap-2">
                      {(['grid', 'list'] as const).map(v => (
                        <button key={v} onClick={() => save({ defaultView: v })} className="px-3 py-1.5 rounded-lg text-xs capitalize transition-colors"
                          style={{ backgroundColor: state.settings.defaultView === v ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', color: state.settings.defaultView === v ? '#a5b4fc' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{v}</button>
                      ))}
                    </div>
                  ),
                },
                {
                  label: 'Compact Mode',
                  control: <Toggle on={state.settings.compactMode} onClick={() => save({ compactMode: !state.settings.compactMode })} />,
                },
                {
                  label: 'Show Floating Widget',
                  control: <Toggle on={state.settings.showFloatingWidget} onClick={() => save({ showFloatingWidget: !state.settings.showFloatingWidget })} />,
                },
              ].map(({ label: lbl, control }) => (
                <div key={lbl} className="flex items-center justify-between">
                  <span className="text-sm" style={label}>{lbl}</span>
                  {control}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'categories' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Categories</h2>
            <div style={card} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New category name..."
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} size="md"><Plus size={14} /></Button>
              </div>
              <div className="flex flex-col gap-1">
                {state.categories.map(cat => (
                  <div
                    key={cat}
                    className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors group"
                    style={{ backgroundColor: 'var(--bg-hover)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                    <button
                      onClick={() => { deleteCategory(cat); toast.success('Category deleted') }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'shortcuts' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {[
                { action: 'Open Apna PromptVault', shortcut: 'Ctrl + Shift + P' },
                { action: 'Save Selected Text', shortcut: 'Ctrl + Shift + S' },
                { action: 'Search Prompts', shortcut: 'Ctrl + Shift + F' },
              ].map(({ action, shortcut }) => (
                <div key={action} className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{action}</span>
                  <kbd className="px-2.5 py-1 rounded-md text-xs font-mono" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{shortcut}</kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'storage' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Storage & Backup</h2>
            <div style={card} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={label}>Auto Backup</p>
                  <p style={muted}>Automatically backup your prompts</p>
                </div>
                <Toggle on={state.settings.autoBackup} onClick={() => save({ autoBackup: !state.settings.autoBackup })} />
              </div>
              {state.settings.autoBackup && (
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={label}>Frequency</span>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map(f => (
                      <button key={f} onClick={() => save({ backupFrequency: f })} className="px-3 py-1.5 rounded-lg text-xs capitalize transition-colors"
                        style={{ backgroundColor: state.settings.backupFrequency === f ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', color: state.settings.backupFrequency === f ? '#a5b4fc' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{f}</button>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs pt-2" style={{ ...muted, borderTop: '1px solid var(--border-color)' }}>
                Total prompts stored: <span style={{ color: 'var(--text-secondary)' }}>{state.prompts.length}</span>
              </p>
            </div>
          </div>
        )}

        {section === 'about' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>About</h2>
            <div style={card} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Apna PromptVault</h3>
                <p style={muted}>Version 1.0.0</p>
              </div>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A premium AI prompt management system for developers, marketers, and AI enthusiasts.
              </p>
              <div className="flex flex-col gap-1" style={muted}>
                <span>Built with React + Vite + TypeScript + Tailwind CSS</span>
                <span>Chrome Extension Manifest V3</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toaster position="bottom-right" toastOptions={{ style: { background: 'var(--tooltip-bg)', color: 'var(--tooltip-text)', fontSize: '13px', border: '1px solid var(--tooltip-border)' } }} />
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-5 rounded-full transition-colors relative shrink-0"
      style={{ backgroundColor: on ? '#6366f1' : 'rgba(150,150,150,0.3)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

export default function Options() {
  return <StoreProvider><SettingsApp /></StoreProvider>
}
