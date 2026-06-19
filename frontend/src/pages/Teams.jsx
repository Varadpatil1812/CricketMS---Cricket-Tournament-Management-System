import { useEffect, useState } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import api from '../api/axios'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/teams').then(r => setTeams(r.data)).finally(() => setLoading(false)) }, [])

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🛡️ Teams</h2>
        <p className="page-sub">All registered cricket teams</p>
      </div>
      {loading ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : teams.length === 0 ? <div className="empty"><span className="empty-icon">🛡️</span>No teams yet.</div>
        : (
          <Row className="g-3 stagger">
            {teams.map(t => (
              <Col md={4} sm={6} key={t.id}>
                <div className="cc h-100">
                  <div className="cc-head">🛡️ {t.name}</div>
                  <div className="cc-body">
                    {t.captain_name
                      ? <div style={{ fontSize: '.9rem' }}><span style={{ color: 'var(--gold)' }}>👑 Captain: </span><strong>{t.captain_name}</strong></div>
                      : <div style={{ color: 'var(--dim)', fontSize: '.85rem' }}>No captain assigned yet</div>}
                    <div style={{ color: 'var(--dim)', fontSize: '.75rem', marginTop: '.4rem' }}>Team #{t.id}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
    </>
  )
}
