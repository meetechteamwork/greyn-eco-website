const NgoWallet = require('../models/NgoWallet');
const NgoWalletTransaction = require('../models/NgoWalletTransaction');
const NgoWithdrawalRequest = require('../models/NgoWithdrawalRequest');
const { NGO } = require('../models/User');

/**
 * Calculate wallet balance from transactions
 */
const calculateWalletBalance = async (ngoId) => {
  const transactions = await NgoWalletTransaction.find({
    ngo: ngoId,
    status: 'completed'
  }).lean();

  let balance = 0;
  let totalDonations = 0;
  let totalRevenue = 0;

  transactions.forEach(tx => {
    if (tx.amount > 0) {
      balance += tx.amount;
      if (tx.type === 'donation') {
        totalDonations += tx.amount;
      } else if (tx.type === 'revenue') {
        totalRevenue += tx.amount;
      }
    } else {
      balance += tx.amount; // Negative amounts (withdrawals, project funding)
    }
  });

  // Get pending withdrawal requests
  const pendingRequests = await NgoWithdrawalRequest.find({
    ngo: ngoId,
    status: { $in: ['pending_approval', 'approved', 'processing'] }
  }).lean();

  const pendingWithdrawals = pendingRequests.reduce((sum, req) => sum + req.amount, 0);
  const availableBalance = Math.max(0, balance - pendingWithdrawals);

  return {
    balance,
    availableBalance,
    pendingWithdrawals,
    totalDonations,
    totalRevenue
  };
};

/**
 * GET /api/ngo/wallet
 * Get NGO wallet information
 */
exports.getWallet = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    // Get or create wallet
    let wallet = await NgoWallet.findOne({ ngo: ngoId }).lean();

    if (!wallet) {
      // Create default wallet
      wallet = await NgoWallet.create({
        ngo: ngoId,
        balance: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        totalDonations: 0,
        totalRevenue: 0,
        totalWithdrawn: 0
      });
    }

    // Recalculate balance from transactions
    const calculated = await calculateWalletBalance(ngoId);

    // Update wallet with calculated values
    await NgoWallet.findOneAndUpdate(
      { ngo: ngoId },
      {
        balance: calculated.balance,
        availableBalance: calculated.availableBalance,
        pendingWithdrawals: calculated.pendingWithdrawals,
        totalDonations: calculated.totalDonations,
        totalRevenue: calculated.totalRevenue,
        lastUpdated: new Date()
      }
    );

    // Get withdrawal requests
    const withdrawalRequests = await NgoWithdrawalRequest.find({ ngo: ngoId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get recent transactions
    const transactions = await NgoWalletTransaction.find({ ngo: ngoId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: {
        wallet: {
          balance: calculated.balance,
          availableBalance: calculated.availableBalance,
          pendingWithdrawals: calculated.pendingWithdrawals,
          totalDonations: calculated.totalDonations,
          totalRevenue: calculated.totalRevenue
        },
        withdrawalRequests: withdrawalRequests.map(req => ({
          id: req._id.toString(),
          amount: req.amount,
          requestedAt: req.requestedAt,
          status: req.status,
          approvedAt: req.approvedAt,
          availableAt: req.availableAt,
          rejectedReason: req.rejectedReason,
          bankAccount: req.bankAccount ? `****${req.bankAccount.slice(-4)}` : ''
        })),
        transactions: transactions.map(tx => ({
          id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          date: tx.createdAt.toISOString().split('T')[0],
          status: tx.status,
          projectName: tx.projectName || undefined,
          donorName: tx.donorName || undefined
        }))
      }
    });
  } catch (error) {
    console.error('Error in getWallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet information',
      error: error.message
    });
  }
};

/**
 * POST /api/ngo/wallet/withdraw
 * Create withdrawal request
 */
exports.createWithdrawalRequest = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { amount, bankAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid withdrawal amount is required'
      });
    }

    if (!bankAccount || !bankAccount.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Bank account number is required'
      });
    }

    // Get wallet balance
    const calculated = await calculateWalletBalance(ngoId);

    if (amount > calculated.availableBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance. Available balance is insufficient for this withdrawal.'
      });
    }

    // Create withdrawal request
    const withdrawalRequest = await NgoWithdrawalRequest.create({
      ngo: ngoId,
      amount: parseFloat(amount),
      bankAccount: bankAccount.trim(),
      status: 'pending_approval',
      requestedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Waiting for admin approval.',
      data: {
        id: withdrawalRequest._id.toString(),
        amount: withdrawalRequest.amount,
        requestedAt: withdrawalRequest.requestedAt,
        status: withdrawalRequest.status,
        bankAccount: `****${bankAccount.trim().slice(-4)}`
      }
    });
  } catch (error) {
    console.error('Error in createWithdrawalRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create withdrawal request',
      error: error.message
    });
  }
};

/**
 * GET /api/ngo/wallet/transactions
 * Get wallet transactions with pagination
 */
exports.getTransactions = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { page = 1, limit = 20, type, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { ngo: ngoId };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const transactions = await NgoWalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await NgoWalletTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions: transactions.map(tx => ({
          id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          date: tx.createdAt.toISOString().split('T')[0],
          status: tx.status,
          projectName: tx.projectName || undefined,
          donorName: tx.donorName || undefined
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * GET /api/ngo/wallet/withdrawal-requests
 * Get withdrawal requests
 */
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { ngo: ngoId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const withdrawalRequests = await NgoWithdrawalRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await NgoWithdrawalRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        withdrawalRequests: withdrawalRequests.map(req => ({
          id: req._id.toString(),
          amount: req.amount,
          requestedAt: req.requestedAt,
          status: req.status,
          approvedAt: req.approvedAt,
          availableAt: req.availableAt,
          rejectedReason: req.rejectedReason,
          bankAccount: req.bankAccount ? `****${req.bankAccount.slice(-4)}` : ''
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getWithdrawalRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal requests',
      error: error.message
    });
  }
};

/**
 * GET /api/ngo/wallet/export
 * Export wallet report (CSV)
 */
exports.exportReport = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { format = 'csv' } = req.query;

    // Get all transactions
    const transactions = await NgoWalletTransaction.find({ ngo: ngoId })
      .sort({ createdAt: -1 })
      .lean();

    // Get wallet summary
    const calculated = await calculateWalletBalance(ngoId);

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Date,Type,Description,Amount,Status,Project,Donor\n';
      const csvRows = transactions.map(tx => {
        const date = new Date(tx.createdAt).toLocaleDateString('en-US');
        const type = tx.type.replace('_', ' ');
        const amount = tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`;
        return `${date},"${type}","${tx.description}",${amount},${tx.status},"${tx.projectName || ''}","${tx.donorName || ''}"`;
      }).join('\n');

      const csv = csvHeader + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ngo-wallet-report-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      // JSON format
      res.json({
        success: true,
        data: {
          summary: calculated,
          transactions: transactions.map(tx => ({
            id: tx._id.toString(),
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            date: tx.createdAt,
            status: tx.status,
            projectName: tx.projectName,
            donorName: tx.donorName
          }))
        }
      });
    }
  } catch (error) {
    console.error('Error in exportReport:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};
