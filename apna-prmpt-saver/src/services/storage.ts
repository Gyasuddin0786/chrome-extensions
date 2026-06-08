import type { AppStore, Prompt, Folder, AppSettings } from '../types'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#6366f1',
  fontSize: 'md',
  compactMode: false,
  autoBackup: false,
  backupFrequency: 'weekly',
  showFloatingWidget: true,
  defaultView: 'grid',
}

const DEFAULT_CATEGORIES = [
  'ChatGPT', 'Claude', 'Gemini', 'Cursor',
  'Coding', 'Marketing', 'SEO', 'Design',
  'Writing', 'Business', 'Custom',
]

const DEFAULT_STORE: AppStore = {
  prompts: [],
  folders: [],
  settings: DEFAULT_SETTINGS,
  categories: DEFAULT_CATEGORIES,
  lastBackup: null,
}

function getStorage(): Promise<AppStore> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('promptvault', (result) => {
        resolve({ ...DEFAULT_STORE, ...result.promptvault })
      })
    } else {
      const raw = localStorage.getItem('promptvault')
      resolve(raw ? { ...DEFAULT_STORE, ...JSON.parse(raw) } : DEFAULT_STORE)
    }
  })
}

function setStorage(data: Partial<AppStore>): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('promptvault', (result) => {
        const merged = { ...DEFAULT_STORE, ...result.promptvault, ...data }
        chrome.storage.local.set({ promptvault: merged }, resolve)
      })
    } else {
      const raw = localStorage.getItem('promptvault')
      const existing = raw ? JSON.parse(raw) : DEFAULT_STORE
      localStorage.setItem('promptvault', JSON.stringify({ ...existing, ...data }))
      resolve()
    }
  })
}

export const StorageService = {
  getAll: getStorage,

  async getPrompts(): Promise<Prompt[]> {
    const store = await getStorage()
    return store.prompts
  },

  async savePrompt(prompt: Prompt): Promise<void> {
    const store = await getStorage()
    const idx = store.prompts.findIndex((p) => p.id === prompt.id)
    if (idx >= 0) store.prompts[idx] = prompt
    else store.prompts.unshift(prompt)
    await setStorage({ prompts: store.prompts })
  },

  async deletePrompt(id: string): Promise<void> {
    const store = await getStorage()
    await setStorage({ prompts: store.prompts.filter((p) => p.id !== id) })
  },

  async getFolders(): Promise<Folder[]> {
    const store = await getStorage()
    return store.folders
  },

  async saveFolder(folder: Folder): Promise<void> {
    const store = await getStorage()
    const idx = store.folders.findIndex((f) => f.id === folder.id)
    if (idx >= 0) store.folders[idx] = folder
    else store.folders.push(folder)
    await setStorage({ folders: store.folders })
  },

  async deleteFolder(id: string): Promise<void> {
    const store = await getStorage()
    await setStorage({ folders: store.folders.filter((f) => f.id !== id) })
  },

  async getSettings(): Promise<AppSettings> {
    const store = await getStorage()
    return store.settings
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await setStorage({ settings })
  },

  async getCategories(): Promise<string[]> {
    const store = await getStorage()
    return store.categories
  },

  async saveCategories(categories: string[]): Promise<void> {
    await setStorage({ categories })
  },

  async exportData(): Promise<string> {
    const store = await getStorage()
    return JSON.stringify(store, null, 2)
  },

  async importData(json: string): Promise<void> {
    const data = JSON.parse(json) as Partial<AppStore>
    await setStorage(data)
  },

  async createBackup(): Promise<void> {
    const data = await StorageService.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `promptvault-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    await setStorage({ lastBackup: new Date().toISOString() })
  },
}
