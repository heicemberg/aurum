import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useAuth, SelectedPlan } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const PLANS: SelectedPlan[] = [
  { id: 'starter', name: 'Básico', minCapital: 300, duration: 30, returnRate: 5 },
  { id: 'growth', name: 'Crecimiento', minCapital: 1000, duration: 60, returnRate: 12 },
  { id: 'elite', name: 'Elite', minCapital: 5000, duration: 90, returnRate: 22 },
]

const inputClass = 'w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/50 transition-colors'

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
  const [loading, setLoading] = useState(false)

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Completa todos los campos'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setError('')
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPlan) { setError('Selecciona un plan de inversión'); return }
    const amount = Number(investedAmount)
    if (!amount || amount < selectedPlan.minCapital) {
      setError(`El monto mínimo para el plan ${selectedPlan.name} es $${selectedPlan.minCapital}`)
      return
    }
    if (!walletAddress.trim()) { setError('Introduce tu dirección de billetera para recibir tus ganancias'); return }

    setLoading(true)
    setError('')

    const err = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      selectedPlan,
      investedAmount: amount,
      walletAddress: walletAddress.trim(),
    })

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
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              {[1, 2].map(n => (
                <div key={n} className="flex items-center gap-3 flex-1">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[11px] transition-colors flex-shrink-0 ${step >= n ? 'border-[#C9A227] text-[#B8941F] bg-[#C9A227]/[0.08]' : 'border-black/[0.12] text-[#9A9590]'}`}>
                    {n}
                  </div>
                  {n < 2 && <div className={`h-px flex-1 transition-colors ${step >= 2 ? 'bg-[#C9A227]/40' : 'bg-black/[0.08]'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <>
                <h1 className="font-serif text-3xl text-[#1A1918] mb-1.5 tracking-tight">Crea tu cuenta</h1>
                <p className="text-[#6B6862] text-sm mb-8">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-[#B8941F] hover:underline font-medium">Inicia sesión</Link>
                </p>
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">Nombre completo</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">Contraseña</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 6 caracteres" className={inputClass + ' pr-11'} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9590] hover:text-[#4A4845]">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-[#B83232] text-xs">{error}</p>}
                  <Button type="submit" className="w-full gap-2">Continuar <ArrowRight size={14} /></Button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-serif text-3xl text-[#1A1918] mb-1.5 tracking-tight">Tu inversión</h1>
                <p className="text-[#6B6862] text-sm mb-8">Elige un plan y configura tu inversión inicial</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-3">Plan de inversión</label>
                    <div className="space-y-2.5">
                      {PLANS.map(plan => (
                        <button key={plan.id} type="button"
                          onClick={() => { setSelectedPlan(plan); setInvestedAmount(String(plan.minCapital)) }}
                          className={`w-full text-left rounded-xl border p-4 transition-all ${selectedPlan?.id === plan.id ? 'border-[#C9A227] bg-[#C9A227]/[0.05]' : 'border-black/[0.08] bg-[#F8F7F5] hover:border-[#C9A227]/30'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedPlan?.id === plan.id ? 'border-[#C9A227] bg-[#C9A227]' : 'border-black/[0.2]'}`}>
                                {selectedPlan?.id === plan.id && <Check size={9} className="text-white" />}
                              </div>
                              <div>
                                <span className="text-[#1A1918] text-sm font-semibold">{plan.name}</span>
                                <span className="text-[#9A9590] text-xs ml-2">desde ${plan.minCapital} · {plan.duration} días</span>
                              </div>
                            </div>
                            <span className="font-serif text-[#B8941F] text-base font-medium">+{plan.returnRate}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPlan && (
                    <div>
                      <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">
                        Cuánto quieres invertir (mínimo ${selectedPlan.minCapital})
                      </label>
                      <div className="relative">
                        <input type="number" value={investedAmount} onChange={e => setInvestedAmount(e.target.value)}
                          min={selectedPlan.minCapital} placeholder={String(selectedPlan.minCapital)} className={inputClass + ' pr-16'} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#9A9590]">USD</span>
                      </div>
                      {investedAmount && Number(investedAmount) >= selectedPlan.minCapital && (
                        <p className="text-[#1E7A47] text-xs mt-1.5 font-medium">
                          Recibirías: ${(Number(investedAmount) * (1 + selectedPlan.returnRate / 100)).toFixed(0)} al terminar
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="font-mono text-[10px] text-[#9A9590] tracking-[0.15em] uppercase block mb-2">
                      Tu dirección de billetera digital para recibir ganancias
                    </label>
                    <input type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)}
                      placeholder="Dirección de tu billetera (te ayudamos a crearla si no tienes)" className={inputClass + ' font-mono text-xs'} />
                    <p className="text-[#B8B4AF] text-[11px] mt-1.5">
                      Al terminar tu plan, enviamos tu capital + ganancias a esta dirección. Si no tienes una billetera, escríbenos.
                    </p>
                  </div>

                  {error && <p className="text-[#B83232] text-xs">{error}</p>}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-black/[0.08] text-[#6B6862] text-sm hover:border-black/[0.15] transition-colors">
                      Atrás
                    </button>
                    <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                      {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Activar cuenta</span><ArrowRight size={14} /></>}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
