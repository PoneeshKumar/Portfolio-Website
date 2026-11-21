import { useEffect } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { profile } from './data'
import { sectionNodes } from './graph'
import { useRoute } from './hooks/useRoute'
import { useTheme } from './hooks/useTheme'
import { Brain } from './components/Brain'
import { Panel } from './components/Panel'

export default function App() {
  const { route, go } = useRoute()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (route.item) go(route.section, undefined)
      else if (route.section) go()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [route, go])

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app${route.section ? ' has-panel' : ''}`}>
        <div className="stage">
          <header className="topbar">
            <button className="home" onClick={() => go()} aria-label="Back to the map">{profile.name}</button>
            <nav className="toplinks" aria-label="Elsewhere">
              {profile.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}
              <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
              <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☀' : '☾'}</button>
            </nav>
          </header>

          <AnimatePresence>
            {!route.section && (
              <motion.div className="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.4 }}>
                <h1>{profile.name}</h1>
                <p>Quant dev intern at RBC GAM, studying CS + Finance at Waterloo. {profile.lede}</p>
                <p className="hint">
                  This is roughly how my head is wired. Poke around:{' '}
                  {sectionNodes.map((s, i) => (
                    <span key={s.id}>
                      <button onClick={() => go(s.id)}>{s.label}</button>
                      {i < sectionNodes.length - 2 ? ', ' : i === sectionNodes.length - 2 ? ' or ' : '.'}
                    </span>
                  ))}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Brain route={route} go={go} />
        </div>

        <AnimatePresence>{route.section && <Panel key="panel" route={route} go={go} />}</AnimatePresence>
      </div>
    </MotionConfig>
  )
}
