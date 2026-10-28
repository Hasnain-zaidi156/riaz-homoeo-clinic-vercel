import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import ProductPage from './ProductPage'
import { Sparkles, ChevronDown } from './Icons'

const CLINIC_PAGE = 8

const MoreBtn = ({ onClick, text, shown, total, what, t }) => (
  <div className="show-more-wrapper">
    <button className="show-more-btn" onClick={onClick}><ChevronDown size={15} /> {text}</button>
    <div className="show-more-progress">{t('Showing')} <span>{shown}</span> {t('of')} <span>{total}</span> {t(what)} {t('products')}</div>
  </div>
)
const cards = (list, from) => list.map((p, i) => (
  <ProductCard key={p.id} p={p} eager={i < 4} reveal={from != null && i >= from} delay={from != null ? (i - from) * 0.07 : 0} />
))

export default function Products() {
  const { products, status } = useStore()
  const { t } = useLang()
  const [clinicVisible, setClinicVisible] = useState(CLINIC_PAGE)
  const [revealFrom, setRevealFrom] = useState(null)

  const clinic = products.filter(p => p.cat === 'clinic')
  const moreClinic = () => { setRevealFrom(clinicVisible); setClinicVisible(v => Math.min(v + CLINIC_PAGE, clinic.length)) }

  return (
    <>
    <section id="products">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Curated Collection')}</div>
        <h2 className="section-title">{t('Top Products')}</h2>
        <div className="prod-grid">
          {status !== 'ready' && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: .6, padding: '2rem 0' }}>
              {status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}
            </p>
          )}
          {status === 'ready' && <>
            {cards(clinic.slice(0, clinicVisible), revealFrom)}
            {clinic.length > clinicVisible &&
              <MoreBtn t={t} onClick={moreClinic} text={t('Show {n} More Clinic Products', { n: Math.min(CLINIC_PAGE, clinic.length - clinicVisible) })} shown={clinicVisible} total={clinic.length} what="clinic" />}
          </>}
        </div>
      </div>
    </section>
    <ProductPage />
    </>
  )
}
