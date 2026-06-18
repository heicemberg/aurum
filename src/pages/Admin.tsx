import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Search, Send, Users, UserCheck, Plus, X, ChevronDown,
  Tag, MoreHorizontal, Trash2, Check,
} from 'lucide-react'
import {
  chatService, Conversation, ChatMessage, ChatGroup, StaffUser, STAFF,
  timeAgo, formatChatTime, formatChatDate, nextGroupColor,
} from '@/lib/chatService'

function AdminLogin({ onLogin }: { onLogin: (u: StaffUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const found = STAFF.find(s => s.email === email && s.password === password)
    if (found) onLogin(found)
    else setError('Credenciales incorrectas')
  }

  const inputClass = 'w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/50 transition-colors'

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
            <span className="font-serif text-xl text-[#1A1918] tracking-[0.14em]">AURUM</span>
            <span className="font-mono text-[11px] text-[#9A9590] ml-2">· Panel Interno</span>
          </div>
          <h1 className="font-serif text-2xl text-[#1A1918] mb-6">Acceso de asesores</h1>
          <form onSubmit={submit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className={inputClass} />
            {error && <p className="text-[#B83232] text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#C9A227] text-white font-medium text-sm hover:bg-[#B8941F] transition-colors">
              Entrar
            </button>
          </form>
          <p className="text-[#B8B4AF] text-xs mt-6 text-center">Acceso restringido · Solo equipo AURUM</p>
        </div>
      </motion.div>
    </div>
  )
}

function TagBadge({ label, color, onRemove }: { label: string; color: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono" style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}30` }}>
      {label}
      {onRemove && <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100"><X size={9} /></button>}
    </span>
  )
}

function CreateGroupModal({ advisorId, onClose, onCreated }: { advisorId: string; onClose: () => void; onCreated: (g: ChatGroup) => void }) {
  const [name, setName] = useState('')
  const groups = chatService.getGroups()
  const color = nextGroupColor(groups)

  function create() {
    if (!name.trim()) return
    const g = chatService.createGroup(name.trim(), color, advisorId)
    onCreated(g)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
        className="w-72 rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <h3 className="text-[#1A1918] font-semibold mb-4">Nuevo grupo</h3>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && create()}
          placeholder="Nombre del grupo..."
          className="w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/50 transition-colors mb-3" />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full" style={{ background: color }} />
          <span className="text-[#6B6862] text-xs">Color asignado automáticamente</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-black/[0.08] text-[#6B6862] text-sm hover:border-black/[0.15] transition-colors">Cancelar</button>
          <button onClick={create} className="flex-1 py-2 rounded-xl bg-[#C9A227] text-white text-sm font-medium hover:bg-[#B8941F] transition-colors">Crear</button>
        </div>
      </motion.div>
    </div>
  )
}

function ConvItem({ conv, active, groups, onClick, onAddToGroup, staffId }:
  { conv: Conversation; active: boolean; groups: ChatGroup[]; onClick: () => void; onAddToGroup: (gid: string) => void; staffId: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const myGroups = groups.filter(g => g.advisorId === staffId || g.advisorId === 'all')

  return (
    <div className={`relative group rounded-xl p-3 cursor-pointer transition-colors ${active ? 'bg-[#C9A227]/[0.07] border border-[#C9A227]/20' : 'hover:bg-black/[0.025] border border-transparent'}`}
      onClick={onClick}>
      <div className="flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-full bg-black/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[#4A4845] text-sm font-medium">{conv.clientName[0].toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className={`text-sm truncate ${conv.unreadAdmin > 0 ? 'text-[#1A1918] font-semibold' : 'text-[#4A4845]'}`}>
              {conv.clientName}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {conv.unreadAdmin > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white font-mono text-[9px] flex items-center justify-center">{conv.unreadAdmin}</span>
              )}
              <span className="text-[#B8B4AF] text-[10px] font-mono">{timeAgo(conv.lastMessageAt)}</span>
            </div>
          </div>
          {conv.plan && (
            <div className="font-mono text-[10px] text-[#B8941F] mb-0.5">
              {conv.plan}{conv.investedAmount ? ` · $${conv.investedAmount.toLocaleString()}` : ''}
            </div>
          )}
          <p className="text-[#9A9590] text-[12px] truncate">{conv.lastMessage || 'Sin mensajes'}</p>
          {conv.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {conv.tags.map(t => {
                const g = groups.find(g => g.name === t)
                return <TagBadge key={t} label={t} color={g?.color ?? '#9A9590'} />
              })}
            </div>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center text-[#9A9590] hover:text-[#4A4845] hover:bg-black/[0.05] flex-shrink-0"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>

      {menuOpen && (
        <div ref={menuRef} className="absolute right-2 top-10 z-20 w-44 rounded-xl border border-black/[0.08] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-1.5"
          onClick={e => e.stopPropagation()}>
          {myGroups.length > 0 && (
            <>
              <div className="px-3 py-1.5 font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider">Añadir a grupo</div>
              {myGroups.map(g => (
                <button key={g.id} onClick={() => { onAddToGroup(g.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-black/[0.025] transition-colors">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-[#4A4845] text-xs">{g.name}</span>
                </button>
              ))}
              <div className="h-px bg-black/[0.06] my-1" />
            </>
          )}
          <div className="px-3 py-1.5 font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider">Asesor</div>
          {STAFF.filter(s => s.role === 'advisor').map(s => (
            <button key={s.id} onClick={() => { chatService.assignAdvisor(conv.id, s.id); setMenuOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-black/[0.025] transition-colors">
              <Check size={10} className={conv.advisorId === s.id ? 'text-[#C9A227]' : 'opacity-0'} />
              <span className="text-[#4A4845] text-xs">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChatWindow({ conv, staff }: { conv: Conversation; staff: StaffUser }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const refresh = useCallback(() => setMessages(chatService.getMessages(conv.id)), [conv.id])

  useEffect(() => {
    refresh()
    chatService.markRead(conv.id, 'admin')
    return chatService.subscribe(refresh)
  }, [conv.id, refresh])

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages])

  function send() {
    if (!text.trim()) return
    chatService.sendMessage(conv.id, staff.id, staff.name, staff.role, text.trim())
    setText('')
    inputRef.current?.focus()
  }

  function addTag() {
    if (!tagInput.trim()) return
    chatService.addTag(conv.id, tagInput.trim())
    setTagInput('')
    setShowTagInput(false)
  }

  const groups = chatService.getGroups()

  const grouped = messages.reduce<{ date: string; msgs: ChatMessage[] }[]>((acc, m) => {
    const label = formatChatDate(m.createdAt)
    const last = acc[acc.length - 1]
    if (last?.date === label) last.msgs.push(m)
    else acc.push({ date: label, msgs: [m] })
    return acc
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.07] bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center">
            <span className="text-[#4A4845] text-sm font-medium">{conv.clientName[0]}</span>
          </div>
          <div>
            <div className="text-[#1A1918] text-sm font-semibold">{conv.clientName}</div>
            <div className="text-[#9A9590] font-mono text-[10px]">{conv.clientEmail}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conv.plan && (
            <span className="font-mono text-[10px] text-[#B8941F] border border-[#C9A227]/20 bg-[#C9A227]/[0.06] rounded-full px-2.5 py-1">
              {conv.plan}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7F5]">
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#B8B4AF] text-sm">Sin mensajes aún</p>
              </div>
            )}
            {grouped.map(({ date, msgs }) => (
              <div key={date}>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-black/[0.06]" />
                  <span className="font-mono text-[10px] text-[#B8B4AF] uppercase tracking-wider">{date}</span>
                  <div className="flex-1 h-px bg-black/[0.06]" />
                </div>
                {msgs.map(m => {
                  const isMe = m.senderId === staff.id || (staff.role === 'admin' && m.senderRole !== 'client')
                  return (
                    <div key={m.id} className={`flex mb-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-6 h-6 rounded-full bg-black/[0.06] flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          <span className="text-[9px] text-[#4A4845]">{m.senderName[0]}</span>
                        </div>
                      )}
                      <div className="max-w-[72%]">
                        {!isMe && <div className="text-[#9A9590] text-[10px] mb-1 ml-0.5">{m.senderName}</div>}
                        <div className={`rounded-2xl px-3.5 py-2.5 ${isMe ? 'bg-[#C9A227] text-white rounded-br-sm' : 'bg-white text-[#1A1918] rounded-bl-sm border border-black/[0.07]'}`}>
                          <p className="text-[13.5px] leading-[1.5] break-words whitespace-pre-wrap">{m.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/50' : 'text-[#B8B4AF]'}`}>
                            {formatChatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-black/[0.07] flex items-end gap-2 flex-shrink-0 bg-white">
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={`Responder a ${conv.clientName}...`}
              rows={1}
              className="flex-1 bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] resize-none focus:outline-none focus:border-[#C9A227]/40 transition-colors"
              style={{ maxHeight: 96 }}
            />
            <button onClick={send} disabled={!text.trim()}
              className="w-9 h-9 rounded-xl bg-[#C9A227] flex items-center justify-center disabled:opacity-30 hover:bg-[#B8941F] transition-colors flex-shrink-0">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>

        <div className="w-52 flex-shrink-0 border-l border-black/[0.07] bg-white p-4 overflow-y-auto">
          <div className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider mb-3">Plan activo</div>
          {conv.plan ? (
            <div className="rounded-xl bg-[#F8F7F5] border border-black/[0.07] p-3 mb-4">
              <div className="text-[#B8941F] font-mono text-[10px] mb-1">{conv.plan}</div>
              <div className="text-[#1A1918] text-sm font-semibold">${conv.investedAmount?.toLocaleString()}</div>
            </div>
          ) : <p className="text-[#B8B4AF] text-xs mb-4">Sin plan activo</p>}

          <div className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider mb-2">Asesor asignado</div>
          <div className="text-[#4A4845] text-xs mb-4">{conv.advisorName}</div>

          <div className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider mb-2">Etiquetas internas</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {conv.tags.map(t => {
              const g = groups.find(g => g.name === t)
              return <TagBadge key={t} label={t} color={g?.color ?? '#9A9590'} onRemove={() => chatService.removeTag(conv.id, t)} />
            })}
          </div>
          {showTagInput ? (
            <div className="flex gap-1.5">
              <input autoFocus value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setShowTagInput(false) }}
                placeholder="Nombre..."
                className="flex-1 bg-[#F8F7F5] border border-black/[0.08] rounded-lg px-2 py-1.5 text-[#1A1918] text-[11px] placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/40 transition-colors" />
              <button onClick={addTag} className="w-7 h-7 bg-[#C9A227] rounded-lg flex items-center justify-center">
                <Check size={11} className="text-white" />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowTagInput(true)} className="flex items-center gap-1.5 text-[#9A9590] hover:text-[#4A4845] text-[11px] transition-colors">
              <Tag size={10} /> Añadir etiqueta
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type SidebarView = 'all' | 'mine' | string

function AdminPanel({ staff, onLogout }: { staff: StaffUser; onLogout: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [activeConv, setActiveConv] = useState<string | null>(null)
  const [view, setView] = useState<SidebarView>('all')
  const [search, setSearch] = useState('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const refresh = useCallback(() => {
    setConversations(chatService.getConversations())
    setGroups(chatService.getGroups())
  }, [])

  useEffect(() => {
    refresh()
    return chatService.subscribe(refresh)
  }, [refresh])

  const myGroups = staff.role === 'admin' ? groups : groups.filter(g => g.advisorId === staff.id || g.advisorId === 'all')

  let filtered = conversations
  if (staff.role === 'advisor' && view === 'mine') {
    filtered = filtered.filter(c => c.advisorId === staff.id)
  } else if (view !== 'all' && view !== 'mine') {
    const g = groups.find(g => g.id === view)
    filtered = g ? filtered.filter(c => g.conversationIds.includes(c.id)) : filtered
  }
  if (search) filtered = filtered.filter(c => c.clientName.toLowerCase().includes(search.toLowerCase()) || c.clientEmail.toLowerCase().includes(search.toLowerCase()))
  filtered = [...filtered].sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))

  const totalUnread = conversations.reduce((s, c) => s + c.unreadAdmin, 0)
  const selectedConv = conversations.find(c => c.id === activeConv)

  return (
    <div className="h-screen bg-[#F8F7F5] flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.07] bg-white flex-shrink-0 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5">
          <span className="w-[5px] h-[5px] rounded-full bg-[#C9A227]" />
          <span className="font-serif text-lg text-[#1A1918] tracking-[0.14em]">AURUM</span>
          <span className="font-mono text-[11px] text-[#9A9590]">· Panel de asesores</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#4A4845] text-sm">{staff.name}</span>
          {staff.role === 'admin' && (
            <span className="font-mono text-[9px] text-[#B8941F] border border-[#C9A227]/20 bg-[#C9A227]/[0.06] rounded-full px-2 py-0.5">ADMIN</span>
          )}
          <button onClick={onLogout} className="text-[#9A9590] hover:text-[#1A1918] transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-72 flex-shrink-0 border-r border-black/[0.07] flex flex-col bg-white">
          <div className="p-3 border-b border-black/[0.07]">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8B4AF]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
                className="w-full bg-[#F8F7F5] border border-black/[0.07] rounded-xl pl-9 pr-3.5 py-2 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] focus:outline-none focus:border-[#C9A227]/40 transition-colors" />
            </div>
          </div>

          <div className="flex gap-1 p-2.5 border-b border-black/[0.07]">
            <button onClick={() => setView('all')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors ${view === 'all' ? 'bg-[#C9A227]/[0.08] text-[#B8941F]' : 'text-[#9A9590] hover:text-[#4A4845]'}`}>
              <Users size={11} />
              General
              {totalUnread > 0 && view !== 'all' && (
                <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white text-[9px] flex items-center justify-center">{totalUnread}</span>
              )}
            </button>
            <button onClick={() => setView('mine')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors ${view === 'mine' ? 'bg-[#C9A227]/[0.08] text-[#B8941F]' : 'text-[#9A9590] hover:text-[#4A4845]'}`}>
              <UserCheck size={11} />
              Mis clientes
            </button>
          </div>

          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider">Grupos</span>
              <button onClick={() => setShowCreateGroup(true)} className="text-[#9A9590] hover:text-[#C9A227] transition-colors">
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-0.5">
              {myGroups.map(g => (
                <button key={g.id} onClick={() => setView(view === g.id ? 'all' : g.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${view === g.id ? 'bg-black/[0.04]' : 'hover:bg-black/[0.02]'}`}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-[#4A4845] text-xs flex-1 truncate">{g.name}</span>
                  <span className="text-[#B8B4AF] font-mono text-[10px]">{g.conversationIds.length}</span>
                  <button onClick={e => { e.stopPropagation(); chatService.deleteGroup(g.id) }} className="opacity-0 group-hover:opacity-100 text-[#B8B4AF] hover:text-[#B83232] transition-colors">
                    <Trash2 size={10} />
                  </button>
                </button>
              ))}
              {myGroups.length === 0 && (
                <p className="text-[#B8B4AF] text-[11px] px-2 py-1">Sin grupos · <button onClick={() => setShowCreateGroup(true)} className="text-[#9A9590] hover:text-[#4A4845]">Crear uno</button></p>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            <div className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-wider px-2 mb-2">
              {filtered.length} conversaciones
            </div>
            {filtered.map(conv => (
              <ConvItem key={conv.id} conv={conv} active={activeConv === conv.id}
                groups={groups} staffId={staff.id}
                onClick={() => { setActiveConv(conv.id); chatService.markRead(conv.id, 'admin') }}
                onAddToGroup={gid => chatService.addToGroup(gid, conv.id)} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[#B8B4AF] text-sm">Sin conversaciones</div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div key={selectedConv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <ChatWindow conv={selectedConv} staff={staff} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#C9A227]/[0.06] flex items-center justify-center mb-4">
                  <Users size={24} className="text-[#C9A227]/40" />
                </div>
                <p className="text-[#6B6862] text-sm">Selecciona un cliente para ver la conversación</p>
                <p className="text-[#B8B4AF] text-xs mt-1">{conversations.length} cliente{conversations.length !== 1 ? 's' : ''} registrado{conversations.length !== 1 ? 's' : ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal advisorId={staff.id} onClose={() => setShowCreateGroup(false)} onCreated={() => refresh()} />
      )}
    </div>
  )
}

export default function Admin() {
  const [staff, setStaff] = useState<StaffUser | null>(null)

  return staff
    ? <AdminPanel staff={staff} onLogout={() => setStaff(null)} />
    : <AdminLogin onLogin={setStaff} />
}
