import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Users, RotateCcw, Lock } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const PILLARS = [
  {
    Icon: ShieldCheck,
    title: 'Wallets verificadas',
    body: 'Nuestras direcciones de depósito son públicas, consistentes y verificables. Cada transferencia es confirmada manualmente por nuestro equipo antes de activar cualquier plan.',
  },
  {
    Icon: Users,
    title: 'Gestor personal asignado',
    body: 'Cada inversor cuenta con un gestor personal que reporta el estado de la operativa semanalmente y está disponible para resolver cualquier consulta en menos de 4 horas.',
  },
  {
    Icon: RotateCcw,
    title: 'Devolución al vencer',
    body: 'Al terminar el plazo de tu plan, tu capital inicial más las ganancias generadas se transfieren directamente a la wallet que registraste. Sin demoras, sin excusas.',
  },
  {
    Icon: Lock,
    title: 'Sin comisiones ocultas',
    body: 'El retorno que ves en tu plan es lo que recibes. No hay comisiones sobre ganancias, ni renovaciones automáticas, ni cargos extras de ningún tipo. Precio claro desde el inicio.',
  },
]

export default function Security() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="confianza" ref={ref} className="py-32 bg-[#111418]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Por qué confiar en AURUM</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            La confianza se construye{' '}
            <span className="text-[#C9A227] italic">con hechos.</span>
          </h2>
          <p className="text-[#5A5650] mt-5 max-w-lg mx-auto text-sm leading-relaxed">
            Sabemos que entregar tu capital requiere confianza absoluta. Por eso cada aspecto
            de nuestra operativa está diseñado para darte transparencia y seguridad reales.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#0A0B0D] p-6 lg:p-7 hover:border-[rgba(201,162,39,0.25)] transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl border border-[rgba(201,162,39,0.18)] flex items-center justify-center mb-6">
                <Icon size={16} className="text-[#C9A227]" />
              </div>
              <h3 className="text-[#F5F0E8] text-base font-semibold mb-2.5 tracking-tight">{title}</h3>
              <p className="text-[#5A5650] text-[13px] leading-[1.7]">{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-[rgba(201,162,39,0.1)] bg-[rgba(201,162,39,0.025)] p-6 max-w-2xl mx-auto text-center"
        >
          <p className="text-[#9B9590] text-sm leading-relaxed">
            AURUM no es un banco ni una entidad financiera regulada. Gestionamos capital de clientes
            para operativa de trading. Te recomendamos invertir únicamente capital que puedas permitirte
            destinar a esta clase de inversión de riesgo.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
