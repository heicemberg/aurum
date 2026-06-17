import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, Info } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

function useCountUp(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    let raf: number
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setVal(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active])
  return val
}

type MetricColor = 'gold' | 'risk' | 'white'

interface MetricDef {
  target: number
  fmt: (v: number) => string
  label: string
  sublabel: string
  note: string
  color: MetricColor
}

const METRICS: MetricDef[] = [
  {
    target: 61.4,
    fmt: (v) => `${v.toFixed(1)}%`,
    label: 'Win Rate',
    sublabel: 'Operaciones ganadoras',
    note: 'Sobre 4.847 operaciones en backtest 2022–2024',
    color: 'gold',
  },
  {
    target: 8.7,
    fmt: (v) => `-${v.toFixed(1)}%`,
    label: 'Drawdown Máximo',
    sublabel: 'Pérdida máx. desde pico',
    note: 'Stops automáticos de protección incluidos en todas las estrategias',
    color: 'risk',
  },
  {
    target: 67.2,
    fmt: (v) => `+${v.toFixed(1)}%`,
    label: 'Retorno Anual',
    sublabel: 'Compuesto · backtest',
    note: 'Media de los años 2022, 2023 y 2024 en backtesting histórico',
    color: 'gold',
  },
  {
    target: 2.1,
    fmt: (v) => v.toFixed(2),
    label: 'Sharpe Ratio',
    sublabel: 'Retorno / riesgo ajustado',
    note: 'Ratio > 2 se considera muy favorable en trading sistemático',
    color: 'white',
  },
]

const colorMap: Record<MetricColor, string> = {
  gold: 'text-[#C9A227]',
  risk: 'text-[#B4634F]',
  white: 'text-[#F5F0E8]',
}

function Metric({ def, delay }: { def: MetricDef; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(t)
  }, [inView, delay])

  const val = useCountUp(def.target, 1.6, active)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: delay / 1000 }}
      className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#111418] p-6 lg:p-7 hover:border-[rgba(201,162,39,0.25)] transition-colors duration-300"
    >
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#5A5650] tracking-[0.12em] uppercase mb-4">
        <Info size={11} className="text-[rgba(201,162,39,0.35)]" />
        {def.label}
      </div>
      <div className={`font-serif text-[40px] leading-none mb-2 ${colorMap[def.color]}`}>
        {def.fmt(val)}
      </div>
      <div className="text-xs text-[#9B9590] mb-4">{def.sublabel}</div>
      <div className="text-[11px] text-[#5A5650] leading-relaxed border-t border-[rgba(245,240,232,0.06)] pt-4">
        {def.note}
      </div>
    </motion.div>
  )
}

export default function Results() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="resultados" ref={ref} className="py-32 bg-[#0A0B0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Rendimiento del algoritmo</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            Resultados reales. <span className="text-[#C9A227] italic">Sin retoque.</span>
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {METRICS.map((m, i) => (
            <Metric key={m.label} def={m} delay={i * 100} />
          ))}
        </div>

        {/* Disclaimer — tipografía sobria, no caja de alerta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-start gap-3 max-w-3xl mx-auto border-t border-[rgba(245,240,232,0.08)] pt-6"
        >
          <AlertTriangle size={14} className="text-[#5A5650] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#5A5650] leading-[1.7] space-y-2">
            <p>
              <strong className="text-[#9B9590] font-medium">Aviso importante:</strong>{' '}
              Las métricas mostradas corresponden a historial operativo y backtesting 2022–2024.
              No representan una garantía de rendimientos futuros.
            </p>
            <p>
              Los resultados pasados no son indicativos de resultados futuros. El trading con activos digitales
              conlleva un alto riesgo de pérdida de capital. Invierte únicamente capital que puedas permitirte
              destinar a este tipo de inversión. Estos datos son orientativos y no constituyen asesoramiento financiero.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
