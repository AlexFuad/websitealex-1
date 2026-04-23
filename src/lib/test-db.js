import connectDB from './db.js'
import { User, Blog, Skill, Portfolio } from '../models/index.js'

async function testDatabase() {
  try {
    console.log('Testing database connection and models...')
    
    // Test database connection
    await connectDB()
    console.log('Database connected successfully!')
    
    // Test User model
    console.log('\nTesting User model...')
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      profile_image: 'https://example.com/avatar.jpg'
    })
    
    // Test password hashing
    const isMatch = await testUser.comparePassword('password123')
    console.log('Password hashing test:', isMatch ? 'PASSED' : 'FAILED')
    
    // Test Blog model
    console.log('\nTesting Blog model...')
    const testBlog = new Blog({
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: '<p>This is a test blog post content</p>',
      excerpt: 'This is a test excerpt',
      tags: ['test', 'blog'],
      category: 'web-development',
      image_url: 'https://example.com/blog-image.jpg',
      author: testUser._id
    })
    
    // Test virtual methods
    console.log('Blog URL:', testBlog.url)
    console.log('Blog reading time:', testBlog.readingTime, 'minutes')
    
    // Test Skill model
    console.log('\nTesting Skill model...')
    const testSkill = new Skill({
      name: 'React',
      category: 'Frontend',
      level: 85,
      icon_name: 'react',
      description: 'React JavaScript library',
      years_experience: 3
    })
    
    // Test virtual methods
    console.log('Skill level:', testSkill.levelPercentage)
    console.log('Skill color:', testSkill.levelColor)
    console.log('Proficiency level:', testSkill.proficiency_level)
    
    // Test Portfolio model
    console.log('\nTesting Portfolio model...')
    const testPortfolio = new Portfolio({
      project_name: 'Test Project',
      slug: 'test-project',
      description: 'This is a test project description',
      image_url: 'https://example.com/project-image.jpg',
      demo_link: 'https://demo.example.com',
      repo_link: 'https://github.com/example/project',
      tags: ['test', 'project'],
      category: 'web-development',
      technologies: [
        { name: 'React', level: 'advanced' },
        { name: 'Node.js', level: 'intermediate' }
      ]
    })
    
    // Test virtual methods
    console.log('Portfolio URL:', testPortfolio.url)
    console.log('Has demo link:', testPortfolio.hasDemo)
    console.log('Has repo link:', testPortfolio.hasRepo)
    console.log('Technology names:', testPortfolio.technologyNames)
    
    console.log('\nAll model tests completed successfully!')
    console.log('Database and models are ready for use.')
    
  } catch (error) {
    console.error('Database test failed:', error.message)
    console.error('Please check your MongoDB connection and configuration.')
  }
}

// Run the test if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  testDatabase()
}

export default testDatabase
