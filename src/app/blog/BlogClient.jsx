'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, Clock, User, ArrowLeft, ChevronRight, Tag } from 'lucide-react'
import Link from 'next/link'

export default function BlogClient() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const blogPosts = [
    {
      id: 1,
      title: 'Building Scalable React Applications: Best Practices',
      excerpt: 'Learn how to structure your React applications for scalability, maintainability, and performance. Discover proven patterns and techniques.',
      content: 'In this comprehensive guide, we\'ll explore the best practices for building scalable React applications that can grow with your business needs...',
      image: '/api/placeholder/800/400',
      category: 'react',
      author: 'Alex Fuad',
      date: '2024-01-15',
      readTime: '8 min',
      tags: ['React', 'JavaScript', 'Architecture', 'Performance'],
      featured: true,
    },
    {
      id: 2,
      title: 'Next.js 14: What\'s New and How to Upgrade',
      excerpt: 'Explore the latest features in Next.js 14, including improved performance, new app router, and enhanced developer experience.',
      content: 'Next.js 14 brings exciting new features that significantly improve both developer experience and application performance...',
      image: '/api/placeholder/800/400',
      category: 'nextjs',
      author: 'Alex Fuad',
      date: '2024-01-10',
      readTime: '6 min',
      tags: ['Next.js', 'React', 'Web Development', 'Tutorial'],
      featured: true,
    },
    {
      id: 3,
      title: 'Mastering TypeScript: A Developer\'s Guide',
      excerpt: 'Deep dive into TypeScript and learn how to leverage its powerful type system to build more robust applications.',
      content: 'TypeScript has become an essential tool for modern JavaScript development. In this guide, we\'ll explore advanced TypeScript concepts...',
      image: '/api/placeholder/800/400',
      category: 'typescript',
      author: 'Alex Fuad',
      date: '2024-01-05',
      readTime: '10 min',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Tutorial'],
      featured: false,
    },
    {
      id: 4,
      title: 'The Future of Web Development: Trends to Watch',
      excerpt: 'Discover the emerging trends and technologies that are shaping the future of web development in 2024 and beyond.',
      content: 'The web development landscape is constantly evolving. Let\'s explore the trends that will define the future of our industry...',
      image: '/api/placeholder/800/400',
      category: 'trends',
      author: 'Alex Fuad',
      date: '2023-12-28',
      readTime: '7 min',
      tags: ['Web Development', 'Trends', 'Technology', 'Future'],
      featured: false,
    },
    {
      id: 5,
      title: 'Building RESTful APIs with Node.js and Express',
      excerpt: 'Learn how to design and implement RESTful APIs using Node.js and Express, following best practices for security and performance.',
      content: 'Building robust APIs is crucial for modern web applications. This guide covers everything from basic concepts to advanced patterns...',
      image: '/api/placeholder/800/400',
      category: 'backend',
      author: 'Alex Fuad',
      date: '2023-12-20',
      readTime: '9 min',
      tags: ['Node.js', 'Express', 'API', 'Backend'],
      featured: false,
    },
    {
      id: 6,
      title: 'CSS Grid vs Flexbox: When to Use Which',
      excerpt: 'Understanding the differences between CSS Grid and Flexbox and knowing when to use each layout system for optimal results.',
      content: 'CSS Grid and Flexbox are powerful layout tools, but knowing when to use each one can be confusing. Let\'s clarify their differences...',
      image: '/api/placeholder/800/400',
      category: 'css',
      author: 'Alex Fuad',
      date: '2023-12-15',
      readTime: '5 min',
      tags: ['CSS', 'Grid', 'Flexbox', 'Frontend'],
      featured: false,
    },
    {
      id: 7,
      title: 'Introduction to Machine Learning for Developers',
      excerpt: 'A beginner-friendly introduction to machine learning concepts and how developers can get started with ML in their applications.',
      content: 'Machine learning is no longer just for data scientists. Developers can now integrate ML capabilities into their applications...',
      image: '/api/placeholder/800/400',
      category: 'ai',
      author: 'Alex Fuad',
      date: '2023-12-10',
      readTime: '12 min',
      tags: ['Machine Learning', 'AI', 'Python', 'Development'],
      featured: false,
    },
    {
      id: 8,
      title: 'Optimizing React Performance: Tips and Tricks',
      excerpt: 'Discover proven techniques to optimize your React applications for better performance and user experience.',
      content: 'Performance optimization is crucial for delivering smooth user experiences. Here are the most effective techniques for React apps...',
      image: '/api/placeholder/800/400',
      category: 'react',
      author: 'Alex Fuad',
      date: '2023-12-05',
      readTime: '8 min',
      tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
      featured: false,
    },
  ]

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'react', name: 'React', count: blogPosts.filter(p => p.category === 'react').length },
    { id: 'nextjs', name: 'Next.js', count: blogPosts.filter(p => p.category === 'nextjs').length },
    { id: 'typescript', name: 'TypeScript', count: blogPosts.filter(p => p.category === 'typescript').length },
    { id: 'backend', name: 'Backend', count: blogPosts.filter(p => p.category === 'backend').length },
    { id: 'trends', name: 'Trends', count: blogPosts.filter(p => p.category === 'trends').length },
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesFilter = activeFilter === 'all' || post.category === activeFilter
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
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
              <span className="font-bold text-xl text-gray-900">Blog</span>
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
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sharing my thoughts, experiences, and insights about web development, 
            technology trends, and programming. Join me on this journey of continuous learning.
          </p>
          
          {/* Blog Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{blogPosts.length}</div>
              <div className="text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{blogPosts.filter(p => p.featured).length}</div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">Comments</div>
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
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Featured Badge */}
                {post.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {/* Post Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">BL</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{mounted ? formatDate(post.date) : post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
          </motion.div>
        )}

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to My Newsletter</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and insights delivered straight to your inbox. 
              No spam, unsubscribe anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/70 backdrop-blur-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
