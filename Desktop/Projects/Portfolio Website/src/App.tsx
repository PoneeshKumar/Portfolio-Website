import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Tab = 'home' | 'work' | 'experience' | 'awards' | 'about'
type Project = { title: string; tag: 'Finance' | 'Software'; description: string; tech: string[]; github?: string; demo?: string; year: string }
interface Award { title: string; org: string; year: string; desc: string }
interface Role { title: string; org: string; period: string; bullets: string[] }

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    title: 'CreditLens', tag: 'Finance', year: '2026',
    description: 'Full-stack SaaS platform that analyzes financial documents and predicts credit risk deterioration. Parses multi-year PDFs across 5 document types, auto-detects fiscal years, and scores each section independently. Validated against real bankruptcy data — correctly flagged Bed Bath & Beyond at high risk 2 years before their 2023 Chapter 11 filing.',
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'Supabase', 'pdfPlumber', 'Firebase', 'Vercel'],
    github: 'https://github.com/PoneeshKumar/CreditRisk', demo: 'https://youtu.be/PPQ6L0Re5l8?si=QiMzFJnD2g3hJrUg',
  },
  {
    title: 'CityScapes', tag: 'Software', year: '2026',
    description: '1st Place — Claude UWaterloo Hackathon. AI-powered urban planning tool that scores every plot of land in Kitchener-Waterloo by heat risk, equity, and park access. Shows planners exactly where new greenspace would do the most good, with impact numbers to back it up.',
    tech: ['Claude 3.5', 'React', 'Mapbox', 'FastAPI'],
    github: 'https://github.com/tanvibatchu/CityScapes',
  },
  {
    title: 'ArtiCue', tag: 'Software', year: '2026',
    description: 'Top 12 Finalist — Google Build with AI (800+ competitors). Full-stack AI speech therapy platform closing Canada\'s 2+ year waitlist gap. Built with ElevenLabs voice and Gemini 2.5 Flash, backed by a research pipeline pulling from PubMed, Semantic Scholar, and OpenAlex.',
    tech: ['Next.js', 'TypeScript', 'Gemini 2.5', 'ElevenLabs', 'Firebase'],
    github: 'https://github.com/tanvibatchu/articue', demo: 'https://youtu.be/mpBsgAv-E5k',
  },
  {
    title: 'Portfolio Advisor', tag: 'Finance', year: '2026',
    description: '2nd Overall — CFM Group Project. Systematic trading algorithm delivering 25% annualized returns. Built a Python data pipeline for 70+ equities on TSX and NYSE, implementing RSI, SMA, and Momentum indicators with automated USD/CAD currency conversion.',
    tech: ['Python', 'Pandas', 'SciPy', 'yFinance', 'Matplotlib'],
    github: 'https://github.com/IanLeung12/CFM-Group-Project',
  },
  {
    title: 'Equity Dashboard', tag: 'Finance', year: '2026',
    description: 'Real-time equity dashboard tracking 5,000+ active equities with AI-generated summaries. Architected a multi-tier caching system with JSON and threading locks, reducing API latency by 30%. Optimized pipelines via ThreadPoolExecutor for significantly higher throughput.',
    tech: ['Python', 'FastAPI', 'Polygon.io', 'Streamlit', 'ThreadPoolExecutor'],
    github: 'https://github.com/Bill-Cai-2005/Marble-Dashboard',
  },
  {
    title: 'FindMyVibe', tag: 'Software', year: '2025',
    description: 'Mood-to-media recommendation system that maps how you feel to music you\'ll actually want to hear. Python Flask backend processes mood inputs and returns personalized recommendations through a clean, responsive frontend.',
    tech: ['Python', 'HTML', 'JavaScript', 'Flask'],
    github: 'https://github.com/tanvibatchu/FindMyVibe-ATM',
  },
]

