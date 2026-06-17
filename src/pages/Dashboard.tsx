import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Copy, Check, Clock, TrendingUp, Wallet, MessageCircle, ChevronRight, Play } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import ClientChat from '@/components/chat/ClientChat'

const AURUM_WALLETS = {
  usdt_trc20: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
  usdt_erc20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl border border-[rgba(245,240,232,0.08)] bg-[#0A0B0D] p-4">
      <div className="font-mono text-[10px] text-[#5A5650] tracking-[0.12em] uppercase mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[12px] text-[#9B9590] flex-1 break-all leading-relaxed">{value}</span>
        <button onClick={copy} className="flex-shrink-0 w-7 h-7 rounded-lg border border-[rgba(245,240,232,0.08)] flex items-center justify-center hover:border-[rgba(201,162,39,0.3)] transition-colors">
          {copied ? <Check size={12} className="text-[#6FBF8B]" /> : <Copy size={12} className="text-[#5A5650]" />}
        </button>
      </div>
    </div>
  )
}

function PendingPaymentState({ user, onConfirm }: { user: NonNullable<ReturnType<typeof useAuth>['user']>; onConfirm: () => void }) {
  const plan = user.selectedPlan
  const amount = user.investedAmount
  const gain = plan ? (amount * plan.returnRate / 100) : 0

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="rounded-2xl border border-[rgba(201,162,39,0.3)] bg-[rgba(201,162,39,0.04)] p-5 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-[#C9A227] mt-1.5 animate-pulse flex-shrink-0" />
        <div>
          <p className="text-[#F5F0E8] text-sm font-medium mb-1">Pendiente de pago</p>
          <p className="text-[#5A5650] text-xs leading-relaxed">Transfiere tu inversión a una de las wallets de abajo para activar tu plan. Tu gestor confirmará el pago en menos de 24 horas.</p>
        </div>
      </div>

      {/* Plan summary */}
      {plan && (
        <div className="rounded-2xl border border-[rgba(245,240,232,0.08)] bg-[#111418] p-6">
          <div className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase mb-4">Resumen de tu plan</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[#5A5650] text-xs mb-1">Plan</div>
              <div className="text-[#F5F0E8] font-medium">{plan.name}</div>
            </div>
            <div>
              <div className="text-[#5A5650] text-xs mb-1">Duración</div>
              <div className="text-[#F5F0E8] font-medium">{plan.duration} días</div>
            </div>
            <div>
              <div className="text-[#5A5650] text-xs mb-1">A invertir</div>
              <div className="text-[#F5F0E8] font-medium">${amount.toLocaleString()} USDT</div>
            </div>
            <div>
              <div className="text-[#5A5650] text-xs mb-1">Retorno estimado</div>
              <div className="text-[#C9A227] font-medium">+{plan.returnRate}% = +${gain.toFixed(0)} USDT</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(245,240,232,0.06)]">
            <div className="flex justify-between">
              <span className="text-[#5A5650] text-xs">Recibirás al vencer</span>
              <span className="text-[#6FBF8B] font-serif text-lg">${(amount + gain).toFixed(0)} USDT</span>
            </div>
          </div>
        </div>
      )}

      {/* Wallet addresses */}
      <div>
        <div className="font-mono text-[10px] text-[#5A5650] tracking-[0.15em] uppercase mb-3">Wallets de depósito verificadas</div>
        <div className="space-y-3">
          <CopyField label="USDT · TRC20 (recomendado · comisión mínima)" value={AURUM_WALLETS.usdt_trc20} />
          <CopyField label="USDT · ERC20" value={AURUM_WALLETS.usdt_erc20} />
          <CopyField label="BTC · Bitcoin" value={AURUM_WALLETS.btc} />
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl bg-[#111418] border border-[rgba(245,240,232,0.06)] p-4 space-y-2">
        <p className="font-mono text-[10px] text-[#5A5650] tracking-[0.12em] uppercase mb-3">Instrucciones</p>
        {[
          'Envía exactamente $' + amount.toLocaleString() + ' USDT a una de las wallets de arriba',
          'Guarda el comprobante de la transferencia (hash de transacción)',
          'Tu gestor verificará el pago y activará tu plan en menos de 24h',
          'Recibirás confirmación por email cuando tu plan esté activo',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-mono text-[10px] text-[#C9A227] mt-0.5 flex-shrink-0">0{i + 1}</span>
            <span className="text-[#5A5650] text-[12px] leading-relaxed">{step}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3.5 rounded-xl border border-[rgba(201,162,39,0.3)] text-[#C9A227] font-mono text-[12px] tracking-[0.1em] uppercase hover:bg-[rgba(201,162,39,0.05)] transition-colors"
      >
        Ya realicé la transferencia · Notificar a mi gestor
      </button>

      <button
        onClick={onConfirm}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[#3D3A36] hover:text-[#5A5650] font-mono text-[11px] transition-colors"
      >
        <Play size={10} className="fill-current" />
        Simular plan activo (demo)
      </button>
    </div>
  )
}

function ActivePlanState({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const plan = user.selectedPlan
  if (!plan) return null

  const start = user.startDate ? new Date(user.startDate) : new Date()
  const end = user.endDate ? new Date(user.endDate) : new Date()
  const now = new Date()

  const totalMs = end.getTime() - start.getTime()
  const elapsedMs = now.getTime() - start.getTime()
  const progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1)
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const totalGain = user.investedAmount * plan.returnRate / 100
  const estimatedCurrentGain = totalGain * progress
  const totalReturn = user.investedAmount + totalGain

  return (
    <div className="space-y-5">
      {/* Main investment card */}
      <div className="rounded-2xl border border-[rgba(201,162,39,0.25)] bg-[#111418] p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] text-[#C9A227] tracking-[0.18em] uppercase mb-1">Plan {plan.name} · Activo</div>
            <div className="text-[#F5F0E8] font-serif text-3xl">${user.investedAmount.toLocaleString()} <span className="text-[#5A5650] text-base">USDT</span></div>
          </div>
          <div className="text-right">
            <div className="text-[#5A5650] text-[11px] mb-1">Ganancia estimada</div>
            <div className="text-[#6FBF8B] font-serif text-2xl">+${estimatedCurrentGain.toFixed(0)}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-[#5A5650] font-mono">{Math.round(progress * 100)}% completado</span>
            <span className="text-[#5A5650]">{daysRemaining} días restantes</span>
          </div>
          <div className="h-1 bg-[rgba(245,240,232,0.06)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8BE3A] rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(245,240,232,0.06)]">
          <div>
            <div className="text-[#5A5650] text-[10px] font-mono mb-1">Inicio</div>
            <div className="text-[#9B9590] text-xs">{start.toLocaleDateString('es-ES')}</div>
          </div>
          <div>
            <div className="text-[#5A5650] text-[10px] font-mono mb-1">Vencimiento</div>
            <div className="text-[#9B9590] text-xs">{end.toLocaleDateString('es-ES')}</div>
          </div>
          <div>
            <div className="text-[#5A5650] text-[10px] font-mono mb-1">Al vencer</div>
            <div className="text-[#C9A227] text-xs font-medium">${totalReturn.toLocaleString()} USDT</div>
          </div>
        </div>
      </div>

      {/* Stats mini row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { Icon: TrendingUp, label: 'Rentabilidad', value: `+${plan.returnRate}%` },
          { Icon: Clock, label: 'Días restantes', value: String(daysRemaining) },
          { Icon: Wallet, label: 'Wallet destino', value: user.walletAddress.slice(0, 10) + '...' },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-[rgba(245,240,232,0.07)] bg-[#111418] p-4">
            <Icon size={13} className="text-[rgba(201,162,39,0.5)] mb-2" />
            <div className="font-mono text-[9px] text-[#3D3A36] uppercase tracking-wider mb-1">{label}</div>
            <div className="text-[#F5F0E8] text-sm font-medium">{value}</div>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="rounded-xl border border-[rgba(245,240,232,0.07)] bg-[#111418] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle size={15} className="text-[rgba(201,162,39,0.5)]" />
          <span className="text-[#9B9590] text-sm">¿Tienes preguntas? Tu gestor te responde en &lt;4h</span>
        </div>
        <ChevronRight size={14} className="text-[#3D3A36]" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout, activatePlan } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handlePaymentConfirmed() {
    activatePlan()
  }

  const ease = [0.25, 0.46, 0.45, 0.94] as const

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      {/* Top bar */}
      <div className="border-b border-[rgba(245,240,232,0.06)] bg-[rgba(17,20,24,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
            <span className="font-serif text-lg text-[#F5F0E8] tracking-[0.14em]">AURUM</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[#5A5650] text-sm hidden sm:block">Hola, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#5A5650] hover:text-[#9B9590] text-sm transition-colors">
              <LogOut size={13} />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <ClientChat />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl lg:text-3xl text-[#F5F0E8] tracking-tight mb-1">
              Bienvenido, {user.name.split(' ')[0]}
            </h1>
            <p className="text-[#5A5650] text-sm">Panel de inversión · AURUM Capital</p>
          </div>

          {user.status === 'pending_payment' && (
            <PendingPaymentState user={user} onConfirm={handlePaymentConfirmed} />
          )}
          {user.status === 'active' && (
            <ActivePlanState user={user} />
          )}
          {user.status === 'completed' && (
            <div className="rounded-2xl border border-[#6FBF8B] bg-[rgba(111,191,139,0.04)] p-8 text-center">
              <div className="font-serif text-4xl text-[#6FBF8B] mb-2">
                +${((user.investedAmount || 0) * (user.selectedPlan?.returnRate || 0) / 100).toFixed(0)} USDT
              </div>
              <p className="text-[#F5F0E8] font-medium mb-1">Plan completado</p>
              <p className="text-[#5A5650] text-sm">Tu capital y ganancias han sido enviados a tu wallet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
