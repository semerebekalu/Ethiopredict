import type { Result } from '@/types'

export function computeStats(results: Result[]) {
  const sorted = [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const wins = results.filter(r => r.outcome === 'win').length
  const losses = results.filter(r => r.outcome === 'loss').length
  const winRate = wins + losses === 0 ? 0 : Math.round((wins / (wins + losses)) * 100)

  // Calculate current streak
  let streak = 0
  let streakType: 'win' | 'loss' | null = null
  for (const r of sorted) {
    if (r.outcome === 'void') continue
    if (streakType === null) {
      streakType = r.outcome
      streak = 1
    } else if (r.outcome === streakType) {
      streak++
    } else {
      break
    }
  }

  return { wins, losses, winRate, streak, streakType, total: results.length }
}
