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
      <div className="flex-1 h-px bg-black/[0.06]" />
      <span className="font-mono text-[9px] text-[#B8B4AF] uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-black/[0.06]" />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-black/[0.05] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[#B8B4AF]"
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
    chatService.createConversation(user.email, user.name, user.email, user.selectedPlan?.name, user.investedAmount)
    refresh()
    return chatService.subscribe(refresh)
  }, [user, refresh])

  useEffect(() => {
    if (!open) return
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages, open])

  useEffect(() => {
    if (open && conversationId) {
      chatService.markRead(conversationId, 'client')
      setUnread(0)
    }
  }, [open, conversationId])

  function adjustHeight(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  async function send(msg?: string) {
    const content = (msg ?? text).trim()
    if (!content || !user || sending) return
    setSending(true)
    await chatService.sendMessage(conversationId, user.email, user.name, 'client', content)
    setText('')
    if (inputRef.current) { inputRef.current.style.height = 'auto' }
    setSending(false)
    inputRef.current?.focus()

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
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-40 w-[52px] h-[52px] rounded-full bg-[#C9A227] shadow-[0_4px_20px_rgba(201,162,39,0.35)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={20} className="text-white" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <MessageCircle size={22} className="text-white" />
              </motion.div>
          }
        </AnimatePresence>
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B83232] text-white font-mono text-[10px] flex items-center justify-center border-2 border-white">
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-[76px] right-6 z-50 w-[348px] sm:w-[380px] rounded-2xl border border-black/[0.1] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden"
            style={{ height: 520 }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.07] bg-[#F8F7F5] flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#C9A227]/10 flex items-center justify-center border border-[#C9A227]/20">
                  <span className="font-serif text-[#B8941F] text-base font-medium">A</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#1E7A47] border-2 border-[#F8F7F5]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#1A1918] text-sm font-semibold leading-tight">Tu asesor AURUM</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A47]" />
                  <span className="text-[#1E7A47] font-mono text-[10px]">En línea · responde en menos de 4h</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#9A9590] hover:text-[#4A4845] transition-colors p-1">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth bg-white">
              {!hasMessages && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-[#C9A227]/[0.07] flex items-center justify-center mb-4 border border-[#C9A227]/15">
                    <MessageCircle size={22} className="text-[#C9A227]/60" />
                  </div>
                  <p className="text-[#1A1918] text-sm font-semibold mb-1">Hola, {user.name.split(' ')[0]}</p>
                  <p className="text-[#6B6862] text-xs leading-relaxed">Estamos aquí para ayudarte con cualquier duda sobre tu inversión.</p>
                  <div className="mt-5 w-full space-y-2">
                    {QUICK_REPLIES.map(q => (
                      <button key={q} onClick={() => send(q)}
                        className="w-full text-left text-xs text-[#6B6862] border border-black/[0.08] rounded-xl px-3.5 py-2.5 hover:border-[#C9A227]/30 hover:text-[#1A1918] transition-colors">
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
                      <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
                        className={`flex mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full bg-[#C9A227]/10 flex items-center justify-center mr-2 mt-auto mb-0.5 flex-shrink-0 border border-[#C9A227]/15">
                            <span className="text-[#B8941F] text-[9px] font-bold">A</span>
                          </div>
                        )}
                        <div className="max-w-[78%]">
                          <div className={`rounded-2xl px-3.5 py-2.5 ${isMe ? 'bg-[#C9A227] text-white rounded-br-[6px]' : 'bg-[#F8F7F5] text-[#1A1918] rounded-bl-[6px] border border-black/[0.07]'}`}>
                            <p className="text-[13.5px] leading-[1.55] break-words whitespace-pre-wrap">{m.text}</p>
                          </div>
                          {isLast && (
                            <div className={`text-[10px] mt-1 font-mono ${isMe ? 'text-right text-[#9A9590]' : 'text-left text-[#B8B4AF]'}`}>
                              {formatChatTime(m.createdAt)}
                              {isMe && <span className="ml-1 text-[#9A9590]">✓</span>}
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

            {hasMessages && !text && (
              <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0 border-t border-black/[0.05]">
                {QUICK_REPLIES.slice(0, 2).map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="flex-shrink-0 text-[11px] text-[#6B6862] border border-black/[0.08] rounded-full px-3 py-1 hover:text-[#1A1918] hover:border-black/[0.15] transition-colors whitespace-nowrap mt-2">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="px-3 pb-3 pt-2 border-t border-black/[0.07] flex items-end gap-2 flex-shrink-0 bg-white">
              <div className="flex-1 relative">
                <textarea ref={inputRef} value={text}
                  onChange={e => { setText(e.target.value); adjustHeight(e.target) }}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu mensaje..." rows={1}
                  className="w-full bg-[#F8F7F5] border border-black/[0.08] rounded-xl px-3.5 py-2.5 pr-9 text-[#1A1918] text-sm placeholder:text-[#C5C1BC] resize-none focus:outline-none focus:border-[#C9A227]/40 transition-colors leading-[1.5]"
                  style={{ minHeight: 40, maxHeight: 120, overflowY: 'auto' }}
                />
                <button className="absolute right-2.5 bottom-2.5 text-[#B8B4AF] hover:text-[#9A9590] transition-colors">
                  <Smile size={15} />
                </button>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => send()} disabled={!text.trim() || sending}
                className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center disabled:opacity-30 hover:bg-[#B8941F] transition-colors flex-shrink-0">
                <Send size={15} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
