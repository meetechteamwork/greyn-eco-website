const express = require('express');
const router = express.Router();
const adminFinanceTransactionsController = require('../controllers/adminFinanceTransactionsController');
const { authenticateAdmin } = require('../middleware/auth');

router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/finance/transactions
 * @desc    List transactions with filters, pagination, stats. Query: search, status, type, dateRange, page, limit, includeSeed
 * @access  Admin
 */
router.get('/', adminFinanceTransactionsController.getList);

/**
 * @route   GET /api/admin/finance/transactions/export
 * @desc    Export filtered transactions as CSV or JSON. Query: search, status, type, dateRange, format=csv|json, includeSeed
 * @access  Admin
 */
router.get('/export', adminFinanceTransactionsController.getExport);

/**
 * @route   GET /api/admin/finance/transactions/analytics
 * @desc    Analytics: summary, byType, byStatus, timeSeries. Query: dateRange, groupBy=day|week|month, includeSeed
 * @access  Admin
 */
router.get('/analytics', adminFinanceTransactionsController.getAnalytics);

/**
 * @route   GET /api/admin/finance/transactions/:id/receipt
 * @desc    Receipt data for the transaction (must be before /:id)
 * @access  Admin
 */
router.get('/:id/receipt', adminFinanceTransactionsController.getReceipt);

/**
 * @route   GET /api/admin/finance/transactions/:id/invoice
 * @desc    Invoice data when transaction has invoiceId (404 otherwise). Must be before /:id.
 * @access  Admin
 */
router.get('/:id/invoice', adminFinanceTransactionsController.getInvoice);

/**
 * @route   GET /api/admin/finance/transactions/:id
 * @desc    Single transaction by transactionId or _id
 * @access  Admin
 */
router.get('/:id', adminFinanceTransactionsController.getOne);

module.exports = router;
