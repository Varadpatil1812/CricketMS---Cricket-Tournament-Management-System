import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Spinner, Modal } from 'react-bootstrap'
import api from '../../api/axios'

/* ── Score Modal ── */
function ScoreModal({ match, onClose, onSaved, flash }) {
  const [f, setF] = useState({
    teamA_runs: '', teamA_wickets: '', teamA_overs: '',
    teamB_runs: '', teamB_wickets: '', teamB_overs: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(null)

  const calcPreview = (vals) => {
    const rA = parseInt(vals.teamA_runs), rB = parseInt(vals.teamB_runs)
    const wA = parseInt(vals.teamA_wickets ?? 0) || 0
    const wB = parseInt(vals.teamB_wickets ?? 0) || 0
    if (isNaN(rA) || isNaN(rB)) return setPreview(null)
    if (rA > rB)  return setPreview({ winner: match.teamA_name, reason: `${rA} > ${rB} runs` })
    if (rB > rA)  return setPreview({ winner: match.teamB_name, reason: `${rB} > ${rA} runs` })
    if (wA < wB)  return setPreview({ winner: match.teamA_name, reason: `fewer wickets lost (${wA} vs ${wB})` })
    if (wB < wA)  return setPreview({ winner: match.teamB_name, reason: `fewer wickets lost (${wB} vs ${wA})` })
    return setPreview({ winner: null, reason: 'Equal runs & wickets → Tie' })
  }

  const set = (key, val) => { const n = { ...f, [key]: val }; setF(n); calcPreview(n) }

  const submit = async e => {
    e.preventDefault()
    if (!f.teamA_runs || !f.teamB_runs) return flash('Runs are required for both teams.', 'warning')
    setSubmitting(true)
    try {
      await api.put(`/matches/${match.id}/result`, {
        teamA_runs:    parseInt(f.teamA_runs),
        teamA_wickets: parseInt(f.teamA_wickets) || 0,
        teamA_overs:   f.teamA_overs ? parseFloat(f.teamA_overs) : null,
        teamB_runs:    parseInt(f.teamB_runs),
        teamB_wickets: parseInt(f.teamB_wickets) || 0,
        teamB_overs:   f.teamB_overs ? parseFloat(f.teamB_overs) : null,
      })
      flash('Result saved! Winner decided automatically.')
      onSaved()
    } catch (e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
    finally { setSubmitting(false) }
  }

  const inputStyle = {
    background: '#1a2535',
    border: '1px solid #2d3d52',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '10px 14px',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color .15s',
  }
  const labelStyle = { fontSize: '.78rem', color: '#64748b', marginBottom: 6, display: 'block' }

  return (
    <Modal show onHide={onClose} centered size="md">
      <div style={{ background: '#0f1e2e', border: '1px solid #1e3a5f', borderRadius: 12, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #1a2840', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#f1f5f9' }}>
            Enter Match Score
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 8px' }}>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px' }}>

              {/* Team A */}
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#10b981', marginBottom: 16 }}>
                  {match.teamA_name}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Runs</label>
                  <input type="number" min={0} style={inputStyle} value={f.teamA_runs}
                    onChange={e => set('teamA_runs', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#10b981'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Wickets</label>
                  <input type="number" min={0} max={10} style={inputStyle} value={f.teamA_wickets}
                    onChange={e => set('teamA_wickets', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#10b981'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
                <div>
                  <label style={labelStyle}>Overs</label>
                  <input type="number" min={0} step="0.1" style={inputStyle} value={f.teamA_overs}
                    onChange={e => set('teamA_overs', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#10b981'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ background: '#1a2840', margin: '0 4px' }} />

              {/* Team B */}
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#58a6ff', marginBottom: 16 }}>
                  {match.teamB_name}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Runs</label>
                  <input type="number" min={0} style={inputStyle} value={f.teamB_runs}
                    onChange={e => set('teamB_runs', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#58a6ff'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Wickets</label>
                  <input type="number" min={0} max={10} style={inputStyle} value={f.teamB_wickets}
                    onChange={e => set('teamB_wickets', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#58a6ff'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
                <div>
                  <label style={labelStyle}>Overs</label>
                  <input type="number" min={0} step="0.1" style={inputStyle} value={f.teamB_overs}
                    onChange={e => set('teamB_overs', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#58a6ff'}
                    onBlur={e => e.target.style.borderColor = '#2d3d52'} />
                </div>
              </div>
            </div>

            {/* Live winner preview */}
            {preview && (
              <div style={{
                marginTop: 16, padding: '10px 14px', borderRadius: 8,
                background: preview.winner ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)',
                border: `1px solid ${preview.winner ? 'rgba(16,185,129,.3)' : 'rgba(245,158,11,.3)'}`,
                fontSize: '.83rem', display: 'flex', alignItems: 'center', gap: 8,
                animation: 'fadeIn .2s ease',
              }}>
                <span>{preview.winner ? '🏆' : '🤝'}</span>
                {preview.winner
                  ? <span><strong style={{ color: '#10b981' }}>{preview.winner}</strong> wins — <span style={{ color: '#64748b' }}>{preview.reason}</span></span>
                  : <span style={{ color: '#f59e0b' }}>{preview.reason}</span>}
              </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: '1px solid #1a2840', marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '.9rem' }}>
                Cancel
              </button>
              <button type="submit"
                style={{
                  background: '#10b981', border: 'none', color: '#fff', borderRadius: 8,
                  padding: '10px 28px', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
                  opacity: submitting ? .7 : 1,
                }}
                disabled={submitting}>
                {submitting && <span className="spin" />} Save Result
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

/* ── Main Page ── */
export default function FixturesResults() {
  const [tours, setTours]             = useState([])
  const [selTour, setSelTour]         = useState('')
  const [matches, setMatches]         = useState([])
  const [msg, setMsg]                 = useState({ t: '', v: '' })
  const [generating, setGenerating]   = useState(false)
  const [activeMatch, setActiveMatch] = useState(null)
  const [loadingM, setLoadingM]       = useState(false)

  useEffect(() => { api.get('/tournaments').then(r => setTours(r.data)) }, [])

  const flash = (t, v = 'success') => { setMsg({ t, v }); setTimeout(() => setMsg({ t: '', v: '' }), 4000) }

  const loadMatches = tid => {
    if (!tid) return; setLoadingM(true); setActiveMatch(null)
    api.get(`/matches/tournament/${tid}`).then(r => setMatches(r.data)).finally(() => setLoadingM(false))
  }

  const handleTour = e => { setSelTour(e.target.value); setMatches([]); loadMatches(e.target.value) }

  const generate = async () => {
    if (!selTour) return flash('Select a tournament first.', 'warning')
    setGenerating(true)
    try {
      const r = await api.post(`/matches/generate/${selTour}`)
      flash(`${r.data.count} fixtures generated!`); loadMatches(selTour)
    } catch (e) { flash(e.response?.data?.message || 'Failed.', 'danger') }
    finally { setGenerating(false) }
  }

  const fmt = (runs, wkts, overs) => {
    if (runs == null) return '—'
    let s = `${runs}/${wkts ?? '?'}`
    if (overs != null) s += ` (${overs}ov)`
    return s
  }

  const upcoming  = matches.filter(m => m.status === 'upcoming')
  const completed = matches.filter(m => m.status !== 'upcoming')

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">⚡ Fixtures & Results</h2>
        <p className="page-sub">Generate round-robin fixtures and enter match results</p>
      </div>

      {msg.t && <Alert variant={msg.v} className="py-2 mb-3">{msg.t}</Alert>}

      <div className="cc mb-4">
        <div className="cc-body">
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Label className="form-label">Select Tournament</Form.Label>
              <Form.Select value={selTour} onChange={handleTour}>
                <option value="">-- Choose Tournament --</option>
                {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={4}>
              <button className="btn btn-g" onClick={generate} disabled={generating || !selTour}>
                {generating ? <span className="spin" /> : '⚡ '}Generate Round-Robin Fixtures
              </button>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: '.76rem', color: 'var(--muted)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '.45rem .7rem' }}>
                ℹ️ Each team plays every other team once
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {loadingM && <div className="text-center py-4"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>}

      {!loadingM && upcoming.length > 0 && (
        <div className="mb-4">
          <h5 className="rj mb-2" style={{ color: 'var(--text)' }}>🕐 Upcoming ({upcoming.length})</h5>
          {upcoming.map(m => (
            <div className="fix-card" key={m.id}>
              <div className="fix-team text-end">{m.teamA_name}</div>
              <div className="fix-vs">VS</div>
              <div className="fix-team">{m.teamB_name}</div>
              <span className="b-upcoming ms-auto me-2">upcoming</span>
              <button className="btn btn-g btn-sm" onClick={() => setActiveMatch(m)}>✏️ Enter Score</button>
            </div>
          ))}
        </div>
      )}

      {!loadingM && completed.length > 0 && (
        <div>
          <h5 className="rj mb-2" style={{ color: 'var(--text)' }}>✅ Completed ({completed.length})</h5>
          {completed.map(m => (
            <div className="fix-card" key={m.id}>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div className={`fix-team ${m.winner_name === m.teamA_name ? 'win' : ''}`}>{m.teamA_name}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{fmt(m.teamA_runs, m.teamA_wickets, m.teamA_overs)}</div>
              </div>
              <div className="text-center" style={{ minWidth: 60 }}>
                <div className="fix-vs mb-1">VS</div>
                <span className={m.status === 'tie' ? 'b-tie' : 'b-completed'}>{m.status}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className={`fix-team ${m.winner_name === m.teamB_name ? 'win' : ''}`}>{m.teamB_name}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{fmt(m.teamB_runs, m.teamB_wickets, m.teamB_overs)}</div>
              </div>
              <div className="ms-auto text-end" style={{ minWidth: 110 }}>
                {m.winner_name
                  ? <div style={{ fontSize: '.82rem' }}>🏆 <strong style={{ color: 'var(--green)' }}>{m.winner_name}</strong></div>
                  : <div style={{ fontSize: '.82rem', color: 'var(--gold)' }}>🤝 Tied</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingM && selTour && matches.length === 0 && (
        <div className="empty"><span className="empty-icon">📅</span>No fixtures yet. Click Generate above.</div>
      )}
      {!selTour && !loadingM && (
        <div className="empty"><span className="empty-icon">⬆️</span>Select a tournament to manage fixtures.</div>
      )}

      {activeMatch && (
        <ScoreModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
          onSaved={() => { setActiveMatch(null); loadMatches(selTour) }}
          flash={flash}
        />
      )}
    </>
  )
}
