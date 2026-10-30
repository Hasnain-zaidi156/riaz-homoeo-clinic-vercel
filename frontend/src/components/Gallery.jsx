import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { API, assetUrl } from '../lib/config'
import { galleryImgs } from '../data/gallery'
import VideoPlayer from './VideoPlayer'

/* Gallery ki images aur videos admin panel se manage hoti hain.
   Server na chale to data/gallery.js wali purani list dikhai jati hai.
   Layout: seedhi rows, desktop par 4 items har row mein,
   har item apni asli aspect-ratio mein rehti hai. */
export default function Gallery() {
  const { openLightbox } = useStore()
  const { t } = useLang()
  const [items, setItems] = useState(null) // null = load ho rahi hai

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/gallery`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => alive && setItems(Array.isArray(d) ? d : galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
      .catch(() => alive && setItems(galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
    return () => { alive = false }
  }, [])

  if (items && items.length === 0) return null // admin ne sab items chhupa di hon
  return (
    <section id="gallery">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Moments')}</div>
        <h2 className="section-title">{t('Clinic Gallery')}</h2>
        <div className="gallery-grid">
          {(items || []).map((item, i) => {
            const isVideo = item.isVideo === true
            const mediaSrc = assetUrl(item.url)
            const alt = item.alt || 'Gallery'
            return (
              <div key={item.url + i} className="gallery-tile" style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', aspectRatio: item.aspectRatio || '4/3' }}>
                {isVideo ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
                    <video
                      src={mediaSrc}
                      alt={alt}
                      preload="metadata"
                      playsInline
                      webkit-playsinline
                      className="gallery-video"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onClick={() => openLightbox(mediaSrc, alt)}
                    />
                    <div className="gallery-video-badge" style={{
                      position: 'absolute', bottom: 8, left: 8,
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      padding: '4px 8px', borderRadius: 4, fontSize: '0.7rem',
                      backdropFilter: 'blur(4px)', zIndex: 5
                    }}>
                      ▶ {t('Video')}
                    </div>
                  </div>
                ) : (
                  <img
                    src={mediaSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="gallery-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onClick={() => openLightbox(mediaSrc, alt)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
