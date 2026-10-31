/* Images ko code mein rakhta hai (sirf database / i.ibb.co par depend nahi).

   Kya karta hai:
   1. Live API se products, settings, gallery ka data lata hai (VITE_API_BASE)
   2. Har image download karke chhota WEBP banata hai  ->  public/img/<hash>.webp
   3. src/data/localImages.json  : original URL  ->  /img/<hash>.webp   (assetUrl() isi ko use karta hai)
   4. src/data/snapshot.json     : products + settings + gallery ka copy (site pehli visit par bhi foran khulti hai)

   Chalane ka tareeqa:   npm run images          (build se pehle "prebuild" mein khud bhi chalta hai)
   Ye script kabhi build fail nahi karti — koi masla ho to purana tareeqa (DB / remote URL) chalta rehta hai. */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMG_DIR = path.join(ROOT, 'public', 'img')
const MAP_FILE = path.join(ROOT, 'src', 'data', 'localImages.json')
const SNAP_FILE = path.join(ROOT, 'src', 'data', 'snapshot.json')
const MAX_W = 1200       // px — lightbox ke liye kaafi, phone par bhi halki
const QUALITY = 78

const log = (...a) => console.log('[images]', ...a)
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return d } }

/* API address: env -> .env file -> --api=... */
function apiBase() {
  const arg = process.argv.find(a => a.startsWith('--api='))
  if (arg) return arg.slice(6).replace(/\/$/, '')
  if (process.env.VITE_API_BASE) return process.env.VITE_API_BASE.replace(/\/$/, '')
  try {
    const m = /^VITE_API_BASE=(.+)$/m.exec(fs.readFileSync(path.join(ROOT, '.env'), 'utf8'))
    if (m) return m[1].trim().replace(/\/$/, '')
  } catch { /* no .env */ }
  return 'http://localhost:3000'
}
const API = apiBase()

const sleep = ms => new Promise(r => setTimeout(r, ms))
async function getJSON(url, tries = 5, timeout = 25000) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(timeout) })
      if (r.ok) return await r.json()
    } catch { /* server so raha ho sakta hai (free Render) — dobara */ }
    if (i < tries - 1) await sleep(3000)
  }
  return null
}

/* Key: '/api/media/<id>/file' (DB image, chahe purana host ho) ya poora URL — assetUrl() bhi yahi key banata hai */
const keyOf = u => {
  if (typeof u !== 'string') return null
  const m = /^https?:\/\/[^/]+(\/api\/media\/[^?#]+)/.exec(u)
  if (m) return m[1]
  if (u.startsWith('/api/media/')) return u
  return /^https?:\/\//.test(u) ? u : null
}
const fetchUrlOf = key => (key.startsWith('/') ? API + key : key)
const fileOf = key => crypto.createHash('sha1').update(key).digest('hex').slice(0, 12) + '.webp'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) walk(p, out)
    else if (/\.(jsx?|css)$/.test(f.name)) out.push(p)
  }
  return out
}

