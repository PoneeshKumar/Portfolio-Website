import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { certifications, profile, projects, recognition, roles, skillGroups, type Role } from '../data'
import { contactLinks, sectionById, sectionNodes, slug, type SectionId } from '../graph'
import type { Route } from '../hooks/useRoute'

type Props = { route: Route; go: (section?: SectionId, item?: string) => void }
type RowProps = { id: string; selected?: string; onSelect: (id: string) => void; title: React.ReactNode; sub?: React.ReactNode; meta?: React.ReactNode; logo?: string; open?: boolean; children?: React.ReactNode }

function Row({ id, selected, onSelect, title, sub, meta, logo, open, children }: RowProps) {
  const isSelected = selected === id
  const expanded = open || isSelected
  return (
    <div id={`row-${id}`} className={`row${isSelected ? ' is-selected' : ''}`}>
      <button className="row-head" onClick={() => onSelect(id)} aria-expanded={children ? expanded : undefined}>
        {logo && <img src={logo} alt="" />}
        <span>
          <span className="row-title">{title}</span>
          {sub && <span className="row-sub">{sub}</span>}
        </span>
        {meta && <span className="row-meta">{meta}</span>}
      </button>
      <AnimatePresence initial={false}>
        {children && expanded && (
          <motion.div className="row-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="row-body-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Bullets = ({ items }: { items: string[] }) => (items.length ? <ul>{items.map((b) => <li key={b}>{b}</li>)}</ul> : null)

function RoleRow({ role, ...rest }: { role: Role; selected?: string; onSelect: (id: string) => void }) {
  return (
    <Row id={slug(role.short)} {...rest} logo={role.logo} title={role.title} sub={role.company} meta={<>{role.period}{role.current && <em> / now</em>}</>}>
      <p>{role.detail}</p>
      <Bullets items={role.bullets} />
    </Row>
  )
}

function Body({ section, selected, onSelect }: { section: SectionId; selected?: string; onSelect: (id: string) => void }) {
  const props = { selected, onSelect }
  switch (section) {
    case 'about':
      return (
        <>
          <p className="lead">{profile.lede}</p>
          <Row id="now" {...props} title="Now" sub={`${profile.now.role}, ${profile.now.org}`} open>
            <p>{roles[0].detail}</p>
          </Row>
          <Row id="waterloo" {...props} title={profile.education.school} sub={profile.education.degree} meta={profile.education.period} open>
            <p><strong>Coursework.</strong> {profile.education.coursework}</p>
            <p><strong>Clubs.</strong> {profile.education.clubs}</p>
          </Row>
          <Row id="focus" {...props} title="What I'm into right now" open>
            <Bullets items={profile.focus} />
          </Row>
        </>
      )
    case 'experience':
      return (
        <>
          {roles.filter((r) => !r.volunteer).map((r) => <RoleRow key={r.company} role={r} {...props} />)}
          <h3 className="subhead">Volunteer and clubs</h3>
          {roles.filter((r) => r.volunteer).map((r) => <RoleRow key={r.company} role={r} {...props} />)}
        </>
      )
    case 'projects':
      return projects.map((p) => (
        <Row key={p.slug} id={p.slug} {...props} title={p.title} sub={p.kind} meta={p.metric}>
          <p>{p.impact}</p>
          {p.highlights && <Bullets items={p.highlights} />}
          <p className="built">Built with {p.technologies.join(', ')}.</p>
          <p className="links">
            <a href={p.href} target="_blank" rel="noreferrer">Source ↗</a>
            {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
          </p>
        </Row>
      ))
    case 'stack':
      return skillGroups.map((g) => (
        <Row key={g.name} id={slug(g.name)} {...props} title={g.name} meta={`${g.items.length}`} open>
          <p className="stack-list">{g.items.map((t) => <span key={t.name}>{t.name}</span>)}</p>
        </Row>
      ))
    case 'recognition':
      return (
        <>
          {recognition.map(([title, org, year]) => <Row key={title} id={slug(title)} {...props} title={title} sub={org} meta={year} />)}
          <Row id="certifications" {...props} title="Certifications" meta={`${certifications.length}`} open>
            <ul>{certifications.map(([t, org]) => <li key={t}>{t} <span className="muted">/ {org}</span></li>)}</ul>
          </Row>
        </>
      )
    case 'contact':
      return contactLinks.map((l) => (
        <div key={l.id} id={`row-${l.id}`} className={`row${selected === l.id ? ' is-selected' : ''}`}>
          <a className="row-head" href={l.href} target={l.id === 'email' ? undefined : '_blank'} rel="noreferrer">
            <span>
              <span className="row-title">{l.label}</span>
              <span className="row-sub">{l.value}</span>
            </span>
            <span className="row-meta">↗</span>
          </a>
        </div>
      ))
  }
}

export function Panel({ route, go }: Props) {
  const node = sectionById(route.section)!
  const ref = useRef<HTMLElement>(null)
  const index = sectionNodes.indexOf(node)
  const prev = sectionNodes[(index + sectionNodes.length - 1) % sectionNodes.length]
  const next = sectionNodes[(index + 1) % sectionNodes.length]

  useEffect(() => {
    if (window.matchMedia('(max-width: 820px)').matches) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else ref.current?.scrollTo({ top: 0 })
  }, [node.id])

  useEffect(() => {
    if (route.item) document.getElementById(`row-${route.item}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [route.item])

  return (
    <motion.aside ref={ref} className="panel" aria-labelledby="panel-title" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
      <button className="panel-close" onClick={() => go()} aria-label="Close and return to the map">Close</button>
      <AnimatePresence mode="wait">
        <motion.div key={node.id} className="panel-inner" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <h2 id="panel-title">{node.label}</h2>
          <p className="panel-blurb">{node.blurb}</p>
          <Body section={node.id} selected={route.item} onSelect={(id) => go(node.id, route.item === id ? undefined : id)} />
          <nav className="panel-nav" aria-label="Other sections">
            <button onClick={() => go(prev.id)}>← {prev.label}</button>
            <button onClick={() => go(next.id)}>{next.label} →</button>
          </nav>
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  )
}
