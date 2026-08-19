import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

// ==========================================
// Types & Schema
// ==========================================

type Project = {
  title: string
  category: string
  year: string
  summary: string
  stack: string[]
  link?: string
}

type Experience = {
  role: string
  org: string
  location?: string
  period: string
  bullets: string[]
  volunteer?: boolean
}

type Recognition = {
  title: string
  org: string
  year: string
  description: string
}

// ==========================================
// Static & Config Data
// ==========================================

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'quote', label: 'Quote' },
  { id: 'contact', label: 'Contact' },
]

const STATS = [
  { value: '25%', label: 'Annualized returns' },
  { value: '5K+', label: 'Equities tracked' },
  { value: '1st', label: 'Hackathon finish' },
]

const PROJECTS: Project[] = [
  {
    title: 'CreditLens',
    category: 'Finance / SaaS',
    year: '2026',
    summary:
      'A credit-risk platform that parses multi-year financial documents, scores deterioration, and surfaces the highest-signal risks before they become obvious.',
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Supabase'],
    link: 'https://github.com/PoneeshKumar/CreditRisk',
  },
  {
    title: 'CityScapes',
    category: 'AI / Civic Tech',
    year: '2026',
    summary:
      'An AI urban-planning tool built for hackathon judging that scores land parcels by heat risk, equity, and park access with a strong visual narrative.',
    stack: ['Claude 3.5', 'Mapbox', 'React', 'FastAPI'],
    link: 'https://github.com/tanvibatchu/CityScapes',
  },
  {
    title: 'ArtiCue',
    category: 'Product / AI',
    year: '2026',
    summary:
      'A speech-therapy platform that blends voice, retrieval, and product design into a polished experience for faster, more accessible care.',
    stack: ['Next.js', 'Gemini 2.5', 'ElevenLabs', 'Firebase'],
    link: 'https://github.com/tanvibatchu/articue',
  },
]
const EXPERIENCE: Experience[] = [
    {
    role: 'Quantitative Developer Intern',
    org: 'RBC Global Asset Management',
    location: 'Toronto, ON',
    period: 'Sep 2026 - Dec 2026',
    bullets: [
      'Incoming quantitative developer intern collaborating across quantitative research and engineering teams.',
      'Set to help construct production-grade financial systems, optimize trading pipelines, and implement execution algorithms.',
    ],
  },
  {
    role: 'Software Engineering Intern',
    org: 'NetNow Financial',
    location: 'Toronto, ON',
    period: 'May 2026 - Aug 2026',
    bullets: [
      'Increased operational efficiency by 20% by architecting a Python agentic AI workflow to evaluate high-priority credit applications with rule-based scoring and sentiment analysis on automated two-hour cycles.',
      'Served Gemma through vLLM inference endpoints for approximately 100k users, integrating NVIDIA NeMo Guardrails and Pydantic validation schemas to eliminate hallucinations, enforce safety, and ensure sub-second latency.',
      'Automated structured ETL extraction from PACER court filings with BrowserUse scrapers and schema-guided LLM parsing layers.',
      'Engineered asynchronous React.js and Django REST Framework features including multi-tenant hierarchy trees, telemetry dashboards, and audit logs.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Marble Investments',
    location: 'Waterloo, ON',
    period: 'Jan 2026 - Present',
    bullets: [
      'Slashed data pipeline ingestion latency by 80%, from five minutes to one minute, across 5,000+ global market feeds using Python ThreadPoolExecutor pipelines.',
      'Engineered NumPy and Polars feature extraction and validation pipelines to normalize high-volume datasets and compute rolling covariance, volatility, and volume indicators.',
      'Ensured high availability and data integrity for a $2M AUM portfolio with resilient background workers and SendGrid morning reporting.',
    ],
  },
  {
    role: 'ML Engineer',
    org: 'World Order Book (WatStreet)',
    location: 'Waterloo, ON',
    period: 'May 2026 - Present',
    bullets: [
      'Evaluated algorithmic execution quality and implementation shortfall by benchmarking DDQN against classical execution algorithms, outperforming the benchmark by 5%.',
      'Optimized dynamic order routing by training PyTorch reinforcement learning agents with custom exponential epsilon-decay reward policies to minimize transaction costs.',
    ],
    volunteer: true,
  },
  {
    role: 'M&A Market Research Analyst',
    org: 'UW Finance Association',
    location: 'Waterloo, ON',
    period: 'Jan 2026 - May 2026',
    bullets: [
      'Identified acquisition opportunities through industry research, target screening, and comparable-company analysis.',
    ],
    volunteer: true,
  },
  {
    role: 'Financial Analyst',
    org: 'UW Wealth Management',
    location: 'Waterloo, ON',
    period: 'Feb 2026 - May 2026',
    bullets: [
      'Assessed valuation models for stock pitches and monitored portfolio holdings against benchmarks.',
    ],
    volunteer: true,
  },
  {
    role: 'Investment Analyst',
    org: 'UW Fintech Club',
    location: 'Waterloo, ON',
    period: 'Oct 2025 - May 2026',
    bullets: [
      'Evaluated fintech companies across payments, lending, and wealth technology while building DCF models.',
    ],
    volunteer: true,
  },
]

const RECOGNITION: Recognition[] = [
  { title: '1st Place - Claude UWaterloo Hackathon', org: 'Anthropic / University of Waterloo', year: '2026', description: 'Won top prize for CityScapes, an AI urban planning tool focused on environmental equity.' },
  { title: 'Top 12 Finalist - Google Build with AI', org: 'Google / National Competition', year: '2026', description: 'Top 1.5% of 800+ competitors for ArtiCue with direct mentorship from Google engineers.' },
  { title: '2nd Overall - CFM Group Project', org: 'University of Waterloo', year: '2026', description: 'Highest-ranking systematic trading algorithm in the CFM cohort.' },
  { title: "President's Scholarship of Distinction", org: 'University of Waterloo', year: '2025', description: 'Awarded for an admission average over 95%.' },
]

const CERTIFICATIONS: Recognition[] = [
  { title: 'AWS Fundamentals of Machine Learning and AI', org: 'Amazon Web Services', year: '2026', description: 'Training in AWS ML services and AI/ML fundamentals.' },
  { title: 'Quantitative Finance & Algorithmic Trading in Python', org: 'Professional Certification', year: '2026', description: 'Advanced quantitative finance and algorithmic trading strategies.' },
  { title: 'Microsoft Security Essentials', org: 'Microsoft', year: '2026', description: 'Security fundamentals and AI-powered protection mechanisms.' },
  { title: 'SQL for Finance Professionals', org: 'Corporate Finance Institute', year: '2026', description: 'Advanced SQL skills for financial data analysis.' },
]

const SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'FastAPI',
  'Python',
  'PostgreSQL',
  'Supabase',
  'Firebase',
  'Mapbox',
  'Docker',
  'Vercel',
  'Pandas',
]

