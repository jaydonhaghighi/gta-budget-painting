import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Header from './components/Header.tsx'
import { CartProvider } from './context/CartContext.tsx'
import Footer from './components/Footer.tsx'
import LandingPage from './pages/LandingPage.tsx'
import ServicePage from './pages/ServicePage.tsx'
import CartPage from './pages/CartPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services/:serviceId" element={<ServicePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)

