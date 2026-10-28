import { createContext, useContext, useEffect, useState } from 'react'
import { API, DELIVERY, WA_NUMBER, ORDER_WA_NUMBER } from '../lib/config'
import Loader from '../components/Loader'

/* PIN_FIRST: jin products ko Clinic Range mein sab se pehle dikhana hai unki id.
   65 = Power-X Neuro Drops, 1000 = Featured (main) product */
const PIN_FIRST = [65, 1000]
const pinFirst = list => [
  ...PIN_FIRST.map(id => list.find(p => p.id === id)).filter(Boolean),
  ...list.filter(p => !PIN_FIRST.includes(p.id)),
]

const INFO_KEY = 'rhc_customer_info'
const readInfo = () => { try { const s = localStorage.getItem(INFO_KEY); return s ? JSON.parse(s) : null } catch { return null } }
const writeInfo = i => { try { localStorage.setItem(INFO_KEY, JSON.stringify(i)) } catch { /* ignore */ } }

const openWA = (msg, num = WA_NUMBER) => {
  const a = document.createElement('a')
  a.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  a.target = '_blank'; a.rel = 'noopener'; a.click()
}

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)   // {src, alt} | null
  const [infoOpen, setInfoOpen] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState(false)
  const [info, setInfo] = useState(readInfo)
  const [settings, setSettings] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/products`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => { if (alive) { setProducts(pinFirst(d)); setStatus('ready') } })
      .catch(() => alive && setStatus('error'))
    fetch(`${API}/api/settings`).then(r => r.json()).then(d => alive && setSettings(d)).catch(() => {})
    return () => { alive = false }
  }, [])

  useEffect(() => { document.body.style.overflow = lightbox ? 'hidden' : '' }, [lightbox])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') { setLightbox(null); setCartOpen(false) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = id => {
    const p = products.find(x => x.id === id); if (!p) return
    setCart(c => c.some(i => i.id === id) ? c.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }])
    setCartOpen(true)
  }
  const changeQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0))
  const removeItem = id => setCart(c => c.filter(i => i.id !== id))

  const saveOrderToBackend = (i, items) => fetch(`${API}/api/orders`, {
    method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: i?.name, phone: i?.phone, address: i?.address || '', items: items.map(x => ({ _id: x._id, qty: x.qty })) }),
  }).then(r => r.ok).catch(() => false)

  /* Order direct jati hai: DB record (admin Orders tab) + WhatsApp 0312-3875580 par message ready.
     Note: WhatsApp khud-ba-khud bhejna platform-level rule ki wajah se possible nahi —
     lekin msg pehle se bana hota hai, customer sirf WhatsApp ke apne send par tap karta hai. */
  const doCheckout = async i => {
    const line = '\n--------------------------------\n'
    let m = '*Order - Riaz Homoeo Clinic*\n' + line
    if (i?.name) m += `*Name:* ${i.name}\n`
    if (i?.phone) m += `*Phone:* ${i.phone}\n`
    if (i?.address) m += `*Address:* ${i.address}\n`
    m += line + '*Products:*\n'
    cart.forEach(x => { m += `- ${x.name} x${x.qty} = ${x.price * x.qty} PKR\n` })
    m += `${line}Subtotal: ${subtotal} PKR\nDelivery: ${DELIVERY} PKR\n*Total: ${subtotal + DELIVERY} PKR*\n${line}Payment: Online Payment Easypaisa (0333-7189748)`
    setSending(true)
    await Promise.all([saveOrderToBackend(i, cart), new Promise(r => setTimeout(r, 900))])
    setSending(false)
    setCart([]); setCartOpen(false)
    openWA(m, ORDER_WA_NUMBER)
  }

  const checkout = () => {
    if (!cart.length) { alert('Cart khali hai — pehle koi product add karein'); return }
    if (!info?.name || !info?.phone) { setPendingCheckout(true); setInfoOpen(true); return }
    doCheckout(info)
  }
  const openInfoModal = (edit = false) => { setPendingCheckout(!edit); setInfoOpen(true) }
  const saveInfo = (name, phone, address) => {
    if (!name || !phone) { alert('Name aur Phone number zaroori hain'); return }
    const i = { name, phone, address }
    writeInfo(i); setInfo(i); setInfoOpen(false)
    if (pendingCheckout) { setPendingCheckout(false); doCheckout(i) }
  }
  const skipInfo = () => { setInfoOpen(false); if (pendingCheckout) { setPendingCheckout(false); doCheckout(info) } }

  const value = {
    products, status, cart, cartCount, subtotal, cartOpen, info, infoOpen, lightbox, settings, sending,
    addToCart, changeQty, removeItem, checkout, openWA,
    openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    openLightbox: (src, alt) => setLightbox({ src, alt }), closeLightbox: () => setLightbox(null),
    openInfoModal, saveInfo, skipInfo,
  }
  return <Ctx.Provider value={value}>{children}<Loader /></Ctx.Provider>
}
