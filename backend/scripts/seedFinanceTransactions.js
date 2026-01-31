/**
 * Seed Finance Transactions
 * Populates finance_transactions for the admin finance transactions page.
 * Run: npm run seed:finance-transactions
 * Uses MONGODB_URI from backend/.env (MongoDB Atlas).
 * Seed records have source: 'seed' and are excluded by default (use ?includeSeed=1 to include).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const FinanceTransaction = require('../models/FinanceTransaction');
const connectDB = require('../config/database');

const SEED = [
  { transactionId: 'TXN-2024-001', timestamp: '2024-03-25T14:30:00Z', type: 'purchase', amount: 12500, currency: 'USD', entity: 'TechCorp Industries', description: 'Carbon credit purchase - 500 credits @ $25/tonne', status: 'completed', reference: 'REF-789456', paymentMethod: 'credit_card', fees: 375, netAmount: 12125, invoiceId: 'INV-2024-001' },
  { transactionId: 'TXN-2024-002', timestamp: '2024-03-25T13:15:00Z', type: 'commission', amount: 625, currency: 'USD', entity: 'Platform Commission', description: 'Commission from TechCorp purchase (5%)', status: 'completed', reference: 'REF-789455', paymentMethod: 'wallet' },
  { transactionId: 'TXN-2024-003', timestamp: '2024-03-25T11:45:00Z', type: 'purchase', amount: 8500, currency: 'USD', entity: 'GreenEnergy Solutions', description: 'Carbon credit purchase - 340 credits @ $25/tonne', status: 'completed', reference: 'REF-789444', paymentMethod: 'bank_transfer', fees: 255, netAmount: 8245, invoiceId: 'INV-2024-002' },
  { transactionId: 'TXN-2024-004', timestamp: '2024-03-25T10:20:00Z', type: 'sale', amount: 25000, currency: 'USD', entity: 'EcoFinance Group', description: 'Corporate ESG subscription - Annual plan', status: 'completed', reference: 'REF-789433', paymentMethod: 'bank_transfer', fees: 0, netAmount: 25000, invoiceId: 'INV-2024-003' },
  { transactionId: 'TXN-2024-005', timestamp: '2024-03-25T09:10:00Z', type: 'purchase', amount: 3200, currency: 'USD', entity: 'Sarah Johnson', description: 'Individual carbon credit purchase - 128 credits', status: 'pending', reference: 'REF-789422', paymentMethod: 'credit_card', fees: 96, netAmount: 3104 },
  { transactionId: 'TXN-2024-006', timestamp: '2024-03-24T16:30:00Z', type: 'fee', amount: 150, currency: 'USD', entity: 'Transaction Fee', description: 'Platform transaction processing fee', status: 'completed', reference: 'REF-789411', paymentMethod: 'wallet' },
  { transactionId: 'TXN-2024-007', timestamp: '2024-03-24T14:00:00Z', type: 'refund', amount: -1200, currency: 'USD', entity: 'Refund Processing', description: 'Refund for failed transaction TXN-2024-008', status: 'completed', reference: 'REF-789400', paymentMethod: 'credit_card' },
  { transactionId: 'TXN-2024-008', timestamp: '2024-03-24T12:30:00Z', type: 'purchase', amount: 1200, currency: 'USD', entity: 'John Doe', description: 'Carbon credit purchase - 48 credits', status: 'failed', reference: 'REF-789399', paymentMethod: 'credit_card' },
  { transactionId: 'TXN-2024-009', timestamp: '2024-03-24T10:15:00Z', type: 'withdrawal', amount: -5000, currency: 'USD', entity: 'NGO Green Earth', description: 'Fund withdrawal to bank account', status: 'processing', reference: 'REF-789388', paymentMethod: 'bank_transfer', fees: 25, netAmount: -4975 },
  { transactionId: 'TXN-2024-010', timestamp: '2024-03-23T18:00:00Z', type: 'deposit', amount: 15000, currency: 'USD', entity: 'Corporate Buyer Inc', description: 'Account deposit for future purchases', status: 'completed', reference: 'REF-789377', paymentMethod: 'bank_transfer', fees: 0, netAmount: 15000 },
  { transactionId: 'TXN-2024-011', timestamp: '2024-03-23T15:45:00Z', type: 'purchase', amount: 6750, currency: 'USD', entity: 'Sustainable Corp', description: 'Carbon credit purchase - 270 credits @ $25/tonne', status: 'completed', reference: 'REF-789366', paymentMethod: 'crypto', fees: 202.5, netAmount: 6547.5, invoiceId: 'INV-2024-004' },
  { transactionId: 'TXN-2024-012', timestamp: '2024-03-23T13:20:00Z', type: 'commission', amount: 337.5, currency: 'USD', entity: 'Platform Commission', description: 'Commission from Sustainable Corp purchase (5%)', status: 'completed', reference: 'REF-789355', paymentMethod: 'wallet' },
];

async function seedFinanceTransactions() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB Atlas');

    console.log('\n📋 Seeding Finance Transactions...');
    let created = 0;
    let updated = 0;
    for (const t of SEED) {
      const existing = await FinanceTransaction.findOne({ transactionId: t.transactionId });
      const doc = {
        ...t,
        timestamp: new Date(t.timestamp),
        source: 'seed',
      };
      if (existing) {
        await FinanceTransaction.updateOne({ transactionId: t.transactionId }, { $set: doc });
        updated++;
        console.log(`- Updated: ${t.transactionId}`);
      } else {
        await FinanceTransaction.create(doc);
        created++;
        console.log(`✓ Created: ${t.transactionId}`);
      }
    }

    console.log(`\n✅ Finance transactions seeding completed. Created: ${created}, Updated: ${updated}`);
    console.log('   Note: Seed records have source="seed" and are excluded by default. Use ?includeSeed=1 to include them.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding finance transactions:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedFinanceTransactions();
}

module.exports = seedFinanceTransactions;
