import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects, type Project } from '../data'
import { Reveal, SectionHeader } from './Reveal'

const spring = { type: 'spring', stiffness: 380, damping: 38 } as const

function Tags({ items }: { items: string[] }) {
  return <div className="tag-list">{items.map((t) => <span key={t}>{t}</span>)}</div>
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <motion.div className="backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <div className="detail-wrap">
        <motion.div layoutId={`project-${project.title}`} transition={spring} className="project-detail" style={{ borderRadius: 18 }} role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }}>
            <div className="detail-head">
              <span className="kicker">{project.kind} / {project.year}</span>
              <button ref={closeRef} className="detail-close" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <h3 id="detail-title">{project.title}</h3>
            {project.metric && <p className="metric">{project.metric}</p>}
            <p>{project.impact}</p>
            {project.highlights && <ul className="detail-highlights">{project.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
            <Tags items={project.technologies} />
            <div className="detail-actions">
              <a className="btn btn-primary" href={project.href} target="_blank" rel="noreferrer">View source ↗</a>
              {project.demo && <a className="btn" href={project.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(() => projects.find((p) => `#project-${p.slug}` === window.location.hash) ?? null)

  const open = (project: Project) => {
    history.replaceState(null, '', `#project-${project.slug}`)
    setSelected(project)
  }
  const close = useCallback(() => {
    history.replaceState(null, '', '#projects')
    setSelected(null)
  }, [])

  return (
    <section id="projects">
      <SectionHeader index={2} kicker="Selected work" title="Projects." intro="Technical, and built to answer a specific question. Click one to open it." />
      <div className="project-list">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.04}>
            <motion.div
              layoutId={`project-${project.title}`}
              transition={spring}
              className="project-row"
              style={{ borderRadius: 10 }}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={() => open(project)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(project))}
            >
              <span className="project-number">{String(i + 1).padStart(2, '0')}</span>
              <div className="project-main">
                <div className="project-heading"><h3>{project.title}</h3><span>{project.kind}</span></div>
                {project.metric && <p className="metric">{project.metric}</p>}
                <Tags items={project.technologies} />
              </div>
              <span className="project-open" aria-hidden>+</span>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{selected && <ProjectDetail key={selected.title} project={selected} onClose={close} />}</AnimatePresence>
    </section>
  )
}
