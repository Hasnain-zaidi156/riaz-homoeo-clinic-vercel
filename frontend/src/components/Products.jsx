import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import ProductPage from './ProductPage'
import { Sparkles, Mushroom, Capsule, ChevronDown } from './Icons'

const DXN_INITIAL = 4, CLINIC_PAGE = 8

const Divider = ({ label, icon, mt }) => (
  <div className="section-divider" style={mt ? { marginTop: mt } : undefined}>
    <div className="section-divider-line" /><div className="section-divider-label">{icon} {label}</div><div className="section-divider-line" />
  </div>
)
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
  const [filter, setFilter] = useState('all')
  const [dxnOpen, setDxnOpen] = useState(false)
  const [clinicVisible, setClinicVisible] = useState(CLINIC_PAGE)
  const [revealFrom, setRevealFrom] = useState(null)

  const dxn = products.filter(p => p.cat === 'dxn')
  const clinic = products.filter(p => p.cat === 'clinic')
  const pick = f => { setFilter(f); setDxnOpen(false); setClinicVisible(CLINIC_PAGE); setRevealFrom(null) }
  const moreClinic = () => { setRevealFrom(clinicVisible); setClinicVisible(v => Math.min(v + CLINIC_PAGE, clinic.length)) }

  const showDxn = filter !== 'clinic', showClinic = filter !== 'dxn'
  const dxnAll = filter === 'dxn' || dxnOpen
  const dxnList = dxnAll ? dxn : dxn.slice(0, DXN_INITIAL)
  const clinicList = clinic.slice(0, clinicVisible)

  return (
    <>
    <section id="products">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge"><Sparkles size={14} className="gold" /> {t('Curated Collection')}</div>
        <h2 className="section-title">{t('Premium Products')}</h2>
        <div className="filter-bar">
          {[['all', 'All'], ['clinic', 'Clinic Range'], ['dxn', 'DXN Range']].map(([f, label]) => (
            <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => pick(f)}>{t(label)}</button>
          ))}
        </div>
        <div className="prod-grid">
          {status !== 'ready' && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: .6, padding: '2rem 0' }}>
              {status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}
            </p>
          )}
          {status === 'ready' && <>
            {filter === 'all' && <Divider icon={<Mushroom size={13} />} label={t('DXN Range')} />}
            {showDxn && cards(dxnList, dxnOpen && filter === 'all' ? DXN_INITIAL : null)}
            {filter === 'all' && !dxnOpen && dxn.length > DXN_INITIAL &&
              <MoreBtn t={t} onClick={() => setDxnOpen(true)} text={t('Show {n} More DXN Products', { n: dxn.length - DXN_INITIAL })} shown={DXN_INITIAL} total={dxn.length} what="DXN" />}
            {filter === 'all' && <Divider icon={<Capsule size={13} />} label={t('Clinic Range')} mt="1.5rem" />}
            {showClinic && cards(clinicList, revealFrom)}
            {showClinic && clinic.length > clinicVisible &&
              <MoreBtn t={t} onClick={moreClinic} text={t('Show {n} More Clinic Products', { n: Math.min(CLINIC_PAGE, clinic.length - clinicVisible) })} shown={clinicVisible} total={clinic.length} what="clinic" />}
          </>}
        </div>
      </div>
    </section>
    <ProductPage />
    </>
  )
}
