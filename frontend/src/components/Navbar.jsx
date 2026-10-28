import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { WhatsApp, Facebook, CartPlus } from './Icons'

const DESKTOP = [['about', 'About'], ['products', 'Products'], ['gallery', 'Gallery'], ['comments', 'Comments'], ['location', 'Location'], ['order', 'Order']]
const MOBILE = [['about', 'About Doctor'], ['products', 'Products'], ['gallery', 'Gallery'], ['comments', 'Comments'], ['location', 'Location'], ['order', 'Order']]

export default function Navbar() {
  const { cartCount, openCart, settings } = useStore()
  const { t, lang, toggle } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <div className="nav-container">
        <a href="#" className="logo">
          {settings && <img src={assetUrl(settings.logoImg || 'https://i.ibb.co/Q7NhK34X/logo.jpg')} alt={settings.logoImg ? 'Clinic logo' : 'Dr. Fawad'} className="logo-img-circle" />}
          <div className="logo-text"><h2>{t('Riaz Homoeo Clinic')}</h2><p>{t('Rohri · Sindh')}</p><div className="logo-since">{t('Est. Since 1967')}</div></div>
        </a>
        <div className="nav-links">
          {DESKTOP.map(([id, label]) => <a key={id} href={`#${id}`}>{t(label)}</a>)}
          <a href={FB_URL} target="_blank" rel="noreferrer" className="fb-link"><Facebook size={13} /> {t('Facebook')}</a>
        </div>
        <div className="nav-right">
          <button type="button" className="lang-btn" onClick={toggle} aria-label="Language">{lang === 'ur' ? 'EN' : 'اردو'}</button>
          <button type="button" className="cart-icon" onClick={openCart} aria-label="Open cart">
            <CartPlus size={16} /> <span>{t('Cart')}</span><span className="cart-count">{cartCount}</span>
          </button>
          <button type="button" className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu${open ? ' show' : ''}`}>
        {MOBILE.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t(label)}</a>)}
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"><WhatsApp size={16} color="#25D366" /> {t('WhatsApp Order')}</a>
        <a href={FB_URL} target="_blank" rel="noreferrer"><Facebook size={16} color="#8db4ff" /> {t('Facebook')}</a>
      </div>
    </nav>
  )
}
