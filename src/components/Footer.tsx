import { ShieldAlert, Mail, MapPin } from 'lucide-react'

const LEGAL = [
  { label: 'Términos de servicio', href: '#' },
  { label: 'Política de privacidad', href: '#' },
  { label: 'Aviso de riesgo', href: '#' },
  { label: 'Política anti-lavado', href: '#' },
]

const NAV = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Preguntas', href: '#faq' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111418] text-[#9A9590]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12 mb-14">
          <div>
            <div className="font-serif text-2xl text-white mb-3">Aurum</div>
            <p className="text-[13px] leading-[1.8] mb-5 text-[#6B6862]">
              Gestión de activos digitales para personas que quieren hacer crecer su dinero
              sin necesitar conocimientos técnicos.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <MapPin size={12} className="text-[#C9A227] flex-shrink-0" />
                <span className="text-[12px] text-[#6B6862]">AURUM Capital S.A.S. · Panamá</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={12} className="text-[#C9A227] flex-shrink-0" />
                <span className="text-[12px] text-[#6B6862]">Reg. N° 2024-AURUM-0847</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={12} className="text-[#C9A227] flex-shrink-0" />
                <a href="mailto:soporte@aurumcapital.io" className="text-[12px] text-[#6B6862] hover:text-white transition-colors">
                  soporte@aurumcapital.io
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] text-[#4A4845] tracking-[0.15em] uppercase mb-5">Navegación</div>
            <ul className="space-y-2.5">
              {NAV.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-[13px] text-[#6B6862] hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-[11px] text-[#4A4845] tracking-[0.15em] uppercase mb-5">Aviso de riesgo</div>
            <p className="text-[12px] text-[#4A4845] leading-[1.85] mb-4">
              La inversión en activos digitales conlleva un alto riesgo y puede resultar en la
              pérdida parcial o total del capital invertido. Los resultados pasados no garantizan
              resultados futuros. Esta información no constituye asesoramiento financiero.
            </p>
            <p className="text-[11px] text-[#3D3C3A] leading-[1.8]">
              Invertir solo el dinero que puedas mantener inmovilizado durante el plazo del plan.
              Consulta a un asesor financiero si tienes dudas sobre tu situación personal.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-[#3D3C3A]">
            © {new Date().getFullYear()} AURUM Capital S.A.S. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map(({ label, href }) => (
              <a key={label} href={href} className="text-[11px] text-[#4A4845] hover:text-[#6B6862] transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
