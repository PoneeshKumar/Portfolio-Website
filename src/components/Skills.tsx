import { skillGroups } from '../data'
import { Reveal, SectionHeader } from './Reveal'

export function Skills() {
  return (
    <section id="skills">
      <SectionHeader index={3} kicker="Tech stack" title="Languages & Tools." intro="What I reach for across research, production pipelines and LLM infrastructure." />
      <div className="skill-groups">
        {skillGroups.map((group, g) => (
          <Reveal key={group.name} delay={g * 0.04}>
            <div className="skill-group">
              <p className="mono-label">{group.name}</p>
              <div className="chips">
                {group.items.map((tech) => (
                  <span className="chip" key={tech.name}>
                    {tech.icon && <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt="" loading="lazy" onError={(e) => ((e.target as HTMLElement).style.display = 'none')} />}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
