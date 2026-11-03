import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import FeaturedProduct from '../components/FeaturedProduct.jsx'
import Products from '../components/Products.jsx'
import Gallery from '../components/Gallery.jsx'
import CommentsSection from '../components/CommentsSection.jsx'
import Contact from './Contact.jsx'
import { currentSectionId, pathSection, scrollToSection, sectionPath, spyLocked } from '../lib/sections'

/* Single page: Hero -> About -> Main product -> Products (DXN + Clinic) -> Gallery -> Comments -> Contact
   URL: /about, /dxn-products, /clinic-products, /gallery, /comments, /contact (direct link kholne par bhi us section par le jata hai) */
export default function HomePage() {
  const { pathname, key } = useLocation()
  const first = useRef(true)

  /* URL se section tak scroll (nav click, back/forward, ya direct link) */
  useEffect(() => {
    const id = pathSection(pathname)
    if (first.current) {
      first.current = false
      if (!id) return
      /* Direct link: products/images load hone par layout badalta hai, isliye kuch baar dobara align karo.
         User khud scroll kare to ruk jao. */
      const timers = [60, 600, 1500].map(ms => setTimeout(() => scrollToSection(id, 'instant'), ms))
      const stop = () => timers.forEach(clearTimeout)
      const evs = ['wheel', 'touchstart', 'keydown', 'mousedown']
      evs.forEach(e => addEventListener(e, stop, { passive: true, once: true }))
      return () => { stop(); evs.forEach(e => removeEventListener(e, stop)) }
    }
    scrollToSection(id || 'top')
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Scroll karte waqt address bar ka URL section ke saath badalta rahe */
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (spyLocked()) return
        const to = sectionPath(currentSectionId())
        if (to !== window.location.pathname) window.history.replaceState(window.history.state, '', to + window.location.search)
      })
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <Hero />
      <About />
      <FeaturedProduct />
      <Products />
      <Gallery />
      <CommentsSection />
      <Contact />
    </>
  )
}
