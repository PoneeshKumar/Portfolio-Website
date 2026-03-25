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
  { label: 'Stack',    symbol: 'ENV', value: 'React · TS · Tailwind', delta: 'v2025', direction: 'flat', category: 'dev' },
  { label: 'Focus',    symbol: 'CFM', value: 'Finance × Software',    delta: 'UW',    direction: 'flat', category: 'dev' },
  { label: 'Building', symbol: 'WIP', value: 'CFM portfolio models',  delta: 'live',  direction: 'flat', category: 'dev' },
]
 
const projects: Project[] = [
  {
    title: 'ArtiCue', tag: 'Software', year: '2025',
    description: 'AI-powered speech therapy using Gemini 2.5 Flash and ElevenLabs for real-time articulation feedback. Top 12 at Google hackathon — earned seed support and mentorship.',
    tech: ['Next.js 16', 'TypeScript', 'Gemini 2.5', 'ElevenLabs', 'Firebase', 'Auth0'],
    github: 'https://youtu.be/nndhehSQGhc?si=lHNnGRCW9dgAOwoC',
  },
  {
    title: 'CFM 101 — Model Portfolio', tag: 'Finance', year: '2025',
    description: 'Quantitative portfolio using modern portfolio theory, risk analysis, and data-driven asset selection. Outperformed the benchmark by ~5% over five days.',
    tech: ['Python', 'Pandas', 'Portfolio Theory'],
    github: 'https://github.com/IanLeung12/CFM-Group-Project',
  },
  {
    title: 'FindMyVibe', tag: 'Software', year: '2024',
    description: 'Full-stack app recommending songs based on mood and listening preferences. Python backend, modern responsive frontend.',
    tech: ['Python', 'HTML', 'JavaScript'],
    github: 'https://github.com/tanvibatchu/FindMyVibe-ATM',
  },
  {
    title: 'Portfolio Website', tag: 'Software', year: '2025',
    description: 'This site — responsive portfolio with a live financial ticker, dual-track resume system, and clean layout.',
    tech: ['Vite', 'React', 'Tailwind'],
    github: 'https://github.com/PoneeshKumar/Portfolio-Website',
  },
]
 
const financeRoles = [
  { title: 'Financial Analyst', org: 'UW Wealth Management', period: 'Jan 2026 – Present',
    bullets: ['Built quantitative Excel frameworks for returns, benchmarks, and risk metrics.', 'Maintained structured performance and tracking models for analysis.', 'Automated performance reporting to visualise portfolio trends.'] },
  { title: 'M&A Research Analyst', org: 'UW Finance Association', period: 'Jan 2026 – Present',
    bullets: ['Identified acquisition opportunities through industry and market research.', 'Benchmarked valuation multiples via comps and precedent transactions.', 'Produced executive-ready slides and memos for management.'] },
  { title: 'Investment Analyst', org: 'UW FinTech Club', period: 'Oct 2025 – Present',
    bullets: ['Built DCF models for valuation-driven investment recommendations.', 'Monitored a student-managed equity portfolio across fintech positions.', 'Pitched ideas to the investment committee with fellow analysts.'] },
  { title: 'Bookkeeper', org: 'KumaraShivShakti Inc.', period: 'Sep 2024 – Present',
    bullets: ['Improved reporting accuracy for a $7M+ real-estate portfolio.', 'Built automated dashboards and forecasting tools for leadership.', 'Developed KPI frameworks with real-time operational visibility.'] },
]
 
const softwareRoles = [
  { title: 'Co-Founder & CTO', org: 'ArtiCue', period: 'Mar 2025 – Present',
    bullets: ['Architected AI speech therapy platform — Top 12 at Google hackathon.', 'Engineered scalable real-time pipelines for articulation feedback.', 'Led full product and engineering roadmap from 0 → production.'] },
  { title: 'Software Engineer (Finance)', org: 'Marble Investments', period: 'Jan 2026 – Present',
    bullets: ['Built internal tooling for research, portfolio monitoring, and workflows.', 'Integrated Massive API for real-time market data pipelines.', 'Developed quantitative dashboards tracking performance and signals.'] },
  { title: 'Data & Research Analyst', org: 'Nodal Research', period: 'Jan 2026 – Present',
    bullets: ['Assessed portfolio risk for a $1.2M AUM fund using volatility metrics.', 'Built Python workflows to clean and analyse large financial time-series.', 'Delivered actionable quantitative findings to investment teams.'] },
]
 
