const mongoose = require('mongoose');

/**
 * Platform Metrics Model
 * Time-series data for platform usage trends and analytics
 */
const platformMetricsSchema = new mongoose.Schema({
  // Date Period
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily',
    required: true
  },
  
  // User Metrics
  activeUsers: {
    type: Number,
    default: 0
  },
  newUsers: {
    type: Number,
    default: 0
  },
  returningUsers: {
    type: Number,
    default: 0
  },
  
  // Engagement Metrics
  totalSessions: {
    type: Number,
    default: 0
  },
  averageSessionDuration: {
    type: Number, // in seconds
    default: 0
  },
  pageViews: {
    type: Number,
    default: 0
  },
  
  // Portal-specific Activity
  portalActivity: {
    corporate: {
      type: Number,
      default: 0
    },
    carbon: {
      type: Number,
      default: 0
    },
    ngo: {
      type: Number,
      default: 0
    },
    simpleUser: {
      type: Number,
      default: 0
    }
  },
  
  // Transaction Metrics
  transactions: {
    type: Number,
    default: 0
  },
  transactionVolume: {
    type: Number,
    default: 0
  },
  
  // Project Metrics
  projectsViewed: {
    type: Number,
    default: 0
  },
  projectsInvested: {
    type: Number,
    default: 0
  },
  investmentAmount: {
    type: Number,
    default: 0
  },
  
  // Carbon Credit Metrics
  creditsIssued: {
    type: Number,
    default: 0
  },
  creditsRetired: {
    type: Number,
    default: 0
  },
  creditsTraded: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient date range queries
platformMetricsSchema.index({ date: -1, period: 1 });

// Static method to get metrics for date range
platformMetricsSchema.statics.getMetricsByRange = async function(startDate, endDate, period = 'daily') {
  return await this.find({
    date: { $gte: startDate, $lte: endDate },
    period: period
  }).sort({ date: 1 });
};

// Static method to get monthly aggregated metrics
platformMetricsSchema.statics.getMonthlyMetrics = async function(months = 12) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return await this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        period: 'monthly'
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);
};

module.exports = mongoose.model('PlatformMetrics', platformMetricsSchema);
