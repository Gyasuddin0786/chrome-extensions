import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Prompt, SearchFilters } from '../types'

export function useSearch(prompts: Prompt[], filters: SearchFilters) {
  const fuse = useMemo(
    () =>
      new Fuse(prompts, {
        keys: ['title', 'description', 'content', 'tags', 'category'],
        threshold: 0.3,
        includeMatches: true,
      }),
    [prompts]
  )

  return useMemo(() => {
    let results = prompts

    if (filters.query.trim()) {
      results = fuse.search(filters.query).map((r) => r.item)
    }

    if (filters.category) {
      results = results.filter((p) => p.category === filters.category)
    }

    if (filters.model) {
      results = results.filter((p) => p.model === filters.model)
    }

    if (filters.tags.length > 0) {
      results = results.filter((p) =>
        filters.tags.every((tag) => p.tags.includes(tag))
      )
    }

    if (filters.folderId !== null) {
      results = results.filter((p) => p.folderId === filters.folderId)
    }

    return results
  }, [prompts, fuse, filters])
}
