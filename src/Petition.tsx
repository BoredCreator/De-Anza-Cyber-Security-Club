import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import Toggle from './components/Toggle'
import Footer from './components/Footer'

interface StudentForm {
  name: string
  studentId: string
  email: string
}

interface InstructorForm {
  name: string
  office: string
  phone: string
  email: string
}

function Petition() {
  const [isInstructor, setIsInstructor] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const sigCanvas = useRef<SignatureCanvas>(null)

  const [studentForm, setStudentForm] = useState<StudentForm>({
    name: '',
    studentId: '',
    email: ''
  })

  const [instructorForm, setInstructorForm] = useState<InstructorForm>({
    name: '',
    office: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  useEffect(() => {
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  const clearSignature = () => {
    sigCanvas.current?.clear()
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value })
  }

  const handleInstructorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInstructorForm({ ...instructorForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (sigCanvas.current?.isEmpty()) {
      setError('[ERROR] Signature required for authentication')
      return
    }

    const signatureData = sigCanvas.current?.toDataURL('image/png')

    setSubmitting(true)

    try {
      const collectionName = isInstructor ? 'instructor_signatures' : 'student_signatures'
      const formData = isInstructor ? instructorForm : studentForm

      await addDoc(collection(db, collectionName), {
        ...formData,
        signature: signatureData,
        timestamp: serverTimestamp()
      })

      setSubmitted(true)
      if (isInstructor) {
        setInstructorForm({ name: '', office: '', phone: '', email: '' })
      } else {
        setStudentForm({ name: '', studentId: '', email: '' })
      }
      clearSignature()
    } catch (err) {
      setError('[ERROR] Transmission failed. Retry.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-terminal-bg text-matrix flex items-center justify-center p-6">
        <div className="crt-overlay" />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center mx-auto mb-6 neon-box">
            <svg className="w-10 h-10 text-matrix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="terminal-window max-w-md mx-auto">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 text-xs text-gray-500 font-terminal">success</span>
            </div>
            <div className="terminal-body text-left">
              <p className="text-matrix mb-2">
                <span className="text-hack-cyan">[SUCCESS]</span> Signature authenticated
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Your identity has been verified and recorded in the database.
              </p>
              <div className="text-xs text-gray-600 mb-4">
                <span className="text-matrix">STATUS:</span> COMPLETE |
                <span className="text-matrix ml-2">TX:</span> CONFIRMED
              </div>
            </div>
          </div>
          <a
            href="/"
            className="btn-hack-filled rounded-lg inline-flex items-center gap-2 mt-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            RETURN TO BASE
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-matrix">
      <div className="crt-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-matrix transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-terminal text-sm">cd ..</span>
          </a>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-matrix neon-text-subtle text-lg">$</span>
            <span className="text-gray-400 font-terminal">./petition --sign</span>
          </div>

          <h1 className="text-3xl font-bold neon-text tracking-tight mb-2">CLUB PETITION</h1>
          <p className="text-gray-500">
            <span className="text-hack-cyan">[INFO]</span> Sign to help establish DACC as an official club
          </p>
        </header>

        {/* Toggle */}
        <div
          className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <Toggle
            isActive={isInstructor}
            onToggle={setIsInstructor}
            leftLabel="STUDENT"
            rightLabel="INSTRUCTOR"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 text-xs text-gray-500 font-terminal">
                {isInstructor ? 'instructor_data.sh' : 'student_data.sh'}
              </span>
            </div>
            <div className="terminal-body">
              {!isInstructor ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--name</label>
                    <input
                      type="text"
                      name="name"
                      value={studentForm.name}
                      onChange={handleStudentChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--student-id</label>
                    <input
                      type="text"
                      name="studentId"
                      value={studentForm.studentId}
                      onChange={handleStudentChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="e.g. 12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--email</label>
                    <input
                      type="email"
                      name="email"
                      value={studentForm.email}
                      onChange={handleStudentChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--name</label>
                    <input
                      type="text"
                      name="name"
                      value={instructorForm.name}
                      onChange={handleInstructorChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--office</label>
                    <input
                      type="text"
                      name="office"
                      value={instructorForm.office}
                      onChange={handleInstructorChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="Office location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={instructorForm.phone}
                      onChange={handleInstructorChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="(xxx) xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-500 font-terminal">--email</label>
                    <input
                      type="email"
                      name="email"
                      value={instructorForm.email}
                      onChange={handleInstructorChange}
                      required
                      className="input-hack w-full rounded-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 text-xs text-gray-500 font-terminal">signature_capture.sh</span>
              <button
                type="button"
                onClick={clearSignature}
                className="ml-auto text-xs text-gray-500 hover:text-matrix transition-colors font-terminal"
              >
                [CLEAR]
              </button>
            </div>
            <div className="p-4">
              <div className="border border-matrix/30 rounded-lg overflow-hidden bg-terminal-bg">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'w-full h-32 cursor-crosshair',
                    style: { width: '100%', height: '128px' }
                  }}
                  backgroundColor="#0a0a0a"
                  penColor="#00ff41"
                />
              </div>
              <p className="text-xs mt-2 text-gray-600 font-terminal">
                <span className="text-matrix">&gt;</span> Draw signature above to authenticate
              </p>
            </div>
          </div>

          {error && (
            <div className="text-hack-red text-sm font-terminal">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-hack-filled rounded-lg w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                TRANSMITTING...
              </span>
            ) : (
              'SUBMIT SIGNATURE'
            )}
          </button>
        </form>

        <Footer />
      </div>
    </div>
  )
}

export default Petition
