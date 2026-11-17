import { createContext, useContext, useState } from 'react'

// Demo auth: users live in localStorage. Replace with real API calls later.
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('ms_session', null))

  const signup = ({ name, email, password }) => {
    const users = read('ms_users', [])
    if (users.some((u) => u.email === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = { id: crypto.randomUUID(), name, email: email.toLowerCase(), password }
    localStorage.setItem('ms_users', JSON.stringify([...users, newUser]))
    const session = { id: newUser.id, name, email: newUser.email }
    localStorage.setItem('ms_session', JSON.stringify(session))
    setUser(session)
  }

  const login = ({ email, password }) => {
    const found = read('ms_users', []).find(
      (u) => u.email === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Email or password is incorrect.')
    const session = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem('ms_session', JSON.stringify(session))
    setUser(session)
  }

  const logout = () => {
    localStorage.removeItem('ms_session')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
}
