export const API = (import.meta.env.VITE_API_BASE || 'http://localhost:3000').replace(/\/$/, '')
export const WA_NUMBER = '923123875580'   /* 0312-3875580 — poory website ka WhatsApp isi number ka hai */
export const ORDER_WA_NUMBER = '923123875580'   /* 0312-3875580 — sab orders isi number par jati hain */
export const DELIVERY = 250
export const WA_ICON = 'https://cdn-icons-png.flaticon.com/128/5968/5968841.png'
export const FB_URL = 'https://www.facebook.com/profile.php?id=61586065381859'
/* Admin se upload ki gayi images ka path '/api/media/..' hota hai — isay backend address ke saath jodta hai */
export const assetUrl = u => (u && u.startsWith('/') ? API + u : u)
