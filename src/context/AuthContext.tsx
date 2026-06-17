import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { chatService } from '@/lib/chatService'

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
  login: (email: string, password: string) => boolean
  register: (data: Omit<User, 'status' | 'startDate' | 'endDate'> & { password: string }) => void
  logout: () => void
  activatePlan: () => void
  loginDemo: () => void
  setPendingPlan: (plan: SelectedPlan) => void
  pendingPlan: SelectedPlan | null
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'aurum_user'
const PENDING_PLAN_KEY = 'aurum_pending_plan'
const USERS_KEY = 'aurum_users'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [pendingPlan, setPendingPlanState] = useState<SelectedPlan | null>(() => {
    try {
      const stored = localStorage.getItem(PENDING_PLAN_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  function setPendingPlan(plan: SelectedPlan) {
    setPendingPlanState(plan)
    localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(plan))
  }

  function register(data: Omit<User, 'status' | 'startDate' | 'endDate'> & { password: string }) {
    const { password, ...rest } = data
    const newUser: User = { ...rest, status: 'pending_payment', startDate: null, endDate: null }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    users.push({ ...newUser, password })
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    chatService.createConversation(newUser.email, newUser.name, newUser.email, newUser.selectedPlan?.name, newUser.investedAmount)
    localStorage.removeItem(PENDING_PLAN_KEY)
    setPendingPlanState(null)
    setUser(newUser)
  }

  function login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find((u: User & { password: string }) => u.email === email && u.password === password)
    if (found) {
      const { password: _pw, ...userData } = found
      setUser(userData)
      return true
    }
    return false
  }

  function logout() {
    setUser(null)
  }

  function loginDemo() {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - 14)
    const end = new Date(now)
    end.setDate(end.getDate() + 46)
    const demoUser: User = {
      name: 'Demo User',
      email: 'demo@aurum.io',
      selectedPlan: { id: 'growth', name: 'Growth', minCapital: 1000, duration: 60, returnRate: 12 },
      investedAmount: 2000,
      walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      status: 'active',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
    setUser(demoUser)
  }

  function activatePlan() {
    if (!user) return
    const now = new Date()
    const end = new Date(now)
    end.setDate(end.getDate() + (user.selectedPlan?.duration ?? 30))
    const updated: User = {
      ...user,
      status: 'active',
      startDate: now.toISOString(),
      endDate: end.toISOString(),
    }
    setUser(updated)
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const idx = users.findIndex((u: User) => u.email === user.email)
    if (idx !== -1) users[idx] = { ...users[idx], ...updated }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, activatePlan, loginDemo, setPendingPlan, pendingPlan }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
