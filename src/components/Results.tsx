import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const MONTHS = [
  { m: 'Abr 2024', r: -0.4 }, { m: 'May 2024', r: 6.2 }, { m: 'Jun 2024', r: 4.8 },
  { m: 'Jul 2024', r: 8.1 }, { m: 'Ago 2024', r: 5.3 }, { m: 'Sep 2024', r: 7.6 },
  { m: 'Oct 2024', r: 9.2 }, { m: 'Nov 2024', r: 11.4 }, { m: 'Dic 2024', r: 3.7 },
  { m: 'Ene 2025', r: 6.9 }, { m: 'Feb 2025', r: 8.5 }, { m: 'Mar 2025', r: 4.1 },
]

const METRICS = [
  { label: 'Ganancia promedio mensual', value: '+6.3%', sub: 'Últimos 12 meses', positive: true },
  { label: 'Meses con ganancias', value: '11 de 12', sub: 'Historial verificado', positive: true },
  { label: 'Mayor pérdida en un mes', value: '-0.4%', sub: 'Abril 2024', positive: false },
  { label: 'Mejor mes registrado', value: '+11.4%', sub: 'Noviembre 2024', positive: true },
]

export default function Results() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [showTable, setShowTable] = useState(false)

  return (
    <section id="resultados" ref={ref} className="py-32 bg-[#F8F7F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Resultados reales</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] max-w-xl mx-auto leading-tight tracking-tight">
            12 meses de historial.{' '}
            <span className="text-[#C9A227] italic">Todo visible.</span>
          </h2>
          <p className="text-[#6B6862] mt-5 max-w-lg mx-auto text-sm leading-relaxed">
            Este es nuestro historial mes a mes, incluyendo el único mes negativo.
            Creemos que la confianza se gana siendo honestos sobre cada resultado.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {METRICS.map(({ label, value, sub, positive }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-black/[0.08] bg-white p-6 text-center hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <div className={`font-serif text-3xl lg:text-4xl mb-1.5 ${positive ? 'text-[#1E7A47]' : 'text-[#B83232]'}`}>
                {value}
              </div>
              <div className="text-[#1A1918] text-sm font-medium mb-1">{label}</div>
              <div className="text-[#9A9590] text-xs font-mono">{sub}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden shadow-sm"
        >
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-black/[0.015] transition-colors"
          >
            <div>
              <span className="text-[#1A1918] font-semibold text-sm">Ver historial completo mes a mes</span>
              <span className="text-[#9A9590] text-xs ml-3 font-mono">Abril 2024 – Marzo 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#B8941F] border border-[#C9A227]/20 bg-[#C9A227]/[0.06] rounded-full px-3 py-1">
                12 meses verificados
              </span>
              {showTable ? <ChevronUp size={16} className="text-[#9A9590]" /> : <ChevronDown size={16} className="text-[#9A9590]" />}
            </div>
          </button>

          {showTable && (
            <div className="border-t border-black/[0.06]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-black/[0.05]">
                {MONTHS.map(({ m, r }) => {
                  const pos = r >= 0
                  return (
                    <div key={m} className="p-4 flex items-center justify-between hover:bg-black/[0.015] transition-colors">
                      <span className="font-mono text-[11px] text-[#9A9590]">{m}</span>
                      <div className={`flex items-center gap-1.5 font-semibold text-sm ${pos ? 'text-[#1E7A47]' : 'text-[#B83232]'}`}>
                        {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {r > 0 ? '+' : ''}{r.toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="px-6 py-4 border-t border-black/[0.06] bg-[#F8F7F5]">
                <span className="text-[#9A9590] text-xs leading-relaxed">
                  Historial de rendimiento real del fondo Aurum Capital · Los resultados pasados no garantizan resultados futuros · Existen riesgos de pérdida de capital
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
