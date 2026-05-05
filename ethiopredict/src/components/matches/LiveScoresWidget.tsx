'use client'
import { useState, useEffect } from 'react'

interface LiveMatch {
  id: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  minute: string
  league: string
  status: 'live' | 'ft' | 'upcoming'
}

export default function LiveScoresWidget() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchScores() {
    try {
      const res = await fetch('/api/live-scores', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setMatches(data)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchScores()
    const interval = setInterval(fetchScores, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="text-[#555555] text-xs text-center py-4">Loading scores...</div>
  if (matches.length === 0) return null

  const live = matches.filter(m => m.status === 'live')
  const recent = matches.filter(m => m.status === 'ft').slice(0, 3)

  if (live.length === 0 && recent.length === 0) return null

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 mb-6">
      <h3 className="font-[family-name:var(--font-bebas)] text-lg text-[#f0f0f0] tracking-wide mb-3 flex items-center gap-2">
        {live.length > 0 && <span className="w-2 h-2 rounded-full bg-[#FF1744] animate-pulse" />}
        {live.length > 0 ? 'Live Scores' : 'Recent Results'}
      </h3>
      <div className="flex flex-col gap-2">
        {[...live, ...recent].map(m => (
          <div key={m.id} className="flex items-center justify-between text-sm">
            <span className="text-[#888888] text-[0.65rem] w-16 truncate">{m.league}</span>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <span className="text-[#f0f0f0] font-semibold text-xs truncate text-right w-24">{m.home}</span>
              <span className="font-[family-name:var(--font-bebas)] text-lg text-[#00E676] w-12 text-center">
                {m.homeScore} - {m.awayScore}
              </span>
              <span className="text-[#f0f0f0] font-semibold text-xs truncate text-left w-24">{m.away}</span>
            </div>
            <span className={`text-[0.6rem] font-bold w-10 text-right ${m.status === 'live' ? 'text-[#FF1744]' : 'text-[#555555]'}`}>
              {m.status === 'live' ? m.minute : 'FT'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
