const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Role = require('../models/Role');
const connectDB = require('../config/database');

/**
 * Seed default roles
 */
const seedRoles = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Seeding default roles...\n');

    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full system access with all permissions',
        permissions: {
          view: true,
          create: true,
          approve: true,
          delete: true
        },
        isSystem: true,
        isActive: true
      },
      {
        name: 'Corporate Admin',
        description: 'Manage corporate ESG portal and campaigns',
        permissions: {
          view: true,
          create: true,
          approve: true,
          delete: false
        },
        isSystem: true,
        isActive: true
      },
      {
        name: 'NGO Admin',
        description: 'Manage NGO projects and submissions',
        permissions: {
          view: true,
          create: true,
          approve: false,
          delete: false
        },
        isSystem: true,
        isActive: true
      },
      {
        name: 'Verifier',
        description: 'Verify and approve carbon credit projects',
        permissions: {
          view: true,
          create: false,
          approve: true,
          delete: false
        },
        isSystem: true,
        isActive: true
      },
      {
        name: 'Investor',
        description: 'View and purchase carbon credits',
        permissions: {
          view: true,
          create: false,
          approve: false,
          delete: false
        },
        isSystem: true,
        isActive: true
      }
    ];

    let created = 0;
    let updated = 0;

    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });

      if (existingRole) {
        // Update existing role
        existingRole.description = roleData.description;
        existingRole.permissions = roleData.permissions;
        existingRole.isSystem = true;
        existingRole.isActive = true;
        await existingRole.save();
        updated++;
        console.log(`✅ Updated role: ${roleData.name}`);
      } else {
        // Create new role
        await Role.create(roleData);
        created++;
        console.log(`✅ Created role: ${roleData.name}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} roles`);
    console.log(`   Updated: ${updated} roles`);
    console.log(`   Total: ${defaultRoles.length} roles\n`);

    // Display all roles
    const allRoles = await Role.find({ isActive: true }).sort({ name: 1 });
    console.log('📋 All Roles:');
    allRoles.forEach(role => {
      const permissions = Object.entries(role.permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
      console.log(`   • ${role.name} (${permissions || 'no permissions'})`);
    });

    console.log('\n✅ Roles seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding roles:', error);
    process.exit(1);
  }
};

// Run seed
seedRoles();
