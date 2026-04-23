import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [100, 'Skill name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: [
      'Frontend',
      'Backend', 
      'Database',
      'DevOps',
      'Mobile',
      'Design',
      'Tools',
      'Other'
    ],
    default: 'Other'
  },
  level: {
    type: Number,
    required: [true, 'Skill level is required'],
    min: [0, 'Skill level must be at least 0'],
    max: [100, 'Skill level cannot exceed 100'],
    validate: {
      validator: Number.isInteger,
      message: 'Skill level must be an integer'
    }
  },
  icon_name: {
    type: String,
    required: [true, 'Icon name is required'],
    trim: true,
    maxlength: [50, 'Icon name cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9-_]+$/, 'Icon name can only contain letters, numbers, hyphens, and underscores']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  years_experience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50'],
    validate: {
      validator: Number.isInteger,
      message: 'Years of experience must be an integer'
    }
  },
  proficiency_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: function() {
      if (this.level >= 80) return 'Expert'
      if (this.level >= 60) return 'Advanced'
      if (this.level >= 40) return 'Intermediate'
      return 'Beginner'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  order_index: {
    type: Number,
    default: 0,
    min: [0, 'Order index cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
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
skillSchema.index({ name: 1 })
skillSchema.index({ category: 1, level: -1 })
skillSchema.index({ is_active: 1, order_index: 1 })
skillSchema.index({ is_featured: 1, level: -1 })
skillSchema.index({ tags: 1 })

// Pre-save middleware to auto-calculate proficiency level based on level
skillSchema.pre('save', function(next) {
  if (this.isModified('level')) {
    if (this.level >= 80) this.proficiency_level = 'Expert'
    else if (this.level >= 60) this.proficiency_level = 'Advanced'
    else if (this.level >= 40) this.proficiency_level = 'Intermediate'
    else this.proficiency_level = 'Beginner'
  }
  next()
})

// Pre-update middleware to update updated_at field
skillSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  this.set({ updated_at: new Date() })
  next()
})

// Virtual for skill level as percentage with %
skillSchema.virtual('levelPercentage').get(function() {
  return `${this.level}%`
})

// Virtual for skill color based on level
skillSchema.virtual('levelColor').get(function() {
  if (this.level >= 80) return '#10b981' // green-500
  if (this.level >= 60) return '#3b82f6' // blue-500
  if (this.level >= 40) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
})

// Virtual for skill bar width (for UI progress bars)
skillSchema.virtual('barWidth').get(function() {
  return `${this.level}%`
})

// Virtual for formatted years of experience
skillSchema.virtual('formattedExperience').get(function() {
  if (!this.years_experience) return 'Not specified'
  const years = this.years_experience
  return years === 1 ? '1 year' : `${years} years`
})

// Static method to find skills by category
skillSchema.statics.findByCategory = function(category, options = {}) {
  const { isActive = true, sortBy = 'order_index' } = options
  
  let query = this.find({ category, is_active: isActive })
  
  switch (sortBy) {
    case 'level':
      query = query.sort({ level: -1 })
      break
    case 'name':
      query = query.sort({ name: 1 })
      break
    default:
      query = query.sort({ order_index: 1, level: -1 })
  }
  
  return query
}

// Static method to find featured skills
skillSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ is_featured: true, is_active: true })
    .sort({ level: -1, order_index: 1 })
    .limit(limit)
}

// Static method to get skills by proficiency level
skillSchema.statics.findByProficiency = function(level, options = {}) {
  const { limit = 20 } = options
  return this.find({ proficiency_level: level, is_active: true })
    .sort({ level: -1, order_index: 1 })
    .limit(limit)
}

// Static method to search skills
skillSchema.statics.searchSkills = function(query, options = {}) {
  const { limit = 20, category } = options
  
  let searchQuery = {
    is_active: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }
  
  if (category) {
    searchQuery.category = category
  }
  
  return this.find(searchQuery)
    .sort({ level: -1, order_index: 1 })
    .limit(limit)
}

// Static method to get skills statistics
skillSchema.statics.getStatistics = function() {
  return this.aggregate([
    { $match: { is_active: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averageLevel: { $avg: '$level' },
        maxLevel: { $max: '$level' },
        minLevel: { $min: '$level' }
      }
    },
    { $sort: { count: -1 } }
  ])
}

// Instance method to update skill level
skillSchema.methods.updateLevel = function(newLevel) {
  this.level = Math.max(0, Math.min(100, newLevel))
  return this.save()
}

// Instance method to toggle featured status
skillSchema.methods.toggleFeatured = function() {
  this.is_featured = !this.is_featured
  return this.save()
}

// Instance method to add tag
skillSchema.methods.addTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim()
  if (!this.tags.includes(normalizedTag)) {
    this.tags.push(normalizedTag)
  }
  return this.save()
}

// Instance method to remove tag
skillSchema.methods.removeTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim()
  this.tags = this.tags.filter(t => t !== normalizedTag)
  return this.save()
}

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema)

export default Skill
