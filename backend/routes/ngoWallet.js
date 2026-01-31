const express = require('express');
const router = express.Router();
const { authenticateNGO } = require('../middleware/auth');
const ngoWalletController = require('../controllers/ngoWalletController');

router.use(authenticateNGO);

/**
 * @route   GET /api/ngo/wallet
 * @desc    Get NGO wallet information
 * @access  NGO
 */
router.get('/', ngoWalletController.getWallet);

/**
 * @route   POST /api/ngo/wallet/withdraw
 * @desc    Create withdrawal request
 * @access  NGO
 * @body    { amount: number, bankAccount: string }
 */
router.post('/withdraw', ngoWalletController.createWithdrawalRequest);

/**
 * @route   GET /api/ngo/wallet/transactions
 * @desc    Get wallet transactions with pagination
 * @access  NGO
 * @query   { page, limit, type, status }
 */
router.get('/transactions', ngoWalletController.getTransactions);

/**
 * @route   GET /api/ngo/wallet/withdrawal-requests
 * @desc    Get withdrawal requests
 * @access  NGO
 * @query   { page, limit, status }
 */
router.get('/withdrawal-requests', ngoWalletController.getWithdrawalRequests);

/**
 * @route   GET /api/ngo/wallet/export
 * @desc    Export wallet report (CSV/JSON)
 * @access  NGO
 * @query   { format: 'csv' | 'json' }
 */
router.get('/export', ngoWalletController.exportReport);

module.exports = router;
