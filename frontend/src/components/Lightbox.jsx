import { useStore } from '../context/StoreContext'
import { Times, Play, VolumeUp, VolumeMute } from './Icons'
import { useRef, useState, useCallback, useEffect } from 'react'

export default function Lightbox() {
  const { lightbox, closeLightbox } = useStore()
  if (!lightbox) return null

  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const isVideo = lightbox.isVideo === true
  const mediaSrc = lightbox.src || ''

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)) }
    else { v.pause(); setIsPlaying(false) }
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const muted = !isMuted
    v.muted = muted
    setIsMuted(muted)
  }, [isMuted])

  const handlePlay = useCallback(() => setIsPlaying(true), [])
  const handlePause = useCallback(() => setIsPlaying(false), [])

  const onKey = useCallback(e => {
    if (e.key === 'Escape') closeLightbox()
  }, [closeLightbox])

  useEffect(() => {
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onKey])

  return (
    <div className="lightbox-overlay open" onClick={e => e.target === e.currentTarget && closeLightbox()}>
      <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><Times size={18} /></button>
      <div className="lightbox-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
        {isVideo ? (
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh', background: '#000', borderRadius: '10px', overflow: 'hidden', outline: 'none' }}>
            <video
              ref={videoRef}
              src={mediaSrc}
              alt={lightbox.alt || ''}
              preload="metadata"
              playsInline
              webkit-playsinline
              onPlay={handlePlay}
              onPause={handlePause}
              onClick={togglePlay}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
            {isPlaying && (
              <div style={{
                position: 'absolute', bottom: 12, right: 12, left: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px',
                borderRadius: 6, fontSize: '0.85rem', backdropFilter: 'blur(4px)', zIndex: 5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button type="button" onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginRight: 6 }}>
                    {isPlaying ? <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="7" width={4} height={10} /><rect x="14" y="7" width={4} height={10} /></svg> : <Play size={16} />}
                  </button>
                  <button type="button" onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    {isMuted ? <VolumeMute size={16} /> : <VolumeUp size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <img src={mediaSrc} alt={lightbox.alt || ''} className="lightbox-img" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.4)' }} />
        )}
      </div>
      {lightbox.alt && (
        <div className="lightbox-caption" onClick={e => e.stopPropagation()}>{lightbox.alt}</div>
      )}
    </div>
  )
}
