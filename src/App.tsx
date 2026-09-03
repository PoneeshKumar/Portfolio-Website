import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import marbleLogo from './assets/marble.jpeg'
import netnowLogo from './assets/NetNow.avif'
import rbcLogo from './assets/RBC.jpeg'
import uwfintechLogo from './assets/uwfintechclub_logo.jpeg'
import uwmwmaLogo from './assets/uwwma.jpeg'
import uwfaLogo from './assets/UWFA.jpeg'
import watstreetLogo from './assets/WatStreet.jpeg'

type Project = { title: string; kind: string; year: string; impact: string; technologies: string[]; href: string }
type Role = { title: string; company: string; location?: string; period: string; logo?: string; detail: string; bullets: string[]; volunteer?: boolean }
type TechItem = { name: string; icon: string }


const techStack: TechItem[] = [
  { name: 'Python', icon: 'python' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'C++', icon: 'cplusplus' },
  { name: 'SQL', icon: 'postgresql' },
  { name: 'Neo4j', icon: 'neo4j' },
  { name: 'Redis', icon: 'redis' },
  { name: 'Kafka', icon: 'apachekafka' },
  { name: 'Docker', icon: 'docker' },
  { name: 'PyTorch', icon: 'pytorch' },
  { name: 'Scikit-learn', icon: 'scikitlearn' },
  { name: 'Pandas', icon: 'pandas' },
  { name: 'NumPy', icon: 'numpy' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'Django REST', icon: 'django' },
  { name: 'React', icon: 'react' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'MATLAB', icon: 'mathworks' },
  { name: 'Git', icon: 'git' },
  { name: 'Vite', icon: 'vite' },
  { name: 'Vercel', icon: 'vercel' },
]

const projects: Project[] = [
  {
    title: 'FlowGraph',
    kind: 'Real-Time Graph ML Fraud Engine',
    year: '2026',
    impact:
      'Processed 5.04M streaming payments through Kafka and Neo4j, using a 3-layer bidirectional GraphSAGE network to lift laundering detection PR-AUC from 0.057 to 0.735 at 0.99 ROC-AUC.',
    technologies: ['Neo4j', 'PyTorch', 'Kafka', 'Redis', 'PostgreSQL', 'FastAPI'],
    href: 'https://github.com/PoneeshKumar/FlowGraph',
  },
  { title: 'CreditLens', kind: 'Credit risk platform', year: '2026', impact: 'Scores financial-document deterioration across multiple fiscal years and flags high-risk issuers earlier.', technologies: ['Python', 'FastAPI', 'React', 'TypeScript'], href: 'https://github.com/PoneeshKumar/CreditRisk' },
  { title: 'Portfolio Advisor', kind: 'Systematic trading research', year: '2026', impact: 'Delivered a 25% annualized backtest across 70+ TSX and NYSE equities using momentum, RSI, and SMA signals.', technologies: ['Python', 'Pandas', 'SciPy', 'yFinance'], href: 'https://github.com/IanLeung12/CFM-Group-Project' },
  { title: 'Equity Dashboard', kind: 'Market data infrastructure', year: '2026', impact: 'Reduced API latency by 30% with multi-tier caching while tracking 5,000+ active equities and AI summaries.', technologies: ['Python', 'FastAPI', 'Polygon.io', 'Streamlit'], href: 'https://github.com/Bill-Cai-2005/Marble-Dashboard' },
  { title: 'CityScapes', kind: 'AI civic technology', year: '2026', impact: 'Won first place with a parcel-level planning tool that ranks heat risk, equity, and park access.', technologies: ['React', 'Mapbox', 'Claude 3.5', 'FastAPI'], href: 'https://github.com/tanvibatchu/CityScapes' },
]

