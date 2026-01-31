const mongoose = require('mongoose');

/**
 * Platform Statistics Model
 * Stores aggregated KPI data for the admin overview dashboard
 */
const platformStatisticsSchema = new mongoose.Schema({
  // User Statistics
  totalUsers: {
    type: Number,
    default: 0,
    required: true
  },
  usersThisMonth: {
    type: Number,
    default: 0
  },
  usersLastMonth: {
    type: Number,
    default: 0
  },
  
  // Corporate Statistics
  activeCorporates: {
    type: Number,
    default: 0,
    required: true
  },
  corporatesThisQuarter: {
    type: Number,
    default: 0
  },
  corporatesLastQuarter: {
    type: Number,
    default: 0
  },
  
  // NGO Statistics
  ngosRegistered: {
    type: Number,
    default: 0,
    required: true
  },
  ngosThisQuarter: {
    type: Number,
    default: 0
  },
  ngosLastQuarter: {
    type: Number,
    default: 0
  },
  
  // Carbon Credits Statistics
  carbonCreditsIssued: {
    type: Number,
    default: 0,
    required: true
  },
  creditsIssuedThisMonth: {
    type: Number,
    default: 0
  },
  creditsIssuedLastMonth: {
    type: Number,
    default: 0
  },
  
  // Credits Retired
  creditsRetired: {
    type: Number,
    default: 0,
    required: true
  },
  creditsRetiredThisMonth: {
    type: Number,
    default: 0
  },
  creditsRetiredLastMonth: {
    type: Number,
    default: 0
  },
  
  // Revenue Statistics
  platformRevenue: {
    type: Number,
    default: 0,
    required: true
  },
  revenueThisYear: {
    type: Number,
    default: 0
  },
  revenueLastYear: {
    type: Number,
    default: 0
  },
  
  // Timestamps for tracking updates
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Period tracking
  currentMonth: {
    type: String, // Format: "YYYY-MM"
    required: true
  },
  currentQuarter: {
    type: String, // Format: "YYYY-Q1/Q2/Q3/Q4"
    required: true
  },
  currentYear: {
    type: String, // Format: "YYYY"
    required: true
  }
}, {
  timestamps: true
});

// Index for quick retrieval
platformStatisticsSchema.index({ lastUpdated: -1 });

// Static method to get or create current statistics
platformStatisticsSchema.statics.getCurrentStats = async function() {
  try {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
    const currentQuarter = `${currentDate.getFullYear()}-Q${quarter}`;
    const currentYear = String(currentDate.getFullYear());
    
    let stats = await this.findOne({
      currentMonth,
      currentQuarter,
      currentYear
    });
    
    if (!stats) {
      stats = await this.create({
        currentMonth,
        currentQuarter,
        currentYear
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Error in getCurrentStats:', error);
    // Return a default stats object if error occurs
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
    const currentQuarter = `${currentDate.getFullYear()}-Q${quarter}`;
    return {
      totalUsers: 0,
      usersThisMonth: 0,
      activeCorporates: 0,
      corporatesThisQuarter: 0,
      ngosRegistered: 0,
      ngosThisQuarter: 0,
      carbonCreditsIssued: 0,
      creditsIssuedThisMonth: 0,
      creditsRetired: 0,
      creditsRetiredThisMonth: 0,
      platformRevenue: 0,
      revenueThisYear: 0,
      revenueLastYear: 0,
      lastUpdated: new Date(),
      currentMonth,
      currentQuarter,
      currentYear: String(currentDate.getFullYear())
    };
  }
};

module.exports = mongoose.model('PlatformStatistics', platformStatisticsSchema);
