'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Filter, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with payment integration, user authentication, and admin dashboard. Built with React, Node.js, and MongoDB.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      github: 'https://github.com/alexfuad/ecommerce-platform',
      live: 'https://ecommerce-demo.vercel.app',
      featured: true,
      details: {
        client: 'Retail Company',
        duration: '3 months',
        role: 'Full Stack Developer',
        challenges: 'Implementing secure payment processing and real-time inventory management',
      },
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Socket.io'],
      github: 'https://github.com/alexfuad/task-manager',
      live: 'https://taskmanager-demo.vercel.app',
      featured: true,
      details: {
        client: 'Tech Startup',
        duration: '2 months',
        role: 'Lead Developer',
        challenges: 'Real-time synchronization and complex state management',
      },
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Weather API', 'Chart.js', 'Geolocation'],
      github: 'https://github.com/alexfuad/weather-dashboard',
      live: 'https://weather-demo.vercel.app',
      featured: false,
      details: {
        client: 'Personal Project',
        duration: '1 month',
        role: 'Full Stack Developer',
        challenges: 'API integration and data visualization',
      },
    },
    {
      id: 4,
      title: 'Mobile Banking App',
      description: 'A secure mobile banking application with biometric authentication, transaction history, and budget tracking.',
      image: '/api/placeholder/800/600',
      category: 'mobile',
      technologies: ['React Native', 'Firebase', 'Redux', 'Node.js', 'Biometric API'],
      github: 'https://github.com/alexfuad/mobile-banking',
      live: null,
      featured: false,
      details: {
        client: 'FinTech Company',
        duration: '4 months',
        role: 'Mobile Developer',
        challenges: 'Security implementation and cross-platform compatibility',
      },
    },
    {
      id: 5,
      title: 'AI Content Generator',
      description: 'An AI-powered content generation platform with multiple templates, custom prompts, and content optimization.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['Next.js', 'OpenAI API', 'Tailwind CSS', 'MongoDB', 'WebSockets'],
      github: 'https://github.com/alexfuad/ai-content-generator',
      live: 'https://ai-content-demo.vercel.app',
      featured: true,
      details: {
        client: 'Content Agency',
        duration: '2.5 months',
        role: 'Full Stack Developer',
        challenges: 'AI integration and real-time content generation',
      },
    },
    {
      id: 6,
      title: 'Social Media Analytics',
      description: 'A comprehensive social media analytics dashboard with data visualization, sentiment analysis, and reporting features.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['React', 'D3.js', 'Express', 'PostgreSQL', 'Redis'],
      github: 'https://github.com/alexfuad/social-analytics',
      live: 'https://analytics-demo.vercel.app',
      featured: false,
      details: {
        client: 'Marketing Agency',
        duration: '3 months',
        role: 'Frontend Developer',
        challenges: 'Complex data visualization and performance optimization',
      },
    },
    {
      id: 7,
      title: 'Learning Management System',
      description: 'An educational platform with video streaming, progress tracking, and interactive quizzes for online learning.',
      image: '/api/placeholder/800/600',
      category: 'web',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'AWS S3', 'WebRTC'],
      github: 'https://github.com/alexfuad/lms-platform',
      live: 'https://lms-demo.vercel.app',
      featured: false,
      details: {
        client: 'Education Company',
        duration: '5 months',
        role: 'Full Stack Developer',
        challenges: 'Video streaming and real-time communication',
      },
    },
    {
      id: 8,
      title: 'Fitness Tracking App',
      description: 'A comprehensive fitness tracking app with workout plans, progress monitoring, and social features.',
      image: '/api/placeholder/800/600',
      category: 'mobile',
      technologies: ['React Native', 'Firebase', 'Redux', 'HealthKit', 'Google Fit'],
      github: 'https://github.com/alexfuad/fitness-tracker',
      live: null,
      featured: false,
      details: {
        client: 'Health Startup',
        duration: '3 months',
        role: 'Mobile Developer',
        challenges: 'Health data integration and offline functionality',
      },
    },
  ]

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'web', name: 'Web Development', count: projects.filter(p => p.category === 'web').length },
    { id: 'mobile', name: 'Mobile Apps', count: projects.filter(p => p.category === 'mobile').length },
    { id: 'design', name: 'UI/UX Design', count: 0 },
  ]

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.category === activeFilter
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Portfolio</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            My <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A collection of my recent work showcasing my skills in web development, 
            mobile applications, and innovative solutions. Each project represents 
            a unique challenge and learning experience.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{projects.filter(p => p.featured).length}</div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Passion</div>
            </div>
          </div>
        </motion.div>

        {/* Filter and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeFilter === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </motion.button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">PJ</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><strong>Client:</strong> {project.details.client}</div>
                      <div><strong>Duration:</strong> {project.details.duration}</div>
                      <div><strong>Role:</strong> {project.details.role}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm font-medium">Code</span>
                    </motion.a>
                    
                    {project.live && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Live</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No projects found matching your criteria.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. 
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get In Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
