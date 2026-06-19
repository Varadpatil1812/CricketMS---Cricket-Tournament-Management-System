import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import api from '../api/axios'

const fmt = (runs, wkts, overs) => {
  if (runs == null) return '—'
  let s = `${runs}/${wkts ?? '?'}`
  if (overs != null) s += ` (${overs}ov)`
  return s
}

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [tours, setTours]     = useState([])
  const [filter, setFilter]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tournaments').then(r => setTours(r.data))
    load('')
  }, [])

  const load = tid => {
    setLoading(true)
    api.get(tid ? `/matches/history?tournament_id=${tid}` : '/matches/history')
      .then(r => setMatches(r.data))
      .finally(() => setLoading(false))
  }

  const handleFilter = e => { setFilter(e.target.value); load(e.target.value) }

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h2 className="page-title">📅 Match History</h2>
          <p className="page-sub">All completed matches and results</p>
        </div>
        <select className="form-select" style={{ width: 210 }} value={filter} onChange={handleFilter}>
          <option value="">All Tournaments</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : matches.length === 0
          ? <div className="empty"><span className="empty-icon">📅</span>No completed matches yet.</div>
          : matches.map(m => (
            <div className="fix-card" key={m.id}>
              {/* Team A */}
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div className={`fix-team ${m.winner_name === m.teamA_name ? 'win' : ''}`}>
                  {m.teamA_name}
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
                <div className={`fix-team ${m.winner_name === m.teamB_name ? 'win' : ''}`}>
                  {m.teamB_name}
                </div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>
                  {fmt(m.teamB_runs, m.teamB_wickets, m.teamB_overs)}
                </div>
              </div>

              {/* Right */}
              <div className="ms-auto text-end" style={{ minWidth: 130 }}>
                {m.winner_name
                  ? <div style={{ fontSize: '.82rem' }}>🏆 <strong style={{ color: 'var(--green)' }}>{m.winner_name}</strong></div>
                  : <div style={{ fontSize: '.82rem', color: 'var(--gold)' }}>🤝 Match Tied</div>
                }
                <div style={{ fontSize: '.73rem', color: 'var(--dim)', marginTop: 2 }}>{m.tournament_name}</div>
                <div style={{ fontSize: '.73rem', color: 'var(--dim)' }}>{new Date(m.played_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))
      }
    </>
  )
}