import { useLang } from '../context/LangContext'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FEATURED_VIDEO, THUMB_SECONDS, EMBED_SECONDS } from '../config/featuredVideo'
import { WA_ICON, WA_NUMBER } from '../lib/config'
import { Star, CartPlus, VolumeUp, VolumeMute, Expand } from './Icons'

/* Online player links (iframe) vs local .mp4 (native video) */
const isEmbed = url =>
  /screenpal\.com|screencast-o-matic\.com|youtube\.com|youtu\.be|vimeo\.com|\/player\//.test(url)

const embedUrl = url => {
  /* ScreenPal watch link ko player link me convert (autoplay) */
  const m = String(url).match(/screenpal\.com\/(?:watch|embed|player|content|v|video)\/([A-Za-z0-9]+)/)
  if (m) return `https://go.screenpal.com/player/${m[1]}?ff=true&autoplay=true`
  /* YouTube watch -> embed */
  const y = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/)
  if (y) return `https://www.youtube.com/embed/${y[1]}?autoplay=1&mute=0`
  return url
}

/* Main product = backend ka product id 1000 (admin panel se edit hota hai).
   Cycle = 4 sec thumbnail (sirf page load par aik dafa) -> phir video
   hamesha bina rukay repeat hoti hai (koi 4 second ka gap nahi).
   Video par mute/unmute button bhi hai. */
