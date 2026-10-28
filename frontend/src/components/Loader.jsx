/* Premium order loader — RHC logo + spinner, glass style.
   StoreContext ke `sending` state se chalta hai; App ke andar globally render hota hai. */
import { useStore } from '../context/StoreContext'
import { useLang } from '../context/LangContext'

const LOGO_FALLBACK = 'https://i.ibb.co/Q7NhK34X/logo.jpg'

export default function Loader() {
  const { sending, settings } = useStore()
  const { t } = useLang()
  if (!sending) return null
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-card glass">
        <img src={settings?.logoImg || LOGO_FALLBACK} alt="Riaz Homoeo Clinic" className="loader-logo" />
        <span className="loader-spin" />
        <b>{t('Sending your order...')}</b>
        <small>{t('Please wait')}</small>
      </div>
    </div>
  )
}
