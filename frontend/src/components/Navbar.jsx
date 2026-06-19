import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import logo from '../assets/vite.png';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <nav className="top-nav">
      <Link href="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={logo} alt="CricketMS" style={{ height: 40, width: 40, objectFit: "contain", borderRadius: "50%" }} />
                CricketMS
              </Link>
      <div className="nav-right">
        {user ? (
          <>
            <div className="user-pill">
              <div className="u-avatar">{initials}</div>
              <span className="u-name">{user.name}</span>
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
            <Link to="/login"><Button size="sm" variant="outline-secondary" style={{ fontSize: '.8rem', borderColor: 'var(--border)', color: 'var(--muted)' }}>Login</Button></Link>
            <Link to="/register"><Button size="sm" className="btn-g" style={{ fontSize: '.8rem' }}>Register</Button></Link>
          </>
        )}
      </div>
    </nav>
  )
}
