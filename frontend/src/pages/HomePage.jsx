import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import FeaturedProduct from '../components/FeaturedProduct.jsx'
import Products from '../components/Products.jsx'
import Gallery from '../components/Gallery.jsx'
import CommentsSection from '../components/CommentsSection.jsx'
import Contact from './Contact.jsx'

/* Single page: Hero -> About -> Main product -> Products (DXN + Clinic) -> Gallery -> Comments -> Contact */
export default function HomePage() {
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
