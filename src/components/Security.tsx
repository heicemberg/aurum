import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Users, RotateCcw, Lock, AlertTriangle, Wallet, TrendingDown } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const PILLARS = [
  {
    Icon: Wallet,
    title: 'Tu dinero en dirección verificada',
    body: 'Nuestras direcciones de depósito son públicas y siempre las mismas. Cada pago es confirmado a mano por nuestro equipo antes de activar cualquier plan.',
  },
  {
    Icon: Users,
    title: 'Una gestora asignada solo para ti',
    body: 'Cada inversor tiene una gestora personal que te escribe cada semana con el estado de tu dinero. Si tienes una duda, responde en menos de 4 horas.',
  },
  {
    Icon: RotateCcw,
    title: 'Tu dinero vuelve cuando termina el plan',
    body: 'Al terminar el plazo, tu dinero inicial más lo que ganaste se envía directo a tu billetera digital. Sin demoras, sin excusas, sin condiciones ocultas.',
  },
  {
    Icon: Lock,
    title: 'Sin costos ocultos de ningún tipo',
    body: 'El porcentaje que ves en tu plan es exactamente lo que recibes. No hay comisiones sobre ganancias ni renovaciones automáticas. Lo que se muestra, es lo que se paga.',
  },
]

const PROTECTION = [
  {
    Icon: TrendingDown,
    title: 'Límites automáticos de pérdida',
    body: 'Cada operación tiene un límite de cuánto puede perder. Si el precio baja demasiado, el sistema cierra la compra automáticamente para limitar la pérdida.',
  },
  {
    Icon: ShieldCheck,
    title: 'Nunca todo en una sola operación',
    body: 'Tu dinero se divide en múltiples operaciones pequeñas. Si una no sale bien, las otras compensan. No apostamos todo a una sola carta.',
  },
  {
    Icon: AlertTriangle,
    title: 'Honestidad sobre el riesgo',
    body: 'El mercado puede tener meses negativos. Por eso recomendamos invertir solo dinero que puedas dejar quieto durante el plazo sin que lo necesites.',
  },
]

export default function Security() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="confianza" ref={ref} className="py-32 bg-[#F8F7F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Seguridad y transparencia</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] max-w-xl mx-auto leading-tight tracking-tight">
            Tu dinero protegido.{' '}
            <span className="text-[#C9A227] italic">Sin letra pequeña.</span>
          </h2>
          <p className="text-[#6B6862] mt-5 max-w-lg mx-auto text-sm leading-relaxed">
            Sabemos que entregar tu dinero requiere mucha confianza. Por eso cada parte
            de cómo trabajamos está pensada para que siempre sepas qué pasa con tu inversión.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-black/[0.07] bg-white p-6 lg:p-7 hover:border-[#C9A227]/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/[0.07] flex items-center justify-center mb-6">
                <Icon size={16} className="text-[#C9A227]" />
              </div>
              <h3 className="text-[#1A1918] text-base font-semibold mb-2.5 tracking-tight">{title}</h3>
              <p className="text-[#6B6862] text-[13px] leading-[1.7]">{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-10"
        >
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl lg:text-3xl text-[#1A1918]">
              ¿Cómo protegemos tu dinero mientras opera?
            </h3>
            <p className="text-[#6B6862] text-sm mt-2 max-w-md mx-auto">
              Mientras tu dinero está con nosotros, usamos tres mecanismos de protección.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {PROTECTION.map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="rounded-2xl border border-black/[0.07] bg-white p-6 hover:border-[#C9A227]/20 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg border border-[#C9A227]/20 bg-[#C9A227]/[0.07] flex items-center justify-center mb-4">
                  <Icon size={14} className="text-[#C9A227]" />
                </div>
                <h4 className="text-[#1A1918] text-sm font-semibold mb-2">{title}</h4>
                <p className="text-[#6B6862] text-[13px] leading-[1.7]">{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border border-[#C9A227]/15 bg-[#C9A227]/[0.04] p-6 lg:p-8 max-w-3xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
              <Wallet size={16} className="text-[#C9A227]" />
            </div>
            <div>
              <h4 className="text-[#1A1918] font-semibold mb-2">¿Qué es una billetera digital y cómo funciona?</h4>
              <p className="text-[#4A4845] text-sm leading-relaxed mb-3">
                Una billetera digital es como tu cuenta bancaria, pero para dinero digital. Cuando inviertes con Aurum,
                envías tu dinero a nuestra dirección verificada, y cuando termina tu plan, te lo devolvemos
                a la dirección que tú nos indiques.
              </p>
              <p className="text-[#6B6862] text-[13px] leading-relaxed">
                <strong className="text-[#1A1918]">Importante:</strong> Aurum nunca tiene acceso a tu billetera personal.
                Solo tú controlas tu dinero una vez que está de regreso.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
