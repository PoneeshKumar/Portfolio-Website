import marbleLogo from './assets/marble.jpeg'
import netnowLogo from './assets/NetNow.avif'
import rbcLogo from './assets/RBC.jpeg'
import uwfintechLogo from './assets/uwfintechclub_logo.jpeg'
import uwmwmaLogo from './assets/uwwma.jpeg'
import uwfaLogo from './assets/UWFA.jpeg'
import watstreetLogo from './assets/WatStreet.jpeg'

export type Project = { title: string; kind: string; year: string; metric?: string; impact: string; highlights?: string[]; technologies: string[]; href: string; demo?: string }
export type Role = { title: string; company: string; location?: string; period: string; logo?: string; detail: string; bullets: string[]; volunteer?: boolean }
export type TechItem = { name: string; icon: string }
export type Section = { id: string; label: string; subtitle: string }

export const techStack: TechItem[] = [
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

export const projects: Project[] = [
  {
    title: 'PurgeKV',
    kind: 'LLM inference infrastructure for Apple Silicon',
    year: '2026',
    metric: '26× faster first token',
    impact:
      'An SSD tier under the MLX prompt cache. When a chat is pushed out of RAM or lost to a restart, its KV cache is read back from SSD in about a second instead of 20–45 s of recompute, cutting agent time-to-first-token from 29.3 s to 1.13 s on a 16 GB M4.',
    highlights: [
      'Layer-streamed resume: the GPU computes layer i while layer i+1 is still arriving from SSD, so time-to-first-token approaches max(load, compute). 1.6× faster resumes with bit-identical output.',
      'Think-time prefetch reads an agent\'s chat back while it runs a tool. A 32K-token chat resumes in 0.31 s, against 169 s to recompute.',
      'Append-only segment store writes only new tokens (7.5× fewer SSD writes) and forks shared prompts without copying (3.9 GB instead of 15.2 GB).',
      'Drop-in OpenAI-compatible server. On a five-agent Qwen3-8B trading workflow, the average first-token wait fell from 15.7 s to 7.0 s.',
    ],
    technologies: ['Python', 'MLX', 'Apple Silicon', 'OpenAI API', 'pytest'],
    href: 'https://github.com/PoneeshKumar/purgekv',
  },
  {
    title: 'FlowGraph',
    metric: 'PR-AUC 0.057 → 0.735',
    kind: 'Real-Time Graph ML Fraud Engine',
    year: '2026',
    impact:
      'Processed 5.04M streaming payments through Kafka and Neo4j, using a 3-layer bidirectional GraphSAGE network to lift laundering detection PR-AUC from 0.057 to 0.735 at 0.99 ROC-AUC.',
    technologies: ['Neo4j', 'PyTorch', 'Kafka', 'Redis', 'PostgreSQL', 'FastAPI'],
    href: 'https://github.com/PoneeshKumar/FlowGraph',
  },
  { title: 'CreditLens', kind: 'Credit risk platform', year: '2026', demo: 'https://creditlens-pi.vercel.app', impact: 'Scores financial-document deterioration across multiple fiscal years and flags high-risk issuers earlier.', technologies: ['Python', 'FastAPI', 'React', 'TypeScript'], href: 'https://github.com/PoneeshKumar/CreditRisk' },
  { title: 'Portfolio Advisor', kind: 'Systematic trading research', year: '2026', metric: '25% annualized backtest', impact: 'Delivered a 25% annualized backtest across 70+ TSX and NYSE equities using momentum, RSI, and SMA signals.', technologies: ['Python', 'Pandas', 'SciPy', 'yFinance'], href: 'https://github.com/IanLeung12/CFM-Group-Project' },
  { title: 'Equity Dashboard', kind: 'Market data infrastructure', year: '2026', metric: '−30% API latency', impact: 'Reduced API latency by 30% with multi-tier caching while tracking 5,000+ active equities and AI summaries.', technologies: ['Python', 'FastAPI', 'Polygon.io', 'Streamlit'], href: 'https://github.com/Bill-Cai-2005/Marble-Dashboard' },
  { title: 'CityScapes', kind: 'AI civic technology', year: '2026', metric: '1st place hackathon', impact: 'Won first place with a parcel-level planning tool that ranks heat risk, equity, and park access.', technologies: ['React', 'Mapbox', 'Claude 3.5', 'FastAPI'], href: 'https://github.com/tanvibatchu/CityScapes' },
]

export const roles: Role[] = [
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
    bullets: [],
    volunteer: true,
  },
]

export const posts = [
  ['Designing a cache for market data', 'Notes on freshness, contention, and useful failure modes'],
  ['What makes a backtest believable?', 'A short checklist for avoiding accidental overfitting'],
  ['Building software for financial users', 'Why latency is only one part of the product'],
]

export const recognition = [
  ['1st Place - Claude UWaterloo Hackathon', 'Anthropic / University of Waterloo', '2026'],
  ['Top 12 Finalist - Google Build with AI', 'Google / National Competition', '2026'],
  ['2nd Overall - CFM Group Project', 'University of Waterloo', '2026'],
  ['President\'s Scholarship of Distinction', 'University of Waterloo', '2025'],
]

export const certifications = [
  ['AWS Fundamentals of Machine Learning and AI', 'Amazon Web Services'],
  ['Quantitative Finance & Algorithmic Trading in Python', 'Professional Certification'],
  ['Microsoft Security Essentials', 'Microsoft'],
  ['SQL for Finance Professionals', 'Corporate Finance Institute'],
]

export const sections: Section[] = [
  { id: 'work', label: 'Experience', subtitle: `${roles.filter((r) => !r.volunteer).length} roles, ${roles.filter((r) => r.volunteer).length} volunteer` },
  { id: 'projects', label: 'Projects', subtitle: `${projects.length} things I built to answer a question` },
  { id: 'skills', label: 'Stack', subtitle: `${techStack.length} tools across research and production` },
  { id: 'recognition', label: 'Recognition', subtitle: `${recognition.length} awards, ${certifications.length} certifications` },
  { id: 'blogs', label: 'Writing', subtitle: 'Notes from the build loop' },
]
