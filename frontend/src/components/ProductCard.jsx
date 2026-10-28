import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import ImageSlider from './ImageSlider'
import { CartPlus } from './Icons'

export default function ProductCard({ p, eager = false, reveal = false, delay = 0 }) {
  const { addToCart } = useStore()
  const { t, pick } = useLang()
  const list = p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : [])
  /* Stock: DB field `stock` — admin toggle. Default true (purane products). */
  const inStock = p.stock !== false
  return (
    <div className={`product-card glass${reveal ? ' just-revealed' : ''}${inStock ? '' : ' oos'}`} style={reveal ? { animationDelay: `${delay}s` } : undefined}>
      <div className="product-img-box">
        {/* ===== STOCK RIBBON (corner fold, reference jaisa) ===== */}
        {inStock
          ? <span className="stock-ribbon in">{t('IN STOCK')}</span>
          : <span className="stock-ribbon out">{t('OUT OF STOCK')}</span>}
        {list.length > 1
          ? <ImageSlider images={list} alt={p.name} eager={eager} />
          : <img src={list[0] || ''} alt={p.name} loading={eager ? 'eager' : 'lazy'} decoding="async" className="single-img" />}
        <span className="product-cat-label">{p.cat === 'dxn' ? t('DXN Range') : t('Clinic')}</span>
      </div>
      <div className="product-info">
        <h4>{pick(p, 'name')}</h4>
        <p className="product-desc">{pick(p, 'desc')}</p>
        <div className="product-price">PKR {p.price}</div>
        {inStock
          ? <button className="add-cart" onClick={() => addToCart(p.id)}><CartPlus size={14} /> {t('Add to Cart')}</button>
          : <button className="add-cart" disabled aria-disabled="true"><CartPlus size={14} /> {t('Out of Stock')}</button>}
      </div>
    </div>
  )
}
