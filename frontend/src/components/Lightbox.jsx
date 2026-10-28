import { useStore } from '../context/StoreContext'
import { Times } from './Icons'

export default function Lightbox() {
  const { lightbox, closeLightbox } = useStore()
  return (
    <div className={`lightbox-overlay${lightbox ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && closeLightbox()}>
      <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><Times size={18} /></button>
      <img src={lightbox?.src || ''} alt={lightbox?.alt || ''} className="lightbox-img" />
    </div>
  )
}
