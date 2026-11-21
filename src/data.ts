import marbleLogo from './assets/marble.jpeg'
import netnowLogo from './assets/NetNow.avif'
import rbcLogo from './assets/RBC.jpeg'
import uwfintechLogo from './assets/uwfintechclub_logo.jpeg'
import uwmwmaLogo from './assets/uwwma.jpeg'
import uwfaLogo from './assets/UWFA.jpeg'
import watstreetLogo from './assets/WatStreet.jpeg'

export type Project = { slug: string; title: string; kind: string; year: string; metric?: string; impact: string; highlights?: string[]; technologies: string[]; href: string; demo?: string }
export type Role = { title: string; company: string; location?: string; period: string; logo?: string; detail: string; bullets: string[]; volunteer?: boolean; current?: boolean }
export type TechItem = { name: string; icon?: string }
export type Section = { id: string; label: string }

export const profile = {
  name: 'Poneesh Kumar',
  school: 'CS + Finance / University of Waterloo',
  now: { role: 'Quantitative Developer Intern', org: 'RBC Global Asset Management' },
  lede: 'I build data pipelines, ML trading signals and LLM infrastructure for quant and fintech teams.',
  email: 'poneesh.kumar@uwaterloo.ca',
  links: [
    { label: 'GitHub', href: 'https://github.com/PoneeshKumar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/poneeshkumar' },
    { label: 'X', href: 'https://x.com/PoneeshK' },
  ],
  stats: [
    { value: '$41B', label: 'AUM fund my signals feed' },
    { value: '26×', label: 'faster LLM first token' },
    { value: '5.0M', label: 'transactions scored live' },
    { value: '1st', label: 'Claude UWaterloo Hackathon' },
  ],
}

export const skillGroups: { name: string; items: TechItem[] }[] = [
  { name: 'Languages', items: [{ name: 'Python', icon: 'python' }, { name: 'C', icon: 'c' }, { name: 'TypeScript', icon: 'typescript' }, { name: 'JavaScript', icon: 'javascript' }, { name: 'SQL', icon: 'postgresql' }, { name: 'R', icon: 'r' }] },
  { name: 'Data & Quant', items: [{ name: 'PySpark', icon: 'apachespark' }, { name: 'NumPy', icon: 'numpy' }, { name: 'Pandas', icon: 'pandas' }, { name: 'Polars', icon: 'polars' }, { name: 'SciPy', icon: 'scipy' }, { name: 'PyTorch', icon: 'pytorch' }, { name: 'PyTorch Geometric', icon: 'pyg' }, { name: 'Scikit-learn', icon: 'scikitlearn' }, { name: 'QuantLib' }] },
  { name: 'Backend & Systems', items: [{ name: 'Django REST', icon: 'django' }, { name: 'FastAPI', icon: 'fastapi' }, { name: 'Flask', icon: 'flask' }, { name: 'React', icon: 'react' }, { name: 'Pytest', icon: 'pytest' }, { name: 'Concurrency' }] },
  { name: 'AI & Infrastructure', items: [{ name: 'LLM Agents' }, { name: 'MCP', icon: 'modelcontextprotocol' }, { name: 'vLLM' }, { name: 'MLX' }, { name: 'Kafka', icon: 'apachekafka' }, { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'Neo4j', icon: 'neo4j' }, { name: 'Redis', icon: 'redis' }, { name: 'Docker', icon: 'docker' }, { name: 'GitHub Actions', icon: 'githubactions' }, { name: 'GCP', icon: 'googlecloud' }, { name: 'Databricks', icon: 'databricks' }] },
]

