import connectDB from '../lib/db.js'
import User from './User.js'
import Blog from './Blog.js'
import Skill from './Skill.js'
import Portfolio from './Portfolio.js'

// Connect to database
connectDB()

export {
  User,
  Blog,
  Skill,
  Portfolio
}

export default {
  User,
  Blog,
  Skill,
  Portfolio
}
