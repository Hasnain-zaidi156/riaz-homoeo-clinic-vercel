import { LangProvider } from './context/LangContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import FeaturedProduct from './components/FeaturedProduct.jsx'
import Gallery from './components/Gallery.jsx'
import Products from './components/Products.jsx'
import CommentsSection from './components/CommentsSection.jsx'
import OrderSection from './components/OrderSection.jsx'
import LocationSection from './components/LocationSection.jsx'
import Footer from './components/Footer.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import InfoModal from './components/InfoModal.jsx'
import Lightbox from './components/Lightbox.jsx'

export default function App() {
  return (
    <LangProvider>
    <StoreProvider>
      <Lightbox />
      <Navbar />
      <main>
        <Hero />
        <About />
        <FeaturedProduct />
        <Gallery />
        <Products />
        <CommentsSection />
        <OrderSection />
        <LocationSection />
      </main>
      <Footer />
      <CartSidebar />
      <InfoModal />
    </StoreProvider>
    </LangProvider>
  )
}
