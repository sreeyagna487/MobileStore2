import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { wishlist } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">Mobile Store</Link>
      <nav>
        {user ? (
          <>
            <NavLink to="/">Shop</NavLink>
            <NavLink to="/wishlist">Wishlist ({wishlist.length})</NavLink>
            <span className="muted">Hi, {user.name}</span>
            <button className="btn ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
