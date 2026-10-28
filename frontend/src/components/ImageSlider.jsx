import { useState } from 'react'
import { ChevronLeft, ChevronRight } from './Icons'

export default function ImageSlider({ images, alt }) {
  const [idx, setIdx] = useState(0)
  const go = d => setIdx(i => (i + d + images.length) % images.length)
  return (
    <div className="img-slider">
      {images.map((s, i) => <img key={s + i} src={s} alt={alt} loading="lazy" className={i === idx ? 'active' : ''} />)}
      <button type="button" className="slider-btn prev" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={16} /></button>
      <button type="button" className="slider-btn next" onClick={() => go(1)} aria-label="Next image"><ChevronRight size={16} /></button>
      <div className="slider-dots">
        {images.map((_, i) => <span key={i} className={`sdot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />)}
      </div>
    </div>
  )
}
