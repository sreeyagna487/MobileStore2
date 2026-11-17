import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function MobileDetails() {
  const { id } = useParams()
  const { mobiles, isWished, toggleWish } = useStore()
  const mobile = mobiles.find((m) => String(m.id) === id)

  if (!mobile) {
    return (
      <p className="empty">
        This mobile no longer exists. <Link to="/">Back to the shop</Link>
      </p>
    )
  }

  const wished = isWished(mobile.id)

  // Only rows that have a value are shown, so phones added from the form still work
  const specs = [
    ['Brand', mobile.brand],
    ['RAM', mobile.ram],
    ['Storage', mobile.storage],
    ['Display', mobile.display],
    ['Processor', mobile.processor],
    ['Camera', mobile.camera],
    ['Battery', mobile.battery],
    ['Operating system', mobile.os],
  ].filter(([, value]) => value)

  return (
    <>
      <Link to="/" className="back">← Back to the shop</Link>
      <div className="details">
        <img src={mobile.image || '/images/placeholder.png'} alt={mobile.name} />
        <div>
          <p className="muted">{mobile.brand}</p>
          <h1>{mobile.name}</h1>
          <p className="price big">₹{Number(mobile.price).toLocaleString('en-IN')}</p>
          {mobile.description && <p>{mobile.description}</p>}

          <button
            className={`btn ${wished ? 'primary' : ''}`}
            onClick={() => toggleWish(mobile.id)}
            aria-pressed={wished}
          >
            {wished ? 'Saved to wishlist' : 'Save to wishlist'}
          </button>

          <table className="spec-table">
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}