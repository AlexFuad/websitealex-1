import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Project slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  detailed_description: {
    type: String,
    maxlength: [5000, 'Detailed description cannot exceed 5000 characters']
  },
  image_url: {
    type: String,
    required: [true, 'Project image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
      },
      message: 'Image URL must be a valid URL ending with jpg, jpeg, png, gif, or webp'
    }
  },
  additional_images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
      },
      message: 'Additional image URL must be a valid URL ending with jpg, jpeg, png, gif, or webp'
    }
  }],
  demo_link: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Demo link must be a valid URL'
    }
  },
  repo_link: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Repository link must be a valid URL'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: [
      'web-development',
      'mobile-development',
      'full-stack',
      'ui-ux-design',
      'backend',
      'frontend',
      'other'
    ],
    default: 'web-development'
  },
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Technology name cannot exceed 50 characters']
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  client: {
    name: {
      type: String,
      maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    link: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v)
        },
        message: 'Client link must be a valid URL'
      }
    }
  },
  project_type: {
    type: String,
    enum: ['personal', 'freelance', 'commercial', 'open-source', 'educational'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold', 'archived'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  order_index: {
    type: Number,
    default: 0,
    min: [0, 'Order index cannot be negative']
  },
  start_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  },
  duration_months: {
    type: Number,
    min: [0, 'Duration cannot be negative'],
    max: [120, 'Duration cannot exceed 120 months']
  },
  team_size: {
    type: Number,
    min: [1, 'Team size must be at least 1'],
    max: [50, 'Team size cannot exceed 50']
  },
  role: {
    type: String,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  achievements: [{
    type: String,
    maxlength: [200, 'Achievement cannot exceed 200 characters']
  }],
  challenges: [{
    type: String,
    maxlength: [200, 'Challenge cannot exceed 200 characters']
  }],
  seo_meta: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      maxlength: [50, 'SEO keyword cannot exceed 50 characters']
    }]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
portfolioSchema.index({ slug: 1 })
portfolioSchema.index({ project_name: 'text', description: 'text' })
portfolioSchema.index({ category: 1, is_active: 1 })
portfolioSchema.index({ featured: 1, order_index: 1 })
portfolioSchema.index({ status: 1, is_active: 1 })
portfolioSchema.index({ tags: 1 })
portfolioSchema.index({ technologies: 1 })
portfolioSchema.index({ created_at: -1 })
portfolioSchema.index({ order_index: 1 })

// Pre-save middleware to generate slug from project name if not provided
portfolioSchema.pre('save', function(next) {
  if (this.isModified('project_name') && !this.slug) {
    this.slug = this.project_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
  
  // Auto-generate SEO title if not provided
  if (this.isModified('project_name') && !this.seo_meta?.title) {
    this.seo_meta = this.seo_meta || {}
    this.seo_meta.title = this.project_name
  }
  
  // Auto-generate SEO description from description if not provided
  if (this.isModified('description') && !this.seo_meta?.description) {
    this.seo_meta = this.seo_meta || {}
    this.seo_meta.description = this.description.length > 160 
      ? this.description.substring(0, 157) + '...'
      : this.description
  }
  
  next()
})

// Pre-update middleware to update updated_at field
portfolioSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  this.set({ updated_at: new Date() })
  next()
})

// Virtual for project URL
portfolioSchema.virtual('url').get(function() {
  return `/portfolio/${this.slug}`
})

// Virtual for formatted date range
portfolioSchema.virtual('formattedDateRange').get(function() {
  if (!this.start_date) return 'No date specified'
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  const start = this.start_date.toLocaleDateString('en-US', options)
  
  if (!this.end_date) {
    return `${start} - Present`
  }
  
  const end = this.end_date.toLocaleDateString('en-US', options)
  return `${start} - ${end}`
})

// Virtual for project duration in months
portfolioSchema.virtual('projectDuration').get(function() {
  if (this.duration_months) return this.duration_months
  
  if (!this.start_date) return null
  
  const end = this.end_date || new Date()
  const months = Math.floor((end - this.start_date) / (1000 * 60 * 60 * 24 * 30))
  return Math.max(1, months)
})

// Virtual for technology names array
portfolioSchema.virtual('technologyNames').get(function() {
  return this.technologies.map(tech => tech.name)
})

// Virtual for has demo link
portfolioSchema.virtual('hasDemo').get(function() {
  return !!this.demo_link
})

// Virtual for has repository link
portfolioSchema.virtual('hasRepo').get(function() {
  return !!this.repo_link
})

// Static method to find active projects
portfolioSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, is_active: true })
    .sort({ order_index: 1, created_at: -1 })
}

// Static method to find featured projects
portfolioSchema.statics.findFeatured = function(limit = 6) {
  return this.find({ featured: true, is_active: true, status: 'completed' })
    .sort({ order_index: 1, created_at: -1 })
    .limit(limit)
}

// Static method to find projects by category
portfolioSchema.statics.findByCategory = function(category, options = {}) {
  const { limit = 20, status = 'completed' } = options
  return this.find({ category, status, is_active: true })
    .sort({ order_index: 1, created_at: -1 })
    .limit(limit)
}

// Static method to search projects
portfolioSchema.statics.searchProjects = function(query, options = {}) {
  const { limit = 20, category, tags } = options
  
  let searchQuery = {
    is_active: true,
    $text: { $search: query }
  }
  
  if (category) {
    searchQuery.category = category
  }
  
  if (tags && tags.length > 0) {
    searchQuery.tags = { $in: tags }
  }
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, order_index: 1 })
    .limit(limit)
}

// Static method to get projects by technology
portfolioSchema.statics.findByTechnology = function(technology, options = {}) {
  const { limit = 20 } = options
  return this.find({ 
    'technologies.name': { $regex: technology, $options: 'i' },
    is_active: true 
  })
    .sort({ order_index: 1, created_at: -1 })
    .limit(limit)
}

// Static method to get project statistics
portfolioSchema.statics.getStatistics = function() {
  return this.aggregate([
    { $match: { is_active: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        featuredCount: { $sum: { $cond: ['$featured', 1, 0] } },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ])
}

// Instance method to toggle featured status
portfolioSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured
  return this.save()
}

// Instance method to add technology
portfolioSchema.methods.addTechnology = function(name, level = 'intermediate') {
  const existingTech = this.technologies.find(tech => 
    tech.name.toLowerCase() === name.toLowerCase()
  )
  
  if (!existingTech) {
    this.technologies.push({ name, level })
  }
  
  return this.save()
}

// Instance method to remove technology
portfolioSchema.methods.removeTechnology = function(name) {
  this.technologies = this.technologies.filter(tech => 
    tech.name.toLowerCase() !== name.toLowerCase()
  )
  return this.save()
}

// Instance method to add tag
portfolioSchema.methods.addTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim()
  if (!this.tags.includes(normalizedTag)) {
    this.tags.push(normalizedTag)
  }
  return this.save()
}

// Instance method to remove tag
portfolioSchema.methods.removeTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim()
  this.tags = this.tags.filter(t => t !== normalizedTag)
  return this.save()
}

// Instance method to update order
portfolioSchema.methods.updateOrder = function(newOrder) {
  this.order_index = Math.max(0, newOrder)
  return this.save()
}

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)

export default Portfolio
