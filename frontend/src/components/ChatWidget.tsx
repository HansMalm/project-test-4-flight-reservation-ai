import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { sendChatMessage } from '../api/chat'
import './ChatWidget.css'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the newest message in view whenever the list grows or the typing
  // indicator toggles.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, loading])

  // Focus the message input when the panel opens so the user can type right
  // away without clicking it first.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close the panel on Escape while it's open. Cleanup removes the listener so
  // it doesn't pile up across opens.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function toggleOpen() {
    if (!open && chatId === null) setChatId(crypto.randomUUID())
    setOpen(!open)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const id = chatId ?? crypto.randomUUID()
    if (chatId === null) setChatId(id)

    setMessages((current) => [...current, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const reply = await sendChatMessage(id, text)
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: reply },
      ])
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            err instanceof Error
              ? err.message
              : 'Something went wrong. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Flight assistant">
          <header className="chat-panel-header">
            <span>Flight assistant</span>
            <button
              type="button"
              className="chat-panel-close"
              aria-label="Close chat"
              onClick={toggleOpen}
            >
              ×
            </button>
          </header>

          <div className="chat-messages" ref={listRef}>
            {messages.length === 0 && (
              <p className="chat-empty">
                Ask me to search flights, book a flight, or cancel a booking.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message chat-message-${message.role}`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message-assistant chat-typing">
                Typing…
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              type="submit"
              className="book-btn"
              disabled={loading || input.trim() === ''}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chat-bubble"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={toggleOpen}
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}

export default ChatWidget
