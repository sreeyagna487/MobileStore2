import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import MobileCard from '../components/MobileCard.jsx'
import MobileForm from '../components/MobileForm.jsx'

export default function Home() {
  const { mobiles, addMobile, updateMobile } = useStore()

  // search + filter state
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('All')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('none')

  // form state: null = hidden, {} = add, mobile object = edit
  const [editing, setEditing] = useState(null)

  const brands = useMemo(() => ['All', ...new Set(mobiles.map((m) => m.brand))], [mobiles])

  const results = useMemo(() => {
    let list = mobiles.filter((m) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || `${m.name} ${m.brand}`.toLowerCase().includes(q)
      const matchesBrand = brand === 'All' || m.brand === brand
      const matchesPrice = !maxPrice || m.price <= Number(maxPrice)
      return matchesSearch && matchesBrand && matchesPrice
    })
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [mobiles, search, brand, maxPrice, sort])

  const handleSubmit = (data) => {
  if (editing.id) updateMobile(editing.id, data)
  else addMobile(data)
  setEditing(null)
}
  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name or brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search mobiles"
        />
        <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filter by brand">
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Max price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maximum price"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="none">Sort: Default</option>
          <option value="low">Price: Low to high</option>
          <option value="high">Price: High to low</option>
        </select>
        <button className="btn primary" onClick={() => setEditing({})}>Add mobile</button>
      </div>

      {editing && (
  <MobileForm
    key={editing.id ?? 'new'}
    initial={editing.id ? editing : null}
    onSubmit={handleSubmit}
    onCancel={() => setEditing(null)}
  />
)}

      {results.length === 0 ? (
        <p className="empty">No mobiles match these filters. Clear the search or raise the max price.</p>
      ) : (
        <div className="grid">
          {results.map((m) => <MobileCard key={m.id} mobile={m} onEdit={setEditing} />)}
        </div>
      )}
    </>
  )
}

