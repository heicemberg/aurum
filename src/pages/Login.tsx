import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await login(email, password)
    if (err) {
      setError(err)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const ease = [0.25, 0.46, 0.45, 0.94] as const

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex flex-col">
      <div className="px-6 py-5 border-b border-black/[0.06] bg-white">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
          <span className="font-serif text-xl text-[#1A1918] tracking-[0.14em]">AURUM</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8 lg:p-10">
            <h1 className="font-serif text-3xl text-[#1A1918] mb-1.5 tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-[#6B6862] text-sm mb-8">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-[#B8941F] hover:underline font-medium">Crear cuenta</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-4 py-3 pr-11 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9590] hover:text-[#4A4845]">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-[#B83232] text-xs">{error}</p>}
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Acceder</span><ArrowRight size={14} /></>}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
