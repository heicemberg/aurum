import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, LayoutGrid, SendHorizontal, BadgeDollarSign } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const STEPS = [
  {
    n: '01',
    Icon: UserPlus,
    title: 'Crea tu cuenta',
    body: 'Regístrate con tu correo en menos de 2 minutos. Elige tu plan y el dinero que quieres invertir. Tu panel personal estará listo al instante.',
    pill: 'Sin papeleos ni esperas',
  },
  {
    n: '02',
    Icon: LayoutGrid,
    title: 'Elige tu plan',
    body: 'Básico desde $300 · 30 días. Crecimiento desde $1,000 · 60 días. Elite desde $5,000 · 90 días. O dinos cuánto quieres invertir tú.',
    pill: '+5% a +22% estimado',
  },
  {
    n: '03',
    Icon: SendHorizontal,
    title: 'Envías tu dinero',
    body: 'Mandas dólares digitales a nuestra dirección verificada. Nuestro equipo confirma el pago y activa tu plan en menos de 24 horas. Te guiamos paso a paso.',
    pill: 'Te guiamos en cada paso',
  },
  {
    n: '04',
    Icon: BadgeDollarSign,
    title: 'Recibes tus ganancias',
    body: 'Cuando termina tu plan, recibes tu dinero de vuelta más lo que ganaste, directo a tu billetera digital. Sin excusas, sin demoras.',
    pill: 'Tu dinero + lo que ganaste',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="como-funciona" ref={ref} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Cómo funciona</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] max-w-xl mx-auto leading-tight tracking-tight">
            Tan simple que{' '}
            <span className="text-[#C9A227] italic">cualquiera puede hacerlo.</span>
          </h2>
          <p className="text-[#6B6862] text-sm mt-4 max-w-md mx-auto leading-relaxed">
            No necesitas saber nada de criptomonedas. No necesitas instalar ninguna aplicación.
            Solo elige, envías tu dinero y nosotros hacemos todo el trabajo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-5 lg:gap-6">
          {STEPS.map(({ n, Icon, title, body, pill }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative rounded-2xl border border-black/[0.07] bg-[#F8F7F5] p-7 hover:border-[#C9A227]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-serif text-[64px] leading-none text-black/[0.04] absolute top-4 right-5 select-none pointer-events-none">
                {n}
              </span>
              <div className="w-10 h-10 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/[0.07] flex items-center justify-center mb-6">
                <Icon size={17} className="text-[#C9A227]" />
              </div>
              <h3 className="text-[#1A1918] text-base font-semibold mb-3 tracking-tight">{title}</h3>
              <p className="text-[#6B6862] text-[13px] leading-[1.75] mb-6">{body}</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/[0.05] px-3 py-1.5">
                <span className="w-1 h-1 rounded-full bg-[#C9A227] flex-shrink-0" />
                <span className="font-mono text-[10px] text-[#B8941F] tracking-wide">{pill}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                  <div className="w-8 h-px bg-gradient-to-r from-[#C9A227]/30 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
