export interface ChatMessage {
  id: string
  conversationId: string
  text: string
  senderId: string
  senderName: string
  senderRole: 'client' | 'advisor' | 'admin'
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  advisorId: string
  advisorName: string
  lastMessage: string
  lastMessageAt: string | null
  unreadClient: number
  unreadAdmin: number
  tags: string[]
  plan?: string
  investedAmount?: number
  status?: string
}

export interface ChatGroup {
  id: string
  name: string
  color: string
  advisorId: string
  conversationIds: string[]
}

export type StaffUser = {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'advisor'
}

export const STAFF: StaffUser[] = [
  { id: 'admin', name: 'Admin Principal', email: 'admin@aurum.io', password: 'aurum2024', role: 'admin' },
  { id: 'carlos', name: 'Carlos M.', email: 'carlos@aurum.io', password: 'carlos123', role: 'advisor' },
  { id: 'laura', name: 'Laura S.', email: 'laura@aurum.io', password: 'laura123', role: 'advisor' },
  { id: 'miguel', name: 'Miguel A.', email: 'miguel@aurum.io', password: 'miguel123', role: 'advisor' },
  { id: 'sofia', name: 'Sofía R.', email: 'sofia@aurum.io', password: 'sofia123', role: 'advisor' },
]

const KEYS = {
  conversations: 'aurum_conversations',
  messages: (id: string) => `aurum_messages_${id}`,
  groups: 'aurum_groups',
}

const channel = typeof window !== 'undefined' ? new BroadcastChannel('aurum_chat') : null

type Listener = () => void
const listeners = new Set<Listener>()

if (channel) {
  channel.onmessage = () => {
    listeners.forEach(fn => fn())
  }
}

function notify() {
  listeners.forEach(fn => fn())          // misma pestaña
  channel?.postMessage({ ts: Date.now() }) // otras pestañas
}

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') } catch { return fallback }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const chatService = {
  /* ── Subscribe ─────────────────────────────────────── */
  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  /* ── Conversations ─────────────────────────────────── */
  getConversations(): Conversation[] {
    return read<Conversation[]>(KEYS.conversations, [])
  },

  getConversation(id: string): Conversation | undefined {
    return this.getConversations().find(c => c.id === id)
  },

  createConversation(clientId: string, clientName: string, clientEmail: string, plan?: string, investedAmount?: number): void {
    const convs = this.getConversations()
    if (convs.find(c => c.clientId === clientId)) return
    const newConv: Conversation = {
      id: clientId,
      clientId,
      clientName,
      clientEmail,
      advisorId: 'carlos',
      advisorName: 'Carlos M.',
      lastMessage: '',
      lastMessageAt: null,
      unreadClient: 0,
      unreadAdmin: 0,
      tags: [],
      plan,
      investedAmount,
      status: 'active',
    }
    write(KEYS.conversations, [...convs, newConv])
    notify()
  },

  updateConversation(id: string, updates: Partial<Conversation>): void {
    const convs = this.getConversations().map(c => c.id === id ? { ...c, ...updates } : c)
    write(KEYS.conversations, convs)
    notify()
  },

  /* ── Messages ──────────────────────────────────────── */
  getMessages(conversationId: string): ChatMessage[] {
    return read<ChatMessage[]>(KEYS.messages(conversationId), [])
  },

  sendMessage(conversationId: string, senderId: string, senderName: string, senderRole: ChatMessage['senderRole'], text: string): void {
    const msg: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      conversationId,
      text,
      senderId,
      senderName,
      senderRole,
      createdAt: new Date().toISOString(),
      read: false,
    }
    const msgs = this.getMessages(conversationId)
    write(KEYS.messages(conversationId), [...msgs, msg])

    const isClient = senderRole === 'client'
    this.updateConversation(conversationId, {
      lastMessage: text,
      lastMessageAt: msg.createdAt,
      unreadClient: isClient ? 0 : (this.getConversation(conversationId)?.unreadClient ?? 0) + 1,
      unreadAdmin: isClient ? (this.getConversation(conversationId)?.unreadAdmin ?? 0) + 1 : 0,
    })
    notify()
  },

  markRead(conversationId: string, role: 'client' | 'admin'): void {
    const field = role === 'client' ? 'unreadClient' : 'unreadAdmin'
    this.updateConversation(conversationId, { [field]: 0 })
    const msgs = this.getMessages(conversationId).map(m => ({ ...m, read: true }))
    write(KEYS.messages(conversationId), msgs)
    notify()
  },

  /* ── Groups ────────────────────────────────────────── */
  getGroups(advisorId?: string): ChatGroup[] {
    const all = read<ChatGroup[]>(KEYS.groups, [])
    return advisorId && advisorId !== 'admin' ? all.filter(g => g.advisorId === advisorId || g.advisorId === 'all') : all
  },

  createGroup(name: string, color: string, advisorId: string): ChatGroup {
    const group: ChatGroup = {
      id: `g_${Date.now()}`,
      name,
      color,
      advisorId,
      conversationIds: [],
    }
    const groups = this.getGroups()
    write(KEYS.groups, [...groups, group])
    notify()
    return group
  },

  addToGroup(groupId: string, conversationId: string): void {
    const groups = read<ChatGroup[]>(KEYS.groups, []).map(g =>
      g.id === groupId && !g.conversationIds.includes(conversationId)
        ? { ...g, conversationIds: [...g.conversationIds, conversationId] }
        : g
    )
    write(KEYS.groups, groups)
    notify()
  },

  removeFromGroup(groupId: string, conversationId: string): void {
    const groups = read<ChatGroup[]>(KEYS.groups, []).map(g =>
      g.id === groupId ? { ...g, conversationIds: g.conversationIds.filter(id => id !== conversationId) } : g
    )
    write(KEYS.groups, groups)
    notify()
  },

  deleteGroup(groupId: string): void {
    const groups = read<ChatGroup[]>(KEYS.groups, []).filter(g => g.id !== groupId)
    write(KEYS.groups, groups)
    notify()
  },

  /* ── Tags ──────────────────────────────────────────── */
  addTag(conversationId: string, tag: string): void {
    const conv = this.getConversation(conversationId)
    if (!conv || conv.tags.includes(tag)) return
    this.updateConversation(conversationId, { tags: [...conv.tags, tag] })
  },

  removeTag(conversationId: string, tag: string): void {
    const conv = this.getConversation(conversationId)
    if (!conv) return
    this.updateConversation(conversationId, { tags: conv.tags.filter(t => t !== tag) })
  },

  /* ── Assign advisor ────────────────────────────────── */
  assignAdvisor(conversationId: string, advisorId: string): void {
    const advisor = STAFF.find(s => s.id === advisorId)
    if (!advisor) return
    this.updateConversation(conversationId, { advisorId, advisorName: advisor.name })
  },
}

/* ── Helpers ───────────────────────────────────────────── */
export function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ahora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export function formatChatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function formatChatDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const GROUP_COLORS = ['#C9A227', '#6FBF8B', '#7B8FD4', '#D4887B', '#B4634F', '#9B7BD4']
export const nextGroupColor = (existing: ChatGroup[]) => GROUP_COLORS[existing.length % GROUP_COLORS.length]
