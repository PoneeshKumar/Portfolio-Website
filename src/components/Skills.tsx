import { techStack } from '../data'
import { Reveal, SectionHeader } from './Reveal'

export function Skills() {
  return (
    <section id="skills">
      <SectionHeader index={3} kicker="Tech stack" title="Languages & Tools." intro="Frameworks, quantitative libraries, databases, and testing tools I use across production and research." />
      <Reveal>
        <div className="tech-grid">
          {techStack.map((tech) => (
            <div className="tech-item" key={tech.name}>
              <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt="" loading="lazy" onError={(e) => ((e.target as HTMLElement).style.display = 'none')} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
