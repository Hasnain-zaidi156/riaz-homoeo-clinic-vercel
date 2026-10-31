import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import { ChevronDown } from './Icons'

const FIRST = 4   // pehle 4 products
const STEP = 6    // "See More" par 6 aur

const MoreBtn = ({ onClick, text, shown, total, what, t }) => (
  <div className="show-more-wrapper">
    <button className="show-more-btn" onClick={onClick}><ChevronDown size={15} /> {text}</button>
    <div className="show-more-progress">{t('Showing')} <span>{shown}</span> {t('of')} <span>{total}</span> {t(what)} {t('products')}</div>
  </div>
)

/* Aik category ki grid: pehle 4, phir har "See More" par 6 */
function Range({ id, title, list, what, status, t }) {
  const [visible, setVisible] = useState(FIRST)
  const [revealFrom, setRevealFrom] = useState(null)
  const more = () => { setRevealFrom(visible); setVisible(v => Math.min(v + STEP, list.length)) }
  return (
    <div className="products-cat-block" id={id}>
      <h3 className="products-cat-title">{t(title)}</h3>
      <div className="prod-grid">
        {status !== 'ready' && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: .6, padding: '2rem 0' }}>
            {status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}
          </p>
        )}
        {status === 'ready' && <>
          {list.slice(0, visible).map((p, i) => (
            <ProductCard key={p.id} p={p} eager={i < 4} reveal={revealFrom != null && i >= revealFrom} delay={revealFrom != null ? (i - revealFrom) * 0.07 : 0} />
          ))}
          {list.length > visible &&
            <MoreBtn t={t} onClick={more} text={t('Show {n} More ' + what + ' Products', { n: Math.min(STEP, list.length - visible) })} shown={visible} total={list.length} what={what.toLowerCase()} />}
        </>}
      </div>
    </div>
  )
}

export default function Products() {
  const { products, status } = useStore()
  const { t } = useLang()
  const dxn = products.filter(p => p.cat === 'dxn')
  const clinic = products.filter(p => p.cat === 'clinic')
  return (
    <section id="products">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Curated Collection')}</div>
        <h2 className="section-title">{t('Top Products')}</h2>
        <Range id="dxn-products" title="DXN Range" list={dxn} what="DXN" status={status} t={t} />
        <Range id="clinic-products" title="Clinic Range" list={clinic} what="Clinic" status={status} t={t} />
      </div>
    </section>
  )
}
