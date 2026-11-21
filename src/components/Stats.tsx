import { profile } from '../data'
import { Reveal } from './Reveal'

export function Stats() {
  return (
    <Reveal>
      <dl className="stats" aria-label="At a glance">
        {profile.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
