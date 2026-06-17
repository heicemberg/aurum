import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import SectionTag from '@/components/ui/section-tag'

const FAQS = [
  {
    id: 'safe',
    q: '¿Cómo sé que mi dinero está seguro?',
    a: 'Nuestras wallets de depósito son públicas y verificables. Cada transferencia es confirmada manualmente por nuestro equipo antes de activar tu plan. Además, tienes un gestor personal asignado que te mantiene informado del estado de tu inversión cada semana. La transparencia es nuestra principal garantía.',
  },
  {
    id: 'return',
    q: '¿Cuándo recibo mis ganancias?',
    a: 'Al vencer el plazo de tu plan (30, 60 o 90 días según lo que elegiste), recibes tu capital inicial más las ganancias directamente en la wallet USDT que registraste al crear tu cuenta. El proceso de devolución se inicia automáticamente al vencer el plan y se completa en menos de 24 horas.',
  },
  {
    id: 'crypto',
    q: '¿Qué criptomonedas aceptan?',
    a: 'Aceptamos USDT en red TRC20 (Tron) y ERC20 (Ethereum), así como BTC (Bitcoin). Recomendamos USDT TRC20 para minimizar las comisiones de red y evitar la volatilidad del precio durante el plan. Las ganancias se devuelven siempre en USDT TRC20.',
  },
  {
    id: 'apikey',
    q: '¿Necesito instalar algo o dar acceso a mi broker?',
    a: 'No. Este es uno de los aspectos que más valoran nuestros clientes. No necesitas instalar ningún software, no necesitas crear API keys, no necesitas conectar tu broker ni ninguna cuenta externa. Solo transfieres tu capital a nuestras wallets verificadas y nosotros operamos con él.',
  },
  {
    id: 'custom',
    q: '¿Puedo invertir un monto personalizado?',
    a: 'Sí. Con el Plan Personalizado puedes definir el capital que quieras (desde $300 USDT) y el plazo que prefieras (30, 60 o 90 días). El retorno estimado se ajusta automáticamente según el capital: +5% para capitales menores de $1,000, +12% entre $1,000 y $4,999, y +22% para $5,000 o más.',
  },
  {
    id: 'early',
    q: '¿Qué pasa si quiero retirar antes del plazo?',
    a: 'Los planes tienen duración fija y no están diseñados para retirada anticipada, ya que el capital está activo en operativas de trading. Si tienes una situación excepcional, contacta a tu gestor personal y se valorará tu caso. Por eso recomendamos invertir capital que puedas mantener inmovilizado durante el plazo elegido.',
  },
  {
    id: 'guarantee',
    q: '¿Garantizan el retorno?',
    a: 'Los retornos indicados son estimaciones basadas en nuestra operativa histórica y pueden variar. El trading conlleva riesgo de pérdida de capital. Lo que sí garantizamos es la devolución de tu capital más el rendimiento generado al vencer el plan, y la transparencia total sobre el proceso. No somos un fondo garantizado.',
  },
]

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="faq" ref={ref} className="py-32 bg-[#111418]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center">
            <SectionTag>Preguntas frecuentes</SectionTag>
          </div>
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#F5F0E8] leading-tight tracking-tight">
            Respuestas directas,
            <br />
            <span className="text-[#C9A227] italic">sin letra pequeña.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-2xl border border-[rgba(245,240,232,0.07)] bg-[#0A0B0D] px-2 lg:px-3"
        >
          <Accordion type="single" collapsible>
            {FAQS.map(({ id, q, a }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="text-base lg:text-lg">{q}</AccordionTrigger>
                <AccordionContent className="text-sm lg:text-[15px]">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
