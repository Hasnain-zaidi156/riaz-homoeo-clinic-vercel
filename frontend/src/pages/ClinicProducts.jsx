import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { Sparkles } from '../components/Icons'

const CLINIC_PAGE = 8

export default function ClinicProducts() {
  const { products, status } = useStore()
  const { t } = useLang()
  const [visible, setVisible] = useState(CLINIC_PAGE)
  const [revealFrom, setRevealFrom] = useState(null)

  const clinic = products.filter(p => p.cat === 'clinic')
  const more = () => setVisible(v => Math.min(v + CLINIC_PAGE, clinic.length))

  return (
    <>
    <section id="clinic-products">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Curated Collection')}</div>
        <h2 className="section-title">{t('Clinic Range')}</h2>
        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{t('Premium homoeopathic medicines for chronic and everyday health concerns')}</p>
        <div className="prod-grid">
          {status !== 'ready' && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: .6, padding: '2rem 0' }}>
              {status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}
            </p>
          )}
          {status === 'ready' && <>
            {clinic.map((p, i) => (
              <ProductCard key={p.id} p={p} eager={i < 4} reveal={revealFrom != null && i >= revealFrom} delay={revealFrom != null ? (i - revealFrom) * 0.07 : 0} />
            ))}
            {clinic.length > visible && (
              <button className="show-more-btn" onClick={more} style={{ gridColumn: '1/-1', margin: '1rem auto 0', padding: '.75rem 2rem', background: 'var(--glass)', color: 'var(--gold-light)', border: '1.5px solid rgba(var(--acc),.55)', borderRadius: '60px', cursor: 'pointer' }}>
                {t('Show {n} More Clinic Products', { n: Math.min(CLINIC_PAGE, clinic.length - visible) })}
              </button>
            )}
          </>}
        </div>
      </div>
    </section>
    </>
  )
}
