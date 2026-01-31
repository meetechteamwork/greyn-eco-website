const mongoose = require('mongoose');

const volunteerHoursEntrySchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    index: true
  },
  volunteerEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CorporateVolunteers',
    required: true,
    index: true
  },
  volunteerName: {
    type: String,
    required: true,
    trim: true
  },
  volunteerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true,
    index: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  notes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
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
volunteerHoursEntrySchema.index({ corporate: 1, status: 1 });
volunteerHoursEntrySchema.index({ corporate: 1, eventDate: -1 });
volunteerHoursEntrySchema.index({ volunteerEvent: 1 });

module.exports = mongoose.model('VolunteerHoursEntry', volunteerHoursEntrySchema);
