import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import logo from '../assets/vite.png';

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const r = await api.post('/auth/login', f)
      login(r.data.user, r.data.token)
      nav(r.data.user.role === 'admin' ? '/admin/teams' : '/dashboard')
    } catch (e) { setErr(e.response?.data?.message || 'Login failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" >
                              <img src={logo} alt="CricketMS" style={{ height: 40, width: 40, objectFit: "contain", borderRadius: "50%" }} />
                              CricketMS
                            </Link></div>
        <p className="auth-sub">Sign in to your account</p>
        {err && <Alert variant="danger" className="py-2">{err}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control type="email" value={f.email} required placeholder="you@email.com"
              onChange={e => setF({ ...f, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control type="password" value={f.password} required placeholder="••••••••"
              onChange={e => setF({ ...f, password: e.target.value })} />
          </Form.Group>
          <button type="submit" className="btn btn-g w-100 py-2" disabled={loading}>
            {loading && <span className="spin" />} Login
          </button>
        </Form>
        <div className="glow-div" />
        <p className="text-center mb-1" style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
          New player? <Link to="/register" style={{ color: 'var(--green)' }}>Register here</Link>
        </p>
        <p className="text-center mb-0" style={{ color: 'var(--dim)', fontSize: '.8rem' }}>
          👀 <Link to="/viewer" style={{ color: 'var(--dim)' }}>Browse as Viewer</Link>
        </p>
      </div>
    </div>
  )
}
