import localImages from '../data/localImages.json'
export const API = (import.meta.env.VITE_API_BASE || 'http://localhost:3000').replace(/\/$/, '')
export const WA_NUMBER = '923123875580'   /* 0312-3875580 — poory website ka WhatsApp isi number ka hai */
export const ORDER_WA_NUMBER = '923123875580'   /* 0312-3875580 — sab orders isi number par jati hain */
export const DELIVERY = 500
export const WA_ICON = 'https://cdn-icons-png.flaticon.com/128/5968/5968841.png'
export const FB_URL = 'https://www.facebook.com/profile.php?id=61586065381859'
/* Admin se upload ki gayi images ka path '/api/media/..' hota hai — isay backend address ke saath jodta hai */
/* Bundled images: `npm run images` (ya build se pehle khud-ba-khud) har image ko public/img/ mein webp bana kar rakhta hai
   aur localImages.json mein original-URL -> /img/xxxx.webp likhta hai. Jo image code mein hai wo CDN se foran aati hai,
   jo nahi hai wo purane tareeqe se (DB / i.ibb.co) se. */
const LOCAL = /^\/(img|videos|fonts)\//
export const assetUrl = u => {
  if (!u || typeof u !== 'string') return u
  if (LOCAL.test(u)) return u
  const m = /^https?:\/\/[^/]+(\/api\/media\/[^?#]+)/.exec(u)
  const hit = localImages[m ? m[1] : u]
  if (hit) return hit
  if (u.startsWith('/')) return API + u
  /* DB mein purana backend address (localhost / vercel / purana render) save ho to bhi image current backend se aaye */
  return m ? API + m[1] : u
}
