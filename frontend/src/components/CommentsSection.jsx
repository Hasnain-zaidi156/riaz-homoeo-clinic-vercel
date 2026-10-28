import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { API } from '../lib/config'
import { Comment } from './Icons'

/* Bulk comments section — poori website ke liye ek jagah.
   (Products par ab comments nahi hain.) Backend: GET/POST /api/bulk-comments */
export default function CommentsSection() {
  const { t, lang } = useLang()
  const [items, setItems] = useState(null)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/bulk-comments`)
      .then(r => r.json())
      .then(d => alive && setItems(Array.isArray(d) ? d : []))
      .catch(() => alive && setItems([]))
    return () => { alive = false }
  }, [])

  const send = e => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) { setErr(t('Please enter your name and comment')); return }
    setBusy(true); setErr('')
    fetch(`${API}/api/bulk-comments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), text: text.trim() }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { setItems(i => [d, ...(i || [])]); setText('') })
      .catch(() => setErr(t('Could not save your comment. Please try again.')))
      .finally(() => setBusy(false))
  }

  const fmt = d => { try { return new Date(d).toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' } }

  return (
    <section id="comments">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge"><Comment size={14} /> {t('Comments')}</div>
        <h2 className="section-title">{t('Customer Comments')}</h2>
        <div className="cm-grid">
          <form className="cm-form glass" onSubmit={send}>
            <h3>{t('Share your experience')}</h3>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder={t('Your name')} maxLength={40} />
            <textarea className="input-field" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder={t('Write your comment...')} maxLength={300} />
            {err && <small className="cm-err">{err}</small>}
            <button className="btn-primary" disabled={busy} style={{ width: '100%', marginTop: '.4rem' }}>{busy ? t('Sending...') : t('Send')}</button>
          </form>
          <div className="cm-list">
            {items === null && <p className="cm-msg">{t('Loading...')}</p>}
            {items !== null && items.length === 0 && <p className="cm-msg">{t('Be the first to comment')}</p>}
            {(items || []).map(c => (
              <article key={c._id} className="cm-item glass">
                <header><b className="cm-name">{c.name}</b><time>{fmt(c.createdAt)}</time></header>
                <p className="cm-text">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
