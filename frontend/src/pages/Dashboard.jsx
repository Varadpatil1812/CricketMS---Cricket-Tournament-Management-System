import { useEffect, useState } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const rColor = { batsman:'success', bowler:'danger', 'all-rounder':'primary', 'wicket-keeper':'warning' }

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/player/dashboard')
      .then(r => setData(r.data))
      .catch(e => setErr(e.response?.data?.message || 'Could not load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
  if (err) return <Alert variant="warning">{err}<div className="mt-1" style={{ fontSize: '.82rem' }}>Ask admin to assign you to a team.</div></Alert>

  const { profile, team, stats } = data
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">📊 My Dashboard</h2>
        <p className="page-sub">Welcome back, {user.name}</p>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4 stagger">
        {[
          { label:'Matches', val: stats.played, icon:'📅', bg:'rgba(88,166,255,.1)', col:'var(--blue)' },
          { label:'Wins',    val: stats.wins,   icon:'🏆', bg:'var(--green-gl)',     col:'var(--green)' },
          { label:'Losses',  val: stats.losses, icon:'❌', bg:'rgba(248,81,73,.1)',   col:'var(--red)' },
          { label:'Ties',    val: stats.ties,   icon:'🤝', bg:'var(--gold-gl)',       col:'var(--gold)' },
        ].map(s => (
          <Col xs={6} md={3} key={s.label}>
            <div className="stat-box">
              <div className="si" style={{ background: s.bg, color: s.col }}>{s.icon}</div>
              <div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* Profile */}
        <Col md={5}>
          <div className="cc h-100">
            <div className="cc-head">👤 My Profile</div>
            <div className="cc-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-avatar">{initials}</div>
                <div>
                  <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.2rem', fontWeight:700 }}>{profile.name}</div>
                  <div style={{ color:'var(--muted)', fontSize:'.82rem' }}>{user.email}</div>
                </div>
              </div>
              <table style={{ width:'100%', fontSize:'.88rem' }}>
                <tbody>
                  <tr><td style={{ color:'var(--muted)', paddingBottom:6 }}>Playing Role</td>
                    <td><span className={`badge bg-${rColor[profile.player_role]||'secondary'}`}>{profile.player_role}</span></td></tr>
                  <tr><td style={{ color:'var(--muted)', paddingBottom:6 }}>Captain</td>
                    <td>{profile.is_captain ? '👑 Yes' : <span style={{ color:'var(--dim)' }}>No</span>}</td></tr>
                  <tr><td style={{ color:'var(--muted)' }}>Account</td>
                    <td><span className="role-chip player">player</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>

        {/* Team + stats */}
        <Col md={7}>
          <div className="cc h-100">
            <div className="cc-head">🛡️ My Team & Performance</div>
            <div className="cc-body">
              {team ? (
                <>
                  <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.5rem', fontWeight:700, color:'var(--text)' }}>{team.name}</div>
                  <div className="glow-div" />
                  <div style={{ fontSize:'.82rem', color:'var(--muted)', marginBottom:'.4rem' }}>
                    Win Rate <span style={{ float:'right', color:'var(--green)', fontWeight:700 }}>{winPct}%</span>
                  </div>
                  <div className="win-track">
                    <div className="win-fill" style={{ width: `${winPct}%` }} />
                  </div>
                  <div className="d-flex gap-3 mt-3" style={{ fontSize:'.85rem' }}>
                    <span style={{ color:'var(--green)' }}>✅ {stats.wins} Wins</span>
                    <span style={{ color:'var(--red)' }}>❌ {stats.losses} Losses</span>
                    <span style={{ color:'var(--gold)' }}>🤝 {stats.ties} Ties</span>
                    <span style={{ color:'var(--muted)' }}>📅 {stats.played} Played</span>
                  </div>
                </>
              ) : (
                <div className="empty" style={{ padding:'2rem' }}>
                  <span className="empty-icon">🛡️</span>
                  Not assigned to a team yet.<br />Contact your admin.
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
