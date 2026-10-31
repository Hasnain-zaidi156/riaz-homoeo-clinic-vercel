import { LangProvider } from './context/LangContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import InfoModal from './components/InfoModal.jsx'
import Lightbox from './components/Lightbox.jsx'
import HomePage from './pages/HomePage.jsx'
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
