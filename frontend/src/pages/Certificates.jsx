import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { API, assetUrl } from '../lib/config'
import { galleryImgs } from '../data/gallery'

/* Certificates page — sirf wo gallery items jin ka naam/alt mein 'Certificate' ho. */
export default function Certificates() {
  const { t } = useLang()
  const [items, setItems] = useState(null)

  useEffect(() => {
    let alive = true
    fetch(`${API}/api/gallery`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => alive && setItems(Array.isArray(d) ? d : galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
      .catch(() => alive && setItems(galleryImgs.map(([url, alt]) => ({ url: assetUrl(url), alt, isVideo: false, contentType: 'image/jpeg' }))))
    return () => { alive = false }
  }, [])

  const certs = (items || []).filter(item =>
    String(item.alt || '').toLowerCase().includes('certificate') ||
    String(item.name || '').toLowerCase().includes('certificate')
  )

  return (
    <section id="certificates">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Moments')}</div>
        <h2 className="section-title">{t('Certificates & Registrations')}</h2>
        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{t('Doctor ke degrees aur registration certificates.')}</p>
        {certs.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1rem' }}>{t('No certificates available yet.')}</p>
        ) : (
          <div className="gallery-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {certs.map((item, i) => (
              <div key={item.url + i} className="gallery-tile" style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', aspectRatio: '4/5' }}>
                <img
                  src={assetUrl(item.url)}
                  alt={item.alt || 'Certificate'}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
