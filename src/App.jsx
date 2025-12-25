import { useState, useEffect, useRef } from 'react'

function App() {
  const [loaded, setLoaded] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [chatActive, setChatActive] = useState(false)
  const [name, setName] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)
  const chatTrackedRef = useRef(false)

  useEffect(() => {
    setLoaded(true)
    // Track page view
    trackVisit('page_view')
  }, [])

  useEffect(() => {
    if (chatActive) {
      fetchMessages()
      pollingRef.current = setInterval(fetchMessages, 3000)
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [chatActive])

  

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/get-messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (e) {
      console.error('Failed to fetch messages')
    }
  }

  const getVisitorData = () => ({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform,
    referrer: document.referrer || 'Direct',
    userAgent: navigator.userAgent
  })

  const trackVisit = async (type) => {
    try {
      const payload = { type }
      if (type === 'chat_opened') {
        payload.visitorData = getVisitorData()
      }
      await fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch (e) {
      // Silently fail - tracking shouldn't break the site
    }
  }

  const parseContent = (content, isWebhook) => {
    if (isWebhook) {
      return content.replace(/\*\*/g, '')
    }
    return content
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setError('')
    setSending(true)
    if (!chatActive) {
      setChatActive(true)
      // Track chat opened only once per session
      if (!chatTrackedRef.current) {
        chatTrackedRef.current = true
        trackVisit('chat_opened')
      }
    }

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), name: name.trim() })
      })

      if (res.ok) {
        setMessage('')
        setTimeout(fetchMessages, 500)
      } else {
        setError('Failed to send')
      }
    } catch (e) {
      setError('Failed to send')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'}`}>
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-emerald-950/20 via-transparent to-cyan-950/20' : 'bg-gradient-to-br from-emerald-100/40 via-transparent to-cyan-100/40'}`} />

      {/* Light/Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12 ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-white hover:bg-zinc-200 text-zinc-700 shadow-md'}`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>

      <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
        <header className={`mb-16 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-4 mb-8">
            <img
              src="/logo.png"
              alt="DACC Logo"
              className="w-14 h-14 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">DACC</h1>
              <p className={`text-sm font-mono ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>De Anza Cybersecurity Club</p>
            </div>
          </div>

          <div className={`font-mono text-sm mb-6 ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>$</span> cat welcome.txt
          </div>

          <p className={`text-lg leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            A student-led community for learning cybersecurity fundamentals,
            earning certifications, and getting hands-on with industry tools.
          </p>
        </header>

        <section className={`mb-16 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className={`font-mono text-sm mb-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>$</span> ls ./goals/
          </div>

          <div className="space-y-4">
            <div className={`group p-4 rounded-lg border transition-colors ${darkMode ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-300 hover:border-zinc-400 bg-white/50'}`}>
              <h3 className="font-medium mb-1">Security Foundations</h3>
              <p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>Core cybersecurity concepts applicable across all programming disciplines</p>
            </div>

            <div className={`group p-4 rounded-lg border transition-colors ${darkMode ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-300 hover:border-zinc-400 bg-white/50'}`}>
              <h3 className="font-medium mb-1">Security+ Certification</h3>
              <p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>Structured curriculum to help members achieve CompTIA Security+ certification</p>
            </div>

            <div className={`group p-4 rounded-lg border transition-colors ${darkMode ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-300 hover:border-zinc-400 bg-white/50'}`}>
              <h3 className="font-medium mb-1">Hands-On Tools</h3>
              <p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>Practical experience with Burp Suite, Nmap, Wireshark, and more</p>
            </div>
          </div>
        </section>

        <section className={`mb-16 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className={`font-mono text-sm mb-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>$</span> ./join.sh
          </div>

          <p className={`mb-6 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            No prior experience required. Just bring curiosity and willingness to learn.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://discord.gg/AmjfRrJd5j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord!
            </a>

            <a
              href="https://docs.google.com/document/d/1-wV6SDBT-5YoyfhNu-sBbnQondH0kmZM/edit?usp=sharing&ouid=111115151815479546677&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 border rounded-lg font-medium transition-colors ${darkMode ? 'border-zinc-700 hover:border-zinc-600 text-zinc-300' : 'border-zinc-400 hover:border-zinc-500 text-zinc-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Constitution
            </a>
          </div>
        </section>

        <section className={`mb-16 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className={`font-mono text-sm mb-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>$</span> echo "message us" <span className={darkMode ? 'text-zinc-600' : 'text-zinc-500'}># yes this is live - #general</span>
          </div>

          {chatActive && messages.length > 0 && (
            <div className="mb-4 max-h-48 overflow-y-auto space-y-1">
              {messages.map((msg) => (
                <div key={msg.id} className="font-mono text-sm">
                  <span className={darkMode ? 'text-zinc-600' : 'text-zinc-500'}>[{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>{' '}
                  <span className={msg.isWebhook ? 'text-cyan-500' : (darkMode ? 'text-emerald-400' : 'text-emerald-600')}>{msg.author}:</span>{' '}
                  <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>{parseContent(msg.content, msg.isWebhook)}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form onSubmit={sendMessage} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className={`flex-1 px-3 py-2 bg-transparent border rounded-lg text-sm focus:outline-none transition-colors ${darkMode ? 'border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-zinc-700' : 'border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-zinc-400'}`}
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-100' : 'bg-zinc-200 hover:bg-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400 text-zinc-900'}`}
              >
                {sending ? '...' : 'Send'}
              </button>
            </div>
            <div className="group flex items-center gap-2">
              <span className={`text-xs transition-colors ${darkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-700'}`}>
                + add name
              </span>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className={`w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 focus:w-24 focus:opacity-100 px-2 py-1 bg-transparent border rounded text-xs focus:outline-none transition-all duration-200 ${darkMode ? 'border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-zinc-700' : 'border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-zinc-400'}`}
              />
            </div>
          </form>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </section>

        <footer className={`pt-8 border-t transition-all duration-700 delay-500 ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className={`text-sm font-mono ${darkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>$</span> De Anza College <span className="cursor-blink"></span>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
