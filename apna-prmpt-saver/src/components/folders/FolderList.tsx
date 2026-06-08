import React, { useState } from 'react'
import { Folder, Pencil, Trash2, Plus } from 'lucide-react'
import type { Folder as FolderType } from '../../types'
import { useStore } from '../../store'
import { Modal, ModalBody, ModalFooter } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { FOLDER_COLORS } from '../../utils'
import toast from 'react-hot-toast'

export function FolderList({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  const { state, deleteFolder } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FolderType | null>(null)

  const handleDelete = async (folder: FolderType) => {
    if (confirm(`Delete folder "${folder.name}"?`)) {
      await deleteFolder(folder.id)
      if (selectedId === folder.id) onSelect(null)
      toast.success('Folder deleted')
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Folders</span>
        <button onClick={() => setFormOpen(true)} className="p-0.5 rounded transition-colors" style={{ color: 'var(--text-muted)' }}>
          <Plus size={13} />
        </button>
      </div>

      {state.folders.map(f => (
        <div
          key={f.id}
          onClick={() => onSelect(selectedId === f.id ? null : f.id)}
          className="group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
          style={{
            backgroundColor: selectedId === f.id ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: selectedId === f.id ? '#a5b4fc' : 'var(--text-secondary)',
          }}
        >
          <Folder size={13} style={{ color: f.color }} />
          <span className="flex-1 text-sm truncate">{f.name}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); setEditing(f); setFormOpen(true) }}
              className="p-0.5 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Pencil size={10} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleDelete(f) }}
              className="p-0.5 rounded transition-colors"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
      ))}

      <FolderForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        folder={editing ?? undefined}
      />
    </div>
  )
}

function FolderForm({ open, onClose, folder }: { open: boolean; onClose: () => void; folder?: FolderType }) {
  const { createFolder, updateFolder } = useStore()
  const [name, setName] = useState(folder?.name ?? '')
  const [color, setColor] = useState(folder?.color ?? FOLDER_COLORS[0])
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    setName(folder?.name ?? '')
    setColor(folder?.color ?? FOLDER_COLORS[0])
  }, [folder, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      if (folder) await updateFolder({ ...folder, name, color })
      else await createFolder({ name, color, icon: 'folder', parentId: null })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={folder ? 'Edit Folder' : 'New Folder'} size="sm">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4">
          <Input label="Name" placeholder="Folder name..." value={name} onChange={e => setName(e.target.value)} required />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-transform"
                  style={{ backgroundColor: c, transform: color === c ? 'scale(1.25)' : 'scale(1)', outline: color === c ? '2px solid rgba(255,255,255,0.6)' : 'none', outlineOffset: '2px' }}
                />
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{folder ? 'Update' : 'Create'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
