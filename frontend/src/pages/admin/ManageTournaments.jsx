import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert } from 'react-bootstrap'
import api from '../../api/axios'

export default function ManageTournaments() {
  const [tours, setTours] = useState([])
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [addForm, setAddForm] = useState({ tournament_id: '', team_ids: [] })
  const [tourTeams, setTourTeams] = useState({})
  const [msg, setMsg] = useState({ t: '', v: '' })
  const [loading, setLoading] = useState(false)

  const load = () => { api.get('/tournaments').then(r => setTours(r.data)); api.get('/teams').then(r => setTeams(r.data)) }
  useEffect(() => { load() }, [])

  const flash = (t, v = 'success') => { setMsg({ t, v }); setTimeout(() => setMsg({ t:'', v:'' }), 3500) }

  const createTour = async e => {
    e.preventDefault(); setLoading(true)
    try { await api.post('/tournaments', { name, format:'League' }); flash('Tournament created!'); setName(''); load() }
    catch(e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
    finally { setLoading(false) }
  }

  const toggleTeam = id => {
    const n = Number(id)
    setAddForm(p => ({ ...p, team_ids: p.team_ids.includes(n) ? p.team_ids.filter(x=>x!==n) : [...p.team_ids, n] }))
  }

  const addTeams = async e => {
    e.preventDefault()
    if (addForm.team_ids.length < 2) return flash('Select at least 2 teams.', 'warning')
    try {
      await api.post(`/tournaments/${addForm.tournament_id}/add-teams`, { team_ids: addForm.team_ids })
      flash('Teams assigned to tournament!'); setAddForm({ tournament_id:'', team_ids:[] })
    } catch(e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
  }

  const viewTeams = async id => {
    if (tourTeams[id]) return setTourTeams(p => { const n={...p}; delete n[id]; return n })
    const r = await api.get(`/tournaments/${id}/teams`); setTourTeams(p => ({ ...p, [id]: r.data }))
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🏆 Manage Tournaments</h2>
        <p className="page-sub">Create tournaments and assign teams</p>
      </div>
      {msg.t && <Alert variant={msg.v} className="py-2 mb-3">{msg.t}</Alert>}
      <Row className="g-4">
        <Col lg={4}>
          <div className="cc mb-3">
            <div className="cc-head">➕ Create Tournament</div>
            <div className="cc-body">
              <Form onSubmit={createTour}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Tournament Name</Form.Label>
                  <Form.Control value={name} required placeholder="e.g. IPL 2025" onChange={e => setName(e.target.value)} />
                </Form.Group>
                <button type="submit" className="btn btn-g w-100" disabled={loading}>
                  {loading && <span className="spin" />} Create
                </button>
              </Form>
            </div>
          </div>
          <div className="cc">
            <div className="cc-head">🛡️ Add Teams to Tournament</div>
            <div className="cc-body">
              <Form onSubmit={addTeams}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Tournament</Form.Label>
                  <Form.Select required value={addForm.tournament_id} onChange={e => setAddForm({ ...addForm, tournament_id:e.target.value, team_ids:[] })}>
                    <option value="">-- Select --</option>
                    {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Select Teams (min 2)</Form.Label>
                  <div style={{ maxHeight:160, overflowY:'auto', border:'1px solid var(--border)', borderRadius:6, padding:'.5rem .75rem', background:'var(--bg3)' }}>
                    {teams.length === 0 ? <div style={{ color:'var(--dim)', fontSize:'.83rem' }}>No teams yet.</div>
                      : teams.map(t => (
                        <Form.Check key={t.id} id={`tc-${t.id}`} className="mb-1"
                          label={<span style={{ fontSize:'.88rem' }}>{t.name}</span>}
                          checked={addForm.team_ids.includes(t.id)}
                          onChange={() => toggleTeam(t.id)} />
                      ))}
                  </div>
                  <div style={{ fontSize:'.73rem', color:'var(--muted)', marginTop:'.2rem' }}>{addForm.team_ids.length} selected</div>
                </Form.Group>
                <button type="submit" className="btn btn-gold w-100">➕ Add Teams</button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <div className="cc">
            <div className="cc-head">📋 All Tournaments ({tours.length})</div>
            {tours.length === 0 ? <div className="empty"><span className="empty-icon">🏆</span>No tournaments yet.</div>
              : tours.map(t => (
                <div key={t.id} style={{ borderBottom:'1px solid var(--border)', padding:'.9rem 1.1rem' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1rem' }}>{t.name}</span>
                      <span style={{ color:'var(--dim)', fontSize:'.75rem', marginLeft:'.6rem' }}>{t.format}</span>
                    </div>
                    <button className="btn btn-outline-secondary btn-sm" style={{ fontSize:'.76rem', borderColor:'var(--border)', color:'var(--muted)' }} onClick={() => viewTeams(t.id)}>
                      {tourTeams[t.id] ? 'Hide' : '👁 Teams'}
                    </button>
                  </div>
                  {tourTeams[t.id] && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {tourTeams[t.id].length === 0
                        ? <span style={{ color:'var(--dim)', fontSize:'.8rem' }}>No teams assigned.</span>
                        : tourTeams[t.id].map(tm => (
                          <span key={tm.id} style={{ background:'var(--green-gl)', border:'1px solid var(--border)', borderRadius:6, padding:'2px 9px', fontSize:'.78rem', color:'var(--green)' }}>
                            🛡️ {tm.name}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Col>
      </Row>
    </>
  )
}