const roles: Role[] = [
    {
    title: 'Quantitative Developer Intern',
    company: 'RBC Global Asset Management',
    location: 'Toronto, ON',
    period: 'Sep 2026 - Dec 2026',
    logo: rbcLogo,
    detail: 'Incoming quantitative developer working across research and engineering teams on production-grade financial systems, trading pipelines, and execution algorithms.',
    bullets: [],
  },
  {
    title: 'Software Engineering Intern',
    company: 'NetNow Financial',
    location: 'Toronto, ON',
    period: 'May 2026 - Aug 2026',
    logo: netnowLogo,
    detail: 'Agentic AI, full-stack product engineering, and automated credit workflows.',
    bullets: [
      'Increased operational efficiency by 20% by architecting a Python agentic AI workflow for high-priority credit applications with rule-based scoring and sentiment analysis on automated two-hour cycles.',
      'Served Gemma through vLLM inference endpoints for approximately 100k users, integrating NVIDIA NeMo Guardrails and Pydantic schemas to enforce safety and sub-second latency.',
      'Automated structured ETL extraction from PACER court filings with BrowserUse scrapers and schema-guided LLM parsing layers.',
      'Engineered asynchronous React.js and Django REST Framework features including multi-tenant hierarchy trees, telemetry dashboards, and audit logs.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Marble Investments',
    location: 'Waterloo, ON',
    period: 'Jan 2026 - Present',
    logo: marbleLogo,
    detail: 'Market-data infrastructure, feature engineering, and resilient portfolio reporting.',
    bullets: [
      'Slashed data pipeline ingestion latency by 80%, from five minutes to one minute, across 5,000+ global market feeds with ThreadPoolExecutor.',
      'Engineered NumPy and Polars feature extraction and validation pipelines for rolling covariance, volatility, and volume indicators.',
      'Ensured high availability and data integrity for a $2M AUM portfolio with resilient workers and SendGrid morning reporting.',
    ],
  },
  {
    title: 'ML Engineer',
    company: 'World Order Book (WatStreet)',
    location: 'Waterloo, ON',
    period: '2026 - Present',
    logo: watstreetLogo,
    detail: 'Reinforcement learning and execution research in a custom limit order book simulator.',
    bullets: [
      'Benchmarked Double Deep Q-Networks against classical execution algorithms and outperformed the benchmark by 5% on implementation shortfall.',
      'Optimized dynamic order routing with PyTorch agents and custom exponential epsilon-decay reward policies to minimize transaction costs.',
    ],
    volunteer: true,
  },
  {
    title: 'M&A Market Research Analyst',
    company: 'UW Finance Association',
    location: 'Waterloo, ON',
    period: 'Jan 2026 - May 2026',
    logo: uwfaLogo,
    detail: 'Identified acquisition opportunities through industry research, target screening, and comparable-company analysis.',
    bullets: [],
      volunteer: true,
  },
  {
    title: 'Financial Analyst',
    company: 'UW Wealth Management',
    location: 'Waterloo, ON',
    period: 'Feb 2026 - May 2026',
    logo: uwmwmaLogo,
    detail: 'Assessed valuation models for stock pitches and monitored portfolio holdings against benchmarks.',
    bullets: [],
    volunteer: true,
  },
  {
    title: 'Investment Analyst',
    company: 'UW Fintech Club',
    location: 'Waterloo, ON',
    period: 'Oct 2025 - May 2026',
    logo: uwfintechLogo,
    detail: 'Evaluated fintech companies across payments, lending, and wealth technology while building DCF models.',
     volunteer: true,
    bullets: [],
  },
]

const posts = [
  ['Designing a cache for market data', 'Notes on freshness, contention, and useful failure modes'],
  ['What makes a backtest believable?', 'A short checklist for avoiding accidental overfitting'],
  ['Building software for financial users', 'Why latency is only one part of the product'],
]

const recognition = [
  ['1st Place - Claude UWaterloo Hackathon', 'Anthropic / University of Waterloo', '2026'],
  ['Top 12 Finalist - Google Build with AI', 'Google / National Competition', '2026'],
  ['2nd Overall - CFM Group Project', 'University of Waterloo', '2026'],
  ['President\'s Scholarship of Distinction', 'University of Waterloo', '2025'],
]

const certifications = [
  ['AWS Fundamentals of Machine Learning and AI', 'Amazon Web Services'],
  ['Quantitative Finance & Algorithmic Trading in Python', 'Professional Certification'],
  ['Microsoft Security Essentials', 'Microsoft'],
  ['SQL for Finance Professionals', 'Corporate Finance Institute'],
]
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.18, delay }}>{children}</motion.div>
}

