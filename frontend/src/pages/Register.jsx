import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert } from 'react-bootstrap'
import api from '../api/axios'
import logo from '../assets/vite.png';

const ROLES = [
  { value: 'batsman',       label: '🏏 Batsman',        desc: 'Top order run scorer' },
  { value: 'bowler',        label: '⚡ Bowler',          desc: 'Takes wickets & restricts runs' },
  { value: 'all-rounder',   label: '⭐ All-Rounder',     desc: 'Bats and bowls effectively' },
  { value: 'wicket-keeper', label: '🧤 Wicket-Keeper',  desc: 'Keeper and lower order bat' },
]

export default function Register() {
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', player_role: '' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setErr(''); setOk(''); setLoading(true)
    if (!f.player_role) { setErr('Please select your playing role.'); setLoading(false); return }
    try {
      await api.post('/auth/register', f)
      setOk('Registered! Redirecting to login...')
      setTimeout(() => nav('/login'), 1500)
    } catch (e) { setErr(e.response?.data?.message || 'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo"><Link to="/" >
                    <img src={logo} alt="CricketMS" style={{ height: 40, width: 40, objectFit: "contain", borderRadius: "50%" }} />
                    CricketMS
                  </Link></div>
        <p className="auth-sub">Create your player account</p>
        {err && <Alert variant="danger" className="py-2 mb-3">{err}</Alert>}
        {ok  && <Alert variant="success" className="py-2 mb-3">{ok}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Full Name</Form.Label>
            <Form.Control value={f.name} required placeholder="Virat Kohli"
              onChange={e => setF({ ...f, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control type="email" value={f.email} required placeholder="you@email.com"
              onChange={e => setF({ ...f, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control type="password" value={f.password} required placeholder="Min 6 characters" minLength={6}
              onChange={e => setF({ ...f, password: e.target.value })} />
          </Form.Group>

          {/* Role selector cards */}
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Your Playing Role</Form.Label>
            <div className="row g-2 mt-1">
              {ROLES.map(r => (
                <div className="col-6" key={r.value}>
                  <div
                    onClick={() => setF({ ...f, player_role: r.value })}
                    style={{
                      background: f.player_role === r.value ? 'var(--green-gl)' : 'var(--bg3)',
                      border: `1px solid ${f.player_role === r.value ? 'var(--green)' : 'var(--border)'}`,
                      borderRadius: 8, padding: '.6rem .8rem', cursor: 'pointer',
                      transition: 'all .15s',
                      boxShadow: f.player_role === r.value ? '0 0 10px var(--green-gl)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '.92rem', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>{r.label}</div>
                    <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 2 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Form.Group>

          <button type="submit" className="btn btn-g w-100 py-2" disabled={loading}>
            {loading && <span className="spin" />} Create Account
          </button>
        </Form>
        <div className="glow-div" />
        <p className="text-center mb-0" style={{ color: 'var(--muted)', fontSize: '.84rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--green)' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
