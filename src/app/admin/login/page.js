'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminLogin() {
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

    try {
      if (!formData.username.trim() || !formData.password) {
        setError('Username and password are required')
        setIsLoading(false)
        return
      }

      const recaptchaToken = await executeRecaptcha()

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

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Secure access to admin dashboard</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isRecaptchaReady}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isRecaptchaLoading ? 'Verifying...' : 'Authenticating...'}</span>
                </>
              ) : (
                <span>{!isRecaptchaReady ? 'Loading...' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by Google reCAPTCHA
              {isRecaptchaReady ? (
                <span className="ml-2 text-green-600">● Active</span>
              ) : (
                <span className="ml-2 text-yellow-600">● Loading...</span>
              )}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">© 2024 Alex Fuad Portfolio. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
