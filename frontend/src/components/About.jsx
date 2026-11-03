import { useLang } from '../context/LangContext'
import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { Stethoscope, MapPin, WhatsApp, Sprout, Heartbeat, CheckCircle, Facebook } from './Icons'

/* Default paragraphs (jab admin ne koi about text save na kare) */
const DEFAULT_ABOUT = [
  { sub: 'Professional Profile', text: "Dr. Syed Fawad Ahmed Zaidi belongs to the historic city of Rohri, Sindh, Pakistan. He began his homoeopathic practice in 1997 and has since dedicated his professional journey to patient care and service to humanity." },
  { text: "With nearly three decades of experience, he remains committed to providing patients with attentive care, appropriate guidance, and a responsible approach to homoeopathic practice." },
  { sub: 'Area of Special Interest', lead: 'Homoeopathic Care for Kidney-Related Conditions', text: "Dr. Syed Fawad Ahmed Zaidi has a particular interest and professional experience in the homoeopathic management of kidney-related conditions. His approach emphasizes individual patient needs, careful attention, and appropriate guidance throughout the course of care." },
  { sub: 'A Family Legacy of Healing and Service', text: "Dr. Syed Fawad Ahmed Zaidi's professional journey is a continuation of a longstanding family tradition established by his respected father, Late Shaheed Dr. Syed Maqbool Ahmed." },
  { text: "The tradition founded by his father has now extended over approximately 60 years, representing a family commitment to patient care, dedication, and service to humanity." },
  { text: "For Dr. Syed Fawad Ahmed Zaidi, carrying this tradition forward is both an honour and a responsibility. He regards this inheritance as more than a profession; it is an enduring commitment to sincerity, compassion, and service to others." },
  { sub: 'A Vision for Future Generations', text: "Dr. Syed Fawad Ahmed Zaidi aspires to pass this valuable family tradition on to future generations. Insha'Allah, he hopes that his son will continue this journey, preserving the family's commitment to service and keeping its spirit alive for years to come." },
  { sub: 'Professional Commitment', text: "With nearly three decades of personal professional experience and a family tradition spanning approximately six decades, Dr. Syed Fawad Ahmed Zaidi remains committed to honouring his father's example and carrying forward the values of dedication, integrity, and compassionate patient care." },
]

export default function About() {
  const { t } = useLang()
  const { settings } = useStore()
  const [expanded, setExpanded] = useState(false)
  const adminText = '' /* About text ab sirf is file + i18n/ur.js se aata hai (DB override band) */

  /* Admin ne About text save kiya -> usi se paragraphs banta hai, warna defaults */
  const paragraphs = useMemo(() => {
    const txt = String(adminText || '').trim()
    if (!txt) return DEFAULT_ABOUT
    return txt.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).map(text => ({ text, raw: true }))
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
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t('Doctor, I need a consultation.'))}`} className="btn-primary btn-wa" style={{ width: '100%' }}>
            <img src={WA_ICON} alt="" className="visit" /> {t('Book Consultation')}
          </a>
        </div>
        <div>
          <div className="badge"><Heartbeat size={14} /> {t('Holistic Healing')}</div>
          <h2 className="section-title">{t('About the Doctor')}</h2>
          <div className="divider-line" />
          <p className="gold" style={{ fontWeight: 500, marginBottom: '.9rem' }}>{t('Professional Homoeopathic Practitioner | Nearly Three Decades of Professional Experience')}</p>

          {visible.map((e, i) => (
            <div key={i}>
              {e.sub ? <h4 className="gold about-sub">{t(e.sub)}</h4> : null}
              {e.lead ? <p className="about-lead">{t(e.lead)}</p> : null}
              <p className="section-desc" style={e.sub ? { marginTop: '.5rem' } : i > 0 ? { marginTop: '.8rem' } : undefined}>{e.raw ? e.text : t(e.text)}</p>
            </div>
          ))}

          {expanded && !adminText.trim() && (
            <div className="about-closing">
              <p className="about-quote">{t('“A Legacy of Healing. A Tradition of Service. A Commitment to Future Generations.”')}</p>
              <p className="about-dua">{t('Alhamdulillah — All healing is by the will of Allah Almighty.')}</p>
            </div>
          )}

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