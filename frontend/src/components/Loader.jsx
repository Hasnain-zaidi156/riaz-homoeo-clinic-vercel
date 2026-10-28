/* Premium loader — RHC logo + spinner, glass style.
   1) Order bhejte waqt (`sending`)  2) Pehli dafa site khulte waqt jab backend (free Render) jag raha ho (`status === 'loading'`). */
import { useStore } from '../context/StoreContext'
import { useLang } from '../context/LangContext'
import { assetUrl } from '../lib/config'

const LOGO_FALLBACK = 'https://i.ibb.co/Q7NhK34X/logo.jpg'

export default function Loader() {
  const { sending, status, settings } = useStore()
  const { t } = useLang()
  const waking = status === 'loading'
  if (!sending && !waking) return null
  /* Startup par admin ki logo aane tak default logo nahi dikhate (warna purani photo flash hoti hai) */
  const logo = settings ? assetUrl(settings.logoImg || LOGO_FALLBACK) : ''
  return (
    <div className="loader-overlay" role="status" aria-live="polite" style={waking && !sending ? { background: 'rgb(var(--bg-rgb))' } : undefined}>
      <div className="loader-card glass">
        {logo && <img src={logo} alt="Riaz Homoeo Clinic" className="loader-logo" />}
        <span className="loader-spin" />
        {sending
          ? <><b>{t('Sending your order...')}</b><small>{t('Please wait')}</small></>
          : <><b>{t('Loading website...')}</b><small>{t('Please wait')}</small></>}
      </div>
    </div>
  )
}
