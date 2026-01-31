const path = require('path');
const fs = require('fs');

// Load .env file with explicit path resolution
const envPath = path.resolve(__dirname, '.env');

// Verify .env file exists before loading
if (!fs.existsSync(envPath)) {
  console.error('\n❌ Error: .env file not found at:', envPath);
  console.error('💡 Please create a .env file in the backend directory.\n');
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { validateEnvironment } = require('./utils/validateEnv');

// Validate environment variables
const { errors, warnings } = validateEnvironment();

if (warnings.length > 0) {
  console.warn('\n⚠️  Environment Variable Warnings:');
  warnings.forEach(warning => {
    console.warn(`   - ${warning.key}: ${warning.message}`);
  });
  console.warn('');
}

if (errors.length > 0) {
  console.error('\n❌ Environment Variable Validation Failed:');
  errors.forEach(error => {
    console.error(`\n   ${error.key}:`);
    console.error(`   ❌ ${error.message}`);
    console.error(`   📝 Description: ${error.description}`);
    if (error.format) {
      console.error(`   📋 Format: ${error.format}`);
    }
  });
  console.error('\n💡 Please check your .env file in the backend directory.');
  console.error('   See SETUP.md for configuration instructions.\n');
  process.exit(1);
}

const connectDB = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth');
const adminOverviewRoutes = require('./routes/adminOverview');
const systemSettingsRoutes = require('./routes/systemSettings');
const systemHealthRoutes = require('./routes/systemHealth');
const adminUsersRoutes = require('./routes/adminUsers');
const adminRolesRoutes = require('./routes/adminRoles');
const adminInvitationsRoutes = require('./routes/adminInvitations');
const adminPortalsCorporateRoutes = require('./routes/adminPortalsCorporate');
const adminPortalsNgoRoutes = require('./routes/adminPortalsNgo');
const adminFinanceTransactionsRoutes = require('./routes/adminFinanceTransactions');
const adminSecurityAccessControlRoutes = require('./routes/adminSecurityAccessControl');
const adminAuditLogsRoutes = require('./routes/adminAuditLogs');
const adminRateLimitsRoutes = require('./routes/adminRateLimits');
const adminProjectRoutes = require('./routes/adminProject');
const adminPublicProjectRoutes = require('./routes/adminPublicProject');
const adminPublicProductRoutes = require('./routes/adminPublicProduct');
const publicProjectRoutes = require('./routes/publicProject');
const publicProductRoutes = require('./routes/publicProduct');
const corporateDashboardRoutes = require('./routes/corporateDashboard');
const corporateReportsRoutes = require('./routes/corporateReports');
const corporateVolunteersRoutes = require('./routes/corporateVolunteers');
const corporateCampaignsRoutes = require('./routes/corporateCampaigns');
const corporateEmissionsRoutes = require('./routes/corporateEmissions');
const corporateProfileSettingsRoutes = require('./routes/corporateProfileSettings');
const corporateSupportRoutes = require('./routes/corporateSupport');
const corporateEmployeesRoutes = require('./routes/corporateEmployees');
const ngoDashboardRoutes = require('./routes/ngoDashboard');
const ngoDetailsRoutes = require('./routes/ngoDetails');
const ngoPersonDetailsRoutes = require('./routes/ngoPersonDetails');
const ngoWalletRoutes = require('./routes/ngoWallet');
const ngoProjectRoutes = require('./routes/ngoProject');
const simpleUserDashboardRoutes = require('./routes/simpleUserDashboard');
const simpleUserActivityRoutes = require('./routes/simpleUserActivity');
const simpleUserWalletRoutes = require('./routes/simpleUserWallet');
const webhookRoutes = require('./routes/webhook');
const paymentRoutes = require('./routes/payment');

// Initialize Express App
const app = express();

// Connect to MongoDB Atlas (non-blocking)
connectDB().catch((err) => {
  console.error('❌ Failed to establish initial MongoDB connection:', err.message);
  console.warn('⚠️  Server will continue to run. Mongoose will retry connection automatically.');
  console.warn('⚠️  Database operations will fail until connection is established.\n');
});

// Middleware - Production ready CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// CRITICAL: Webhook route MUST be registered BEFORE express.json() middleware
// Stripe webhook signature verification requires raw body
app.use('/api/payment', webhookRoutes);

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Greyn Eco Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/overview', adminOverviewRoutes);
app.use('/api/admin/system-settings', systemSettingsRoutes);
app.use('/api/admin/system', systemHealthRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/roles', adminRolesRoutes);
app.use('/api/admin/invitations', adminInvitationsRoutes);
app.use('/api/admin/portals/corporate', adminPortalsCorporateRoutes);
app.use('/api/admin/portals/ngo', adminPortalsNgoRoutes);
app.use('/api/admin/finance/transactions', adminFinanceTransactionsRoutes);
app.use('/api/admin/security/access-control', adminSecurityAccessControlRoutes);
app.use('/api/admin/security/audit-logs', adminAuditLogsRoutes);
app.use('/api/admin/security/rate-limits', adminRateLimitsRoutes);
app.use('/api/admin/projects', adminProjectRoutes);
app.use('/api/admin/public-projects', adminPublicProjectRoutes);
app.use('/api/admin/public-products', adminPublicProductRoutes);
app.use('/api/public/projects', publicProjectRoutes);
app.use('/api/public/products', publicProductRoutes);
app.use('/api/corporate', corporateDashboardRoutes);
app.use('/api/corporate/reports', corporateReportsRoutes);
app.use('/api/corporate/volunteers', corporateVolunteersRoutes);
app.use('/api/corporate/campaigns', corporateCampaignsRoutes);
app.use('/api/corporate/emissions', corporateEmissionsRoutes);
app.use('/api/corporate/profile-settings', corporateProfileSettingsRoutes);
app.use('/api/corporate/support', corporateSupportRoutes);
app.use('/api/corporate/employees', corporateEmployeesRoutes);
app.use('/api/ngo/dashboard', ngoDashboardRoutes);
app.use('/api/ngo/details', ngoDetailsRoutes);
app.use('/api/ngo/person-details', ngoPersonDetailsRoutes);
app.use('/api/ngo/wallet', ngoWalletRoutes);
app.use('/api/ngo/projects', ngoProjectRoutes);
app.use('/api/dashboard', simpleUserDashboardRoutes);
app.use('/api/activities', simpleUserActivityRoutes);
app.use('/api/wallet', simpleUserWalletRoutes);

// Payment routes (authenticated endpoints)
app.use('/api/payment', paymentRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Greyn Eco Backend API Server');
  console.log('='.repeat(60));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✓ Configured' : '✗ Missing'}`);
  console.log(`👮 Admin Code: ${process.env.ADMIN_CODE ? '✓ Configured' : '✗ Missing'}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/signup/simple-user`);
  console.log(`   POST /api/auth/login/simple-user`);
  console.log(`   POST /api/auth/signup/ngo`);
  console.log(`   POST /api/auth/login/ngo`);
    console.log(`   POST /api/auth/signup/corporate`);
    console.log(`   POST /api/auth/login/corporate`);
    console.log(`   POST /api/auth/signup/carbon`);
    console.log(`   POST /api/auth/login/carbon`);
    console.log(`   POST /api/auth/signup/admin`);
    console.log(`   POST /api/auth/login/admin`);
  console.log(`   GET  /api/admin/overview (Admin only)`);
  console.log(`   GET  /api/admin/overview/kpis (Admin only)`);
  console.log(`   GET  /api/admin/overview/credits-lifecycle (Admin only)`);
  console.log(`   GET  /api/admin/overview/usage-trend (Admin only)`);
  console.log(`   GET  /api/admin/overview/portal-activity (Admin only)`);
  console.log(`   GET  /api/admin/system-settings (Admin only)`);
  console.log(`   PUT  /api/admin/system-settings/:section (Admin only)`);
  console.log(`   GET  /api/admin/system-settings/integrations (Admin only)`);
  console.log(`   PUT  /api/admin/system-settings/integrations/:id (Admin only)`);
  console.log(`   GET  /api/admin/system-settings/backups (Admin only)`);
  console.log(`   POST /api/admin/system-settings/backups (Admin only)`);
    console.log(`   GET  /api/admin/system (Admin only)`);
    console.log(`   GET  /api/admin/system/services (Admin only)`);
    console.log(`   GET  /api/admin/system/incidents (Admin only)`);
    console.log(`   GET  /api/admin/system/logs (Admin only)`);
    console.log(`   GET  /api/admin/users (Admin only)`);
    console.log(`   GET  /api/admin/users/stats (Admin only)`);
    console.log(`   GET  /api/admin/users/:id (Admin only)`);
    console.log(`   PUT  /api/admin/users/:id/status (Admin only)`);
    console.log(`   PUT  /api/admin/users/:id/role (Admin only)`);
    console.log(`   GET  /api/admin/roles (Admin only)`);
    console.log(`   GET  /api/admin/roles/stats (Admin only)`);
    console.log(`   GET  /api/admin/roles/:id (Admin only)`);
    console.log(`   POST /api/admin/roles (Admin only)`);
    console.log(`   PUT  /api/admin/roles/:id/permissions (Admin only)`);
    console.log(`   PUT  /api/admin/roles/:id/permissions/:permission (Admin only)`);
    console.log(`   PUT  /api/admin/roles/:id/permissions/all (Admin only)`);
    console.log(`   DELETE /api/admin/roles/:id (Admin only)`);
    console.log(`   POST /api/admin/roles/reset (Admin only)`);
    console.log(`   GET  /api/admin/roles/export (Admin only)`);
    console.log(`   GET  /api/admin/invitations (Admin only)`);
    console.log(`   GET  /api/admin/invitations/stats (Admin only)`);
    console.log(`   GET  /api/admin/invitations/:id (Admin only)`);
    console.log(`   POST /api/admin/invitations (Admin only)`);
    console.log(`   PUT  /api/admin/invitations/:id/resend (Admin only)`);
    console.log(`   PUT  /api/admin/invitations/:id/revoke (Admin only)`);
    console.log(`   GET  /api/admin/invitations/export (Admin only)`);
    console.log(`   GET  /api/admin/portals/corporate (Admin only)`);
    console.log(`   PATCH /api/admin/portals/corporate/entities/:id/status (Admin only)`);
    console.log(`   GET  /api/admin/portals/ngo (Admin only)`);
    console.log(`   PATCH /api/admin/portals/ngo/entities/:id/status (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions/export (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions/analytics (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions/:id (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions/:id/receipt (Admin only)`);
    console.log(`   GET  /api/admin/finance/transactions/:id/invoice (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/overview (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/access-rules (Admin only)`);
    console.log(`   POST /api/admin/security/access-control/access-rules (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/access-rules/:id (Admin only)`);
    console.log(`   PUT  /api/admin/security/access-control/access-rules/:id (Admin only)`);
    console.log(`   DELETE /api/admin/security/access-control/access-rules/:id (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/ip-rules (Admin only)`);
    console.log(`   POST /api/admin/security/access-control/ip-rules (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/ip-rules/:id (Admin only)`);
    console.log(`   PUT  /api/admin/security/access-control/ip-rules/:id (Admin only)`);
    console.log(`   DELETE /api/admin/security/access-control/ip-rules/:id (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/role-access (Admin only)`);
    console.log(`   GET  /api/admin/security/access-control/role-access/:role (Admin only)`);
    console.log(`   PUT  /api/admin/security/access-control/role-access/:role (Admin only)`);
    console.log(`   GET  /api/admin/security/audit-logs (Admin only)`);
    console.log(`   GET  /api/admin/security/audit-logs/export (Admin only)`);
    console.log(`   GET  /api/admin/security/audit-logs/:id (Admin only)`);
    console.log(`   GET  /api/admin/security/audit-logs/:id/export (Admin only)`);
    console.log(`   GET  /api/admin/security/audit-logs/:id/verify (Admin only)`);
    console.log(`   GET  /api/admin/security/rate-limits (Admin only)`);
    console.log(`   POST /api/admin/security/rate-limits (Admin only)`);
    console.log(`   GET  /api/admin/security/rate-limits/:id (Admin only)`);
    console.log(`   PUT  /api/admin/security/rate-limits/:id (Admin only)`);
    console.log(`   DELETE /api/admin/security/rate-limits/:id (Admin only)`);
    console.log(`   POST /api/admin/security/rate-limits/:id/reset (Admin only)`);
    console.log('='.repeat(60) + '\n');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  if (NODE_ENV === 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});
