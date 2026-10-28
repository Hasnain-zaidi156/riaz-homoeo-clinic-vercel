import { useEffect, useState } from 'react'

/* Tiny History-API router — koi nayi dependency nahi.
   Product URL: /product/65-power-x-neuro-drops  (id + slug). Sirf id se match hota hai. */
const EVT = 'app:navigate'

const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
export const productPath = p => `/product/${p.id}${slug(p.name) ? '-' + slug(p.name) : ''}`
export const parseProductId = path => {
  const m = /^\/product\/(\d+)/.exec(path || '')
  return m ? Number(m[1]) : null
}

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search) return
  window.history[replace ? 'replaceState' : 'pushState']({ app: true }, '', to)
  window.dispatchEvent(new Event(EVT))
}

/* In-app navigation se aaye ho to browser back; direct link/refresh par home par bhejo */
export function goBackOrHome() {
  if (window.history.state && window.history.state.app) window.history.back()
  else {
    navigate('/', { replace: true })
    setTimeout(() => document.getElementById('products')?.scrollIntoView(), 0)
  }
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    window.addEventListener(EVT, sync)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener(EVT, sync) }
  }, [])
  return path
}
