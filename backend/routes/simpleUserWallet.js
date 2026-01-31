const express = require('express');
const router = express.Router();
const {
  getWallet,
  addFunds,
  createWithdrawalRequest,
  getTransactions,
  getWithdrawalRequests,
} = require('../controllers/simpleUserWalletController');
const { authenticate } = require('../middleware/auth');

// All simple user wallet routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/wallet
 * @desc    Get simple user wallet information
 * @access  Simple User
 */
router.get('/', getWallet);

/**
 * @route   POST /api/wallet/add-funds
 * @desc    Add funds to wallet (demo - no real payment)
 * @access  Simple User
 * @body    { amount: number }
 */
router.post('/add-funds', addFunds);

/**
 * @route   POST /api/wallet/withdraw
 * @desc    Create withdrawal request
 * @access  Simple User
 * @body    { amount: number, bankAccount: string }
 */
router.post('/withdraw', createWithdrawalRequest);

/**
 * @route   GET /api/wallet/transactions
 * @desc    Get wallet transactions with pagination
 * @access  Simple User
 * @query   { page, limit, type, status }
 */
router.get('/transactions', getTransactions);

/**
 * @route   GET /api/wallet/withdrawal-requests
 * @desc    Get withdrawal requests
 * @access  Simple User
 * @query   { page, limit, status }
 */
router.get('/withdrawal-requests', getWithdrawalRequests);

module.exports = router;

