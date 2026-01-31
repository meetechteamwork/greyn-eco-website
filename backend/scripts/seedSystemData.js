/**
 * Seed System Data Script
 * Initializes default system settings and integrations
 * Run this once to set up initial system configuration
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const SystemSettings = require('../models/SystemSettings');
const Integration = require('../models/Integration');

const connectDB = require('../config/database');

async function seedSystemData() {
  try {
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Seed System Settings
    console.log('\n📋 Seeding System Settings...');
    const existingSettings = await SystemSettings.findOne();
    if (!existingSettings) {
      await SystemSettings.create({});
      console.log('✓ System settings initialized with defaults');
    } else {
      console.log('✓ System settings already exist');
    }

    // Seed Default Integrations
    console.log('\n🔌 Seeding Integrations...');
    const defaultIntegrations = [
      {
        name: 'Email Service (SMTP)',
        type: 'email',
        status: 'disconnected',
        displayOrder: 1,
        description: 'SMTP email service for sending transactional emails',
        icon: '📧'
      },
      {
        name: 'Payment Gateway (Stripe)',
        type: 'payment',
        status: 'disconnected',
        displayOrder: 2,
        description: 'Stripe payment processing integration',
        icon: '💳'
      },
      {
        name: 'Analytics (Google Analytics)',
        type: 'analytics',
        status: 'disconnected',
        displayOrder: 3,
        description: 'Google Analytics for platform analytics',
        icon: '📊'
      },
      {
        name: 'Cloud Storage (AWS S3)',
        type: 'storage',
        status: 'disconnected',
        displayOrder: 4,
        description: 'AWS S3 for file storage',
        icon: '☁️'
      },
      {
        name: 'Monitoring (Sentry)',
        type: 'monitoring',
        status: 'disconnected',
        displayOrder: 5,
        description: 'Sentry for error monitoring and tracking',
        icon: '🔍'
      }
    ];

    for (const integration of defaultIntegrations) {
      const existing = await Integration.findOne({ name: integration.name });
      if (!existing) {
        await Integration.create(integration);
        console.log(`✓ Created integration: ${integration.name}`);
      } else {
        console.log(`- Integration already exists: ${integration.name}`);
      }
    }

    console.log('\n✅ System data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding system data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedSystemData();
}

module.exports = seedSystemData;
