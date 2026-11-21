import { useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) ?? 'light')

  const apply = (next: Theme) => {
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
    flushSync(() => setTheme(next))
  }

  const toggle = (event: React.MouseEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) return apply(next)
    const root = document.documentElement.style
    root.setProperty('--vt-x', `${event.clientX}px`)
    root.setProperty('--vt-y', `${event.clientY}px`)
    document.startViewTransition(() => apply(next))
  }

  return { theme, toggle }
}