export default function FeaturedProduct() {
  const { products, addToCart, openLightbox } = useStore()
  const { t, pick } = useLang()
  const videoRef = useRef(null)
  /* thumb = shuru ki thumbnail | video = video chal rahi hai */
  const [phase, setPhase] = useState('thumb')
  const [videoOk, setVideoOk] = useState(true)
  /* soundOn = abhi video par awaz chal rahi | userOff = user ne khud mute kiya
     Default: awaz ON rehni chahiye — browser block kare (pehli visit) to
     pehli interaction par khud ON ho jati hai. User khud band kar sakta hai. */
  const [soundOn, setSoundOn] = useState(false)
  const [userOff, setUserOff] = useState(false)
  const [embedKey, setEmbedKey] = useState(0) // embed restart ke liye
  const p = products.find(x => x.id === 1000)

  const img = p ? ((p.imgs && p.imgs[0]) || p.img) : ''
  /* Video: pehle product ki apni video (admin Video URL), warna site setting, warna config link */
  /* v18: admin se Settings tab hata diya gaya, isliye purani DB 'featuredVideo' setting ab ignore hoti hai
     (woh toot'ti link video rok sakti thi). Priority: product ka Video link -> bundled /videos/featured-video.mp4 */
  const [useDefault, setUseDefault] = useState(false) // custom video fail ho to bundled file par wapas
  const custom = (p && p.video) || ''
  const videoSrc = (custom && !useDefault) ? custom : FEATURED_VIDEO
  const embed = videoOk && isEmbed(videoSrc)
  const hasVideo = Boolean(videoSrc) && videoOk
  const isNative = hasVideo && !embed

  /* ---------- 1) Page khula: 4 sec thumbnail, phir permanent video loop ---------- */
  useEffect(() => {
    if (!hasVideo || phase !== 'thumb') return
    const id = setTimeout(() => setPhase('video'), THUMB_SECONDS * 1000)
    return () => clearTimeout(id)
  }, [hasVideo, phase])

  /* ---------- 2) Native .mp4: video phase shuru ho to VOICE ke sath chalana;
     browser block kare (koi interaction nahi abhi) to mute par chalati hai —
     pehli interaction par sound apne aap ON ho jayegi (effect 2d) ---------- */
  const playWithSound = () => {
    const v = videoRef.current; if (!v) return Promise.reject()
    if (userOff) { v.muted = true; setSoundOn(false); return v.play() }
    v.muted = false
    return v.play().then(() => setSoundOn(true)).catch(() => {
      v.muted = true; setSoundOn(false)
      return v.play().then(() => setSoundOn(false)).catch(() => setPhase('video'))
    })
  }

  useEffect(() => {
    if (phase !== 'video' || !isNative) return
    const v = videoRef.current; if (!v) return
    v.currentTime = 0
    playWithSound().catch(() => {})
  }, [phase, isNative, videoSrc])

  /* ---------- 3) Native: video khatam = turant wapas shuru (bina 4 sec gap) ---------- */
  const restartVideo = () => {
    const v = videoRef.current; if (!v) return
    v.currentTime = 0
    playWithSound().catch(() => {})
  }

  /* ---------- 3b) Watchdog: ended event/loop-block miss ho to bhi restart ---------- */
  useEffect(() => {
    if (phase !== 'video' || !isNative) return
    const v = videoRef.current; if (!v) return
    const iv = setInterval(() => {
      if (v.duration && (v.ended || v.currentTime >= v.duration - 0.2)) restartVideo()
    }, 250)
    return () => clearInterval(iv)
  }, [phase, isNative, videoSrc])

  /* ---------- 4) Thumbnail phase (sirf shuru mein): video rukay rahe ---------- */
  useEffect(() => {
    if (!isNative) return
    const v = videoRef.current
    if (phase === 'thumb' && v && !v.paused) { v.pause(); v.currentTime = 0 }
  }, [phase, isNative])

  /* ---------- 5) Embed (ScreenPal/YouTube link) restart timer ---------- */
  useEffect(() => {
    if (phase !== 'video' || !embed || !hasVideo) return
    const id = setTimeout(() => setEmbedKey(k => k + 1), EMBED_SECONDS * 1000)
    return () => clearTimeout(id)
  }, [phase, embed, hasVideo])

  /* ---------- 6) Mute button: user khud awaz ON/OFF kar sakta hai ---------- */
  const toggleMute = e => {
    e.stopPropagation()
    setUserOff(o => {
      const off = !o
      const v = videoRef.current
      if (v) {
        v.muted = off
        if (!off) { v.currentTime = 0; v.play().then(() => setSoundOn(true)).catch(() => { v.muted = true; setSoundOn(false) }) }
        else setSoundOn(false)
      }
      return off
    })
  }

  /* ---------- 2d) Visitor ka PEHLA interaction par sound apne aap ON ----------
     (jab tak user ne khud mute nahi kiya — sound ON rakhte hain) */
  useEffect(() => {
    if (!isNative) return
    const tryUnmute = () => {
      const v = videoRef.current
      if (v && !userOff && v.muted) { v.currentTime = 0; v.muted = false; v.play().then(() => setSoundOn(true)).catch(() => {}) }
    }
    document.addEventListener('pointerdown', tryUnmute, { once: true })
    document.addEventListener('keydown', tryUnmute, { once: true })
    return () => {
      document.removeEventListener('pointerdown', tryUnmute)
      document.removeEventListener('keydown', tryUnmute)
    }
  }, [isNative, userOff])

  /* Products abhi load nahi huay — sab hooks upar ho chuki, ab render null */
  if (!p) return null

  return (
    <section id="featured" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="featured-card glass">
          <div className={`featured-img${phase === 'video' ? ' playing' : ''}`}>
            <img src={img} alt={p.name} loading="lazy" />

            {/* ===== 4s THUMBNAIL (shuru mein) -> VIDEO LOOP FOREVER ===== */}
            {hasVideo && embed && phase === 'video' && (
              <iframe
                key={embedKey}
                className="featured-video iframe"
                src={embedUrl(videoSrc)}
                title={pick(p, 'name')}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                scrolling="no"
              />
            )}
            {isNative && (
              <video
                ref={videoRef}
                className="featured-video"
                src={videoSrc}
                muted
                playsInline
                preload="auto"
                onEnded={restartVideo}
                onError={() => { if (videoSrc !== FEATURED_VIDEO) setUseDefault(true); else setVideoOk(false) }}
              />
            )}
            {hasVideo && (
              <span className="mute-btn" role="button" tabIndex={0}
                aria-label={soundOn ? 'Sound on' : 'Sound off'}
                title={soundOn ? t('Sound on') : t('Sound off')}
                onClick={toggleMute}>
                {soundOn ? <VolumeUp size={15} /> : <VolumeMute size={15} />}
              </span>
            )}
            <span className="zoom-btn" role="button" tabIndex={0} aria-label="View larger image"
              onClick={e => { e.stopPropagation(); openLightbox(img, p.name) }}>
              <Expand size={16} />
            </span>
          </div>
          <div className="featured-info">
            <div className="badge"><Star size={14} /> {t('Featured Product')}</div>
            <h2 className="section-title">{pick(p, 'name')}</h2>
            <div className="divider-line" />
            <p className="section-desc">{pick(p, 'desc')}</p>
            <div className="featured-price">PKR {p.price}<small>{t('+ delivery')}</small></div>
            <div className="featured-btns">
              <button className="btn-primary" onClick={() => addToCart(p.id)}><CartPlus size={14} /> {t('Add to Cart')}</button>
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
