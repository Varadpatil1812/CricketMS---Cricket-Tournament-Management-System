import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../pages/LandingPage.css'

const L = ({ to, icon, label }) => (
  <li>
    <NavLink to={to} end className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
      <span className="sb-icon">{icon}</span> {label}
    </NavLink>
  </li>
)

export default function ViewerLayout() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── SAME NAV AS LANDING PAGE ── */}
      <nav className="lp-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/src/assets/vite.png"
            alt="CricketMS"
            style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: '50%' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          CricketMS
        </Link>

        <div className="lp-nav-links">
          {/* Viewer badge */}
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

      {/* ── SIDEBAR ── */}
      <aside className="sidebar" style={{ top: 64 }}>
        <div className="sb-section">Browse</div>
        <ul className="sb-list">
          <L to="/viewer"             icon="🏠" label="Overview" />
          <L to="/viewer/teams"       icon="🛡️" label="Teams" />
          <L to="/viewer/players"     icon="👥" label="Players" />
          <L to="/viewer/matches"     icon="📅" label="Match History" />
          <L to="/viewer/tournaments" icon="🏆" label="Tournaments" />
        </ul>
      </aside>

      {/* ── CONTENT ── */}
      <main className="main" style={{ marginTop: 64 }}>
        <Outlet />
      </main>
    </div>
  )
}