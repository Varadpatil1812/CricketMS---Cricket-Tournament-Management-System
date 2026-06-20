import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom'

const L = ({ to, icon, label, onClick }) => (
  <li>
    <NavLink to={to} end onClick={onClick}
      className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
      <span className="sb-icon">{icon}</span> {label}
    </NavLink>
  </li>
)

export default function ViewerLayout() {
  const nav = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Close on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── NAVBAR — same as landing page ── */}
      <nav className="lp-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu"
          style={{ display: 'flex', marginRight: '.5rem' }}>
          <span /><span /><span />
        </button>

        <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/src/assets/vite.png"
            alt="CricketMS"
            style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: '50%' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <span className="brand-text--lp">CricketMS</span>
        </Link>

        <div className="lp-nav-links">
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20,
            background: 'rgba(88,166,255,.1)', color: '#58a6ff',
            border: '1px solid rgba(88,166,255,.25)',
          }}>
            👀 Viewer
          </span>
          <Link to="/login"    className="lp-btn-outline">Login</Link>
          <Link to="/register" className="lp-btn-green">Get Started</Link>
        </div>
      </nav>

      {/* Overlay */}
      {open && <div className="sb-overlay" onClick={() => setOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} style={{ top: 64 }}>
        <button className="sb-close" onClick={() => setOpen(false)}>✕</button>

        <div className="sb-section">Browse</div>
        <ul className="sb-list">
          <L to="/viewer"             icon="🏠" label="Overview"     onClick={() => setOpen(false)} />
          <L to="/viewer/teams"       icon="🛡️" label="Teams"        onClick={() => setOpen(false)} />
          <L to="/viewer/players"     icon="👥" label="Players"      onClick={() => setOpen(false)} />
          <L to="/viewer/matches"     icon="📅" label="Match History" onClick={() => setOpen(false)} />
          <L to="/viewer/tournaments" icon="🏆" label="Tournaments"  onClick={() => setOpen(false)} />
        </ul>
      </aside>

      {/* ── CONTENT ── */}
      <main className="main" style={{ marginTop: 0, paddingTop: 'calc(64px + 1.75rem)' }}>
        <Outlet />
      </main>
    </div>
  )
}