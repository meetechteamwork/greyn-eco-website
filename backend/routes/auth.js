const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { SimpleUser, NGO, Corporate, CarbonUser, Admin } = require('../models/User');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ============================================
// SIMPLE USER (Investor) Routes
// ============================================

// Simple User Signup
router.post('/signup/simple-user', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await SimpleUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await SimpleUser.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Simple User Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
});

// Simple User Login
router.post('/login/simple-user', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await SimpleUser.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended or inactive'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Simple User Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// ============================================
// NGO Routes
// ============================================

// NGO Signup
router.post('/signup/ngo', [
  body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || err.message || 'Validation error');
      return res.status(400).json({
        success: false,
        message: errorMessages.join(', '),
        errors: errors.array()
      });
    }

    const { organizationName, registrationNumber, contactPerson, email, password } = req.body;
    
    // Normalize email (lowercase and trim)
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    // Additional validation
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({ $or: [{ email: normalizedEmail }, { registrationNumber }] });
    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this email or registration number already exists'
      });
    }

    // Create new NGO with active status (no approval needed)
    const ngo = await NGO.create({
      organizationName,
      registrationNumber,
      contactPerson,
      email: normalizedEmail,  // Use normalized email
      password,
      status: 'active',  // Set to active immediately
      verified: true     // Auto-verified
    });

    // Generate token for immediate login
    const token = generateToken(ngo._id, ngo.role);

    res.status(201).json({
      success: true,
      message: 'NGO registration successful! You can now login.',
      data: {
        token,  // Provide token for immediate login
        user: {
          id: ngo._id,
          organizationName: ngo.organizationName,
          contactPerson: ngo.contactPerson,
          email: ngo.email,
          role: ngo.role,
          status: ngo.status
        }
      }
    });
  } catch (error) {
    console.error('NGO Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during NGO registration',
      error: error.message
    });
  }
});

// NGO Login
router.post('/login/ngo', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || err.message || 'Validation error');
      return res.status(400).json({
        success: false,
        message: errorMessages.join(', '),
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Additional validation
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Find NGO - use case-insensitive email search
    const ngo = await NGO.findOne({ email: email.toLowerCase().trim() });
    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await ngo.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is suspended or inactive (allow active and pending)
    if (ngo.status === 'suspended' || ngo.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: `Account is ${ngo.status}. Please contact support.`
      });
    }

    // Update last login
    ngo.lastLogin = new Date();
    await ngo.save();

    // Generate token
    const token = generateToken(ngo._id, ngo.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: ngo._id,
          organizationName: ngo.organizationName,
          contactPerson: ngo.contactPerson,
          email: ngo.email,
          role: ngo.role
        }
      }
    });
  } catch (error) {
    console.error('NGO Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// ============================================
// CORPORATE Routes
// ============================================

// Corporate Signup
router.post('/signup/corporate', [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('taxId').trim().notEmpty().withMessage('Tax ID is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || err.message || 'Validation error');
      return res.status(400).json({
        success: false,
        message: errorMessages.join(', '),
        errors: errors.array()
      });
    }

    const { companyName, taxId, contactPerson, email, password } = req.body;
    
    // Normalize email (lowercase and trim)
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    // Additional validation
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if Corporate already exists
    const existingCorporate = await Corporate.findOne({ $or: [{ email: normalizedEmail }, { taxId }] });
    if (existingCorporate) {
      return res.status(400).json({
        success: false,
        message: 'Corporate with this email or tax ID already exists'
      });
    }

    // Create new Corporate with active status (no approval needed)
    const corporate = await Corporate.create({
      companyName,
      taxId,
      contactPerson,
      email: normalizedEmail,  // Use normalized email
      password,
      status: 'active',  // Set to active immediately
      verified: true     // Auto-verified
    });

    // Generate token for immediate login
    const token = generateToken(corporate._id, corporate.role);

    res.status(201).json({
      success: true,
      message: 'Corporate registration successful!',
      data: {
        token,  // Provide token for immediate login
        user: {
          id: corporate._id,
          companyName: corporate.companyName,
          contactPerson: corporate.contactPerson,
          email: corporate.email,
          role: corporate.role,
          status: corporate.status
        }
      }
    });
  } catch (error) {
    console.error('Corporate Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during corporate registration',
      error: error.message
    });
  }
});

// Corporate Login
router.post('/login/corporate', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find Corporate
    const corporate = await Corporate.findOne({ email });
    if (!corporate) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await corporate.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is suspended or inactive (but allow active and pending)
    if (corporate.status === 'suspended' || corporate.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: `Account is ${corporate.status}. Please contact support.`
      });
    }

    // Update last login
    corporate.lastLogin = new Date();
    await corporate.save();

    // Generate token
    const token = generateToken(corporate._id, corporate.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: corporate._id,
          companyName: corporate.companyName,
          contactPerson: corporate.contactPerson,
          email: corporate.email,
          role: corporate.role
        }
      }
    });
  } catch (error) {
    console.error('Corporate Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// ============================================
// CARBON USER Routes
// ============================================

// Carbon User Signup
router.post('/signup/carbon', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await CarbonUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await CarbonUser.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Carbon User Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
});

// Carbon User Login
router.post('/login/carbon', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await CarbonUser.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended or inactive'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Carbon User Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// ============================================
// ADMIN Routes
// ============================================

// Admin Signup
router.post('/signup/admin', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('adminCode').notEmpty().withMessage('Admin code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, adminCode } = req.body;

    // Verify admin code
    if (adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin code'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      adminCode
    });

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin registration',
      error: error.message
    });
  }
});

// Admin Login
router.post('/login/admin', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('adminCode').notEmpty().withMessage('Admin code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, adminCode } = req.body;

    // Verify admin code
    if (adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin code'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Admin account is suspended or inactive'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// ============================================
// PROFILE MANAGEMENT Routes (All User Types)
// ============================================

const { authenticate } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Change Password - Works for all user types
router.post('/change-password', [
  authenticate,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmNewPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find user based on role
    let user;
    switch (userRole) {
      case 'simple-user':
        user = await SimpleUser.findById(userId);
        break;
      case 'ngo':
        user = await NGO.findById(userId);
        break;
      case 'corporate':
        user = await Corporate.findById(userId);
        break;
      case 'carbon':
        user = await CarbonUser.findById(userId);
        break;
      case 'admin':
        user = await Admin.findById(userId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password',
      error: error.message
    });
  }
});

// Delete Account - Works for all user types
router.delete('/delete-account', [
  authenticate,
  body('password').notEmpty().withMessage('Password is required to confirm deletion')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find user based on role
    let user;
    let UserModel;
    switch (userRole) {
      case 'simple-user':
        UserModel = SimpleUser;
        user = await SimpleUser.findById(userId);
        break;
      case 'ngo':
        UserModel = NGO;
        user = await NGO.findById(userId);
        break;
      case 'corporate':
        UserModel = Corporate;
        user = await Corporate.findById(userId);
        break;
      case 'carbon':
        UserModel = CarbonUser;
        user = await CarbonUser.findById(userId);
        break;
      case 'admin':
        return res.status(403).json({
          success: false,
          message: 'Admin accounts cannot be deleted through this endpoint'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete the user
    await UserModel.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account',
      error: error.message
    });
  }
});

module.exports = router;
