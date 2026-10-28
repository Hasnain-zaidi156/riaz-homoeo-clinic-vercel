import { createContext, useContext, useEffect, useState } from 'react'
import { ur } from '../i18n/ur'
import { productsUr } from '../data/productsUr'

const Ctx = createContext(null)
export const useLang = () => useContext(Ctx)
const KEY = 'rhc_lang'

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem(KEY) === 'ur' ? 'ur' : 'en' } catch { return 'en' } })
  useEffect(() => {
    const d = document.documentElement
    d.lang = lang; d.dir = lang === 'ur' ? 'rtl' : 'ltr'
    try { localStorage.setItem(KEY, lang) } catch { /* ignore */ }
  }, [lang])
  // t('English text', {n: 3}) -> Urdu (agar available) warna English
  const t = (s, v) => {
    let r = (lang === 'ur' && ur[s]) || s
    if (v) for (const k in v) r = r.replace(`{${k}}`, v[k])
    return r
  }
  // Product ka naam/detail: Urdu mode mein nameUr/descUr (agar admin mein bhare hon)
  const pick = (p, f) => (lang === 'ur' && (p[f + 'Ur'] || productsUr[p.id]?.[f])) || p[f]
  const toggle = () => setLang(l => (l === 'ur' ? 'en' : 'ur'))
  return <Ctx.Provider value={{ lang, t, pick, toggle }}>{children}</Ctx.Provider>
}