const SOFTWARE_ROLES: Role[] = [
  { title: 'Software Engineer Intern', org: 'NetNow Financial Inc.', period: 'May 2026 – Aug 2026', bullets: ['Developed and documented RESTful APIs connecting backend logic to frontend for a live B2B credit platform serving 85,000+ companies.', 'Contributed across the full SDLC — design, implementation, code reviews, testing, and production verification.', 'Built feature prototypes translating product requirements into working software within Agile sprints.'] },
  { title: 'Machine Learning Engineer', org: 'Wat Street – World Order Book', period: 'May 2026 – Present', bullets: ['Designed and trained 3+ ML-driven trading models on a custom market simulation framework.', 'Built a quantitative world model simulating 10+ years of financial market dynamics.'] },
  { title: 'Software Engineer', org: 'Marble Investments', period: 'Jan 2026 – Present', bullets: ['Built a market data ingestion engine using FastAPI and Polygon.io tracking 5,000+ equities.', 'Architected multi-tier caching system reducing API latency by 30%.', 'Optimized data pipelines via ThreadPoolExecutor, significantly increasing throughput.'] },
  { title: 'Data & Research Analyst', org: 'Nodal Research', period: 'Jan 2026 – Present', bullets: ['Built Python workflows to clean and analyze 20+ financial datasets using pandas and NumPy.', 'Assessed portfolio risk via volatility, correlations, and drawdown metrics to hedge 3+ industries.', 'Synthesized findings into PowerBI dashboards for a $1.2M AUM fund.'] },
]

const FINANCE_ROLES: Role[] = [
  { title: 'M&A Market Research Analyst', org: 'UW Finance Association', period: 'Jan 2026 – Present', bullets: ['Identified acquisition opportunities via industry research and M&A screening.', 'Built target screening lists assessing strategic fit, financial performance, and market positioning.', 'Benchmarked valuation multiples via comps and precedent transaction analysis.'] },
  { title: 'Financial Analyst', org: 'UW Wealth Management', period: 'Feb 2026 – Present', bullets: ['Assessed valuation models for competitive stock pitches to support portfolio decisions.', 'Monitored portfolio holdings and trade activity against benchmarks.'] },
  { title: 'Investment Analyst', org: 'UW Fintech Club', period: 'Oct 2025 – Present', bullets: ['Evaluated 10+ fintech companies across payments, lending, and wealthtech.', 'Built 5+ DCF models forecasting cash flows to assess intrinsic value.', 'Monitored $50K+ equity portfolio tracking returns and rebalancing.'] },
  { title: 'Bookkeeper', org: 'KumaraShivShakti Inc', period: 'Sep 2024 – Feb 2026', bullets: ['Maintained financial records for a $7M+ real-estate portfolio, improving accuracy by 30%.', 'Prepared automated financial reports and tracking spreadsheets.'] },
]

const AWARDS: Award[] = [
  { title: '1st Place — Claude UWaterloo Hackathon', org: 'Anthropic · University of Waterloo', year: '2026', desc: 'Won top prize for CityScapes, an AI urban planning tool focused on environmental equity.' },
  { title: 'Top 12 Finalist — Google Build with AI', org: 'Google · National Competition', year: '2026', desc: 'Top 1.5% of 800+ competitors for ArtiCue. Received direct mentorship from Google engineers.' },
  { title: '2nd Overall — CFM Group Project', org: 'University of Waterloo', year: '2026', desc: 'Highest-ranking systematic trading algorithm in the CFM cohort.' },
  { title: 'International Exchange Scholarship', org: 'University of Waterloo', year: '2025', desc: 'Awarded for strong academic performance and leadership.' },
  { title: 'Research Experience Scholarship', org: 'University of Waterloo', year: '2025', desc: 'Granted for exceptional research potential supporting faculty-supervised research.' },
  { title: "President's Scholarship of Distinction", org: 'University of Waterloo', year: '2025', desc: 'Awarded for admission average over 95%.' },
]

const CERTS: Award[] = [
  { title: 'AWS Fundamentals of Machine Learning and AI', org: 'Amazon Web Services', year: '2026', desc: 'Comprehensive training in AWS ML services and AI/ML fundamentals.' },
  { title: 'Quantitative Finance & Algorithmic Trading in Python', org: 'Professional Certification', year: '2026', desc: 'Advanced quantitative finance and algorithmic trading strategies.' },
  { title: 'Microsoft Security Essentials', org: 'Microsoft', year: '2026', desc: 'Security fundamentals and AI-powered protection mechanisms.' },
  { title: 'CFI Corporate Finance Foundations', org: 'Corporate Finance Institute', year: '2026', desc: 'Foundational corporate finance and valuation techniques.' },
  { title: 'SQL for Finance Professionals', org: 'Corporate Finance Institute', year: '2026', desc: 'Advanced SQL skills for financial data analysis.' },
]

