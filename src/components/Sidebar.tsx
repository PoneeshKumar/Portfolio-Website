import { motion } from 'framer-motion'
import { profile, sections } from '../data'
import { useTheme } from '../hooks/useTheme'

export function Sidebar({ active }: { active: string }) {
  const { theme, toggle } = useTheme()

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <p className="kicker">{profile.school}</p>
        <h1 aria-label={profile.name}>
          {profile.name.split(' ').map((word, w) => (
            <span key={word} className="word">
              {word.split('').map((char, i) => (
                <span key={i} aria-hidden style={{ animationDelay: `${150 + (w * 8 + i) * 30}ms` }}>{char}</span>
              ))}
            </span>
          ))}
        </h1>
        <p className="now"><i aria-hidden />Now: {profile.now.role} <span>@ {profile.now.org}</span></p>
        <p className="lede">{profile.lede}</p>

        <div className="sidebar-actions">
          <a className="btn btn-primary" href="/resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
          <a className="btn" href={`mailto:${profile.email}`}>Email</a>
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

      <div className="sidebar-links">
        {profile.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </aside>
  )
}
