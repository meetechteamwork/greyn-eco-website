const FinanceTransaction = require('../models/FinanceTransaction');
const mongoose = require('mongoose');

/** Exclude seed by default; set includeSeed=1 to include */
function buildBaseFilter(query) {
  const includeSeed = String(query.includeSeed || '').toLowerCase() === '1' || String(query.includeSeed) === 'true';
  return includeSeed ? {} : { source: { $ne: 'seed' } };
}

/**
 * Build filter from query: search, status, type, dateRange
 */
function buildFilter(query) {
  const filter = buildBaseFilter(query);
  const { search, status, type, dateRange } = query;

  if (search && String(search).trim()) {
    const q = String(search).trim();
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { transactionId: re },
      { entity: re },
      { reference: re },
      { description: re },
      { invoiceId: re },
    ];
  }
  if (status && status !== 'all') filter.status = status;
  if (type && type !== 'all') filter.type = type;

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    let start;
    if (dateRange === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === 'week') {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'month') {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'year') {
      start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    if (start) filter.timestamp = { $gte: start };
  }

  return filter;
}

function toResponseDoc(doc) {
  if (!doc) return null;
  const d = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: d.transactionId,
    transactionId: d.transactionId,
    timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : null,
    type: d.type,
    amount: d.amount,
    currency: d.currency || 'USD',
    entity: d.entity,
    description: d.description,
    status: d.status,
    reference: d.reference,
    paymentMethod: d.paymentMethod,
    fees: d.fees,
    netAmount: d.netAmount,
    invoiceId: d.invoiceId,
  };
}

/** Resolve :id to a document (transactionId or _id). query used for includeSeed. */
async function resolveTransaction(id, query) {
  if (!id) return null;
  const base = buildBaseFilter(query || {});
  if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
    const byObjectId = await FinanceTransaction.findOne({ _id: id, ...base });
    if (byObjectId) return byObjectId;
  }
  return FinanceTransaction.findOne({ transactionId: id, ...base });
}

/**
 * GET /api/admin/finance/transactions
 * List with filters, pagination, and stats.
 * Query: search, status, type, dateRange, page=1, limit=10, includeSeed=0
 */
