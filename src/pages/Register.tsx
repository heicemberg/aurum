import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuth, SelectedPlan } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const PLANS: SelectedPlan[] = [
  { id: 'starter', name: 'Starter', minCapital: 300, duration: 30, returnRate: 5 },
  { id: 'growth', name: 'Growth', minCapital: 1000, duration: 60, returnRate: 12 },
  { id: 'elite', name: 'Elite', minCapital: 5000, duration: 90, returnRate: 22 },
]

export default function Register() {
  const { register, pendingPlan } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2>(1)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(pendingPlan)
  const [investedAmount, setInvestedAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Completa todos los campos'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setError('')
    setStep(2)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPlan) { setError('Selecciona un plan de inversión'); return }
    const amount = Number(investedAmount)
    if (!amount || amount < selectedPlan.minCapital) {
      setError(`El monto mínimo para el plan ${selectedPlan.name} es $${selectedPlan.minCapital} USDT`)
      return
    }
    if (!walletAddress.trim()) { setError('Introduce tu wallet para recibir ganancias'); return }
    register({
      name: form.name,
      email: form.email,
      password: form.password,
      selectedPlan,
      investedAmount: amount,
      walletAddress: walletAddress.trim(),
    })
    navigate('/dashboard')
  }

  const ease = [0.25, 0.46, 0.45, 0.94] as const

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex flex-col">
      {/* Minimal header */}
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
          className="w-full max-w-lg"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[11px] transition-colors ${step >= 1 ? 'border-[#C9A227] text-[#C9A227] bg-[rgba(201,162,39,0.08)]' : 'border-[rgba(245,240,232,0.15)] text-[#5A5650]'}`}>1</div>
            <div className={`h-px flex-1 transition-colors ${step >= 2 ? 'bg-[rgba(201,162,39,0.4)]' : 'bg-[rgba(245,240,232,0.08)]'}`} />
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[11px] transition-colors ${step >= 2 ? 'border-[#C9A227] text-[#C9A227] bg-[rgba(201,162,39,0.08)]' : 'border-[rgba(245,240,232,0.15)] text-[#5A5650]'}`}>2</div>
          </div>

          {step === 1 && (
            <>
              <h1 className="font-serif text-3xl lg:text-4xl text-[#F5F0E8] mb-2 tracking-tight">Crea tu cuenta</h1>
              <p className="text-[#5A5650] text-sm mb-8">Ya tienes cuenta? <Link to="/login" className="text-[#C9A227] hover:underline">Inicia sesión</Link></p>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Tu nombre"
                    className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 pr-11 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A5650] hover:text-[#9B9590]">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-[#B4634F] text-xs">{error}</p>}
                <Button type="submit" className="w-full gap-2">
                  Continuar <ArrowRight size={14} />
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-serif text-3xl lg:text-4xl text-[#F5F0E8] mb-2 tracking-tight">Tu inversión</h1>
              <p className="text-[#5A5650] text-sm mb-8">Elige un plan y configura tu inversión inicial</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plan selector */}
                <div>
                  <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-3">Plan de inversión</label>
                  <div className="space-y-2.5">
                    {PLANS.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => { setSelectedPlan(plan); setInvestedAmount(String(plan.minCapital)) }}
                        className={`w-full text-left rounded-xl border p-4 transition-all ${selectedPlan?.id === plan.id ? 'border-[#C9A227] bg-[rgba(201,162,39,0.05)]' : 'border-[rgba(245,240,232,0.08)] bg-[#111418] hover:border-[rgba(201,162,39,0.25)]'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan?.id === plan.id ? 'border-[#C9A227] bg-[#C9A227]' : 'border-[rgba(245,240,232,0.2)]'}`}>
                              {selectedPlan?.id === plan.id && <Check size={9} className="text-[#0A0B0D]" />}
                            </div>
                            <div>
                              <span className="text-[#F5F0E8] text-sm font-medium">{plan.name}</span>
                              <span className="text-[#5A5650] text-xs ml-2">desde ${plan.minCapital} USDT · {plan.duration} días</span>
                            </div>
                          </div>
                          <span className="font-serif text-[#C9A227] text-base">+{plan.returnRate}%</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                {selectedPlan && (
                  <div>
                    <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">
                      Monto a invertir (mín. ${selectedPlan.minCapital} USDT)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={investedAmount}
                        onChange={e => setInvestedAmount(e.target.value)}
                        min={selectedPlan.minCapital}
                        className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 pr-20 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#5A5650]">USDT</span>
                    </div>
                    {investedAmount && Number(investedAmount) >= selectedPlan.minCapital && (
                      <p className="text-[#6FBF8B] text-xs mt-1.5">
                        Recibirás: ${(Number(investedAmount) * (1 + selectedPlan.returnRate / 100)).toFixed(0)} USDT al vencer
                      </p>
                    )}
                  </div>
                )}

                {/* Wallet */}
                <div>
                  <label className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase block mb-2">Tu wallet para recibir ganancias (USDT TRC20)</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    placeholder="T..."
                    className="w-full bg-[#111418] border border-[rgba(245,240,232,0.08)] rounded-xl px-4 py-3 text-[#F5F0E8] text-sm font-mono placeholder:text-[#3D3A36] focus:outline-none focus:border-[rgba(201,162,39,0.4)] transition-colors"
                  />
                  <p className="text-[#3D3A36] text-[11px] mt-1.5">Aquí recibirás tu capital + ganancias al vencer el plan</p>
                </div>

                {error && <p className="text-[#B4634F] text-xs">{error}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-[rgba(245,240,232,0.08)] text-[#5A5650] text-sm hover:text-[#9B9590] transition-colors">
                    Atrás
                  </button>
                  <Button type="submit" className="flex-1 gap-2">
                    Activar cuenta <ArrowRight size={14} />
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
