import { useMemo, useState } from 'react'
import { Package, Pencil, Plus, Search, Trash, Times } from '../../components/Icons'
import { Badge, Empty, Loading, Modal, Switch, money, useConfirm, useToast } from './ui'
import MediaPicker from './MediaPicker'

const imgsOf = p => (p.imgs?.length ? p.imgs : p.img ? [p.img] : [])
const BLANK = { name: '', nameUr: '', desc: '', descUr: '', price: '', cat: 'clinic', stock: true, imgs: [], video: '' }

function ProductForm({ product, api, media, reloadMedia, onSaved, onClose }) {
  const toast = useToast()
  const [f, setF] = useState(() => product ? { ...BLANK, ...product, price: product.price ?? '', imgs: imgsOf(product), stock: product.stock !== false } : BLANK)
  const [picker, setPicker] = useState(false)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const addImgs = urls => setF(s => ({ ...s, imgs: [...new Set([...s.imgs, ...urls])] }))
  const dropImg = u => setF(s => ({ ...s, imgs: s.imgs.filter(x => x !== u) }))
  const addUrl = () => { const u = url.trim(); if (/^https?:\/\//.test(u)) { addImgs([u]); setUrl('') } else toast('Enter a full image link starting with http', 'err') }

  const save = async e => {
    e.preventDefault()
    if (!f.name.trim()) return toast('Product name is required', 'err')
    if (f.price === '' || Number(f.price) < 0) return toast('Enter a valid price', 'err')
    const body = { name: f.name.trim(), nameUr: f.nameUr.trim(), desc: f.desc, descUr: f.descUr, price: Number(f.price), cat: f.cat, stock: f.stock, video: f.video.trim(), imgs: f.imgs, img: f.imgs[0] || '' }
    setBusy(true)
    try {
      const r = product ? await api('admin/products/' + product._id, 'PUT', body) : await api('admin/products', 'POST', body)
      if (r.error) throw new Error(r.error)
      toast(product ? 'Product updated' : 'Product added'); onSaved()
    } catch (err) { toast(err.message || 'Could not save the product', 'err') }
    setBusy(false)
  }

  return (
    <Modal size="lg" title={product ? 'Edit product' : 'Add product'} onClose={onClose}
      footer={<><button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
        <button type="submit" form="product-form" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : product ? 'Save changes' : 'Add product'}</button></>}>
      <form id="product-form" className="adm-form" onSubmit={save}>
        <label>Name<input className="adm-input" value={f.name} onChange={set('name')} required /></label>
        <label>Name in Urdu<input className="adm-input" dir="rtl" value={f.nameUr} onChange={set('nameUr')} /></label>
        <label>Price (PKR)<input className="adm-input" type="number" min="0" value={f.price} onChange={set('price')} required /></label>
        <label>Category<select className="adm-input" value={f.cat} onChange={set('cat')}><option value="clinic">Clinic range</option><option value="dxn">DXN range</option></select></label>
        <label className="full">Description<textarea className="adm-input" rows={3} value={f.desc} onChange={set('desc')} /></label>
        <label className="full">Description in Urdu<textarea className="adm-input" dir="rtl" rows={3} value={f.descUr} onChange={set('descUr')} /></label>
        <div className="full">
          <span className="adm-label">Images <small className="adm-muted">The first image is the main one.</small></span>
          <div className="adm-thumbs">
            {f.imgs.map((u, i) => (
              <div key={u} className="adm-thumb"><img src={u} alt="" />{i === 0 && <em>Main</em>}
                <button type="button" onClick={() => dropImg(u)} aria-label="Remove image"><Times size={12} /></button></div>))}
            <button type="button" className="adm-thumb add" onClick={() => setPicker(true)} aria-label="Add images"><Plus size={22} /><span>Add</span></button>
          </div>
          <div className="adm-inline">
            <input className="adm-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="Or paste an image link" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())} />
            <button type="button" className="adm-btn" onClick={addUrl}>Add link</button>
          </div>
        </div>
        <label className="full">Video link <small className="adm-muted">Optional. Main (featured) product par chalti hai: .mp4 ya YouTube/ScreenPal link</small><input className="adm-input" value={f.video} onChange={set('video')} /></label>
        <div className="full"><Switch checked={f.stock} onChange={v => setF(s => ({ ...s, stock: v }))} label={f.stock ? 'In stock' : 'Out of stock'} /></div>
      </form>
      {picker && <MediaPicker mode="pick" media={media} api={api} onChanged={reloadMedia} onClose={() => setPicker(false)} onPick={addImgs} />}
    </Modal>
  )
}

export default function Products({ d, api, patch, reload }) {
  const toast = useToast()
  const [confirm, node] = useConfirm()
  const [q, setQ] = useState(''), [cat, setCat] = useState('all')
  const [edit, setEdit] = useState(null) // null | 'new' | product
  const rows = d.products
  const shown = useMemo(() => (rows || []).filter(p => (cat === 'all' || p.cat === cat) &&
    (!q || `${p.name} ${p.nameUr || ''}`.toLowerCase().includes(q.toLowerCase()))), [rows, q, cat])
  if (!rows) return <Loading />

  const setStock = async (p, stock) => {
    patch('products', p._id, { stock })
    try { await api('admin/products/' + p._id, 'PUT', { stock }); toast(stock ? 'Marked in stock' : 'Marked out of stock') }
    catch { patch('products', p._id, { stock: !stock }); toast('Could not update stock', 'err') }
  }
  const del = async p => {
    if (!await confirm({ title: 'Delete this product?', message: `“${p.name}” will be removed from the website.` })) return
    try { await api('admin/products/' + p._id, 'DELETE'); toast('Product deleted'); reload('products') } catch { toast('Could not delete the product', 'err') }
  }

  return (
    <div className="adm-card">
      <div className="adm-toolbar">
        <div className="adm-filters">
          <label className="adm-search"><Search size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" /></label>
          <select className="adm-input slim" value={cat} onChange={e => setCat(e.target.value)} aria-label="Category">
            <option value="all">All categories</option><option value="clinic">Clinic range</option><option value="dxn">DXN range</option>
          </select>
        </div>
        <button className="adm-btn primary" onClick={() => setEdit('new')}><Plus size={16} /> Add product</button>
      </div>
      {shown.length === 0 ? <Empty icon={<Package size={22} />} title="No products found" text={rows.length ? 'Try another search.' : 'Add your first product.'} /> : (
        <div className="adm-scroll"><table className="adm-table">
          <thead><tr><th>Product</th><th>Category</th><th className="num">Price</th><th>Stock</th><th aria-label="Actions" /></tr></thead>
          <tbody>{shown.map(p => (
            <tr key={p._id}>
              <td><div className="adm-prod"><img src={imgsOf(p)[0] || ''} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                <div><b>{p.name}</b>{p.nameUr && <small dir="rtl">{p.nameUr}</small>}</div></div></td>
              <td><Badge tone={p.cat === 'dxn' ? 'warn' : 'info'}>{p.cat === 'dxn' ? 'DXN' : 'Clinic'}</Badge></td>
              <td className="num nowrap">{money(p.price)}</td>
              <td><Switch checked={p.stock !== false} onChange={v => setStock(p, v)} label={p.stock !== false ? 'In stock' : 'Out'} /></td>
              <td className="adm-row-actions">
                <button className="adm-icon-btn" onClick={() => setEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={16} /></button>
                <button className="adm-icon-btn danger" onClick={() => del(p)} aria-label={`Delete ${p.name}`}><Trash size={16} /></button>
              </td>
            </tr>))}</tbody>
        </table></div>)}
      {edit && <ProductForm product={edit === 'new' ? null : edit} api={api} media={d.media} reloadMedia={() => reload('media')}
        onSaved={() => { setEdit(null); reload('products') }} onClose={() => setEdit(null)} />}
      {node}
    </div>
  )
}
