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
    myStory: 'My Story',
    skillsAndExperience: 'Skills & Experience',
    technicalSkills: 'Technical Skills',
    workExperience: 'Work Experience',
    cloudServices: 'Cloud Services',
    security: 'Security',
    
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
    ecomercePlatform: 'Platform E-Commerce',
    ecomerceDescription: 'Platform e-commerce lengkap dengan integrasi pembayaran, otentikasi pengguna, dan dashboard admin.',
    taskManagementApp: 'Aplikasi Manajemen Tugas',
    taskManagementDescription: 'Aplikasi manajemen tugas kolaboratif dengan pembaruan real-time, fungsionalitas drag-and-drop, dan fitur kolaborasi tim.',
    weatherDashboard: 'Dashboard Cuaca',
    weatherDashboardDescription: 'Dashboard cuaca yang indah dengan prakiraan berbasis lokasi, peta interaktif, dan analisis cuaca detail.',
    mobileBankingApp: 'Aplikasi Perbankan Mobile',
    mobileBankingDescription: 'Aplikasi perbankan mobile yang aman dengan otentikasi biometrik, riwayat transaksi, dan pelacakan anggaran.',
    aiContentGenerator: 'Generator Konten AI',
    aiContentDescription: 'Platform generasi konten bertenaga AI dengan berbagai template, prompt kustom, dan optimasi konten.',
    socialMediaAnalytics: 'Analisis Media Sosial',
    socialMediaDescription: 'Dashboard analisis media sosial komprehensif dengan visualisasi data, analisis sentimen, dan fitur pelaporan.',
    webDevelopment: 'Pengembangan Web',
    mobileDevelopment: 'Pengembangan Mobile',
    allProjects: 'Semua Proyek',
    webApps: 'Aplikasi Web',
    mobileApps: 'Aplikasi Mobile',
    uiuxDesign: 'Desain UI/UX',
    consulting: 'Konsultasi',
    searchProjects: 'Cari proyek...',
    noProjectsFound: 'Tidak ada proyek yang cocok dengan kriteria Anda.',
    featured: 'Unggulan',
    ecomercePlatform: 'E-Commerce Platform',
    ecomerceDescription: 'A full-featured e-commerce platform with payment integration, user authentication, and admin dashboard.',
    taskManagementApp: 'Task Management App',
    taskManagementDescription: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    weatherDashboard: 'Weather Dashboard',
    weatherDashboardDescription: 'A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.',
    mobileBankingApp: 'Mobile Banking App',
    mobileBankingDescription: 'A secure mobile banking application with biometric authentication, transaction history, and budget tracking.',
    aiContentGenerator: 'AI Content Generator',
    aiContentDescription: 'An AI-powered content generation platform with multiple templates, custom prompts, and content optimization.',
    socialMediaAnalytics: 'Social Media Analytics',
    socialMediaDescription: 'A comprehensive social media analytics dashboard with data visualization, sentiment analysis, and reporting features.',
    webDevelopment: 'Web Development',
    mobileDevelopment: 'Mobile Development',
    allProjects: 'All Projects',
    webApps: 'Web Apps',
    mobileApps: 'Mobile Apps',
    uiuxDesign: 'UI/UX Design',
    consulting: 'Consulting',
    searchProjects: 'Search projects...',
    noProjectsFound: 'No projects found matching your criteria.',
    featured: 'Featured',
    
    // Contact Section
    contactTitle: 'Get In Touch',
    contactDescription: 'Feel free to reach out if you\'d like to collaborate on a project or just want to say hello!',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    contactForm: 'Contact Form',
    contactInfo: 'Contact Information',
    socialMedia: 'Social Media',
    availability: 'Availability',
    availableForWork: 'Available for freelance work',
    letsConnect: "Let's Connect",
    messageSuccess: 'Thank you for your message! I\'ll get back to you soon.',
    messageError: 'Something went wrong. Please try again.',
    connectWithMe: 'Connect With Me',
    availableForWork: 'Available for Work',
    availableDescription: 'I\'m currently available for freelance work and full-time opportunities. If you\'re interested in working together, let\'s talk!',
    startConversation: 'Start a Conversation',
    
    // Blog Section
    blogTitle: 'Blog',
    blogDescription: 'Thoughts, ideas, and tutorials about web development, design, and technology.',
    blogPost1Title: 'Building Scalable React Applications',
    blogPost1Excerpt: 'Learn how to build scalable React applications with best practices and modern patterns.',
    blogPost1Content: 'In this comprehensive guide, we explore the best practices for building scalable React applications...',
    blogPost2Title: 'State Management in Modern React',
    blogPost2Excerpt: 'A deep dive into state management patterns and tools for modern React applications.',
    blogPost2Content: 'State management is a crucial aspect of building robust React applications...',
    blogPost3Title: 'The Art of Responsive Design',
    blogPost3Excerpt: 'Master the principles of responsive design and create beautiful mobile-first experiences.',
    blogPost3Content: 'Responsive design is essential in today\'s multi-device world...',
    blogPost4Title: 'JavaScript ES2024 Features',
    blogPost4Excerpt: 'Explore the latest JavaScript features and how to use them in your projects.',
    blogPost4Content: 'JavaScript continues to evolve with exciting new features...',
    searchBlog: 'Search blog posts...',
    allCategories: 'All Categories',
    readMore: 'Read More',
    noBlogPostsFound: 'No blog posts found matching your criteria.',
    
    // Footer
    footerText: '© 2024 Alexander Hilarius Fuad Fatahillah. All rights reserved.',
    quickLinks: 'Quick Links',
    services: 'Services',
    resources: 'Resources',
    webDevelopment: 'Web Development',
    mobileDevelopment: 'Mobile Development',
    uiuxDesign: 'UI/UX Design',
    consulting: 'Consulting',
    resume: 'Resume',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    stayUpdated: 'Stay Updated',
    subscribe: 'Subscribe',
    enterEmail: 'Enter your email',
    madeWithPassion: 'Made with passion',
    newsletterDescription: 'Subscribe to my newsletter to get updates on my latest projects, articles, and tech insights.',
    cookiePolicy: 'Cookie Policy',
    
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
    aboutStory1: 'Halo! Saya Alex Fuad, seorang full stack developer dengan passion untuk menciptakan pengalaman digital yang indah, fungsional, dan berpusat pada pengguna. Saya selalu mencari cara baru dan inovatif untuk mewujudkan visi klien saya.',
    aboutStory2: 'Dengan lebih dari 4 tahun pengalaman dalam pengembangan web, saya telah bekerja pada berbagai proyek dari situs web bisnis kecil hingga aplikasi enterprise berskala besar. Pendekatan saya menggabungkan keahlian teknis dengan pemecahan masalah kreatif untuk menghasilkan solusi yang melampaui ekspektasi.',
    myStory: 'Cerita Saya',
    skillsAndExperience: 'Keahlian & Pengalaman',
    technicalSkills: 'Keahlian Teknis',
    workExperience: 'Pengalaman Kerja',
    cloudServices: 'Layanan Cloud',
    security: 'Keamanan',
    
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
    phone: 'Telepon',
    location: 'Lokasi',
    subject: 'Subjek',
    message: 'Pesan',
    send: 'Kirim Pesan',
    sending: 'Mengirim...',
    contactForm: 'Formulir Kontak',
    contactInfo: 'Informasi Kontak',
    socialMedia: 'Media Sosial',
    availability: 'Ketersediaan',
    availableForWork: 'Tersedia untuk pekerjaan freelance',
    letsConnect: 'Mari Terhubung',
    messageSuccess: 'Terima kasih atas pesan Anda! Saya akan segera menghubungi Anda kembali.',
    messageError: 'Terjadi kesalahan. Silakan coba lagi.',
    connectWithMe: 'Terhubung Dengan Saya',
    availableForWork: 'Tersedia untuk Bekerja',
    availableDescription: 'Saya saat ini tersedia untuk pekerjaan freelance dan kesempatan full-time. Jika Anda tertarik untuk bekerja sama, mari bicarakan!',
    startConversation: 'Mulai Percakapan',
    
    // Blog Section
    blogTitle: 'Blog',
    blogDescription: 'Pikiran, ide, dan tutorial tentang pengembangan web, desain, dan teknologi.',
    blogPost1Title: 'Membangun Aplikasi React yang Skalabel',
    blogPost1Excerpt: 'Pelajari cara membangun aplikasi React yang skalabel dengan praktik terbaik dan pola modern.',
    blogPost1Content: 'Dalam panduan komprehensif ini, kita menjelajahi praktik terbaik untuk membangun aplikasi React yang skalabel...',
    blogPost2Title: 'Manajemen State di React Modern',
    blogPost2Excerpt: 'Eksplorasi mendalam tentang pola dan alat manajemen state untuk aplikasi React modern.',
    blogPost2Content: 'Manajemen state adalah aspek penting dalam membangun aplikasi React yang kuat...',
    blogPost3Title: 'Seni Desain Responsif',
    blogPost3Excerpt: 'Kuasai prinsip desain responsif dan buat pengalaman mobile-first yang indah.',
    blogPost3Content: 'Desain responsif sangat penting dalam dunia multi-perangkat saat ini...',
    blogPost4Title: 'Fitur JavaScript ES2024',
    blogPost4Excerpt: 'Jelajahi fitur JavaScript terbaru dan cara menggunakannya dalam proyek Anda.',
    blogPost4Content: 'JavaScript terus berkembang dengan fitur-fitur baru yang menarik...',
    searchBlog: 'Cari postingan blog...',
    allCategories: 'Semua Kategori',
    readMore: 'Baca Lebih Lanjut',
    noBlogPostsFound: 'Tidak ada postingan blog yang cocok dengan kriteria Anda.',
    
    // Footer
    footerText: '© 2024 Alexander Hilarius Fuad Fatahillah. Semua hak dilindungi.',
    quickLinks: 'Tautan Cepat',
    services: 'Layanan',
    resources: 'Sumber Daya',
    webDevelopment: 'Pengembangan Web',
    mobileDevelopment: 'Pengembangan Mobile',
    uiuxDesign: 'Desain UI/UX',
    consulting: 'Konsultasi',
    resume: 'Resume',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat & Ketentuan',
    stayUpdated: 'Tetap Terkini',
    subscribe: 'Berlangganan',
    enterEmail: 'Masukkan email Anda',
    madeWithPassion: 'Dibuat dengan passion',
    newsletterDescription: 'Berlangganan ke newsletter saya untuk mendapatkan pembaruan tentang proyek-proyek terbaru, artikel, dan wawasan teknologi.',
    cookiePolicy: 'Kebijakan Cookie',
    
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
