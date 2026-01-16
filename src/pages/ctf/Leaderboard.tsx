import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ChevronLeft, Trophy, Star, Clock, Check, Close } from '@/lib/cyberIcon'
import { challenges } from './challengeData'
import { difficultyInfo } from './types'
import { Tabs } from '@/components/Tabs'
import type { LeaderboardEntry, CTFSubmission } from '@/types/database.types'

interface TeamSubmission extends CTFSubmission {
  team_name?: string
  user?: {
    id: string
    display_name: string
  }
}

function Leaderboard() {
  const [loaded, setLoaded] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<TeamSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'rankings' | 'activity'>('rankings')

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      // Fetch all teams with members (user_ids only)
      const { data: teams } = await supabase
        .from('ctf_teams')
        .select(`
          id,
          name,
          members:ctf_team_members(user_id)
        `)

      // Collect all unique user IDs from team members
      const memberUserIds = new Set<string>()
      teams?.forEach(team => {
        team.members?.forEach((m: { user_id: string }) => {
          memberUserIds.add(m.user_id)
        })
      })

      // Fetch public profiles for all members (uses public_profiles view)
      const { data: memberProfiles } = memberUserIds.size > 0
        ? await supabase
            .from('public_profiles')
            .select('id, display_name, photo_url')
            .in('id', Array.from(memberUserIds))
        : { data: [] }

      // Create a map for quick profile lookup
      const profileMap = new Map(
        memberProfiles?.map(p => [p.id, p]) || []
      )

      // Map profiles to team members
      const teamsWithProfiles = teams?.map(team => ({
        ...team,
        members: team.members?.map((m: { user_id: string }) => ({
          user: profileMap.get(m.user_id)
        })) || []
      }))

      // Fetch all submissions with team names
      const { data: allSubmissions } = await supabase
        .from('ctf_submissions')
        .select(`
          *,
          team:ctf_teams(name)
        `)
        .order('submitted_at', { ascending: false })

      // Get submitter profiles from public_profiles
      const submitterIds = new Set(allSubmissions?.map(s => s.submitted_by) || [])
      const { data: submitterProfiles } = submitterIds.size > 0
        ? await supabase
            .from('public_profiles')
            .select('id, display_name')
            .in('id', Array.from(submitterIds))
        : { data: [] }

      const submitterMap = new Map(
        submitterProfiles?.map(p => [p.id, p]) || []
      )

      // Map submitter profiles to submissions
      const submissionsWithProfiles = allSubmissions?.map(sub => ({
        ...sub,
        user: submitterMap.get(sub.submitted_by)
      }))

      if (!teamsWithProfiles) {
        setLoading(false)
        setLoaded(true)
        return
      }

      // Calculate leaderboard entries
      const entries: LeaderboardEntry[] = teamsWithProfiles.map(team => {
        const teamSubmissions = submissionsWithProfiles?.filter(s => s.team_id === team.id) || []
        const correctSubmissions = teamSubmissions.filter(s => s.is_correct)

        // Count solves by difficulty
        let beastSolves = 0
        let hardSolves = 0
        let mediumSolves = 0
        let easySolves = 0
        let totalPoints = 0

        correctSubmissions.forEach(sub => {
          const challenge = challenges.find(c => c.id === sub.challenge_id)
          if (challenge) {
            totalPoints += challenge.points
            switch (challenge.difficulty) {
              case 'beast': beastSolves++; break
              case 'hard': hardSolves++; break
              case 'medium': mediumSolves++; break
              case 'easy': easySolves++; break
            }
          }
        })

        const lastSolve = correctSubmissions.length > 0
          ? correctSubmissions.reduce((latest, sub) =>
              new Date(sub.submitted_at) > new Date(latest.submitted_at) ? sub : latest
            ).submitted_at
          : null

        return {
          team_id: team.id,
          team_name: team.name,
          total_points: totalPoints,
          beast_solves: beastSolves,
          hard_solves: hardSolves,
          medium_solves: mediumSolves,
          easy_solves: easySolves,
          total_solves: correctSubmissions.length,
          incorrect_attempts: teamSubmissions.filter(s => !s.is_correct).length,
          last_solve_at: lastSolve,
          members: team.members?.map((m: any) => m.user).filter(Boolean) || []
        }
      })

      // Sort by: total points desc, then by last solve time asc (earlier solves rank higher)
      entries.sort((a, b) => {
        if (b.total_points !== a.total_points) {
          return b.total_points - a.total_points
        }
        // If tied, earlier last solve wins
        if (a.last_solve_at && b.last_solve_at) {
          return new Date(a.last_solve_at).getTime() - new Date(b.last_solve_at).getTime()
        }
        return 0
      })

      setLeaderboard(entries)

      // Set recent submissions with team name
      const recentSubs = submissionsWithProfiles?.slice(0, 50).map(sub => ({
        ...sub,
        team_name: (sub as any).team?.name
      })) || []
      setRecentSubmissions(recentSubs)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
      setLoaded(true)
    }
  }

  const getChallenge = (id: string) => challenges.find(c => c.id === id)

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/50'
      case 3: return 'bg-gradient-to-r from-orange-600/20 to-transparent border-orange-600/50'
      default: return 'border-gray-700 hover:border-gray-600'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />
      case 3: return <Trophy className="w-6 h-6 text-orange-500" />
      default: return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-matrix">
      <div className="crt-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            to="/ctf"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-matrix transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-terminal text-sm">Back to CTF</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <Trophy className="inline w-10 h-10 text-yellow-400 mr-3" />
                <span className="text-white">CTF</span>{' '}
                <span className="glitch neon-text" data-text="Leaderboard">Leaderboard</span>
              </h1>
              <p className="text-gray-400">
                {leaderboard.length} teams competing • Updates every 30 seconds
              </p>
            </div>

            {/* View Toggle */}
            <Tabs
              tabs={[
                { id: 'rankings', label: 'Rankings' },
                { id: 'activity', label: 'Live Activity' }
              ]}
              activeTab={view}
              onTabChange={(tabId) => setView(tabId as 'rankings' | 'activity')}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="font-terminal text-lg neon-pulse">Loading leaderboard...</div>
          </div>
        ) : view === 'rankings' ? (
          /* Rankings View */
          <div className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {leaderboard.length === 0 ? (
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">leaderboard.log</span>
                </div>
                <div className="terminal-body text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No teams yet. Be the first to compete!</p>
                  <Link
                    to="/ctf/team"
                    className="inline-block mt-4 btn-hack-filled rounded-lg px-6 py-3"
                  >
                    Create a Team
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header Row */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-2 text-xs text-gray-500 font-terminal">
                  <div className="col-span-1">RANK</div>
                  <div className="col-span-4">TEAM</div>
                  <div className="col-span-1 text-center">POINTS</div>
                  <div className="col-span-4 text-center">SOLVES</div>
                  <div className="col-span-2 text-right">LAST SOLVE</div>
                </div>

                {leaderboard.map((entry, index) => {
                  const rank = index + 1
                  return (
                    <div
                      key={entry.team_id}
                      className={`rounded-xl border p-4 md:p-6 transition-all ${getRankStyle(rank)}`}
                    >
                      <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                        {/* Rank */}
                        <div className="col-span-1 flex items-center gap-3 mb-3 md:mb-0">
                          {getRankIcon(rank)}
                        </div>

                        {/* Team Name & Members */}
                        <div className="col-span-4 mb-3 md:mb-0">
                          <h3 className={`font-bold text-lg ${rank <= 3 ? 'text-matrix' : 'text-white'}`}>
                            {entry.team_name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {entry.members.slice(0, 4).map((member, i) => (
                              member.photo_url ? (
                                <img
                                  key={member.id}
                                  src={member.photo_url}
                                  alt={member.display_name}
                                  className="w-6 h-6 rounded-full border border-gray-600"
                                  title={member.display_name}
                                />
                              ) : (
                                <div
                                  key={member.id}
                                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 border border-gray-600"
                                  title={member.display_name}
                                >
                                  {member.display_name.charAt(0).toUpperCase()}
                                </div>
                              )
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              {entry.members.length} member{entry.members.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="col-span-1 text-center mb-3 md:mb-0">
                          <div className={`text-2xl font-bold ${rank <= 3 ? 'text-matrix neon-text-subtle' : 'text-white'}`}>
                            {entry.total_points}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>

                        {/* Solves Breakdown */}
                        <div className="col-span-4 mb-3 md:mb-0">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {entry.beast_solves > 0 && (
                              <span className="px-2 py-1 rounded text-xs font-terminal bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {entry.beast_solves} Beast
                              </span>
                            )}
                            {entry.hard_solves > 0 && (
                              <span className="px-2 py-1 rounded text-xs font-terminal bg-red-500/20 text-red-400 border border-red-500/30">
                                {entry.hard_solves} Hard
                              </span>
                            )}
                            {entry.medium_solves > 0 && (
                              <span className="px-2 py-1 rounded text-xs font-terminal bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                {entry.medium_solves} Med
                              </span>
                            )}
                            {entry.easy_solves > 0 && (
                              <span className="px-2 py-1 rounded text-xs font-terminal bg-green-500/20 text-green-400 border border-green-500/30">
                                {entry.easy_solves} Easy
                              </span>
                            )}
                            {entry.incorrect_attempts > 0 && (
                              <span className="px-2 py-1 rounded text-xs font-terminal bg-red-500/10 text-red-400/70 border border-red-500/20">
                                {entry.incorrect_attempts} wrong
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Last Solve */}
                        <div className="col-span-2 text-right">
                          {entry.last_solve_at ? (
                            <span className="text-gray-400 text-sm flex items-center justify-end gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(entry.last_solve_at)}
                            </span>
                          ) : (
                            <span className="text-gray-600 text-sm">No solves yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Live Activity View */
          <div className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="ml-4 text-xs text-gray-500 font-terminal">live_activity.log</span>
              </div>
              <div className="terminal-body max-h-[600px] overflow-y-auto">
                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No submissions yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentSubmissions.map(sub => {
                      const challenge = getChallenge(sub.challenge_id)
                      return (
                        <div
                          key={sub.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            sub.is_correct
                              ? 'border-green-500/30 bg-green-500/5'
                              : 'border-red-500/30 bg-red-500/5'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            sub.is_correct ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {sub.is_correct ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Close className="w-4 h-4 text-red-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium ${sub.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                                {sub.team_name}
                              </span>
                              <span className="text-gray-500">
                                {sub.is_correct ? 'solved' : 'attempted'}
                              </span>
                              <span className="text-white font-medium truncate">
                                {challenge?.title || sub.challenge_id}
                              </span>
                              {challenge && (
                                <span className={`px-2 py-0.5 rounded text-xs font-terminal ${
                                  challenge.difficulty === 'beast' ? 'bg-purple-500/20 text-purple-400' :
                                  challenge.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                                  challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {difficultyInfo[challenge.difficulty].name}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              by {sub.user?.display_name} • {formatTime(sub.submitted_at)}
                            </div>
                          </div>

                          {sub.is_correct && (
                            <div className="text-green-400 font-bold">
                              +{sub.points_awarded}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className={`mt-8 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span>Beast (500 pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <span>Hard (300 pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span>Medium (200 pts)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span>Easy (100 pts)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
