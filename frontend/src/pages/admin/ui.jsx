import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Times, Check, Alert } from '../../components/Icons'

/* ---------- Toasts (alert() ki jagah) ---------- */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [list, setList] = useState([])
  const push = useCallback((msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setList(l => [...l, { id, msg, kind }])
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), kind === 'err' ? 5000 : 3000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {list.map(t => (
          <div key={t.id} className={`adm-toast ${t.kind}`}>
            {t.kind === 'err' ? <Alert size={16} /> : <Check size={16} />}<span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Modal ---------- */
const stack = [] // Escape sirf sab se upar wali modal band kare
export function Modal({ title, onClose, children, footer, size = 'md' }) {
  const ref = useRef(null)
  useEffect(() => {
    const id = Symbol('modal'); stack.push(id)
    const onKey = e => { if (e.key === 'Escape' && stack[stack.length - 1] === id) onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      stack.splice(stack.indexOf(id), 1)
      document.removeEventListener('keydown', onKey)
      if (!stack.length) document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="adm-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`adm-modal ${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="adm-modal-head">
          <h3>{title}</h3>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close"><Times size={18} /></button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

/* ---------- Confirm dialog: const [confirm, node] = useConfirm(); if (await confirm({...})) ... ---------- */
export function useConfirm() {
  const [s, set] = useState(null)
  const confirm = useCallback(o => new Promise(res => set({ ...o, res })), [])
  const done = v => { s.res(v); set(null) }
  const node = s && (
    <Modal size="sm" title={s.title || 'Are you sure?'} onClose={() => done(false)}
      footer={<>
        <button type="button" className="adm-btn" onClick={() => done(false)}>Cancel</button>
        <button type="button" className="adm-btn danger" onClick={() => done(true)}>{s.confirmLabel || 'Delete'}</button>
      </>}>
      <p className="adm-muted">{s.message}</p>
    </Modal>
  )
  return [confirm, node]
}

/* ---------- Small pieces ---------- */
export const Badge = ({ tone = 'neutral', children }) => <span className={`adm-badge ${tone}`}>{children}</span>

export const Empty = ({ icon, title, text, action }) => (
  <div className="adm-empty">
    {icon && <div className="adm-empty-icon">{icon}</div>}
    <h4>{title}</h4>
    {text && <p>{text}</p>}
    {action}
  </div>
)

export const Loading = ({ label = 'Loading…' }) => <div className="adm-loading"><span className="adm-spinner" />{label}</div>

export const Switch = ({ checked, onChange, label }) => (
  <label className="adm-switch">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className="adm-switch-track" aria-hidden="true" />
    {label && <span className="adm-switch-label">{label}</span>}
  </label>
)

export const money = n => 'PKR ' + Number(n || 0).toLocaleString('en-US')
export const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD (local)
export const niceDate = d => { try { return new Date(d.length === 10 ? d + 'T00:00:00' : d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return d || '' } }
