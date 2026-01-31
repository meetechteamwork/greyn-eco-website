const mongoose = require('mongoose');

/**
 * Project Model
 * Public investment projects visible to all users (investors, NGOs, corporate, admin)
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Reforestation',
      'Solar Energy',
      'Wind Energy',
      'Ocean Conservation',
      'Urban Sustainability',
      'Clean Transportation',
      'Waste Management',
      'Water Conservation',
      'Energy Efficiency',
      'Other'
    ],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: [5000, 'Long description cannot exceed 5000 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  carbonImpact: {
    type: String,
    required: [true, 'Carbon impact is required'],
    trim: true
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: [0, 'Funding goal must be positive']
  },
  currentFunding: {
    type: Number,
    default: 0,
    min: [0, 'Current funding cannot be negative']
  },
  minInvestment: {
    type: Number,
    default: 100,
    min: [0, 'Minimum investment must be positive']
  },
  duration: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'funded', 'completed', 'cancelled', 'draft'],
    default: 'active',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  investorCount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Admin management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ featured: -1, status: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for funding percentage
projectSchema.virtual('fundingPercentage').get(function() {
  if (this.fundingGoal === 0) return 0;
  return Math.min(100, (this.currentFunding / this.fundingGoal) * 100);
});

// Ensure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