export default function App() {
  const [active, setActive] = useState('home')
  const [expTab, setExpTab] = useState<'work' | 'volunteer'>('work')
  const filteredRoles = roles.filter((role) => (expTab === 'volunteer' ? role.volunteer : !role.volunteer))
  
  useEffect(() => {
    const sections = ['home', 'work', 'projects', 'skills','recognition', 'blogs'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -65% 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="site-shell">
      <style>{`
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    margin-top: 14px;
  }
  .tech-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
  }
  .tech-item img {
    width: 18px;
    height: 18px;
    min-width: 18px;
    object-fit: contain;
    display: block;
  }
  .tech-item span {
    font-size: 0.78rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`}</style>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Poneesh Kumar home">PK<span>.</span></a>
        <nav className="site-nav" aria-label="Main navigation">
            {['home', 'work', 'projects', 'skills', 'recognition', 'blogs'].map((id) => <a key={id} className={active === id ? 'is-active' : ''} href={`#${id}`}>{id}</a>)}
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-rule">
          <div className="hero-index">01</div>
          <div className="hero-copy">
            <Reveal>
              <p className="kicker">Computing & Financial Management / University of Waterloo</p>
              <h1>Poneesh Kumar</h1>
              <p className="hero-lede">Building low-latency data tools and quantitative trading systems for fintech teams.</p>
              <div className="plain-links" aria-label="External links">
                <a href="https://github.com/PoneeshKumar" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
                <a href="https://www.linkedin.com/in/poneeshkumar" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
                <a href="mailto:poneesh.kumar@uwaterloo.ca">Email <span>↗</span></a>
              </div>
            </Reveal>
          </div>
          <aside className="hero-aside" aria-label="Current focus">
            <p className="mono-label">CURRENT FOCUS</p>
            <p>Market data infrastructure<br />Quantitative finance<br />Software Engineering</p>
          </aside>
        </section>
        <section id="work" className="section-rule contact-section">
          <div className="section-intro">
            <p className="kicker">02 / Track Record</p>
            <h2>Experience.</h2>
            <p>Useful systems, carefully shipped.</p>
          </div>

          <div className="toggle-wrapper">
            <div className="toggle-container">
              <button
                className={`toggle-btn ${expTab === 'work' ? 'is-active' : ''}`}
                onClick={() => setExpTab('work')}
              >
                Work
              </button>
              <button
                className={`toggle-btn ${expTab === 'volunteer' ? 'is-active' : ''}`}
                onClick={() => setExpTab('volunteer')}
              >
                Volunteer
              </button>
            </div>
          </div>

          <div className="experience-list">
            <AnimatePresence mode="wait">
              <motion.div
                key={expTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {filteredRoles.map((role) => (
                  <article
                    className={`experience-row${role.volunteer ? ' is-volunteer' : ''}`}
                    key={`${role.title}-${role.company}`}
                  >
                    <div className="experience-header">
                      {role.logo && (
                        <img
                          src={role.logo}
                          alt={`${role.company} logo`}
                          className="company-logo"
                        />
                      )}
                      <div>
                        <strong>{role.title}</strong>
                        <span>
                          {role.company}
                          {role.location ? ` / ${role.location}` : ''}
                        </span>
                        {role.volunteer ? <small>Volunteer</small> : null}
                      </div>
                    </div>
                    <time>{role.period}</time>
                    <div className="experience-detail">
                      <p>{role.detail}</p>
                      {role.bullets.length ? (
                        <ul>
                          {role.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        <section id="projects" className="section-rule">
          <div className="section-intro"><p className="kicker">03 / Selected work</p><h2>Projects.</h2><p>Technical, and built to answer a specific question.</p></div>
          <div className="project-list">
            {projects.map((project, index) => <Reveal key={project.title} delay={index * 0.025}><article className="project-row"><div className="project-number">0{index + 1}</div><div className="project-main"><div className="project-heading"><h3>{project.title}</h3><span>{project.kind}</span></div><p>{project.impact}</p><div className="tag-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div><div className="project-meta"><span>{project.year}</span><a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} source code`}>Code ↗</a></div></article></Reveal>)}
          </div>
        </section>

        <section id="skills" className="section-rule split-section">
          <div className="section-intro">
            <p className="kicker">04 / Tech Stack</p>
            <h2>Languages & Tools.</h2>
            <p>Frameworks, quantitative libraries, databases, and testing tools I use across production and research.</p>
          </div>
          <Reveal>
            <div className="tech-grid">
              {techStack.map((tech) => (
                <div className="tech-item" key={tech.name}>
                  <img
                    src={`https://cdn.simpleicons.org/${tech.icon}`}
                    alt={`${tech.name} icon`}
                    loading="lazy"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
        <section id="recognition" className="section-rule split-section">
          <div className="section-intro"><p className="kicker">06 / Recognition</p><h2>Awards & Certifications</h2><p>Awards and certifications spanning applied AI, quantitative finance, security, and data.</p></div>
          <div className="recognition-columns">
            <div className="recognition-list"><p className="mono-label">AWARDS</p>{recognition.map(([title, org, year]) => <div className="recognition-row" key={title}><strong>{title}</strong><span>{org}</span><time>{year}</time></div>)}</div>
            <div className="recognition-list"><p className="mono-label">CERTIFICATIONS</p>{certifications.map(([title, org]) => <div className="recognition-row" key={title}><strong>{title}</strong><span>{org}</span></div>)}</div>
          </div>
        </section>

        <section id="blogs" className="section-rule split-section">
          <div className="section-intro"><p className="kicker">07 / Blogs</p><h2>Small yap sessions from the build loop.</h2><p>Short technical writing, when the idea is clearer on paper.</p></div>
          <div className="notes-list">{posts.map(([title, description], index) => <a href="#contact" className="note-row" key={title}><span>0{index + 1}</span><strong>{title}</strong><em>{description}</em><b>↗</b></a>)}</div>
        </section>
      </main>

      <footer className="site-footer"><span>© 2026 Poneesh Kumar</span><span>Contact: poneesh.kumar@uwaterloo.ca</span><span>Built with React / TypeScript</span></footer>
    </div>
  )
}