const TECH_STACK = [
  { name: 'Python', cat: 'Language' }, { name: 'TypeScript', cat: 'Language' }, { name: 'JavaScript', cat: 'Language' },
  { name: 'React', cat: 'Framework' }, { name: 'Next.js', cat: 'Framework' }, { name: 'FastAPI', cat: 'Backend' },
  { name: 'PostgreSQL', cat: 'Database' }, { name: 'Supabase', cat: 'Database' }, { name: 'Firebase', cat: 'Database' },
  { name: 'PyTorch', cat: 'AI/ML' }, { name: 'Scikit-learn', cat: 'AI/ML' }, { name: 'Pandas', cat: 'Data' },
  { name: 'NumPy', cat: 'Data' }, { name: 'Docker', cat: 'Tool' }, { name: 'Vercel', cat: 'Tool' },
  { name: 'Mapbox', cat: 'Tool' }, { name: 'Tableau', cat: 'Data' }, { name: 'PowerBI', cat: 'Data' },
]

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function Typewriter({ lines, speed = 60, pause = 2000 }: { lines: string[]; speed?: number; pause?: number }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => {
    const current = lines[lineIdx % lines.length]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }
        else setTimeout(() => setDeleting(true), pause)
      } else {
        if (charIdx > 0) { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }
        else { setDeleting(false); setLineIdx(l => (l + 1) % lines.length) }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, lineIdx, lines, speed, pause])
  return (
    <span style={{ color: '#1a5276', fontFamily: 'var(--mono)' }}>
      {text}
      <span style={{ display: 'inline-block', width: 2, height: '1.1em', background: '#2980b9', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
    </span>
  )
}

// ─── MAGNETIC WRAP ────────────────────────────────────────────────────────────
function Mag({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16 })
  const sy = useSpring(y, { stiffness: 180, damping: 16 })
  return (
    <motion.div ref={ref} style={{ ...style, x: sx, y: sy, display: 'inline-flex' }}
      onMouseMove={e => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - r.left - r.width/2) * 0.3); y.set((e.clientY - r.top - r.height/2) * 0.3) }}
      onMouseLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.div>
  )
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 24, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  )
}

