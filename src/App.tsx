import { useEffect, useMemo, useState } from 'react'

type TickerItem = {
  label: string; symbol: string; value: string; delta: string
  direction: 'up' | 'down' | 'flat'; category: 'market' | 'dev'
}
type LiveQuote = { value: string; delta: string; direction: 'up' | 'down' | 'flat' }
type LiveQuoteMap = Record<string, LiveQuote>
type Project = { title: string; tag: 'Finance' | 'Software'; description: string; tech: string[]; github?: string; year: string }

const marketItems: TickerItem[] = [
  { label: 'S&P 500',  symbol: '^GSPC',   value: '4,972.33',  delta: '+1.12%', direction: 'up',   category: 'market' },
  { label: 'Nasdaq',   symbol: '^NDX',    value: '17,842.10', delta: '+0.87%', direction: 'up',   category: 'market' },
  { label: 'TSX',      symbol: '^GSPTSE', value: '21,145.60', delta: '+0.42%', direction: 'up',   category: 'market' },
  { label: '10Y Bond', symbol: 'TNX',     value: '3.94%',     delta: '-0.06%', direction: 'down', category: 'market' },
]

const devItems: TickerItem[] = [
  { label: 'Stack',    symbol: 'ENV', value: 'React · TS · Tailwind', delta: 'v2026', direction: 'flat', category: 'dev' },
  { label: 'Focus',    symbol: 'CFM', value: 'Finance × Software',    delta: 'UW',    direction: 'flat', category: 'dev' },
  { label: 'Building', symbol: 'WIP', value: 'Stealth Startup',     delta: 'live',  direction: 'flat', category: 'dev' },
]

const projects: Project[] = [
  {
    title: 'ArtiCue (Google Sponsored)', tag: 'Software', year: '2026',
    description: 'Full-stack AI speech therapy platform closing the Canadian pathology gap. Top 12 of 800+ competitors — earned mentorship from Google engineers.',
    tech: ['Next.js', 'TypeScript', 'Gemini 2.5', 'ElevenLabs', 'Firebase', 'Recharts'],
    github: 'https://github.com/PoneeshKumar/ArtiCue',
  },
  {
    title: 'Portfolio Advisor (1st Overall)', tag: 'Finance', year: '2026',
    description: 'Systematic trading algorithm delivering 25% annualized returns. Features RSI, SMA, and automated USD/CAD currency conversion for 70+ equities.',
    tech: ['Python', 'Pandas', 'SciPy', 'yFinance', 'Matplotlib'],
    github: 'https://github.com/IanLeung12/CFM-Group-Project',
  },
  {
    title: 'FindMyVibe', tag: 'Software', year: '2025',
    description: 'Mood-to-media recommendation system using a Python backend and responsive frontend to personalize music discovery.',
    tech: ['Python', 'HTML', 'JavaScript', 'Flask'],
    github: 'https://github.com/tanvibatchu/FindMyVibe-ATM',
  },
  {
    title: 'Vibrant Portfolio', tag: 'Software', year: '2026',
    description: 'High-performance portfolio site with real-time financial tickers, dual-track resume downloads, and type-safe components.',
    tech: ['Vite', 'React', 'Tailwind', 'TypeScript'],
    github: 'https://github.com/PoneeshKumar/Portfolio-Website',
  },
]

