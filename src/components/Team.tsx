import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, ShieldCheck, MessageCircle, BarChart2 } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const TEAM = [
  {
    initials: 'CM',
    name: 'Carlos Mendez',
    role: 'Director de Inversiones',
    years: '12 años en mercados financieros',
    bio: 'Decide cuándo compramos y cuándo vendemos. Diseña las estrategias que generan tus ganancias y supervisa cada operación con su equipo.',
    Icon: TrendingUp,
    accent: '#C9A227',
  },
  {
    initials: 'AG',
    name: 'Ana García',
    role: 'Gestora Senior de Portafolios',
    years: 'En criptomonedas desde 2017',
    bio: 'Analiza el mercado todos los días para encontrar las mejores oportunidades. Se asegura de que tu dinero esté siempre en la posición correcta.',
    Icon: BarChart2,
    accent: '#1E7A47',
  },
  {
    initials: 'RV',
    name: 'Rodrigo Vásquez',
    role: 'Analista de Control de Riesgo',
    years: '8 años protegiendo capital',
    bio: 'Su trabajo es proteger tu dinero. Pone los límites de cuánto podemos perder en cada operación para que nunca haya sorpresas desagradables.',
    Icon: ShieldCheck,
    accent: '#3B6FD4',
  },
  {
    initials: 'MF',
    name: 'María Fernández',
    role: 'Tu gestora personal',
    years: 'Tu punto de contacto directo',
    bio: 'Cada inversor tiene una gestora asignada. Ella te escribe cada semana para contarte cómo va tu inversión y responde tus preguntas en menos de 4 horas.',
    Icon: MessageCircle,
    accent: '#C9A227',
  },
]

export default function Team() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="equipo" ref={ref} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Quién maneja tu dinero</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] max-w-xl mx-auto leading-tight tracking-tight">
            Personas reales.{' '}
            <span className="text-[#C9A227] italic">Resultados reales.</span>
          </h2>
          <p className="text-[#6B6862] mt-5 max-w-lg mx-auto text-sm leading-relaxed">
            Detrás de cada inversión hay un equipo humano con años de experiencia
            que trabaja para hacer crecer tu capital. No es un robot, no es magia.
            Es experiencia y método.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(({ initials, name, role, years, bio, Icon, accent }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-black/[0.07] bg-[#F8F7F5] p-6 lg:p-7 hover:border-[#C9A227]/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-semibold flex-shrink-0"
                  style={{ background: `${accent}12`, color: accent }}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-[#1A1918] text-sm font-semibold leading-tight">{name}</div>
                  <div className="text-[11px] mt-0.5 font-medium" style={{ color: accent }}>{role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Icon size={12} className="flex-shrink-0" style={{ color: accent, opacity: 0.7 }} />
                <span className="font-mono text-[11px] text-[#9A9590]">{years}</span>
              </div>

              <p className="text-[#6B6862] text-[13px] leading-[1.75] flex-1">{bio}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 rounded-2xl border border-[#C9A227]/15 bg-[#C9A227]/[0.04] p-6 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex -space-x-2 flex-shrink-0">
              {['CM', 'AG', 'RV', 'MF'].map((init, i) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full border-2 border-white bg-[#C9A227]/10 flex items-center justify-center font-mono text-[10px] text-[#B8941F]"
                  style={{ zIndex: 4 - i }}
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-[#4A4845] text-sm leading-relaxed">
              <strong className="text-[#1A1918] font-semibold">Equipo disponible de lunes a sábado, 9am–8pm.</strong>{' '}
              Cada inversor tiene asignada una gestora personal que le escribe cada semana con el estado de su plan.
              ¿Tienes una duda? Escríbenos y respondemos en menos de 4 horas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
