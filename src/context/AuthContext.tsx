import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { chatService } from '@/lib/chatService'
import type { Session } from '@supabase/supabase-js'

export interface SelectedPlan {
  id: string
  name: string
  minCapital: number
  duration: number
  returnRate: number
  customAmount?: number
}

export interface User {
  name: string
  email: string
  selectedPlan: SelectedPlan | null
  investedAmount: number
  walletAddress: string
  status: 'pending_payment' | 'active' | 'completed'
  startDate: string | null
  endDate: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (data: Omit<User, 'status' | 'startDate' | 'endDate'> & { password: string }) => Promise<string | null>
  logout: () => Promise<void>
  activatePlan: () => Promise<void>
  loginDemo: () => void
  logoutDemo: () => void
  setPendingPlan: (plan: SelectedPlan) => void
  pendingPlan: SelectedPlan | null
}

const AuthContext = createContext<AuthContextType | null>(null)
const PENDING_PLAN_KEY = 'aurum_pending_plan'

function profileToUser(profile: Record<string, unknown>): User {
  return {
    name: profile.name as string,
    email: profile.email as string,
    selectedPlan: profile.plan_id ? {
      id: profile.plan_id as string,
      name: profile.plan_name as string,
      minCapital: 300,
      duration: profile.plan_duration as number,
      returnRate: profile.plan_return_rate as number,
    } : null,
    investedAmount: (profile.invested_amount as number) || 0,
    walletAddress: (profile.wallet_address as string) || '',
    status: (profile.status as User['status']) || 'pending_payment',
    startDate: (profile.start_date as string) || null,
    endDate: (profile.end_date as string) || null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const [pendingPlan, setPendingPlanState] = useState<SelectedPlan | null>(() => {
    try {
      const s = localStorage.getItem(PENDING_PLAN_KEY)
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  function setPendingPlan(plan: SelectedPlan) {
    setPendingPlanState(plan)
    localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(plan))
  }

  /* ── Load session on mount ──────────────────────────── */
  useEffect(() => {
    let mounted = true

    async function loadSession(session: Session | null) {
      if (!session?.user) {
        if (mounted) { setUser(null); setLoading(false) }
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (mounted) {
        if (profile) {
          const u = profileToUser(profile)
          setUser(u)
          chatService.initForClient(u.email)
        }
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => loadSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isDemo) loadSession(session)
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Register ───────────────────────────────────────── */
  async function register(
    data: Omit<User, 'status' | 'startDate' | 'endDate'> & { password: string }
  ): Promise<string | null> {
    const { name, email, password, selectedPlan, investedAmount, walletAddress } = data

    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) return signUpError.message
    if (!authData.user) return 'No se pudo crear la cuenta'

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      name,
      email,
      wallet_address: walletAddress,
      plan_id: selectedPlan?.id ?? null,
      plan_name: selectedPlan?.name ?? null,
      plan_duration: selectedPlan?.duration ?? null,
      plan_return_rate: selectedPlan?.returnRate ?? null,
      invested_amount: investedAmount,
      status: 'pending_payment',
    })

    if (profileError) return profileError.message

    await chatService.createConversation(email, name, email, selectedPlan?.name, investedAmount)

    localStorage.removeItem(PENDING_PLAN_KEY)
    setPendingPlanState(null)
    return null
  }

  /* ── Login ──────────────────────────────────────────── */
  async function login(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return 'Email o contraseña incorrectos'

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return 'No se pudo iniciar sesión'

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
    if (!profile) return 'No se encontró el perfil de usuario'

    const u = profileToUser(profile)
    setUser(u)
    chatService.initForClient(u.email)
    return null
  }

  /* ── Logout ─────────────────────────────────────────── */
  async function logout(): Promise<void> {
    if (isDemo) {
      setIsDemo(false)
      setUser(null)
      return
    }
    chatService.cleanup()
    await supabase.auth.signOut()
    setUser(null)
  }

  /* ── Demo mode (no Supabase) ────────────────────────── */
  function loginDemo() {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - 14)
    const end = new Date(now)
    end.setDate(end.getDate() + 46)
    const demoUser: User = {
      name: 'Demo User',
      email: 'demo@aurum.io',
      selectedPlan: { id: 'growth', name: 'Crecimiento', minCapital: 1000, duration: 60, returnRate: 12 },
      investedAmount: 2000,
      walletAddress: 'billetera-ejemplo',
      status: 'active',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
    setIsDemo(true)
    setUser(demoUser)
  }

  function logoutDemo() {
    setIsDemo(false)
    setUser(null)
  }

  /* ── Activate plan (pending → active) ───────────────── */
  async function activatePlan(): Promise<void> {
    if (!user || isDemo) {
      if (isDemo && user) {
        const now = new Date()
        const end = new Date(now)
        end.setDate(end.getDate() + (user.selectedPlan?.duration ?? 30))
        setUser({ ...user, status: 'active', startDate: now.toISOString(), endDate: end.toISOString() })
      }
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const now = new Date()
    const end = new Date(now)
    end.setDate(end.getDate() + (user.selectedPlan?.duration ?? 30))

    await supabase.from('profiles').update({
      status: 'active',
      start_date: now.toISOString(),
      end_date: end.toISOString(),
    }).eq('id', session.user.id)

    setUser({ ...user, status: 'active', startDate: now.toISOString(), endDate: end.toISOString() })
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, activatePlan,
      loginDemo, logoutDemo, setPendingPlan, pendingPlan,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
