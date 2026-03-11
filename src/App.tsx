import { useEffect, useMemo, useState } from 'react'

type TickerItem = {
  label: string
  symbol: string
  value: string
  delta: string
  direction: 'up' | 'down' | 'flat'
  category: 'market' | 'dev'
}

type LiveQuote = {
  value: string
  delta: string
  direction: 'up' | 'down' | 'flat'
}

type LiveQuoteMap = Record<string, LiveQuote>

type Project = {
  title: string
  tag: 'Finance' | 'Software'
  description: string
  tech: string[]
  github?: string
}

const marketItems: TickerItem[] = [
  {
    label: 'S&P 500',
    symbol: '^GSPC',
    value: '4,972.33',
    delta: '+1.12%',
    direction: 'up',
    category: 'market',
  },
  {
    label: 'Nasdaq 100',
    symbol: '^NDX',
    value: '17,842.10',
    delta: '+0.87%',
    direction: 'up',
    category: 'market',
  },
  {
    label: 'TSX',
    symbol: '^GSPTSE',
    value: '21,145.60',
    delta: '+0.42%',
    direction: 'up',
    category: 'market',
  },
  {
    label: '10Y Gov Bond',
    symbol: 'TNX',
    value: '3.94%',
    delta: '-0.06%',
    direction: 'down',
    category: 'market',
  },
]

const devItems: TickerItem[] = [
  {
    label: 'Latest Commit',
    symbol: 'portfolio-ticker',
    value: '\"code meets capital\"',
    delta: 'React • TypeScript • Tailwind',
    direction: 'flat',
    category: 'dev',
  },
  {
    label: 'Fintech Focus',
    symbol: 'FinTech',
    value: 'Software × Finance',
    delta: 'Products, payments, and tooling',
    direction: 'flat',
    category: 'dev',
  },
  {
    label: 'Now Building',
    symbol: 'Projects',
    value: 'CFM portfolio models',
    delta: 'CFM 101 · UW coursework',
    direction: 'flat',
    category: 'dev',
  },
  {
    label: 'Featured App',
    symbol: 'FindMyVibe',
    value: 'Music taste matcher',
    delta: 'Full-stack web experience',
    direction: 'flat',
    category: 'dev',
  },
]

const projects: Project[] = [
  {
    title: 'ArtiCue',
    tag: 'Software',
    description: 'AI-powered speech therapy platform using Gemini 2.5 Flash and ElevenLabs to provide children with real-time articulation feedback—a project that earned us seed support and mentorship from Google engineers as a Top 12 winner',
    tech: ['Next.js 16, TypeScript, Tailwind CSS, Lottie, Gemini 2.5 Flash, ElevenLabs, Firebase Firestore, Auth0, Vercel, PubMed, Semantic Scholar, ERIC, and OpenAlex APIs'],
    github: 'https://youtu.be/nndhehSQGhc?si=lHNnGRCW9dgAOwoC '
  },

  {
    title: 'CFM 101 – Model-Driven Portfolio',
    tag: 'Finance',
    description:
      'Built a quantitative, model-driven portfolio that used modern portfolio theory, risk analysis, and data-driven asset selection to outperform the benchmark by ~5% over five days.',
    tech: ['Python', 'Pandas', 'Portfolio theory'],
    github: 'https://github.com/IanLeung12/CFM-Group-Project',
  },
  {
    title: 'FindMyVibe – Audio Taste Matcher',
    tag: 'Software',
    description:
      'Web app that recommends songs based on mood and listening preferences, with a Python backend and a modern, responsive frontend.',
    tech: ['Python', 'HTML', 'JavaScript'],
    github: 'https://github.com/tanvibatchu/FindMyVibe-ATM',
  },
  {
    title: 'Developer Portfolio Website',
    tag: 'Software',
    description:
      'This site – a polished, responsive portfolio for showcasing fintech and software projects, with a live-feeling ticker and focused storytelling.',
    tech: ['Vite', 'React', 'Tailwind'],
    github: 'https://github.com/PoneeshKumar/Portfolio-Website',
  },
]

const filters = ['All', 'Finance', 'Software'] as const
type Filter = (typeof filters)[number]

