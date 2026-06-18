import { ShieldAlert, Mail, MapPin, FileText } from 'lucide-react'

const LEGAL = [
  { label: 'Términos de servicio', href: '#' },
  { label: 'Política de privacidad', href: '#' },
  { label: 'Aviso de riesgo', href: '#' },
  { label: 'Política de cookies', href: '#' },
]

const NAV = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Nuestro equipo', href: '#equipo' },
  { label: 'Planes', href: '#planes' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Preguntas frecuentes', href: '#faq' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111418] border-t border-[rgba(201,162,39,0.08)]">
      {/* Risk disclaimer */}
      <div className="border-b border-[rgba(201,162,39,0.06)] bg-[rgba(201,162,39,0.025)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-start gap-3 rounded-xl">
            <ShieldAlert size={15} className="text-[rgba(201,162,39,0.5)] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#8A8580] leading-[1.7]">
              <strong className="text-[#9B9590] font-medium">
                AURUM Capital S.A.S. gestiona dinero de inversores para operaciones de compra y venta de criptomonedas.
                No somos un banco ni una entidad financiera regulada por organismos gubernamentales.
              </strong>{' '}
              Las operaciones de compra y venta de activos digitales conllevan riesgo real de perder parte o la totalidad
              del capital invertido. Las ganancias estimadas son orientativas y no constituyen una garantía.
              Invierte únicamente dinero que puedas permitirte dejar quieto durante el plazo sin que lo necesites.
              Solo para mayores de 18 años.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
              <span className="font-serif text-xl text-[#F5F0E8] tracking-[0.14em]">AURUM</span>
            </div>
            <p className="text-[12px] text-[#7A7570] mt-1.5 leading-relaxed mb-4">
              Tu dinero trabajando por ti. Ganancias directas a tu billetera digital.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#5A5650]" />
                <span className="text-[12px] text-[#7A7570]">soporte@aurum.capital</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[#5A5650]" />
                <span className="text-[12px] text-[#7A7570]">Panamá, República de Panamá</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-1">
            <h4 className="font-mono text-[11px] text-[#7A7570] tracking-[0.15em] uppercase mb-4">Explorar</h4>
            <nav className="flex flex-col gap-2.5">
              {NAV.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[13px] text-[#7A7570] hover:text-[#9B9590] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company info */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[11px] text-[#7A7570] tracking-[0.15em] uppercase mb-4">Información legal de la empresa</h4>
            <div className="rounded-xl border border-[rgba(245,240,232,0.07)] bg-[#0A0B0D] p-5 space-y-3">
              <div className="flex items-start gap-3">
                <FileText size={13} className="text-[#5A5650] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[12px] text-[#9B9590] font-medium">Razón social</div>
                  <div className="text-[12px] text-[#7A7570]">AURUM Capital S.A.S.</div>
                </div>
              </div>
              <div className="h-px bg-[rgba(245,240,232,0.05)]" />
              <div className="flex items-start gap-3">
                <FileText size={13} className="text-[#5A5650] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[12px] text-[#9B9590] font-medium">Registro comercial</div>
                  <div className="text-[12px] text-[#7A7570]">N° 2024-AURUM-0847 · Panamá</div>
                </div>
              </div>
              <div className="h-px bg-[rgba(245,240,232,0.05)]" />
              <div className="flex items-start gap-3">
                <ShieldAlert size={13} className="text-[#5A5650] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[12px] text-[#9B9590] font-medium">Naturaleza jurídica</div>
                  <div className="text-[12px] text-[#7A7570] leading-relaxed">
                    Empresa privada de gestión de activos digitales. No está regulada por la SEC,
                    la CNMV ni ningún organismo equivalente. Lee el aviso de riesgo antes de invertir.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-[rgba(201,162,39,0.05)]">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <nav className="flex flex-wrap gap-x-4 gap-y-1">
              {LEGAL.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="font-mono text-[11px] text-[#6A6560] hover:text-[#9B9590] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <p className="font-mono text-[11px] text-[#5A5650]">
              © {new Date().getFullYear()} AURUM Capital S.A.S. Todos los derechos reservados.
            </p>
            <p className="font-mono text-[11px] text-[#5A5650]">
              Gestión de inversiones · Activos digitales
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
