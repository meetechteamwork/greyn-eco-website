const mongoose = require('mongoose');

/**
 * NGO Person Details Model
 * Contact person/leadership information for NGO organizations
 * Collection: ngo_person_details
 */
const ngoPersonDetailsSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  expertise: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: {
      type: String,
      trim: true,
      required: true
    },
    institution: {
      type: String,
      trim: true,
      required: true
    },
    year: {
      type: String,
      trim: true,
      default: ''
    }
  }],
  projectsLed: {
    type: Number,
    default: 0,
    min: 0
  },
  yearsExperience: {
    type: Number,
    default: 0,
    min: 0
  },
  publications: {
    type: Number,
    default: 0,
    min: 0
  },
  awards: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    researchGate: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    }
  },
  source: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'ngo_person_details'
});

// Indexes
ngoPersonDetailsSchema.index({ ngo: 1 });
ngoPersonDetailsSchema.index({ email: 1 });

module.exports = mongoose.model('NgoPersonDetails', ngoPersonDetailsSchema);
