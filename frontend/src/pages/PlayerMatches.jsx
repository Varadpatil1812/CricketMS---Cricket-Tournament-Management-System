import { useEffect, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import api from '../api/axios'

const fmt = (runs, wkts, overs) => {
  if (runs == null) return '—'
  let s = `${runs}/${wkts ?? '?'}`
  if (overs != null) s += ` (${overs}ov)`
  return s
}

export default function PlayerMatches() {
  const [matches, setMatches]   = useState([])
  const [tours, setTours]       = useState([])
  const [filter, setFilter]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [teamId, setTeamId]     = useState(null)
  const [teamName, setTeamName] = useState('')
  const [err, setErr]           = useState('')

  useEffect(() => {
    // Get player's team from dashboard
    api.get('/player/dashboard').then(r => {
      const t = r.data.team
      if (!t) { setErr('You are not assigned to a team yet.'); setLoading(false); return }
      setTeamId(t.id)
      setTeamName(t.name)
      api.get('/tournaments').then(r => setTours(r.data))
      load(t.id, '')
    }).catch(() => { setErr('Could not load your team info.'); setLoading(false) })
  }, [])

  const load = (tid, tourId) => {
    setLoading(true)
    const url = tourId
      ? `/matches/player-history?team_id=${tid}&tournament_id=${tourId}`
      : `/matches/player-history?team_id=${tid}`
    api.get(url).then(r => setMatches(r.data)).finally(() => setLoading(false))
  }

  const handleFilter = e => {
    setFilter(e.target.value)
    if (teamId) load(teamId, e.target.value)
  }

  if (err) return (
    <><div className="page-header"><h2 className="page-title">🏏 My Matches</h2></div>
    <Alert variant="warning">{err}</Alert></>
  )

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h2 className="page-title">🏏 My Matches</h2>
          <p className="page-sub">
            Matches played by <strong style={{ color: 'var(--green)' }}>{teamName}</strong>
          </p>
        </div>
        <select className="form-select" style={{ width: 210 }} value={filter} onChange={handleFilter}>
          <option value="">All Tournaments</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : matches.length === 0
          ? <div className="empty"><span className="empty-icon">🏏</span>No matches played yet.</div>
          : matches.map(m => {
            const myTeam   = m.teamA_name === teamName ? 'A' : 'B'
            const won = m.winner_name === teamName
            const lost = m.winner_name && m.winner_name !== teamName
            return (
              <div className="fix-card" key={m.id}
                style={{ borderLeft: `3px solid ${won ? 'var(--green)' : lost ? 'var(--red)' : 'var(--gold)'}` }}>

                {/* Team A */}
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div className={`fix-team ${m.winner_name === m.teamA_name ? 'win' : ''}`}
                    style={{ fontWeight: myTeam === 'A' ? 800 : 500 }}>
                    {m.teamA_name}
                    {myTeam === 'A' && <span style={{ fontSize: '.7rem', color: 'var(--green)', marginLeft: 4 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>
                    {fmt(m.teamA_runs, m.teamA_wickets, m.teamA_overs)}
                  </div>
                </div>

                {/* Center */}
                <div className="text-center" style={{ minWidth: 64 }}>
                  <div className="fix-vs mb-1">VS</div>
                  <span className={m.status === 'tie' ? 'b-tie' : 'b-completed'}>{m.status}</span>
                </div>

                {/* Team B */}
                <div style={{ flex: 1 }}>
                  <div className={`fix-team ${m.winner_name === m.teamB_name ? 'win' : ''}`}
                    style={{ fontWeight: myTeam === 'B' ? 800 : 500 }}>
                    {m.teamB_name}
                    {myTeam === 'B' && <span style={{ fontSize: '.7rem', color: 'var(--green)', marginLeft: 4 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>
                    {fmt(m.teamB_runs, m.teamB_wickets, m.teamB_overs)}
                  </div>
                </div>

                {/* Result */}
                <div className="ms-auto text-end" style={{ minWidth: 110 }}>
                  {won
                    ? <div style={{ fontSize: '.82rem', color: 'var(--green)' }}>🏆 <strong>Won</strong></div>
                    : lost
                      ? <div style={{ fontSize: '.82rem', color: 'var(--red)' }}>❌ Lost</div>
                      : <div style={{ fontSize: '.82rem', color: 'var(--gold)' }}>🤝 Tied</div>}
                  <div style={{ fontSize: '.72rem', color: 'var(--dim)', marginTop: 2 }}>{m.tournament_name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--dim)' }}>{new Date(m.played_at).toLocaleDateString()}</div>
                </div>
              </div>
            )
          })
      }
    </>
  )
}
