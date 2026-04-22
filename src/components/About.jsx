'use client'

import { motion } from 'framer-motion'
import { Code, Database, Globe, Smartphone, Cloud, Shield } from 'lucide-react'

export default function About() {
  const skills = [
    { icon: Code, name: 'Frontend Development', level: 90 },
    { icon: Database, name: 'Backend Development', level: 85 },
    { icon: Globe, name: 'Web Design', level: 75 },
    { icon: Smartphone, name: 'Mobile Development', level: 70 },
    { icon: Cloud, name: 'Cloud Services', level: 80 },
    { icon: Shield, name: 'Security', level: 75 },
  ]

  const experiences = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications and mentoring junior developers.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Built and maintained multiple client projects using modern web technologies.',
    },
    {
      title: 'Junior Developer',
      company: 'Startup Inc',
      period: '2019 - 2020',
      description: 'Started my journey in web development, learning and implementing best practices.',
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

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
            About Me
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'm a passionate full stack developer with expertise in modern web technologies
            and a love for creating exceptional user experiences.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* About Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-900 mb-6">
              My Story
            </motion.h3>
            
            <motion.p variants={itemVariants} className="text-gray-600 mb-4">
              Hello! I'm Alex Fuad, a full stack developer with a passion for creating beautiful,
              functional, and user-centered digital experiences. I'm always looking for new and
              innovative ways to bring my clients' visions to life.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              With over 4 years of experience in web development, I've worked on a wide range
              of projects from small business websites to large-scale enterprise applications.
              My approach combines technical expertise with creative problem-solving to deliver
              solutions that exceed expectations.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Frontend</h4>
                <p className="text-sm text-blue-700">React, Next.js, TypeScript, Tailwind CSS</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Backend</h4>
                <p className="text-sm text-purple-700">Node.js, Express, MongoDB, PostgreSQL</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Tools</h4>
                <p className="text-sm text-green-700">Git, Docker, AWS, Vercel</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Design</h4>
                <p className="text-sm text-orange-700">Figma, Adobe XD, Responsive Design</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Skills & Experience */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-900 mb-6">
              Skills & Experience
            </motion.h3>

            {/* Skills */}
            <motion.div variants={itemVariants} className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Technical Skills</h4>
              <div className="space-y-4">
                {skills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-4"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Work Experience</h4>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h5 className="font-semibold text-gray-900">{exp.title}</h5>
                    <p className="text-sm text-blue-600">{exp.company} · {exp.period}</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
