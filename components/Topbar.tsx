'use client'

import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import Link from 'next/link'

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMenuOpen(false) // Close mobile menu after clicking
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-bold text-gray-900">reevio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
              Features
            </a>
            <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
              Pricing
            </a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
              About
            </a>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
              <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/20 bg-white/90 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                Features
              </a>
              <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                Pricing
              </a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                About
              </a>
              <div className="pt-2">
                <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
                  <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full justify-center">
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Topbar