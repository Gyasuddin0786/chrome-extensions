import React, { useState, KeyboardEvent, useEffect } from 'react'
import type { Prompt, AIModel } from '../../types'
import { useStore } from '../../store'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Select, Tag } from '../ui/Badge'
import { Modal, ModalBody, ModalFooter } from '../ui/Modal'

const AI_MODELS: AIModel[] = ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Perplexity', 'DeepSeek', 'Grok', 'Custom']

interface PromptFormProps {
  open: boolean
  onClose: () => void
  prompt?: Prompt
}

type FormState = {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  model: AIModel
  folderId: string | null
}

export function PromptForm({ open, onClose, prompt }: PromptFormProps) {
  const { state, createPrompt, updatePrompt } = useStore()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState<FormState>({
    title: '', description: '', content: '',
    category: state.categories[0] ?? 'Coding',
    tags: [], model: 'ChatGPT', folderId: null,
  })

  useEffect(() => {
    setForm({
      title: prompt?.title ?? '',
      description: prompt?.description ?? '',
      content: prompt?.content ?? '',
      category: prompt?.category ?? state.categories[0] ?? 'Coding',
      tags: prompt?.tags ?? [],
      model: prompt?.model ?? 'ChatGPT',
      folderId: prompt?.folderId ?? null,
    })
    setTagInput('')
  }, [prompt, open])

  const set = (key: keyof FormState, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) set('tags', form.tags.slice(0, -1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setLoading(true)
    try {
      if (prompt) await updatePrompt({ ...prompt, ...form })
      else await createPrompt({ ...form, isFavorite: false, isArchived: false })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = state.categories.map(c => ({ value: c, label: c }))
  const modelOptions = AI_MODELS.map(m => ({ value: m, label: m }))
  const folderOptions = [
    { value: '', label: 'No Folder' },
    ...state.folders.map(f => ({ value: f.id, label: f.name })),
  ]

  return (
    <Modal open={open} onClose={onClose} title={prompt ? 'Edit Prompt' : 'New Prompt'} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4">
          <Input label="Title *" placeholder="e.g. Write a React component..." value={form.title} onChange={e => set('title', e.target.value)} required />
          <Input label="Description" placeholder="Short description..." value={form.description} onChange={e => set('description', e.target.value)} />
          <Textarea label="Prompt Content *" placeholder="Write your prompt here..." value={form.content} onChange={e => set('content', e.target.value)} rows={6} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={categoryOptions} value={form.category} onChange={e => set('category', e.target.value)} />
            <Select label="AI Model" options={modelOptions} value={form.model} onChange={e => set('model', e.target.value as AIModel)} />
          </div>
          <Select label="Folder" options={folderOptions} value={form.folderId ?? ''} onChange={e => set('folderId', e.target.value || null)} />

          {/* Tags input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Tags</label>
            <div
              className="flex flex-wrap gap-1.5 p-2 rounded-lg min-h-[42px]"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              {form.tags.map(tag => (
                <Tag key={tag} tag={tag} onRemove={() => set('tags', form.tags.filter(t => t !== tag))} />
              ))}
              <input
                className="flex-1 min-w-[80px] bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={addTag}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{prompt ? 'Update' : 'Create'} Prompt</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
