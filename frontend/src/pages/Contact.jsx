import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { MapPin, Clock, Phone, WhatsApp, Facebook } from '../components/Icons'
import { FB_URL, WA_ICON, WA_NUMBER } from '../lib/config'

export default function Contact() {
  const { t } = useLang()
  const { settings } = useStore()

  return (
    <section id="contact">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="badge">{t('Visit Us')}</div>
        <h2 className="section-title">{t('Contact & location')}</h2>
        <div className="order-loc-grid" style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
          <div className="loc-info glass" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div className="loc-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
              <MapPin size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{t('Address')}</div>
                <div style={{ color: 'rgba(255,255,255,.88)', fontSize: '.92rem', lineHeight: 1.6 }}>{t('Dhak Bazar, Rohri, Sindh')}</div>
              </div>
            </div>
            <div className="loc-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
              <Clock size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{t('Opening hours')}</div>
                <div style={{ color: 'rgba(255,255,255,.88)', fontSize: '.92rem', lineHeight: 1.6 }}>
                  {t('Morning 10:00 AM – 1:30 PM')}<br />
                  {t('Evening 5:30 PM – 9:30 PM')}<br />
                  {t('Please call before visiting.')}
                </div>
              </div>
            </div>
            <div className="loc-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
              <Phone size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{t('Call / WhatsApp')}</div>
                <div style={{ color: 'rgba(255,255,255,.88)', fontSize: '.92rem', lineHeight: 1.6 }}>
                  <span dir="ltr">0333-7189748</span><br />
                  <span dir="ltr">0312-3875580</span>
                </div>
              </div>
            </div>
            <div className="loc-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <WhatsApp size={16} color="#25D366" style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{t('WhatsApp')}</div>
                <a href={`https://wa.me/${WA_NUMBER}?text=Assalamu+Alaikum,+I+need+order`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)', textDecoration: 'underline', fontSize: '.92rem' }}>
                  <span dir="ltr">0312-3875580</span>
                </a>
              </div>
            </div>
          </div>
          <div className="map" style={{ minHeight: '380px', borderRadius: '2rem', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3358.0086842398955!2d68.89045397525325!3d27.692293376191238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3935d5db3efa2dd9%3A0x641357d1a9db8144!2sHomeo%20Dr.%20Syed%20Fawad%20Ahmed%20Zaidi!5e1!3m2!1sen!2s!4v1777822312791!5m2!1sen!2s"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Clinic location"
              style={{ width: '100%', height: '100%', minHeight: '380px', border: 0, borderRadius: 'calc(2rem - 8px)', display: 'block' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb" style={{ marginRight: '8px' }}><Facebook size={15} /> {t('Follow on Facebook')}</a>
          <a href={`https://wa.me/${WA_NUMBER}?text=Assalamu+Alaikum,+I+need+order`} className="btn-primary btn-wa"><img src={WA_ICON} alt="" className="visit" /> {t('Chat on WhatsApp')}</a>
        </div>
      </div>
    </section>
  )
}