// ==========================================
// Interactive Sub-components
// ==========================================

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MagneticCard({ children, intensity = 0.22 }: { children: React.ReactNode; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16 })
  const sy = useSpring(y, { stiffness: 180, damping: 16 })

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect()
        if (!bounds) return
        x.set((event.clientX - bounds.left - bounds.width / 2) * intensity)
        y.set((event.clientY - bounds.top - bounds.height / 2) * intensity)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

// ==========================================
// Main Application Component
// ==========================================

export default function App() {
  const [activeNav, setActiveNav] = useState('home')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Dynamically compute categorized experience groups
  const experienceGroups = useMemo(() => {
    return [
      {
        title: 'Professional Experience',
        items: EXPERIENCE.filter((e) => !e.volunteer),
      },
      {
        title: 'Leadership & Research Organizations',
        items: EXPERIENCE.filter((e) => e.volunteer),
      },
    ]
  }, [])

  // Filter projects dynamically if a stack tag is active
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return PROJECTS
    return PROJECTS.filter((p) => p.stack.includes(selectedTag))
  }, [selectedTag])

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveNav(visible.target.id)
      },
      { threshold: [0.2, 0.4, 0.6] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        :root {
          color-scheme: light;
          --bg: #f4efe8;
          --surface: rgba(255, 255, 255, 0.68);
          --surface-strong: rgba(255, 255, 255, 0.88);
          --text: #101820;
          --muted: rgba(16, 24, 32, 0.68);
          --line: rgba(16, 24, 32, 0.1);
          --line-strong: rgba(16, 24, 32, 0.16);
          --accent: #a86d22;
          --accent-2: #24527a;
          --shadow: 0 24px 70px rgba(27, 31, 38, 0.08);
        }

        html { scroll-behavior: smooth; }
        html, body, #root { min-height: 100%; }
        body {
          margin: 0;
          font-family: 'Manrope', sans-serif;
          background: radial-gradient(circle at top left, rgba(168,109,34,0.14), transparent 36%),
                      radial-gradient(circle at 80% 15%, rgba(36,82,122,0.13), transparent 34%),
                      linear-gradient(180deg, #f7f2ea 0%, #efe7dc 100%);
          color: var(--text);
          overflow-x: hidden;
        }

        * { box-sizing: border-box; }
        a { color: inherit; text-decoration: none; }

        .app { position: relative; overflow: hidden; }
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image: radial-gradient(rgba(16,24,32,0.18) 0.5px, transparent 0.5px);
          background-size: 5px 5px;
          mix-blend-mode: multiply;
        }

        .blob {
          position: fixed;
          width: 36vw;
          height: 36vw;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          pointer-events: none;
          animation: drift 14s ease-in-out infinite alternate;
        }

        .blob.a { top: -12vw; left: -12vw; background: rgba(168,109,34,0.18); }
        .blob.b { top: 10vh; right: -10vw; background: rgba(36,82,122,0.16); animation-duration: 18s; }

        @keyframes drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(18px, -12px, 0) scale(1.06); }
        }

        .shell {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .topbar {
          position: sticky;
          top: 18px;
          z-index: 20;
          margin-top: 18px;
          padding: 14px 18px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(18px);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(168,109,34,0.95), rgba(36,82,122,0.95));
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }

        .nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .nav a {
          padding: 8px 12px;
          border-radius: 999px;
          color: var(--muted);
          border: 1px solid transparent;
          font-size: 0.77rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease;
        }

        .nav a:hover, .nav a.active {
          color: var(--text);
          background: rgba(255, 255, 255, 0.86);
          border-color: var(--line);
          transform: translateY(-1px);
        }

        section { padding: 92px 0; }

        .hero {
          min-height: calc(100vh - 120px);
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 44px;
          padding-top: 48px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 700;
        }

        .eyebrow::before {
          content: '';
          width: 18px;
          height: 1px;
          background: currentColor;
          opacity: 0.8;
        }

        .hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 7vw, 5.8rem);
          line-height: 0.94;
          letter-spacing: -0.05em;
          margin: 18px 0 18px;
          max-width: 10ch;
        }

        .hero p {
          max-width: 62ch;
          font-size: 1.02rem;
          line-height: 1.8;
          color: var(--muted);
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .button {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          border-radius: 999px;
          border: 1px solid var(--line-strong);
          background: rgba(255,255,255,0.66);
          color: var(--text);
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 12px 36px rgba(16, 24, 32, 0.06);
        }

        .button.primary {
          background: linear-gradient(135deg, rgba(168,109,34,0.98), rgba(198,146,74,0.98));
          color: white;
          border-color: transparent;
        }

        .button:hover {
          transform: translateY(-2px);
          border-color: rgba(16,24,32,0.18);
        }

        .hero-panel {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 28px;
          padding: 28px;
          background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.58));
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .hero-panel::before {
          content: '';
          position: absolute;
          inset: -30%;
          background: radial-gradient(circle, rgba(168,109,34,0.12), transparent 55%);
          animation: pulse 10s ease-in-out infinite alternate;
        }

        @keyframes pulse {
          from { transform: scale(0.96); opacity: 0.7; }
          to { transform: scale(1.04); opacity: 1; }
        }

        .panel-grid {
          position: relative;
          display: grid;
          gap: 14px;
        }

        .glass {
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.72);
          border-radius: 22px;
          padding: 18px;
          backdrop-filter: blur(14px);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 28px;
        }

        .stat strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.65rem;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat span {
          color: var(--muted);
          font-size: 0.76rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .section-head {
          max-width: 760px;
          margin-bottom: 28px;
        }

        .section-head h2 {
          margin: 10px 0 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .section-head p {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.75;
          max-width: 64ch;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .card {
          border: 1px solid var(--line);
          background: var(--surface);
          border-radius: 24px;
          padding: 22px;
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 45px rgba(16,24,32,0.06);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .card:hover {
          border-color: rgba(168,109,34,0.24);
          background: var(--surface-strong);
        }

        .meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .card h3 {
          margin: 14px 0 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          line-height: 1.2;
        }

        .card p { margin: 0; color: var(--muted); line-height: 1.75; }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .chip {
          cursor: pointer;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.8);
          border: 1px solid var(--line);
          font-size: 0.72rem;
          color: var(--text);
          transition: all 160ms ease;
        }

        .chip.active, .chip:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        .filter-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          margin-bottom: 20px;
          background: rgba(168,109,34,0.08);
          border: 1px solid rgba(168,109,34,0.2);
          border-radius: 12px;
          font-size: 0.82rem;
        }

        .clear-btn {
          cursor: pointer;
          background: none;
          border: none;
          color: var(--accent);
          font-weight: 600;
          text-decoration: underline;
        }

        .timeline {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .experience-groups {
          display: grid;
          gap: 54px;
        }

        .experience-group-title {
          margin-bottom: 18px;
          color: var(--accent);
          font-family: 'Space Grotesk', monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .timeline-item {
          border-left: 2px solid rgba(168,109,34,0.35);
          padding-left: 18px;
        }

        .timeline-item h3 {
          margin: 0 0 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
        }

        .timeline-item .sub {
          color: var(--accent-2);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .timeline-item ul {
          margin: 0;
          padding-left: 18px;
          color: var(--muted);
          line-height: 1.72;
        }

        .recognition-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 32px;
        }

        .recognition-column .sub {
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line);
          color: var(--accent-2);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .recognition-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid var(--line);
        }

        .recognition-row strong, .recognition-row span, .recognition-row p { display: block; }
        .recognition-row strong { font-size: 0.92rem; line-height: 1.3; }
        .recognition-row span, .recognition-row p, .recognition-row time { color: var(--muted); font-size: 0.76rem; line-height: 1.5; }
        .recognition-row p { margin: 6px 0 0; }
        .recognition-row time { font-family: 'Space Grotesk', monospace; font-size: 0.8rem; }

        .quote {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          gap: 18px;
          align-items: stretch;
        }

        .quote-card {
          border-radius: 28px;
          border: 1px solid rgba(168,109,34,0.18);
          background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,248,236,0.74));
          padding: 28px;
          box-shadow: var(--shadow);
        }

        .quote-card blockquote {
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        .quote-card .source {
          display: block;
          margin-top: 16px;
          color: var(--muted);
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .contact {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .footer {
          padding: 20px 0 48px;
          color: var(--muted);
          font-size: 0.74rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 960px) {
          .hero, .quote, .contact, .grid-3, .timeline { grid-template-columns: 1fr; }
          .topbar { border-radius: 24px; align-items: flex-start; flex-direction: column; }
          .nav { justify-content: flex-start; }
        }

        @media (max-width: 640px) {
          .shell { width: min(100% - 22px, 1200px); }
          section { padding: 72px 0; }
          .hero { min-height: auto; padding-top: 18px; }
          .stats { grid-template-columns: 1fr; }
          .nav a { font-size: 0.68rem; padding: 7px 10px; }
          .recognition-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app">
        <div className="blob a" />
        <div className="blob b" />
        <div className="grain" />

        <div className="shell">
          {/* Sticky Navigation Header */}
          <header className="topbar">
            <a className="brand" href="#home" aria-label="Back to top">PK</a>
            <nav className="nav" aria-label="Primary navigation">
              {NAV.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={activeNav === item.id ? 'active' : ''}>
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          {/* Hero Section */}
          <section id="home" className="hero">
            <div>
              <Reveal>
                <span className="eyebrow">Poneesh Kumar — Computing and Financial Management</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1>Clean systems. Sharp design. Calm execution.</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  I build product-forward software at the intersection of engineering, quantitative finance, and machine learning.
                  Specialized in high-signal data pipelines, agentic architectures, and intuitive web interfaces.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="actions">
                  <MagneticCard>
                    <a className="button primary" href="#work">Explore Work</a>
                  </MagneticCard>
                  <MagneticCard>
                    <a className="button" href="/Poneesh_Resume_Website_W27.pdf" target="_blank" rel="noreferrer">
                      Download Resume
                    </a>
                  </MagneticCard>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="stats">
                  {STATS.map((s) => (
                    <motion.div
                      key={s.label}
                      className="card stat"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <motion.div
                className="hero-panel"
                initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="panel-grid">
                  <div className="glass">
                    <div className="meta"><span>Now building</span><span>Waterloo</span></div>
                    <h3 style={{ margin: '14px 0 10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.65rem', lineHeight: 1.05 }}>
                      Interfaces that feel quiet, fast, and intentional.
                    </h3>
                    <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.75 }}>
                      Fintech pipelines, agentic workflows, and real-time platforms engineered with tight latency and disciplined design.
                    </p>
                  </div>

                  <div className="glass">
                    <div className="meta"><span>Focus</span><span>System Design</span></div>
                    <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                      {['Product thinking', 'Data pipelines', 'Risk tooling', 'AI workflows'].map((item) => (
                        <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                          <span style={{ fontWeight: 600 }}>{item}</span>
                          <span style={{ color: 'var(--accent-2)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </section>

          {/* Projects / Work Section with Dynamic Filtering */}
          <section id="work">
            <SectionTitle
              eyebrow="Selected Work"
              title="Projects with clear outcomes"
              copy="Explore selected software products. Click any technology chip to filter projects dynamically."
            />

            {selectedTag && (
              <div className="filter-banner">
                <span>Filtering by stack: <strong>{selectedTag}</strong></span>
                <button className="clear-btn" onClick={() => setSelectedTag(null)}>Clear filter</button>
              </div>
            )}

            <motion.div layout className="grid-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                    key={project.title}
                    className="card"
                    whileHover={{ y: -5, rotateX: 1.5, rotateY: -1.5 }}
                  >
                    <div className="meta"><span>{project.category}</span><span>{project.year}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="chips">
                      {project.stack.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`chip ${selectedTag === item ? 'active' : ''}`}
                          onClick={() => setSelectedTag(selectedTag === item ? null : item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {project.link && (
                      <div style={{ marginTop: 18 }}>
                        <a className="button" href={project.link} target="_blank" rel="noreferrer">
                          Open Project
                        </a>
                      </div>
                    )}
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Dynamic Categorized Experience Section */}
          <section id="experience">
            <SectionTitle
              eyebrow="Experience"
              title="Building across engineering and finance"
              copy="Professional software engineering co-ops alongside active student-run quantitative finance and analysis."
            />
            <div className="experience-groups">
              {experienceGroups.map((group) => (
                <div className="experience-group" key={group.title}>
                  <div className="experience-group-title">{group.title}</div>
                  <div className="timeline">
                    {group.items.map((item, index) => (
                      <Reveal key={item.role + item.org} delay={index * 0.08}>
                        <div className="card timeline-item">
                          <h3>{item.role}</h3>
                          <div className="sub">
                            {item.org} {item.location ? ` / ${item.location}` : ''} / {item.period}
                          </div>
                          <ul>
                            {item.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recognition & Certifications */}
          <section id="recognition">
            <SectionTitle
              eyebrow="Recognition"
              title="Awards and certifications"
              copy="Honors, hackathon podium finishes, and industry-standard credentialing."
            />
            <div className="recognition-grid">
              <div className="recognition-column">
                <div className="sub">Awards & Hackathons</div>
                {RECOGNITION.map((item) => (
                  <div className="recognition-row" key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.org}</span>
                      <p>{item.description}</p>
                    </div>
                    <time>{item.year}</time>
                  </div>
                ))}
              </div>
              <div className="recognition-column">
                <div className="sub">Certifications</div>
                {CERTIFICATIONS.map((item) => (
                  <div className="recognition-row" key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.org}</span>
                      <p>{item.description}</p>
                    </div>
                    <time>{item.year}</time>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section id="quote">
            <SectionTitle
              eyebrow="Philosophy"
              title="A dedicated anchor"
              copy="A core guiding principle on focus, craft, and outcome detachment."
            />
            <div className="quote">
              <Reveal>
                <div className="quote-card">
                  <span className="eyebrow">Bhagavad Gita</span>
                  <blockquote>
                    You have the right to work, but never to the fruit of work. Let not the fruit of action be your motive, and do not be attached to inaction.
                  </blockquote>
                  <span className="source">Chapter 2, Verse 47</span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="card" style={{ height: '100%', display: 'grid', gap: 16, alignContent: 'start' }}>
                  <div className="meta"><span>Core Philosophy</span><span>Execution</span></div>
                  <p>
                    Focus strictly on craft, relentless iterative improvement, and deep execution rather than surrounding noise.
                  </p>
                  <div className="chips">
                    {['Focus', 'Discipline', 'Craft', 'Execution'].map((item) => (
                      <span key={item} className="chip" style={{ cursor: 'default' }}>{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact">
            <SectionTitle
              eyebrow="Contact"
              title="Let's connect"
              copy="Available for software engineering, quantitative research, and fintech product roles."
            />
            <div className="contact">
              <div className="card">
                <h3 style={{ marginTop: 0 }}>Let's build something sharp.</h3>
                <p>
                  Reach out directly for opportunities or technical collaborations.
                </p>
              </div>
              <div className="actions" style={{ marginTop: 0, justifyContent: 'flex-end' }}>
                <MagneticCard>
                  <a className="button primary" href="mailto:poneeshkumar@example.com">Email Me</a>
                </MagneticCard>
                <MagneticCard>
                  <a className="button" href="https://www.linkedin.com/in/poneeshkumar" target="_blank" rel="noreferrer">LinkedIn</a>
                </MagneticCard>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="card" style={{ marginTop: 18 }}>
                <div className="meta"><span>Stack snapshot</span><span>Click to filter projects</span></div>
                <div className="chips">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className={`chip ${selectedTag === skill ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTag(selectedTag === skill ? null : skill)
                        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* Footer */}
          <footer className="footer">
            <span>Poneesh Kumar / Portfolio</span>
            <span>Clean, dynamic, and animation-led</span>
          </footer>
        </div>
      </div>
    </>
  )
}