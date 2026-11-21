import { AnimatePresence, motion } from 'framer-motion'
import { sections } from '../data'
import { useTheme } from '../hooks/useTheme'

const NAME = 'Poneesh Kumar'

export function Sidebar({ active }: { active: string }) {
  const { theme, toggle } = useTheme()
  const current = sections.find((s) => s.id === active) ?? sections[0]

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <p className="kicker">Computing & Financial Management / University of Waterloo</p>
        <h1 aria-label={NAME}>
          {NAME.split(' ').map((word, w) => (
            <span key={word} className="word">
              {word.split('').map((char, i) => (
                <span key={i} aria-hidden style={{ animationDelay: `${150 + (w * 8 + i) * 30}ms` }}>{char}</span>
              ))}
            </span>
          ))}
        </h1>
        <p className="lede">Building low-latency data tools and quantitative trading systems for fintech teams.</p>

        <div className="sidebar-actions">
          <a className="btn btn-primary" href="/resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
          <a className="btn" href="mailto:poneesh.kumar@uwaterloo.ca">Email</a>
        </div>
      </div>

      <nav className="side-nav" aria-label="Sections">
        {sections.map((section, i) => (
          <a key={section.id} href={`#${section.id}`} className={active === section.id ? 'is-active' : ''} aria-current={active === section.id ? 'true' : undefined}>
            {active === section.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span className="nav-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="nav-label">{section.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="subtitle" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <span>{current.label}</span> {current.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="sidebar-links">
          <a href="https://github.com/PoneeshKumar" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/poneeshkumar" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </aside>
  )
}
