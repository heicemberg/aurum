import { supabase, DbConversation, DbMessage, DbGroup } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/* ── Public types ────────────────────────────────────────── */
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

/* ── Mappers ─────────────────────────────────────────────── */
function mapConv(r: DbConversation): Conversation {
  return {
    id: r.id,
    clientId: r.client_email,
    clientName: r.client_name,
    clientEmail: r.client_email,
    advisorId: r.advisor_id,
    advisorName: r.advisor_name,
    lastMessage: r.last_message || '',
    lastMessageAt: r.last_message_at,
    unreadClient: r.unread_client,
    unreadAdmin: r.unread_admin,
    tags: r.tags || [],
    plan: r.plan || undefined,
    investedAmount: r.invested_amount || undefined,
    status: 'active',
  }
}

function mapMessage(r: DbMessage): ChatMessage {
  return {
    id: r.id,
    conversationId: r.conversation_id,
    text: r.text,
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderRole: r.sender_role,
    createdAt: r.created_at,
    read: r.read,
  }
}

function mapGroup(r: DbGroup): ChatGroup {
  return {
    id: r.id,
    name: r.name,
    color: r.color,
    advisorId: r.advisor_id,
    conversationIds: r.conversation_ids || [],
  }
}

/* ── In-memory cache ─────────────────────────────────────── */
interface Cache {
  conversations: Conversation[]
  messages: Record<string, ChatMessage[]>
  groups: ChatGroup[]
}

type Listener = () => void

class ChatServiceImpl {
  private cache: Cache = { conversations: [], messages: {}, groups: [] }
  private listeners = new Set<Listener>()
  private channel: RealtimeChannel | null = null

