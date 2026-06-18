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
    a: 'Nuestras direcciones de depósito son públicas, siempre las mismas y verificables. Cada transferencia la confirma a mano nuestro equipo antes de activar tu plan. Además tienes una gestora personal asignada que te escribe cada semana con el estado de tu inversión. Nunca te pediremos contraseñas, claves de tu banco ni acceso a tus cuentas personales.',
  },
  {
    id: 'who',
    q: '¿Quién maneja mi dinero?',
    a: 'Un equipo humano de cuatro personas: Carlos Mendez (Director de Inversiones, 12 años en mercados), Ana García (Gestora Senior, especialista en activos digitales desde 2017), Rodrigo Vásquez (Analista de Control de Riesgo, pone los límites de pérdida en cada operación) y María Fernández (tu gestora personal, tu punto de contacto directo). No es un robot sin supervisión. Hay personas reales tomando decisiones cada día.',
  },
  {
    id: 'howgain',
    q: '¿Cómo generan las ganancias? ¿Cómo funciona eso?',
    a: 'Compramos activos digitales (criptomonedas) cuando el precio baja y los vendemos cuando sube. Lo hacemos cientos de veces al día, las 24 horas, usando un sistema automatizado supervisado por nuestro equipo. El resultado de todas esas pequeñas compras y ventas es la ganancia que te entregamos al final de tu plan. No es magia: es trabajo constante y método.',
  },
  {
    id: 'risk',
    q: '¿Qué pasa si hay pérdidas? ¿Puedo perder mi dinero?',
    a: 'Sí, existe esa posibilidad y es importante que lo sepas. El mercado de criptomonedas puede caer mucho de golpe y afectar los resultados. Algunos meses pueden ser negativos (en nuestro historial, abril 2024 fue -0.4%). Si el mercado cae muy fuerte durante tu plan, podrías recibir menos de lo que pusiste. Por eso siempre decimos: invierte solo dinero que puedas permitirte dejar quieto durante el plazo elegido, sin que lo necesites para el día a día. La honestidad sobre el riesgo es parte de quiénes somos.',
  },
  {
    id: 'return',
    q: '¿Cuándo recibo mi dinero de vuelta?',
    a: 'Al terminar el plazo de tu plan (30, 60 o 90 días), recibes tu dinero inicial más lo que ganaste, directamente en tu billetera digital. El proceso de devolución empieza automáticamente al terminar el plan y se completa en menos de 24 horas.',
  },
  {
    id: 'crypto',
    q: 'No sé nada de criptomonedas. ¿Puedo igual invertir?',
    a: 'Sí, precisamente para eso estamos. No necesitas saber nada de criptomonedas, ni instalar aplicaciones, ni conectar ninguna cuenta. Solo necesitas poder recibir o enviar dólares digitales (USDT), que es como tener una billetera digital con dólares. Te explicamos paso a paso cómo hacerlo la primera vez. Miles de nuestros clientes empezaron igual que tú, sin saber nada.',
  },
  {
    id: 'wallet',
    q: '¿Qué es una billetera digital? ¿Cómo la consigo?',
    a: 'Una billetera digital es como una cuenta bancaria para dinero digital. Tiene una dirección única (como un número de cuenta) donde se recibe y envía dinero. Puedes crear una gratis en aplicaciones como Binance, que es la más conocida. Una vez que tienes tu billetera, puedes enviarnos el dinero y recibirlo de vuelta cuando termine tu plan. Te guiamos en todo el proceso si lo necesitas.',
  },
  {
    id: 'custom',
    q: '¿Puedo invertir una cantidad diferente a las de los planes?',
    a: 'Sí. Tenemos un Plan Personalizado donde tú dices cuánto quieres invertir (mínimo $300) y el tiempo que prefieres (30, 60 o 90 días). La ganancia estimada se ajusta automáticamente: +5% para menos de $1,000, +12% entre $1,000 y $4,999, y +22% para $5,000 o más.',
  },
  {
    id: 'early',
    q: '¿Puedo retirar antes de que termine el plazo?',
    a: 'Los planes tienen un tiempo fijo porque tu dinero está activo en operaciones de compra y venta. No están diseñados para retiro anticipado. Si tienes una situación especial de verdad, escríbele a tu gestora personal y revisamos tu caso. Por eso recomendamos invertir solo dinero que puedas mantener quieto durante el plazo que elijas.',
  },
  {
    id: 'guarantee',
    q: '¿Garantizan la ganancia?',
    a: 'Las ganancias que ves en los planes son estimaciones basadas en nuestro historial real de trabajo. No son una garantía matemática. Lo que sí comprometemos: devolverte tu dinero más lo que se haya ganado al terminar el plan, y ser completamente transparentes sobre el proceso. No somos un fondo de inversión garantizado. Si alguien te ofrece ganancias 100% garantizadas, desconfía.',
  },
  {
    id: 'legal',
    q: '¿Es legal esto? ¿Están registrados en algún lado?',
    a: 'AURUM Capital S.A.S. es una empresa registrada en Panamá (Registro Comercial N° 2024-AURUM-0847). Gestionamos dinero de inversores para operar con activos digitales. No estamos regulados por organismos financieros gubernamentales como la SEC o la CNMV. Operamos en un espacio legal permitido para gestión de activos digitales, siendo honestos sobre nuestra naturaleza: somos una empresa privada de gestión, no un banco ni un fondo regulado.',
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
            Todo lo que quieres saber,
            <br />
            <span className="text-[#C9A227] italic">sin rodeos.</span>
          </h2>
          <p className="text-[#9B9590] text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Incluidas las preguntas difíciles: sobre riesgos, sobre quién maneja tu dinero
            y sobre qué pasa si algo sale mal. Aquí no escondemos nada.
          </p>
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
