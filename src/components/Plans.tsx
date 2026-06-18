import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, MessageCircle, ChevronDown, ChevronUp, TrendingUp, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import SectionTag from '@/components/ui/section-tag'
import { useAuth, SelectedPlan } from '@/context/AuthContext'

const PLANS = [
  {
    id: 'starter',
    name: 'Básico',
    minCapital: 300,
    duration: 30,
    returnRate: 5,
    desc: 'Para empezar con tranquilidad. Resultado en 30 días con riesgo moderado.',
    features: [
      'Mínimo $300 (dólares digitales)',
      'Duración: 30 días',
      'Ganancia estimada: +5%',
      'Gestora personal asignada',
      'Panel para ver tu dinero',
      'Confirmación en 24 horas',
    ],
    cta: 'Empezar con Básico',
    highlighted: false,
    riskLevel: 'Bajo',
    riskColor: '#6FBF8B',
  },
  {
    id: 'growth',
    name: 'Crecimiento',
    minCapital: 1000,
    duration: 60,
    returnRate: 12,
    desc: 'El equilibrio perfecto entre plazo y ganancia. El más elegido por nuestros clientes.',
    features: [
      'Mínimo $1,000 (dólares digitales)',
      'Duración: 60 días',
      'Ganancia estimada: +12%',
      'Gestora con prioridad',
      'Actualizaciones cada semana',
      'Avisos por Telegram',
      'Panel avanzado',
    ],
    cta: 'Empezar con Crecimiento',
    highlighted: true,
    riskLevel: 'Moderado',
    riskColor: '#C9A227',
  },
  {
    id: 'elite',
    name: 'Elite',
    minCapital: 5000,
    duration: 90,
    returnRate: 22,
    desc: 'Para inversores que buscan el máximo retorno. 90 días de trabajo intensivo.',
    features: [
      'Mínimo $5,000 (dólares digitales)',
      'Duración: 90 días',
      'Ganancia estimada: +22%',
      'Gestora dedicada exclusiva',
      'Reportes dos veces por semana',
      'Atención preferente 24/7',
      'Estrategia ajustada a tu capital',
    ],
    cta: 'Empezar con Elite',
    highlighted: false,
    riskLevel: 'Medio-Alto',
    riskColor: '#B4634F',
  },
]

function HowWeEarn() {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-[rgba(245,240,232,0.08)] bg-[#0A0B0D] overflow-hidden mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[rgba(245,240,232,0.02)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={16} className="text-[#C9A227]" />
          <span className="text-[#F5F0E8] font-semibold text-sm">¿Cómo generamos tus ganancias? ¿Qué riesgos hay?</span>
        </div>
        {open ? <ChevronUp size={16} className="text-[#7A7570]" /> : <ChevronDown size={16} className="text-[#7A7570]" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-[rgba(245,240,232,0.06)]">
          <div className="grid sm:grid-cols-2 gap-6 pt-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-[rgba(111,191,139,0.15)] flex items-center justify-center">
                  <TrendingUp size={11} className="text-[#6FBF8B]" />
                </div>
                <span className="text-[#6FBF8B] text-sm font-semibold">Cómo ganamos dinero para ti</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Compramos criptomonedas cuando el precio baja.',
                  'Las vendemos cuando el precio sube.',
                  'Hacemos esto cientos de veces al día, las 24 horas.',
                  'Un sistema automático decide cuándo comprar y vender, supervisado por nuestro equipo.',
                  'El resultado de todas esas operaciones es tu ganancia al final del plan.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={12} className="text-[#6FBF8B] mt-0.5 flex-shrink-0" />
                    <span className="text-[#8A8580] text-[13px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-[rgba(180,99,79,0.15)] flex items-center justify-center">
                  <AlertTriangle size={11} className="text-[#B4634F]" />
                </div>
                <span className="text-[#B4634F] text-sm font-semibold">Los riesgos que debes conocer</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'El mercado puede bajar mucho de golpe y afectar las ganancias.',
                  'Algunos meses pueden tener resultados negativos (pérdidas).',
                  'Las ganancias estimadas no están 100% garantizadas.',
                  'Si el mercado cae fuerte durante tu plan, podrías recibir menos de lo que invertiste.',
                  'Por eso solo debes invertir dinero que puedas dejar sin tocar durante el plazo.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle size={11} className="text-[#B4634F] mt-0.5 flex-shrink-0" />
                    <span className="text-[#8A8580] text-[13px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 text-[12px] text-[#7A7570] leading-relaxed border-t border-[rgba(245,240,232,0.06)] pt-4">
            Nuestra mayor caída registrada en un mes fue de -0.4%. Eso muestra que controlamos el riesgo,
            pero también que puede haber meses negativos. La media de ganancia mensual de los últimos 3 años es +5.6%.
          </p>
        </div>
      )}
    </div>
  )
}

