import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '../context/LangContext'

/* Text max `lines` lines dikhata hai. Zyada ho to "See More" aata hai, kam ho to nahi.
   Overflow DOM se measure hota hai (width/font/language badalne par bhi theek) —
   isliye naye products par bhi khud kaam karta hai. */
export default function ExpandableText({ text, lines = 4, className = '' }) {
  const { t } = useLang()
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [overflow, setOverflow] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el || open) return            // khula ho to measure nahi (scrollHeight == clientHeight)
    setOverflow(el.scrollHeight - el.clientHeight > 1)
  }, [open])

  useLayoutEffect(() => { measure() }, [measure, text])
  useEffect(() => { setOpen(false) }, [text])   // language/text badle to collapse
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro && ro.observe(el)
    document.fonts && document.fonts.ready.then(measure)   // Urdu font late load hota hai
    window.addEventListener('resize', measure)
    return () => { ro && ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [measure])

  if (!text) return null
  return (
    <div className="expandable">
      <p ref={ref} className={`${className} clamp-text${open ? ' open' : ''}`} style={{ '--lines': lines }}>{text}</p>
      {overflow && (
        <button type="button" className="see-more-link" aria-expanded={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }}>
          {open ? t('See Less') : t('See More')}
        </button>
      )}
    </div>
  )
}
