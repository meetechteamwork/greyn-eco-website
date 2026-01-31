/**
 * Seed Rate Limits for Admin Security Rate Limits Page
 * Run: npm run seed:rate-limits
 */

require('dotenv').config();
const mongoose = require('mongoose');
const RateLimit = require('../models/RateLimit');

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Calculate next reset time based on window
 */
function calculateNextReset(window) {
  const now = new Date();
  const next = new Date(now);
  
  switch (window) {
    case '15 minutes':
      next.setMinutes(next.getMinutes() + 15);
      break;
    case '1 hour':
      next.setHours(next.getHours() + 1);
      break;
    case '24 hours':
      next.setDate(next.getDate() + 1);
      break;
    case '1 week':
      next.setDate(next.getDate() + 7);
      break;
  }
  
  return next;
}

const rateLimits = [
  {
    endpoint: '/api/auth/login',
    method: 'POST',
    limit: 100,
    window: '15 minutes',
    current: 23,
    description: 'Login endpoint rate limit to prevent brute force attacks',
    lastReset: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    nextReset: calculateNextReset('15 minutes'),
    blockedRequests: 0,
    averageResponseTime: 145,
    category: 'authentication',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/users',
    method: 'GET',
    limit: 1000,
    window: '1 hour',
    current: 856,
    description: 'User data retrieval endpoint',
    lastReset: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 12,
    averageResponseTime: 89,
    category: 'api',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/transactions',
    method: 'POST',
    limit: 500,
    window: '1 hour',
    current: 487,
    description: 'Transaction creation endpoint',
    lastReset: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 5,
    averageResponseTime: 234,
    category: 'payment',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/admin/*',
    method: 'ALL',
    limit: 200,
    window: '1 hour',
    current: 45,
    description: 'All admin endpoints rate limit',
    lastReset: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 156,
    category: 'admin',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/carbon/purchase',
    method: 'POST',
    limit: 50,
    window: '15 minutes',
    current: 48,
    description: 'Carbon credit purchase endpoint - high security',
    lastReset: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    nextReset: calculateNextReset('15 minutes'),
    blockedRequests: 2,
    averageResponseTime: 312,
    category: 'payment',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/projects',
    method: 'GET',
    limit: 2000,
    window: '1 hour',
    current: 1234,
    description: 'Project listing and search endpoint',
    lastReset: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 67,
    category: 'api',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/verification/approve',
    method: 'POST',
    limit: 100,
    window: '1 hour',
    current: 95,
    description: 'Project verification approval endpoint',
    lastReset: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 3,
    averageResponseTime: 189,
    category: 'admin',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/data/export',
    method: 'GET',
    limit: 20,
    window: '24 hours',
    current: 18,
    description: 'Data export endpoint - resource intensive',
    lastReset: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    nextReset: calculateNextReset('24 hours'),
    blockedRequests: 1,
    averageResponseTime: 2456,
    category: 'data',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/auth/password-reset',
    method: 'POST',
    limit: 10,
    window: '1 hour',
    current: 10,
    description: 'Password reset endpoint - very strict limit',
    lastReset: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 15,
    averageResponseTime: 178,
    category: 'authentication',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/admin/users/*',
    method: 'ALL',
    limit: 300,
    window: '1 hour',
    current: 67,
    description: 'User management endpoints',
    lastReset: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 123,
    category: 'admin',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/auth/signup',
    method: 'POST',
    limit: 50,
    window: '1 hour',
    current: 12,
    description: 'User registration endpoint',
    lastReset: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 267,
    category: 'authentication',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/carbon/credits',
    method: 'GET',
    limit: 1500,
    window: '1 hour',
    current: 987,
    description: 'Carbon credits listing endpoint',
    lastReset: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 89,
    category: 'api',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/payment/process',
    method: 'POST',
    limit: 100,
    window: '15 minutes',
    current: 45,
    description: 'Payment processing endpoint',
    lastReset: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    nextReset: calculateNextReset('15 minutes'),
    blockedRequests: 1,
    averageResponseTime: 456,
    category: 'payment',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/reports/generate',
    method: 'POST',
    limit: 30,
    window: '24 hours',
    current: 24,
    description: 'Report generation endpoint - resource intensive',
    lastReset: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    nextReset: calculateNextReset('24 hours'),
    blockedRequests: 2,
    averageResponseTime: 3450,
    category: 'data',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
  {
    endpoint: '/api/search',
    method: 'GET',
    limit: 5000,
    window: '1 hour',
    current: 3421,
    description: 'Global search endpoint',
    lastReset: new Date(Date.now() - 42 * 60 * 1000), // 42 minutes ago
    nextReset: calculateNextReset('1 hour'),
    blockedRequests: 0,
    averageResponseTime: 123,
    category: 'api',
    createdBy: 'admin@greyn-eco.com',
    source: 'seed',
  },
];

async function seedRateLimits() {
  try {
    console.log('🌱 Starting Rate Limits Seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear existing seed data
    const deleteResult = await RateLimit.deleteMany({ source: 'seed' });
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing seed rate limits\n`);

    // Insert new seed data
    console.log('📥 Inserting rate limits...');
    const inserted = await RateLimit.insertMany(rateLimits);
    console.log(`✅ Successfully inserted ${inserted.length} rate limits\n`);

    // Display summary
    console.log('📊 Summary:');
    console.log(`   Total Rate Limits: ${inserted.length}`);
    
    const byCategory = rateLimits.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n   By Category:');
    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });

    const byStatus = inserted.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n   By Status:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });

    console.log('\n✨ Rate Limits seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding rate limits:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  seedRateLimits();
}

module.exports = seedRateLimits;
