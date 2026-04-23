'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Globe, Shield, LogOut } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Check if user is authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAuthStatus()
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const data = await response.json()
      setIsAdmin(data.success && data.user?.role === 'admin')
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const navItems = [
    { name: t('home'), href: '#home' },
    { name: t('about'), href: '#about' },
    { name: t('skills'), href: '#skills' },
    { name: t('portfolio'), href: '#portfolio' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '#contact' },
  ]

  const handleAdminLogin = () => {
    router.push('/admin/login')
  }

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAdmin(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-lg'
            : 'bg-transparent'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-slate-200">Alex Fuad</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                    : 'text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
              </motion.button>
            ))}
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
              }`}
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
              }`}
              title={language === 'en' ? 'Switch to Bahasa' : 'Switch to English'}
            >
              <Globe className="w-5 h-5" />
            </motion.button>
            
            {/* Admin Login */}
            {isAdmin ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogout}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogin}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  scrolled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
                }`}
                title={t('adminLogin')}
              >
                <Shield className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Right side controls for mobile */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
              }`}
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
              }`}
              title={language === 'en' ? 'Switch to Bahasa' : 'Switch to English'}
            >
              <Globe className="w-5 h-5" />
            </motion.button>
            
            {/* Admin Login */}
            {isAdmin ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogout}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogin}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  scrolled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
                }`}
                title={t('adminLogin')}
              >
                <Shield className="w-5 h-5" />
              </motion.button>
            )}
            
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-white/20 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
    </>
  )
}
