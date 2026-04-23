'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, User, LogOut, Sun, Moon, Globe, Check, X, AlertCircle } from 'lucide-react'

export default function ScriptTest() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [authStatus, setAuthStatus] = useState(null)

  useEffect(() => {
    // Check if script is loaded
    const checkScript = () => {
      if (window.ScriptJS) {
        setScriptLoaded(true)
        runTests()
      } else {
        setTimeout(checkScript, 100)
      }
    }
    
    checkScript()
  }, [])

  const runTests = async () => {
    const results = []
    
    // Test Utils functions
    try {
      const id = window.ScriptJS.Utils.generateId(8)
      results.push({ name: 'Utils.generateId', status: 'success', message: `Generated ID: ${id}` })
    } catch (error) {
      results.push({ name: 'Utils.generateId', status: 'error', message: error.message })
    }

    try {
      const date = window.ScriptJS.Utils.formatDate(new Date(), 'short')
      results.push({ name: 'Utils.formatDate', status: 'success', message: `Formatted date: ${date}` })
    } catch (error) {
      results.push({ name: 'Utils.formatDate', status: 'error', message: error.message })
    }

    // Test Validator functions
    try {
      const isValid = window.ScriptJS.Validator.email('test@example.com')
      results.push({ name: 'Validator.email', status: 'success', message: `Email validation: ${isValid}` })
    } catch (error) {
      results.push({ name: 'Validator.email', status: 'error', message: error.message })
    }

    try {
      const passwordResult = window.ScriptJS.Validator.password('Test123')
      results.push({ 
        name: 'Validator.password', 
        status: passwordResult.isValid ? 'success' : 'warning', 
        message: `Password valid: ${passwordResult.isValid}, Errors: ${passwordResult.errors.join(', ')}` 
      })
    } catch (error) {
      results.push({ name: 'Validator.password', status: 'error', message: error.message })
    }

    // Test Theme functions
    try {
      const currentTheme = window.ScriptJS.Theme.get()
      results.push({ name: 'Theme.get', status: 'success', message: `Current theme: ${currentTheme}` })
    } catch (error) {
      results.push({ name: 'Theme.get', status: 'error', message: error.message })
    }

    // Test Language functions
    try {
      const currentLang = window.ScriptJS.Language.get()
      results.push({ name: 'Language.get', status: 'success', message: `Current language: ${currentLang}` })
    } catch (error) {
      results.push({ name: 'Language.get', status: 'error', message: error.message })
    }

    // Test Auth functions
    try {
      const isAuthenticated = window.ScriptJS.Auth.isAuthenticated()
      results.push({ name: 'Auth.isAuthenticated', status: 'success', message: `Auth status: ${isAuthenticated}` })
      setAuthStatus(isAuthenticated)
    } catch (error) {
      results.push({ name: 'Auth.isAuthenticated', status: 'error', message: error.message })
    }

    setTestResults(results)
  }

  const handleThemeToggle = () => {
    if (window.ScriptJS) {
      const newTheme = window.ScriptJS.Theme.toggle()
      window.ScriptJS.Notification.success(`Theme changed to ${newTheme}`)
    }
  }

  const handleLanguageToggle = () => {
    if (window.ScriptJS) {
      const newLang = window.ScriptJS.Language.toggle()
      window.ScriptJS.Notification.info(`Language changed to ${newLang}`)
    }
  }

  const handleTestNotification = (type) => {
    if (window.ScriptJS) {
      window.ScriptJS.Notification[type](`This is a ${type} notification!`)
    }
  }

  const handleTestLoading = () => {
    if (window.ScriptJS) {
      const loader = window.ScriptJS.Loading.show('Testing loading...')
      setTimeout(() => {
        window.ScriptJS.Loading.hide(loader)
        window.ScriptJS.Notification.success('Loading test completed!')
      }, 2000)
    }
  }

  const handleTestCopy = async () => {
    if (window.ScriptJS) {
      const success = await window.ScriptJS.Utils.copyToClipboard('Test text from Script.js v7')
      if (success) {
        window.ScriptJS.Notification.success('Text copied to clipboard!')
      } else {
        window.ScriptJS.Notification.error('Failed to copy text')
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Script.js v7 Test Suite
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Comprehensive testing for Script.js version 7.0.0
          </p>
        </motion.div>

        {/* Script Status */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${
            scriptLoaded 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center space-x-3">
              {scriptLoaded ? (
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Script.js Status
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {scriptLoaded ? 'Script loaded and ready' : 'Script not loaded'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Results */}
        {scriptLoaded && testResults.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Test Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : result.status === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {result.status === 'success' ? (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : result.status === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {result.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {result.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interactive Tests */}
        {scriptLoaded && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Interactive Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Theme Toggle */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Theme Toggle</h3>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Toggle Theme
                </button>
              </motion.div>

              {/* Language Toggle */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Language Toggle</h3>
                </div>
                <button
                  onClick={handleLanguageToggle}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Toggle Language
                </button>
              </motion.div>

              {/* Notifications */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-purple-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleTestNotification('success')}
                    className="w-full py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors duration-200"
                  >
                    Success
                  </button>
                  <button
                    onClick={() => handleTestNotification('error')}
                    className="w-full py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors duration-200"
                  >
                    Error
                  </button>
                  <button
                    onClick={() => handleTestNotification('info')}
                    className="w-full py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
                  >
                    Info
                  </button>
                </div>
              </motion.div>

              {/* Loading Test */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Loading Test</h3>
                </div>
                <button
                  onClick={handleTestLoading}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  Test Loading
                </button>
              </motion.div>

              {/* Copy Test */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Check className="w-6 h-6 text-green-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Copy to Clipboard</h3>
                </div>
                <button
                  onClick={handleTestCopy}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Copy Test Text
                </button>
              </motion.div>

              {/* Auth Status */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-red-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Auth Status</h3>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-medium ${
                    authStatus 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {authStatus ? 'Authenticated' : 'Not Authenticated'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Current session status
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* API Info */}
        {scriptLoaded && (
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              API Information
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Version</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {window.ScriptJS?.version || 'Unknown'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Available Modules</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(window.ScriptJS || {}).filter(key => key !== 'version' && key !== 'CONFIG').map(module => (
                      <span
                        key={module}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
