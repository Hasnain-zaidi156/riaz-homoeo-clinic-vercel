import { useLang } from '../context/LangContext'
import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { Stethoscope, MapPin, WhatsApp, Sprout, Heartbeat, CheckCircle, Facebook } from './Icons'

/* Default paragraphs (jab admin ne koi about text save na kare) */
const DEFAULT_ABOUT = [
  { text: "Dr. Syed Fawad Ahmed Zaidi belongs to the historic city of Rohri, Sindh. He began his homoeopathic practice in 1997. Over nearly three decades, he has continued to serve patients and dedicate himself to their care and treatment." },
  { text: "Dr. Syed Fawad Ahmed Zaidi has a special interest and experience in the homoeopathic treatment of kidney-related conditions. The main aim of his long professional journey is to provide patients with proper guidance, attention, and care." },
  { sub: 'A Family Tradition of Service', text: "Dr. Syed Fawad Ahmed Zaidi's medical practice is a continuation of a longstanding family tradition, founded by his respected father, the late Shaheed Dr. Syed Maqbool Ahmed. The journey that began with his services now spans approximately 60 years." },
  { text: "Carrying forward the tradition established by his father is an honour for Dr. Syed Fawad Ahmed Zaidi. To him, this legacy is more than a profession; it is a continuing journey of service to humanity, sincerity, and responsibility." },
  { sub: 'A Commitment to the Future', text: "Dr. Syed Fawad Ahmed Zaidi hopes this family tradition, begun by his respected father, will be passed on to future generations. He hopes it will continue through his son, and that the spirit of service to people will live on." },
  { text: "With a family medical tradition of about 60 years and nearly three decades of personal experience, Dr. Syed Fawad Ahmed Zaidi is committed to carrying his family's legacy forward." },
  { text: "Dr. Syed Fawad Ahmed Zaidi provides premium homoeopathic treatments in Rohri, specializing in chronic diseases, Kidney, Liver diseases, Stones, Gallbladder, Warts & Skin growths, Hidden Male & Female diseases, Children diseases, immune support, and other diseases." },
  { text: '· Contact before visiting the clinic to have medicine delivered to your home. This service is available for areas other than Rohri & Sukkur.' },
  { text: '· All over Pakistan' },
]

export default function About() {
  const { t } = useLang()
  const { settings } = useStore()
  const [expanded, setExpanded] = useState(false)
  const adminText = (settings && settings.aboutText) || ''

  /* Admin ne About text save kiya -> usi se paragraphs banta hai, warna defaults */
  const paragraphs = useMemo(() => {
    const txt = String(adminText || '').trim()
    if (!txt) return DEFAULT_ABOUT
    return txt.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).map(text => ({ text }))
  }, [adminText])

  const half = Math.max(1, Math.ceil(paragraphs.length / 2))
  const visible = expanded ? paragraphs : paragraphs.slice(0, half)

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
          <h2 className="section-title">{t('About the Doctor')}</h2>
          <div className="divider-line" />
          <p className="gold" style={{ fontWeight: 500, marginBottom: '.9rem' }}>{t('Homoeopathic Practitioner | Nearly Three Decades of Experience')}</p>

          {visible.map((e, i) => (
            <div key={i}>
              {e.sub ? <h4 className="gold about-sub">{e.sub}</h4> : null}
              <p className="section-desc" style={e.sub ? { marginTop: '.5rem' } : i > 0 ? { marginTop: '.8rem' } : undefined}>{e.text}</p>
            </div>
          ))}

          {!expanded && (
            <button
              className="btn btn-outline"
              onClick={() => setExpanded(true)}
              style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            >
              {t('See More')}
            </button>
          )}
          {expanded && (
            <>
              <button
                className="btn btn-outline"
                onClick={() => setExpanded(false)}
                style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              >
                {t('See Less')}
              </button>
            </>
          )}

          <div style={{ marginTop: '1.5rem' }}><a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb"><Facebook size={15} /> {t('Follow on Facebook')}</a></div>
        </div>
      </div>
    </section>
  )
}
