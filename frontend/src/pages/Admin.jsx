import { useCallback, useEffect, useState } from 'react'
import { API } from '../lib/config'
import { Bag, Comment, ExternalLink, Grid, ImageIcon, LogOut, Menu, Package, Plus } from '../components/Icons'
import { ToastProvider, useToast } from './admin/ui'
import MediaPicker from './admin/MediaPicker'
import Products from './admin/Products'
import { Comments, GalleryView, Orders, Overview, SiteImages } from './admin/Views'
import '../admin.css'

const NAV = [
  ['overview', 'Overview', Grid, 'Today at a glance'],
  ['orders', 'Orders', Bag, 'Customer orders and delivery status'],
  ['products', 'Products', Package, 'Prices, stock and product images'],
  ['comments', 'Comments', Comment, 'Everything visitors have written'],
  ['gallery', 'Gallery', ImageIcon, 'Images shown on the website'],
]
const ENDPOINT = { orders: 'admin/orders', products: 'products', comments: 'admin/comments', media: 'admin/media' }

function Login({ onToken }) {
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true)
    const body = Object.fromEntries(new FormData(e.target))
    try {
      const r = await fetch(`${API}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) setErr(d.error || 'Sign in failed')
      else { sessionStorage.setItem('tk', d.token); onToken(d.token) }
    } catch { setErr('Cannot reach the server. Check that the backend is running.') }
    setBusy(false)
  }
  return (
    <div className="adm adm-login-wrap">
      <form className="adm-login" onSubmit={submit}>
        <div className="adm-brand dark"><span className="adm-logo">R</span><div><b>Riaz Homoeo Clinic</b><small>Admin panel</small></div></div>
        <h1>Sign in</h1>
        <label>Username<input className="adm-input" name="user" autoComplete="username" required autoFocus /></label>
        <label>Password<input className="adm-input" name="pass" type="password" autoComplete="current-password" required /></label>
        {err && <p className="adm-form-err" role="alert">{err}</p>}
        <button className="adm-btn primary lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

function Panel({ token, logout }) {
  const toast = useToast()
  const [tab, setTab] = useState(() => location.hash.slice(1) || 'overview')
  const [d, setD] = useState({ orders: null, products: null, comments: null, media: null })
  const [nav, setNav] = useState(false)
  const [adding, setAdding] = useState(false)
  const [site, setSite] = useState(null)
  const [sitePick, setSitePick] = useState(null) // callback(url) jab site image chuni jaye

  const api = useCallback(async (path, method = 'GET', body) => {
    const r = await fetch(`${API}/api/${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: body && JSON.stringify(body) })
    if (r.status === 401) { logout(); throw new Error('Session expired') }
    if (!r.ok && method !== 'POST' && method !== 'PUT') throw new Error('HTTP ' + r.status)
    return r.json()
  }, [token, logout])

  const reload = useCallback(async keys => {
    for (const k of [].concat(keys)) {
      try { const v = await api(ENDPOINT[k]); setD(s => ({ ...s, [k]: Array.isArray(v) ? v : [] })) }
      catch { setD(s => ({ ...s, [k]: s[k] || [] })) }
    }
  }, [api])
  useEffect(() => { reload(Object.keys(ENDPOINT)); api('admin/settings').then(setSite).catch(() => setSite({})) }, [reload, api])
  useEffect(() => { document.title = 'Admin · Riaz Homoeo Clinic'; return () => { document.title = 'Riaz Homoeo Clinic' } }, [])
  useEffect(() => { const h = () => setTab(location.hash.slice(1) || 'overview'); addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])

  const go = t => { location.hash = t; setTab(t); setNav(false); scrollTo(0, 0) }
  const patch = (k, id, p) => setD(s => ({ ...s, [k]: s[k].map(r => r._id === id ? { ...r, ...p } : r) }))
  const patchMedia = (id, p) => patch('media', id, p)
  const addImages = () => setAdding(true)
  const cur = NAV.find(n => n[0] === tab) || NAV[0]
  const badge = { orders: (d.orders || []).filter(o => o.status === 'new').length }
  const common = { d, api, patch, reload }

  return (
    <div className="adm">
      <aside className={`adm-side${nav ? ' open' : ''}`}>
        <div className="adm-brand"><span className="adm-logo">R</span><div><b>Riaz Homoeo Clinic</b><small>Admin panel</small></div></div>
        <div className="adm-menu" role="navigation" aria-label="Admin sections">
          {NAV.map(([k, label, Ic]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => go(k)} aria-current={tab === k ? 'page' : undefined}>
              <Ic size={17} /><span>{label}</span>{badge[k] > 0 && <em>{badge[k]}</em>}
            </button>))}
        </div>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View website</a>
          <button onClick={logout}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      {nav && <div className="adm-scrim" onClick={() => setNav(false)} />}
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-icon-btn adm-burger" onClick={() => setNav(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div><h1>{cur[1]}</h1><p>{cur[3]}</p></div>
        </header>
        <div className="adm-content">
          {tab === 'overview' && <Overview d={d} go={go} addImages={addImages} />}
          {tab === 'orders' && <Orders {...common} />}
          {tab === 'products' && <Products {...common} />}
          {tab === 'comments' && <Comments {...common} />}
          {tab === 'gallery' && <>
            <SiteImages site={site} api={api} setSite={setSite} onPick={cb => setSitePick(() => cb)} />
            <GalleryView {...common} patchMedia={patchMedia} addImages={addImages} />
          </>}
        </div>
      </div>
      <button className="adm-fab" onClick={addImages} aria-label="Add images" title="Add images"><Plus size={26} /></button>
      {sitePick && <MediaPicker mode="pick" single media={d.media} api={api} onChanged={() => reload('media')} onClose={() => setSitePick(null)} onPick={url => sitePick(url)} />}
      {adding && <MediaPicker mode="publish" media={d.media} api={api}
        onChanged={() => reload('media')} onClose={() => { setAdding(false); reload('media') }} />}
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('tk'))
  const logout = useCallback(() => { sessionStorage.removeItem('tk'); setToken(null) }, [])
  return (
    <ToastProvider>
      {token ? <Panel token={token} logout={logout} /> : <Login onToken={setToken} />}
    </ToastProvider>
  )
}
