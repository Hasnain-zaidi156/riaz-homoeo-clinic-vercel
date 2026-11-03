/* Single page ke sections aur unke URL: /about, /gallery, /comments ... (Home = /)
   Nav click par URL badalta hai, aur scroll karte waqt bhi URL section ke hisaab se update hota rehta hai. */
export const SECTIONS = ['about', 'dxn-products', 'clinic-products', 'gallery', 'comments', 'contact'] // page ki tarteeb mein

export const sectionPath = id => (id && id !== 'top' ? `/${id}` : '/')
export const pathSection = p => {
  const id = String(p || '').replace(/^\/+|\/+$/g, '')
  return SECTIONS.includes(id) ? id : null
}

/* Smooth scroll ke dauran URL bar beech ke sections par na uchhle */
let lockUntil = 0
export const lockSpy = (ms = 1200) => { lockUntil = Date.now() + ms }
export const spyLocked = () => Date.now() < lockUntil

export function scrollToSection(id, behavior = 'smooth') {
  lockSpy(behavior === 'smooth' ? 1300 : 2600)
  const el = id && id !== 'top' ? document.getElementById(id) : null
  if (el) el.scrollIntoView({ behavior, block: 'start' })
  else window.scrollTo({ top: 0, behavior })
}

/* Scroll karte waqt current section ke mutabiq URL badlo (history mein nayi entry nahi banti) */
export function currentSectionId() {
  const th = window.innerHeight * 0.35
  let cur = 'top'
  for (const id of SECTIONS) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= th) cur = id
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = SECTIONS[SECTIONS.length - 1]
  return cur
}