// ─── 3D GEOMETRIC CANVAS ─────────────────────────────────────────────────────
function GeometricCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const time = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.8
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 0.5
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    type V3 = [number, number, number]
    const rotY = (p: V3, a: number): V3 => [p[0]*Math.cos(a)-p[2]*Math.sin(a), p[1], p[0]*Math.sin(a)+p[2]*Math.cos(a)]
    const rotX = (p: V3, a: number): V3 => [p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)]
    const proj = (p: V3, W: number, H: number): [number,number,number] => {
      const fov = 380; const sc = fov/(fov+p[2]+80)
      return [W/2+p[0]*sc, H/2-p[1]*sc, sc]
    }
    const xfm = (p: V3, ry: number, rx: number, W: number, H: number) => proj(rotX(rotY(p, ry), rx), W, H)

    // Build an icosahedron-inspired wireframe sphere
    const PHI = (1 + Math.sqrt(5)) / 2
    const rawVerts: V3[] = [
      [0,1,PHI],[0,-1,PHI],[0,1,-PHI],[0,-1,-PHI],
      [1,PHI,0],[-1,PHI,0],[1,-PHI,0],[-1,-PHI,0],
      [PHI,0,1],[PHI,0,-1],[-PHI,0,1],[-PHI,0,-1],
    ]
    const scale = 90
    const verts: V3[] = rawVerts.map(v => {
      const len = Math.sqrt(v[0]**2+v[1]**2+v[2]**2)
      return [v[0]/len*scale, v[1]/len*scale, v[2]/len*scale]
    })
    const edges: [number,number][] = [
      [0,1],[0,4],[0,5],[0,8],[0,10],
      [1,6],[1,7],[1,8],[1,10],
      [2,3],[2,4],[2,5],[2,9],[2,11],
      [3,6],[3,7],[3,9],[3,11],
      [4,5],[4,8],[4,9],
      [5,10],[5,11],
      [6,7],[6,8],[6,9],
      [7,10],[7,11],
      [8,9],[10,11],
    ]

    // Orbit rings
    const rings: { r: number; tilt: number; phase: number; speed: number }[] = [
      { r: 120, tilt: 0.4, phase: 0, speed: 0.3 },
      { r: 150, tilt: 1.1, phase: 1.2, speed: -0.2 },
      { r: 100, tilt: 0.8, phase: 2.4, speed: 0.5 },
    ]

    const render = () => {
      time.current += 0.006
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05

      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const ry = time.current * 0.4 + mouse.current.x
      const rx = -0.15 + mouse.current.y * 0.4

      // Draw orbit rings
      rings.forEach(ring => {
        const segs = 64
        ctx.beginPath()
        for (let i = 0; i <= segs; i++) {
          const ang = (i / segs) * Math.PI * 2 + ring.phase
          const rx2 = Math.cos(ang) * ring.r
          const ry2 = Math.sin(ang) * ring.r * Math.cos(ring.tilt)
          const rz = Math.sin(ang) * ring.r * Math.sin(ring.tilt)
          const [sx, sy] = xfm([rx2, ry2, rz], ry, rx, W, H)
          i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
        }
        ctx.strokeStyle = 'rgba(41,128,185,0.18)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Small dot on ring
        const ang = time.current * ring.speed + ring.phase
        const dx = Math.cos(ang) * ring.r
        const dy = Math.sin(ang) * ring.r * Math.cos(ring.tilt)
        const dz = Math.sin(ang) * ring.r * Math.sin(ring.tilt)
        const [sx, sy, sc] = xfm([dx, dy, dz], ry, rx, W, H)
        ctx.beginPath(); ctx.arc(sx, sy, 3.5 * sc, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(41,128,185,0.6)'; ctx.fill()
      })

      // Draw edges
      edges.forEach(([a, b]) => {
        const [ax, ay, as_] = xfm(verts[a], ry, rx, W, H)
        const [bx, by, bs] = xfm(verts[b], ry, rx, W, H)
        const alpha = Math.min(as_, bs) * 0.7
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by)
        ctx.strokeStyle = `rgba(26,82,118,${alpha * 0.6})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      // Draw vertices
      verts.forEach(v => {
        const [sx, sy, sc] = xfm(v, ry, rx, W, H)
        ctx.beginPath(); ctx.arc(sx, sy, 4 * sc, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(41,128,185,${sc * 0.85})`; ctx.fill()
        ctx.beginPath(); ctx.arc(sx, sy, 7 * sc, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(41,128,185,${sc * 0.15})`; ctx.fill()
      })

      raf = requestAnimationFrame(render)
    }
    render()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'awards', label: 'Awards' },
  { id: 'about', label: 'About' },
]

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [selectedProj, setSelectedProj] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow-x: hidden; }
        :root {
          --bg:      #eaf4fb;
          --bg2:     #d6eaf8;
          --bg3:     #c5e0f5;
          --surface: rgba(255,255,255,0.72);
          --surf2:   rgba(255,255,255,0.5);
          --ink:     #0d2137;
          --ink2:    #1a4a6e;
          --muted:   #5b8db0;
          --accent:  #1a72b8;
          --accent2: #0e4d80;
          --border:  rgba(26,114,184,0.15);
          --bord2:   rgba(26,114,184,0.08);
          --shadow:  rgba(13,33,55,0.08);
          --display: 'Lora', Georgia, serif;
          --body:    'DM Sans', sans-serif;
          --mono:    'DM Mono', monospace;
        }
        #root { font-family: var(--body); color: var(--ink); background: var(--bg); min-height: 100vh; }
        ::selection { background: rgba(26,114,184,0.2); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sweep { from{transform:translateX(-102%)} to{transform:translateX(0)} }
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 3px;
          font-family: var(--mono); font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; border: 1px solid var(--ink); background: transparent;
          color: var(--ink); text-decoration: none; position: relative; overflow: hidden;
          transition: color 0.2s ease;
        }
        .btn::after { content:''; position:absolute; inset:0; background:var(--ink); transform:translateX(-102%); transition:transform 0.22s cubic-bezier(0.4,0,0.2,1); z-index:0; }
        .btn:hover { color: var(--bg); }
        .btn:hover::after { transform:translateX(0); }
        .btn > * { position:relative; z-index:1; }
        .btn-blue { border-color: var(--accent); color: var(--accent); }
        .btn-blue::after { background: var(--accent); }
        .btn-blue:hover { color: white; }
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          box-shadow: 0 2px 16px var(--shadow), 0 1px 0 rgba(255,255,255,0.8) inset;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative; overflow: hidden;
        }
        .card::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; }
        .card:hover { transform:translateY(-3px); box-shadow:0 8px 32px var(--shadow); border-color:rgba(26,114,184,0.3); }
        .card:hover::before { transform:scaleX(1); }
        .chip {
          font-family: var(--mono); font-size: 0.58rem;
          padding: 2px 8px; border-radius: 3px;
          border: 1px solid var(--bord2); background: rgba(26,114,184,0.06);
          color: var(--muted); white-space: nowrap; transition: all 0.15s;
        }
        .chip:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .tag { display:inline-block; font-family:var(--mono); font-size:0.56rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; padding:2px 8px; border-radius:2px; }
        .tag-f { background:rgba(26,114,184,0.1); color:var(--accent); border:1px solid rgba(26,114,184,0.2); }
        .tag-s { background:rgba(14,77,128,0.1); color:var(--accent2); border:1px solid rgba(14,77,128,0.2); }
        .scroll-area { overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
        .scroll-area::-webkit-scrollbar { width:3px; }
        .scroll-area::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
        .label { font-family:var(--mono); font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:8px; }
        .label::before { content:''; display:inline-block; width:20px; height:1px; background:var(--accent); flex-shrink:0; }
        .section-title { font-family:var(--display); font-weight:700; font-size:clamp(1.9rem,3vw,2.8rem); color:var(--ink); line-height:1.05; letter-spacing:-0.02em; }
        .timeline-dot { width:8px; height:8px; border-radius:0; background:var(--accent); border:2px solid var(--bg); outline:1px solid var(--accent); position:absolute; left:-4px; flex-shrink:0; }
        .modal-bg { position:fixed; inset:0; background:rgba(13,33,55,0.4); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
      `}</style>

      {/* BG texture */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 60% at 15% 20%, rgba(26,114,184,0.10), transparent 55%),
                     radial-gradient(ellipse 60% 70% at 85% 80%, rgba(14,77,128,0.08), transparent 55%),
                     radial-gradient(ellipse 50% 50% at 55% 45%, rgba(41,128,185,0.06), transparent 60%),
                     var(--bg)` }} />
      {/* Noise */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        backgroundSize: '180px', mixBlendMode: 'multiply' }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ── NAV ────────────────────────────────────────────────────── */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(234,244,251,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setTab('home')} style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}>
            PK
          </button>
          <div style={{ display: 'flex', gap: 4 }}>
            {NAV_ITEMS.map(n => (
              <Mag key={n.id}>
                <button onClick={() => setTab(n.id)} style={{
                  fontFamily: 'var(--mono)', fontSize: '0.65rem', fontWeight: 500,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '6px 14px', borderRadius: '3px', cursor: 'pointer',
                  border: '1px solid ' + (tab === n.id ? 'var(--accent)' : 'transparent'),
                  background: tab === n.id ? 'var(--accent)' : 'transparent',
                  color: tab === n.id ? 'white' : 'var(--muted)',
                  transition: 'all 0.18s ease',
                }}>
                  {n.label}
                </button>
              </Mag>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="https://github.com/PoneeshKumar" target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/in/poneeshkumar" target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              LinkedIn ↗
            </a>
          </div>
        </nav>

        {/* ── PAGES ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>

            {/* ══ HOME ══════════════════════════════════════════════════ */}
            {tab === 'home' && (
              <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'center', minHeight: '70vh' }}>

                  {/* Left */}
                  <div>
                    <motion.div {...stagger(0)}>
                      <div className="label" style={{ marginBottom: 24 }}>Computing & Financial Management · University of Waterloo</div>
                    </motion.div>
                    <motion.h1 {...stagger(1)} style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 20 }}>
                      Poneesh<br /><span style={{ color: 'var(--accent)' }}>Kumar</span>
                    </motion.h1>
                    <motion.div {...stagger(2)} style={{ fontSize: '1.05rem', marginBottom: 28, height: 28 }}>
                      <Typewriter lines={['Software Engineer', 'Quantitative Analyst', 'ML Engineer', 'Hackathon Winner']} />
                    </motion.div>
                    <motion.p {...stagger(3)} style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink2)', maxWidth: 520, marginBottom: 40, fontWeight: 300 }}>
                      Building at the intersection of software and finance. Currently at Waterloo studying Computing & Financial Management — shipping production systems at NetNow, Marble Investments, and Nodal Research.
                    </motion.p>
                    <motion.div {...stagger(4)} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <Mag><button className="btn btn-blue" onClick={() => setTab('work')}>View Work →</button></Mag>
                      <Mag><a className="btn" href="/Poneesh_Resume_Website_W27.pdf" target="_blank" rel="noreferrer">Resume ↓</a></Mag>
                    </motion.div>
                  </div>

                  {/* Right — 3D Canvas */}
                  <motion.div {...stagger(1)} style={{ height: 480, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.4)', position: 'relative' }}>
                    <GeometricCanvas />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                      INTERACTIVE · DRAG TO ROTATE
                    </div>
                  </motion.div>
                </div>

                {/* Quick stats strip */}
                <motion.div {...stagger(5)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginTop: 80, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { n: '25%', label: 'Annualized Returns' },
                    { n: '2×', label: 'Hackathon Winner' },
                    { n: '5K+', label: 'Equities Tracked' },
                    { n: '$1.2M', label: 'AUM Managed' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '28px 32px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--display)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{s.n}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* ══ WORK ══════════════════════════════════════════════════ */}
            {tab === 'work' && (
              <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 48px' }}>
                <Reveal>
                  <div className="label" style={{ marginBottom: 12 }}>Selected Projects</div>
                  <h2 className="section-title" style={{ marginBottom: 48 }}>Work</h2>
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {PROJECTS.map((p, i) => (
                    <Reveal key={p.title} delay={i * 0.06}>
                      <div className="card" style={{ padding: 28, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        onClick={() => setSelectedProj(p)}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                            <span className={`tag tag-${p.tag === 'Finance' ? 'f' : 's'}`}>{p.tag}</span>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{p.year}</span>
                          </div>
                          <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.25 }}>{p.title}</h3>
                          <p style={{ fontSize: '0.82rem', color: 'var(--ink2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300 }}>{p.description}</p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 18 }}>
                          {p.tech.slice(0, 4).map(t => <span key={t} className="chip">{t}</span>)}
                          {p.tech.length > 4 && <span className="chip">+{p.tech.length - 4}</span>}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* ══ EXPERIENCE ════════════════════════════════════════════ */}
            {tab === 'experience' && (
              <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 48px' }}>
                <Reveal>
                  <div className="label" style={{ marginBottom: 12 }}>Career</div>
                  <h2 className="section-title" style={{ marginBottom: 48 }}>Experience</h2>
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
                  {[{ title: 'Software & ML', roles: SOFTWARE_ROLES }, { title: 'Finance & Research', roles: FINANCE_ROLES }].map((col, ci) => (
                    <Reveal key={col.title} delay={ci * 0.1}>
                      <div className="label" style={{ marginBottom: 28 }}>{col.title}</div>
                      <div style={{ position: 'relative', paddingLeft: 22 }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, var(--accent), rgba(26,114,184,0.1))' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          {col.roles.map((r, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <div className="timeline-dot" style={{ top: 6 }} />
                              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                                <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>{r.title}</span>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{r.period}</span>
                              </div>
                              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent)', marginBottom: 10, letterSpacing: '0.06em' }}>{r.org}</div>
                              {r.bullets.map((b, j) => (
                                <p key={j} style={{ fontSize: '0.82rem', color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 4, paddingLeft: 10, borderLeft: '2px solid var(--bord2)', fontWeight: 300 }}>{b}</p>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* ══ AWARDS ════════════════════════════════════════════════ */}
            {tab === 'awards' && (
              <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 48px' }}>
                <Reveal>
                  <div className="label" style={{ marginBottom: 12 }}>Recognition & Learning</div>
                  <h2 className="section-title" style={{ marginBottom: 48 }}>Awards & Certifications</h2>
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
                  <Reveal delay={0.05}>
                    <div className="label" style={{ marginBottom: 24 }}>Awards</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {AWARDS.map((a, i) => (
                        <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--bord2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.3 }}>{a.title}</span>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)', flexShrink: 0 }}>{a.year}</span>
                          </div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>{a.org}</div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--ink2)', lineHeight: 1.6, fontWeight: 300 }}>{a.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div className="label" style={{ marginBottom: 24 }}>Certifications</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {CERTS.map((c, i) => (
                        <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--bord2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.3 }}>{c.title}</span>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)', flexShrink: 0 }}>{c.year}</span>
                          </div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>{c.org}</div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--ink2)', lineHeight: 1.6, fontWeight: 300 }}>{c.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </div>
            )}

            {/* ══ ABOUT ═════════════════════════════════════════════════ */}
            {tab === 'about' && (
              <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 48px' }}>
                <Reveal>
                  <div className="label" style={{ marginBottom: 12 }}>Background</div>
                  <h2 className="section-title" style={{ marginBottom: 48 }}>About</h2>
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
                  <Reveal delay={0.05}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--ink)', borderLeft: '3px solid var(--accent)', paddingLeft: 20 }}>
                        "Build systems that work at the intersection of rigorous engineering and financial reality."
                      </p>
                      <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: 'var(--ink2)', fontWeight: 300 }}>
                        I'm pursuing Computing and Financial Management (CFM) at the University of Waterloo — one of the few programs that fuses a full CS curriculum with comprehensive financial engineering. I'm drawn to problems where software and markets collide.
                      </p>
                      <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: 'var(--ink2)', fontWeight: 300 }}>
                        My approach is full-system: I care about clean API design, caching architectures, and risk-analytics tooling as much as I care about the business logic they serve. Currently building at NetNow, Marble Investments, Nodal Research, and Wat Street simultaneously.
                      </p>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <Mag><a className="btn btn-blue" href="https://www.linkedin.com/in/poneeshkumar" target="_blank" rel="noreferrer">LinkedIn ↗</a></Mag>
                        <Mag><a className="btn" href="/Poneesh_Resume_Website_W27.pdf" target="_blank" rel="noreferrer">Resume ↓</a></Mag>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div className="label" style={{ marginBottom: 20 }}>Tech Stack</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {TECH_STACK.map(t => (
                        <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 14px', border: '1px solid var(--bord2)', borderRadius: 4, background: 'rgba(255,255,255,0.5)', gap: 2, cursor: 'default', transition: 'all 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLDivElement).querySelectorAll('span').forEach(s => (s as HTMLSpanElement).style.color = 'white') }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bord2)'; (e.currentTarget as HTMLDivElement).querySelectorAll('span').forEach((s,i) => (s as HTMLSpanElement).style.color = i===0 ? 'var(--ink)' : 'var(--muted)') }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--ink)', transition: 'color 0.15s' }}>{t.name}</span>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color 0.15s' }}>{t.cat}</span>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── PROJECT MODAL ──────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedProj && (
            <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProj(null)}>
              <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, maxWidth: 620, width: '100%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(13,33,55,0.18)' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--bord2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className={`tag tag-${selectedProj.tag === 'Finance' ? 'f' : 's'}`} style={{ marginBottom: 8, display: 'inline-block' }}>{selectedProj.tag}</span>
                    <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.2 }}>{selectedProj.title}</h3>
                  </div>
                  <button onClick={() => setSelectedProj(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 8px' }}>CLOSE ×</button>
                </div>
                <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--ink2)', fontWeight: 300 }}>{selectedProj.description}</p>
                  <div>
                    <div className="label" style={{ marginBottom: 10 }}>Stack</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedProj.tech.map(t => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--bord2)' }}>
                    {selectedProj.github && (
                      <Mag><a href={selectedProj.github} target="_blank" rel="noreferrer" className="btn btn-blue">GitHub ↗</a></Mag>
                    )}
                    {selectedProj.demo && (
                      <Mag><a href={selectedProj.demo} target="_blank" rel="noreferrer" className="btn">Watch Demo ▶</a></Mag>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 80 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.14em' }}>PONEESH KUMAR · CFM · WATERLOO</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['GitHub', 'https://github.com/PoneeshKumar'], ['LinkedIn', 'https://www.linkedin.com/in/poneeshkumar']].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.12em', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                {label} ↗
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}