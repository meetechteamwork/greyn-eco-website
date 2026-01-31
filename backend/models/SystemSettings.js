const mongoose = require('mongoose');

/**
 * System Settings Model
 * Stores platform-wide system configuration
 */
const systemSettingsSchema = new mongoose.Schema({
  // General Settings
  general: {
    platformName: {
      type: String,
      default: 'Greyn Eco Platform',
      required: true
    },
    platformUrl: {
      type: String,
      default: 'https://greyn-eco.com',
      required: true
    },
    timezone: {
      type: String,
      default: 'America/Los_Angeles',
      required: true
    },
    dateFormat: {
      type: String,
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
      default: 'MM/DD/YYYY'
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '12h'
    },
    defaultLanguage: {
      type: String,
      default: 'en',
      required: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    registrationEnabled: {
      type: Boolean,
      default: true
    },
    emailVerification: {
      type: Boolean,
      default: true
    }
  },

  // Performance Settings
  performance: {
    cacheEnabled: {
      type: Boolean,
      default: true
    },
    cacheDuration: {
      type: String,
      default: '3600' // seconds
    },
    cdnEnabled: {
      type: Boolean,
      default: true
    },
    compressionEnabled: {
      type: Boolean,
      default: true
    },
    imageOptimization: {
      type: Boolean,
      default: true
    },
    maxUploadSize: {
      type: String,
      default: '10' // MB
    },
    sessionTimeout: {
      type: String,
      default: '30' // minutes
    }
  },

  // Maintenance Settings
  maintenance: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    backupRetention: {
      type: String,
      default: '30' // days
    },
    logRetention: {
      type: String,
      default: '90' // days
    },
    cleanupEnabled: {
      type: Boolean,
      default: true
    },
    systemUpdates: {
      type: String,
      enum: ['auto', 'manual', 'scheduled'],
      default: 'auto'
    }
  }
}, {
  timestamps: true
});

// Ensure only one system settings document exists
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

// Update settings
systemSettingsSchema.statics.updateSettings = async function(section, data) {
  const settings = await this.getSettings();
  
  if (section === 'general' || section === 'performance' || section === 'maintenance') {
    settings[section] = { ...settings[section].toObject(), ...data };
    await settings.save();
  } else {
    throw new Error(`Invalid section: ${section}`);
  }
  
  return settings;
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