export const projects: Project[] = [
  {
    slug: 'purgekv',
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
    slug: 'flowgraph',
    title: 'FlowGraph',
    kind: 'Real-time AML intelligence',
    year: '2026',
    metric: '0.724 PR-AUC, ~78% precision',
    impact:
      'A real-time anti-money-laundering pipeline that streams 5.0M transactions across 513K accounts and scores every account with a graph neural network on the shape of the money around it.',
    highlights: [
      'Kafka/Faust ingestion into PostgreSQL, with a transactional outbox keeping the Neo4j graph and Redis cache in sync.',
      '3-layer bidirectional GraphSAGE over 47 node features: 0.724 PR-AUC and ~78% precision on the IBM AML benchmark.',
      'FastAPI and React services for graph exploration, live scoring, alerts and explainability, backed by ~560 automated tests.',
    ],
    technologies: ['Python', 'Kafka', 'PostgreSQL', 'Neo4j', 'Redis', 'PyTorch'],
    href: 'https://github.com/PoneeshKumar/FlowGraph',
  },
  {
    slug: 'creditlens',
    title: 'CreditLens',
    kind: 'Credit risk platform',
    year: '2026',
    impact: 'Scores financial-document deterioration across multiple fiscal years and flags high-risk issuers earlier.',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript'],
    href: 'https://github.com/PoneeshKumar/CreditRisk',
    demo: 'https://creditlens-pi.vercel.app',
  },
  {
    slug: 'equity-dashboard',
    title: 'Equity Dashboard',
    kind: 'Market data infrastructure',
    year: '2026',
    metric: '−30% API latency',
    impact: 'Reduced API latency by 30% with multi-tier caching while tracking 5,000+ active equities and AI summaries.',
    technologies: ['Python', 'FastAPI', 'Polygon.io', 'Streamlit'],
    href: 'https://github.com/Bill-Cai-2005/Marble-Dashboard',
  },
  {
    slug: 'articue',
    title: 'ArtiCue',
    kind: 'AI speech therapy',
    year: '2026',
    metric: 'Top 12 of 800+ teams',
    impact: 'A full-stack speech therapy app shipped in one weekend at Google Build with AI, with mentorship from Google engineers.',
    highlights: ['Schema-based verification on Gemini outputs cut measured hallucination rates below 1%.'],
    technologies: ['TypeScript', 'Next.js', 'Gemini', 'Firebase'],
    href: 'https://github.com/tanvibatchu/articue',
  },
  {
    slug: 'portfolio-advisor',
    title: 'Portfolio Advisor',
    kind: 'Portfolio optimization',
    year: '2026',
    metric: '2nd overall, ~5% over benchmark',
    impact: 'Placed 2nd in a program-wide portfolio competition with mean-variance optimization, beating the benchmark by ~5%.',
    highlights: ['Python pipeline that cleans and normalizes equity datasets for matrix-based portfolio optimization.'],
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    href: 'https://github.com/IanLeung12/CFM-Group-Project',
  },
  {
    slug: 'cityscapes',
    title: 'CityScapes',
    kind: 'AI civic technology',
    year: '2026',
    metric: '1st place hackathon',
    impact: 'Won first place with a parcel-level planning tool that ranks heat risk, equity, and park access.',
    technologies: ['React', 'Mapbox', 'Claude 3.5', 'FastAPI'],
    href: 'https://github.com/tanvibatchu/CityScapes',
  },
]

export const roles: Role[] = [
  {
    title: 'Quantitative Developer Intern',
    company: 'RBC Global Asset Management',
    location: 'Toronto, ON',
    period: 'Sep 2026 - Dec 2026',
    logo: rbcLogo,
    current: true,
    detail: 'Production ML signal pipelines with quant researchers for a $41B AUM fund.',
    bullets: [
      'Productionized ML signal pipelines with quant researchers, now driving 20% of the alpha strategy for a $41B AUM fund.',
      'Migrated MATLAB preprocessing pipelines for trading signals to Python and Databricks, parallelizing the workload to cut runtime 5×, with regression suites verifying numerical parity across 7+ regions and 5+ signals.',
      'Built daily signal pipelines from raw data to factor scores across 7+ regions and 20M rows, completing in 15 minutes.',
      'Created a /handoff agent command that fills a Confluence research template from the researcher\'s agent context and uploads the PDF through an MCP server, standardizing research-to-dev handoffs.',
    ],
  },
  {
    title: 'Software Engineering Intern',
    company: 'NetNow Financial',
    location: 'Toronto, ON',
    period: 'May 2026 - Aug 2026',
    logo: netnowLogo,
    detail: 'Agentic AI and full-stack product engineering for credit workflows.',
    bullets: [
      'Designed async multi-agent orchestration on GCP, moving long-running workflows off the UI to cut completion time 50%.',
      'Built an AI assistant letting ~100K users search credit files, using Gemma 4B, vLLM, NeMo Guardrails and Pydantic.',
      'Owned React and Django REST services, shipping multi-tenant hierarchy views and verification dashboards with E2E tests.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Marble Investments',
    location: 'Waterloo, ON',
    period: 'Jan 2026 - Present',
    logo: marbleLogo,
    current: true,
    detail: 'Market-data infrastructure and signals for a $2M AUM fund.',
    bullets: [
      'Parallelized market-data ingestion for 5,000+ global equities, reducing end-to-end latency from 5 minutes to 1 minute.',
      'Wrote cleaning and feature-extraction pipelines in NumPy and Polars, building cross-sectional covariance and volume signals.',
      'Set up background workers for multi-day equity analysis, sending automated reports via SendGrid.',
    ],
  },
  {
    title: 'ML Engineer',
    company: 'World Order Book (WatStreet)',
    location: 'Waterloo, ON',
    period: '2026 - Present',
    logo: watstreetLogo,
    detail: 'Reinforcement learning for trade execution in a simulated limit order book.',
    bullets: [
      'Built a simulated limit-order-book execution environment to benchmark Double DQN policies against classical execution strategies on historical market data.',
      'Evaluated policies on implementation shortfall, transaction costs and execution quality, tuning exploration across simulated scenarios.',
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
  ['Top 12 of 800+ teams - Google Build with AI', 'Google / National Competition', '2026'],
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
  { id: 'work', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Stack' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'blogs', label: 'Writing' },
]
