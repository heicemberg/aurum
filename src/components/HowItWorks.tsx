import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, LayoutGrid, SendHorizontal, BadgeDollarSign } from 'lucide-react'
import SectionTag from '@/components/ui/section-tag'

const STEPS = [
  {
    n: '01',
    Icon: UserPlus,
    title: 'Crea tu cuenta',
    body: 'Regístrate con tu email en menos de 2 minutos. Elige tu plan de inversión y la cantidad que deseas invertir. Tu panel personal estará listo al instante.',
    pill: 'Sin papeleos ni demoras',
  },
  {
    n: '02',
    Icon: LayoutGrid,
    title: 'Elige tu plan',
    body: 'Starter desde $300 USDT · 30 días. Growth desde $1,000 USDT · 60 días. Elite desde $5,000 USDT · 90 días. O personaliza tu propia inversión.',
    pill: '+5% a +22% estimado',
  },
  {
    n: '03',
    Icon: SendHorizontal,
    title: 'Transfiere en crypto',
    body: 'Envía USDT, BTC o ETH a nuestras wallets verificadas vía Binance o wallet fría. Nuestro equipo confirma el pago y activa tu plan en menos de 24 horas.',
    pill: 'Binance · Wallet fría · TRC20',
  },
  {
    n: '04',
    Icon: BadgeDollarSign,
    title: 'Recibe tus ganancias',
    body: 'Al vencer el plazo de tu plan, recibes tu capital inicial más las ganancias generadas directamente en tu wallet. Sin excusas, sin retrasos.',
    pill: 'Capital + retorno garantizado',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="como-funciona" ref={ref} className="py-32 bg-[#0A0B0D]">
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
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] max-w-xl mx-auto leading-tight tracking-tight">
            Simple por diseño.{' '}
            <span className="text-[#C9A227] italic">Poderoso por dentro.</span>
          </h2>
          <p className="text-[#5A5650] text-sm mt-4 max-w-md mx-auto leading-relaxed">
            No necesitas conocimientos técnicos, ni API keys, ni instalar nada.
            Solo elige, transfiere y nosotros hacemos el resto.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-5 lg:gap-6">
          {STEPS.map(({ n, Icon, title, body, pill }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#111418] p-7 hover:border-[rgba(201,162,39,0.28)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-serif text-[64px] leading-none text-[rgba(245,240,232,0.03)] absolute top-4 right-5 select-none pointer-events-none">
                {n}
              </span>
              <div className="w-10 h-10 rounded-xl border border-[rgba(201,162,39,0.18)] flex items-center justify-center mb-6">
                <Icon size={17} className="text-[#C9A227]" />
              </div>
              <h3 className="text-[#F5F0E8] text-base font-semibold mb-3 tracking-tight">{title}</h3>
              <p className="text-[#5A5650] text-[13px] leading-[1.75] mb-6">{body}</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,162,39,0.14)] px-3 py-1.5">
                <span className="w-1 h-1 rounded-full bg-[#C9A227] flex-shrink-0" />
                <span className="font-mono text-[10px] text-[#C9A227] tracking-wide">{pill}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                  <div className="w-8 h-px bg-gradient-to-r from-[rgba(201,162,39,0.3)] to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
