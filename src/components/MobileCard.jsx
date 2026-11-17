import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function MobileCard({ mobile, onEdit, showAdminActions = true }) {
  const { isWished, toggleWish, deleteMobile } = useStore()
  const wished = isWished(mobile.id)

  return (
    <article className="card">
      <Link to={`/mobile/${mobile.id}`}>
        <img src={mobile.image || '/images/placeholder.png'} alt={mobile.name} />
      </Link>
      <div className="card-body">
        <p className="muted">{mobile.brand}</p>
        <h3>
          <Link to={`/mobile/${mobile.id}`} className="plain-link">{mobile.name}</Link>
        </h3>
        <p className="specs">{mobile.ram} RAM · {mobile.storage}</p>
        <p className="price">₹{Number(mobile.price).toLocaleString('en-IN')}</p>
        <div className="row">
          <button
            className={`btn ${wished ? 'primary' : ''}`}
            onClick={() => toggleWish(mobile.id)}
            aria-pressed={wished}
          >
            {wished ? 'Saved' : 'Save to wishlist'}
          </button>
          {showAdminActions && (
            <>
              <button className="btn ghost" onClick={() => onEdit(mobile)}>Edit</button>
              <button
                className="btn danger"
                onClick={() => window.confirm(`Delete ${mobile.name}?`) && deleteMobile(mobile.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}