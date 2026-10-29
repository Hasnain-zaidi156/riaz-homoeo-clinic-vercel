import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { Stethoscope, MapPin, WhatsApp, Sprout, Heartbeat, CheckCircle, Facebook } from './Icons'

export default function About() {
  const { t } = useLang()
  const { settings } = useStore()
  return (
    <section id="about">
      <div className="container about-grid">
        <div className="doctor-profile glass">
          {settings && <img src={assetUrl(settings.doctorAboutImg || 'https://i.ibb.co/PZvDc5qS/image.png')} alt="Dr. Syed Fawad Ahmed Zaidi" className="doctor-photo-about" />}
          <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.8rem' }}>{t('Dr. Syed Fawad')}<br />{t('Ahmed Zaidi')}</h3>
          <p className="gold" style={{ fontWeight: 500 }}>{t('DHMS-RHMP · Homoeopathic Consultant')}</p>
          <div className="info-row">
            <div className="info-item"><Stethoscope size={15} className="gold" /> {t('30+ Years experience')}</div>
            <div className="info-item"><MapPin size={15} className="gold" /> {t('Dhak Bazar, Rohri')}</div>
            <div className="info-item"><WhatsApp size={15} className="gold" /> <span dir="ltr">0333-7189748</span></div>
            <div className="info-item"><Sprout size={15} className="gold" /> {t('Homoeopathy Specialist')}</div>
          </div>
          <a href={`https://wa.me/${WA_NUMBER}?text=Doctor+Sahab+consultation+chahiye`} className="btn-primary btn-wa" style={{ width: '100%' }}>
            <img src={WA_ICON} alt="" className="visit" /> {t('Book Consultation')}
          </a>
        </div>
        <div>
          <div className="badge"><Heartbeat size={14} /> {t('Holistic Healing')}</div>
          <h2 className="section-title">{t('About Us')}</h2>
          <div className="divider-line" />
          <p className="gold" style={{ fontWeight: 500, marginBottom: '.9rem' }}>{t('Homoeopathic Practitioner | Nearly Three Decades of Experience')}</p>
          <p className="section-desc">{t("Dr. Syed Fawad Ahmed Zaidi belongs to the historic city of Rohri, Sindh. He began his homoeopathic practice in 1997. Over nearly three decades, he has continued to serve patients and dedicate himself to their care and treatment.")}</p>
          <p className="section-desc" style={{ marginTop: '.8rem' }}>{t("Dr. Syed Fawad Ahmed Zaidi has a special interest and experience in the homoeopathic treatment of kidney-related conditions. The main aim of his long professional journey is to provide patients with proper guidance, attention, and care.")}</p>
          <h4 className="gold about-sub">{t('A Family Tradition of Service')}</h4>
          <p className="section-desc">{t("Dr. Syed Fawad Ahmed Zaidi's medical practice is a continuation of a longstanding family tradition, founded by his respected father, the late Shaheed Dr. Syed Maqbool Ahmed. The journey that began with his services now spans approximately 60 years.")}</p>
          <p className="section-desc" style={{ marginTop: '.8rem' }}>{t("Carrying forward the tradition established by his father is an honour for Dr. Syed Fawad Ahmed Zaidi. To him, this legacy is more than a profession; it is a continuing journey of service to humanity, sincerity, and responsibility.")}</p>
          <h4 className="gold about-sub">{t('A Commitment to the Future')}</h4>
          <p className="section-desc">{t("Dr. Syed Fawad Ahmed Zaidi hopes this family tradition, begun by his respected father, will be passed on to future generations. He hopes it will continue through his son, and that the spirit of service to people will live on.")}</p>
          <p className="section-desc" style={{ marginTop: '.8rem' }}>{t("With a family medical tradition of about 60 years and nearly three decades of personal experience, Dr. Syed Fawad Ahmed Zaidi is committed to carrying his family's legacy forward.")}</p>
          <p className="section-desc" style={{ marginTop: '1.2rem' }}><span className="desc-line">{t('Dr. Syed Fawad Ahmed Zaidi provides premium homoeopathic treatments in Rohri, specializing in chronic diseases, Kidney, Liver diseases, Stones, Gallbladder, Warts & Skin growths, Hidden Male & Female diseases, Children diseases, immune support, and other diseases.')}</span></p>
          <p className="section-desc" style={{ marginTop: '1rem' }}>
            <span className="desc-line"><CheckCircle size={14} className="gold" /> {t('100% natural remedies')}</span>
            <span className="desc-line">{t('· Contact before visiting the clinic to have medicine delivered to your home. This service is available for areas other than Rohri & Sukkur.')}</span>
            <span className="desc-line">{t('· All over Pakistan')}</span>
          </p>
          <div style={{ marginTop: '1.5rem' }}><a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb"><Facebook size={15} /> {t('Follow on Facebook')}</a></div>
        </div>
      </div>
    </section>
  )
}
