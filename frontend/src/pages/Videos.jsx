import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { API, assetUrl } from '../lib/config'
import { galleryImgs } from '../data/gallery'
import VideoPlayer from '../components/VideoPlayer'

/* Videos page — sirf wo gallery items jo video hain. */
export default function VideosPage() {
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

  const videos = (items || []).filter(item => item.isVideo === true)

  return (
    <section id="videos">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Moments')}</div>
        <h2 className="section-title">{t('Videos')}</h2>
        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{t('Clinic videos — tap kar ke play karein.')}</p>
        {videos.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1rem' }}>{t('No videos available yet.')}</p>
        ) : (
          <div className="video-page-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {videos.map((item, i) => (
              <div key={item.url + i} className="video-tile" style={{ background: '#000', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16 / 9' }}>
                <VideoPlayer src={assetUrl(item.url)} alt={item.alt || 'Video'} poster={''} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
