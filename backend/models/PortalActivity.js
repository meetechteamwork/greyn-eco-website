const mongoose = require('mongoose');

/**
 * Portal Activity Model
 * Tracks activity patterns across portals for heatmap visualization
 */
const portalActivitySchema = new mongoose.Schema({
  // Portal Identifier
  portal: {
    type: String,
    enum: ['corporate', 'carbon', 'ngo', 'simple-user'],
    required: true
  },
  
  // Time Information
  date: {
    type: Date,
    required: true,
    index: true
  },
  dayOfWeek: {
    type: Number, // 0 (Sunday) to 6 (Saturday)
    required: true,
    min: 0,
    max: 6
  },
  hour: {
    type: Number, // 0 to 23
    required: true,
    min: 0,
    max: 23
  },
  
  // Activity Metrics
  activityLevel: {
    type: Number, // 0-100 scale
    required: true,
    min: 0,
    max: 100
  },
  userCount: {
    type: Number,
    default: 0
  },
  sessionCount: {
    type: Number,
    default: 0
  },
  actionCount: {
    type: Number,
    default: 0
  },
  
  // Action Breakdown
  actions: {
    logins: {
      type: Number,
      default: 0
    },
    pageViews: {
      type: Number,
      default: 0
    },
    transactions: {
      type: Number,
      default: 0
    },
    projectViews: {
      type: Number,
      default: 0
    },
    creditPurchases: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
portalActivitySchema.index({ portal: 1, date: -1, hour: 1 });
portalActivitySchema.index({ date: -1, portal: 1 });

// Static method to get activity for a specific date range
portalActivitySchema.statics.getActivityByRange = async function(portal, startDate, endDate) {
  return await this.find({
    portal: portal,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1, hour: 1 });
};

// Static method to get weekly heatmap data
portalActivitySchema.statics.getWeeklyHeatmap = async function(portals = ['corporate', 'carbon', 'ngo']) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // Last 7 days
  
  const results = {};
  
  for (const portal of portals) {
    const activities = await this.find({
      portal: portal,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ dayOfWeek: 1, hour: 1 });
    
    // Organize by day and hour
    const heatmap = {};
    activities.forEach(activity => {
      const dayKey = activity.dayOfWeek;
      if (!heatmap[dayKey]) {
        heatmap[dayKey] = {};
      }
      heatmap[dayKey][activity.hour] = activity.activityLevel;
    });
    
    results[portal] = heatmap;
  }
  
  return results;
};

module.exports = mongoose.model('PortalActivity', portalActivitySchema);