async function main() {
  let sharp
  try { sharp = (await import('sharp')).default } catch { log('sharp install nahi hai (npm install karein) — skip'); return }

  fs.mkdirSync(IMG_DIR, { recursive: true })
  const map = readJSON(MAP_FILE, {})
  const keys = new Set()
  const add = u => { const k = keyOf(u); if (k) keys.add(k) }

  /* 1) Live data */
  log('API:', API)
  const [products, settings, gallery] = await Promise.all([
    getJSON(`${API}/api/products`),
    getJSON(`${API}/api/settings`, 3),
    getJSON(`${API}/api/gallery`, 3),
  ])
  const live = Array.isArray(products) && products.length > 0
  if (live) {
    products.forEach(p => { add(p.img); (Array.isArray(p.imgs) ? p.imgs : []).forEach(add) })
    if (settings && typeof settings === 'object') Object.entries(settings).forEach(([k, v]) => { if (/img$/i.test(k)) add(v) })
    if (Array.isArray(gallery)) gallery.filter(g => g && !g.isVideo).forEach(g => add(g.url))
    log(`live data mila: ${products.length} products, ${Array.isArray(gallery) ? gallery.length : 0} gallery items`)
  } else {
    log('API se data nahi mila — sirf code mein likhe images + purani seed files use hongi')
    const seedP = readJSON(path.join(ROOT, '..', 'backend', 'products.json'), [])
    seedP.forEach(p => { add(p.img); (Array.isArray(p.imgs) ? p.imgs : []).forEach(add) })
    readJSON(path.join(ROOT, '..', 'backend', 'gallery.json'), []).forEach(add)
  }

  /* 2) Code mein hardcoded image URLs (hero/logo defaults, gallery.js, ...) */
  for (const f of walk(path.join(ROOT, 'src'))) {
    const txt = fs.readFileSync(f, 'utf8')
    for (const m of txt.matchAll(/https:\/\/i\.ibb\.co\/[A-Za-z0-9_\-./%]+\.(?:png|jpe?g|webp)/gi)) add(m[0])
  }

  /* 3) Download + optimize */
  const list = [...keys]
  const todo = list.filter(k => !(map[k] && fs.existsSync(path.join(ROOT, 'public', map[k]))))
  log(`${list.length} images, ${list.length - todo.length} pehle se code mein, ${todo.length} nayi`)
  let ok = 0, fail = 0, bytesIn = 0, bytesOut = 0
  const worker = async () => {
    while (todo.length) {
      const key = todo.shift()
      const url = fetchUrlOf(key)
      let done = false
      for (let t = 0; t < 3 && !done; t++) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(45000) })
          if (!r.ok) throw new Error('HTTP ' + r.status)
          const ct = r.headers.get('content-type') || ''
          if (!/^image\//.test(ct) || /gif|svg/.test(ct)) throw new Error('skip type ' + ct)
          const buf = Buffer.from(await r.arrayBuffer())
          const out = await sharp(buf).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer()
          const name = fileOf(key)
          fs.writeFileSync(path.join(IMG_DIR, name), out)
          map[key] = '/img/' + name
          bytesIn += buf.length; bytesOut += out.length; ok++; done = true
        } catch (e) {
          if (t === 2) { fail++; log('skip:', key.slice(0, 80), '-', e.message) } else await sleep(1500)
        }
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker))
  if (ok) log(`${ok} images optimize hui: ${(bytesIn / 1048576).toFixed(1)} MB -> ${(bytesOut / 1048576).toFixed(1)} MB`)
  if (fail) log(`${fail} images download nahi hui (wo purane tareeqe se hi load hongi)`)

  /* 4) Map likhein (sirf wahi jin ki file maujood hai) */
  const clean = {}
  for (const [k, v] of Object.entries(map)) if (fs.existsSync(path.join(ROOT, 'public', v))) clean[k] = v
  fs.writeFileSync(MAP_FILE, JSON.stringify(clean, null, 1) + '\n')

  /* 5) Snapshot + purani/bekaar files saaf (sirf jab live data mila ho) */
  if (live) {
    fs.writeFileSync(SNAP_FILE, JSON.stringify({
      generatedAt: new Date().toISOString(),
      products,
      settings: settings && typeof settings === 'object' ? settings : null,
      gallery: Array.isArray(gallery) ? gallery : [],
    }))
    const used = new Set(list.map(k => clean[k] && path.basename(clean[k])).filter(Boolean))
    for (const f of fs.readdirSync(IMG_DIR)) if (f.endsWith('.webp') && !used.has(f)) fs.unlinkSync(path.join(IMG_DIR, f))
    for (const k of Object.keys(clean)) if (!keys.has(k)) delete clean[k]
    fs.writeFileSync(MAP_FILE, JSON.stringify(clean, null, 1) + '\n')
    log('snapshot.json update ho gaya')
  }
  log('done —', Object.keys(clean).length, 'images code mein')
}

main().catch(e => log('error (build chalta rahega):', e.message))
