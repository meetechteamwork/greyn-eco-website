const mongoose = require('mongoose');

const corporateVolunteersSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  eventDate: {
    type: Date,
    required: true,
    index: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  totalHours: {
    type: Number,
    required: true,
    min: 0
  },
  participantCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  category: {
    type: String,
    enum: ['environmental', 'community', 'education', 'health', 'disaster-relief', 'other'],
    default: 'community'
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
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
  timestamps: true
});

// Index for efficient queries
corporateVolunteersSchema.index({ corporate: 1, eventDate: -1 });
corporateVolunteersSchema.index({ corporate: 1, category: 1 });

module.exports = mongoose.model('CorporateVolunteers', corporateVolunteersSchema);
