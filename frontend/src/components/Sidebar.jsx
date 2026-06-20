import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const L = ({ to, icon, label, onClick }) => (
  <li>
    <NavLink to={to} onClick={onClick}
      className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
      <span className="sb-icon">{icon}</span> {label}
    </NavLink>
  </li>
)

export default function Sidebar({ open, onClose }) {
  const { isAdmin, isPlayer } = useAuth()
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => { onClose?.() }, [location.pathname])

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Overlay — mobile only */}
      {open && (
        <div className="sb-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        {/* Close button inside sidebar on mobile */}
        <button className="sb-close" onClick={onClose} aria-label="Close menu">✕</button>

        {isPlayer && (<>
          <div className="sb-section">My Account</div>
          <ul className="sb-list">
            <L to="/dashboard"      icon="📊" label="Dashboard"      onClick={onClose} />
            <L to="/my-matches"     icon="🏏" label="My Matches"     onClick={onClose} />
            <L to="/my-tournaments" icon="🏆" label="My Tournaments" onClick={onClose} />
          </ul>
        </>)}

        {isAdmin && (<>
          <div className="sb-section">Admin</div>
          <ul className="sb-list">
            <L to="/admin/teams"       icon="🛡️" label="Manage Teams"       onClick={onClose} />
            <L to="/admin/players"     icon="👤" label="Assign Players"      onClick={onClose} />
            <L to="/admin/tournaments" icon="🏆" label="Tournaments"         onClick={onClose} />
            <L to="/admin/fixtures"    icon="⚡" label="Fixtures & Results"  onClick={onClose} />
          </ul>
        </>)}
      </aside>
    </>
  )
}