import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import type { Prompt, Folder, AppSettings, AppStore, AIModel } from '../types'
import { StorageService } from '../services/storage'

type Action =
  | { type: 'LOAD'; payload: AppStore }
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: Prompt }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_CATEGORIES'; payload: string[] }
  | { type: 'SET_BACKUP'; payload: string }

const initialState: AppStore = {
  prompts: [],
  folders: [],
  settings: {
    theme: 'dark',
    accentColor: '#6366f1',
    fontSize: 'md',
    compactMode: false,
    autoBackup: false,
    backupFrequency: 'weekly',
    showFloatingWidget: true,
    defaultView: 'grid',
  },
  categories: ['ChatGPT','Claude','Gemini','Cursor','Coding','Marketing','SEO','Design','Writing','Business','Custom'],
  lastBackup: null,
}

function reducer(state: AppStore, action: Action): AppStore {
  switch (action.type) {
    case 'LOAD': return action.payload
    case 'ADD_PROMPT': return { ...state, prompts: [action.payload, ...state.prompts] }
    case 'UPDATE_PROMPT': return { ...state, prompts: state.prompts.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PROMPT': return { ...state, prompts: state.prompts.filter(p => p.id !== action.payload) }
    case 'ADD_FOLDER': return { ...state, folders: [...state.folders, action.payload] }
    case 'UPDATE_FOLDER': return { ...state, folders: state.folders.map(f => f.id === action.payload.id ? action.payload : f) }
    case 'DELETE_FOLDER': return { ...state, folders: state.folders.filter(f => f.id !== action.payload) }
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'UPDATE_CATEGORIES': return { ...state, categories: action.payload }
    case 'SET_BACKUP': return { ...state, lastBackup: action.payload }
    default: return state
  }
}

interface StoreContextValue {
  state: AppStore
  createPrompt: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>) => Promise<void>
  updatePrompt: (prompt: Prompt) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  duplicatePrompt: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  toggleArchive: (id: string) => Promise<void>
  incrementUsage: (id: string) => Promise<void>
  createFolder: (data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFolder: (folder: Folder) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>
  addCategory: (name: string) => Promise<void>
  deleteCategory: (name: string) => Promise<void>
  reload: () => Promise<void>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const reload = useCallback(async () => {
    const data = await StorageService.getAll()
    dispatch({ type: 'LOAD', payload: data })
  }, [])

  useEffect(() => { reload() }, [reload])

  const createPrompt = async (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>) => {
    const prompt: Prompt = {
      ...data,
      id: uuid(),
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_PROMPT', payload: prompt })
    await StorageService.savePrompt(prompt)
  }

  const updatePrompt = async (prompt: Prompt) => {
    const updated = { ...prompt, updatedAt: new Date().toISOString() }
    dispatch({ type: 'UPDATE_PROMPT', payload: updated })
    await StorageService.savePrompt(updated)
  }

  const deletePrompt = async (id: string) => {
    dispatch({ type: 'DELETE_PROMPT', payload: id })
    await StorageService.deletePrompt(id)
  }

  const duplicatePrompt = async (id: string) => {
    const original = state.prompts.find(p => p.id === id)
    if (!original) return
    await createPrompt({ ...original, title: `${original.title} (Copy)`, isFavorite: false })
  }

  const toggleFavorite = async (id: string) => {
    const prompt = state.prompts.find(p => p.id === id)
    if (!prompt) return
    await updatePrompt({ ...prompt, isFavorite: !prompt.isFavorite })
  }

  const toggleArchive = async (id: string) => {
    const prompt = state.prompts.find(p => p.id === id)
    if (!prompt) return
    await updatePrompt({ ...prompt, isArchived: !prompt.isArchived })
  }

  const incrementUsage = async (id: string) => {
    const prompt = state.prompts.find(p => p.id === id)
    if (!prompt) return
    await updatePrompt({ ...prompt, usageCount: prompt.usageCount + 1, lastUsed: new Date().toISOString() })
  }

  const createFolder = async (data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const folder: Folder = {
      ...data,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_FOLDER', payload: folder })
    await StorageService.saveFolder(folder)
  }

  const updateFolder = async (folder: Folder) => {
    const updated = { ...folder, updatedAt: new Date().toISOString() }
    dispatch({ type: 'UPDATE_FOLDER', payload: updated })
    await StorageService.saveFolder(updated)
  }

  const deleteFolder = async (id: string) => {
    dispatch({ type: 'DELETE_FOLDER', payload: id })
    await StorageService.deleteFolder(id)
  }

  const updateSettings = async (settings: Partial<AppSettings>) => {
    const updated = { ...state.settings, ...settings }
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    await StorageService.saveSettings(updated)
  }

  const addCategory = async (name: string) => {
    if (state.categories.includes(name)) return
    const updated = [...state.categories, name]
    dispatch({ type: 'UPDATE_CATEGORIES', payload: updated })
    await StorageService.saveCategories(updated)
  }

  const deleteCategory = async (name: string) => {
    const updated = state.categories.filter(c => c !== name)
    dispatch({ type: 'UPDATE_CATEGORIES', payload: updated })
    await StorageService.saveCategories(updated)
  }

  return (
    <StoreContext.Provider value={{
      state, createPrompt, updatePrompt, deletePrompt, duplicatePrompt,
      toggleFavorite, toggleArchive, incrementUsage,
      createFolder, updateFolder, deleteFolder,
      updateSettings, addCategory, deleteCategory, reload,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
