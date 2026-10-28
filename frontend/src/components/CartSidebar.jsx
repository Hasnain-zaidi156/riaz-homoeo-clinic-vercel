import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { DELIVERY, WA_ICON } from '../lib/config'
import { Bag, Times, User, Pencil, Phone, MapPin, Trash, InfoCircle } from './Icons'

const Line = ({ icon, text }) => <div className="contact-detail-line">{icon}<span>{text}</span></div>

export default function CartSidebar() {
  const { cart, cartOpen, closeCart, changeQty, removeItem, subtotal, info, openInfoModal, checkout } = useStore()
  const { t, pick } = useLang()
  const hasInfo = info && (info.name || info.phone || info.address)
  const row = { display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,.65)' }
  return (
    <>
      <div className={`cart-overlay${cartOpen ? ' open' : ''}`} onClick={closeCart} />
      <aside className={`cart-sidebar${cartOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem' }}><Bag size={16} className="gold" /> {t('Your Cart')}</h3>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: '1.2rem', cursor: 'pointer' }} aria-label="Close"><Times size={18} /></button>
        </div>
        <div className="contact-box">
          <div className="contact-box-header">
            <span><User size={13} style={{ marginRight: 5 }} />{t('For Contact')}</span>
            <button className="edit-info-btn" onClick={() => openInfoModal(true)}><Pencil size={11} /> {t('Edit')}</button>
          </div>
          {hasInfo ? <>
            {info.name && <Line icon={<User size={14} />} text={info.name} />}
            {info.phone && <Line icon={<Phone size={14} />} text={info.phone} />}
            {info.address && <Line icon={<MapPin size={14} />} text={info.address} />}
          </> : <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)' }}><InfoCircle size={13} style={{ marginRight: 5 }} />{t('Abhi koi info save nahi')}</div>}
        </div>
        <div style={{ flex: 1, margin: '.5rem 0', overflowY: 'auto' }}>
          {cart.length ? cart.map(i => (
            <div key={i.id} className="cart-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.83rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick(i, 'name')}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--gold-light)', marginTop: 3, fontWeight: 600 }}>{i.price * i.qty} PKR</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <button className="qty-btn" onClick={() => changeQty(i.id, -1)}>−</button>
                <span style={{ fontSize: '.9rem', fontWeight: 700, minWidth: 22, textAlign: 'center' }}>{i.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(i.id, 1)}>+</button>
                <button className="trash-btn" onClick={() => removeItem(i.id)} aria-label="Remove"><Trash size={15} /></button>
              </div>
            </div>
          )) : (
            <p style={{ opacity: .55, marginTop: '1.5rem', fontSize: '.85rem', textAlign: 'center' }}>
              <Bag size={30} style={{ display: 'block', margin: '0 auto .5rem', opacity: .4 }} />{t('Cart khali hai')}
            </p>
          )}
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', fontSize: '.85rem', lineHeight: 2.2 }}>
          <div style={row}><span>{t('Subtotal')}</span><span>{subtotal} PKR</span></div>
          <div style={row}><span>{t('Delivery')}</span><span>{DELIVERY} PKR</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '.95rem', color: 'var(--gold-light)', borderTop: '1px solid rgba(var(--acc),.25)', paddingTop: 6, marginTop: 4 }}>
            <span>{t('Total')}</span><span>{subtotal + DELIVERY} PKR</span>
          </div>
        </div>
        <button className="btn-primary btn-wa" style={{ width: '100%', marginTop: '1rem' }} onClick={checkout}><img src={WA_ICON} alt="" className="visit" /> {t('Complete Order')}</button>
        <button className="btn-outline" style={{ width: '100%', marginTop: '.5rem' }} onClick={closeCart}>{t('Close')}</button>
      </aside>
    </>
  )
}
