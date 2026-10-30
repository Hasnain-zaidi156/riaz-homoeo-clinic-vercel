import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { Sparkles } from '../components/Icons'

const DXN_PAGE = 8

export default function DXNProducts() {
  const { products, status } = useStore()
  const { t } = useLang()
  const [visible, setVisible] = useState(DXN_PAGE)
  const [revealFrom, setRevealFrom] = useState(null)

  const dxn = products.filter(p => p.cat === 'dxn')
  const more = () => setVisible(v => Math.min(v + DXN_PAGE, dxn.length))

  return (
    <>
    <section id="dxn-products">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Curated Collection')}</div>
        <h2 className="section-title">{t('DXN Range')}</h2>
        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{t('Reishi mushroom based supplements — immunity, energy & longevity')}</p>
        <div className="prod-grid">
          {status !== 'ready' && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: .6, padding: '2rem 0' }}>
              {status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}
            </p>
          )}
          {status === 'ready' && <>
            {dxn.map((p, i) => (
              <ProductCard key={p.id} p={p} eager={i < 4} reveal={revealFrom != null && i >= revealFrom} delay={revealFrom != null ? (i - revealFrom) * 0.07 : 0} />
            ))}
            {dxn.length > visible && (
              <button className="show-more-btn" onClick={more} style={{ gridColumn: '1/-1', margin: '1rem auto 0', padding: '.75rem 2rem', background: 'var(--glass)', color: 'var(--gold-light)', border: '1.5px solid rgba(var(--acc),.55)', borderRadius: '60px', cursor: 'pointer' }}>
                {t('Show {n} More DXN Products', { n: Math.min(DXN_PAGE, dxn.length - visible) })}
              </button>
            )}
          </>}
        </div>
      </div>
    </section>
    </>
  )
}
