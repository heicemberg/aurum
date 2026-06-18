import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Shield, Play, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

function EquityCurve() {
  const points = [
    [0, 86], [60, 81], [120, 83], [180, 70], [240, 74], [300, 58],
    [360, 62], [420, 46], [480, 50], [540, 34], [600, 38], [660, 22],
    [720, 26], [780, 12],
  ]
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const fillPath = `${path} L 780 160 L 0 160 Z`
  return (
    <svg viewBox="0 0 780 160" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={fillPath} fill="url(#curveFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.6 }} />
      <motion.path d={path} fill="none" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} />
    </svg>
  )
}

function useCountUp(end: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    let raf: number
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setVal(end * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(end)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, active])
  return val
}

const METRICS = [
  { raw: 61.4, display: (v: number) => `${v.toFixed(1)}%`, label: 'Operaciones exitosas' },
  { raw: 8.7, display: (v: number) => `-${v.toFixed(1)}%`, label: 'Mayor caída registrada' },
  { raw: 67.2, display: (v: number) => `+${v.toFixed(0)}%`, label: 'Ganancia anual histórica' },
  { raw: 4847, display: (v: number) => v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), label: 'Operaciones ejecutadas' },
]

function MetricItem({ raw, display, label, delay }: (typeof METRICS)[0] & { delay: number }) {
  const [active, setActive] = useState(false)
  useEffect(() => { const t = setTimeout(() => setActive(true), 1300 + delay); return () => clearTimeout(t) }, [delay])
  const val = useCountUp(raw, 1.8, active)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 + delay / 1000 }}>
      <div className="font-serif text-3xl lg:text-4xl text-[#1A1918]">{display(val)}</div>
      <div className="font-mono text-[10px] text-[#9A9590] tracking-[0.12em] uppercase mt-1.5">{label}</div>
    </motion.div>
  )
}

function InvestmentFlowCard() {
  const steps = [
    { icon: '01', label: 'Elige un plan', sub: 'Desde $300 dólares' },
    { icon: '02', label: 'Envías tu dinero', sub: 'En formato digital' },
    { icon: '03', label: 'Nosotros trabajamos', sub: 'Comprando y vendiendo' },
    { icon: '04', label: 'Recibes tus ganancias', sub: 'Capital + lo que ganaste' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-xl mx-auto rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-[#F8F7F5]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
          <span className="font-mono text-[11px] text-[#6B6862]">AURUM · sistema activo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A47] animate-pulse" />
          <span className="font-mono text-[10px] text-[#1E7A47]">EN LÍNEA</span>
        </div>
      </div>
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.icon}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              className="rounded-xl bg-[#F8F7F5] border border-black/[0.06] p-3.5 hover:border-[#C9A227]/30 hover:bg-[#C9A227]/[0.03] transition-colors"
            >
              <div className="font-mono text-[10px] text-[#C9A227] mb-1.5">{step.icon}</div>
              <div className="text-[#1A1918] text-[12.5px] font-medium leading-tight mb-0.5">{step.label}</div>
              <div className="text-[#9A9590] text-[11px]">{step.sub}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between"
        >
          <span className="text-[#9A9590] text-[11px] font-mono">Ganancia estimada</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#1E7A47]" />
            <span className="font-serif text-[#1E7A47] text-lg font-medium">+5% → +22%</span>
            <span className="font-mono text-[10px] text-[#9A9590]">según plan</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  const navigate = useNavigate()
  const { loginDemo } = useAuth()

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#F8F7F5]">
      <div className="absolute inset-0 pointer-events-none bg-grid bg-grid-fade opacity-60" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(201,162,39,0.07) 0%, transparent 100%)' }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pt-40 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.07] px-4 py-1.5 mb-9">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span className="font-mono text-[11px] text-[#B8941F] tracking-[0.18em] uppercase">resultados verificados · clientes reales</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="font-serif font-normal text-5xl sm:text-6xl lg:text-[5.2rem] text-[#1A1918] leading-[1.08] tracking-tight mb-7"
        >
          Tu dinero trabajando
          <br />
          <span className="text-[#C9A227] italic">por ti.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="text-lg lg:text-xl text-[#4A4845] max-w-[560px] mx-auto mb-10 font-light leading-[1.7]"
        >
          Elige un plan, envías tu dinero y nuestro equipo lo hace crecer
          comprando y vendiendo criptomonedas por ti.
          Al terminar el plazo, recibes tu dinero más las ganancias directo a tu cuenta.
          Sin complicaciones, sin necesitar saber de criptomonedas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <Button size="lg" className="gap-2" onClick={() => navigate('/register')}>
            Quiero empezar a ganar <ArrowRight size={15} />
          </Button>
          <Button size="lg" variant="ghost" onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}>
            ¿Cómo funciona?
          </Button>
          <button
            onClick={() => { loginDemo(); navigate('/dashboard') }}
            className="inline-flex items-center gap-2 font-mono text-[11px] text-[#9A9590] hover:text-[#B8941F] transition-colors px-3 py-2 rounded-full border border-black/[0.08] hover:border-[#C9A227]/30"
          >
            <Play size={10} className="fill-current" />
            Ver panel de ejemplo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex items-center justify-center gap-2.5 mb-16"
        >
          <Shield size={14} className="text-[#C9A227] flex-shrink-0" />
          <span className="font-mono text-[12px] text-[#9A9590]">
            sin conocimientos técnicos · sin complicaciones · solo resultados
          </span>
        </motion.div>

        <InvestmentFlowCard />

        <div className="mt-16 pt-9 border-t border-black/[0.07] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {METRICS.map((m, i) => <MetricItem key={m.label} {...m} delay={i * 120} />)}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="font-mono text-[10.5px] text-[#B8B4AF] mt-6"
        >
          * datos de historial operativo 2022–2024 · los resultados pasados no garantizan ganancias futuras
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <ChevronDown size={18} className="text-black/20" />
      </motion.div>
    </section>
  )
}
