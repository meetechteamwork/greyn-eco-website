const mongoose = require('mongoose');

/**
 * Product Model
 * Public products visible to all users (investors, NGOs, corporate, admin)
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  variant: {
    type: String,
    trim: true
  },
  detailLabel: {
    type: String,
    trim: true
  },
  detailValue: {
    type: String,
    trim: true
  },
  badge: {
    type: String,
    enum: ['new', 'hot', 'trending', 'bestseller', 'limited', 'sale'],
    trim: true
  },
  tag: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'out_of_stock', 'discontinued', 'draft'],
    default: 'active',
    index: true
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
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: -1, status: 1 });
productSchema.index({ badge: 1, status: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
