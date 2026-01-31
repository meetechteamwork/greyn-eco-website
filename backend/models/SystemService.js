const mongoose = require('mongoose');

/**
 * System Service Model
 * Tracks health status of platform services
 */
const systemServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Service status
  status: {
    type: String,
    enum: ['operational', 'degraded', 'down', 'maintenance'],
    default: 'operational',
    required: true
  },
  
  // Performance metrics
  latency: {
    type: Number, // in milliseconds
    default: 0,
    min: 0
  },
  uptime: {
    type: Number, // percentage (0-100)
    default: 100,
    min: 0,
    max: 100
  },
  
  // Health check timestamps
  lastChecked: {
    type: Date,
    default: Date.now
  },
  lastOperational: {
    type: Date
  },
  lastDown: {
    type: Date
  },
  
  // Service metadata
  serviceType: {
    type: String,
    enum: ['web', 'api', 'database', 'cache', 'queue', 'storage', 'payment', 'other'],
    default: 'other'
  },
  endpoint: {
    type: String // Health check endpoint URL
  },
  
  // Configuration
  enabled: {
    type: Boolean,
    default: true
  },
  
  // Monitoring thresholds
  latencyThreshold: {
    type: Number,
    default: 100 // ms
  },
  uptimeThreshold: {
    type: Number,
    default: 99.0 // percentage
  }
}, {
  timestamps: true
});

// Indexes
systemServiceSchema.index({ status: 1, lastChecked: -1 });
systemServiceSchema.index({ enabled: 1, status: 1 });

// Static method to get all services
systemServiceSchema.statics.getServices = async function() {
  return await this.find({ enabled: true }).sort({ name: 1 });
};

// Static method to update service health
systemServiceSchema.statics.updateHealth = async function(serviceName, healthData) {
  const service = await this.findOne({ name: serviceName });
  
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  
  // Update metrics
  if (healthData.latency !== undefined) {
    service.latency = healthData.latency;
  }
  if (healthData.uptime !== undefined) {
    service.uptime = healthData.uptime;
  }
  if (healthData.status) {
    const oldStatus = service.status;
    service.status = healthData.status;
    
    // Update timestamps based on status change
    if (oldStatus !== healthData.status) {
      if (healthData.status === 'operational') {
        service.lastOperational = new Date();
      } else if (healthData.status === 'down') {
        service.lastDown = new Date();
      }
    }
  }
  
  service.lastChecked = new Date();
  await service.save();
  
  return service;
};

module.exports = mongoose.model('SystemService', systemServiceSchema);
