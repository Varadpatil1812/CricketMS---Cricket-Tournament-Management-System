import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import logo from '../assets/vite.png'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <nav className="top-nav">
      {/* Hamburger — only visible on mobile when user is logged in */}
      {user && (
        <button className="hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      )}

      <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src={logo}
            alt="CricketMS"
            style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: '50%' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <span className="brand-text--lp">CricketMS</span>
        </Link>

      <div className="nav-right">
        {user ? (
          <>
            <div className="user-pill">
              <div className="u-avatar">{initials}</div>
              <span className="u-name u-name--hide">{user.name}</span>
              <span className={`role-chip ${user.role}`}>{user.role}</span>
            </div>
            <Button size="sm" variant="outline-secondary"
              style={{ fontSize: '.78rem', borderColor: 'var(--border)', color: 'var(--muted)' }}
              onClick={() => { logout(); nav('/login') }}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button size="sm" variant="outline-secondary"
                style={{ fontSize: '.8rem', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="btn-g" style={{ fontSize: '.8rem' }}>Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}