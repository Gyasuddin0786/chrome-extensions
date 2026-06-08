import { useMemo } from 'react'
import type { Prompt, Stats } from '../types'

export function useStats(prompts: Prompt[]): Stats {
  return useMemo(() => {
    const active = prompts.filter(p => !p.isArchived)
    const favorites = active.filter(p => p.isFavorite).length
    const archived = prompts.filter(p => p.isArchived).length
    const totalUsage = prompts.reduce((sum, p) => sum + p.usageCount, 0)

    const mostUsed = [...prompts].sort((a, b) => b.usageCount - a.usageCount)[0] ?? null

    const recentlyUsed = [...prompts]
      .filter(p => p.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      .slice(0, 5)

    const byCategory: Record<string, number> = {}
    const byModel: Record<string, number> = {}

    for (const p of active) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
      byModel[p.model] = (byModel[p.model] ?? 0) + 1
    }

    return { total: active.length, favorites, archived, totalUsage, mostUsed, recentlyUsed, byCategory, byModel }
  }, [prompts])
}
