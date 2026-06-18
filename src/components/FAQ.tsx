import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import SectionTag from '@/components/ui/section-tag'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const FAQS = [
  {
    q: '¿Qué necesito saber para empezar?',
    a: 'Nada técnico. Solo necesitas un correo electrónico, tener al menos $300 dólares disponibles y acceso a una billetera digital básica para enviar el dinero. Nosotros te guiamos en cada paso, incluyendo cómo usar la billetera si nunca lo has hecho.',
  },
  {
    q: '¿Qué es exactamente lo que hacen con mi dinero?',
    a: 'Nuestro equipo compra y vende criptomonedas (principalmente Bitcoin y Ethereum) aprovechando los cambios de precio. Compramos cuando el precio baja, vendemos cuando sube. Hacemos esto decenas de veces por día. Al final de tu plan, la ganancia acumulada de todas esas operaciones es lo que tú recibes.',
  },
  {
    q: '¿Cuánto puedo ganar? ¿Es seguro?',
    a: 'La ganancia estimada es entre +5% y +22% dependiendo del plan elegido. Nuestro historial de los últimos 12 meses muestra una media de +6.3% mensual, con solo un mes negativo de -0.4%. Dicho esto, la inversión en criptomonedas conlleva riesgo y no está garantizada al 100%. Recomendamos invertir solo dinero que puedas dejar quieto sin necesitarlo durante el plazo.',
  },
  {
    q: '¿Cuándo y cómo recibo mi dinero de vuelta?',
    a: 'Al terminar el plazo de tu plan (30, 60 o 90 días), tu dinero inicial más las ganancias se envían a la dirección de billetera digital que tú nos indiques. El proceso tarda entre 24 y 48 horas después de que termina el plan. No hay condiciones ocultas ni renovaciones automáticas.',
  },
  {
    q: '¿Qué pasa si el mercado baja mucho?',
    a: 'Usamos tres mecanismos de protección: límites automáticos de pérdida por operación, diversificación (nunca todo el dinero en una sola operación) y supervisión humana constante. Aun así, si el mercado tiene una caída extrema, es posible que el resultado sea negativo. Ha ocurrido una vez en 12 meses con -0.4%. Por eso siempre decimos: invierte lo que puedas dejar sin tocar.',
  },
  {
    q: '¿Puedo retirar mi dinero antes de que termine el plan?',
    a: 'Los planes tienen un plazo fijo (30, 60 o 90 días) porque necesitamos ese tiempo para completar el ciclo de operaciones. Retirar antes implica cancelar el plan en curso y puede resultar en una ganancia menor o pérdida parcial. Si necesitas el dinero en cualquier momento, escríbenos y evaluamos tu caso.',
  },
  {
    q: '¿Es legal? ¿Están registrados como empresa?',
    a: 'Sí. Operamos como AURUM Capital S.A.S., empresa registrada bajo el número 2024-AURUM-0847 en Panamá. Ofrecemos gestión de activos digitales bajo los términos legales vigentes. Puedes encontrar nuestra información legal completa en el pie de página de este sitio.',
  },
  {
    q: '¿Quiénes son los gestores que manejan mi dinero?',
    a: 'Somos un equipo de cuatro personas: Carlos Mendez (Director de Inversiones, 12 años de experiencia), Ana García (Gestora Senior en criptomonedas desde 2017), Rodrigo Vásquez (Control de Riesgo, 8 años protegiendo capital) y María Fernández (gestora personal asignada a cada inversor). Puedes conocernos mejor en la sección "Nuestro Equipo".',
  },
  {
    q: '¿Cómo sé que mi dinero está siendo gestionado realmente?',
    a: 'Cada semana tu gestora personal te escribe con el estado de tu inversión. Tienes acceso a un panel donde puedes ver el estado de tu plan en tiempo real. Además, publicamos nuestro historial de resultados mes a mes en este sitio, incluyendo los meses negativos. No ocultamos nada.',
  },
  {
    q: '¿Puedo invertir si vivo fuera de Latinoamérica?',
    a: 'Sí. Trabajamos con clientes en toda América Latina, España y cualquier país donde puedas acceder a una billetera digital para enviar dólares digitales. La gestión se hace 100% en línea y la comunicación es por chat y correo.',
  },
  {
    q: '¿Qué es una billetera digital? ¿Necesito crear una?',
    a: 'Una billetera digital es como una cuenta bancaria para dinero digital. Para invertir con nosotros necesitas una. Si no tienes una, te ayudamos a crear una gratuita con una guía paso a paso. No tienes que entender cómo funciona por dentro, solo cómo usarla para enviar y recibir dinero.',
  },
]

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <section id="faq" ref={ref} className="py-32 bg-[#F8F7F5]">
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
          <h2 className="font-serif font-normal text-4xl lg:text-5xl text-[#1A1918] leading-tight tracking-tight">
            Todo lo que necesitas saber
          </h2>
          <p className="text-[#6B6862] mt-4 text-sm leading-relaxed">
            Si tienes alguna duda que no encuentras aquí, escríbenos directamente.
            Respondemos en menos de 4 horas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-black/[0.07] bg-white px-1 overflow-hidden hover:border-[#C9A227]/20 transition-colors">
                <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold text-[#1A1918] hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-[#4A4845] text-[13px] leading-[1.8]">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-[#C9A227]/15 bg-[#C9A227]/[0.04] p-7 text-center"
        >
          <p className="text-[#1A1918] font-semibold mb-1.5">¿No encontraste tu respuesta?</p>
          <p className="text-[#6B6862] text-sm mb-5">
            Escríbenos directamente. Atendemos de lunes a sábado de 9am a 8pm.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:soporte@aurumcapital.io"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-white px-5 py-2.5 text-[#B8941F] text-sm font-medium hover:bg-[#C9A227]/[0.06] transition-colors"
            >
              soporte@aurumcapital.io
            </a>
            <Button variant="ghost" onClick={() => navigate('/register')} className="rounded-full">
              Empezar ahora
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
