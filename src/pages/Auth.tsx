import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

type AuthMode = 'select' | 'email' | 'email-sent' | 'complete'

function Auth() {
  const [mode, setMode] = useState<AuthMode>('select')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signInWithGoogle, sendEmailLink, completeEmailSignIn } = useAuth()

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    if (searchParams.get('mode') === 'complete') {
      setMode('complete')
      const savedEmail = window.localStorage.getItem('emailForSignIn')
      if (savedEmail) {
        setEmail(savedEmail)
        handleCompleteEmailSignIn(savedEmail)
      }
    }
  }, [searchParams])

  const handleCompleteEmailSignIn = async (emailToUse: string) => {
    setLoading(true)
    setError('')
    try {
      await completeEmailSignIn(emailToUse)
      navigate('/dashboard')
    } catch {
      setError('[ERROR] Link verification failed. Request new link.')
      setMode('select')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch {
      setError('[ERROR] Google auth rejected. Retry.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmailLink = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('[ERROR] Email address required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await sendEmailLink(email)
      setMode('email-sent')
    } catch {
      setError('[ERROR] Failed to transmit link. Retry.')
    } finally {
      setLoading(false)
    }
  }

  const renderComplete = () => (
    <div className="terminal-window max-w-md mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="ml-4 text-xs text-gray-500 font-terminal">verify_session.sh</span>
      </div>
      <div className="terminal-body">
        <div className="flex items-center gap-3 mb-4">
          <svg className="animate-spin h-5 w-5 text-matrix" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-matrix neon-pulse">Verifying credentials...</span>
        </div>
        <div className="text-xs text-gray-600 font-terminal">
          <span className="text-matrix">&gt;</span> Decrypting email token
        </div>
      </div>
    </div>
  )

  const renderEmailSent = () => (
    <div className="text-center">
      <div className="w-20 h-20 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center mx-auto mb-6 neon-box">
        <svg className="w-10 h-10 text-matrix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="terminal-window max-w-md mx-auto">
        <div className="terminal-header">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          <span className="ml-4 text-xs text-gray-500 font-terminal">transmission_success</span>
        </div>
        <div className="terminal-body text-left">
          <p className="text-matrix mb-2">
            <span className="text-hack-cyan">[SUCCESS]</span> Link transmitted
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Check <span className="text-matrix">{email}</span> for your secure access link.
          </p>
          <div className="text-xs text-gray-600 mb-4">
            <span className="text-matrix">STATUS:</span> PENDING_VERIFICATION |
            <span className="text-matrix ml-2">TTL:</span> 1 HOUR
          </div>
          <p className="text-xs text-gray-600">
            <span className="text-matrix">&gt;</span> Link expires in 1 hour. Check spam folder if not received.
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setMode('email')
          setError('')
        }}
        className="btn-hack rounded-lg inline-flex items-center gap-2 mt-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        RESEND LINK
      </button>
    </div>
  )

  const renderEmailForm = () => (
    <div className="terminal-window max-w-md mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="ml-4 text-xs text-gray-500 font-terminal">email_auth.sh</span>
      </div>
      <div className="terminal-body">
        <form onSubmit={handleSendEmailLink} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-500 font-terminal">--email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="input-hack w-full rounded-lg"
              placeholder="agent@domain.com"
            />
          </div>
          <p className="text-xs text-gray-600 font-terminal">
            <span className="text-matrix">&gt;</span> A secure login link will be sent to your email
          </p>

          {error && (
            <div className="text-hack-red text-sm font-terminal">{error}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-hack-filled rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  TRANSMITTING...
                </span>
              ) : (
                'SEND LINK'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('select')
                setError('')
              }}
              className="btn-hack rounded-lg"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderSelect = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          <span className="ml-4 text-xs text-gray-500 font-terminal">select_auth_method.sh</span>
        </div>
        <div className="terminal-body space-y-4">
          <p className="text-sm text-gray-500 font-terminal mb-4">
            <span className="text-matrix">&gt;</span> Select authentication protocol:
          </p>

          {/* Email Option */}
          <button
            onClick={() => {
              setMode('email')
              setError('')
            }}
            disabled={loading}
            className="w-full group card-hack rounded-lg p-4 text-left transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center group-hover:neon-box transition-shadow">
                <svg className="w-6 h-6 text-matrix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-matrix font-semibold mb-1">EMAIL LINK</div>
                <div className="text-xs text-gray-500 font-terminal">Passwordless OTP</div>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-matrix group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-matrix/30 to-transparent" />
            <span className="text-xs text-gray-600 font-terminal">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-matrix/30 to-transparent" />
          </div>

          {/* Google Option */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full group card-hack rounded-lg p-4 text-left transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center group-hover:neon-box transition-shadow">
                <svg className="w-6 h-6 text-matrix" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-matrix font-semibold mb-1">GOOGLE</div>
                <div className="text-xs text-gray-500 font-terminal">OAuth 2.0</div>
              </div>
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-matrix" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 group-hover:text-matrix group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>

          {error && (
            <div className="text-hack-red text-sm font-terminal pt-2">{error}</div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 font-terminal">
        <span className="text-matrix">[INFO]</span> By signing in, you agree to our{' '}
        <Link to="/terms" className="text-matrix hover:underline">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="text-matrix hover:underline">Privacy Policy</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-terminal-bg text-matrix">
      <div className="crt-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-matrix transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-terminal text-sm">cd ..</span>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-matrix neon-text-subtle text-lg">$</span>
            <span className="text-gray-400 font-terminal">./authenticate --secure</span>
          </div>

          <h1 className="text-3xl font-bold neon-text tracking-tight mb-2">AUTHENTICATION</h1>
          <p className="text-gray-500">
            <span className="text-hack-cyan">[INFO]</span> Secure access to DACC member portal
          </p>
        </header>

        {/* Content */}
        <div
          className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '200ms' }}
        >
          {mode === 'complete' && renderComplete()}
          {mode === 'email-sent' && renderEmailSent()}
          {mode === 'email' && renderEmailForm()}
          {mode === 'select' && renderSelect()}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Auth