const financeRoles = [
  { 
    title: 'M&A Market Research Analyst', org: 'UW Finance Association', period: 'Jan 2026 – Present',
    bullets: [
      'Identified acquisition opportunities through industry research to support M&A screening efforts.',
      'Benchmarked valuation multiples by analyzing comps and precedent transactions for pricing support.',
      'Produced executive-ready slides and investment memos to support strategic theses.'
    ] 
  },
  { 
    title: 'Financial Analyst', org: 'UW Wealth Management', period: 'Feb 2026 – Present',
    bullets: [
      'Assessed valuation models and investment arguments while judging competitive stock pitches.',
      'Monitored portfolio holdings and trade activity, analyzing performance attribution.',
      'Delivered recurring reports highlighting market developments and benchmark-relative returns.'
    ] 
  },
  {
    title: 'Investment Analyst', org: 'UW Fintech Club', period: 'Oct 2025 – Present',
    bullets: [
      'Evaluated fintech investments by researching 10+ companies and market trends.',
      'Built 5+ DCF models by forecasting cash flows to support valuation recommendations.',
      'Monitored portfolio performance across $50K+ in equity investments to identify risks.',
      'Collaborated with 10+ analysts to pitch ideas to the investment committee.'
    ]
  },
  {
    title: 'Bookkeeper', org: 'KumaraShivShakti Inc', period: 'Sep 2024 – Feb 2026',
    bullets: [
      'Maintained financial records for a $7M+ real-estate portfolio, improving accuracy by 30%.',
      'Prepared automated financial reports and tracking spreadsheets to support budgeting.',
      'Monitored expenses, cash flow, and balances for tax preparation.'
    ]
  }
]

const softwareRoles = [
  { 
    title: 'Data & Research Analyst', org: 'Nodal Research', period: 'Jan 2026 – Present',
    bullets: [
      'Evaluated portfolio risk for a $1.2M AUM fund by computing volatility and drawdown metrics.',
      'Built Python workflows in Pandas/NumPy to clean and analyze 20+ financial datasets.',
      'Synthesized findings into PowerBI dashboards to communicate risk and asset allocation.'
    ] 
  },
  { 
    title: 'Software Engineer', org: 'Marble Investments', period: 'Jan 2026 – Present',
    bullets: [
      'Built a market data ingestion engine using FastAPI and Python tracking 5,000+ equities.',
      'Architected a multi-tier caching system with threading locks, reducing latency by 30%.',
      'Developed a quantitative dashboard in Streamlit to automate real-time portfolio monitoring.'
    ] 
  },
]

const volunteerRoles = [
  {
    title: 'Food Associate', org: 'HHSVA', period: 'Sep 2022 – Present',
    bullets: [
      'Coordinated donation drives resulting in $20,000+ worth of food for Ronald McDonald House annually.',
      'Contributed to initiatives raising over $8,000 in donations for children at McMaster Hospital.',
      'Assisted regional coordinators in overseeing workflows to ensure smooth operational service.'
    ]
  },
  {
    title: 'Hindi Teacher', org: 'St. Charles Continuing Education', period: 'Sep 2023 – Nov 2025',
    bullets: [
      'Instructing students in Hindi language literacy, grammar, and cultural nuances.',
      'Developing lesson plans and educational materials to foster bilingual proficiency.',
      'Bridging communication gaps for diverse learners using Punjabi and English fluency.'
    ]
  }
]

const filters = ['All', 'Finance', 'Software'] as const
type Filter = (typeof filters)[number]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #F8F9FA;
  --white:     #FFFFFF;
  --line:      #E9ECEF;
  --line2:     #DEE2E6;
  --t1:        #1A1D23;
  --t2:        #4A5568;
  --t3:        #A0AEC0;
  --indigo:    #6366F1;
  --indigo-l:  #EEF2FF;
  --teal:      #14B8A6;
  --teal-l:    #F0FDFA;
  --up:        #10B981;
  --dn:        #EF4444;
  --up-bg:     #ECFDF5;
  --dn-bg:     #FEF2F2;
  --mono:      'DM Mono', ui-monospace, monospace;
  --sans:      'Plus Jakarta Sans', system-ui, sans-serif;
  --shadow:    0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--t1); font-family: var(--sans); font-weight: 400; -webkit-font-smoothing: antialiased; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: var(--sans); }

@keyframes tk  { from { transform: translateX(0)   } to { transform: translateX(-50%) } }
@keyframes tk2 { from { transform: translateX(50%) } to { transform: translateX(0)    } }
.tk  { animation: tk  44s linear infinite; }
.tk2 { animation: tk2 44s linear infinite; }

