import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Spinner } from 'react-bootstrap'
import api from '../api/axios'

export default function ViewerOverview() {
  const nav = useNavigate()
  const [stats, setStats] = useState({ teams: 0, players: 0, tournaments: 0, matches: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/teams'),
      api.get('/tournaments'),
      api.get('/matches/history'),
    ]).then(async ([t, tr, m]) => {
      const teams = t.data
      // Fetch players for every team in parallel, then sum up
      const playerArrays = await Promise.all(
        teams.map(team => api.get(`/teams/${team.id}/players`).then(r => r.data).catch(() => []))
      )
      const totalPlayers = playerArrays.reduce((sum, arr) => sum + arr.length, 0)

      setStats({
        teams:       teams.length,
        players:     totalPlayers,
        tournaments: tr.data.length,
        matches:     m.data.length,
      })
    }).finally(() => setLoading(false))
  }, [])

  const cards = [
    { icon: '🛡️', label: 'Teams',       val: stats.teams,       to: '/viewer/teams',       color: 'var(--green)' },
    { icon: '👥', label: 'Players',     val: stats.players,      to: '/viewer/players',     color: 'var(--blue)' },
    { icon: '🏆', label: 'Tournaments', val: stats.tournaments,  to: '/viewer/tournaments', color: 'var(--gold)' },
    { icon: '📅', label: 'Matches',     val: stats.matches,      to: '/viewer/matches',     color: '#c084fc' },
  ]

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">👀 Viewer Overview</h2>
      </div>

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : (
          <>
            <Row className="g-3 mb-4 stagger">
              {cards.map(c => (
                <Col xs={6} md={3} key={c.label}>
                  <div
                    className="stat-box"
                    style={{ cursor: 'pointer' }}
                    onClick={() => nav(c.to)}
                  >
                    <div className="si" style={{ background: `${c.color}18`, color: c.color, fontSize: '1.5rem' }}>
                      {c.icon}
                    </div>
                    <div>
                      <div className="stat-val">{c.val}</div>
                      <div className="stat-lbl">{c.label}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Quick nav cards */}
            <Row className="g-3 stagger">
              {[
                { icon: '🛡️', title: 'View Teams',       sub: 'All registered teams and captains',       to: '/viewer/teams' },
                { icon: '👥', title: 'View Players',     sub: 'Players grouped by team and role',        to: '/viewer/players' },
                { icon: '🏆', title: 'Tournaments',      sub: 'Points table for each tournament',        to: '/viewer/tournaments' },
                { icon: '📅', title: 'Match History',    sub: 'Scores and results of all played matches', to: '/viewer/matches' },
              ].map(c => (
                <Col md={6} key={c.title}>
                  <div
                    className="cc"
                    style={{ cursor: 'pointer', padding: 0 }}
                    onClick={() => nav(c.to)}
                  >
                    <div className="cc-body d-flex align-items-center gap-3" style={{ padding: '1.1rem 1.3rem' }}>
                      <div style={{ fontSize: '2rem', lineHeight: 1 }}>{c.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: 2 }}>{c.sub}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'var(--dim)', fontSize: '1.1rem' }}>›</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
    </>
  )
}