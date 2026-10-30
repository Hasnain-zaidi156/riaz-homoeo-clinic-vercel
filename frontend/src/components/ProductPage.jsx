import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { DELIVERY, WA_ICON, WA_NUMBER } from '../lib/config'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { CartPlus, ChevronLeft, Expand } from './Icons'

/* /product/:id — alag Product Details page (URL se khulta hai, refresh par bhi wahi product).
   Data StoreContext se aata hai jo har page load par DB (/api/products) se taaza fetch hota hai,
   isliye admin ke edits yahan bhi nazar aate hain. Portal => home page ke upar full-screen page. */
export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, status, addToCart, openCart, cartCount, openLightbox, lightbox, cartOpen } = useStore()
  const { t, pick } = useLang()
  const [idx, setIdx] = useState(0)
  const scroller = useRef(null)
  /* URL: /product/65-power-x-neuro-drops => sirf shuru ka number (id) lo, slug ignore */
  const pid = /^\d+/.test(id || '') ? parseInt(id, 10) : null
  const p = pid != null ? products.find(x => x.id === pid) : null

  useEffect(() => { setIdx(0); scroller.current && scroller.current.scrollTo(0, 0) }, [pid])

  useEffect(() => {
    if (pid == null) return
    const prev = document.title
    if (p) document.title = `${p.name} | Riaz Homoeo Clinic`
    return () => { document.title = prev }
  }, [pid, p])

  const listPath = p && p.cat === 'dxn' ? '/products/dxn' : '/products/clinic'
  const goBackOrHome = () => navigate(listPath, { replace: true })

  useEffect(() => {
    if (pid == null) return
    const onKey = e => { if (e.key === 'Escape' && !lightbox && !cartOpen) goBackOrHome() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pid, lightbox, cartOpen])

  if (pid == null) return null

  const imgs = p ? (p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : [])) : []
  const inStock = p && p.stock !== false
  const catLabel = p && p.cat === 'dxn' ? t('DXN Range') : t('Clinic Range')
  const related = p ? products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4) : []

  return createPortal(
    <div className="pd-page" ref={scroller} role="main">
      <header className="pd-bar">
        <div className="pd-bar-in">
          <button type="button" className="pd-back" onClick={goBackOrHome}><ChevronLeft size={16} /> <span>{t('Back to Products')}</span></button>
          <button type="button" className="cart-icon" onClick={openCart} aria-label="Cart"><span>{t('Cart')}</span> <span className="cart-count">{cartCount}</span></button>
        </div>
      </header>

      <div className="container pd-wrap">
        {status !== 'ready' && <p className="pd-msg">{status === 'loading' ? t('Loading products...') : t('Products load nahi ho sake. Page refresh karein ya WhatsApp par order karein.')}</p>}

        {status === 'ready' && !p && (
          <div className="pd-msg">
            <h2 className="section-title">{t('Product not found')}</h2>
            <button type="button" className="btn-primary" onClick={goBackOrHome} style={{ marginTop: '1.2rem' }}>{t('Back to Products')}</button>
          </div>
        )}

        {p && <>
          <nav className="pd-crumbs" aria-label="Breadcrumb">
            <Link to="/">{t('Home')}</Link><span>/</span>
            <Link to={listPath}>{catLabel}</Link><span>/</span><b>{pick(p, 'name')}</b>
          </nav>

          <div className="pd-card glass">
            <div className="pd-gallery">
              <div className="pd-main" onClick={() => imgs[idx] && openLightbox(imgs[idx], p.name)}>
                <img src={imgs[idx] || ''} alt={p.name} decoding="async" />
                <span className="zoom-btn" aria-hidden="true"><Expand size={16} /></span>
                {!inStock && <span className="pd-oos-flag">{t('OUT OF STOCK')}</span>}
              </div>
              {imgs.length > 1 && (
                <div className="pd-thumbs">
                  {imgs.map((s, i) => (
                    <button type="button" key={s + i} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`}>
                      <img src={s} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-info">
              <div className="badge">{catLabel}</div>
              <h1 className="pd-title">{pick(p, 'name')}</h1>
              <div className="pd-price">PKR {p.price}<small>{t('+ delivery')}</small></div>
              <span className={`pd-stock ${inStock ? 'in' : 'out'}`}>{inStock ? t('IN STOCK') : t('OUT OF STOCK')}</span>
              <div className="divider-line" />

              <h3 className="pd-h">{t('Description')}</h3>
              <p className="pd-desc">{pick(p, 'desc')}</p>

              <dl className="pd-specs">
                <div><dt>{t('Category')}</dt><dd>{catLabel}</dd></div>
                <div><dt>{t('Availability')}</dt><dd>{inStock ? t('In Stock') : t('Out of Stock')}</dd></div>
                <div><dt>{t('Product ID')}</dt><dd>#{p.id}</dd></div>
                <div><dt>{t('Delivery Charges')}</dt><dd>PKR {DELIVERY}</dd></div>
              </dl>

              <div className="featured-btns">
                {inStock
                  ? <button type="button" className="btn-primary" onClick={() => addToCart(p.id)}><CartPlus size={14} /> {t('Add to Cart')}</button>
                  : <button type="button" className="btn-primary" disabled aria-disabled="true"><CartPlus size={14} /> {t('Out of Stock')}</button>}
                <a className="btn-primary btn-wa" target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Assalamu Alaikum, I need order: ${p.name} (PKR ${p.price})`)}`}>
                  <img src={WA_ICON} alt="" className="visit" /> {t('Order on WhatsApp')}
                </a>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="pd-related">
              <h2 className="section-title">{t('You May Also Like')}</h2>
              <div className="prod-grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
            </section>
          )}
        </>}
      </div>
    </div>,
    document.body
  )
}
