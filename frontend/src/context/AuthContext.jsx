import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [ready, setReady]     = useState(false)  // NEW: loading flag

  useEffect(() => {
    try {
      const u = localStorage.getItem('user')
      if (u) setUser(JSON.parse(u))
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      setReady(true)   // done reading localStorage, guards can now run
    }
  }, [])

  const login = (u, t) => {
    setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <Ctx.Provider value={{
      user, ready, login, logout,
      isAdmin:  user?.role === 'admin',
      isPlayer: user?.role === 'player',
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)