exports.getList = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [faceted] = await FinanceTransaction.aggregate([
      { $match: filter },
      {
        $facet: {
          list: [
            { $sort: { timestamp: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                id: '$transactionId',
                transactionId: 1,
                timestamp: 1,
                type: 1,
                amount: 1,
                currency: 1,
                entity: 1,
                description: 1,
                status: 1,
                reference: 1,
                paymentMethod: 1,
                fees: 1,
                netAmount: 1,
                invoiceId: 1,
              },
            },
          ],
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                totalRevenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ['$status', 'completed'] }, { $gt: ['$amount', 0] }] },
                      { $ifNull: ['$netAmount', '$amount'] },
                      0,
                    ],
                  },
                },
                totalExpenses: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ['$status', 'completed'] }, { $lt: ['$amount', 0] }] },
                      { $abs: { $ifNull: ['$netAmount', '$amount'] } },
                      0,
                    ],
                  },
                },
                totalFees: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'completed'] }, { $ifNull: ['$fees', 0] }, 0],
                  },
                },
                pendingAmount: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'pending'] }, { $ifNull: ['$netAmount', '$amount'] }, 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                completed: 1,
                pending: 1,
                failed: 1,
                totalRevenue: 1,
                totalExpenses: 1,
                totalFees: 1,
                netAmount: { $subtract: ['$totalRevenue', '$totalExpenses'] },
                pendingAmount: 1,
              },
            },
          ],
        },
      },
    ]);

    const list = (faceted && faceted.list) || [];
    const transactions = list.map((d) => ({
      ...d,
      timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : null,
      currency: d.currency || 'USD',
    }));
    const rawStats = (faceted && faceted.stats && faceted.stats[0]) || {};
    const stats = {
      total: rawStats.total || 0,
      completed: rawStats.completed || 0,
      pending: rawStats.pending || 0,
      failed: rawStats.failed || 0,
      totalRevenue: rawStats.totalRevenue || 0,
      totalExpenses: rawStats.totalExpenses || 0,
      totalFees: rawStats.totalFees || 0,
      netAmount: rawStats.netAmount != null ? rawStats.netAmount : (rawStats.totalRevenue || 0) - (rawStats.totalExpenses || 0),
      pendingAmount: rawStats.pendingAmount || 0,
    };
    const total = stats.total;
    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      data: {
        transactions,
        stats,
        pagination: { page, limit, total, totalPages },
      },
    });
  } catch (error) {
    console.error('Error in getList (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/finance/transactions/export
 * Export filtered transactions. Query: search, status, type, dateRange, format=csv|json, includeSeed=0
 */
exports.getExport = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const format = (req.query.format || 'json').toLowerCase() === 'csv' ? 'csv' : 'json';

    const docs = await FinanceTransaction.find(filter).sort({ timestamp: -1 }).lean();
    const transactions = docs.map(toResponseDoc);

    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'type', 'amount', 'currency', 'entity', 'description', 'status', 'reference', 'paymentMethod', 'fees', 'netAmount', 'invoiceId'];
      const escape = (v) => {
        const s = v == null ? '' : String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = [headers.join(',')].concat(
        transactions.map((t) => headers.map((h) => escape(t[h])).join(','))
      );
      const csv = rows.join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="transactions-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.send(csv);
    }

    res.json({ success: true, data: { transactions } });
  } catch (error) {
    console.error('Error in getExport (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/finance/transactions/analytics
 * Aggregated analytics. Query: dateRange (all|today|week|month|year), groupBy=day|week|month, includeSeed=0
 */
exports.getAnalytics = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const groupBy = (req.query.groupBy || 'day').toLowerCase();
    if (!['day', 'week', 'month'].includes(groupBy)) {
      return res.status(400).json({ success: false, message: 'groupBy must be day, week, or month' });
    }

    const docs = await FinanceTransaction.find(filter).sort({ timestamp: 1 }).lean();

    const byType = {};
    const byStatus = {};
    let totalRevenue = 0;
    let totalExpenses = 0;
    const timeBuckets = {};

    const fmt = (d) => {
      const dt = new Date(d);
      if (groupBy === 'day') return dt.toISOString().slice(0, 10);
      if (groupBy === 'week') {
        const start = new Date(dt);
        start.setDate(start.getDate() - start.getDay());
        return start.toISOString().slice(0, 10);
      }
      return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
    };

    for (const t of docs) {
      byType[t.type] = (byType[t.type] || 0) + 1;
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;

      if (t.status === 'completed') {
        const amt = t.netAmount != null ? t.netAmount : t.amount;
        if (amt > 0) totalRevenue += amt;
        else totalExpenses += Math.abs(amt);
      }

      const key = fmt(t.timestamp);
      if (!timeBuckets[key]) timeBuckets[key] = { period: key, count: 0, revenue: 0, expenses: 0 };
      timeBuckets[key].count += 1;
      if (t.status === 'completed') {
        const amt = t.netAmount != null ? t.netAmount : t.amount;
        if (amt > 0) timeBuckets[key].revenue += amt;
        else timeBuckets[key].expenses += Math.abs(amt);
      }
    }

    const timeSeries = Object.values(timeBuckets).sort((a, b) => a.period.localeCompare(b.period));

    res.json({
      success: true,
      data: {
        summary: { totalRevenue, totalExpenses, netAmount: totalRevenue - totalExpenses, count: docs.length },
        byType,
        byStatus,
        timeSeries,
      },
    });
  } catch (error) {
    console.error('Error in getAnalytics (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/finance/transactions/:id
 * Single transaction by transactionId or _id.
 */
exports.getOne = async (req, res) => {
  try {
    const doc = await resolveTransaction(req.params.id, req.query);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    const d = doc.toObject ? doc.toObject() : doc;
    res.json({ success: true, data: toResponseDoc(d) });
  } catch (error) {
    console.error('Error in getOne (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/finance/transactions/:id/receipt
 * Receipt data for download/print. Returns structured receipt object.
 */
exports.getReceipt = async (req, res) => {
  try {
    const doc = await resolveTransaction(req.params.id, req.query);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    const d = doc.toObject ? doc.toObject() : doc;
    const t = toResponseDoc(d);
    const receipt = {
      transactionId: t.id,
      reference: t.reference,
      date: t.timestamp,
      type: t.type,
      entity: t.entity,
      description: t.description,
      amount: t.amount,
      currency: t.currency,
      fees: t.fees,
      netAmount: t.netAmount,
      status: t.status,
      paymentMethod: t.paymentMethod,
    };
    res.json({ success: true, data: { receipt } });
  } catch (error) {
    console.error('Error in getReceipt (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/finance/transactions/:id/invoice
 * Invoice data when transaction has invoiceId. 404 if no invoiceId.
 */
exports.getInvoice = async (req, res) => {
  try {
    const doc = await resolveTransaction(req.params.id, req.query);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    const d = doc.toObject ? doc.toObject() : doc;
    if (!d.invoiceId) {
      return res.status(404).json({ success: false, message: 'No invoice for this transaction' });
    }
    const t = toResponseDoc(d);
    const invoice = {
      invoiceId: t.invoiceId,
      transactionId: t.id,
      reference: t.reference,
      date: t.timestamp,
      entity: t.entity,
      description: t.description,
      amount: t.amount,
      currency: t.currency,
      fees: t.fees,
      netAmount: t.netAmount,
      status: t.status,
    };
    res.json({ success: true, data: { invoice } });
  } catch (error) {
    console.error('Error in getInvoice (admin/finance/transactions):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message,
    });
  }
};
