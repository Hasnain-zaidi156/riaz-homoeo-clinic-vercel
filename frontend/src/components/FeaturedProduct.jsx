import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { WA_ICON, WA_NUMBER } from '../lib/config'
import ExpandableText from './ExpandableText'
import { productPath } from '../lib/router'
import { Star, CartPlus, Expand, VolumeUp, VolumeMute } from './Icons'
import { Link, useNavigate } from 'react-router-dom'

const FEATURED_VIDEO = '/videos/featured-video.mp4'

/* Featured (main) product.
   Video tab tak load/play NAHI hoti jab tak user scroll karke is product tak na pahunche.
   Pahunchne par muted chalti hai (loop), bahar jaye to pause. Sirf aik mute/unmute button. */
export default function FeaturedProduct() {
  const { products, addToCart, openLightbox } = useStore()
  const { t, pick } = useLang()
  const navigate = useNavigate()
  const p = products.find(x => x.id === 1000)

  const boxRef = useRef(null)
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [started, setStarted] = useState(false) // pehli dafa product nazar aaya
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [useDefault, setUseDefault] = useState(false)
  const [failed, setFailed] = useState(false)

  const custom = p && p.video && !/screenpal|youtube|youtu\.be|vimeo|\/player\//.test(p.video) ? p.video : ''
  const videoSrc = custom && !useDefault ? custom : FEATURED_VIDEO

  /* Product screen par aaya? */
  useEffect(() => {
    const el = boxRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setStarted(true)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [!!p])

  /* Nazar aaye to play, nikal jaye to pause */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) {
      v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => {}) })
    } else {
      v.pause()
    }
  }, [inView, started])

  const toggleMute = e => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused && inView) v.play().catch(() => {})
  }

  if (!p) return null
  const img = (p.imgs && p.imgs[0]) || p.img

  return (
    <section id="featured" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="featured-card glass">
          <div ref={boxRef} className={`featured-img${playing ? ' playing' : ''}`}>
            <img src={img} alt={p.name} decoding="async" />
            {started && !failed && (
              <video
                ref={videoRef}
                className="featured-video"
                src={videoSrc}
                muted
                loop
                playsInline
                preload="auto"
                onPlaying={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => { if (videoSrc !== FEATURED_VIDEO) setUseDefault(true); else setFailed(true) }}
              />
            )}
            {started && !failed && playing && (
              <span className="mute-btn" role="button" tabIndex={0}
                aria-label={muted ? 'Sound off' : 'Sound on'}
                title={muted ? t('Sound off') : t('Sound on')}
                onClick={toggleMute}>
                {muted ? <VolumeMute size={15} /> : <VolumeUp size={15} />}
              </span>
            )}
            <span className="zoom-btn" role="button" tabIndex={0} aria-label="View larger image"
              onClick={e => { e.stopPropagation(); openLightbox(img, p.name) }}>
              <Expand size={16} />
            </span>
          </div>
          <div className="featured-info">
            <div className="badge"><Star size={14} /> {t('Featured Product')}</div>
            <h2 className="section-title"><Link to={productPath(p)} className="product-link" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); navigate(productPath(p)) }}>{pick(p, 'name')}</Link></h2>
            <div className="divider-line" />
            <ExpandableText className="section-desc" text={pick(p, 'desc')} lines={4} />
            <div className="featured-price">PKR {p.price}<small>{t('+ delivery')}</small></div>
            <div className="featured-btns">
              <button className="btn-primary" onClick={() => addToCart(p.id)}><CartPlus size={14} /> {t('Add to Cart')}</button>
              <Link className="btn-outline" to={productPath(p)} onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); navigate(productPath(p)) }}>{t('View Details')}</Link>
              <a className="btn-primary btn-wa" target="_blank" rel="noopener noreferrer"
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Assalamu Alaikum, I need order: ${p.name} (PKR ${p.price})`)}`}>
                <img src={WA_ICON} alt="" className="visit" /> {t('Order on WhatsApp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