@keyframes fu { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
.fu  { animation: fu .6s ease both; opacity:0; }
.d1  { animation-delay: .05s }
.d2  { animation-delay: .16s }
.d3  { animation-delay: .27s }
.d4  { animation-delay: .38s }
.d5  { animation-delay: .49s }

.nav-a { transition: color .15s; }
.nav-a:hover { color: var(--indigo) !important; }

.proj-card { transition: box-shadow .2s, transform .2s; }
.proj-card:hover { box-shadow: var(--shadow-md) !important; transform: translateY(-2px); }

.res-card { transition: box-shadow .2s, transform .2s, border-color .2s; }
.res-card:hover { box-shadow: var(--shadow-md) !important; transform: translateY(-2px); }

.contact-a { transition: border-color .15s, box-shadow .15s; }
.contact-a:hover { border-color: var(--indigo) !important; box-shadow: 0 0 0 3px var(--indigo-l); }

.filter-pill { transition: all .15s; }
.filter-pill:hover { border-color: var(--indigo) !important; color: var(--indigo) !important; }

.cta-ghost:hover { background: var(--line) !important; }

::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--line2); border-radius: 4px; }
`

export default function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [liveQuotes, setLiveQuotes] = useState<LiveQuoteMap>({})

  const visibleProjects = useMemo(
    () => filter === 'All' ? projects : projects.filter(p => p.tag === filter),
    [filter],
  )
  const tickerItems = useMemo(() => [...marketItems, ...devItems, ...marketItems, ...devItems], [])

  useEffect(() => {
    const ctrl = new AbortController()
    async function load() {
      try {
        const syms = ['^GSPC', '^NDX', '^GSPTSE', '^TNX']
        const res = await fetch(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(syms.join(','))}`,
          { signal: ctrl.signal },
        )
        if (!res.ok) throw new Error()
        const data = (await res.json()) as {
          quoteResponse?: { result?: { symbol?: string; regularMarketPrice?: number; regularMarketChangePercent?: number }[] }
        }
        const next: LiveQuoteMap = {}
        for (const q of data.quoteResponse?.result ?? []) {
          if (!q.symbol || q.regularMarketPrice == null || q.regularMarketChangePercent == null) continue
          const pct = q.regularMarketChangePercent
          next[q.symbol] = {
            value: q.symbol === 'TNX'
              ? `${q.regularMarketPrice.toFixed(2)}%`
              : q.regularMarketPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            delta: `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`,
            direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat',
          }
        }
        if (Object.keys(next).length) setLiveQuotes(next)
      } catch { /* silent fallback */ }
    }
    load()
    const id = setInterval(load, 60_000)
    return () => { ctrl.abort(); clearInterval(id) }
  }, [])

  const wrap: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '0 28px' }

  return (
    <>
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,250,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ ...wrap, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>PK</span>
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Poneesh</span>
            <span style={{ fontSize: 12, color: 'var(--t3)', paddingLeft: 10, borderLeft: '1px solid var(--line2)' }}>CFM · Waterloo</span>
          </div>
          <nav style={{ display: 'flex', gap: 24 }}>
            {['Experience', 'Volunteering', 'Projects', 'Resumes', 'Contact'].map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} className="nav-a"
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--t2)', letterSpacing: '-0.01em' }}>
                {n}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── TICKER ── */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--line)', height: 38, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
        <div style={{ flexShrink: 0, height: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderRight: '1px solid var(--line)', background: 'var(--indigo-l)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', boxShadow: '0 0 0 2px rgba(99,102,241,0.25)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--indigo)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>Live Market</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
          <div className="tk" style={{ display: 'inline-flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap' }}>
            {tickerItems.map((it, i) => <TickerChip key={`a${i}`} item={it} liveQuotes={liveQuotes} />)}
          </div>
          <div className="tk2" aria-hidden style={{ display: 'inline-flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap', position: 'absolute', top: 0, left: 0 }}>
            {tickerItems.map((it, i) => <TickerChip key={`b${i}`} item={it} liveQuotes={liveQuotes} />)}
          </div>
        </div>
      </div>

      <main style={{ ...wrap, paddingTop: 0, paddingBottom: 120 }}>

        {/* ── HERO ── */}
        <section aria-label="Hero" style={{ paddingTop: 88, paddingBottom: 80 }}>
          <div className="fu d1" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--indigo-l)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '5px 12px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--indigo)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Computing &amp; Financial Management · Waterloo</span>
          </div>

          <h1 className="fu d2" style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: 'var(--t1)',
            marginBottom: 22,
            fontFamily: 'var(--sans)',
            maxWidth: 850,
          }}>
            Where capital <span style={{ color: 'var(--indigo)' }}>powers</span> code with <br />
            <span style={{ color: 'var(--indigo)' }}>Poneesh</span> · पुनीश · ਪੁਨੀਸ਼
          </h1>

          <p className="fu d3" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.75, color: 'var(--t2)', maxWidth: 500, marginBottom: 36 }}>
            CFM student at the University of Waterloo building at the intersection of quantitative finance and full-stack software development.
          </p>

          <div className="fu d4" style={{ display: 'flex', gap: 10, marginBottom: 64 }}>
            <a href="#resumes" style={{ background: 'var(--indigo)', color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'opacity .15s', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
              View Resumes
            </a>
            <a href="#projects" className="cta-ghost" style={{ background: 'var(--white)', border: '1px solid var(--line)', color: 'var(--t1)', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, transition: 'background .15s', boxShadow: 'var(--shadow)' }}>
              Projects →
            </a>
          </div>
        </section>

        <Divider />

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="01" title="Professional Experience" />

          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <ColLabel text="Finance & Research" color="var(--indigo)" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {financeRoles.map(r => <RoleBlock key={r.title} {...r} accentColor="var(--indigo)" />)}
              </div>
            </div>
            <div>
              <ColLabel text="Software & Engineering" color="var(--teal)" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {softwareRoles.map(r => <RoleBlock key={r.title} {...r} accentColor="var(--teal)" />)}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── VOLUNTEERING ── */}
        <section id="volunteering" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="02" title="Volunteering" />
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {volunteerRoles.map(r => (
              <RoleBlock key={r.title} {...r} accentColor="var(--indigo)" />
            ))}
          </div>
        </section>

        <Divider />

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="03" title="Selected Projects" />

          <div style={{ display: 'flex', gap: 6, marginTop: 28, marginBottom: 28 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="filter-pill" style={{
                fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 100,
                border: filter === f ? '1.5px solid var(--indigo)' : '1px solid var(--line)',
                background: filter === f ? 'var(--indigo)' : 'var(--white)',
                color: filter === f ? '#fff' : 'var(--t2)',
                boxShadow: filter === f ? '0 2px 8px rgba(99,102,241,0.25)' : 'var(--shadow)',
                transition: 'all .15s',
              }}>
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {visibleProjects.map(p => (
              <article key={p.title} className="proj-card" style={{
                background: 'var(--white)', borderRadius: 14, overflow: 'hidden',
                boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ height: 4, background: p.tag === 'Finance' ? 'linear-gradient(90deg, var(--indigo), #818CF8)' : 'linear-gradient(90deg, var(--teal), #2DD4BF)' }} />
                <div style={{ padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: p.tag === 'Finance' ? 'var(--indigo)' : 'var(--teal)',
                        background: p.tag === 'Finance' ? 'var(--indigo-l)' : 'var(--teal-l)',
                        padding: '2px 8px', borderRadius: 100,
                      }}>{p.tag}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>{p.year}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--t2)' }}>{p.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {p.tech.map(t => (
                        <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t2)', background: 'var(--bg)', border: '1px solid var(--line)', padding: '2px 8px', borderRadius: 4 }}>{t}</span>
                      ))}
                    </div>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo)', flexShrink: 0, marginLeft: 12 }}>
                        View Code →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── RESUMES ── */}
        <section id="resumes" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="04" title="Resumes" />
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { track: 'Finance & Investments', title: 'Financial Analyst', desc: 'Optimized for asset management and finance. Emphasizes risk modeling, portfolio theory, and $1.2M AUM analysis.', href: '/Poneesh_Resume_Finance.pdf', color: 'var(--indigo)', bg: 'var(--indigo-l)', grad: 'linear-gradient(135deg, var(--indigo), #818CF8)' },
              { track: 'Software Engineering', title: 'Full-Stack Developer', desc: 'Optimized for high-growth tech and fintech. Emphasizes FastAPI pipelines, Next.js architecture, and real-time data ingestion.', href: '/Poneesh_Resume_Tech.pdf', color: 'var(--teal)', bg: 'var(--teal-l)', grad: 'linear-gradient(135deg, var(--teal), #2DD4BF)' },
            ].map(r => (
              <a key={r.track} href={r.href} download className="res-card"
                style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 14, overflow: 'hidden', background: 'var(--white)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)' }}>
                <div style={{ height: 5, background: r.grad }} />
                <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: r.color, letterSpacing: '0.16em', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontWeight: 500 }}>{r.track}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 10, letterSpacing: '-0.02em' }}>{r.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--t2)' }}>{r.desc}</p>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: r.bg, color: r.color, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, alignSelf: 'flex-start', marginTop: 'auto' }}>
                    Download PDF ↓
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── CONTACT ── */}
        <section id="contact" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="05" title="Get in Touch" />
          <p style={{ marginTop: 16, marginBottom: 32, fontSize: 15, lineHeight: 1.75, color: 'var(--t2)', maxWidth: 460 }}>
            Interested in fintech, quant research, or scalable systems? Let's connect. I'm actively seeking co-op roles for 2026.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/poneeshkumar', hint: 'Professional updates', color: 'var(--indigo)' },
              { label: 'GitHub',   href: 'https://github.com/PoneeshKumar',          hint: 'Code & contributions',  color: 'var(--indigo)' },
              { label: 'Email',    href: 'mailto:poneesh.kumar@uwaterloo.ca',         hint: 'poneesh.kumar@uwaterloo.ca', color: 'var(--indigo)' },
            ].map(l => (
              <a key={l.label} href={l.href} className="contact-a"
                style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '14px 18px', background: 'var(--white)', border: '1.5px solid var(--line)', borderRadius: 10, boxShadow: 'var(--shadow)', transition: 'border-color .15s, box-shadow .15s' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{l.label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t2)' }}>{l.hint}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--white)', padding: '20px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>© {new Date().getFullYear()} Poneesh Kumar</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>Built with Vite · React · TypeScript</span>
        </div>
      </footer>
    </>
  )
}

