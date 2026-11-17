import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    try {
      signup(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h1>Create account</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Name<input name="name" value={form.name} onChange={set} required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={set} required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={set} required /></label>
      <label>Confirm password<input name="confirm" type="password" value={form.confirm} onChange={set} required /></label>
      <button className="btn primary" type="submit">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  )
}
