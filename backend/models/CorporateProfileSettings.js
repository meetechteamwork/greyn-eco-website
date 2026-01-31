const mongoose = require('mongoose');

const corporateProfileSettingsSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
    required: true,
    unique: true,
    index: true
  },
  // Profile Information
  profile: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      default: 'America/Los_Angeles'
    },
    employeeId: {
      type: String,
      trim: true
    }
  },
  // Security Settings
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: String,
      default: '30',
      enum: ['15', '30', '60', '120']
    },
    loginAlerts: {
      type: Boolean,
      default: true
    },
    suspiciousActivity: {
      type: Boolean,
      default: true
    }
  },
  // Application Preferences
  preferences: {
    theme: {
      type: String,
      default: 'system',
      enum: ['light', 'dark', 'system']
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de']
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY',
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']
    },
    timeFormat: {
      type: String,
      default: '12h',
      enum: ['12h', '24h']
    },
    itemsPerPage: {
      type: String,
      default: '25',
      enum: ['10', '25', '50', '100']
    }
  },
  // Notification Settings
  notifications: {
    email: {
      security: {
        type: Boolean,
        default: true
      },
      system: {
        type: Boolean,
        default: true
      },
      updates: {
        type: Boolean,
        default: false
      },
      reports: {
        type: Boolean,
        default: true
      },
      campaigns: {
        type: Boolean,
        default: true
      },
      volunteers: {
        type: Boolean,
        default: false
      }
    },
    push: {
      critical: {
        type: Boolean,
        default: true
      },
      alerts: {
        type: Boolean,
        default: true
      },
      updates: {
        type: Boolean,
        default: false
      }
    }
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
corporateProfileSettingsSchema.index({ corporate: 1 });

module.exports = mongoose.model('CorporateProfileSettings', corporateProfileSettingsSchema);