function TickerChip({ item, liveQuotes }: { item: TickerItem; liveQuotes: LiveQuoteMap }) {
  const live = liveQuotes[item.symbol]
  const value = live?.value ?? item.value
  const delta = live?.delta ?? item.delta
  const dir = live?.direction ?? item.direction
  const dc = dir === 'up' ? 'var(--up)' : dir === 'down' ? 'var(--dn)' : 'var(--t2)'
  const dbg = dir === 'up' ? 'var(--up-bg)' : dir === 'down' ? 'var(--dn-bg)' : 'transparent'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 18px', borderRight: '1px solid var(--line)', height: '100%' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500, color: item.category === 'market' ? 'var(--t1)' : 'var(--t2)', letterSpacing: '0.04em' }}>{item.label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t1)', fontWeight: 500 }}>{value}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: dc, background: dbg, padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>{delta}</span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--line)' }} />
}

function SecLabel({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)', letterSpacing: '0.08em', flexShrink: 0 }}>{n}</span>
      <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1 }}>{title}</h2>
    </div>
  )
}

function ColLabel({ text, color }: { text: string; color: string }) {
  return (
    <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 24, fontWeight: 500 }}>{text}</p>
  )
}

function RoleBlock({ title, org, period, bullets, accentColor }: { title: string; org: string; period: string; bullets: string[]; accentColor: string }) {
  return (
    <div style={{ paddingLeft: 12, borderLeft: `2px solid ${accentColor}33` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 1 }}>{title}</p>
          <p style={{ fontSize: 12, color: accentColor, fontWeight: 500 }}>{org}</p>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--t3)', whiteSpace: 'nowrap', paddingTop: 2 }}>{period}</span>
      </div>
      <ul style={{ marginTop: 8, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {bullets.map(b => (
          <li key={b} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
            <span style={{ color: accentColor, flexShrink: 0, marginTop: 2, fontSize: 8 }}>▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
