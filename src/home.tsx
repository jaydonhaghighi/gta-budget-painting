import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import LandingPage from './pages/LandingPage.tsx'
import ServicePage from './pages/ServicePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services/:serviceId" element={<ServicePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

