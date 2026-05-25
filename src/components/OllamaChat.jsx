import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Config ───────────────────────────────────────────────── */
const OLLAMA_BASE = 'http://localhost:11434'

const SYSTEM_PROMPT = `You are Glamore's AI Beauty Consultant — a warm, knowledgeable, and stylish assistant for Glamore Premium Beauty Studio.

Your expertise spans:
• Hair styling, precision cuts, blowouts, keratin treatments
• Hair colouring — balayage, highlights, toning, colour correction
• Nail services — gel, acrylic sculpting, bespoke nail art, pedicures
• Beauty treatments — lash lifts/extensions, brow architecture, microblading, facials
• Makeup — event glam, bridal packages, airbrush, lessons
• Studio packages and booking advice

Guidelines:
- Keep replies warm, helpful, and concise (2–4 sentences unless more detail is needed)
- Use beauty terminology naturally but don't over-explain
- Recommend booking at Glamore when it fits the conversation
- Never give medical or health advice
- If unsure, suggest a consultation rather than guessing`

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm Glamore's AI Beauty Consultant ✦ I can help with service recommendations, product advice, or anything beauty-related. What can I help you with today?",
}

/* ── Component ────────────────────────────────────────────── */
export default function OllamaChat() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState('checking') // 'checking' | 'online' | 'offline'
  const [model, setModel]       = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const abortRef       = useRef(null)

  /* ── Check Ollama on mount ── */
  useEffect(() => { probe() }, [])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  /* ── Focus input when opening ── */
  useEffect(() => {
    if (open && status === 'online') {
      const t = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    }
  }, [open, status])

  const probe = async () => {
    setStatus('checking')
    try {
      const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined,
      })
      if (!res.ok) throw new Error('not ok')
      const data = await res.json()
      const models = data.models ?? []
      // Prefer llama variants, then anything
      const picked =
        models.find(m => /llama/i.test(m.name)) ||
        models.find(m => /mistral|gemma|phi|qwen/i.test(m.name)) ||
        models[0]
      if (picked) {
        setModel(picked.name)
        setStatus('online')
      } else {
        // Ollama is running but no models pulled yet
        setStatus('offline')
      }
    } catch {
      setStatus('offline')
    }
  }

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || status !== 'online') return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    try {
      const ctrl = new AbortController()
      abortRef.current = ctrl

      const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: model,
          stream: true,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.filter(m => m.role !== 'system'),
            userMsg,
          ],
        }),
      })

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          buffer += decoder.decode()
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines.filter(Boolean)) {
          try {
            const json = JSON.parse(line)
            const token = json.message?.content
            if (token) {
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + token,
                }
                return copy
              })
            }
          } catch { /* malformed partial line — skip */ }
        }
      }

      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer)
          const token = json.message?.content
          if (token) {
            setMessages(prev => {
              const copy = [...prev]
              copy[copy.length - 1] = {
                ...copy[copy.length - 1],
                content: copy[copy.length - 1].content + token,
              }
              return copy
            })
          }
        } catch { /* malformed trailing line - skip */ }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            role: 'assistant',
            content: "I'm having trouble connecting right now. Please try again in a moment. 💫",
          }
          return copy
        })
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [input, loading, status, model, messages])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const statusClass = status === 'online' ? '' : ' offline'

  return (
    <>
      {/* ── FAB ── */}
      <button
        className="ollama-fab"
        onClick={() => setOpen(p => !p)}
        aria-label={open ? 'Close beauty consultant' : 'Open beauty consultant'}
        title="AI Beauty Consultant"
      >
        <span style={{ lineHeight: 1 }}>{open ? '✕' : '✦'}</span>
        {status !== 'checking' && (
          <div className={`ollama-fab-dot${statusClass}`} />
        )}
      </button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="ollama-panel"
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.88, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="ollama-panel-header">
              <div className="ollama-panel-avatar">✦</div>
              <div>
                <div className="ollama-panel-title">Beauty Consultant</div>
                <div className="ollama-panel-sub">
                  {status === 'checking' && 'Connecting…'}
                  {status === 'online'   && `Powered by ${model ?? 'Ollama'}`}
                  {status === 'offline'  && 'Start Ollama to enable AI'}
                </div>
              </div>
              <div className={`ollama-status-dot${statusClass}${status === 'checking' ? ' checking' : ''}`} />
            </div>

            {/* Body */}
            <div className="ollama-messages">
              {status === 'offline' ? (
                <div className="ollama-offline-box">
                  <div style={{ fontSize: 30, marginBottom: 12 }}>💤</div>
                  <strong style={{ color: 'var(--text-1)', display: 'block', marginBottom: 8 }}>
                    Ollama isn't running
                  </strong>
                  Open a terminal and run:<br />
                  <code>ollama serve</code>
                  <br /><br />
                  Make sure you have at least one model pulled — e.g.<br />
                  <code>ollama pull llama3.2</code>
                  <br /><br />
                  <button className="ollama-retry-btn" onClick={probe}>Retry connection</button>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isTyping = msg.role === 'assistant' && msg.content === '' && loading && i === messages.length - 1
                  return (
                    <div key={i} className={`ollama-msg ${msg.role}`}>
                      {msg.role === 'assistant' && (
                        <div className="ollama-msg-icon">✦</div>
                      )}
                      <div className="ollama-msg-bubble">
                        {isTyping ? (
                          <div className="ollama-typing">
                            <div className="ollama-typing-dot" />
                            <div className="ollama-typing-dot" />
                            <div className="ollama-typing-dot" />
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {status === 'online' && (
              <div className="ollama-input-row">
                <textarea
                  ref={inputRef}
                  className="ollama-input"
                  placeholder="Ask about services, styles, booking…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  disabled={loading}
                />
                <button
                  className="ollama-send-btn"
                  onClick={send}
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                >↑</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
