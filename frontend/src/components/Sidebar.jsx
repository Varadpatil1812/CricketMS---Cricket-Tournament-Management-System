import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const L = ({ to, icon, label }) => (
  <li>
    <NavLink to={to} className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
      <span className="sb-icon">{icon}</span> {label}
    </NavLink>
  </li>
)

export default function Sidebar() {
  const { isAdmin, isPlayer } = useAuth()
  return (
    <aside className="sidebar">
      {/* <div className="sb-section">Public</div>
      <ul className="sb-list">
        <L to="/teams"       icon="🛡️" label="Teams" />
        <L to="/players-pub" icon="👥" label="Players" />
        <L to="/matches"     icon="📅" label="Match History" />
        <L to="/tournaments" icon="🏆" label="Tournaments" />
        
        
      </ul> */}

      {isPlayer && (<>
        <div className="sb-section">My Account</div>
        <ul className="sb-list">
          <L to="/dashboard"      icon="📊" label="Dashboard" />
          <L to="/my-matches"     icon="🏏" label="My Matches" />
          <L to="/my-tournaments" icon="🏆" label="My Tournaments" />
        </ul>
      </>)}

      {isAdmin && (<>
        <div className="sb-section">Admin</div>
        <ul className="sb-list">
          <L to="/admin/teams"       icon="🛡️" label="Manage Teams" />
          <L to="/admin/players"     icon="👤" label="Assign Players" />
          <L to="/admin/tournaments" icon="🏆" label="Tournaments" />
          <L to="/admin/fixtures"    icon="⚡" label="Fixtures & Results" />
          <L to="/matches"     icon="📅" label="Match History" />
          <L to="/tournaments" icon="🏆" label="Tournaments" />
        </ul>
      </>)}
    </aside>
  )
}
