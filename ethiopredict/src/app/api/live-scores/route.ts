import { NextResponse } from 'next/server'

const LEAGUES = ['eng.1', 'uefa.champions', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'uefa.europa']
const LEAGUE_NAMES: Record<string, string> = {
  'eng.1': 'EPL',
  'uefa.champions': 'UCL',
  'esp.1': 'LaLiga',
  'ger.1': 'Bundesliga',
  'ita.1': 'Serie A',
  'fra.1': 'Ligue 1',
  'uefa.europa': 'Europa',
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const results: {
    id: string
    home: string
    away: string
    homeScore: number
    awayScore: number
    minute: string
    league: string
    status: 'live' | 'ft' | 'upcoming'
  }[] = []

  await Promise.all(LEAGUES.map(async (league) => {
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${today}`,
        { next: { revalidate: 60 } }
      )
      if (!res.ok) return
      const data = await res.json()
      for (const event of data.events ?? []) {
        const comp = event.competitions?.[0]
        if (!comp) continue
        const competitors = comp.competitors ?? []
        const home = competitors.find((c: { homeAway: string }) => c.homeAway === 'home') ?? competitors[0]
        const away = competitors.find((c: { homeAway: string }) => c.homeAway === 'away') ?? competitors[1]
        const state = comp.status?.type?.state
        const detail = comp.status?.type?.shortDetail ?? ''
        results.push({
          id: event.id,
          home: home?.team?.shortDisplayName ?? home?.team?.displayName ?? '',
          away: away?.team?.shortDisplayName ?? away?.team?.displayName ?? '',
          homeScore: parseInt(home?.score ?? '0'),
          awayScore: parseInt(away?.score ?? '0'),
          minute: detail,
          league: LEAGUE_NAMES[league] ?? league,
          status: state === 'in' ? 'live' : state === 'post' ? 'ft' : 'upcoming',
        })
      }
    } catch {}
  }))

  const sorted = results.sort((a, b) => {
    const order: Record<string, number> = { live: 0, ft: 1, upcoming: 2 }
    return order[a.status] - order[b.status]
  })

  return NextResponse.json(sorted)
}
