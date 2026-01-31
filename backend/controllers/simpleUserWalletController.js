const SimpleWallet = require('../models/SimpleWallet');
const SimpleWalletTransaction = require('../models/SimpleWalletTransaction');
const SimpleUserWithdrawalRequest = require('../models/SimpleUserWithdrawalRequest');
const Investment = require('../models/Investment');

/**
 * Simple User Wallet Controller
 * Handles wallet balance, transactions and withdrawal requests for simple users (investors)
 */

/**
 * Recalculate wallet balances for a user based on transactions and withdrawal requests
 */
const calculateWalletBalance = async (userId) => {
  const transactions = await SimpleWalletTransaction.find({
    user: userId,
    status: 'completed',
  }).lean();

  let balance = 0;
  let totalDeposited = 0;
  let totalInvested = 0;
  let totalReturns = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'deposit' || tx.type === 'return') {
      balance += tx.amount;
      if (tx.type === 'deposit') totalDeposited += tx.amount;
      if (tx.type === 'return') totalReturns += tx.amount;
    } else if (tx.type === 'investment' || tx.type === 'withdrawal' || tx.type === 'fee') {
      balance += tx.amount; // negative amounts reduce balance
      if (tx.type === 'investment') totalInvested += Math.abs(tx.amount);
    } else {
      balance += tx.amount;
    }
  });

  // Get pending withdrawal requests
  const pendingRequests = await SimpleUserWithdrawalRequest.find({
    user: userId,
    status: { $in: ['pending_approval', 'approved', 'processing'] },
  }).lean();

  const pendingWithdrawals = pendingRequests.reduce((sum, req) => sum + req.amount, 0);
  const availableBalance = Math.max(0, balance - pendingWithdrawals);

  return {
    balance,
    availableBalance,
    pendingWithdrawals,
    totalDeposited,
    totalInvested,
    totalReturns,
  };
};

/**
 * POST /api/wallet/add-funds
 * Add funds to simple user wallet (demo - no real payment)
 */
exports.addFunds = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    // Create deposit transaction
    const transaction = await SimpleWalletTransaction.create({
      user: userId,
      type: 'deposit',
      amount: parseFloat(amount),
      description: `Wallet deposit of $${parseFloat(amount).toLocaleString()}`,
      status: 'completed',
      reference: `DEP-${Date.now()}`,
      source: 'manual',
    });

    // Recalculate wallet balance
    const calculated = await calculateWalletBalance(userId);

    // Update wallet document
    await SimpleWallet.findOneAndUpdate(
      { user: userId },
      {
        balance: calculated.balance,
        availableBalance: calculated.availableBalance,
        pendingWithdrawals: calculated.pendingWithdrawals,
        totalDeposited: calculated.totalDeposited,
        totalInvested: calculated.totalInvested,
        totalReturns: calculated.totalReturns,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: `$${parseFloat(amount).toLocaleString()} added to your wallet successfully`,
      data: {
        transaction: {
          id: transaction._id.toString(),
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          status: transaction.status,
          date: transaction.createdAt,
        },
        wallet: {
          balance: calculated.balance,
          availableBalance: calculated.availableBalance,
        },
      },
    });
  } catch (error) {
    console.error('Error in addFunds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add funds',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

/**
 * GET /api/wallet
 * Get simple user wallet information (summary + recent transactions + withdrawal requests)
 */
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get or create wallet
    let wallet = await SimpleWallet.findOne({ user: userId }).lean();
    if (!wallet) {
      wallet = await SimpleWallet.create({
        user: userId,
        balance: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        totalDeposited: 0,
        totalInvested: 0,
        totalReturns: 0,
        totalWithdrawn: 0,
      });
    }

    // Recalculate wallet from transactions
    const calculated = await calculateWalletBalance(userId);

    // Update wallet document
    await SimpleWallet.findOneAndUpdate(
      { user: userId },
      {
        balance: calculated.balance,
        availableBalance: calculated.availableBalance,
        pendingWithdrawals: calculated.pendingWithdrawals,
        totalDeposited: calculated.totalDeposited,
        totalInvested: calculated.totalInvested,
        totalReturns: calculated.totalReturns,
        lastUpdated: new Date(),
      }
    );

    // Get latest withdrawal requests
    const withdrawalRequests = await SimpleUserWithdrawalRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get recent transactions
    const transactions = await SimpleWalletTransaction.find({ user: userId })
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
          totalDeposited: calculated.totalDeposited,
          totalInvested: calculated.totalInvested,
          totalReturns: calculated.totalReturns,
        },
        withdrawalRequests: withdrawalRequests.map((req) => ({
          id: req._id.toString(),
          amount: req.amount,
          requestedAt: req.requestedAt,
          status: req.status,
          approvedAt: req.approvedAt,
          availableAt: req.availableAt,
          rejectedReason: req.rejectedReason,
          bankAccount: req.bankAccount ? `****${req.bankAccount.slice(-4)}` : '',
        })),
        transactions: transactions.map((tx) => ({
          id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          date: tx.createdAt.toISOString().split('T')[0],
          status: tx.status,
        })),
      },
    });
  } catch (error) {
    console.error('Error in getWallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet information',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

/**
 * POST /api/wallet/withdraw
 * Create withdrawal request for simple user
 */
exports.createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, bankAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid withdrawal amount is required',
      });
    }

    if (!bankAccount || !bankAccount.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Bank account number is required',
      });
    }

    // Check available balance
    const calculated = await calculateWalletBalance(userId);
    if (amount > calculated.availableBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance. Available balance is insufficient for this withdrawal.',
      });
    }

    const withdrawalRequest = await SimpleUserWithdrawalRequest.create({
      user: userId,
      amount: parseFloat(amount),
      bankAccount: bankAccount.trim(),
      status: 'pending_approval',
      requestedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Waiting for admin approval.',
      data: {
        id: withdrawalRequest._id.toString(),
        amount: withdrawalRequest.amount,
        requestedAt: withdrawalRequest.requestedAt,
        status: withdrawalRequest.status,
        bankAccount: `****${bankAccount.trim().slice(-4)}`,
      },
    });
  } catch (error) {
    console.error('Error in createWithdrawalRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create withdrawal request',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

/**
 * GET /api/wallet/transactions
 * Get wallet transactions with pagination
 */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, type, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { user: userId };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const transactions = await SimpleWalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await SimpleWalletTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions: transactions.map((tx) => ({
          id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          date: tx.createdAt.toISOString().split('T')[0],
          status: tx.status,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

/**
 * GET /api/wallet/withdrawal-requests
 * Get withdrawal requests list for simple user
 */
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { user: userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const withdrawalRequests = await SimpleUserWithdrawalRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await SimpleUserWithdrawalRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        withdrawalRequests: withdrawalRequests.map((reqDoc) => ({
          id: reqDoc._id.toString(),
          amount: reqDoc.amount,
          requestedAt: reqDoc.requestedAt,
          status: reqDoc.status,
          approvedAt: reqDoc.approvedAt,
          availableAt: reqDoc.availableAt,
          rejectedReason: reqDoc.rejectedReason,
          bankAccount: reqDoc.bankAccount ? `****${reqDoc.bankAccount.slice(-4)}` : '',
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error in getWithdrawalRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal requests',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

