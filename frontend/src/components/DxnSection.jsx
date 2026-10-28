import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import { WA_ICON, WA_NUMBER } from '../lib/config'
import { Mushroom, Sprout } from './Icons'

export default function DxnSection() {
  const { products } = useStore()
  const { t } = useLang()
  return (
    <section id="dxn">
      <div className="container">
        <div className="dxn-banner">
          <div>
            <div className="badge"><Mushroom size={15} /> {t('Authorized Seller')}</div>
            <h2 className="section-title">{t('DXN Ganoderma')}</h2>
            <p style={{ color: 'rgba(255,255,255,.8)' }}>{t('Reishi mushroom based supplements — immunity, energy & longevity')}</p>
            <a href={`https://wa.me/${WA_NUMBER}`} className="btn-primary" style={{ background: '#fff', color: 'var(--dark2)', marginTop: '1rem' }}>
              <img src={WA_ICON} alt="" className="visit" /> {t('Buy DXN')}
            </a>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprout size={64} className="gold" style={{ filter: 'drop-shadow(0 0 20px rgba(var(--acc),.5))' }} />
          </div>
        </div>
        <div className="prod-grid">
          {products.filter(p => p.cat === 'dxn').map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  )
}
