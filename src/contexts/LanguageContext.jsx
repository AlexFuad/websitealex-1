'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Hi, I\'m Alexander',
    heroSubtitle: 'Full Stack Developer',
    heroDescription: 'Passionate about creating amazing web experiences with modern technologies',
    heroButton1: 'View Portfolio',
    heroButton2: 'Contact Me',
    
    // About Section
    aboutTitle: 'About Me',
    aboutDescription: 'I\'m a passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through code.',
    
    // Skills Section
    skillsTitle: 'Technical Skills',
    skillsDescription: 'A comprehensive overview of my technical expertise and proficiency levels in various technologies and tools.',
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    tools: 'Tools & Technologies',
    design: 'Design & UI/UX',
    alwaysLearning: 'Always learning and expanding my skill set',
    
    // Portfolio Section
    portfolioTitle: 'Portfolio',
    portfolioDescription: 'Explore my recent projects and see what I\'ve been working on.',
    viewProject: 'View Project',
    
    // Contact Section
    contactTitle: 'Get In Touch',
    contactDescription: 'Feel free to reach out if you\'d like to collaborate on a project or just want to say hello!',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    
    // Footer
    footerText: '© 2024 Alexander Hilarius Fuad Fatahillah. All rights reserved.',
    
    // Admin
    adminLogin: 'Admin Login',
    login: 'Login',
    logout: 'Logout',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode'
  },
  id: {
    // Navigation
    home: 'Beranda',
    about: 'Tentang',
    skills: 'Keahlian',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Kontak',
    
    // Hero Section
    heroTitle: 'Hai, Saya Alexander',
    heroSubtitle: 'Full Stack Developer',
    heroDescription: 'Berpengalaman dalam menciptakan pengalaman web yang luar biasa dengan teknologi modern',
    heroButton1: 'Lihat Portfolio',
    heroButton2: 'Hubungi Saya',
    
    // About Section
    aboutTitle: 'Tentang Saya',
    aboutDescription: 'Saya seorang full-stack developer yang bersemangat dengan keahlian dalam teknologi web modern. Saya suka menciptakan solusi inovatif dan mewujudkan ide melalui kode.',
    
    // Skills Section
    skillsTitle: 'Keahlian Teknis',
    skillsDescription: 'Tinjauan komprehensif keahlian teknis dan tingkat keprofesionalan saya dalam berbagai teknologi dan alat.',
    frontend: 'Pengembangan Frontend',
    backend: 'Pengembangan Backend',
    tools: 'Alat & Teknologi',
    design: 'Desain & UI/UX',
    alwaysLearning: 'Selalu belajar dan mengembangkan skill set',
    
    // Portfolio Section
    portfolioTitle: 'Portfolio',
    portfolioDescription: 'Jelajahi proyek-proyek terbaru saya dan lihat apa yang telah saya kerjakan.',
    viewProject: 'Lihat Proyek',
    
    // Contact Section
    contactTitle: 'Hubungi Saya',
    contactDescription: 'Jangan ragu untuk menghubungi jika Anda ingin berkolaborasi dalam proyek atau hanya ingin menyapa!',
    name: 'Nama',
    email: 'Email',
    message: 'Pesan',
    send: 'Kirim Pesan',
    
    // Footer
    footerText: '© 2024 Alexander Hilarius Fuad Fatahillah. Semua hak dilindungi.',
    
    // Admin
    adminLogin: 'Login Admin',
    login: 'Masuk',
    logout: 'Keluar',
    
    // Theme
    lightMode: 'Mode Terang',
    darkMode: 'Mode Gelap'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Check for saved language preference or default to English
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguage(savedLanguage)
    } else {
      setLanguage('en')
    }
  }, [])

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === 'en' ? 'id' : 'en')
  }

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
