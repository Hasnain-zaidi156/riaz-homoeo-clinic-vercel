import { useLang } from '../context/LangContext'
import { WA_ICON, WA_NUMBER } from '../lib/config'
import { WhatsApp } from './Icons'

export default function OrderSection() {
  const { t } = useLang()
  return (
    <section id="order">
      <div className="container">
        <div className="badge">{t('Easy Order')}</div>
        <h2 className="section-title">{t('Order via WhatsApp')}</h2>
        <p style={{ color: 'rgba(255,255,255,.7)', margin: '1rem 0' }}>{t('Send product name, quantity, address — delivery across Pakistan.')}</p>
        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="loc-row"><WhatsApp size={16} color="#25D366" /><div><strong>{t('Call / WhatsApp')}:</strong><br /><span dir="ltr">0312-3875580</span></div></div>
          <a href={`https://wa.me/${WA_NUMBER}?text=Assalamu+Alaikum,+I+need+order`} className="btn-primary btn-wa"><img src={WA_ICON} alt="" className="visit" /> {t('Order on WhatsApp')}</a>
        </div>
      </div>
    </section>
  )
}
