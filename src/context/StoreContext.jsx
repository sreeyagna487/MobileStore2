import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

const seed = [
  { id: 1, name: 'Galaxy S24', brand: 'Samsung', price: 74999, ram: '8 GB', storage: '256 GB', image: '/images/galaxy-s24.jpg',
    description: 'A compact flagship with a bright display and strong cameras.',
    display: '6.2" Dynamic AMOLED 2X, 120 Hz', processor: 'Exynos 2400',
    camera: '50 MP + 12 MP ultrawide + 10 MP telephoto', frontCamera: '12 MP',
    battery: '4000 mAh', charging: '25W wired', os: 'Android 14 (One UI 6.1)',
    network: '5G', sim: 'Dual SIM (nano + eSIM)', weight: '167 g',
    colors: 'Onyx Black, Marble Gray, Cobalt Violet, Amber Yellow', launchYear: '2024', warranty: '1 year' },
  { id: 2, name: 'iPhone 15', brand: 'Apple', price: 79900, ram: '6 GB', storage: '128 GB', image: '/images/iphone-15.jpg',
    description: 'Apple’s everyday iPhone with a 48 MP main camera and USB-C.',
    display: '6.1" Super Retina XDR OLED, 60 Hz', processor: 'A16 Bionic',
    camera: '48 MP + 12 MP ultrawide', frontCamera: '12 MP',
    battery: '3349 mAh', charging: '20W wired (USB-C)', os: 'iOS 17',
    network: '5G', sim: 'Dual SIM (nano + eSIM)', weight: '171 g',
    colors: 'Black, Blue, Green, Yellow, Pink', launchYear: '2023', warranty: '1 year' },
  { id: 3, name: 'Pixel 8', brand: 'Google', price: 62999, ram: '8 GB', storage: '128 GB', image: '/images/pixel-8.jpg',
    description: 'Clean Android with Google’s AI camera features.',
    display: '6.2" Actua OLED, 120 Hz', processor: 'Google Tensor G3',
    camera: '50 MP + 12 MP ultrawide', frontCamera: '10.5 MP',
    battery: '4575 mAh', charging: '27W wired', os: 'Android 14',
    network: '5G', sim: 'Dual SIM (nano + eSIM)', weight: '187 g',
    colors: 'Obsidian, Hazel, Rose', launchYear: '2023', warranty: '1 year' },
  { id: 4, name: 'OnePlus 12', brand: 'OnePlus', price: 64999, ram: '12 GB', storage: '256 GB', image: '/images/oneplus-12.jpg',
    description: 'Flagship speed with a large battery and fast charging.',
    display: '6.82" LTPO AMOLED, 120 Hz, QHD+', processor: 'Snapdragon 8 Gen 3',
    camera: '50 MP + 48 MP ultrawide + 64 MP periscope', frontCamera: '32 MP',
    battery: '5400 mAh', charging: '100W wired', os: 'OxygenOS 14',
    network: '5G', sim: 'Dual nano SIM', weight: '220 g',
    colors: 'Silky Black, Flowy Emerald', launchYear: '2024', warranty: '1 year' },
  { id: 5, name: 'Redmi Note 13', brand: 'Xiaomi', price: 17999, ram: '8 GB', storage: '128 GB', image: '/images/redmi-note-13.jpg',
    description: 'A budget phone with a big AMOLED screen and a high-resolution camera.',
    display: '6.67" AMOLED, 120 Hz', processor: 'Dimensity 6080',
    camera: '108 MP + 2 MP', frontCamera: '16 MP',
    battery: '5000 mAh', charging: '33W wired', os: 'Android 13 (MIUI 14)',
    network: '5G', sim: 'Dual SIM', weight: '188 g',
    colors: 'Arctic White, Prism Gold, Stealth Black', launchYear: '2024', warranty: '1 year' },
]
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const [mobiles, setMobiles] = useState(() => read('ms_mobiles_v3', seed))
  const [wishlistByUser, setWishlistByUser] = useState(() => read('ms_wishlist', {}))

  useEffect(() => localStorage.setItem('ms_mobiles_v3', JSON.stringify(mobiles)), [mobiles])
  useEffect(() => localStorage.setItem('ms_wishlist', JSON.stringify(wishlistByUser)), [wishlistByUser])

  // ---- Mobile CRUD ----
  const addMobile = (m) => setMobiles((prev) => [{ ...m, id: Date.now() }, ...prev])
  const updateMobile = (id, changes) =>
    setMobiles((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  const deleteMobile = (id) => {
    setMobiles((prev) => prev.filter((m) => m.id !== id))
    setWishlistByUser((prev) =>
      Object.fromEntries(Object.entries(prev).map(([uid, ids]) => [uid, ids.filter((x) => x !== id)]))
    )
  }

  // ---- Wishlist (per user) ----
  const wishlist = user ? wishlistByUser[user.id] ?? [] : []
  const isWished = (id) => wishlist.includes(id)
  const toggleWish = (id) => {
    if (!user) return
    setWishlistByUser((prev) => {
      const current = prev[user.id] ?? []
      return { ...prev, [user.id]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] }
    })
  }

  return (
    <StoreContext.Provider
      value={{ mobiles, addMobile, updateMobile, deleteMobile, wishlist, isWished, toggleWish }}
    >
      {children}
    </StoreContext.Provider>
  )
}
