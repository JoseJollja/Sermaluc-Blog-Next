import { create } from 'zustand'

export type Theme = 'light' | 'dark'

export interface ThemeStore {
  theme: Theme
  isDark: () => boolean
  toggleTheme: (theme?: Theme) => void
}

const useTheme = create<ThemeStore>((set, get) => ({
  theme: (localStorage.getItem('theme') as Theme) ?? 'light',
  isDark: () => get().theme === 'dark',
  toggleTheme: (theme) => {
    const _theme = theme ?? (get().isDark() ? 'light' : 'dark')

    localStorage.setItem('theme', _theme)
    document.body.className = _theme
    set({ theme: _theme })
  }
}))

export default useTheme
