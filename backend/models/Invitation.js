const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  invitationCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['corporate', 'ngo', 'carbon', 'admin', 'verifier'],
    lowercase: true
  },
  portal: {
    type: String,
    required: [true, 'Portal is required'],
    enum: ['Corporate ESG', 'Carbon Marketplace', 'NGO Portal', 'Admin Portal']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'revoked'],
    default: 'pending',
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  acceptedAt: {
    type: Date
  },
  revokedAt: {
    type: Date
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  resendCount: {
    type: Number,
    default: 0
  },
  lastResentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
invitationSchema.index({ email: 1, status: 1 });
invitationSchema.index({ invitationCode: 1 });
invitationSchema.index({ token: 1 });
invitationSchema.index({ status: 1 });
invitationSchema.index({ expiresAt: 1 });
invitationSchema.index({ invitedBy: 1 });

// Generate unique invitation code
invitationSchema.statics.generateInvitationCode = function(role) {
  const prefix = {
    corporate: 'INV-CORP',
    ngo: 'INV-NGO',
    carbon: 'INV-CARB',
    admin: 'INV-ADM',
    verifier: 'INV-VER'
  }[role] || 'INV';
  
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${year}-${randomNum}`;
};

// Generate secure token
invitationSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Check if invitation can be used
invitationSchema.methods.canBeUsed = function() {
  return this.status === 'pending' && !this.isExpired();
};

// Mark as expired
invitationSchema.methods.markAsExpired = function() {
  if (this.status === 'pending') {
    this.status = 'expired';
    return this.save();
  }
  return Promise.resolve(this);
};

// Mark as accepted
invitationSchema.methods.markAsAccepted = function() {
  if (this.status === 'pending' && !this.isExpired()) {
    this.status = 'accepted';
    this.acceptedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Invitation cannot be accepted'));
};

// Mark as revoked
invitationSchema.methods.markAsRevoked = function(revokedBy) {
  if (this.status === 'pending') {
    this.status = 'revoked';
    this.revokedAt = new Date();
    this.revokedBy = revokedBy;
    return this.save();
  }
  return Promise.reject(new Error('Invitation cannot be revoked'));
};

// Resend invitation (update token and expiry)
invitationSchema.methods.resend = function(daysUntilExpiry = 7) {
  if (this.status === 'pending' || this.status === 'expired') {
    this.token = Invitation.generateToken();
    this.expiresAt = new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000);
    this.status = 'pending';
    this.resendCount += 1;
    this.lastResentAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Invitation cannot be resent'));
};

// Pre-save middleware to auto-expire old invitations
invitationSchema.pre('save', function(next) {
  if (this.status === 'pending' && this.isExpired()) {
    this.status = 'expired';
  }
  next();
});

const Invitation = mongoose.model('Invitation', invitationSchema, 'invitations');

module.exports = Invitation;
