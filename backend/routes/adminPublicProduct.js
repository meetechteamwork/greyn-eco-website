const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/adminProductController');

/**
 * Admin Public Products Routes
 * All routes require admin authentication
 */

// Get product statistics
router.get('/stats', authenticateAdmin, getProductStats);

// Get all products with filtering
router.get('/', authenticateAdmin, getProducts);

// Get single product
router.get('/:id', authenticateAdmin, getProduct);

// Create new product
router.post('/', authenticateAdmin, createProduct);

// Update product
router.put('/:id', authenticateAdmin, updateProduct);

// Delete product
router.delete('/:id', authenticateAdmin, deleteProduct);

module.exports = router;
