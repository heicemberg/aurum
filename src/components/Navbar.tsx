import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Confianza', href: '#confianza' },
  { label: 'Planes', href: '#planes' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNavLink(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
      setMobileOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div className={`max-w-5xl mx-auto rounded-2xl transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(17,20,24,0.85)] backdrop-blur-2xl border border-[rgba(245,240,232,0.09)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
          : 'bg-[rgba(17,20,24,0.35)] backdrop-blur-xl border border-[rgba(245,240,232,0.04)]'
      }`}>
        <div className="px-5 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
              <span className="font-serif text-xl text-[#F5F0E8] tracking-[0.14em]">AURUM</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => handleNavLink(e, link.href)}
                  className="font-mono text-[12px] text-[#9B9590] hover:text-[#F5F0E8] px-3.5 py-2 rounded-full hover:bg-[rgba(245,240,232,0.05)] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={13} />
                    Mi panel
                  </Button>
                  <button onClick={() => { logout(); navigate('/') }} className="font-mono text-[11px] text-[#5A5650] hover:text-[#9B9590] px-3 py-2 transition-colors">
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="font-mono text-[12px] text-[#9B9590] hover:text-[#F5F0E8] px-3.5 py-2 rounded-full hover:bg-[rgba(245,240,232,0.05)] transition-colors">
                    Iniciar sesión
                  </button>
                  <Button size="sm" onClick={() => navigate('/register')}>Comenzar</Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-[#9B9590] hover:text-[#F5F0E8] transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-[rgba(201,162,39,0.08)]"
            >
              <nav className="px-5 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={e => handleNavLink(e, link.href)}
                    className="font-mono text-[12px] text-[#9B9590] hover:text-[#F5F0E8] transition-colors py-2.5"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Button className="w-full gap-2" onClick={() => { navigate('/dashboard'); setMobileOpen(false) }}>
                        <LayoutDashboard size={13} /> Mi panel
                      </Button>
                      <button onClick={() => { logout(); navigate('/'); setMobileOpen(false) }} className="font-mono text-[11px] text-[#5A5650] py-2">
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" onClick={() => { navigate('/register'); setMobileOpen(false) }}>Comenzar a invertir</Button>
                      <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className="font-mono text-[11px] text-[#9B9590] py-2">
                        Ya tengo cuenta
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
