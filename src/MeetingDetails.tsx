import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import { MEETINGS_DATA, TYPE_COLORS, TYPE_LABELS, Meeting } from './Meetings'

function MeetingDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const meeting = MEETINGS_DATA.find(m => m.id === id)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < today
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Find related meetings (same type, excluding current)
  const relatedMeetings = MEETINGS_DATA
    .filter(m => m.id !== id && m.type === meeting?.type)
    .slice(0, 3)

  if (!meeting) {
    return (
      <div className="bg-terminal-bg text-matrix min-h-screen">
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
          <header className="mb-12">
            <Link
              to="/meetings"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-matrix transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Meetings
            </Link>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="ml-4 text-xs text-gray-500 font-terminal">error</span>
              </div>
              <div className="terminal-body text-center py-12">
                <div className="text-4xl mb-4 text-hack-red">404</div>
                <p className="text-gray-500 mb-2">
                  <span className="text-hack-red">[ERROR]</span> Meeting not found
                </p>
                <p className="text-gray-600 text-sm mb-6">
                  The meeting you're looking for doesn't exist or has been removed.
                </p>
                <button
                  onClick={() => navigate('/meetings')}
                  className="btn-hack px-6 py-2"
                >
                  Browse All Meetings
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-terminal-bg text-matrix min-h-screen">
      <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            to="/meetings"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-matrix transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Meetings
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-matrix neon-text-subtle">$</span>
            <span className="text-gray-400 font-terminal">cat ./meetings/{meeting.id}.md</span>
          </div>
        </header>

        {/* Main Content */}
        <article className={`mb-12 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 text-xs text-gray-500 font-terminal">{meeting.title.toLowerCase().replace(/\s+/g, '_')}</span>
            </div>
            <div className="terminal-body">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-block px-3 py-1 rounded text-sm font-terminal border ${TYPE_COLORS[meeting.type]}`}>
                  {TYPE_LABELS[meeting.type]}
                </span>
                {meeting.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-terminal bg-matrix/20 text-matrix border border-matrix/50">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    FEATURED
                  </span>
                )}
                {isPast(meeting.date) && (
                  <span className="inline-block px-3 py-1 rounded text-sm font-terminal border border-gray-600 text-gray-500">
                    COMPLETED
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isPast(meeting.date) ? 'text-gray-400' : 'text-matrix neon-text'}`}>
                {meeting.title}
              </h1>

              {/* Description */}
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {meeting.description}
              </p>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Date */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-terminal-alt border border-gray-800">
                  <div className="p-2 rounded-lg bg-matrix/10 text-matrix">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-terminal mb-1">Date</div>
                    <div className={`font-semibold ${isPast(meeting.date) ? 'text-gray-400' : 'text-matrix'}`}>
                      {formatDate(meeting.date)}
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-terminal-alt border border-gray-800">
                  <div className="p-2 rounded-lg bg-matrix/10 text-matrix">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-terminal mb-1">Time</div>
                    <div className="text-white font-semibold">{meeting.time}</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-terminal-alt border border-gray-800 md:col-span-2">
                  <div className="p-2 rounded-lg bg-matrix/10 text-matrix">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-terminal mb-1">Location</div>
                    <div className="text-white font-semibold">{meeting.location}</div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              {meeting.topics && meeting.topics.length > 0 && (
                <div className="mb-8">
                  <div className="text-xs text-gray-500 uppercase font-terminal mb-3">Topics Covered</div>
                  <div className="flex flex-wrap gap-2">
                    {meeting.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1.5 rounded-lg text-sm bg-terminal-alt border border-gray-700 text-gray-300 hover:border-matrix/50 transition-colors"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {!isPast(meeting.date) && (
                <div className="pt-6 border-t border-gray-800">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://discord.gg/P6JSY6DcFn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hack-filled px-6 py-3 text-center"
                    >
                      Join Our Discord for Updates
                    </a>
                    <Link
                      to="/meetings"
                      className="btn-hack px-6 py-3 text-center"
                    >
                      View All Meetings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Meetings */}
        {relatedMeetings.length > 0 && (
          <section className={`mb-16 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-matrix neon-text-subtle text-lg">$</span>
              <span className="text-gray-400 font-terminal">ls ./meetings/ --type={meeting.type} | head -3</span>
            </div>

            <h2 className="text-xl font-bold text-matrix mb-4">Related {TYPE_LABELS[meeting.type]} Events</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedMeetings.map((related) => (
                <Link
                  key={related.id}
                  to={`/meetings/${related.id}`}
                  className={`card-hack p-4 rounded-lg group transition-all ${
                    isPast(related.date) ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-terminal border ${TYPE_COLORS[related.type]}`}>
                      {TYPE_LABELS[related.type]}
                    </span>
                    {isPast(related.date) && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-terminal border border-gray-600 text-gray-500">
                        PAST
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold mb-2 group-hover:neon-text-subtle transition-all line-clamp-2 ${
                    isPast(related.date) ? 'text-gray-400' : 'text-matrix'
                  }`}>
                    {related.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {formatDate(related.date)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer className={`transition-all duration-700 delay-300 border-matrix/20 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-gray-600 font-terminal">
              <span className="text-matrix neon-text-subtle">$</span> cat ./meetings/{meeting.id}.md
            </p>
            <div className="text-xs text-gray-700 font-terminal">
              <span className="text-matrix/50">[</span>
              EVENT DETAILS
              <span className="text-matrix/50">]</span>
            </div>
          </div>
        </Footer>
      </div>
    </div>
  )
}

export default MeetingDetails
