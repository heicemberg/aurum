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
      label: 'Lo que ganarías al mes',
      value: <><AnimatedValue target={monthlyLow} format={fmt} /> – <AnimatedValue target={monthlyHigh} format={fmt} /></>,
      sub: `Entre ${(MONTHLY_LOW * 100).toFixed(1)}% y ${(MONTHLY_HIGH * 100).toFixed(1)}% mensual estimado`,
    },
    {
      Icon: Calendar,
      label: 'Lo que ganarías en un año',
      value: <><AnimatedValue target={yearLow} format={fmt} /> – <AnimatedValue target={yearHigh} format={fmt} /></>,
      sub: `Entre +${((Math.pow(1 + MONTHLY_LOW, 12) - 1) * 100).toFixed(1)}% y +${((Math.pow(1 + MONTHLY_HIGH, 12) - 1) * 100).toFixed(1)}% anual estimado`,
    },
    {
      Icon: Wallet,
      label: 'Tu dinero total al año',
      value: <><AnimatedValue target={capital + yearLow} format={fmt} /> – <AnimatedValue target={capital + yearHigh} format={fmt} /></>,
      sub: 'Tu inversión inicial + lo que ganaste',
    },
  ]

  return (
    <section ref={ref} className="py-32 bg-[#F8F7F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Calculadora de ganancias</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] leading-tight tracking-tight">
            ¿Cuánto podría crecer tu dinero?
          </h2>
          <p className="text-[#6B6862] mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Mueve la barra y ve cuánto podrías ganar según nuestro historial real.
            Son estimaciones: los resultados pueden variar según el mercado.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 lg:p-12"
        >
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-5">
              <label className="font-mono text-xs text-[#9A9590] tracking-[0.15em] uppercase">Dinero a invertir</label>
              <span className="font-serif text-4xl text-[#1A1918]">
                <AnimatedValue target={capital} format={fmt} />
                <span className="text-[#9A9590] text-xl ml-2">USD</span>
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
              style={{ background: `linear-gradient(to right, #C9A227 ${pct}%, rgba(0,0,0,0.1) ${pct}%)` }}
            />
            <div className="flex justify-between mt-3 font-mono text-xs text-[#B8B4AF]">
              <span>$300 mínimo</span>
              <span>$10,000</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {CARDS.map(({ Icon, label, value, sub }) => (
              <div key={label} className="rounded-xl border border-black/[0.07] bg-[#F8F7F5] p-5 lg:p-6">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9A9590] tracking-[0.12em] uppercase mb-3">
                  <Icon size={11} className="text-[#C9A227]/60" />
                  {label}
                </div>
                <div className="font-serif text-xl lg:text-2xl text-[#C9A227] leading-tight mb-2">{value}</div>
                <div className="text-[11px] text-[#9A9590] leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 border-t border-black/[0.06] pt-5">
            <AlertTriangle size={14} className="text-[#9A9590] flex-shrink-0 mt-px" />
            <p className="text-[12px] text-[#9A9590] leading-[1.7]">
              <strong className="text-[#4A4845] font-medium">Cálculo orientativo</strong>{' '}
              basado en nuestro historial de trabajo. Las ganancias pasadas no garantizan lo mismo en el futuro.
              Invertir en activos digitales conlleva riesgo de perder parte del dinero invertido.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