  private notify() {
    this.listeners.forEach(fn => fn())
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  /* ── Init ─────────────────────────────────────────────── */
  async initForClient(email: string): Promise<void> {
    const { data: conv } = await supabase
      .from('conversations')
      .select('*')
      .eq('client_email', email)
      .maybeSingle()

    if (conv) {
      this.cache.conversations = [mapConv(conv)]
      await this.loadMessages(conv.id)
    }

    this.setupRealtime(email)
  }

  async initForAdmin(): Promise<void> {
    await Promise.all([this.loadAllConversations(), this.loadGroups()])
    this.setupRealtimeAdmin()
  }

  private async loadAllConversations(): Promise<void> {
    const { data } = await supabase.from('conversations').select('*').order('last_message_at', { ascending: false, nullsFirst: false })
    if (data) {
      this.cache.conversations = data.map(mapConv)
      await Promise.all(data.map(c => this.loadMessages(c.id)))
    }
    this.notify()
  }

  private async loadMessages(convId: string): Promise<void> {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    if (data) this.cache.messages[convId] = data.map(mapMessage)
    this.notify()
  }

  private async loadGroups(): Promise<void> {
    const { data } = await supabase.from('chat_groups').select('*')
    if (data) this.cache.groups = data.map(mapGroup)
    this.notify()
  }

  /* ── Realtime ─────────────────────────────────────────── */
  private setupRealtime(email: string): void {
    if (this.channel) supabase.removeChannel(this.channel)

    this.channel = supabase
      .channel(`client-chat-${email}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          const convId = (payload.new as DbMessage)?.conversation_id || (payload.old as DbMessage)?.conversation_id
          if (convId) await this.loadMessages(convId)
        })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `client_email=eq.${email}` },
        async () => { await this.initForClient(email) })
      .subscribe()
  }

  private setupRealtimeAdmin(): void {
    if (this.channel) supabase.removeChannel(this.channel)

    this.channel = supabase
      .channel('admin-chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          const convId = (payload.new as DbMessage)?.conversation_id || (payload.old as DbMessage)?.conversation_id
          if (convId) await this.loadMessages(convId)
        })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' },
        async () => { await this.loadAllConversations() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_groups' },
        async () => { await this.loadGroups() })
      .subscribe()
  }

  cleanup(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel)
      this.channel = null
    }
    this.cache = { conversations: [], messages: {}, groups: [] }
  }

  /* ── Sync getters (from cache) ───────────────────────── */
  getConversations(): Conversation[] { return this.cache.conversations }

  getConversation(id: string): Conversation | undefined {
    return this.cache.conversations.find(c => c.id === id || c.clientEmail === id)
  }

  getMessages(conversationId: string): ChatMessage[] {
    return this.cache.messages[conversationId] || []
  }

  getGroups(): ChatGroup[] { return this.cache.groups }

  /* ── Conversations ────────────────────────────────────── */
  async createConversation(
    clientId: string,
    clientName: string,
    clientEmail: string,
    plan?: string,
    investedAmount?: number,
  ): Promise<void> {
    const existing = this.cache.conversations.find(c => c.clientEmail === clientEmail)
    if (existing) return

    const { data, error } = await supabase.from('conversations').upsert({
      id: clientEmail,
      client_email: clientEmail,
      client_name: clientName,
      plan: plan ?? null,
      invested_amount: investedAmount ?? 0,
      advisor_id: 'carlos',
      advisor_name: 'Carlos M.',
      tags: [],
    }, { onConflict: 'client_email' }).select().maybeSingle()

    if (!error && data) {
      const conv = mapConv(data)
      this.cache.conversations = [...this.cache.conversations.filter(c => c.clientEmail !== clientEmail), conv]
      this.notify()
    }
  }

  private async updateConversationDb(id: string, updates: Partial<DbConversation>): Promise<void> {
    const { data } = await supabase.from('conversations').update(updates).eq('id', id).select().maybeSingle()
    if (data) {
      this.cache.conversations = this.cache.conversations.map(c => c.id === id ? mapConv(data) : c)
      this.notify()
    }
  }

  /* ── Messages ─────────────────────────────────────────── */
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: ChatMessage['senderRole'],
    text: string,
  ): Promise<void> {
    const { data: msg, error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      text,
      read: false,
    }).select().maybeSingle()

    if (!error && msg) {
      if (!this.cache.messages[conversationId]) this.cache.messages[conversationId] = []
      this.cache.messages[conversationId] = [...this.cache.messages[conversationId], mapMessage(msg)]

      const isClient = senderRole === 'client'
      const conv = this.getConversation(conversationId)
      await this.updateConversationDb(conversationId, {
        last_message: text,
        last_message_at: msg.created_at,
        unread_admin: isClient ? (conv?.unreadAdmin ?? 0) + 1 : 0,
        unread_client: isClient ? 0 : (conv?.unreadClient ?? 0) + 1,
      })
    }
  }

  async markRead(conversationId: string, role: 'client' | 'admin'): Promise<void> {
    const field = role === 'client' ? 'unread_client' : 'unread_admin'
    await this.updateConversationDb(conversationId, { [field]: 0 })
    await supabase.from('messages').update({ read: true }).eq('conversation_id', conversationId)
    if (this.cache.messages[conversationId]) {
      this.cache.messages[conversationId] = this.cache.messages[conversationId].map(m => ({ ...m, read: true }))
      this.notify()
    }
  }

  /* ── Groups ───────────────────────────────────────────── */
  async createGroup(name: string, color: string, advisorId: string): Promise<ChatGroup> {
    const { data } = await supabase.from('chat_groups').insert({ name, color, advisor_id: advisorId, conversation_ids: [] }).select().maybeSingle()
    const group = mapGroup(data!)
    this.cache.groups = [...this.cache.groups, group]
    this.notify()
    return group
  }

  async addToGroup(groupId: string, conversationId: string): Promise<void> {
    const group = this.cache.groups.find(g => g.id === groupId)
    if (!group || group.conversationIds.includes(conversationId)) return
    const newIds = [...group.conversationIds, conversationId]
    await supabase.from('chat_groups').update({ conversation_ids: newIds }).eq('id', groupId)
    this.cache.groups = this.cache.groups.map(g => g.id === groupId ? { ...g, conversationIds: newIds } : g)
    this.notify()
  }

  async deleteGroup(groupId: string): Promise<void> {
    await supabase.from('chat_groups').delete().eq('id', groupId)
    this.cache.groups = this.cache.groups.filter(g => g.id !== groupId)
    this.notify()
  }

  /* ── Tags ─────────────────────────────────────────────── */
  async addTag(conversationId: string, tag: string): Promise<void> {
    const conv = this.getConversation(conversationId)
    if (!conv || conv.tags.includes(tag)) return
    const newTags = [...conv.tags, tag]
    await this.updateConversationDb(conversationId, { tags: newTags })
  }

  async removeTag(conversationId: string, tag: string): Promise<void> {
    const conv = this.getConversation(conversationId)
    if (!conv) return
    const newTags = conv.tags.filter(t => t !== tag)
    await this.updateConversationDb(conversationId, { tags: newTags })
  }

  /* ── Assign advisor ───────────────────────────────────── */
  async assignAdvisor(conversationId: string, advisorId: string): Promise<void> {
    const advisor = STAFF.find(s => s.id === advisorId)
    if (!advisor) return
    await this.updateConversationDb(conversationId, { advisor_id: advisorId, advisor_name: advisor.name })
  }
}

export const chatService = new ChatServiceImpl()

/* ── Helpers ─────────────────────────────────────────────── */
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
