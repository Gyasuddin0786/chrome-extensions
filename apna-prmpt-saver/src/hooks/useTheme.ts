import { useEffect } from 'react'
import { useStore } from '../store'

export function useTheme() {
  const { state, updateSettings } = useStore()
  const { theme } = state.settings

  useEffect(() => {
    const root = document.documentElement
    const apply = (t: typeof theme) => {
      if (t === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', isDark)
        root.style.colorScheme = isDark ? 'dark' : 'light'
      } else {
        root.classList.toggle('dark', t === 'dark')
        root.style.colorScheme = t
      }
      // Force body background via CSS var
      document.body.style.backgroundColor = 'var(--bg-base)'
      document.body.style.color = 'var(--text-primary)'
    }
    apply(theme)
    // Also listen for system changes when mode is 'system'
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = (t: 'dark' | 'light' | 'system') => updateSettings({ theme: t })

  return { theme, setTheme }
}
