import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const AUTH_PAGES = ['/login', '/register']

export default function Layout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isAuthPage = AUTH_PAGES.includes(pathname)

  // Auth pages render their own full-page design
  if (isAuthPage) return <Outlet />

  return (
    <>
      <Navbar />
      {user && <Sidebar />}
      <main className={`main${!user ? ' no-sb' : ''}`}>
        <Outlet />
      </main>
    </>
  )
}