import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import SectionTag from '@/components/ui/section-tag'
import { useAuth, SelectedPlan } from '@/context/AuthContext'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    minCapital: 300,
    duration: 30,
    returnRate: 5,
    desc: 'Ideal para empezar. Resultado rápido en 30 días con riesgo moderado.',
    features: [
      'Mínimo $300 USDT',
      'Duración: 30 días',
      'Retorno estimado: +5%',
      'Gestor personal asignado',
      'Panel de seguimiento',
      'Confirmación en 24h',
    ],
    cta: 'Invertir con Starter',
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    minCapital: 1000,
    duration: 60,
    returnRate: 12,
    desc: 'El equilibrio perfecto entre plazo y rentabilidad. El más elegido.',
    features: [
      'Mínimo $1,000 USDT',
      'Duración: 60 días',
      'Retorno estimado: +12%',
      'Gestor prioritario',
      'Actualizaciones semanales',
      'Alertas por Telegram',
      'Panel avanzado',
    ],
    cta: 'Invertir con Growth',
    highlighted: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    minCapital: 5000,
    duration: 90,
    returnRate: 22,
    desc: 'Para inversores serios. Máximo retorno en 90 días de operativa intensiva.',
    features: [
      'Mínimo $5,000 USDT',
      'Duración: 90 días',
      'Retorno estimado: +22%',
      'Gestor dedicado exclusivo',
      'Reportes dos veces por semana',
      'Soporte prioritario 24/7',
      'Estrategia personalizada',
    ],
    cta: 'Invertir con Elite',
    highlighted: false,
  },
]

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
          <h3 className="text-[#F5F0E8] text-lg font-semibold mb-1 tracking-tight">Define tu propia inversión</h3>
          <p className="text-[#5A5650] text-sm leading-relaxed">Desde $300 USDT, elige tu capital y plazo. El retorno se calcula según tu inversión.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <div className="relative">
            <input
              type="number"
              placeholder="Capital (USDT)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={300}
              className="bg-[#0A0B0D] border border-[rgba(245,240,232,0.1)] rounded-xl px-4 py-2.5 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors w-44"
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
            Comenzar <ArrowRight size={13} />
          </Button>
        </div>
      </div>
      {amount && Number(amount) >= 300 && (
        <div className="mt-4 pt-4 border-t border-[rgba(245,240,232,0.06)] flex items-center gap-2">
          <span className="text-[#5A5650] text-xs">Estimado al vencer:</span>
          <span className="text-[#6FBF8B] font-medium text-sm">
            ${(Number(amount) * (1 + (Number(amount) >= 5000 ? 0.22 : Number(amount) >= 1000 ? 0.12 : 0.05))).toFixed(0)} USDT
          </span>
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
            Elige tu nivel de inversión
          </h2>
          <p className="text-[#5A5650] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Capital mínimo claro, plazo definido y retorno estimado transparente.
            Sin sorpresas, sin letra pequeña. Tu inversión, tu ritmo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {PLANS.map(({ id, name, minCapital, duration, returnRate, desc, features, cta, highlighted }, i) => (
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
                    Más elegido
                  </span>
                </div>
              )}

              <header className="mb-6">
                <span className={`font-mono text-[11px] tracking-[0.18em] uppercase font-medium block mb-3 ${highlighted ? 'text-[#C9A227]' : 'text-[#5A5650]'}`}>
                  {name}
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-4xl text-[#F5F0E8]">+{returnRate}%</span>
                  <span className="text-[#5A5650] text-sm">estimado</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-[#C9A227]">desde ${minCapital.toLocaleString()} USDT</span>
                  <span className="text-[#3D3A36]">·</span>
                  <span className="font-mono text-xs text-[#5A5650]">{duration} días</span>
                </div>
                <p className="text-[#5A5650] text-[13px] leading-relaxed">{desc}</p>
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

              {/* Example return */}
              <div className={`rounded-xl p-3.5 mb-5 ${highlighted ? 'bg-[rgba(201,162,39,0.06)]' : 'bg-[rgba(245,240,232,0.03)]'}`}>
                <div className="text-[11px] text-[#5A5650] mb-1">Ejemplo: si inviertes ${minCapital.toLocaleString()} USDT</div>
                <div className="text-[#F5F0E8] text-sm">
                  Recibes: <span className={highlighted ? 'text-[#C9A227]' : 'text-[#9B9590]'}>
                    ${(minCapital * (1 + returnRate / 100)).toFixed(0)} USDT
                  </span>
                  <span className="text-[#3D3A36] text-xs ml-1">(+${(minCapital * returnRate / 100).toFixed(0)} USDT)</span>
                </div>
              </div>

              <Button variant={highlighted ? 'default' : 'ghost'} className="w-full gap-2" onClick={() => handlePlan({ id, name, minCapital, duration, returnRate, desc, features, cta, highlighted })}>
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
          className="text-center text-xs text-[#3D3A36] mt-6"
        >
          Los retornos son estimados basados en historial operativo. El trading conlleva riesgo de pérdida de capital.
        </motion.p>
      </div>
    </section>
  )
}
