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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
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
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5"
            >
              <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">Admin Login</h1>
            <p className="text-blue-100 text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">Secure access to admin dashboard</p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14">
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

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-9 xl:space-y-10">
              {/* Username Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="username" className="block text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-300 mb-3 sm:mb-4">
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
                    className={`w-full px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 lg:px-7 lg:py-4.5 xl:px-8 xl:py-5 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
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
                      className="absolute right-4 sm:right-5 md:right-6 lg:right-7 top-1/2 transform -translate-y-1/2"
                    >
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-300 mb-3 sm:mb-4">
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
                    className={`w-full px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 lg:px-7 lg:py-4.5 xl:px-8 xl:py-5 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 pr-12 sm:pr-14 md:pr-16 lg:pr-18 ${
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
                    className="absolute right-4 sm:right-5 md:right-6 lg:right-7 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    ) : (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading || !isRecaptchaReady}
                  className="w-full py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 px-5 sm:px-6 md:px-7 lg:px-8 xl:px-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold sm:text-base md:text-lg lg:text-xl xl:text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 sm:space-x-4 relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      {isRecaptchaLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 animate-spin" />
                          <span className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">Verifying security...</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 animate-spin" />
                          <span className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">Authenticating...</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9" />
                      <span className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">{!isRecaptchaReady ? 'Loading security...' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 p-4 sm:p-5 md:p-6 lg:p-7 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 md:space-x-5">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-blue-300 text-sm sm:text-base md:text-lg">Protected by Google reCAPTCHA</p>
                    <div className="flex items-center space-x-2">
                      {isRecaptchaReady ? (
                        <>
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs sm:text-sm md:text-base">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-400 text-xs sm:text-sm md:text-base">Loading...</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-300/70 text-xs sm:text-sm md:text-base">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16"
        >
          <p className="text-slate-400 text-xs sm:text-sm md:text-base lg:text-lg">
            © 2024 Alex Fuad Portfolio. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
