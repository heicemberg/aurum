import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const TESTIMONIALS = [
  {
    initials: 'LR',
    name: 'Luis R.',
    country: 'Venezuela',
    plan: 'Starter · 30 días',
    invested: 500,
    received: 525,
    gain: 25,
    date: 'Marzo 2025',
    quote: 'Nunca había invertido en criptomonedas. Empecé con $500 porque me daba miedo poner más. Al mes me llegaron los $525 a mi billetera exactamente como dijeron. Ahora tengo el plan Growth.',
    stars: 5,
  },
  {
    initials: 'PG',
    name: 'Patricia G.',
    country: 'Colombia',
    plan: 'Growth · 60 días',
    invested: 2000,
    received: 2240,
    gain: 240,
    date: 'Enero 2025',
    quote: 'Al principio dudé mucho. Hablé con María, mi gestora, y me explicó todo con paciencia. Cuando vi los $240 de ganancia en mi billetera digital, no lo podía creer. Ya voy en el segundo ciclo.',
    stars: 5,
  },
  {
    initials: 'MA',
    name: 'Miguel A.',
    country: 'México',
    plan: 'Elite · 90 días',
    invested: 5000,
    received: 6100,
    gain: 1100,
    date: 'Febrero 2025',
    quote: 'Soy ingeniero pero cero conocimiento de criptos. Me explicaron todo paso a paso, desde cómo enviar el dinero hasta cómo recibirlo. Resultado: $1,100 de ganancia en 90 días.',
    stars: 5,
  },
  {
    initials: 'SM',
    name: 'Sandra M.',
    country: 'Argentina',
    plan: 'Growth · 60 días',
    invested: 1500,
    received: 1680,
    gain: 180,
    date: 'Abril 2025',
    quote: 'Llevo tres ciclos con Aurum. El primer mes tuve dudas, pero cuando vi el dinero volver a mi billetera digital, me quedé tranquila. Ahora lo recomiendo a mi familia.',
    stars: 5,
  },
  {
    initials: 'RC',
    name: 'Roberto C.',
    country: 'Perú',
    plan: 'Starter · 30 días',
    invested: 300,
    received: 315,
    gain: 15,
    date: 'Mayo 2025',
    quote: 'Comencé con lo mínimo, $300, para probar. El proceso fue exactamente como lo explicaron. Nada complicado, nada raro. Ya tengo el plan Growth con $1,000.',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="text-[#C9A227] fill-[#C9A227]" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonios" ref={ref} className="py-32 bg-[#111418]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Lo que dicen nuestros inversores</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            Personas como tú.{' '}
            <span className="text-[#C9A227] italic">Ganancias reales.</span>
          </h2>
          <p className="text-[#9B9590] mt-5 max-w-lg mx-auto text-sm leading-relaxed">
            Todos empezaron sin saber nada de criptomonedas. Hoy tienen sus ganancias
            en su billetera digital. Los nombres se acortan para proteger su privacidad,
            pero los resultados son reales y verificados por nuestro equipo.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {TESTIMONIALS.slice(0, 3).map(({ initials, name, country, plan, invested, received, gain, date, quote, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#0A0B0D] p-6 lg:p-7 flex flex-col hover:border-[rgba(201,162,39,0.25)] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] flex items-center justify-center font-mono text-xs text-[#C9A227]">
                    {initials}
                  </div>
                  <div>
                    <div className="text-[#F5F0E8] text-sm font-semibold">{name}</div>
                    <div className="text-[#7A7570] text-[11px]">{country} · {date}</div>
                  </div>
                </div>
                <Stars count={stars} />
              </div>

              <p className="text-[#9B9590] text-[13px] leading-[1.8] flex-1 mb-5">"{quote}"</p>

              <div className="pt-4 border-t border-[rgba(245,240,232,0.06)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#7A7570] tracking-wide">{plan}</span>
                  <div className="flex items-center gap-1 text-[#6FBF8B]">
                    <TrendingUp size={11} />
                    <span className="font-mono text-[11px] font-semibold">+${gain} USD</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7570] text-xs">Invirtió: <span className="text-[#9B9590]">${invested.toLocaleString()}</span></span>
                  <span className="text-[#7A7570] text-xs">Recibió: <span className="text-[#6FBF8B] font-medium">${received.toLocaleString()}</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {TESTIMONIALS.slice(3).map(({ initials, name, country, plan, invested, received, gain, date, quote, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#0A0B0D] p-6 lg:p-7 flex flex-col hover:border-[rgba(201,162,39,0.25)] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] flex items-center justify-center font-mono text-xs text-[#C9A227]">
                    {initials}
                  </div>
                  <div>
                    <div className="text-[#F5F0E8] text-sm font-semibold">{name}</div>
                    <div className="text-[#7A7570] text-[11px]">{country} · {date}</div>
                  </div>
                </div>
                <Stars count={stars} />
              </div>

              <p className="text-[#9B9590] text-[13px] leading-[1.8] flex-1 mb-5">"{quote}"</p>

              <div className="pt-4 border-t border-[rgba(245,240,232,0.06)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#7A7570] tracking-wide">{plan}</span>
                  <div className="flex items-center gap-1 text-[#6FBF8B]">
                    <TrendingUp size={11} />
                    <span className="font-mono text-[11px] font-semibold">+${gain} USD</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7570] text-xs">Invirtió: <span className="text-[#9B9590]">${invested.toLocaleString()}</span></span>
                  <span className="text-[#7A7570] text-xs">Recibió: <span className="text-[#6FBF8B] font-medium">${received.toLocaleString()}</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-[#6A6560] mt-8"
        >
          Los nombres se acortan para proteger la privacidad. Los resultados son verificados por nuestro equipo interno.
          Los rendimientos pasados no garantizan resultados futuros.
        </motion.p>
      </div>
    </section>
  )
}
