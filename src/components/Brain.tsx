import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { edges, focusBox, neurons, pathways, sectionById, sectionEdges, sectionNodes, subNodes, type SectionId } from '../graph'
import type { Route } from '../hooks/useRoute'

type Props = { route: Route; go: (section?: SectionId, item?: string) => void }

const onKey = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    fn()
  }
}

function useViewBox(target: number[], instant: boolean) {
  const values = [useMotionValue(target[0]), useMotionValue(target[1]), useMotionValue(target[2]), useMotionValue(target[3])]
  useEffect(() => {
    const controls = values.map((v, i) => animate(v, target[i], instant ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 20 }))
    return () => controls.forEach((c) => c.stop())
  }, [target.join(' '), instant])
  return useTransform(values, (v) => v.join(' '))
}

export function Brain({ route, go }: Props) {
  const reduce = useReducedMotion() ?? false
  const [hover, setHover] = useState<SectionId | null>(null)
  const open = sectionById(route.section)
  const viewBox = useViewBox(focusBox(open, open ? 1.65 : 1), reduce)
  const hot = (id: SectionId) => id === hover || id === open?.id

  return (
    <motion.svg className={`brain${open ? ' is-zoomed' : ''}`} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Map of sections">
      <g className="mesh" aria-hidden>
        {edges.map(([a, b], i) => <line key={i} className="edge" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />)}
        {sectionEdges.map((e, i) => <line key={`s${i}`} className={`edge${hot(e.section) ? ' is-hot' : ''}`} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} />)}
        {neurons.map((n, i) => <circle key={i} className="neuron" cx={n.x} cy={n.y} r={i % 5 === 0 ? 2.6 : 1.7} />)}
      </g>

      <g aria-hidden>
        {pathways.map((p, i) => (
          <g key={i}>
            <path className={`pathway${p.ends.some(hot) ? ' is-hot' : ''}`} d={p.d} />
            {!reduce && (
              <circle className="signal" r={2.8}>
                <animateMotion dur={`${2.6 + (i % 4) * 0.6}s`} begin={`${(i * 0.53) % 3}s`} repeatCount="indefinite" path={p.d} keyPoints={i % 2 ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear" />
              </circle>
            )}
          </g>
        ))}
      </g>

      {open && (
        <g key={open.id}>
          {subNodes(open).map((sub, i) => {
            const selected = route.item === sub.id
            const c = Math.cos(sub.angle)
            const anchor = c > 0.12 ? 'start' : c < -0.12 ? 'end' : 'middle'
            const lx = sub.x + 12 * c, ly = sub.y + 12 * Math.sin(sub.angle) + (anchor === 'middle' ? (Math.sin(sub.angle) > 0 ? 10 : -4) : 4)
            const toggle = () => go(open.id, selected ? undefined : sub.id)
            return (
              <g key={sub.id}>
                <path className="sub-link" pathLength={1} d={`M${open.x} ${open.y} L${sub.x} ${sub.y}`} style={{ animationDelay: `${250 + i * 50}ms` }} />
                <g className={`sub${selected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-label={sub.label} aria-pressed={selected} onClick={toggle} onKeyDown={onKey(toggle)} style={{ animationDelay: `${450 + i * 50}ms` }}>
                  <circle className="sub-hit" cx={sub.x} cy={sub.y} r={14} />
                  <circle className="sub-dot" cx={sub.x} cy={sub.y} r={selected ? 6 : 4.5} />
                  <text x={lx} y={ly} textAnchor={anchor}>{sub.label}</text>
                </g>
              </g>
            )
          })}
        </g>
      )}

      {sectionNodes.map((node) => {
        const active = node.id === open?.id
        return (
          <g
            key={node.id}
            className={`snode${active ? ' is-active' : ''}${hot(node.id) ? ' is-hot' : ''}`}
            transform={`translate(${node.x} ${node.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${node.label}: ${node.blurb}`}
            aria-pressed={active}
            onClick={() => go(node.id)}
            onKeyDown={onKey(() => go(node.id))}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(node.id)}
            onBlur={() => setHover(null)}
          >
            <circle className="snode-halo" r={24} />
            <circle className="snode-core" r={node.id === 'about' ? 10 : 7.5} />
            <text className="snode-label" y={-34} textAnchor="middle">{node.label}</text>
          </g>
        )
      })}
    </motion.svg>
  )
}
