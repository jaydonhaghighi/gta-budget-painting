import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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
import GalleryPage from './pages/GalleryPage.tsx'
import AdminPanel from './pages/AdminPanel.tsx'
import LocationPage from './pages/LocationPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
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
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* Dynamic Location Pages (e.g. /painters-mississauga) */}
              {/* Note: We use a regex-like pattern or just match the specific prefix structure if possible, 
                  but simpler is to capture the whole segment and parse it inside the component if needed. 
                  However, let's try the explicit list approach if the dynamic parameter fails, 
                  OR just fix the parameter syntax. In React Router v6+, "painters-:city" is NOT valid. 
                  It must be a full segment like ":city" or we need to list them. 
                  
                  The best "catch-all" way that works reliably is to match the specific paths. 
                  Given there are ~20 cities, we can just map them to be safe, 
                  OR use a route wrapper. 
                  
                  Let's stick to the safest method: The route parameter must take up the WHOLE segment. 
                  So we will change the URL structure slightly OR add individual routes.
                  
                  ACTUALLY: React Router v6 doesn't support partial segment parameters like "/painters-:city".
                  We must use specific paths for each city to keep the URL structure "/painters-mississauga".
              */}
              <Route path="/painters-toronto" element={<LocationPage />} />
              <Route path="/painters-north-york" element={<LocationPage />} />
              <Route path="/painters-etobicoke" element={<LocationPage />} />
              <Route path="/painters-scarborough" element={<LocationPage />} />
              <Route path="/painters-mississauga" element={<LocationPage />} />
              <Route path="/painters-brampton" element={<LocationPage />} />
              <Route path="/painters-vaughan" element={<LocationPage />} />
              <Route path="/painters-markham" element={<LocationPage />} />
              <Route path="/painters-richmond-hill" element={<LocationPage />} />
              <Route path="/painters-oakville" element={<LocationPage />} />
              <Route path="/painters-burlington" element={<LocationPage />} />
              <Route path="/painters-milton" element={<LocationPage />} />
              <Route path="/painters-caledon" element={<LocationPage />} />
              <Route path="/painters-thornhill" element={<LocationPage />} />
              <Route path="/painters-woodbridge" element={<LocationPage />} />
              <Route path="/painters-maple" element={<LocationPage />} />
              <Route path="/painters-york" element={<LocationPage />} />
              <Route path="/painters-east-york" element={<LocationPage />} />
              <Route path="/painters-downtown-toronto" element={<LocationPage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)

