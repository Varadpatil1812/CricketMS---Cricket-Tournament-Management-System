import { useEffect, useState, useRef } from 'react'
import { Row, Col, Form, Alert, Spinner } from 'react-bootstrap'
import api from '../../api/axios'

const rColor = { batsman:'success', bowler:'danger', 'all-rounder':'primary', 'wicket-keeper':'warning' }

export default function AssignPlayers() {
  const [teams, setTeams]         = useState([])
  const [players, setPlayers]     = useState([])
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [selPlayer, setSelPlayer] = useState(null)
  const [selTeam, setSelTeam]     = useState('')
  const [assignAs, setAssignAs]   = useState('player') // 'player' | 'captain'
  const [msg, setMsg]             = useState({ t:'', v:'' })
  const [searching, setSearching] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const timerRef = useRef(null)

  const load = () => {
    api.get('/teams').then(r => setTeams(r.data))
    api.get('/players').then(r => setPlayers(r.data))
  }
  useEffect(() => { load() }, [])

  const flash = (t, v = 'success') => { setMsg({ t, v }); setTimeout(() => setMsg({ t:'', v:'' }), 3500) }

  const handleSearch = e => {
    const q = e.target.value
    setQuery(q); setSelPlayer(null); setResults([])
    if (!q.trim()) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSearching(true)
      try { const r = await api.get(`/players/search?q=${q}`); setResults(r.data) }
      finally { setSearching(false) }
    }, 300)
  }

  const pickPlayer = p => {
    setSelPlayer(p)
    setResults([])
    setQuery(p.name)
    setSelTeam(p.team_id?.toString() || '')
    setAssignAs('player')
  }

  const clearSelection = () => {
    setSelPlayer(null); setQuery(''); setSelTeam(''); setAssignAs('player'); setResults([])
  }

  const assign = async () => {
    if (!selPlayer || !selTeam) return flash('Select both a player and a team.', 'warning')
    setAssigning(true)
    try {
      const r = await api.put(`/players/${selPlayer.id}/assign`, {
        team_id: Number(selTeam),
        assign_as: assignAs,
      })
      flash(r.data.message)
      clearSelection()
      load()
    } catch(e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
    finally { setAssigning(false) }
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">👤 Assign Players</h2>
        <p className="page-sub">Search player → view details → choose role → assign to team</p>
      </div>

      {msg.t && <Alert variant={msg.v} className="py-2 mb-3">{msg.t}</Alert>}

      <Row className="g-4">
        {/* ── Left: search + assign ── */}
        <Col lg={5}>
          <div className="cc">
            <div className="cc-head">🔍 Search & Assign</div>
            <div className="cc-body">

              {/* Search input */}
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Search Player by Name</Form.Label>
                <div style={{ position:'relative' }}>
                  <Form.Control
                    value={query}
                    placeholder="Type player name..."
                    onChange={handleSearch}
                    autoComplete="off"
                  />
                  {searching && (
                    <Spinner animation="border" size="sm"
                      style={{ position:'absolute', right:10, top:9, color:'var(--green)' }} />
                  )}
                </div>
              </Form.Group>

              {/* Dropdown results */}
              {results.length > 0 && (
                <div className="mb-3" style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {results.map(p => (
                    <div key={p.id} className="sr-item" onClick={() => pickPlayer(p)}>
                      <div style={{ fontWeight:600, fontSize:'.9rem' }}>{p.name}</div>
                      <div style={{ fontSize:'.75rem', color:'var(--muted)' }}>
                        <span className={`badge bg-${rColor[p.player_role]||'secondary'} me-2`}>{p.player_role}</span>
                        {p.team_name ? `Team: ${p.team_name}` : 'Unassigned'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected player card */}
              {selPlayer && (
                <div className="sel-player mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ fontSize:'.7rem', color:'var(--green)', fontWeight:700, letterSpacing:'.8px', textTransform:'uppercase' }}>
                      ✅ Selected Player
                    </div>
                    <button
                      onClick={clearSelection}
                      style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'.85rem', padding:0 }}>
                      ✕ Clear
                    </button>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div style={{
                      width:38, height:38, borderRadius:'50%',
                      background:'var(--green-d)', display:'flex',
                      alignItems:'center', justifyContent:'center',
                      fontFamily:'Rajdhani,sans-serif', fontWeight:700,
                      color:'#fff', fontSize:'.88rem', flexShrink:0,
                    }}>
                      {selPlayer.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontFamily:'Rajdhani,sans-serif', fontSize:'1rem' }}>{selPlayer.name}</div>
                      <div style={{ fontSize:'.73rem', color:'var(--muted)' }}>{selPlayer.email}</div>
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', fontSize:'.78rem' }}>
                    <span className={`badge bg-${rColor[selPlayer.player_role]||'secondary'}`}>{selPlayer.player_role}</span>
                    {selPlayer.team_name && (
                      <span style={{ color:'var(--muted)' }}>Current team: <strong style={{ color:'var(--text)' }}>{selPlayer.team_name}</strong></span>
                    )}
                    {selPlayer.is_captain ? <span style={{ color:'var(--gold)' }}>👑 Currently captain</span> : null}
                  </div>
                </div>
              )}

              {/* Team select */}
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Assign to Team</Form.Label>
                <Form.Select value={selTeam} onChange={e => setSelTeam(e.target.value)}>
                  <option value="">-- Select Team --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}{t.captain_name ? ` · 👑 ${t.captain_name}` : ' · No captain'}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Assign As — two clear options */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">Assign As</Form.Label>
                <div style={{ display:'flex', gap:10 }}>
                  {/* Player option */}
                  <div
                    onClick={() => setAssignAs('player')}
                    style={{
                      flex:1, padding:'.7rem', borderRadius:8, cursor:'pointer',
                      border: `2px solid ${assignAs === 'player' ? 'var(--blue)' : 'var(--border)'}`,
                      background: assignAs === 'player' ? 'rgba(88,166,255,.08)' : 'var(--bg3)',
                      transition:'all .15s', textAlign:'center',
                    }}
                  >
                    <div style={{ fontSize:'1.3rem', marginBottom:4 }}>🏏</div>
                    <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'.92rem', color: assignAs==='player' ? 'var(--blue)' : 'var(--text)' }}>
                      Player
                    </div>
                    <div style={{ fontSize:'.7rem', color:'var(--muted)', marginTop:2 }}>Regular team member</div>
                  </div>

                  {/* Captain option */}
                  <div
                    onClick={() => setAssignAs('captain')}
                    style={{
                      flex:1, padding:'.7rem', borderRadius:8, cursor:'pointer',
                      border: `2px solid ${assignAs === 'captain' ? 'var(--gold)' : 'var(--border)'}`,
                      background: assignAs === 'captain' ? 'var(--gold-gl)' : 'var(--bg3)',
                      transition:'all .15s', textAlign:'center',
                    }}
                  >
                    <div style={{ fontSize:'1.3rem', marginBottom:4 }}>👑</div>
                    <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'.92rem', color: assignAs==='captain' ? 'var(--gold)' : 'var(--text)' }}>
                      Captain
                    </div>
                    <div style={{ fontSize:'.7rem', color:'var(--muted)', marginTop:2 }}>Replaces current captain</div>
                  </div>
                </div>
              </Form.Group>

              {/* Info note */}
              {assignAs === 'captain' && selTeam && (() => {
                const t = teams.find(t => t.id === Number(selTeam))
                return t?.captain_name ? (
                  <div style={{ fontSize:'.78rem', color:'var(--gold)', background:'var(--gold-gl)', border:'1px solid var(--gold-d)', borderRadius:6, padding:'.45rem .7rem', marginBottom:'1rem' }}>
                    ⚠️ <strong>{t.captain_name}</strong> will be demoted from captain.
                  </div>
                ) : null
              })()}

              {assignAs === 'player' && (
                <div style={{ fontSize:'.78rem', color:'var(--blue)', background:'rgba(88,166,255,.08)', border:'1px solid rgba(88,166,255,.25)', borderRadius:6, padding:'.45rem .7rem', marginBottom:'1rem' }}>
                  ℹ️ Player will be added to the team. Current captain is unchanged.
                </div>
              )}

              <button
                className={`btn w-100 ${assignAs === 'captain' ? 'btn-gold' : 'btn-g'}`}
                onClick={assign}
                disabled={assigning || !selPlayer || !selTeam}
              >
                {assigning && <span className="spin" />}
                {assignAs === 'captain' ? '👑 Assign as Captain' : '🏏 Assign as Player'}
              </button>
            </div>
          </div>
        </Col>

        {/* ── Right: all players table ── */}
        <Col lg={7}>
          <div className="cc">
            <div className="cc-head">👥 All Players ({players.length})</div>
            {players.length === 0 ? (
              <div className="empty"><span className="empty-icon">👥</span>No players registered yet.</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table className="table ct mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Playing Role</th>
                      <th>Team</th>
                      <th>Captain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p, i) => (
                      <tr key={p.id} style={{ cursor:'pointer' }} onClick={() => pickPlayer(p)}
                        title="Click to select this player">
                        <td style={{ color:'var(--dim)' }}>{i+1}</td>
                        <td>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize:'.72rem', color:'var(--muted)' }}>{p.email}</div>
                        </td>
                        <td>
                          <span className={`badge bg-${rColor[p.player_role]||'secondary'}`}>
                            {p.player_role}
                          </span>
                        </td>
                        <td>{p.team_name || <span style={{ color:'var(--dim)' }}>—</span>}</td>
                        <td>
                          {p.is_captain
                            ? <span style={{ color:'var(--gold)' }}>👑 Yes</span>
                            : <span style={{ color:'var(--dim)' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}