const filters = ['All', 'Finance', 'Software'] as const
type Filter = (typeof filters)[number]
 
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
 
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
:root {
  --bg:        #F7F6F2;
  --white:     #FFFFFF;
  --line:      #E4E1DA;
  --line2:     #D0CDC5;
  --t1:        #111110;
  --t2:        #6B6760;
  --t3:        #B0ADA6;
  --indigo:    #4F46E5;
  --indigo-l:  #EEF0FD;
  --teal:      #0D9488;
  --teal-l:    #EDFAF8;
  --up:        #059669;
  --dn:        #DC2626;
  --up-bg:     #ECFDF5;
  --dn-bg:     #FEF2F2;
  --mono:      'DM Mono', ui-monospace, monospace;
  --sans:      'Plus Jakarta Sans', system-ui, sans-serif;
  --shadow:    0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);
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
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,246,242,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ ...wrap, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>PK</span>
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Poneesh Kumar</span>
            <span style={{ fontSize: 12, color: 'var(--t3)', paddingLeft: 10, borderLeft: '1px solid var(--line2)' }}>CFM · UW</span>
          </div>
          <nav style={{ display: 'flex', gap: 24 }}>
            {['Experience', 'Stories', 'Projects', 'Resumes', 'Contact'].map(n => (
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
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', boxShadow: '0 0 0 2px rgba(79,70,229,0.25)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--indigo)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>Live</span>
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
          {/* Badge */}
          <div className="fu d1" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--indigo-l)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 100, padding: '5px 12px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--indigo)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Computing &amp; Financial Management · UW</span>
          </div>
 
          <h1 className="fu d2" style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: 'var(--t1)',
            marginBottom: 22,
            fontFamily: 'var(--sans)',
            maxWidth: 740,
          }}>
            Where code <span style={{ color: 'var(--indigo)' }}>meets</span><br />
            <span style={{ color: 'var(--teal)' }}>capital.</span>
          </h1>
 
          <p className="fu d3" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.75, color: 'var(--t2)', maxWidth: 500, marginBottom: 36 }}>
            CFM student at Waterloo building at the intersection of software and finance — from quantitative portfolios to full-stack production apps.
          </p>
 
          {/* Skill chips */}
          <div className="fu d4" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
            {['Fintech & Product', 'Type-Safe Frontends', 'Portfolio Theory', 'Full-Stack'].map(chip => (
              <span key={chip} style={{ fontSize: 12, fontWeight: 500, color: 'var(--t2)', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 100, padding: '4px 12px' }}>{chip}</span>
            ))}
          </div>
 
          <div className="fu d4" style={{ display: 'flex', gap: 10, marginBottom: 64 }}>
            <a href="#resumes" style={{ background: 'var(--indigo)', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'opacity .15s', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              View Resumes
            </a>
            <a href="#projects" className="cta-ghost" style={{ background: 'var(--white)', border: '1px solid var(--line)', color: 'var(--t1)', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, transition: 'background .15s', boxShadow: 'var(--shadow)' }}>
              Projects →
            </a>
          </div>
 
          {/* Stats */}
          <div className="fu d5" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { val: '4+',     lbl: 'Active roles',      color: 'var(--indigo)', bg: 'var(--indigo-l)' },
              { val: '$1.2M',  lbl: 'AUM analysed',      color: 'var(--teal)',   bg: 'var(--teal-l)'   },
              { val: '$7M+',   lbl: 'RE portfolio',      color: 'var(--indigo)', bg: 'var(--indigo-l)' },
              { val: 'Top 12', lbl: 'Google hackathon',  color: 'var(--teal)',   bg: 'var(--teal-l)'   },
            ].map(s => (
              <div key={s.lbl} style={{ background: s.bg, borderRadius: 12, padding: '18px 20px', border: `1px solid ${s.color}22` }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 500, color: s.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t2)' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>
 
        <Divider />
 
        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="01" title="Experience" />
 
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <ColLabel text="Finance & Investment" color="var(--indigo)" />
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
 
          {/* Certs */}
          <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--line)', paddingTop: 36 }}>
            {[
              { label: 'Finance Certifications', color: 'var(--indigo)', bg: 'var(--indigo-l)', items: ['CFI Financial Analysis and Modelling', 'CFI Corporate Finance Foundations', 'PMI Finance Foundations: Risk Management'] },
              { label: 'Tech & Quant Certifications', color: 'var(--teal)', bg: 'var(--teal-l)', items: ['Quantitative Finance & Algo Trading in Python', 'Microsoft Security Essentials', 'SQL for Finance'] },
            ].map(g => (
              <div key={g.label} style={{ background: g.bg, borderRadius: 12, padding: '20px 22px', border: `1px solid ${g.color}22` }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: g.color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>{g.label}</p>
                {g.items.map(it => (
                  <div key={it} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: g.color, flexShrink: 0, marginTop: 1, fontSize: 10 }}>✦</span>
                    <span style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>{it}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
 
        <Divider />
 
        {/* ── STORIES ── */}
        <section id="stories" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="02" title="Stories" />
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '01', tag: 'Finance',  color: 'var(--indigo)', tagBg: 'var(--indigo-l)', title: 'The Logic',
                body: 'In CFM 101, we built a quantitative, model-driven portfolio applying modern portfolio theory, risk analysis, and data-driven asset selection to real tickers.',
                aside: 'Theory is powerful, but the real edge comes from clean data, clear constraints, and code that makes portfolio behaviour easy to explain.' },
              { n: '02', tag: 'Software', color: 'var(--teal)',   tagBg: 'var(--teal-l)',   title: 'The Build',
                body: 'On FindMyVibe I learned how much UX, state management, and API design matter when you want people to actually enjoy a product.',
                aside: 'I now think in terms of data flows, invariants, and failure modes first — then let the UI tell that story as simply as possible.' },
              { n: '03', tag: 'Product',  color: 'var(--indigo)', tagBg: 'var(--indigo-l)', title: 'The Reasoning',
                body: 'We built ArtiCue to solve a real gap — 20%+ of Canadian preschoolers face speech issues but families wait 8 months for funded therapy. Private sessions cost up to $4,000/month.',
                aside: 'The most important part of building software is deeply understanding the problem. Every product decision has to serve that.' },
            ].map(s => (
              <div key={s.n} style={{ background: 'var(--white)', borderRadius: 14, padding: '24px 26px', boxShadow: 'var(--shadow)', display: 'grid', gridTemplateColumns: '28px auto 1fr 1fr', gap: '0 24px', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)', paddingTop: 4 }}>{s.n}</span>
                <span style={{ display: 'inline-flex', alignSelf: 'start', background: s.tagBg, color: s.color, fontSize: 10, fontWeight: 600, fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap', marginTop: 2 }}>{s.tag}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--t2)' }}>{s.body}</p>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--t2)', fontStyle: 'italic', borderLeft: `2px solid ${s.color}44`, paddingLeft: 14 }}>{s.aside}</p>
              </div>
            ))}
          </div>
        </section>
 
        <Divider />
 
        {/* ── PROJECTS ── */}
        <section id="projects" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <SecLabel n="03" title="Projects" />
 
          <div style={{ display: 'flex', gap: 6, marginTop: 28, marginBottom: 28 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="filter-pill" style={{
                fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 100,
                border: filter === f ? '1.5px solid var(--indigo)' : '1px solid var(--line)',
                background: filter === f ? 'var(--indigo)' : 'var(--white)',
                color: filter === f ? '#fff' : 'var(--t2)',
                boxShadow: filter === f ? '0 2px 8px rgba(79,70,229,0.25)' : 'var(--shadow)',
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
                {/* Color bar on top */}
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
                        style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo)', flexShrink: 0, marginLeft: 12 }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '.65')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                        View →
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
              { track: 'Finance & Quant', title: 'Quantitative Analyst', desc: 'Tailored for HFT, asset management, and fintech. Emphasises portfolio theory, risk modelling, and financial data engineering.', href: '/Poneesh_Resume_Finance.pdf', color: 'var(--indigo)', bg: 'var(--indigo-l)', grad: 'linear-gradient(135deg, var(--indigo), #818CF8)' },
              { track: 'Software Engineering', title: 'Full-Stack & Systems', desc: 'Tailored for Big Tech and engineering teams. Emphasises TypeScript, React, serverless architecture, and reliable systems.', href: '/Poneesh_Resume_Tech.pdf', color: 'var(--teal)', bg: 'var(--teal-l)', grad: 'linear-gradient(135deg, var(--teal), #2DD4BF)' },
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
          <SecLabel n="05" title="Contact" />
          <p style={{ marginTop: 16, marginBottom: 32, fontSize: 15, lineHeight: 1.75, color: 'var(--t2)', maxWidth: 460 }}>
            Building trading tools, research platforms, or internal analytics? I'm actively looking for co-op opportunities across both finance and engineering.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/poneeshkumar', hint: 'Best for intros', color: 'var(--indigo)' },
              { label: 'GitHub',   href: 'https://github.com/PoneeshKumar',          hint: 'Code & projects',  color: 'var(--indigo)' },
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
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>React · TypeScript · Tailwind</span>
        </div>
      </footer>
    </>
  )
}
 
// ── Sub-components ────────────────────────────────────────────────────────────
 
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
