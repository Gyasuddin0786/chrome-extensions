export type AIModel =
  | 'ChatGPT'
  | 'Claude'
  | 'Gemini'
  | 'Cursor'
  | 'Perplexity'
  | 'DeepSeek'
  | 'Grok'
  | 'Custom'

export type PromptCategory =
  | 'ChatGPT'
  | 'Claude'
  | 'Gemini'
  | 'Cursor'
  | 'Coding'
  | 'Marketing'
  | 'SEO'
  | 'Design'
  | 'Writing'
  | 'Business'
  | 'Custom'

export interface Folder {
  id: string
  name: string
  color: string
  icon: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  model: AIModel
  folderId: string | null
  isFavorite: boolean
  isArchived: boolean
  usageCount: number
  lastUsed: string | null
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  accentColor: string
  fontSize: 'sm' | 'md' | 'lg'
  compactMode: boolean
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  showFloatingWidget: boolean
  defaultView: 'grid' | 'list'
}

export interface AppStore {
  prompts: Prompt[]
  folders: Folder[]
  settings: AppSettings
  categories: string[]
  lastBackup: string | null
}

export type ViewFilter = 'all' | 'favorites' | 'recent' | 'archived'

export interface SearchFilters {
  query: string
  category: string
  tags: string[]
  model: AIModel | ''
  folderId: string | null
}

export interface Stats {
  total: number
  favorites: number
  archived: number
  totalUsage: number
  mostUsed: Prompt | null
  recentlyUsed: Prompt[]
  byCategory: Record<string, number>
  byModel: Record<string, number>
}

export type ToastType = 'success' | 'error' | 'info'

export interface ContextMenuMessage {
  type: 'SAVE_SELECTION'
  text: string
  url: string
}

export interface BackgroundMessage {
  type: 'GET_PROMPTS' | 'SAVE_PROMPT' | 'DELETE_PROMPT' | 'OPEN_DASHBOARD'
  payload?: unknown
}
