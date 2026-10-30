import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import ImageSlider from './ImageSlider'
import ExpandableText from './ExpandableText'
import { CartPlus } from './Icons'
import { Link, useNavigate } from 'react-router-dom'

export default function ProductCard({ p, eager = false, reveal = false, delay = 0 }) {
  const { addToCart } = useStore()
  const { t, pick } = useLang()
  const navigate = useNavigate()
  const list = p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : [])
  /* Stock: DB field `stock` — admin toggle. Default true (purane products). */
  const inStock = p.stock !== false
  const href = `/product/${p.id}${pick(p, 'name') ? '-' + String(pick(p, 'name')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) : ''}`
  /* Card/image/name click => product details page. Buttons, slider controls, links, See More ignore. */
  const open = e => {
    if (e.target.closest('button, a, .sdot, .expandable')) return
    navigate(href)
  }
  const openLink = e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return   // new tab normal chale
    e.preventDefault(); navigate(href)
  }
  return (
    <div className={`product-card glass clickable${reveal ? ' just-revealed' : ''}${inStock ? '' : ' oos'}`} style={reveal ? { animationDelay: `${delay}s` } : undefined} onClick={open}>
      <div className="product-img-box">
        {/* ===== STOCK RIBBON (corner fold, reference jaisa) ===== */}
        {inStock
          ? <span className="stock-ribbon in">{t('IN STOCK')}</span>
          : <span className="stock-ribbon out">{t('OUT OF STOCK')}</span>}
        {list.length > 1
          ? <ImageSlider images={list} alt={p.name} eager={eager} />
          : <img src={list[0] || ''} alt={p.name} loading={eager ? 'eager' : 'lazy'} decoding="async" className="single-img" />}
        <span className="product-cat-label">{p.cat === 'dxn' ? t('DXN Range') : t('Clinic Range')}</span>
      </div>
      <div className="product-info">
        <h4><Link to={href} onClick={openLink} className="product-link">{pick(p, 'name')}</Link></h4>
        <ExpandableText className="product-desc" text={pick(p, 'desc')} lines={4} />
        <div className="product-price">PKR {p.price}</div>
        {inStock
          ? <button className="add-cart" onClick={() => addToCart(p.id)}><CartPlus size={14} /> {t('Add to Cart')}</button>
          : <button className="add-cart" disabled aria-disabled="true"><CartPlus size={14} /> {t('Out of Stock')}</button>}
      </div>
    </div>
  )
}
