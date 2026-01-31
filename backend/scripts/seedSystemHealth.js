/**
 * Seed System Health Data Script
 * Initializes default system services
 * Run this once to set up initial system health monitoring
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const SystemService = require('../models/SystemService');
const connectDB = require('../config/database');

async function seedSystemHealth() {
  try {
    // Connect to database
    await connectDB();

    // Seed Default Services
    console.log('\n📋 Seeding System Services...');
    const defaultServices = [
      {
        name: 'Web Application',
        status: 'operational',
        latency: 45,
        uptime: 99.98,
        serviceType: 'web',
        latencyThreshold: 100,
        uptimeThreshold: 99.0
      },
      {
        name: 'API Gateway',
        status: 'operational',
        latency: 28,
        uptime: 99.95,
        serviceType: 'api',
        latencyThreshold: 100,
        uptimeThreshold: 99.0
      },
      {
        name: 'Authentication Service',
        status: 'operational',
        latency: 32,
        uptime: 99.99,
        serviceType: 'api',
        latencyThreshold: 100,
        uptimeThreshold: 99.0
      },
      {
        name: 'Database (MongoDB)',
        status: 'operational',
        latency: 12,
        uptime: 99.92,
        serviceType: 'database',
        latencyThreshold: 50,
        uptimeThreshold: 99.5
      },
      {
        name: 'Payment Gateway',
        status: 'operational',
        latency: 45,
        uptime: 99.85,
        serviceType: 'payment',
        latencyThreshold: 150,
        uptimeThreshold: 99.0
      },
      {
        name: 'Carbon Credit Engine',
        status: 'operational',
        latency: 67,
        uptime: 99.85,
        serviceType: 'other',
        latencyThreshold: 200,
        uptimeThreshold: 99.0
      }
    ];

    for (const service of defaultServices) {
      const existing = await SystemService.findOne({ name: service.name });
      if (!existing) {
        await SystemService.create({
          ...service,
          lastChecked: new Date(),
          lastOperational: new Date()
        });
        console.log(`✓ Created service: ${service.name}`);
      } else {
        console.log(`- Service already exists: ${service.name}`);
      }
    }

    console.log('\n✅ System health data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding system health data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedSystemHealth();
}

module.exports = seedSystemHealth;
