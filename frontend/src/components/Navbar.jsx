import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { WhatsApp, Facebook, CartPlus } from './Icons'
import { useNavigate, useLocation } from 'react-router-dom'

const LINKS = [
  ['top', 'Home'],
  ['about', 'About the Doctor'],
  ['dxn-products', 'DXN Products'],
  ['clinic-products', 'Clinic Products'],
  ['gallery', 'Gallery'],
  ['comments', 'Comments'],
  ['contact', 'Contact'],
]

export default function Navbar() {
  const { cartCount, openCart, settings } = useStore()
  const { t, lang, toggle } = useLang()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  /* Single page: link click par us section tak smooth scroll (product page se aaye to pehle home) */
  const go = (e, id) => {
    e.preventDefault(); setOpen(false)
    const scroll = () => {
      const el = id === 'top' ? null : document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (pathname !== '/') { navigate('/'); setTimeout(scroll, 200) } else scroll()
  }

  return (
    <nav>
      <div className="nav-container">
        <a href="/" className="logo" onClick={e => go(e, 'top')}>
          {settings && <img src={assetUrl(settings.logoImg || 'https://i.ibb.co/Q7NhK34X/logo.jpg')} alt={settings.logoImg ? 'Clinic logo' : 'Dr. Fawad'} className="logo-img-circle" />}
          <div className="logo-text"><h2>{t('Riaz Homoeo Clinic')}</h2><p>{t('Rohri · Sindh')}</p><div className="logo-since">{t('Est. Since 1967')}</div></div>
        </a>
        <div className="nav-links">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`/#${id}`} onClick={e => go(e, id)} className="nav-link">{t(label)}</a>
          ))}
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
        {LINKS.map(([id, label]) => (
          <a key={id} href={`/#${id}`} onClick={e => go(e, id)} className="mobile-link">{t(label)}</a>
        ))}
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"><WhatsApp size={16} color="#25D366" /> {t('WhatsApp Order')}</a>
        <a href={FB_URL} target="_blank" rel="noreferrer"><Facebook size={16} color="#8db4ff" /> {t('Facebook')}</a>
      </div>
    </nav>
  )
}
