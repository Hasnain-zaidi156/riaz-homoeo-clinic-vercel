import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { API, assetUrl } from '../lib/config'
import { galleryImgs } from '../data/gallery'
import snapshot from '../data/snapshot.json'

/* Gallery ki images admin panel se manage hoti hain.
   Server na chale to data/gallery.js wali purani list dikhai jati hai.
   Layout: seedhi rows, desktop par 4 items har row mein,
   har item apni asli aspect-ratio mein rehti hai. */
export default function Gallery() {
  const { openLightbox } = useStore()
  const { t } = useLang()
  const [items, setItems] = useState(() => (snapshot && Array.isArray(snapshot.gallery) && snapshot.gallery.length ? snapshot.gallery : null)) // null = load ho rahi hai

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/gallery`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => alive && setItems(Array.isArray(d) ? d : galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
      .catch(() => alive && setItems(galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
    return () => { alive = false }
  }, [])

  const images = (items || []).filter(item => item.isVideo !== true)
  if (items && images.length === 0) return null // admin ne sab items chhupa di hon
  return (
    <section id="gallery">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Moments')}</div>
        <h2 className="section-title">{t('Clinic Gallery')}</h2>
        <div className="gallery-grid">
          {images.map((item, i) => {
            const mediaSrc = assetUrl(item.url)
            const alt = item.alt || 'Gallery'
            return (
              <div key={item.url + i} className="gallery-tile" style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', aspectRatio: item.aspectRatio || '4/3' }}>
                <img
                    src={mediaSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="gallery-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onClick={() => openLightbox(mediaSrc, item.alt || '')}
                  />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
