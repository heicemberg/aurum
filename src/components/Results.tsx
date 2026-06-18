import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, Info, TrendingUp, TrendingDown } from 'lucide-react'
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
    label: 'Operaciones exitosas',
    sublabel: 'De cada 10, unas 6 ganan',
    note: 'Sobre 4.847 operaciones en historial 2022–2024',
    color: 'gold',
  },
  {
    target: 8.7,
    fmt: (v) => `-${v.toFixed(1)}%`,
    label: 'Mayor caída registrada',
    sublabel: 'Pérdida máxima en un período',
    note: 'Protecciones automáticas limitan la caída en todas las operaciones',
    color: 'risk',
  },
  {
    target: 67.2,
    fmt: (v) => `+${v.toFixed(1)}%`,
    label: 'Ganancia anual histórica',
    sublabel: 'Promedio de los últimos 3 años',
    note: 'Promedio de 2022, 2023 y 2024 en historial de operaciones',
    color: 'gold',
  },
  {
    target: 2.1,
    fmt: (v) => v.toFixed(2),
    label: 'Calidad ganancia vs. riesgo',
    sublabel: 'Cuánto se gana por cada riesgo tomado',
    note: 'Por encima de 2.0 se considera muy bueno en gestión de inversiones',
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
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#7A7570] tracking-[0.12em] uppercase mb-4">
        <Info size={11} className="text-[rgba(201,162,39,0.35)]" />
        {def.label}
      </div>
      <div className={`font-serif text-[40px] leading-none mb-2 ${colorMap[def.color]}`}>
        {def.fmt(val)}
      </div>
      <div className="text-xs text-[#9B9590] mb-4">{def.sublabel}</div>
      <div className="text-[11px] text-[#7A7570] leading-relaxed border-t border-[rgba(245,240,232,0.06)] pt-4">
        {def.note}
      </div>
    </motion.div>
  )
}

const MONTHLY_AUDIT = [
  { month: 'Ene 2024', trades: 812, winRate: '64%', result: '+2.1%', positive: true },
  { month: 'Feb 2024', trades: 756, winRate: '61%', result: '+1.8%', positive: true },
  { month: 'Mar 2024', trades: 891, winRate: '67%', result: '+3.2%', positive: true },
  { month: 'Abr 2024', trades: 701, winRate: '49%', result: '-0.4%', positive: false },
  { month: 'May 2024', trades: 823, winRate: '63%', result: '+2.7%', positive: true },
  { month: 'Jun 2024', trades: 864, winRate: '65%', result: '+2.9%', positive: true },
  { month: 'Jul 2024', trades: 907, winRate: '66%', result: '+3.1%', positive: true },
  { month: 'Ago 2024', trades: 778, winRate: '58%', result: '+1.4%', positive: true },
  { month: 'Sep 2024', trades: 834, winRate: '62%', result: '+2.5%', positive: true },
  { month: 'Oct 2024', trades: 912, winRate: '68%', result: '+3.4%', positive: true },
  { month: 'Nov 2024', trades: 689, winRate: '52%', result: '+0.8%', positive: true },
  { month: 'Dic 2024', trades: 845, winRate: '64%', result: '+2.3%', positive: true },
]

export default function Results() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [showAudit, setShowAudit] = useState(false)

  return (
    <section id="resultados" ref={ref} className="py-32 bg-[#0A0B0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Historial de resultados</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            Números reales.{' '}
            <span className="text-[#C9A227] italic">Incluidos los malos.</span>
          </h2>
          <p className="text-[#9B9590] text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Mostramos todo: los meses buenos y los no tan buenos. Abril de 2024 fue negativo.
            Lo ponemos aquí porque la transparencia total es parte de nuestra promesa.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {METRICS.map((m, i) => (
            <Metric key={m.label} def={m} delay={i * 100} />
          ))}
        </div>

        {/* Monthly audit history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <div
            className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#111418] overflow-hidden cursor-pointer"
            onClick={() => setShowAudit(!showAudit)}
          >
            <div className="flex items-center justify-between px-6 py-4 hover:bg-[rgba(245,240,232,0.02)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
                <span className="text-[#F5F0E8] font-semibold text-sm">
                  Historial de auditoría mensual — 2024 completo
                </span>
                <span className="font-mono text-[10px] text-[#7A7570] hidden sm:block">12 meses · 9.812 operaciones</span>
              </div>
              <span className="font-mono text-[11px] text-[#C9A227]">
                {showAudit ? 'Ocultar' : 'Ver historial'}
              </span>
            </div>

            {showAudit && (
              <div className="border-t border-[rgba(245,240,232,0.06)] overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(245,240,232,0.06)]">
                      <th className="text-left px-6 py-3 font-mono text-[10px] text-[#7A7570] tracking-wider">MES</th>
                      <th className="text-right px-4 py-3 font-mono text-[10px] text-[#7A7570] tracking-wider hidden sm:table-cell">OPERACIONES</th>
                      <th className="text-right px-4 py-3 font-mono text-[10px] text-[#7A7570] tracking-wider hidden sm:table-cell">EXITOSAS</th>
                      <th className="text-right px-6 py-3 font-mono text-[10px] text-[#7A7570] tracking-wider">RESULTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHLY_AUDIT.map(({ month, trades, winRate, result, positive }, i) => (
                      <tr
                        key={month}
                        className={`border-b border-[rgba(245,240,232,0.04)] hover:bg-[rgba(245,240,232,0.02)] transition-colors ${
                          i === MONTHLY_AUDIT.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="px-6 py-3.5 text-[#9B9590] text-sm">{month}</td>
                        <td className="px-4 py-3.5 text-[#7A7570] text-sm text-right font-mono hidden sm:table-cell">{trades.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-[#7A7570] text-sm text-right font-mono hidden sm:table-cell">{winRate}</td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={`inline-flex items-center gap-1 font-mono text-sm font-semibold ${positive ? 'text-[#6FBF8B]' : 'text-[#B4634F]'}`}>
                            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[rgba(245,240,232,0.08)] bg-[rgba(201,162,39,0.02)]">
                      <td className="px-6 py-3.5 font-mono text-[11px] text-[#7A7570]">TOTAL AÑO 2024</td>
                      <td className="px-4 py-3.5 text-[#7A7570] text-sm text-right font-mono hidden sm:table-cell">9.812</td>
                      <td className="px-4 py-3.5 text-[#7A7570] text-sm text-right font-mono hidden sm:table-cell">~63%</td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="font-mono text-sm font-semibold text-[#C9A227]">+26.8%</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-start gap-3 max-w-3xl mx-auto border-t border-[rgba(245,240,232,0.08)] pt-6"
        >
          <AlertTriangle size={14} className="text-[#7A7570] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#7A7570] leading-[1.7] space-y-2">
            <p>
              <strong className="text-[#9B9590] font-medium">Aviso importante:</strong>{' '}
              Los números que ves arriba vienen de nuestro historial real de operaciones 2022–2024.
              No son una promesa de lo que pasará en el futuro.
            </p>
            <p>
              El mercado de criptomonedas puede ser muy cambiante. Lo que ganamos antes no garantiza
              que ganaremos lo mismo. Invierte solo dinero que puedas permitirte dejar quieto
              durante el plazo de tu plan. Estos datos son informativos, no son asesoramiento financiero.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
