'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp, Heart, Instagram } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/alexfuad', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/alexander-hilarius-fuad-fatahillah-9b1aa031/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/alexanderhff', label: 'Instagram' },
    { icon: Mail, href: 'mailto:info@alexanderhfuadf.web.id', label: 'Email' },
  ]

  const footerLinks = [
    {
      title: t('quickLinks'),
      links: [
        { name: t('home'), href: '#home' },
        { name: t('about'), href: '#about' },
        { name: t('skills'), href: '#skills' },
        { name: t('portfolio'), href: '#portfolio' },
        { name: t('contact'), href: '#contact' },
      ],
    },
    {
      title: t('services'),
      links: [
        { name: t('webDevelopment'), href: '#' },
        { name: t('mobileDevelopment'), href: '#' },
        { name: t('uiuxDesign'), href: '#' },
        { name: t('consulting'), href: '#' },
      ],
    },
    {
      title: t('resources'),
      links: [
        { name: t('blog'), href: '#' },
        { name: t('resume'), href: '#' },
        { name: t('privacyPolicy'), href: '#' },
        { name: t('termsOfService'), href: '#' },
      ],
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">Alex Fuad</span>
            </div>
            <p className="text-slate-300 dark:text-slate-400 mb-6">
              Full stack developer passionate about creating beautiful, functional, and user-centered digital experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-slate-800 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      whileHover={{ scale: 1.05, x: 5 }}
                      href={link.href}
                      className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-slate-800 dark:border-slate-700"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-4">{t('stayUpdated')}</h3>
            <p className="text-slate-300 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              {t('newsletterDescription')}
            </p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="flex-1 px-4 py-3 bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                {t('subscribe')}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-sm"
            >
              <span>{t('footerText')}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>{t('madeWithPassion')}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-sm text-slate-400 dark:text-slate-500"
            >
              <a href="#" className="hover:text-white transition-colors duration-200">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                {t('termsOfService')}
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                {t('cookiePolicy')}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  )
}
