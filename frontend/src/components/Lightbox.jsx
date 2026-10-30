import { useStore } from '../context/StoreContext'
import { Times } from './Icons'
import { useCallback, useEffect } from 'react'

export default function Lightbox() {
  const { lightbox, closeLightbox } = useStore()

  const onKey = useCallback(e => {
    if (e.key === 'Escape') closeLightbox()
  }, [closeLightbox])

  useEffect(() => {
    if (!lightbox) return
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox, onKey])

  if (!lightbox) return null

  return (
    <div className="lightbox-overlay open" onClick={e => e.target === e.currentTarget && closeLightbox()}>
      <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><Times size={18} /></button>
      <div className="lightbox-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
        <img src={lightbox.src || ''} alt={lightbox.alt || ''} className="lightbox-img" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.4)' }} />
      </div>
      {lightbox.alt && (
        <div className="lightbox-caption" onClick={e => e.stopPropagation()}>{lightbox.alt}</div>
      )}
    </div>
  )
}
