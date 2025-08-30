'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="GTA Budget Painting Logo" className="logo-image" />
          </Link>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <Link 
              href="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={isActive('/services') ? 'active' : ''}
            >
              Services
            </Link>
            <Link 
              href="/quote" 
              className={isActive('/quote') ? 'active' : ''}
            >
              Get Quote
            </Link>
            <Link 
              href="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={isActive('/contact') ? 'active' : ''}
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <h3 className="mobile-nav-title">GTA Budget Painting</h3>
          <button 
            className="mobile-nav-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <span className="close-icon">×</span>
          </button>
        </div>
        <nav className="mobile-nav">
          <Link 
            href="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/services" 
            className={isActive('/services') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/quote" 
            className={isActive('/quote') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Quote
          </Link>
          <Link 
            href="/about" 
            className={isActive('/about') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={isActive('/contact') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  )
}
