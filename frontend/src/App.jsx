import { LangProvider } from './context/LangContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import InfoModal from './components/InfoModal.jsx'
import Lightbox from './components/Lightbox.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutTheDoctor from './pages/AboutTheDoctor.jsx'
import DXNProducts from './pages/DXNProducts.jsx'
import ClinicProducts from './pages/ClinicProducts.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import Certificates from './pages/Certificates.jsx'
import VideosPage from './pages/Videos.jsx'
import Contact from './pages/Contact.jsx'
import ProductPage from './components/ProductPage.jsx'

export default function App() {
  return (
    <LangProvider>
    <StoreProvider>
      <Lightbox />
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutTheDoctor />} />
            <Route path="/products/dxn" element={<DXNProducts />} />
            <Route path="/products/clinic" element={<ClinicProducts />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
        <InfoModal />
      </Router>
    </StoreProvider>
    </LangProvider>
  )
}