function CustomPlanCard() {
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('30')
  const navigate = useNavigate()
  const { setPendingPlan } = useAuth()

  function handleCustom() {
    const cap = Number(amount)
    if (!cap || cap < 300) return
    const rate = cap >= 5000 ? 22 : cap >= 1000 ? 12 : 5
    const plan: SelectedPlan = {
      id: 'custom',
      name: 'Personalizado',
      minCapital: 300,
      duration: Number(duration),
      returnRate: rate,
      customAmount: cap,
    }
    setPendingPlan(plan)
    navigate('/register')
  }

  return (
    <motion.div className="mt-5 rounded-2xl border border-[rgba(245,240,232,0.08)] bg-[#111418] p-7 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-[#C9A227]" />
            <span className="font-mono text-[11px] text-[#C9A227] tracking-[0.15em] uppercase">Plan Personalizado</span>
          </div>
          <h3 className="text-[#F5F0E8] text-lg font-semibold mb-1 tracking-tight">Dime cuánto quieres invertir</h3>
          <p className="text-[#8A8580] text-sm leading-relaxed">Desde $300, elige tu capital y el tiempo. Calculamos tu ganancia estimada al momento.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <div className="relative">
            <input
              type="number"
              placeholder="Tu capital (USD)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={300}
              className="bg-[#0A0B0D] border border-[rgba(245,240,232,0.1)] rounded-xl px-4 py-2.5 text-[#F5F0E8] text-sm placeholder:text-[#5A5650] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors w-44"
            />
          </div>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="bg-[#0A0B0D] border border-[rgba(245,240,232,0.1)] rounded-xl px-4 py-2.5 text-[#F5F0E8] text-sm focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors appearance-none"
          >
            <option value="30">30 días</option>
            <option value="60">60 días</option>
            <option value="90">90 días</option>
          </select>
          <Button onClick={handleCustom} variant="ghost" className="gap-2 whitespace-nowrap">
            Calcular <ArrowRight size={13} />
          </Button>
        </div>
      </div>
      {amount && Number(amount) >= 300 && (
        <div className="mt-4 pt-4 border-t border-[rgba(245,240,232,0.06)] flex items-center gap-2">
          <span className="text-[#8A8580] text-xs">Al terminar el plan recibirías:</span>
          <span className="text-[#6FBF8B] font-medium text-sm">
            ${(Number(amount) * (1 + (Number(amount) >= 5000 ? 0.22 : Number(amount) >= 1000 ? 0.12 : 0.05))).toFixed(0)} USD
          </span>
          <span className="text-[#7A7570] text-xs">estimado</span>
        </div>
      )}
    </motion.div>
  )
}

