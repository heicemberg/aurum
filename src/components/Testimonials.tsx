import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const TESTIMONIALS = [
  {
    name: 'Luis R.',
    country: 'Venezuela',
    flag: '🇻🇪',
    plan: 'Plan Básico',
    invested: 500,
    returned: 525,
    duration: '30 días',
    stars: 5,
    quote: 'Nunca había invertido en nada. Me explicaron todo paso a paso y al mes tenía mis $25 extra. Parecía mentira pero fue real.',
  },
  {
    name: 'Patricia G.',
    country: 'Colombia',
    flag: '🇨🇴',
    plan: 'Plan Crecimiento',
    invested: 2000,
    returned: 2240,
    duration: '60 días',
    stars: 5,
    quote: 'Siempre tuve miedo de las criptomonedas. Aquí nunca tuve que entender nada técnico. Solo esperé y recibí mi dinero con ganancias.',
  },
  {
    name: 'Miguel A.',
    country: 'México',
    flag: '🇲🇽',
    plan: 'Plan Elite',
    invested: 5000,
    returned: 6100,
    duration: '90 días',
    stars: 5,
    quote: 'Los $1,100 que gané me ayudaron a pagar deudas. La gestora me escribía cada semana. Fue una experiencia muy diferente a lo que esperaba.',
  },
  {
    name: 'Sandra M.',
    country: 'Argentina',
    flag: '🇦🇷',
    plan: 'Plan Crecimiento',
    invested: 1500,
    returned: 1680,
    duration: '60 días',
    stars: 5,
    quote: 'Me daba desconfianza al principio. Empecé con el plan más pequeño para probar. Cuando vi el resultado, metí más. Ya voy por mi tercer plan.',
  },
  {
    name: 'Roberto C.',
    country: 'Perú',
    flag: '🇵🇪',
    plan: 'Plan Básico',
    invested: 300,
    returned: 315,
    duration: '30 días',
    stars: 5,
    quote: 'Es poco dinero pero para mí fue mucho. No sabía nada de esto y lo entendí todo. El equipo te trata como una persona, no como un número.',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonios" ref={ref} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Lo que dicen nuestros clientes</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] max-w-xl mx-auto leading-tight tracking-tight">
            Personas como tú que{' '}
            <span className="text-[#C9A227] italic">ya están ganando.</span>
          </h2>
          <p className="text-[#6B6862] mt-5 max-w-md mx-auto text-sm leading-relaxed">
            Sin experiencia previa, sin conocimientos técnicos. Solo eligieron un plan, enviaron su dinero y esperaron.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ name, country, flag, plan, invested, returned, duration, stars, quote }, i) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-black/[0.07] bg-[#F8F7F5] p-6 lg:p-7 flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-[#C9A227]/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{flag}</span>
                  <div>
                    <div className="text-[#1A1918] text-sm font-semibold">{name}</div>
                    <div className="text-[#9A9590] text-xs font-mono">{country}</div>
                  </div>
                </div>
                <div className="flex">
                  {Array.from({ length: stars }).map((_, s) => (
                    <Star key={s} size={11} className="text-[#C9A227] fill-[#C9A227]" />
                  ))}
                </div>
              </div>

              <blockquote className="text-[#4A4845] text-[13px] leading-[1.75] flex-1 mb-5 italic">
                "{quote}"
              </blockquote>

              <div className="rounded-xl border border-black/[0.06] bg-white p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#B8941F]">{plan}</span>
                  <span className="font-mono text-[10px] text-[#9A9590]">{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#9A9590] text-[11px]">Invirtió</div>
                    <div className="text-[#1A1918] font-semibold text-sm">${invested.toLocaleString()}</div>
                  </div>
                  <TrendingUp size={14} className="text-[#1E7A47]" />
                  <div className="text-right">
                    <div className="text-[#9A9590] text-[11px]">Recibió</div>
                    <div className="text-[#1E7A47] font-semibold text-sm">${returned.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-black/[0.05] text-center">
                  <span className="text-[#1E7A47] font-mono text-[11px] font-semibold">
                    +${(returned - invested).toLocaleString()} de ganancia
                    ({(((returned - invested) / invested) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[#B8B4AF] text-xs font-mono">
            Testimonios reales de clientes verificados · Los resultados individuales pueden variar
          </p>
        </motion.div>
      </div>
    </section>
  )
}
