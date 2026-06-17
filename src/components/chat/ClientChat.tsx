import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Smile } from 'lucide-react'
import { chatService, ChatMessage, formatChatTime, formatChatDate } from '@/lib/chatService'
import { useAuth } from '@/context/AuthContext'

const QUICK_REPLIES = [
  '¿Cuándo vence mi plan?',
  '¿Cómo va mi inversión?',
  '¿Cuándo recibiré mis ganancias?',
]

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[rgba(245,240,232,0.06)]" />
      <span className="font-mono text-[9px] text-[#3D3A36] uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-[rgba(245,240,232,0.06)]" />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-[rgba(245,240,232,0.06)] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[#5A5650]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  )
}

export default function ClientChat() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [unread, setUnread] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const conversationId = user?.email ?? ''

  const refresh = useCallback(() => {
    if (!conversationId) return
    setMessages(chatService.getMessages(conversationId))
    const conv = chatService.getConversation(conversationId)
    setUnread(open ? 0 : (conv?.unreadClient ?? 0))
  }, [conversationId, open])

  useEffect(() => {
    if (!user) return
    chatService.createConversation(
      user.email, user.name, user.email,
      user.selectedPlan?.name, user.investedAmount,
    )
    refresh()
    return chatService.subscribe(refresh)
  }, [user, refresh])

  // Auto-scroll when messages change or chat opens
  useEffect(() => {
    if (!open) return
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages, open])

  // Mark read when opened
  useEffect(() => {
    if (open && conversationId) {
      chatService.markRead(conversationId, 'client')
      setUnread(0)
    }
  }, [open, conversationId])

  // Auto-resize textarea
  function adjustHeight(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  function send(msg?: string) {
    const content = (msg ?? text).trim()
    if (!content || !user || sending) return
    setSending(true)
    chatService.sendMessage(conversationId, user.email, user.name, 'client', content)
    setText('')
    if (inputRef.current) { inputRef.current.style.height = 'auto' }
    setSending(false)
    inputRef.current?.focus()

    // Simulate advisor typing response after 1-3s
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setShowTyping(true)
      typingTimer.current = setTimeout(() => setShowTyping(false), 2500)
    }, 800)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (!user) return null

  // Group messages by date
  const grouped = messages.reduce<{ date: string; msgs: ChatMessage[] }[]>((acc, m) => {
    const label = formatChatDate(m.createdAt)
    const last = acc[acc.length - 1]
    if (last?.date === label) last.msgs.push(m)
    else acc.push({ date: label, msgs: [m] })
    return acc
  }, [])

  const hasMessages = messages.length > 0

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-40 w-[52px] h-[52px] rounded-full bg-[#C9A227] shadow-[0_4px_28px_rgba(201,162,39,0.4)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={20} className="text-[#0A0B0D]" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <MessageCircle size={22} className="text-[#0A0B0D]" />
              </motion.div>
          }
        </AnimatePresence>
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B4634F] text-white font-mono text-[10px] flex items-center justify-center border-2 border-[#0A0B0D]"
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-[76px] right-6 z-50 w-[348px] sm:w-[380px] rounded-2xl border border-[rgba(245,240,232,0.1)] bg-[#111418] shadow-[0_28px_72px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden"
            style={{ height: 520 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(245,240,232,0.07)] bg-[#0E1014] flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgba(201,162,39,0.25)] to-[rgba(201,162,39,0.08)] flex items-center justify-center border border-[rgba(201,162,39,0.2)]">
                  <span className="font-serif text-[#C9A227] text-base font-medium">A</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#6FBF8B] border-2 border-[#0E1014]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#F5F0E8] text-sm font-medium leading-tight">Tu asesor AURUM</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FBF8B]" />
                  <span className="text-[#6FBF8B] font-mono text-[10px]">En línea · responde en &lt;4h</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#5A5650] hover:text-[#9B9590] transition-colors p-1">
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth">
              {!hasMessages && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-[rgba(201,162,39,0.07)] flex items-center justify-center mb-4 border border-[rgba(201,162,39,0.12)]">
                    <MessageCircle size={22} className="text-[rgba(201,162,39,0.5)]" />
                  </div>
                  <p className="text-[#F5F0E8] text-sm font-medium mb-1">Hola, {user.name.split(' ')[0]}</p>
                  <p className="text-[#5A5650] text-xs leading-relaxed">Estamos aquí para ayudarte con cualquier duda sobre tu inversión.</p>

                  {/* Quick replies */}
                  <div className="mt-5 w-full space-y-2">
                    {QUICK_REPLIES.map(q => (
                      <button key={q} onClick={() => send(q)}
                        className="w-full text-left text-xs text-[#9B9590] border border-[rgba(245,240,232,0.08)] rounded-xl px-3.5 py-2.5 hover:border-[rgba(201,162,39,0.25)] hover:text-[#F5F0E8] transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {grouped.map(({ date, msgs }) => (
                <div key={date}>
                  <DateSeparator label={date} />
                  {msgs.map((m, idx) => {
                    const isMe = m.senderRole === 'client'
                    const isLast = idx === msgs.length - 1
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[rgba(201,162,39,0.2)] to-[rgba(201,162,39,0.06)] flex items-center justify-center mr-2 mt-auto mb-0.5 flex-shrink-0">
                            <span className="text-[#C9A227] text-[9px] font-bold">A</span>
                          </div>
                        )}
                        <div className="max-w-[78%]">
                          <div className={`rounded-2xl px-3.5 py-2.5 ${isMe
                            ? 'bg-[#C9A227] text-[#0A0B0D] rounded-br-[6px]'
                            : 'bg-[rgba(245,240,232,0.07)] text-[#F5F0E8] rounded-bl-[6px] border border-[rgba(245,240,232,0.05)]'
                          }`}>
                            <p className="text-[13.5px] leading-[1.55] break-words whitespace-pre-wrap">{m.text}</p>
                          </div>
                          {isLast && (
                            <div className={`text-[10px] mt-1 font-mono ${isMe ? 'text-right text-[#5A5650]' : 'text-left text-[#3D3A36]'}`}>
                              {formatChatTime(m.createdAt)}
                              {isMe && <span className="ml-1 text-[#5A5650]">✓</span>}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ))}

              {showTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies when has messages */}
            {hasMessages && !text && (
              <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
                {QUICK_REPLIES.slice(0, 2).map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="flex-shrink-0 text-[11px] text-[#5A5650] border border-[rgba(245,240,232,0.07)] rounded-full px-3 py-1 hover:text-[#9B9590] hover:border-[rgba(245,240,232,0.12)] transition-colors whitespace-nowrap">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-[rgba(245,240,232,0.07)] flex items-end gap-2 flex-shrink-0">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={e => { setText(e.target.value); adjustHeight(e.target) }}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu mensaje..."
                  rows={1}
                  className="w-full bg-[rgba(245,240,232,0.05)] border border-[rgba(245,240,232,0.09)] rounded-xl px-3.5 py-2.5 pr-9 text-[#F5F0E8] text-sm placeholder:text-[#3D3A36] resize-none focus:outline-none focus:border-[rgba(201,162,39,0.35)] transition-colors leading-[1.5]"
                  style={{ minHeight: 40, maxHeight: 120, overflowY: 'auto' }}
                />
                <button className="absolute right-2.5 bottom-2.5 text-[#3D3A36] hover:text-[#5A5650] transition-colors">
                  <Smile size={15} />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => send()}
                disabled={!text.trim()}
                className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center disabled:opacity-25 hover:bg-[#E8BE3A] transition-colors flex-shrink-0"
              >
                <Send size={15} className="text-[#0A0B0D]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
