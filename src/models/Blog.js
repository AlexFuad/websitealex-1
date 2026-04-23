import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can store HTML or JSON content
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: ['web-development', 'react', 'javascript', 'design', 'tutorial', 'news', 'other'],
    lowercase: true
  },
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
    }],
    og_image: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
        },
        message: 'OG image must be a valid URL ending with jpg, jpeg, png, gif, or webp'
      }
    }
  },
  image_url: {
    type: String,
    required: [true, 'Blog image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
      },
      message: 'Image URL must be a valid URL ending with jpg, jpeg, png, gif, or webp'
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  read_time: {
    type: Number,
    min: [1, 'Read time must be at least 1 minute'],
    max: [60, 'Read time cannot exceed 60 minutes']
  },
  view_count: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  like_count: {
    type: Number,
    default: 0,
    min: [0, 'Like count cannot be negative']
  },
  published_at: {
    type: Date,
    default: null
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
blogSchema.index({ slug: 1 })
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' })
blogSchema.index({ category: 1, status: 1 })
blogSchema.index({ author: 1 })
blogSchema.index({ created_at: -1 })
blogSchema.index({ published_at: -1 })
blogSchema.index({ featured: 1, published_at: -1 })
blogSchema.index({ tags: 1 })

// Pre-save middleware to generate slug from title if not provided
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
  
  // Set published_at when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.published_at) {
    this.published_at = new Date()
  }
  
  // Auto-generate SEO title if not provided
  if (this.isModified('title') && !this.seo_meta?.title) {
    this.seo_meta = this.seo_meta || {}
    this.seo_meta.title = this.title
  }
  
  // Auto-generate SEO description from excerpt if not provided
  if (this.isModified('excerpt') && !this.seo_meta?.description) {
    this.seo_meta = this.seo_meta || {}
    this.seo_meta.description = this.excerpt.length > 160 
      ? this.excerpt.substring(0, 157) + '...'
      : this.excerpt
  }
  
  next()
})

// Pre-update middleware to update updated_at field
blogSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  this.set({ updated_at: new Date() })
  next()
})

// Virtual for blog URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`
})

// Virtual for formatted published date
blogSchema.virtual('formattedPublishedAt').get(function() {
  return this.published_at 
    ? this.published_at.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null
})

// Virtual for reading time in minutes
blogSchema.virtual('readingTime').get(function() {
  if (this.read_time) return this.read_time
  
  // Calculate reading time based on content length (average 200 words per minute)
  const content = typeof this.content === 'string' ? this.content : JSON.stringify(this.content)
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
})

// Static method to find published blogs
blogSchema.statics.findPublished = function(filter = {}) {
  return this.find({ ...filter, status: 'published' })
    .populate('author', 'username profile_image')
    .sort({ published_at: -1 })
}

// Static method to find featured blogs
blogSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ featured: true, status: 'published' })
    .populate('author', 'username profile_image')
    .sort({ published_at: -1 })
    .limit(limit)
}

// Static method to search blogs
blogSchema.statics.searchBlogs = function(query, options = {}) {
  const { limit = 10, page = 1, category } = options
  
  let searchFilter = {
    status: 'published',
    $text: { $search: query }
  }
  
  if (category) {
    searchFilter.category = category
  }
  
  return this.find(searchFilter)
    .populate('author', 'username profile_image')
    .sort({ score: { $meta: 'textScore' }, published_at: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
}

// Instance method to increment view count
blogSchema.methods.incrementViews = function() {
  this.view_count += 1
  return this.save()
}

// Instance method to increment like count
blogSchema.methods.incrementLikes = function() {
  this.like_count += 1
  return this.save()
}

// Instance method to publish blog
blogSchema.methods.publish = function() {
  this.status = 'published'
  this.published_at = new Date()
  return this.save()
}

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default Blog
