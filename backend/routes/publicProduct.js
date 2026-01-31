const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * Public Products Routes
 * Publicly accessible - no authentication required
 * Users only need to login when clicking Buy buttons
 */

/**
 * Get all active products (public view)
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      badge,
      search,
      limit = 50
    } = req.query;

    const query = {
      status: 'active'
    };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (badge) {
      query.badge = badge;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .select('-createdBy -updatedBy -__v')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

/**
 * Get single product by ID (public view)
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('-createdBy -updatedBy -__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Only show active products to public
    if (product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

module.exports = router;
