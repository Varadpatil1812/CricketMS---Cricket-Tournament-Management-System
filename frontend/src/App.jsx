import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ViewerLayout from './components/ViewerLayout'

import LandingPage        from './pages/LandingPage'
import Login              from './pages/Login'
import Register           from './pages/Register'
import Teams              from './pages/Teams'
import PlayersPublic      from './pages/PlayersPublic'
import Tournaments        from './pages/Tournaments'
import Matches            from './pages/Matches'
import Dashboard          from './pages/Dashboard'
import PlayerMatches      from './pages/PlayerMatches'
import PlayerTournaments  from './pages/PlayerTournaments'
import ViewerOverview     from './pages/ViewerOverview'
import ManageTeams        from './pages/admin/ManageTeams'
import AssignPlayers      from './pages/admin/AssignPlayers'
import ManageTournaments  from './pages/admin/ManageTournaments'
import FixturesResults    from './pages/admin/FixturesResults'

/* ── Spinner shown while localStorage is being read ── */
function FullPageSpinner() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0d1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #21262d',
        borderTopColor: '#3fb950', borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }} />
    </div>
  )
}

/* ── Guards wait for ready before redirecting ── */
function RequireAdmin({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return <FullPageSpinner />
  if (!user)              return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function RequirePlayer({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return <FullPageSpinner />
  if (!user)               return <Navigate to="/login" replace />
  if (user.role !== 'player') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Viewer section */}
        <Route path="/viewer" element={<ViewerLayout />}>
          <Route index              element={<ViewerOverview />} />
          <Route path="teams"       element={<Teams />} />
          <Route path="players"     element={<PlayersPublic />} />
          <Route path="matches"     element={<Matches />} />
          <Route path="tournaments" element={<Tournaments />} />
        </Route>

        {/* Main app */}
        <Route element={<Layout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public */}
          <Route path="/teams"       element={<Teams />} />
          <Route path="/players-pub" element={<PlayersPublic />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/matches"     element={<Matches />} />

          {/* Player */}
          <Route path="/dashboard"      element={<RequirePlayer><Dashboard /></RequirePlayer>} />
          <Route path="/my-matches"     element={<RequirePlayer><PlayerMatches /></RequirePlayer>} />
          <Route path="/my-tournaments" element={<RequirePlayer><PlayerTournaments /></RequirePlayer>} />

          {/* Admin */}
          <Route path="/admin/teams"       element={<RequireAdmin><ManageTeams /></RequireAdmin>} />
          <Route path="/admin/players"     element={<RequireAdmin><AssignPlayers /></RequireAdmin>} />
          <Route path="/admin/tournaments" element={<RequireAdmin><ManageTournaments /></RequireAdmin>} />
          <Route path="/admin/fixtures"    element={<RequireAdmin><FixturesResults /></RequireAdmin>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}