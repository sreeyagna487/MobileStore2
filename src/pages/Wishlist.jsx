import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import MobileCard from '../components/MobileCard.jsx'

export default function Wishlist() {
  const { mobiles, wishlist } = useStore()
  const saved = mobiles.filter((m) => wishlist.includes(m.id))

  return (
    <>
      <h1>Your wishlist</h1>
      {saved.length === 0 ? (
        <p className="empty">Nothing saved yet. <Link to="/">Browse mobiles</Link> and tap "Save to wishlist".</p>
      ) : (
        <div className="grid">
          {saved.map((m) => <MobileCard key={m.id} mobile={m} showAdminActions={false} />)}
        </div>
      )}
    </>
  )
}
