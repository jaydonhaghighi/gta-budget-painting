import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Header from './components/Header.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Footer from './components/Footer.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import LandingPage from './pages/LandingPage.tsx'
import ServicesPage from './pages/ServicesPage.tsx'
import InteriorPaintingPage from './pages/InteriorPaintingPage.tsx'
import ExteriorPaintingPage from './pages/ExteriorPaintingPage.tsx'
import ServicePage from './pages/ServicePage.tsx'
import CartPage from './pages/CartPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import ContactUsPage from './pages/ContactUsPage.tsx'
import AdminPanel from './pages/AdminPanel.tsx'

// Component to handle input scroll prevention
const InputScrollPrevention = () => {
  useEffect(() => {
    const preventScrollOnInputs = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        e.preventDefault();
      }
    };

    // Add event listener to prevent wheel events on inputs
    document.addEventListener('wheel', preventScrollOnInputs, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('wheel', preventScrollOnInputs);
    };
  }, []);

  return null;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <InputScrollPrevention />
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/interior-painting" element={<InteriorPaintingPage />} />
            <Route path="/services/exterior-painting" element={<ExteriorPaintingPage />} />
            <Route path="/services/interior-painting/:serviceId" element={<ServicePage />} />
            <Route path="/services/exterior-painting/:serviceId" element={<ServicePage />} />
            <Route path="/services/custom-painting" element={<ServicePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)

