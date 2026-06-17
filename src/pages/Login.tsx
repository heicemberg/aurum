import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(email, password)
    if (ok) navigate('/dashboard')
    else setError('Email o contraseña incorrectos')
  }

  const ease = [0.25, 0.46, 0.45, 0.94] as const

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex flex-col">
      <div className="px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
          <span className="font-serif text-xl text-[#F5F0E8] tracking-[0.14em]">AURUM</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-md"
        >
          <h1 className="font-serif text-3xl lg:text-4xl text-[#F5F0E8] mb-2 tracking-tight">Bienvenido de vuelta</h1>
          <p className="text-[#5A5650] text-sm mb-8">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[#C9A227] hover:underline">Crear cuenta</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 pr-11 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A5650] hover:text-[#9B9590]">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="text-[#B4634F] text-xs">{error}</p>}
            <Button type="submit" className="w-full gap-2">
              Acceder <ArrowRight size={14} />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
