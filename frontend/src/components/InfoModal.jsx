import { useLang } from '../context/LangContext'
import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { Clipboard, Save } from './Icons'

export default function InfoModal() {
  const { infoOpen, info, saveInfo, skipInfo } = useStore()
  const { t } = useLang()
  const [f, setF] = useState({ name: '', phone: '', address: '' })
  useEffect(() => { if (infoOpen) setF({ name: info?.name || '', phone: info?.phone || '', address: info?.address || '' }) }, [infoOpen, info])
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))
  return (
    <div className={`info-modal-overlay${infoOpen ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && skipInfo()}>
      <div className="info-modal">
        <h3><Clipboard size={17} className="gold" /> {t('Delivery Information')}</h3>
        <p>{t('Ek baar bhar dein — hum save kar lein ge aapki info')}</p>
        <input type="text" className="modal-input" placeholder={t('Aapka Name (Full Name)')} maxLength={60} value={f.name} onChange={set('name')} />
        <input type="tel" className="modal-input" placeholder={t('Phone Number (03xx-xxxxxxx)')} maxLength={20} value={f.phone} onChange={set('phone')} />
        <textarea className="modal-input" rows="2" placeholder={t('Delivery Address (ghar, gali, sheher)')} value={f.address} onChange={set('address')} />
        <button className="btn-primary" style={{ width: '100%' }} onClick={() => saveInfo(f.name.trim(), f.phone.trim(), f.address.trim())}><Save size={14} /> {t('Save & Continue')}</button>
        <button className="modal-skip-btn" onClick={skipInfo}>{t('Skip (order without saving)')}</button>
      </div>
    </div>
  )
}
