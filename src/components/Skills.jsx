'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  Nodejs, 
  Database, 
  Cloud, 
  GitBranch, 
  Terminal,
  Palette,
  Smartphone,
  Shield,
  Globe,
  Server
} from 'lucide-react'

export default function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Code,
      color: 'blue',
      skills: [
        { name: 'React.js', level: 90 },
        { name: 'Next.js', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'Tailwind CSS', level: 88 },
        { name: 'JavaScript', level: 92 },
        { name: 'HTML/CSS', level: 95 },
      ],
    },
    {
      title: 'Backend Development',
      icon: Server,
      color: 'green',
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 82 },
        { name: 'MongoDB', level: 78 },
        { name: 'PostgreSQL', level: 75 },
        { name: 'REST APIs', level: 88 },
        { name: 'GraphQL', level: 70 },
      ],
    },
    {
      title: 'Tools & Technologies',
      icon: Terminal,
      color: 'purple',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Docker', level: 75 },
        { name: 'AWS', level: 70 },
        { name: 'Vercel', level: 85 },
        { name: 'CI/CD', level: 72 },
        { name: 'Linux', level: 78 },
      ],
    },
    {
      title: 'Design & UI/UX',
      icon: Palette,
      color: 'pink',
      skills: [
        { name: 'Figma', level: 80 },
        { name: 'Adobe XD', level: 75 },
        { name: 'Responsive Design', level: 92 },
        { name: 'UI/UX Principles', level: 85 },
        { name: 'Prototyping', level: 78 },
        { name: 'Wireframing', level: 82 },
      ],
    },
  ]

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

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200',
        progress: 'from-blue-400 to-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200',
        progress: 'from-green-400 to-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200',
        progress: 'from-purple-400 to-purple-600',
      },
      pink: {
        bg: 'bg-pink-50',
        icon: 'text-pink-600',
        border: 'border-pink-200',
        progress: 'from-pink-400 to-pink-600',
      },
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
            Technical Skills
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
            in various technologies and tools.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skillCategories.map((category, index) => {
            const Icon = category.icon
            const colors = getColorClasses(category.color)
            
            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${colors.bg} p-6 rounded-xl border ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 1, 
                            ease: 'easeOut',
                            delay: index * 0.1 + skill.level * 0.01
                          }}
                          className={`h-1.5 rounded-full bg-gradient-to-r ${colors.progress}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
            <Code className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Always learning and expanding my skill set
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
