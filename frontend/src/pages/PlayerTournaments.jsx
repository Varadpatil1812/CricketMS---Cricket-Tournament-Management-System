import { useEffect, useState } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import api from '../api/axios'

export default function PlayerTournaments() {
  const [tours, setTours]       = useState([])
  const [sel, setSel]           = useState(null)
  const [pts, setPts]           = useState([])
  const [teamId, setTeamId]     = useState(null)
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading]   = useState(true)
  const [loadPts, setLoadPts]   = useState(false)
  const [err, setErr]           = useState('')

  useEffect(() => {
    api.get('/player/dashboard').then(async r => {
      const t = r.data.team
      if (!t) { setErr('You are not assigned to a team yet.'); setLoading(false); return }
      setTeamId(t.id)
      setTeamName(t.name)

      // Get all tournaments and filter to only those containing this team
      const allTours = await api.get('/tournaments').then(r => r.data)
      const myTours = allTours.filter(t => {
        const ids = t.team_ids || []
        return ids.includes(Number(r.data.team.id))
      })
      setTours(myTours)
      setLoading(false)
    }).catch(() => { setErr('Could not load your team info.'); setLoading(false) })
  }, [])

  const select = async t => {
    setSel(t); setLoadPts(true)
    try {
      const p = await api.get(`/points/${t.id}`)
      setPts(p.data)
    } finally { setLoadPts(false) }
  }

  const rank  = i => i === 0 ? 'rk-gold' : i === 1 ? 'rk-silver' : i === 2 ? 'rk-bronze' : ''
  const medal = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1

  if (err) return (
    <><div className="page-header"><h2 className="page-title">🏆 My Tournaments</h2></div>
    <Alert variant="warning">{err}</Alert></>
  )

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🏆 My Tournaments</h2>
        <p className="page-sub">
          Tournaments featuring <strong style={{ color: 'var(--green)' }}>{teamName}</strong>
        </p>
      </div>

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : (
          <Row className="g-3">
            <Col lg={4}>
              {tours.length === 0
                ? <div className="empty"><span className="empty-icon">🏆</span>Your team has not been added to any tournament yet.</div>
                : tours.map(t => (
                  <div key={t.id} className={`tour-card mb-2 ${sel?.id === t.id ? 'sel' : ''}`} onClick={() => select(t)}>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.15rem' }}>📋 {t.format}</div>
                  </div>
                ))}
            </Col>

            <Col lg={8}>
              {!sel
                ? <div className="empty"><span className="empty-icon">👈</span>Select a tournament</div>
                : loadPts
                  ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
                  : (<>
                    <h5 className="rj mb-3" style={{ color: 'var(--text)' }}>📊 {sel.name} — Points Table</h5>
                    {pts.length === 0
                      ? <div className="empty"><span className="empty-icon">📊</span>No matches completed yet.</div>
                      : (
                        <div className="cc">
                          <table className="table ct mb-0">
                            <thead>
                              <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>T</th><th>Pts</th></tr>
                            </thead>
                            <tbody>
                              {pts.map((row, i) => (
                                <tr key={row.team_id}
                                  style={row.team_id === teamId ? { background: 'var(--green-gl)' } : {}}>
                                  <td className={rank(i)}>{medal(i)}</td>
                                  <td>
                                    <strong>{row.team_name}</strong>
                                    {row.team_id === teamId && (
                                      <span style={{ fontSize: '.7rem', color: 'var(--green)', marginLeft: 6 }}>← you</span>
                                    )}
                                  </td>
                                  <td>{row.played}</td>
                                  <td style={{ color: 'var(--green)' }}>{row.wins}</td>
                                  <td style={{ color: 'var(--red)' }}>{row.losses}</td>
                                  <td style={{ color: 'var(--gold)' }}>{row.ties}</td>
                                  <td><strong style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '1.1rem' }}>{row.points}</strong></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </>)
              }
            </Col>
          </Row>
        )}
    </>
  )
}
