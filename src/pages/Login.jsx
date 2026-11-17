import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const submit = (e) => {
    e.preventDefault()
    try {
      login(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h1>Log in</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Email
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </label>
      <label>Password
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </label>
      <button className="btn primary" type="submit">Log in</button>
      <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
    </form>
  )
}
