import { useRef, useState } from 'react'
import { assetUrl } from '../../lib/config'
import { Check, ImageIcon, Upload } from '../../components/Icons'
import { Modal, Loading, useToast } from './ui'

/* Image ko upload se pehle chhota karta hai (max 1600px) taake website tez rahe */
const MAX_SIDE = 1600, MAX_BYTES = 4.5 * 1024 * 1024
const readAsDataUrl = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f) })
async function prepare(file) {
  if (file.type === 'image/gif') {
    if (file.size > MAX_BYTES) throw new Error('GIF is too large (max 4.5 MB)')
    return readAsDataUrl(file)
  }
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  const g = c.getContext('2d')
  const png = file.type === 'image/png'
  if (!png) { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height) }
  g.drawImage(bmp, 0, 0, c.width, c.height)
  let out = c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.86)
  if (out.length * 0.75 > MAX_BYTES) { // bari PNG → JPEG
    g.globalCompositeOperation = 'destination-over'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
    out = c.toDataURL('image/jpeg', 0.82)
  }
  return out
}

/* mode="publish": + button — upload karein ya gallery se chunein, aur website ki Gallery mein dikhayein.
   mode="pick": product form — image(s) chun kar wapas dein (website Gallery par nahi jati). */
export default function MediaPicker({ mode = 'publish', single = false, media, api, onChanged, onClose, onPick }) {
  const toast = useToast()
  const [tab, setTab] = useState('upload')
  const [sel, setSel] = useState([])          // selected media _id's (gallery tab)
  const [queue, setQueue] = useState([])      // uploads: {key,name,state,preview,error,item}
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const input = useRef(null)
  const publish = mode === 'publish'

  const toggle = id => setSel(s => single ? (s.includes(id) ? [] : [id]) : s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const patchQ = (key, p) => setQueue(q => q.map(x => x.key === key ? { ...x, ...p } : x))

  const upload = async files => {
    const list = [...files].filter(f => /^image\/(jpeg|png|webp|gif)$/.test(f.type))
    if (!list.length) { toast('Choose JPG, PNG, WEBP or GIF images', 'err'); return }
    const rows = list.map(f => ({ key: Math.random().toString(36).slice(2), name: f.name, state: 'wait', preview: URL.createObjectURL(f), file: f }))
    setQueue(q => [...rows, ...q]); setBusy(true)
    for (const r of rows) {
      patchQ(r.key, { state: 'up' })
      try {
        const dataUrl = await prepare(r.file)
        const item = await api('admin/media', 'POST', { name: r.name, dataUrl, show: publish })
        if (item.error) throw new Error(item.error)
        patchQ(r.key, { state: 'ok', item })
        if (!publish) setSel(s => single ? [item._id] : [...s, item._id])
      } catch (e) { patchQ(r.key, { state: 'err', error: e.message || 'Upload failed' }) }
    }
    setBusy(false); onChanged()
  }

  /* Gallery se chune hue images website par dikhayein */
  const showSelected = async () => {
    const todo = (media || []).filter(m => sel.includes(m._id) && !m.show)
    setBusy(true)
    try { await Promise.all(todo.map(m => api('admin/media/' + m._id, 'PATCH', { show: true }))); toast(`${todo.length} image${todo.length > 1 ? 's' : ''} now on the website`); onChanged(); onClose() }
    catch { toast('Could not update images', 'err') }
    setBusy(false)
  }
  const usePicked = () => {
    const urls = (media || []).filter(m => sel.includes(m._id)).map(m => assetUrl(m.url))
    onPick(single ? urls[0] : urls); onClose()
  }

  const done = queue.filter(q => q.state === 'ok').length
  const hiddenSelected = (media || []).filter(m => sel.includes(m._id) && !m.show).length

  const footer = tab === 'gallery'
    ? <>
        <span className="adm-muted adm-foot-note">{sel.length ? `${sel.length} selected` : 'Select images'}</span>
        <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
        {publish
          ? <button type="button" className="adm-btn primary" disabled={!hiddenSelected || busy} onClick={showSelected}>Show on website{hiddenSelected ? ` (${hiddenSelected})` : ''}</button>
          : <button type="button" className="adm-btn primary" disabled={!sel.length} onClick={usePicked}>Use {sel.length || ''} image{sel.length === 1 ? '' : 's'}</button>}
      </>
    : <>
        {done > 0 && <span className="adm-muted adm-foot-note">{done} uploaded</span>}
        {!publish && sel.length > 0
          ? <button type="button" className="adm-btn primary" onClick={usePicked}>Use {sel.length} image{sel.length === 1 ? '' : 's'}</button>
          : <button type="button" className="adm-btn" onClick={onClose}>{done ? 'Done' : 'Cancel'}</button>}
      </>

  return (
    <Modal size="lg" title={publish ? 'Add images to the website' : single ? 'Choose an image' : 'Choose product images'} onClose={onClose} footer={footer}>
      <div className="adm-tabs-inline" role="tablist">
        <button role="tab" aria-selected={tab === 'upload'} className={tab === 'upload' ? 'on' : ''} onClick={() => setTab('upload')}><Upload size={15} /> Upload</button>
        <button role="tab" aria-selected={tab === 'gallery'} className={tab === 'gallery' ? 'on' : ''} onClick={() => setTab('gallery')}><ImageIcon size={15} /> Choose from gallery{media ? ` (${media.length})` : ''}</button>
      </div>

      {tab === 'upload' && <>
        <div className={`adm-drop${drag ? ' over' : ''}`} role="button" tabIndex={0}
          onClick={() => input.current?.click()} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files) }}>
          <Upload size={26} />
          <strong>Drop images here or click to browse</strong>
          <span>JPG, PNG, WEBP or GIF. {publish ? 'They appear in the website gallery right away.' : 'They are saved to the gallery library and added to this product.'}</span>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden
            onChange={e => { upload(e.target.files); e.target.value = '' }} />
        </div>
        {queue.length > 0 && (
          <ul className="adm-uploads">
            {queue.map(q => (
              <li key={q.key}>
                <img src={q.item ? assetUrl(q.item.url) : q.preview} alt="" />
                <div><b>{q.name}</b>
                  <small className={q.state === 'err' ? 'bad' : ''}>
                    {q.state === 'wait' && 'Waiting…'}{q.state === 'up' && 'Uploading…'}
                    {q.state === 'ok' && (publish ? 'Uploaded · on website' : 'Uploaded')}{q.state === 'err' && q.error}
                  </small>
                </div>
                {q.state === 'up' && <span className="adm-spinner" />}{q.state === 'ok' && <Check size={18} className="adm-ok" />}
              </li>
            ))}
          </ul>
        )}
      </>}

      {tab === 'gallery' && (media === null ? <Loading /> : media.length === 0
        ? <p className="adm-muted" style={{ padding: '1.5rem 0', textAlign: 'center' }}>The gallery is empty. Upload an image first.</p>
        : <div className="adm-pick-grid">
            {media.map(m => (
              <button type="button" key={m._id} className={`adm-pick${sel.includes(m._id) ? ' on' : ''}`} onClick={() => toggle(m._id)} aria-pressed={sel.includes(m._id)}>
                <img src={assetUrl(m.url)} alt={m.alt} loading="lazy" />
                {m.show && <span className="adm-pick-tag">On website</span>}
                <span className="adm-pick-check"><Check size={14} /></span>
              </button>
            ))}
          </div>)}
    </Modal>
  )
}
