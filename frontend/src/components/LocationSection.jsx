import { useLang } from '../context/LangContext'
import { MapPin, Clock, Phone } from './Icons'
const MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3358.0086842398955!2d68.89045397525325!3d27.692293376191238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3935d5db3efa2dd9%3A0x641357d1a9db8144!2sHomeo%20Dr.%20Syed%20Fawad%20Ahmed%20Zaidi!5e1!3m2!1sen!2s!4v1777822312791!5m2!1sen!2s'

export default function LocationSection() {
  const { t } = useLang()
  return (
    <section id="location">
      <div className="container order-loc-grid">
        <div>
          <div className="badge"><MapPin size={14} /> {t('Visit Us')}</div>
          <h2 className="section-title">{t('Contact Us')}</h2>
          <div className="loc-info glass">
            <div className="loc-row"><MapPin size={16} /><div>{t('Dhak Bazar, Rohri, Sindh')}</div></div>
            <div className="loc-row"><Clock size={16} /><div>{t('Morning 10:00 AM – 1:30 PM')}<br />{t('Evening 5:30 PM – 9:30 PM')}<br />{t('Please call before visiting.')}<br /><strong>{t('Friday OFF')}</strong></div></div>
            <div className="loc-row"><Phone size={16} /><div><strong>{t('Call for appointment')}</strong><br /><span dir="ltr">0333-7189748</span><br /><span dir="ltr">0312-3875580</span><br /><span dir="ltr">0308-3773026</span></div></div>
            <a href="https://maps.app.goo.gl/s87mgaDXwtQs2crEA" className="btn-outline" target="_blank" rel="noreferrer">{t('Open Maps')}</a>
          </div>
        </div>
        <iframe src={MAP} className="map" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Clinic location" />
      </div>
    </section>
  )
}
