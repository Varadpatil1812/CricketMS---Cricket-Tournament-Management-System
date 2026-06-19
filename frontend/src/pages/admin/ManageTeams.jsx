import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Spinner } from 'react-bootstrap'
import api from '../../api/axios'

export default function ManageTeams() {
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState({ t: '', v: '' })
  const [loading, setLoading] = useState(false)

  const load = () => api.get('/teams').then(r => setTeams(r.data))
  useEffect(() => { load() }, [])

  const flash = (t, v = 'success') => { setMsg({ t, v }); setTimeout(() => setMsg({ t:'', v:'' }), 3500) }

  const submit = async e => {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/teams', { name })
      flash('Team created successfully!'); setName(''); load()
    } catch(e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🛡️ Manage Teams</h2>
        <p className="page-sub">Create teams — captain is assigned when you assign a player</p>
      </div>
      {msg.t && <Alert variant={msg.v} className="py-2 mb-3">{msg.t}</Alert>}
      <Row className="g-4">
        <Col lg={4}>
          <div className="cc">
            <div className="cc-head">➕ Create Team</div>
            <div className="cc-body">
              <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Team Name</Form.Label>
                  <Form.Control value={name} required placeholder="e.g. Mumbai Indians"
                    onChange={e => setName(e.target.value)} />
                </Form.Group>
                <div style={{ padding:'.6rem .75rem', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:6, fontSize:'.78rem', color:'var(--muted)', marginBottom:'1rem' }}>
                  ℹ️ Captain will be automatically set when you assign a player to this team from <strong>Assign Players</strong>.
                </div>
                <button type="submit" className="btn btn-g w-100" disabled={loading}>
                  {loading && <span className="spin" />} Create Team
                </button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <div className="cc">
            <div className="cc-head">📋 All Teams ({teams.length})</div>
            {teams.length === 0
              ? <div className="empty"><span className="empty-icon">🛡️</span>No teams yet.</div>
              : <table className="table ct mb-0">
                  <thead><tr><th>#</th><th>Team Name</th><th>Captain</th></tr></thead>
                  <tbody>
                    {teams.map((t, i) => (
                      <tr key={t.id}>
                        <td style={{ color:'var(--dim)' }}>{i + 1}</td>
                        <td><strong>{t.name}</strong></td>
                        <td>{t.captain_name
                          ? <span style={{ color:'var(--gold)' }}>👑 {t.captain_name}</span>
                          : <span style={{ color:'var(--dim)' }}>Not assigned</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
          </div>
        </Col>
      </Row>
    </>
  )
}
