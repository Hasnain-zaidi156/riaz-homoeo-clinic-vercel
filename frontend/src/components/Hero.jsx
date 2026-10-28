import { useLang } from '../context/LangContext'
import { useStore } from '../context/StoreContext'
import { FB_URL, WA_ICON, WA_NUMBER, assetUrl } from '../lib/config'
import { Star4, Facebook } from './Icons'

function Person({ src, alt, name, small }) {
  return (
    <div className="hero-person-wrap glass">
      {src && <img src={src} alt={alt} className="hero-doctor-img" />}
      <p className="hero-person-name">{name}{small && <><br /><small>{small}</small></>}</p>
    </div>
  )
}

export default function Hero() {
  const { t, lang } = useLang()
  const { settings } = useStore()
  const imgLeft = settings ? assetUrl(settings.doctorLeftImg || 'https://i.ibb.co/fVQn2rmQ/image.png') : ''
  const imgRight = settings ? assetUrl(settings.doctorRightImg || 'https://i.ibb.co/sBqDn9p/image.png') : ''
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="since-badge"><Star4 size={11} /> {t('Legacy Since 1967')} <Star4 size={11} /></div>
        <div className="hero-layout">
          <div className="hero-l">
            <Person src={imgLeft} alt="Syed Maqbool Ahmed Zaidi" name={t('Syed Maqbool Ahmed Zaidi')} small={t('(Shaheed)')} />
          </div>
          <div className="hero-c">
            {/* Mobile par bhi dikhta hai (pehle chhupa hota tha) */}
            <h1 className="hero-title">{lang === 'ur' ? <>ریاض <span className="gold">ہومیو</span> کلینک</> : <>Riaz <span className="gold">Homoeo</span><br />Clinic</>}</h1>
            <div className="hero-actions">
              <div className="pill-group"><div className="pill"><Star4 size={10} /> {t('100% Natural')}</div><div className="pill"><Star4 size={10} /> {t('DXN Authorized')}</div><div className="pill"><Star4 size={10} /> {t('Online Payment')}</div></div>
              <div className="hero-btns">
                <a href={`https://wa.me/${WA_NUMBER}?text=Assalamu+Alaikum,+I+need+order`} className="btn-primary"><img src={WA_ICON} alt="" className="visit" /> {t('Order Now')}</a>
                <a href={FB_URL} target="_blank" rel="noreferrer" className="btn-outline btn-fb"><Facebook size={15} /> {t('Facebook')}</a>
                <a href="#products" className="btn-outline">{t('View Products')}</a>
              </div>
            </div>
          </div>
          <div className="hero-r">
            <Person src={imgRight} alt="Syed Fawad Ahmed Zaidi" name={t('Syed Fawad Ahmed Zaidi')} />
          </div>
        </div>
      </div>
    </section>
  )
}
