import { useLang } from '../context/LangContext'
import { FB_URL, WA_NUMBER } from '../lib/config'
import { WhatsApp, Facebook } from './Icons'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <div className="foot-brand" style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>{t('Riaz Homoeo Clinic')}</div>
          <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.45)', marginTop: '.3rem' }}>{t('Est. Since 1967 · Rohri, Sindh')}</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '.72rem', color: 'rgba(255,255,255,.5)' }}>
          {t('© 2026 Riaz Homoeo Clinic · Dr. Syed Fawad Ahmed Zaidi')}<br />
          <a href="https://hasnain-zaidi.netlify.app/" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: '.65rem' }}>Hasnain Zaidi</a>
        </div>
        <div className="footer-social">
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="wa" aria-label="WhatsApp"><WhatsApp size={18} /></a>
          <a href={FB_URL} target="_blank" rel="noreferrer" className="fb" aria-label="Facebook"><Facebook size={18} /></a>
        </div>
      </div>
    </footer>
  )
}
