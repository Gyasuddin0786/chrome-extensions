import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'

const STYLES = `
  #promptvault-root {
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    z-index: 2147483647 !important;
    font-family: Inter, system-ui, sans-serif !important;
  }
  .pv-btn {
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(99,102,241,0.5);
    transition: transform 0.15s, box-shadow 0.15s;
    font-size: 20px;
  }
  .pv-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(99,102,241,0.7); }
  .pv-panel {
    position: absolute; bottom: 58px; right: 0; width: 310px;
    background: #111827; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    overflow: hidden; animation: pvUp 0.2s ease-out;
  }
  @keyframes pvUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
  .pv-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid rgba(255,255,255,0.08); }
  .pv-title { font-size:13px; font-weight:600; color:#fff; }
  .pv-close { background:none; border:none; color:rgba(255,255,255,0.4); cursor:pointer; font-size:18px; line-height:1; padding:0; }
  .pv-close:hover { color:#fff; }
  .pv-search { display:block; margin:10px; padding:8px 12px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-size:12px; width:calc(100% - 20px); outline:none; box-sizing:border-box; }
  .pv-search:focus { border-color:#6366f1; }
  .pv-list { max-height:300px; overflow-y:auto; padding:4px 0; }
  .pv-item { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.1s; }
  .pv-item:hover { background:rgba(255,255,255,0.07); }
  .pv-item-info { flex:1; min-width:0; }
  .pv-item-title { font-size:12px; font-weight:500; color:rgba(255,255,255,0.85); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .pv-item-cat { font-size:10px; color:rgba(255,255,255,0.35); margin-top:2px; }
  .pv-copy { padding:4px 10px; background:rgba(99,102,241,0.2); border:none; border-radius:6px; color:#a5b4fc; font-size:10px; cursor:pointer; white-space:nowrap; font-family:inherit; transition:background 0.1s; }
  .pv-copy:hover { background:rgba(99,102,241,0.4); }
  .pv-empty { padding:24px; text-align:center; color:rgba(255,255,255,0.3); font-size:12px; }
  .pv-list::-webkit-scrollbar { width:3px; }
  .pv-list::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:99px; }
`

interface StoredPrompt { id: string; title: string; content: string; category: string; isArchived?: boolean; usageCount?: number; lastUsed?: string | null }

function Widget() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [prompts, setPrompts] = useState<StoredPrompt[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(() => {
    chrome.storage.local.get('promptvault', (res) => {
      const p: StoredPrompt[] = res.promptvault?.prompts ?? []
      setPrompts(p.filter(x => !x.isArchived))
    })
  }, [])

  useEffect(() => { if (open) load() }, [open, load])

  const shown = query.trim()
    ? prompts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.content.toLowerCase().includes(query.toLowerCase()))
    : prompts.slice(0, 25)

  const copy = async (p: StoredPrompt) => {
    await navigator.clipboard.writeText(p.content)
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 2000)
    chrome.storage.local.get('promptvault', (res) => {
      const store = res.promptvault
      if (!store?.prompts) return
      const updated = store.prompts.map((x: StoredPrompt) =>
        x.id === p.id ? { ...x, usageCount: (x.usageCount ?? 0) + 1, lastUsed: new Date().toISOString() } : x
      )
      chrome.storage.local.set({ promptvault: { ...store, prompts: updated } })
    })
  }

  return (
    <>
      {open && (
        <div className="pv-panel">
          <div className="pv-header">
            <span className="pv-title">⚡ Apna PromptVault</span>
            <button className="pv-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <input className="pv-search" placeholder="Search prompts..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          <div className="pv-list">
            {shown.length === 0
              ? <div className="pv-empty">No prompts found</div>
              : shown.map(p => (
                <div key={p.id} className="pv-item">
                  <div className="pv-item-info">
                    <div className="pv-item-title">{p.title}</div>
                    <div className="pv-item-cat">{p.category}</div>
                  </div>
                  <button className="pv-copy" onClick={() => copy(p)}>
                    {copiedId === p.id ? '✓' : 'Copy'}
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}
      <button className="pv-btn" onClick={() => setOpen(o => !o)} title="PromptVault AI">⚡</button>
    </>
  )
}

function init() {
  if (document.getElementById('promptvault-root')) return

  const style = document.createElement('style')
  style.textContent = STYLES
  document.head.appendChild(style)

  const container = document.createElement('div')
  container.id = 'promptvault-root'
  document.body.appendChild(container)
  createRoot(container).render(<Widget />)
}

// Wait for body, then check settings
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('promptvault', (res) => {
      if (res.promptvault?.settings?.showFloatingWidget !== false) init()
    })
  })
} else {
  chrome.storage.local.get('promptvault', (res) => {
    if (res.promptvault?.settings?.showFloatingWidget !== false) init()
  })
}
