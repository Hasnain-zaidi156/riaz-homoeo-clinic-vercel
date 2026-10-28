import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { API, assetUrl } from '../lib/config'
import { galleryImgs } from '../data/gallery'

/* Gallery ki images admin panel (+ button / Gallery tab) se manage hoti hain.
   Server na chale to data/gallery.js wali purani list dikhai jati hai.
   Layout: seedhi rows, desktop par 4 images har row mein, har image apni asli
   aspect-ratio (landscape landscape, portrait portrait) mein rehti hai. */
export default function Gallery() {
  const { openLightbox } = useStore()
  const { t } = useLang()
  const [items, setItems] = useState(null) // null = load ho rahi hai

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/gallery`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => alive && setItems(Array.isArray(d) ? d.map(x => [assetUrl(x.url), x.alt || 'Gallery']) : galleryImgs))
      .catch(() => alive && setItems(galleryImgs))
    return () => { alive = false }
  }, [])

  if (items && items.length === 0) return null // admin ne sab images chhupa di hon
  return (
    <section id="gallery">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Moments')}</div>
        <h2 className="section-title">{t('Clinic Gallery')}</h2>
        <div className="gallery-grid">
          {(items || []).map(([src, alt], i) => (
            <div key={src + i} className="gallery-tile" onClick={() => openLightbox(src, alt)}>
              <img src={src} alt={alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
