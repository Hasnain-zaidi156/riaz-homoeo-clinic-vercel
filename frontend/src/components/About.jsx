import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER } from '../lib/config'
import { Stethoscope, MapPin, WhatsApp, Sprout, Heartbeat, CheckCircle, Facebook } from './Icons'

export default function About() {
  const { t } = useLang()
  const { settings } = useStore()
  return (
    <section id="about">
      <div className="container about-grid">
        <div className="doctor-profile glass">
          <img src={settings?.doctorAboutImg || 'https://i.ibb.co/PZvDc5qS/image.png'} alt="Dr. Syed Fawad Ahmed Zaidi" className="doctor-photo-about" />
          <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.8rem' }}>{t('Dr. Syed Fawad')}<br />{t('Ahmed Zaidi')}</h3>
          <p className="gold" style={{ fontWeight: 500 }}>{t('DHMS-RHMP-BA · Homoeopathic Consultant')}</p>
          <div className="info-row">
            <div className="info-item"><Stethoscope size={15} className="gold" /> {t('30+ Years experience')}</div>
            <div className="info-item"><MapPin size={15} className="gold" /> {t('Dhak Bazar, Rohri')}</div>
            <div className="info-item"><WhatsApp size={15} className="gold" /> <span dir="ltr">0333-7189748</span></div>
            <div className="info-item"><Sprout size={15} className="gold" /> {t('Homoeopathy & DXN Specialist')}</div>
          </div>
          <a href={`https://wa.me/${WA_NUMBER}?text=Doctor+Sahab+consultation+chahiye`} className="btn-primary btn-wa" style={{ width: '100%' }}>
            <img src={WA_ICON} alt="" className="visit" /> {t('Book Consultation')}
          </a>
        </div>
        <div>
          <div className="badge"><Heartbeat size={14} /> {t('Holistic Healing')}</div>
          <h2 className="section-title">{t('Natural Medicine')} <br />{t('Trusted Since')} <span className="gold">1967</span></h2>
          <div className="divider-line" />
          <p className="section-desc"><span className="desc-line">{t('Dr. Syed Fawad Ahmed Zaidi provides premium homoeopathic treatments in Rohri, specializing in chronic diseases, Kidney, Liver diseases, Stones, Gallbladder, Warts & Skin growths, Hidden Male & Female diseases, Children diseases, immune support, and other diseases.')}</span><span className="desc-line">{t('We also offer authentic DXN Ganoderma products for complete wellness — safe, natural, side-effect-free.')}</span></p>
          <p className="section-desc" style={{ marginTop: '1rem' }}>
            <span className="desc-line"><CheckCircle size={14} className="gold" /> {t('100% natural remedies')}</span>
            <span className="desc-line">{t('· Contact before visiting the clinic to have medicine delivered to your home. This service is available for areas other than Rohri & Sukkur.')}</span>
            <span className="desc-line">{t('· Online Payment Easypaisa (0333-7189748)')}</span>
            <span className="desc-line">{t('· All over Pakistan')}</span>
          </p>
          <div style={{ marginTop: '1.5rem' }}><a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb"><Facebook size={15} /> {t('Follow on Facebook')}</a></div>
        </div>
      </div>
    </section>
  )
}
