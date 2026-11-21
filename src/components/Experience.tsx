import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { roles } from '../data'
import { SectionHeader } from './Reveal'

const tabs = ['work', 'volunteer'] as const

export function Experience() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('work')
  const listRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const filtered = roles.filter((role) => (tab === 'volunteer' ? role.volunteer : !role.volunteer))

  return (
    <section id="work">
      <SectionHeader index={1} kicker="Track record" title="Experience." intro="Useful systems, carefully shipped." />

      <div className="tabs" role="tablist" aria-label="Experience type">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
            {tab === t && <motion.span layoutId="exp-tab" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span>{t}</span>
          </button>
        ))}
      </div>

      <div className="timeline" ref={listRef}>
        <div className="timeline-track" aria-hidden>
          <motion.div className="timeline-fill" style={{ scaleY: scrollYProgress }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {filtered.map((role) => (
              <article className={`role${role.bullets.length ? '' : ' is-compact'}`} key={`${role.title}-${role.company}`}>
                <span className="role-node" aria-hidden />
                <div className="role-logo">{role.logo && <img src={role.logo} alt={`${role.company} logo`} />}</div>
                <div className="role-body">
                  <time>{role.period}{role.current && <span className="badge">Now</span>}</time>
                  <h3>{role.title}</h3>
                  <p className="role-company">{role.company}{role.location ? ` / ${role.location}` : ''}</p>
                  <p>{role.detail}</p>
                  {role.bullets.length > 0 && <ul>{role.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
