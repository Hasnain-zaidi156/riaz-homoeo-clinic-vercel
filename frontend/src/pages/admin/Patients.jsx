import { useCallback, useEffect, useRef, useState } from 'react'
import { Pencil, Plus, Search, Trash, User } from '../../components/Icons'
import { Empty, Loading, Modal, niceDate, useConfirm, useToast } from './ui'

/* Patient Records — sirf admin ke liye. Data DB (Patient collection) mein save hota hai, website par kahin nahi dikhta.
   Search: name / city / card number (server par, isliye hazaron records mein bhi tez). */
const PAGE = 50
const EMPTY = { name: '', cardNo: '', city: '' }

function PatientForm({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || EMPTY)
  const [busy, setBusy] = useState(false)
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const ok = f.name.trim() && f.cardNo.trim() && f.city.trim()
  const submit = async e => {
    e.preventDefault()
    if (!ok || busy) return
    setBusy(true)
    const done = await onSave(f)
    setBusy(false)
    if (done) onClose()
  }
  return (
    <Modal title={initial ? 'Edit patient' : 'Add patient'} onClose={onClose}
      footer={<>
        <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
        <button type="submit" form="patient-form" className="adm-btn primary" disabled={!ok || busy}>{busy ? 'Saving…' : initial ? 'Save changes' : 'Add patient'}</button>
      </>}>
      <form id="patient-form" onSubmit={submit} style={{ display: 'grid', gap: '.9rem' }}>
        <label>Name<input className="adm-input" value={f.name} onChange={set('name')} maxLength={80} autoFocus required /></label>
        <label>Card number<input className="adm-input" value={f.cardNo} onChange={set('cardNo')} maxLength={40} required /></label>
        <label>City<input className="adm-input" value={f.city} onChange={set('city')} maxLength={60} required /></label>
      </form>
    </Modal>
  )
}

export default function Patients({ api }) {
  const toast = useToast()
  const [confirm, confirmNode] = useConfirm()
  const [q, setQ] = useState('')
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(0)
  const [more, setMore] = useState(false)
  const [form, setForm] = useState(null) // null | {} (add) | row (edit)
  const seq = useRef(0)

  const load = useCallback(async (query, skip = 0) => {
    const my = ++seq.current
    try {
      const d = await api(`admin/patients?q=${encodeURIComponent(query)}&skip=${skip}&limit=${PAGE}`)
      if (my !== seq.current) return // naya search aa chuka hai
      setRows(r => (skip ? [...(r || []), ...d.rows] : d.rows)); setTotal(d.total)
    } catch { if (my === seq.current) { setRows(r => r || []); toast('Could not load patient records', 'err') } }
    if (my === seq.current) setMore(false)
  }, [api, toast])

  /* Type karte hi (thori der ruk kar) search */
  useEffect(() => { const t = setTimeout(() => load(q.trim()), 250); return () => clearTimeout(t) }, [q, load])

  const save = async f => {
    const body = { name: f.name, cardNo: f.cardNo, city: f.city }
    try {
      if (f._id) {
        const r = await api('admin/patients/' + f._id, 'PUT', body)
        if (r.error) { toast(r.error, 'err'); return false }
        toast('Patient updated')
      } else {
        let r = await api('admin/patients', 'POST', body)
        if (r.error === 'duplicate') {
          const e = r.existing
          const yes = await confirm({ title: 'Card number already exists', confirmLabel: 'Add anyway',
            message: `Card ${e.cardNo} pehle se maujood hai: ${e.name} (${e.city}). Phir bhi naya patient add karein?` })
          if (!yes) return false
          r = await api('admin/patients', 'POST', { ...body, force: true })
        }
        if (r.error) { toast(r.error, 'err'); return false }
        toast('Patient added')
      }
      load(q.trim())
      return true
    } catch { toast('Could not save the patient', 'err'); return false }
  }

  const remove = async p => {
    if (!(await confirm({ title: 'Delete patient?', message: `${p.name} (card ${p.cardNo}) ka record hamesha ke liye delete ho jayega.` }))) return
    try { await api('admin/patients/' + p._id, 'DELETE'); toast('Patient deleted'); load(q.trim()) }
    catch { toast('Could not delete', 'err') }
  }

  return (
    <div className="adm-card">
      <div className="adm-toolbar">
        <label className="adm-search" style={{ flex: '1 1 280px', maxWidth: 460 }}><Search size={15} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, card number or city" aria-label="Search patients" />
        </label>
        <div className="adm-filters">
          <span className="adm-muted">{rows ? `${total} ${q.trim() ? 'found' : 'patients'}` : ''}</span>
          <button type="button" className="adm-btn primary" onClick={() => setForm({})}><Plus size={15} /> Add patient</button>
        </div>
      </div>

      {!rows ? <Loading /> : rows.length === 0 ? (
        <Empty icon={<User size={22} />} title={q.trim() ? 'No patient found' : 'No patient records yet'}
          text={q.trim() ? 'Naam, card number ya city kuch aur likh kar dekhein.' : 'Add patient dabayen — name, card number aur city save ho jayegi.'} />
      ) : (
        <>
          <div className="adm-scroll"><table className="adm-table compact">
            <thead><tr><th>Name</th><th>Card number</th><th>City</th><th>Added</th><th /></tr></thead>
            <tbody>{rows.map(p => (
              <tr key={p._id}>
                <td><b>{p.name}</b></td>
                <td className="nowrap">{p.cardNo}</td>
                <td>{p.city}</td>
                <td className="nowrap adm-muted">{niceDate(p.createdAt || '')}</td>
                <td className="nowrap" style={{ textAlign: 'end' }}>
                  <button type="button" className="adm-icon-btn" onClick={() => setForm(p)} aria-label={`Edit ${p.name}`} title="Edit"><Pencil size={16} /></button>
                  <button type="button" className="adm-icon-btn" onClick={() => remove(p)} aria-label={`Delete ${p.name}`} title="Delete"><Trash size={16} /></button>
                </td>
              </tr>))}</tbody>
          </table></div>
          {rows.length < total && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <button type="button" className="adm-btn" disabled={more} onClick={() => { setMore(true); load(q.trim(), rows.length) }}>
                {more ? 'Loading…' : `Load more (${total - rows.length} baqi)`}
              </button>
            </div>
          )}
        </>
      )}

      {form && <PatientForm initial={form._id ? form : null} onClose={() => setForm(null)} onSave={save} />}
      {confirmNode}
    </div>
  )
}