function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [liveQuotes, setLiveQuotes] = useState<LiveQuoteMap>({})

  const visibleProjects = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((p) => p.tag === filter),
    [filter],
  )

  const tickerItems = useMemo(
    () => [...marketItems, ...devItems, ...marketItems, ...devItems],
    [],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadQuotes() {
      const symbols = ['^GSPC', '^NDX', '^GSPTSE', '^TNX']

      try {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(','))}`
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        // Yahoo Finance quote response shape (simplified)
        const data = (await response.json()) as {
          quoteResponse?: { result?: Array<{ symbol?: string; regularMarketPrice?: number; regularMarketChangePercent?: number }> }
        }

        const result = data.quoteResponse?.result ?? []
        const next: LiveQuoteMap = {}

        for (const quote of result) {
          if (!quote.symbol || quote.regularMarketPrice == null || quote.regularMarketChangePercent == null) {
            continue
          }

          const isYield = quote.symbol === 'TNX'
          const price = quote.regularMarketPrice
          const changePct = quote.regularMarketChangePercent

          const formattedValue = isYield
            ? `${price.toFixed(2)}%`
            : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

          const direction: LiveQuote['direction'] =
            changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'flat'

          const formattedDelta = `${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%`

          next[quote.symbol] = {
            value: formattedValue,
            delta: formattedDelta,
            direction,
          }
        }

        if (Object.keys(next).length) {
          setLiveQuotes(next)
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        // If the live request fails (e.g., CORS), we silently fall back to the static values.
        // eslint-disable-next-line no-console
        console.warn('Falling back to static ticker values.', error)
      }
    }

    loadQuotes()
    const id = window.setInterval(loadQuotes, 60_000)

    return () => {
      controller.abort()
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-[0_0_20px_rgba(56,189,248,0.65)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Fintech · Software · CFM
              </p>
              <p className="text-sm text-slate-300">
                University of Waterloo · CFM
              </p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#experience" className="hover:text-sky-400">
              Experience
            </a>
            <a href="#stories" className="hover:text-sky-400">
              Stories
            </a>
            <a href="#projects" className="hover:text-sky-400">
              Projects
            </a>
            <a href="#resume" className="hover:text-sky-400">
              Resumes
            </a>
            <a href="#contact" className="hover:text-sky-400">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:pt-10">
        <section
          aria-label="Market and developer ticker"
          className="mb-8 md:mb-10"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
            <div className="flex items-center gap-3 border-b border-slate-800/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-400">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Market · Dev Ticker</span>
              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[0.65rem] font-medium text-slate-300">
                Live where available · Static fallback
              </span>
            </div>

            <div className="relative flex h-12 items-center overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-xs sm:text-sm">
              <div className="animate-marquee flex min-w-full items-center gap-6 whitespace-nowrap px-4">
                {tickerItems.map((item, index) => (
                  <TickerChip
                    item={item}
                    liveQuotes={liveQuotes}
                    key={`${item.label}-${index}`}
                  />
                ))}
              </div>
              <div
                className="animate-marquee2 pointer-events-none absolute inset-0 flex min-w-full items-center gap-6 whitespace-nowrap px-4"
                aria-hidden="true"
              >
                {tickerItems.map((item, index) => (
                  <TickerChip
                    item={item}
                    liveQuotes={liveQuotes}
                    key={`ghost-${item.label}-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Hero"
          className="mb-14 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>CFM · University of Waterloo</span>
            </div>
            <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Bridging the gap between{' '}
              <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                Finance
              </span>{' '}
              and{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                Scalable Software.
              </span>
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              I&apos;m a Computing and Financial Management student at the University
              of Waterloo with a passion for building products where software and finance meet.
              From model-driven portfolios to full-stack web apps, I focus on clear engineering
              that supports real users in the fintech space.
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              <Pill label="Fintech & Product" />
              <Pill label="Software & Finance" />
              <Pill label="Type-Safe Frontends" />
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#resume"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-[0_14px_40px_rgba(56,189,248,0.55)] hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Pick your resume path
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-sky-500/80 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                View selected projects
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>Signal Console</span>
              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[0.7rem]">
                Where code meets capital
              </span>
            </div>
            <div className="mb-3 rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs font-mono text-slate-200">
              <p className="mb-2 text-[0.7rem] text-slate-400">
                ./profile --snapshot uwaterloo --focus fintech
              </p>
              <div className="space-y-1.5 text-[0.75rem]">
                <TerminalRow label="Core focus" value="Fintech products · backend systems" />
                <TerminalRow
                  label="Recent"
                  value="CFM 101 model-driven portfolio · full-stack side projects"
                />
                <TerminalRow
                  label="Edge"
                  value="Strong fundamentals + detail-oriented engineering for product teams"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                  Fintech
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  Computing &amp; Financial Management
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-400">
                  Blending software engineering with capital markets and finance.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                  Focus
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  Data, products, and tooling
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-400">
                  Building systems that make financial decisions clearer and faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="experience"
          aria-label="Experience"
          className="mb-14 space-y-6"
        >
          <SectionHeading
            eyebrow="Experience"
            title="Recent roles across finance and software"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Finance &amp; Investment Experience
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-slate-100">
                    Financial Analyst · University of Waterloo Wealth Management
                  </p>
                  <p className="text-slate-400">Jan 2026 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Managed portfolio records and maintained structured performance and tracking
                      models for analysis.
                    </li>
                    <li>
                      Built quantitative frameworks in Excel to analyze returns, benchmarks, and
                      portfolio risk metrics.
                    </li>
                    <li>
                      Applied data-driven market research and screening methods to support
                      investment thesis development.
                    </li>
                    <li>
                      Automated performance reporting to visualize portfolio trends and key return
                      drivers.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    M&amp;A Market Research Analyst · UW Finance Association
                  </p>
                  <p className="text-slate-400">Jan 2026 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Identified acquisition opportunities by conducting industry and market research
                      to support M&amp;A screening efforts.
                    </li>
                    <li>
                      Built target screening lists by assessing strategic fit, financial performance,
                      and market positioning to prioritize candidates.
                    </li>
                    <li>
                      Benchmarked valuation multiples by analyzing comps and precedent transactions to
                      support deal evaluation and pricing.
                    </li>
                    <li>
                      Supported investment theses by summarizing findings into executive-ready slides
                      and memos for management.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    Investment Analyst · UW FinTech Club
                  </p>
                  <p className="text-slate-400">Oct 2025 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Evaluated fintech investments by researching companies and market trends to
                      identify growth opportunities.
                    </li>
                    <li>
                      Built DCF models by forecasting cash flows and terminal values to support
                      valuation-driven recommendations.
                    </li>
                    <li>
                      Monitored portfolio performance by tracking positions across a student-managed
                      equity portfolio to identify risks and upside.
                    </li>
                    <li>
                      Influenced investment decisions by collaborating with fellow analysts to pitch
                      ideas to the investment committee.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    Bookkeeper · KumaraShivShakti Inc.
                  </p>
                  <p className="text-slate-400">Sep 2024 – Present · Hamilton, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Designed data-cleaning and validation workflows improving reporting accuracy
                      for a $7M+ real-estate portfolio.
                    </li>
                    <li>
                      Built automated dashboards and forecasting tools enabling rapid, data-driven
                      decisions for leadership.
                    </li>
                    <li>
                      Developed KPI frameworks tracking efficiency metrics and providing real-time
                      operational visibility.
                    </li>
                    <li>
                      Built scalable data pipelines integrating multiple sources to support automated
                      analytics and workflows.
                    </li>
                  </ul>
                </div>
              </div>
            </article>
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Software &amp; Automation Experience
              </h3>
              <div className="mb-3 text-xs text-slate-400">
                <div>
                  <p className="font-semibold text-slate-100">
                    Co-Founder &amp; CTO · Stealth
                  </p>
                  <p className="text-slate-400">Mar 2025 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Architected an all-in-one Financial OS integrating real-time banking and an ML-driven risk engine
                    </li>
                    <li>
                      Engineered scalable data pipelines for automated expense categorization and real-time portfolio volatility analysis.
                    </li>
                    <li>
                      Spearheaded secure (SOC 2) roadmaps and freemium models to capture 3M+ users displaced by Mint’s exit
                    </li>
                    <li>
                      Made a personalized market intelligence feed with sentiment tagging automating diversification and risk flags
                    </li>
                    </ul>
                </div>
                </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-slate-100">
                    Software Engineer (Finance) · Marble Investments
                  </p>
                  <p className="text-slate-400">Jan 2026 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Engineered internal financial tooling to automate research, portfolio
                      monitoring, and investment workflows.
                    </li>
                    <li>
                      Integrated real-time market data via Massive API, building scalable pipelines
                      for analytics and decision support.
                    </li>
                    <li>
                      Developed quantitative dashboards and analytics systems to track performance,
                      risk, and trading signals.
                    </li>
                    <li>
                      Built web interfaces to streamline data access and reduce friction between
                      investment and engineering workflows.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    Data &amp; Research Analyst · Nodal Research
                  </p>
                  <p className="text-slate-400">Jan 2026 – Present · Waterloo, ON</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                    <li>
                      Analyzed market and fundamental datasets to identify key return drivers and
                      portfolio risk exposures.
                    </li>
                    <li>
                      Built Python workflows to clean, merge, and analyze large financial time-series
                      datasets.
                    </li>
                    <li>
                      Assessed portfolio risk for a $1.2M AUM fund using volatility, correlations, and
                      drawdown metrics.
                    </li>
                    <li>
                      Transformed quantitative findings into clear, actionable insights for
                      investment decisions.
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Finance Certifications
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs sm:text-sm text-slate-300">
                <li>CFI Financial Analysis and Modelling</li>
                <li>CFI Corporate Finance Foundations</li>
                <li>PMI Finance Foundations: Risk Management</li>
              </ul>
            </article>
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Tech &amp; Quant Certifications
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs sm:text-sm text-slate-300">
                <li>Quantitative Finance &amp; Algorithmic Trading in Python</li>
                <li>Microsoft Security Essentials</li>
                <li>SQL for Finance</li>
              </ul>
            </article>
          </div>
        </section>

        <section
          id="stories"
          aria-label="Stories"
          className="mb-14 space-y-6"
        >
          <SectionHeading eyebrow="Stories" title="How I think about software in finance" />
          <div className="grid gap-4 md:grid-cols-2">
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Story 1 · The Logic
              </h3>
              <p className="text-sm text-slate-300">
                In a CFM 101 group project, we built a quantitative,
                model-driven portfolio that applied modern portfolio theory,
                risk analysis, and data-driven asset selection to a real set of
                tickers.
              </p>
              <p className="text-sm text-slate-400">
                The biggest lesson: theory is powerful, but the real advantage
                comes from clean data, clear constraints, and code that makes
                portfolio behaviour easy to explain.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Story 2 · The Build
              </h3>
              <p className="text-sm text-slate-300">
                On a full-stack web project like <span className="font-semibold">FindMyVibe</span>, I
                learned how much UX, state management, and API design matter
                when you want people to actually enjoy using a product.
              </p>
              <p className="text-sm text-slate-400">
                Now I think in terms of <span className="font-semibold">data flows, invariants, and
                failure modes</span> first—then I let the UI tell that story to
                users as simply as possible.
              </p>
            </article>
            <article className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5">
              <h3 className="text-sm font-semibold text-slate-100">
                Story 3 · The Reasoning
              </h3>
              <p className="text-sm text-slate-300">
                We built ArtiCue to solve a critical healthcare gap in Canada, where over 20% of preschoolers face speech impediments but families often endure 8-month waitlists for government-funded therapy. With private sessions costing up to $4,000 per month, many children in rural or low-income communities miss the vital early intervention window.
                By leveraging Gemini’s multimodal AI, we wanted to put a clinically-grounded speech coach in the pocket of every parent—ensuring that while a child waits for a specialist, they aren't waiting to improve.
              </p>
              <p className="text-sm text-slate-400">
                This project taught me that the most important part of building software for finance (or any field) is deeply understanding the problem you want to solve, and making sure your code and product decisions are always in service of that.
              </p>
            </article>
          </div>
        </section>

        <section
          id="projects"
          aria-label="Projects"
          className="mb-14 space-y-6"
        >
          <SectionHeading
            eyebrow="Projects"
            title="Selected work across finance and software"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === f
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {visibleProjects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">
                      {project.title}
                    </h3>
                    <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[0.65rem] font-medium text-slate-300">
                      {project.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {project.description}
                  </p>
                </div>
                {'github' in project && project.github ? (
                  <a
                    href={project.github}
                    className="mt-1 text-xs font-medium text-sky-400 hover:text-sky-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on GitHub →
                  </a>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[0.7rem] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="resume" aria-label="Resume hub" className="mb-20 space-y-8">
          <SectionHeading eyebrow="Resumes" title="Dual-Track Professional Profiles" />
          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="/Poneesh_Resume_Finance.pdf"
              download="Poneesh_Resume_Finance.pdf"
              className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-8 transition-all hover:border-emerald-400/50 hover:bg-emerald-400/[0.02] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="h-20 w-20 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Finance & Investments</p>
                <h3 className="mb-3 text-lg font-bold text-white">Quantitative Analyst Focus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Tailored for investments, asset management, and hedge funds. Emphasizes portfolio theory, risk modeling, and financial data engineering.</p>
              </div>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </p>
            </a>

            <a
              href="/Poneesh_Resume_Tech.pdf"
              download="Poneesh_Resume_Tech.pdf"
              className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-8 transition-all hover:border-sky-400/50 hover:bg-sky-400/[0.02] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="h-20 w-20 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Software Engineering</p>
                <h3 className="mb-3 text-lg font-bold text-white">Full-Stack & Systems Focus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Tailored for Big Tech and Quant teams. Emphasizes python, Typescript, Serverless architecture, and reliable systems.</p>
              </div>
              <p className="text-xs font-bold text-sky-400 flex items-center gap-2">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </p>
            </a>
          </div>
        </section>

        <section
          id="contact"
          aria-label="Contact"
          className="mb-4 space-y-4"
        >
          <SectionHeading eyebrow="Contact" title="Let’s talk about your team" />
          <p className="max-w-xl text-sm text-slate-300">
            Whether you&apos;re building trading tools, research platforms, or
            internal analytics dashboards, I&apos;m excited to contribute as a
            Waterloo co-op student who cares about both the math and the
            engineering.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <ContactLink
              label="LinkedIn"
              href="https://www.linkedin.com/in/poneeshkumar"
              hint="Best place for a quick intro"
            />
            <ContactLink
              label="GitHub"
              href="https://github.com/PoneeshKumar"
              hint="Code, projects, and experiments"
            />
            <ContactLink
              label="Email"
              href="mailto:poneesh.kumar@uwaterloo.ca"
              hint="For detailed conversations or resumes"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-950/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Where code meets capital.</p>
          <p className="text-[0.7rem]">
            Built with React, TypeScript, Tailwind, and a scrolling ticker that
            actually feels at home in finance.
          </p>
        </div>
      </footer>
    </div>
  )
}

function TickerChip({
  item,
  liveQuotes,
}: {
  item: TickerItem
  liveQuotes: LiveQuoteMap
}) {
  const live = item.symbol in liveQuotes ? liveQuotes[item.symbol] : undefined
  const value = live?.value ?? item.value
  const delta = live?.delta ?? item.delta
  const direction = live?.direction ?? item.direction

  const color =
    direction === 'up'
      ? 'text-emerald-300'
      : direction === 'down'
        ? 'text-rose-300'
        : 'text-slate-300'

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.85)]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          item.category === 'market' ? 'bg-emerald-400' : 'bg-sky-400'
        }`}
      />
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-slate-400">
        {item.label}
      </span>
      <span className="text-[0.7rem] text-slate-300">{item.symbol}</span>
      <span className="text-[0.7rem] text-slate-100">{value}</span>
      <span className={`text-[0.7rem] font-medium ${color}`}>
        {delta}
      </span>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="text-sm font-semibold text-slate-100 sm:text-base">
        {title}
      </h2>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
      {label}
    </span>
  )
}

function TerminalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-24 shrink-0 text-slate-500">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  )
}

function ContactLink({
  label,
  href,
  hint,
}: {
  label: string
  href: string
  hint: string
}) {
  return (
    <a
      href={href}
      className="group inline-flex flex-col rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-sky-500/80 hover:bg-slate-950"
    >
      <span className="font-medium">{label}</span>
      <span className="text-[0.7rem] text-slate-400 group-hover:text-slate-300">
        {hint}
      </span>
    </a>
  )
}

export default App
