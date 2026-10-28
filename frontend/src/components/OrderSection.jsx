import { useLang } from '../context/LangContext'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER } from '../lib/config'
import { Clipboard, WhatsApp, Facebook } from './Icons'

export default function OrderSection() {
  const { openWA } = useStore()
  const { t } = useLang()
  const [f, setF] = useState({ name: '', phone: '', address: '', products: '' })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  const send = () => {
    const n = f.name.trim(), p = f.phone.trim()
    if (!n || !p) { alert('Please fill name and phone number'); return }
    openWA(`New Order - Riaz Homoeo Clinic\n\nName: ${n}\nPhone: ${p}\nAddress: ${f.address.trim()}\nProducts: ${f.products.trim()}`)
  }
  return (
    <section id="order">
      <div className="container order-loc-grid">
        <div>
          <div className="badge"><img src={WA_ICON} alt="" className="visit" /> {t('Easy Order')}</div>
          <h2 className="section-title">{t('Order via WhatsApp')}</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', margin: '1rem 0' }}>{t('Send product name, quantity, address — delivery across Pakistan, Online Payment Easypaisa (0333-7189748).')}</p>
          <div style={{ margin: '1.2rem 0' }}><WhatsApp size={22} color="#25D366" /> <strong>0333-7189748</strong></div>
          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${WA_NUMBER}`} className="btn-primary btn-wa"><img src={WA_ICON} alt="" className="visit" /> {t('Direct WhatsApp')}</a>
            <a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb"><Facebook size={15} /> {t('Facebook Page')}</a>
          </div>
        </div>
        <div className="order-card glass">
          <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.5rem' }}><Clipboard size={19} className="gold" style={{ verticalAlign: '-0.15em' }} /> {t('Quick Order Form')}</h3>
          <input type="text" className="input-field" placeholder={t('Full Name')} value={f.name} onChange={set('name')} />
          <input type="tel" className="input-field" placeholder={t('Phone Number')} value={f.phone} onChange={set('phone')} />
          <input type="text" className="input-field" placeholder={t('Delivery Address')} value={f.address} onChange={set('address')} />
          <textarea className="input-field" rows="2" placeholder={t('Product name & quantity')} value={f.products} onChange={set('products')} />
          <button className="btn-primary btn-wa" style={{ width: '100%', marginTop: '.5rem' }} onClick={send}>
            <img src={WA_ICON} alt="" className="visit" /> {t('Send Order on WhatsApp')}
          </button>
        </div>
      </div>
    </section>
  )
}
