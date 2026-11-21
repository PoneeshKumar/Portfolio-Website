import { MotionConfig } from 'framer-motion'
import { sections } from './data'
import { useActiveSection } from './hooks/useActiveSection'
import { Sidebar } from './components/Sidebar'
import { ScrollProgress } from './components/ScrollProgress'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Recognition } from './components/Recognition'
import { Blogs } from './components/Blogs'

const sectionIds = sections.map((s) => s.id)

export default function App() {
  const active = useActiveSection(sectionIds)

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <div className="layout">
        <Sidebar active={active} />
        <main className="content">
          <Experience />
          <Projects />
          <Skills />
          <Recognition />
          <Blogs />
          <footer className="site-footer">
            <span>© 2026 Poneesh Kumar</span>
            <span>poneesh.kumar@uwaterloo.ca</span>
            <span>Built with React / TypeScript</span>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
