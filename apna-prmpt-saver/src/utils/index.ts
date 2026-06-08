import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const MODEL_COLORS: Record<string, string> = {
  ChatGPT: '#10a37f',
  Claude: '#d97706',
  Gemini: '#3b82f6',
  Cursor: '#8b5cf6',
  Perplexity: '#06b6d4',
  DeepSeek: '#ef4444',
  Grok: '#1d4ed8',
  Custom: '#6366f1',
}

export const FOLDER_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
]

export function exportAsCSV(prompts: { title: string; description: string; content: string; category: string; tags: string[]; model: string }[]): string {
  const header = 'title,description,content,category,tags,model\n'
  const rows = prompts.map(p =>
    [p.title, p.description, p.content, p.category, p.tags.join(';'), p.model]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  return header + rows.join('\n')
}

export function exportAsMarkdown(prompts: { title: string; description: string; content: string; category: string; tags: string[]; model: string }[]): string {
  return prompts.map(p =>
    `# ${p.title}\n\n**Category:** ${p.category} | **Model:** ${p.model}\n\n${p.description ? `> ${p.description}\n\n` : ''}\`\`\`\n${p.content}\n\`\`\`\n\n**Tags:** ${p.tags.map(t => `#${t}`).join(' ')}`
  ).join('\n\n---\n\n')
}
