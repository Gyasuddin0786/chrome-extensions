import React from 'react'
import type { Prompt } from '../../types'
import { PromptCard } from './PromptCard'
import { PromptCardSkeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils'

interface PromptGridProps {
  prompts: Prompt[]
  loading?: boolean
  view?: 'grid' | 'list'
  onNew?: () => void
}

export function PromptGrid({ prompts, loading, view = 'grid', onNew }: PromptGridProps) {
  if (loading) {
    return (
      <div className={cn(view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-2')}>
        {Array.from({ length: 6 }).map((_, i) => <PromptCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!prompts.length) {
    return (
      <EmptyState
        icon={<Sparkles size={28} />}
        title="No prompts yet"
        description="Create your first prompt to get started"
        action={onNew && <Button onClick={onNew} size="sm">+ New Prompt</Button>}
      />
    )
  }

  return (
    <div className={cn(
      view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
        : 'flex flex-col gap-1.5'
    )}>
      {prompts.map(p => <PromptCard key={p.id} prompt={p} view={view} />)}
    </div>
  )
}
