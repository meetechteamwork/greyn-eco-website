/**
 * Seed Corporate Portal Script
 * Populates corporates (with employees/campaigns), activities, and health for the admin Corporate Portal.
 * Run: node scripts/seedCorporatePortal.js
 * Uses MONGODB_URI from backend/.env (MongoDB Atlas).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { Corporate } = require('../models/User');
const CorporatePortalActivity = require('../models/CorporatePortalActivity');
const CorporatePortalHealth = require('../models/CorporatePortalHealth');
const connectDB = require('../config/database');

const CORPORATE_SEED = [
  { companyName: 'TechCorp Industries', taxId: 'TAX-SEED-TC-001', contactPerson: 'Jane Doe', email: 'contact@techcorp.com', password: 'SeedPassword1!', status: 'active', employees: 1250, campaigns: 8 },
  { companyName: 'GreenEnergy Solutions', taxId: 'TAX-SEED-GE-002', contactPerson: 'John Smith', email: 'info@greenenergy.com', password: 'SeedPassword1!', status: 'active', employees: 450, campaigns: 12 },
  { companyName: 'Sustainable Manufacturing Co', taxId: 'TAX-SEED-SM-003', contactPerson: 'Alice Green', email: 'hello@sustainco.com', password: 'SeedPassword1!', status: 'pending', employees: 320, campaigns: 0 },
  { companyName: 'EcoFinance Group', taxId: 'TAX-SEED-EF-004', contactPerson: 'Bob Wilson', email: 'contact@ecofinance.com', password: 'SeedPassword1!', status: 'active', employees: 890, campaigns: 5 },
  { companyName: 'Corporate Sustainability LLC', taxId: 'TAX-SEED-CS-005', contactPerson: 'Carol Brown', email: 'info@sustainabilityllc.com', password: 'SeedPassword1!', status: 'suspended', employees: 200, campaigns: 2 }
];

const ACTIVITY_SEED = [
  { type: 'campaign_created', entityName: 'TechCorp Industries', description: 'Created new campaign: "Renewable Energy Initiative"' },
  { type: 'emission_reported', entityName: 'GreenEnergy Solutions', description: 'Submitted monthly CO₂ emissions report' },
  { type: 'volunteer_event', entityName: 'EcoFinance Group', description: 'Organized community tree planting event' },
  { type: 'report_generated', entityName: 'TechCorp Industries', description: 'Generated Q1 ESG report' },
  { type: 'campaign_created', entityName: 'GreenEnergy Solutions', description: 'Created new campaign: "Carbon Neutral Office"' },
  { type: 'emission_reported', entityName: 'TechCorp Industries', description: 'Submitted Q2 scope 1 & 2 emissions' },
  { type: 'volunteer_event', entityName: 'TechCorp Industries', description: 'Employee volunteer day: beach cleanup' },
  { type: 'report_generated', entityName: 'EcoFinance Group', description: 'Published annual sustainability report' }
];

const SEED_EMAILS = CORPORATE_SEED.map((c) => c.email);
const SEED_ENTITY_NAMES = CORPORATE_SEED.map((c) => c.companyName);

async function seedCorporatePortal() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB Atlas');

    // 0) Mark existing seed data so it is filtered out by the API (only real data shown)
    await Corporate.updateMany({ email: { $in: SEED_EMAILS } }, { $set: { source: 'seed' } });
    await CorporatePortalActivity.updateMany({ entityName: { $in: SEED_ENTITY_NAMES } }, { $set: { source: 'seed' } });
    await CorporatePortalHealth.updateMany({}, { $set: { source: 'seed' } });

    // 1) Seed Corporates (skip if email/taxId already exists)
    console.log('\n📋 Seeding Corporate entities...');
    const createdCorpIds = [];
    for (const c of CORPORATE_SEED) {
      const exists = await Corporate.findOne({ $or: [{ email: c.email }, { taxId: c.taxId }] });
      if (exists) {
        console.log(`- Corporate already exists: ${c.companyName}`);
        createdCorpIds.push({ _id: exists._id, companyName: c.companyName });
      } else {
        const corp = await Corporate.create({ ...c, source: 'seed' });
        console.log(`✓ Created corporate: ${c.companyName}`);
        createdCorpIds.push({ _id: corp._id, companyName: corp.companyName });
      }
    }

    // 2) Seed Activities (link to corporates by entityName, avoid duplicates by description+entity+recent)
    console.log('\n📋 Seeding Corporate Portal Activities...');
    const nameToId = Object.fromEntries(createdCorpIds.map((x) => [x.companyName, x._id]));
    for (const a of ACTIVITY_SEED) {
      const existing = await CorporatePortalActivity.findOne({
        entityName: a.entityName,
        description: a.description,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      if (existing) {
        console.log(`- Activity already exists: ${a.description.slice(0, 40)}...`);
      } else {
        await CorporatePortalActivity.create({
          type: a.type,
          corporate: nameToId[a.entityName] || null,
          entityName: a.entityName,
          description: a.description,
          source: 'seed'
        });
        console.log(`✓ Created activity: ${a.type} - ${a.entityName}`);
      }
    }

    // 3) Seed Portal Health (single document)
    console.log('\n📋 Seeding Corporate Portal Health...');
    let health = await CorporatePortalHealth.findOne();
    if (!health) {
      health = await CorporatePortalHealth.create({
        status: 'operational',
        uptime: 99.9,
        responseTime: 120,
        activeSessions: 1234,
        maxSessions: 5000,
        lastChecked: new Date(),
        message: null,
        source: 'seed'
      });
      console.log('✓ Created Corporate Portal Health document');
    } else {
      await CorporatePortalHealth.updateOne(
        { _id: health._id },
        { $set: { lastChecked: new Date(), status: 'operational', uptime: 99.9, responseTime: 120, source: 'seed' } }
      );
      console.log('✓ Updated existing Corporate Portal Health');
    }

    console.log('\n✅ Corporate portal seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding corporate portal:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedCorporatePortal();
}

module.exports = seedCorporatePortal;
