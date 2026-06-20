import { useState } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const AUTH_PAGES = ['/login', '/register']

export default function Layout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (AUTH_PAGES.includes(pathname)) return <Outlet />

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      {user && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <main className={`main${!user ? ' no-sb' : ''}`}>
        <Outlet />
      </main>
    </>
  )
}