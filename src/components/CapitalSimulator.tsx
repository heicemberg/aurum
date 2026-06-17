import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, TrendingUp, Calendar, Wallet } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const MONTHLY_LOW = 0.028
const MONTHLY_HIGH = 0.067

function fmt(value: number): string {
  return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value))
}

function AnimatedValue({ target, format }: { target: number; format: (v: number) => string }) {
  const [current, setCurrent] = useState(target)
  const currentRef = useRef(target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const from = currentRef.current
    const to = target
    const duration = 480
    let startTs: number | null = null
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const p = Math.min((ts - startTs) / duration, 1)
      const v = from + (to - from) * (1 - Math.pow(1 - p, 2))
      currentRef.current = v
      setCurrent(v)
      if (p < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target])

  return <>{format(current)}</>
}

export default function CapitalSimulator() {
  const [capital, setCapital] = useState(1000)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const pct = ((capital - 300) / 9700) * 100
  const monthlyLow = capital * MONTHLY_LOW
  const monthlyHigh = capital * MONTHLY_HIGH
  const yearLow = capital * Math.pow(1 + MONTHLY_LOW, 12) - capital
  const yearHigh = capital * Math.pow(1 + MONTHLY_HIGH, 12) - capital

  const CARDS = [
    {
      Icon: TrendingUp,
      label: 'Ganancia mensual est.',
      value: <><AnimatedValue target={monthlyLow} format={fmt} /> – <AnimatedValue target={monthlyHigh} format={fmt} /> USDT</>,
      sub: `${(MONTHLY_LOW * 100).toFixed(1)}% – ${(MONTHLY_HIGH * 100).toFixed(1)}% mensual`,
    },
    {
      Icon: Calendar,
      label: 'Ganancia anual est.',
      value: <><AnimatedValue target={yearLow} format={fmt} /> – <AnimatedValue target={yearHigh} format={fmt} /> USDT</>,
      sub: `+${((Math.pow(1 + MONTHLY_LOW, 12) - 1) * 100).toFixed(1)}% – +${((Math.pow(1 + MONTHLY_HIGH, 12) - 1) * 100).toFixed(1)}%`,
    },
    {
      Icon: Wallet,
      label: 'Capital proyectado (12 m)',
      value: <><AnimatedValue target={capital + yearLow} format={fmt} /> – <AnimatedValue target={capital + yearHigh} format={fmt} /> USDT</>,
      sub: 'Capital inicial + ganancia estimada',
    },
  ]

  return (
    <section ref={ref} className="py-32 bg-[#0A0B0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Simulador de capital</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] leading-tight tracking-tight">
            ¿Cómo puede crecer tu inversión?
          </h2>
          <p className="text-[#5A5650] mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Mueve el slider y observa una proyección basada en el rendimiento histórico
            de nuestra operativa. Es orientativo — los resultados reales pueden variar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="rounded-2xl border border-[rgba(201,162,39,0.15)] bg-[#111418] p-8 lg:p-12"
        >
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-5">
              <label className="font-mono text-xs text-[#5A5650] tracking-[0.15em] uppercase">Capital a invertir</label>
              <span className="font-serif text-4xl text-[#F5F0E8]">
                <AnimatedValue target={capital} format={fmt} />
                <span className="text-[#5A5650] text-xl ml-2">USDT</span>
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={10000}
              step={100}
              value={capital}
              onChange={e => setCapital(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, #C9A227 ${pct}%, rgba(201,162,39,0.15) ${pct}%)` }}
            />
            <div className="flex justify-between mt-2.5 font-mono text-xs text-[#3D3A36]">
              <span>$300 USDT</span>
              <span>$10,000 USDT</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {CARDS.map(({ Icon, label, value, sub }) => (
              <div key={label} className="rounded-xl border border-[rgba(245,240,232,0.07)] p-5 lg:p-6">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#5A5650] tracking-[0.12em] uppercase mb-3">
                  <Icon size={11} className="text-[rgba(201,162,39,0.5)]" />
                  {label}
                </div>
                <div className="font-serif text-xl lg:text-2xl text-[#C9A227] leading-tight mb-2">{value}</div>
                <div className="text-[11px] text-[#5A5650] leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 border-t border-[rgba(245,240,232,0.08)] pt-5">
            <AlertTriangle size={14} className="text-[#5A5650] flex-shrink-0 mt-px" />
            <p className="text-[12px] text-[#5A5650] leading-[1.7]">
              <strong className="text-[#9B9590] font-medium">Proyección ilustrativa</strong>{' '}
              basada en historial operativo. Las rentabilidades pasadas no garantizan resultados futuros.
              El trading con activos digitales conlleva riesgo significativo de pérdida de capital.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
