import { ShieldAlert } from 'lucide-react'

const LEGAL = [
  { label: 'Términos de servicio', href: '#' },
  { label: 'Política de privacidad', href: '#' },
  { label: 'Aviso de riesgo', href: '#' },
  { label: 'Cookies', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111418] border-t border-[rgba(201,162,39,0.08)]">
      <div className="border-b border-[rgba(201,162,39,0.06)] bg-[rgba(201,162,39,0.025)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-start gap-3 rounded-xl">
            <ShieldAlert size={15} className="text-[rgba(201,162,39,0.5)] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#5A5650] leading-[1.7]">
              <strong className="text-[#9B9590] font-medium">
                AURUM gestiona capital de clientes para operativa de trading. No somos una entidad financiera regulada ni un banco.
              </strong>{' '}
              El trading conlleva un alto riesgo de pérdida de capital. Los rendimientos estimados son orientativos y no constituyen
              una garantía. Invierte únicamente capital que puedas permitirte destinar a este tipo de inversión de riesgo.
              No dirigido a menores de 18 años.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <span className="font-serif text-xl text-[#F5F0E8] tracking-[0.1em]">AURUM</span>
            <p className="text-[12px] text-[#3D3A36] mt-1.5">
              Capital en manos expertas. Ganancias en tu wallet.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {LEGAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] text-[#3D3A36] hover:text-[#9B9590] hover:bg-[rgba(245,240,232,0.04)] transition-colors px-3 py-1.5 rounded-full"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 pt-8 border-t border-[rgba(201,162,39,0.05)] flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-mono text-[11px] text-[#2D2C2A]">
            © {new Date().getFullYear()} AURUM Capital. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[11px] text-[#2D2C2A]">
            Trading profesional · Inversión en crypto
          </p>
        </div>
      </div>
    </footer>
  )
}
