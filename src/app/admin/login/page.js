'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLogin() {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false)
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Initialize reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined') {
        if (!window.grecaptcha) {
          const script = document.createElement('script')
          script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
          script.async = true
          script.defer = true
          script.onload = () => {
            // Wait for grecaptcha to be fully initialized
            window.grecaptcha.ready(() => {
              setIsRecaptchaReady(true)
            })
          }
          script.onerror = () => {
            console.error('Failed to load reCAPTCHA')
            setError('Failed to load security verification. Please refresh the page.')
          }
          document.head.appendChild(script)
        } else {
          window.grecaptcha.ready(() => {
            setIsRecaptchaReady(true)
          })
        }
      }
    }

    loadRecaptcha()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const executeRecaptcha = async () => {
    if (!isRecaptchaReady) {
      throw new Error('Security verification not ready. Please wait...')
    }

    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured, skipping verification')
      return 'mock-token'
    }

    setIsRecaptchaLoading(true)

    return new Promise((resolve, reject) => {
      try {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'login' })
            .then((token) => {
              setIsRecaptchaLoading(false)
              resolve(token)
            })
            .catch((error) => {
              setIsRecaptchaLoading(false)
              console.error('reCAPTCHA execution error:', error)
              reject(new Error('Security verification failed'))
            })
        })
      } catch (error) {
        setIsRecaptchaLoading(false)
        reject(error)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    setFormTouched(true)

    try {
      // Validate form
      if (!formData.username.trim() || !formData.password) {
        setError('Username and password are required')
        setIsLoading(false)
        return
      }

      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha()

      // Send login request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Login successful! Redirecting...')
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1500)
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Login Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative z-10"
      >
        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
            >
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg">Secure access to admin dashboard</p>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">{success}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
              {/* Username Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="username" className="block text-sm sm:text-base md:text-lg font-medium text-slate-300 mb-2 sm:mb-3">
                  Username
                </label>
                <div className={`relative transition-all duration-300 ${usernameFocused ? 'transform scale-105' : ''}`}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-4 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      usernameFocused 
                        ? 'border-blue-500 focus:ring-blue-500' 
                        : 'border-white/20 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your username"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                  {formData.username && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 sm:right-4 md:right-5 top-1/2 transform -translate-y-1/2"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm sm:text-base md:text-lg font-medium text-slate-300 mb-2 sm:mb-3">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${passwordFocused ? 'transform scale-105' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-4 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 pr-10 sm:pr-12 md:pr-14 ${
                      passwordFocused 
                        ? 'border-blue-500 focus:ring-blue-500' 
                        : 'border-white/20 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading || !isRecaptchaReady}
                  className="w-full py-2.5 sm:py-3 md:py-4 lg:py-4.5 px-4 sm:px-5 md:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold sm:text-base md:text-lg lg:text-xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      {isRecaptchaLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 animate-spin" />
                          <span className="text-xs sm:text-sm md:text-base lg:text-lg">Verifying security...</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 animate-spin" />
                          <span className="text-xs sm:text-sm md:text-base lg:text-lg">Authenticating...</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                      <span className="text-xs sm:text-sm md:text-base lg:text-lg">{!isRecaptchaReady ? 'Loading security...' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div
              variants={itemVariants}
              className="mt-5 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-5 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-blue-300 text-xs sm:text-sm md:text-base">Protected by Google reCAPTCHA</p>
                    <div className="flex items-center space-x-1">
                      {isRecaptchaReady ? (
                        <>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-[10px] sm:text-xs md:text-sm">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-400 text-[10px] sm:text-xs md:text-sm">Loading...</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-300/70 text-[10px] sm:text-xs md:text-sm">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 sm:mt-8 md:mt-10"
        >
          <p className="text-slate-400 text-xs sm:text-sm md:text-base">
            © 2024 Alex Fuad Portfolio. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
