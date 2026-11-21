import { posts } from '../data'
import { Reveal, SectionHeader } from './Reveal'

export function Blogs() {
  return (
    <section id="blogs">
      <SectionHeader index={5} kicker="Writing" title="Small yap sessions from the build loop." intro="Short writings with sources that indicate my thoughts on stuff thats going on in tech lately." />
      <Reveal>
        <ul className="notes-list">
          {posts.map(([title, description], i) => (
            <li className="note-row" key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
              <em>{description}</em>
              <small>Soon</small>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
