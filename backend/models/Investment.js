const mongoose = require('mongoose');

/**
 * Investment Model
 * Stores user investments in public projects
 * Collection: investments
 */
const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectCategory: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Investment amount must be positive'],
    },
    returns: {
      type: Number,
      default: 0,
      min: [0, 'Returns cannot be negative'],
    },
    carbonCredits: {
      type: Number,
      default: 0,
      min: [0, 'Carbon credits cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    investmentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expectedReturnRate: {
      type: Number,
      default: 0,
      min: [0, 'Return rate cannot be negative'],
    },
    expectedReturnDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'investments',
  }
);

// Compound indexes for efficient queries
investmentSchema.index({ userId: 1, status: 1 });
investmentSchema.index({ userId: 1, investmentDate: -1 });
investmentSchema.index({ projectId: 1, status: 1 });
investmentSchema.index({ projectCategory: 1 });

// Virtual for calculating ROI percentage
investmentSchema.virtual('roiPercentage').get(function() {
  if (this.amount === 0) return 0;
  return ((this.returns / this.amount) * 100).toFixed(2);
});

// Method to update returns based on project performance
investmentSchema.methods.updateReturns = function(returnRate) {
  this.returns = (this.amount * returnRate) / 100;
  this.save();
};

// Static method to get user's total investments
investmentSchema.statics.getUserTotalInvested = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const result = await this.aggregate([
    { $match: { userId: userIdObj, status: { $in: ['active', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get user's total returns
investmentSchema.statics.getUserTotalReturns = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const result = await this.aggregate([
    { $match: { userId: userIdObj, status: { $in: ['active', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$returns' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get user's total carbon credits
investmentSchema.statics.getUserTotalCarbonCredits = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const result = await this.aggregate([
    { $match: { userId: userIdObj, status: { $in: ['active', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$carbonCredits' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get monthly investment data
investmentSchema.statics.getMonthlyData = async function(userId, months = 12) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const investments = await this.find({
    userId: userIdObj,
    investmentDate: { $gte: startDate },
    status: { $in: ['active', 'completed'] }
  }).sort({ investmentDate: 1 });

  // Group by month
  const monthlyMap = new Map();
  
  investments.forEach(inv => {
    const date = new Date(inv.investmentDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthName,
        investments: 0,
        returns: 0,
        carbonCredits: 0
      });
    }
    
    const data = monthlyMap.get(monthKey);
    data.investments += inv.amount;
    data.returns += inv.returns;
    data.carbonCredits += inv.carbonCredits;
  });

  return Array.from(monthlyMap.values());
};

// Static method to get portfolio distribution by category
investmentSchema.statics.getPortfolioDistribution = async function(userId) {
  const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const result = await this.aggregate([
    { $match: { userId: userIdObj, status: { $in: ['active', 'completed'] } } },
    {
      $group: {
        _id: '$projectCategory',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  const total = result.reduce((sum, item) => sum + item.totalAmount, 0);
  
  return result.map(item => ({
    category: item._id,
    amount: item.totalAmount,
    percentage: total > 0 ? Math.round((item.totalAmount / total) * 100) : 0,
    count: item.count
  }));
};

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
