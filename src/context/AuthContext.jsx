import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [role, setRole] = useState(() => localStorage.getItem('role') || null)

  const login = (userData, userRole, token) => {
    setUser(userData)
    setRole(userRole)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)
    if (token) sessionStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    sessionStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