export default function Plans() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()
  const { setPendingPlan } = useAuth()

  function handlePlan(plan: typeof PLANS[0]) {
    const selected: SelectedPlan = {
      id: plan.id,
      name: plan.name,
      minCapital: plan.minCapital,
      duration: plan.duration,
      returnRate: plan.returnRate,
    }
    setPendingPlan(selected)
    navigate('/register')
  }

  return (
    <section id="planes" ref={ref} className="py-32 bg-[#111418]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Planes de inversión</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            Elige cuánto quieres
            <br />ganar
          </h2>
          <p className="text-[#9B9590] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Dinero mínimo claro, plazo definido y ganancia estimada. Sin sorpresas.
            Y antes de elegir, puedes ver exactamente cómo generamos esas ganancias.
          </p>
        </motion.div>

        <HowWeEarn />

        <div className="grid lg:grid-cols-3 gap-6">
          {PLANS.map(({ id, name, minCapital, duration, returnRate, desc, features, cta, highlighted, riskLevel, riskColor }, i) => (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-2xl p-8 lg:p-9 ${
                highlighted
                  ? 'border border-[#C9A227] bg-[#181C22] shadow-[0_0_48px_rgba(201,162,39,0.07)]'
                  : 'border border-[rgba(245,240,232,0.08)] bg-[#181C22]'
              }`}
            >
              {highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#C9A227] text-[#0A0B0D] font-mono text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-1 block">
                    El más elegido
                  </span>
                </div>
              )}

              <header className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-[11px] tracking-[0.18em] uppercase font-medium ${highlighted ? 'text-[#C9A227]' : 'text-[#7A7570]'}`}>
                    {name}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border" style={{ color: riskColor, borderColor: `${riskColor}30`, background: `${riskColor}10` }}>
                    Riesgo {riskLevel}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-4xl text-[#F5F0E8]">+{returnRate}%</span>
                  <span className="text-[#7A7570] text-sm">estimado</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-[#C9A227]">desde ${minCapital.toLocaleString()}</span>
                  <span className="text-[#5A5650]">·</span>
                  <span className="font-mono text-xs text-[#7A7570]">{duration} días</span>
                </div>
                <p className="text-[#8A8580] text-[13px] leading-relaxed">{desc}</p>
              </header>

              <div className={`h-px mb-7 ${highlighted ? 'bg-[rgba(201,162,39,0.25)]' : 'bg-[rgba(245,240,232,0.08)]'}`} />

              <ul className="flex-1 space-y-3.5 mb-9">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={13} className={`mt-0.5 flex-shrink-0 ${highlighted ? 'text-[#C9A227]' : 'text-[rgba(201,162,39,0.5)]'}`} />
                    <span className="text-[13px] text-[#9B9590] leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <div className={`rounded-xl p-3.5 mb-5 ${highlighted ? 'bg-[rgba(201,162,39,0.06)]' : 'bg-[rgba(245,240,232,0.03)]'}`}>
                <div className="text-[11px] text-[#7A7570] mb-1">Ejemplo: si inviertes ${minCapital.toLocaleString()}</div>
                <div className="text-[#F5F0E8] text-sm">
                  Recibirías: <span className={highlighted ? 'text-[#C9A227]' : 'text-[#9B9590]'}>
                    ${(minCapital * (1 + returnRate / 100)).toFixed(0)}
                  </span>
                  <span className="text-[#6A6560] text-xs ml-1">(+${(minCapital * returnRate / 100).toFixed(0)} de ganancia)</span>
                </div>
              </div>

              <Button variant={highlighted ? 'default' : 'ghost'} className="w-full gap-2" onClick={() => handlePlan({ id, name, minCapital, duration, returnRate, desc, features, cta, highlighted, riskLevel, riskColor })}>
                {cta} <ArrowRight size={13} />
              </Button>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CustomPlanCard />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-xs text-[#6A6560] mt-6"
        >
          Las ganancias son estimadas según nuestro historial de trabajo. El mercado de criptomonedas
          conlleva riesgo de perder parte del capital. Invierte solo lo que puedas mantener inmovilizado durante el plazo.
        </motion.p>
      </div>
    </section>
  )
}
