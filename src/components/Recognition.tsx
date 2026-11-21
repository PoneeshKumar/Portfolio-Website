import { certifications, recognition } from '../data'
import { Reveal, SectionHeader } from './Reveal'

export function Recognition() {
  return (
    <section id="recognition">
      <SectionHeader index={4} kicker="Recognition" title="Awards & Certifications." intro="Awards and certifications spanning applied AI, quantitative finance, security, and data." />
      <Reveal>
        <div className="recognition-columns">
          <div className="recognition-list">
            <p className="mono-label">Awards</p>
            {recognition.map(([title, org, year]) => <div className="recognition-row" key={title}><strong>{title}</strong><span>{org}</span><time>{year}</time></div>)}
          </div>
          <div className="recognition-list">
            <p className="mono-label">Certifications</p>
            {certifications.map(([title, org]) => <div className="recognition-row" key={title}><strong>{title}</strong><span>{org}</span></div>)}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
