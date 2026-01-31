/**
 * Seed NGO Portal Script
 * Populates NGOs (with projects/totalFunding/location), activities, and health for the admin NGO Portal.
 * Run: npm run seed:ngo-portal
 * Uses MONGODB_URI from backend/.env (MongoDB Atlas).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { NGO } = require('../models/User');
const NgoPortalActivity = require('../models/NgoPortalActivity');
const NgoPortalHealth = require('../models/NgoPortalHealth');
const connectDB = require('../config/database');

const NGO_SEED = [
  { organizationName: 'Green Earth Foundation', registrationNumber: 'REG-SEED-GE-001', contactPerson: 'Sarah Green', email: 'contact@greenearth.org', password: 'SeedPassword1!', status: 'active', projects: 12, totalFunding: 245000, location: 'San Francisco, CA' },
  { organizationName: 'Ocean Conservation Initiative', registrationNumber: 'REG-SEED-OC-002', contactPerson: 'Mike Ocean', email: 'info@oceancare.org', password: 'SeedPassword1!', status: 'active', projects: 8, totalFunding: 189000, location: 'Miami, FL' },
  { organizationName: 'Forest Restoration Alliance', registrationNumber: 'REG-SEED-FR-003', contactPerson: 'Emma Forest', email: 'hello@forestrestore.org', password: 'SeedPassword1!', status: 'pending', projects: 0, totalFunding: 0, location: 'Portland, OR' },
  { organizationName: 'Wildlife Protection Society', registrationNumber: 'REG-SEED-WP-004', contactPerson: 'James Wild', email: 'contact@wildlife-protect.org', password: 'SeedPassword1!', status: 'active', projects: 15, totalFunding: 320000, location: 'Denver, CO' },
  { organizationName: 'Clean Water Network', registrationNumber: 'REG-SEED-CW-005', contactPerson: 'Anna Clear', email: 'info@cleanwater.org', password: 'SeedPassword1!', status: 'suspended', projects: 5, totalFunding: 95000, location: 'Atlanta, GA' }
];

const ACTIVITY_SEED = [
  { type: 'project_launched', entityName: 'Green Earth Foundation', description: 'Launched new reforestation project' },
  { type: 'funding_received', entityName: 'Ocean Conservation Initiative', description: 'Received $25,000 in funding' },
  { type: 'milestone_completed', entityName: 'Wildlife Protection Society', description: 'Completed Phase 2 milestone' },
  { type: 'update_posted', entityName: 'Green Earth Foundation', description: 'Posted project update with photos' },
  { type: 'project_launched', entityName: 'Ocean Conservation Initiative', description: 'Launched beach cleanup initiative' },
  { type: 'funding_received', entityName: 'Green Earth Foundation', description: 'Received $50,000 grant' },
  { type: 'milestone_completed', entityName: 'Ocean Conservation Initiative', description: 'Reached 1,000 volunteers milestone' },
  { type: 'update_posted', entityName: 'Wildlife Protection Society', description: 'Published Q2 impact report' }
];

const SEED_EMAILS = NGO_SEED.map((n) => n.email);
const SEED_ENTITY_NAMES = NGO_SEED.map((n) => n.organizationName);

async function seedNgoPortal() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB Atlas');

    // 0) Mark existing seed data so it is filtered out by the API (only real data shown)
    await NGO.updateMany({ email: { $in: SEED_EMAILS } }, { $set: { source: 'seed' } });
    await NgoPortalActivity.updateMany({ entityName: { $in: SEED_ENTITY_NAMES } }, { $set: { source: 'seed' } });
    await NgoPortalHealth.updateMany({}, { $set: { source: 'seed' } });

    // 1) Seed NGOs (skip if email/registrationNumber already exists)
    console.log('\n📋 Seeding NGO entities...');
    const createdIds = [];
    for (const n of NGO_SEED) {
      const exists = await NGO.findOne({ $or: [{ email: n.email }, { registrationNumber: n.registrationNumber }] });
      if (exists) {
        console.log(`- NGO already exists: ${n.organizationName}`);
        createdIds.push({ _id: exists._id, organizationName: n.organizationName });
      } else {
        const doc = await NGO.create({ ...n, source: 'seed' });
        console.log(`✓ Created NGO: ${n.organizationName}`);
        createdIds.push({ _id: doc._id, organizationName: doc.organizationName });
      }
    }

    // 2) Seed activities
    console.log('\n📋 Seeding NGO Portal Activities...');
    const nameToId = Object.fromEntries(createdIds.map((x) => [x.organizationName, x._id]));
    for (const a of ACTIVITY_SEED) {
      const existing = await NgoPortalActivity.findOne({
        entityName: a.entityName,
        description: a.description,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      if (existing) {
        console.log(`- Activity already exists: ${a.description.slice(0, 40)}...`);
      } else {
        await NgoPortalActivity.create({
          type: a.type,
          ngo: nameToId[a.entityName] || null,
          entityName: a.entityName,
          description: a.description,
          source: 'seed'
        });
        console.log(`✓ Created activity: ${a.type} - ${a.entityName}`);
      }
    }

    // 3) Seed Portal Health
    console.log('\n📋 Seeding NGO Portal Health...');
    let health = await NgoPortalHealth.findOne();
    if (!health) {
      await NgoPortalHealth.create({
        status: 'operational',
        uptime: 99.7,
        responseTime: 145,
        activeSessions: 567,
        maxSessions: 1000,
        lastChecked: new Date(),
        message: null,
        source: 'seed'
      });
      console.log('✓ Created NGO Portal Health document');
    } else {
      await NgoPortalHealth.updateOne(
        { _id: health._id },
        { $set: { lastChecked: new Date(), status: 'operational', uptime: 99.7, responseTime: 145, source: 'seed' } }
      );
      console.log('✓ Updated existing NGO Portal Health');
    }

    console.log('\n✅ NGO portal seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding NGO portal:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedNgoPortal();
}

module.exports = seedNgoPortal;
