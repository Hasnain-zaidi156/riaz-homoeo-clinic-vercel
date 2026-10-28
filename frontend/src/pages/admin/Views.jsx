import { useMemo, useState } from 'react'
import { assetUrl } from '../../lib/config'
import { Bag, Comment, ImageIcon, Package, Plus, Search, Trash, Eye, EyeOff } from '../../components/Icons'
import { Badge, Empty, Loading, Switch, money, niceDate, useConfirm, useToast } from './ui'

const ORDER_STATUS = ['new', 'confirmed', 'delivered', 'cancelled']
const TONE = { new: 'info', confirmed: 'warn', delivered: 'ok', cancelled: 'bad', booked: 'info', done: 'ok', 'no-show': 'bad' }
const cap = s => s[0].toUpperCase() + s.slice(1)

const SearchBox = ({ value, onChange, placeholder }) => (
  <label className="adm-search"><Search size={15} />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
  </label>
)
const Chips = ({ options, value, onChange }) => (
  <div className="adm-chips" role="tablist">
    {options.map(([k, label, n]) => (
      <button key={k} role="tab" aria-selected={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{label}{n != null && <em>{n}</em>}</button>
    ))}
  </div>
)
const StatusSelect = ({ value, options, onChange }) => (
  <select className={`adm-status ${TONE[value] || ''}`} value={value} onChange={e => onChange(e.target.value)} aria-label="Status">
    {options.map(s => <option key={s} value={s}>{cap(s)}</option>)}
  </select>
)

/* ================= Overview ================= */
export function Overview({ d, go, addImages }) {
  if (!d.orders || !d.products || !d.comments || !d.media) return <Loading />
  const newOrders = d.orders.filter(o => o.status === 'new').length
  const oos = d.products.filter(p => p.stock === false).length
  const live = d.media.filter(m => m.show).length
  const stats = [
    ['New orders', newOrders, `${d.orders.length} in total`, 'orders', Bag],
    ['Products', d.products.length, oos ? `${oos} out of stock` : 'All in stock', 'products', Package],
    ['Comments', d.comments.length, 'Across the website', 'comments', Comment],
    ['Gallery images', live, `${d.media.length - live} hidden`, 'gallery', ImageIcon],
  ]
  return (
    <>
      <div className="adm-stats">
        {stats.map(([label, n, sub, to, Ic]) => (
          <button key={label} className="adm-stat" onClick={() => go(to)}>
            <span className="adm-stat-ic"><Ic size={18} /></span>
            <span className="adm-stat-n">{n}</span>
            <span className="adm-stat-l">{label}</span>
            <small>{sub}</small>
          </button>
        ))}
      </div>
      <div className="adm-cols">
        <div className="adm-card wide">
          <div className="adm-card-head"><h3>Latest orders</h3><button className="adm-link" onClick={() => go('orders')}>View all</button></div>
          {d.orders.length === 0 ? <p className="adm-muted pad">No orders yet.</p> : (
            <div className="adm-scroll"><table className="adm-table compact"><tbody>
              {d.orders.slice(0, 6).map(o => (
                <tr key={o._id}>
                  <td><b>{o.name}</b><small>{niceDate(o.createdAt || '')}</small></td>
                  <td className="num">{money(o.total)}</td>
                  <td><Badge tone={TONE[o.status]}>{cap(o.status)}</Badge></td>
                </tr>))}
            </tbody></table></div>)}
        </div>
        <div className="adm-card">
          <div className="adm-card-head"><h3>Latest comments</h3><button className="adm-link" onClick={() => go('comments')}>Manage</button></div>
          {d.comments.length === 0 ? <p className="adm-muted pad">No comments yet.</p> : (
            <ul className="adm-list">{d.comments.slice(0, 4).map(c => (
              <li key={c._id}><span className="adm-avatar">{c.name[0]?.toUpperCase()}</span><div><b>{c.name}</b><small className="clip">{c.text}</small></div></li>))}</ul>)}
        </div>
      </div>
      <div className="adm-quick">
        <button className="adm-btn primary" onClick={addImages}><Plus size={16} /> Add images</button>
        <button className="adm-btn" onClick={() => go('products')}>Manage products</button>
      </div>
    </>
  )
}

/* ================= Orders ================= */
export function Orders({ d, api, patch }) {
  const toast = useToast()
  const [f, setF] = useState('all'), [q, setQ] = useState('')
  const rows = d.orders
  const shown = useMemo(() => (rows || []).filter(o => (f === 'all' || o.status === f) &&
    (!q || `${o.name} ${o.phone} ${o.address}`.toLowerCase().includes(q.toLowerCase()))), [rows, f, q])
  if (!rows) return <Loading />
  const setStatus = async (o, status) => {
    patch('orders', o._id, { status })
    try { await api('admin/orders/' + o._id, 'PATCH', { status }); toast(`Order marked ${status}`) }
    catch { patch('orders', o._id, { status: o.status }); toast('Could not update the order', 'err') }
  }
  return (
    <div className="adm-card">
      <div className="adm-toolbar">
        <Chips value={f} onChange={setF} options={[['all', 'All', rows.length], ...ORDER_STATUS.map(s => [s, cap(s), rows.filter(o => o.status === s).length])]} />
        <SearchBox value={q} onChange={setQ} placeholder="Search name, phone, address" />
      </div>
      {shown.length === 0 ? <Empty icon={<Bag size={22} />} title="No orders found" text={rows.length ? 'Try another filter.' : 'Orders placed on the website will appear here.'} /> : (
        <div className="adm-scroll"><table className="adm-table">
          <thead><tr><th>Date</th><th>Customer</th><th>Items</th><th className="num">Total</th><th>Status</th></tr></thead>
          <tbody>{shown.map(o => (
            <tr key={o._id}>
              <td className="nowrap">{niceDate(o.createdAt || '')}</td>
              <td><b>{o.name}</b><small><a href={`tel:${o.phone}`}>{o.phone}</a></small>{o.address && <small>{o.address}</small>}</td>
              <td>{o.items.map((i, k) => <div key={k} className="adm-item-line">{i.name} <span>× {i.qty}</span></div>)}</td>
              <td className="num nowrap"><b>{money(o.total)}</b></td>
              <td><StatusSelect value={o.status} options={ORDER_STATUS} onChange={s => setStatus(o, s)} /></td>
            </tr>))}</tbody>
        </table></div>)}
    </div>
  )
}

/* ================= Comments (admin sab dekh aur delete kar sakta hai) ================= */
export function Comments({ d, api, reload }) {
  const toast = useToast()
  const [confirm, node] = useConfirm()
  const [f, setF] = useState('all'), [q, setQ] = useState('')
  const rows = d.comments
  const shown = useMemo(() => (rows || []).filter(c => (f === 'all' || (f === 'site' ? !c.cid : !!c.cid)) &&
    (!q || `${c.name} ${c.text} ${c.product || ''}`.toLowerCase().includes(q.toLowerCase()))), [rows, f, q])
  if (!rows) return <Loading />
  const del = async c => {
    if (!await confirm({ title: 'Delete this comment?', message: `The comment by ${c.name} will be removed permanently.` })) return
    try { await api('admin/comments/' + c._id, 'DELETE'); toast('Comment deleted'); reload('comments') }
    catch { toast('Could not delete the comment', 'err') }
  }
  return (
    <div className="adm-card">
      <div className="adm-toolbar">
        <Chips value={f} onChange={setF} options={[['all', 'All', rows.length], ['site', 'Comments section', rows.filter(c => !c.cid).length], ['product', 'Old product comments', rows.filter(c => c.cid).length]]} />
        <SearchBox value={q} onChange={setQ} placeholder="Search comments" />
      </div>
      {shown.length === 0 ? <Empty icon={<Comment size={22} />} title="No comments" text="Comments posted on the website will appear here." /> : (
        <ul className="adm-comments">{shown.map(c => (
          <li key={c._id}>
            <span className="adm-avatar">{c.name[0]?.toUpperCase()}</span>
            <div className="adm-c-body">
              <div className="adm-c-top"><b>{c.name}</b>
                <Badge tone={c.cid ? 'neutral' : 'info'}>{c.cid ? c.product : 'Comments section'}</Badge>
                <small>{niceDate(c.createdAt || '')}</small></div>
              <p>{c.text}</p>
            </div>
            <button className="adm-btn danger ghost" onClick={() => del(c)} aria-label={`Delete comment by ${c.name}`}><Trash size={15} /> Delete</button>
          </li>))}</ul>)}
      {node}
    </div>
  )
}

/* ================= Gallery (website gallery manager) ================= */
export function GalleryView({ d, api, patchMedia, reload, addImages }) {
  const toast = useToast()
  const [confirm, node] = useConfirm()
  const rows = d.media
  if (!rows) return <Loading />
  const live = rows.filter(m => m.show).length
  const toggle = async (m, show) => {
    patchMedia(m._id, { show })
    try { await api('admin/media/' + m._id, 'PATCH', { show }); toast(show ? 'Shown on the website' : 'Hidden from the website') }
    catch { patchMedia(m._id, { show: !show }); toast('Could not update the image', 'err') }
  }
  const saveAlt = async (m, alt) => { if (alt === m.alt) return; patchMedia(m._id, { alt }); try { await api('admin/media/' + m._id, 'PATCH', { alt }) } catch { reload('media') } }
  const del = async m => {
    if (!await confirm({ title: 'Delete this image?', message: 'It is removed from the library and from the website gallery. Products using this image will lose it.' })) return
    try { await api('admin/media/' + m._id, 'DELETE'); toast('Image deleted'); reload('media') } catch { toast('Could not delete the image', 'err') }
  }
  return (
    <div className="adm-card">
      <div className="adm-toolbar">
        <div><b>{rows.length} images</b> <span className="adm-muted">· {live} on the website, {rows.length - live} hidden</span></div>
        <button className="adm-btn primary" onClick={addImages}><Plus size={16} /> Add images</button>
      </div>
      {rows.length === 0 ? <Empty icon={<ImageIcon size={22} />} title="No images yet" text="Upload images with the + button. They show in the website gallery." /> : (
        <div className="adm-media-grid">{rows.map(m => (
          <div key={m._id} className={`adm-media${m.show ? '' : ' off'}`}>
            <div className="adm-media-img"><img src={assetUrl(m.url)} alt={m.alt} loading="lazy" />
              <Badge tone={m.show ? 'ok' : 'neutral'}>{m.show ? 'On website' : 'Hidden'}</Badge></div>
            <input className="adm-input" defaultValue={m.alt} onBlur={e => saveAlt(m, e.target.value.trim())} onKeyDown={e => e.key === 'Enter' && e.target.blur()} placeholder="Caption" aria-label="Image caption" />
            <div className="adm-media-actions">
              <Switch checked={m.show} onChange={v => toggle(m, v)} label={m.show ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>} />
              <button className="adm-icon-btn danger" onClick={() => del(m)} aria-label="Delete image"><Trash size={16} /></button>
            </div>
          </div>))}</div>)}
      {node}
    </div>
  )
}

/* ================= Site images (logo / hero / about) — admin kisi bhi image ko badal sakta hai ================= */
const SITE_IMGS = [
  ['doctorAboutImg', 'About section photo', 'https://i.ibb.co/PZvDc5qS/image.png'],
  ['doctorLeftImg', 'Hero photo (left)', 'https://i.ibb.co/fVQn2rmQ/image.png'],
  ['doctorRightImg', 'Hero photo (right)', 'https://i.ibb.co/sBqDn9p/image.png'],
  ['logoImg', 'Logo', 'https://i.ibb.co/Q7NhK34X/logo.jpg'],
]
export function SiteImages({ site, api, setSite, onPick }) {
  const toast = useToast()
  const save = async (key, url) => {
    try {
      const r = await api('admin/settings', 'PUT', { [key]: url })
      if (r.error) throw new Error(r.error)
      setSite(r); toast(url ? 'Image updated on the website' : 'Restored the default image')
    } catch { toast('Could not update the image', 'err') }
  }
  return (
    <div className="adm-card" style={{ marginBottom: '1rem' }}>
      <div className="adm-card-head"><h3>Site images</h3><span className="adm-muted">Logo and photos used across the website</span></div>
      <div className="adm-site-grid">
        {SITE_IMGS.map(([key, label, def]) => {
          const cur = site?.[key]
          return (
            <div key={key} className="adm-site-img">
              <div className="adm-site-thumb"><img src={assetUrl(cur || def)} alt={label} /></div>
              <b>{label}</b>
              <div className="adm-site-actions">
                <button className="adm-btn" onClick={() => onPick(url => save(key, url))}><ImageIcon size={15} /> Change</button>
                {cur && cur !== def && <button className="adm-link" onClick={() => save(key, '')}>Reset</button>}
              </div>
            </div>)
        })}
      </div>
    </div>
  )
}
