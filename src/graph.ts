import { certifications, profile, projects, recognition, roles, skillGroups } from './data'

export type SectionId = 'about' | 'experience' | 'projects' | 'stack' | 'recognition' | 'contact'
export type Pt = { x: number; y: number }
export type Item = { id: string; label: string }
export type SectionNode = Pt & { id: SectionId; label: string; blurb: string; items: Item[] }
export type SubNode = Pt & Item & { angle: number }

export const VIEW = { w: 1000, h: 700 }
const CORE: Pt = { x: 480, y: 330 }

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const contactLinks = [
  { id: 'email', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  ...profile.links.map((l) => ({ id: slug(l.label), label: l.label, value: l.href.replace(/^https:\/\/(www\.)?/, ''), href: l.href })),
  { id: 'resume', label: 'Resume', value: 'PDF, one page', href: '/resume.pdf' },
]

export const sectionNodes: SectionNode[] = [
  { id: 'about', label: 'About', ...CORE, blurb: 'Where it all connects.', items: [{ id: 'now', label: 'Now' }, { id: 'waterloo', label: 'Waterloo' }, { id: 'focus', label: 'Focus' }] },
  { id: 'experience', label: 'Experience', x: 395, y: 500, blurb: 'Where I have shipped production code.', items: roles.map((r) => ({ id: slug(r.short), label: r.short })) },
  { id: 'projects', label: 'Projects', x: 225, y: 285, blurb: 'Things I built to answer a specific question.', items: projects.map((p) => ({ id: p.slug, label: p.title })) },
  { id: 'stack', label: 'Stack', x: 565, y: 140, blurb: 'What I reach for, grouped the way I think about it.', items: skillGroups.map((g) => ({ id: slug(g.name), label: g.name })) },
  {
    id: 'recognition',
    label: 'Recognition',
    x: 795,
    y: 290,
    blurb: 'Awards and certifications.',
    items: [...recognition.map(([t]) => ({ id: slug(t), label: t.includes(' - ') ? t.split(' - ')[1] : t.replace(' of Distinction', '') })), { id: 'certifications', label: `${certifications.length} certifications` }],
  },
  { id: 'contact', label: 'Contact', x: 735, y: 548, blurb: 'The fastest way to reach me is email.', items: contactLinks.map(({ id, label }) => ({ id, label })) },
]

export const sectionById = (id?: string) => sectionNodes.find((s) => s.id === id)

function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
}
const inEllipse = (p: Pt, cx: number, cy: number, rx: number, ry: number) => ((p.x - cx) / rx) ** 2 + ((p.y - cy) / ry) ** 2 <= 1
const inBrain = (p: Pt) => inEllipse(p, 500, 318, 388, 248) || inEllipse(p, 722, 538, 138, 84) || inEllipse(p, 612, 606, 36, 82)
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

const rand = rng(7)
export const neurons: Pt[] = []
for (let tries = 0; tries < 6000 && neurons.length < 170; tries++) {
  const p = { x: 100 + rand() * 820, y: 60 + rand() * 640 }
  if (inBrain(p) && neurons.every((n) => dist(n, p) > 32) && sectionNodes.every((s) => dist(s, p) > 40)) neurons.push(p)
}

const edgeKeys = new Set<string>()
export const edges: [Pt, Pt][] = []
neurons.forEach((n, i) => {
  neurons
    .map((m, j) => ({ j, d: dist(n, m) }))
    .filter(({ j, d }) => j !== i && d < 78)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!edgeKeys.has(key)) edgeKeys.add(key) && edges.push([n, neurons[j]])
    })
})

export const sectionEdges = sectionNodes.flatMap((s) =>
  [...neurons].sort((a, b) => dist(a, s) - dist(b, s)).slice(0, 5).map((n) => ({ section: s.id, from: s as Pt, to: n })),
)

const curve = (a: Pt, b: Pt, bend: number) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const len = dist(a, b) || 1
  return `M${a.x} ${a.y} Q${mx - ((b.y - a.y) / len) * bend} ${my + ((b.x - a.x) / len) * bend} ${b.x} ${b.y}`
}

const ring: [SectionId, SectionId][] = [['projects', 'stack'], ['stack', 'recognition'], ['recognition', 'contact'], ['contact', 'experience'], ['experience', 'projects']]
export const pathways = [
  ...sectionNodes.filter((s) => s.id !== 'about').map((s) => ({ ends: ['about', s.id] as SectionId[], d: curve(CORE, s, 36) })),
  ...ring.map(([a, b]) => ({ ends: [a, b] as SectionId[], d: curve(sectionById(a)!, sectionById(b)!, -48) })),
]

export function subNodes(node: SectionNode): SubNode[] {
  const n = node.items.length
  const base = node.id === 'about' ? -Math.PI / 2 : Math.atan2(node.y - CORE.y, node.x - CORE.x)
  const spread = Math.min(Math.PI * 1.3, 0.55 * (n - 1))
  const r = n > 5 ? 136 : 106
  return node.items.map((item, i) => {
    const angle = n === 1 ? base : base - spread / 2 + (spread * i) / (n - 1)
    return { ...item, angle, x: node.x + r * Math.cos(angle), y: node.y + r * Math.sin(angle) }
  })
}

export function focusBox(node: SectionNode | undefined, zoom: number): [number, number, number, number] {
  if (!node) return [0, 0, VIEW.w, VIEW.h]
  const pts = [node as Pt, ...subNodes(node)]
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length
  const w = VIEW.w / zoom, h = VIEW.h / zoom
  return [cx - w / 2, cy - h / 2, w, h]
}
