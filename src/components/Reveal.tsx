import { motion } from 'framer-motion'

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export function SectionHeader({ index, kicker, title, intro }: { index: number; kicker: string; title: string; intro: string }) {
  return (
    <Reveal>
      <header className="section-intro">
        <p className="kicker">{String(index).padStart(2, '0')} / {kicker}</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </header>
    </Reveal>
  )
}
