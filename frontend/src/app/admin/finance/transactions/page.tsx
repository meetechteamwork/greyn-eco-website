'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';

type TransactionType = 'purchase' | 'sale' | 'refund' | 'fee' | 'commission' | 'withdrawal' | 'deposit';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'processing';
type PaymentMethod = 'credit_card' | 'bank_transfer' | 'crypto' | 'wallet' | 'other';

interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  amount: number;
  currency: string;
  entity: string;
  description: string;
  status: TransactionStatus;
  reference: string;
  paymentMethod?: PaymentMethod;
  fees?: number;
  netAmount?: number;
  invoiceId?: string;
}

interface TxStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalRevenue: number;
  totalExpenses: number;
  totalFees: number;
  netAmount: number;
  pendingAmount: number;
}

function downloadJson(obj: object, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

const getStatusColor = (s: TransactionStatus) => ({
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
  refunded: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  processing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
}[s]);

const getTypeColor = (t: TransactionType) => ({
  purchase: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  sale: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  refund: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  fee: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  commission: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  withdrawal: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  deposit: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
}[t]);

const TYPE_ICONS: Record<TransactionType, React.ReactElement> = {
  purchase: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  sale: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  refund: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  fee: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  commission: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  withdrawal: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  deposit: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>,
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Credit Card', bank_transfer: 'Bank Transfer', crypto: 'Cryptocurrency', wallet: 'Platform Wallet', other: 'Other',
};

const formatDate = (s: string) => new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatCurrency = (n: number, c = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: c, minimumFractionDigits: 2 }).format(n);

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TxStats>({ total: 0, completed: 0, pending: 0, failed: 0, totalRevenue: 0, totalExpenses: 0, totalFees: 0, netAmount: 0, pendingAmount: 0 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{ summary: { totalRevenue: number; totalExpenses: number; netAmount: number; count: number }; byType: Record<string, number>; byStatus: Record<string, number>; timeSeries: { period: string; count: number; revenue: number; expenses: number }[] } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.admin.finance.transactions.getList({
      search: searchQuery || undefined,
      status: statusFilter,
      type: typeFilter,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
      page: currentPage,
      limit: itemsPerPage,
      includeSeed: '1',
    });
    setLoading(false);
    if (res.success && res.data) {
      const d = res.data as { transactions?: Transaction[]; stats?: TxStats; pagination?: { total: number; totalPages: number } };
      const def: TxStats = { total: 0, completed: 0, pending: 0, failed: 0, totalRevenue: 0, totalExpenses: 0, totalFees: 0, netAmount: 0, pendingAmount: 0 };
      setTransactions(d.transactions ?? []);
      setStats(d.stats ?? def);
      setPagination(d.pagination ?? { total: 0, totalPages: 1 });
    } else {
      setError(res.message || 'Failed to load transactions');
    }
  }, [searchQuery, statusFilter, typeFilter, dateRange, currentPage, itemsPerPage]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleExport = async () => {
    setExportLoading(true);
    setError(null);
    try {
      await api.admin.finance.transactions.exportDownload({
        search: searchQuery || undefined,
        status: statusFilter,
        type: typeFilter,
        dateRange: dateRange !== 'all' ? dateRange : undefined,
        includeSeed: '1',
      }, 'csv');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleAnalytics = async () => {
    setShowAnalyticsModal(true);
    setAnalyticsLoading(true);
    setError(null);
    const res = await api.admin.finance.transactions.getAnalytics({
      dateRange: dateRange !== 'all' ? dateRange : undefined,
      groupBy: 'day',
      includeSeed: '1',
    });
    setAnalyticsLoading(false);
    if (res.success && res.data) setAnalyticsData(res.data as typeof analyticsData);
    else setError(res.message || 'Failed to load analytics');
  };

  const handleDownloadReceipt = async () => {
    if (!selectedTransaction) return;
    setActionLoading('receipt');
    setError(null);
    const res = await api.admin.finance.transactions.getReceipt(selectedTransaction.id);
    setActionLoading(null);
    if (res.success && res.data && (res.data as { receipt?: object }).receipt)
      downloadJson((res.data as { receipt: object }).receipt, `receipt-${selectedTransaction.id}.json`);
    else setError(res.message || 'Failed to load receipt');
  };

  const handleDownloadInvoice = async () => {
    if (!selectedTransaction?.invoiceId) return;
    setActionLoading('invoice');
    setError(null);
    const res = await api.admin.finance.transactions.getInvoice(selectedTransaction.id);
    setActionLoading(null);
    if (res.success && res.data && (res.data as { invoice?: object }).invoice)
      downloadJson((res.data as { invoice: object }).invoice, `invoice-${selectedTransaction.invoiceId}.json`);
    else setError(res.message || 'Failed to load invoice');
  };

  const handleDownloadAnalyticsReport = () => {
    if (analyticsData) downloadJson(analyticsData, `analytics-report-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const totalPages = pagination.totalPages || 1;

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-200 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">×</button>
            </div>
          )}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Transactions</h1>
                <p className="text-lg text-slate-400">Complete financial transaction history and analytics</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">{exportLoading ? '...' : (<><svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Export CSV</>)}</span>
                </button>
                <button
                  onClick={handleAnalytics}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105"
                >
                  <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>Analytics</span>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6"><p className="text-2xl font-bold text-emerald-400 mb-1">{formatCurrency(stats.totalRevenue)}</p><p className="text-sm text-slate-400">Total Revenue</p></div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6"><p className="text-2xl font-bold text-red-400 mb-1">{formatCurrency(stats.totalExpenses)}</p><p className="text-sm text-slate-400">Total Expenses</p></div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6"><p className="text-2xl font-bold text-blue-400 mb-1">{formatCurrency(stats.netAmount)}</p><p className="text-sm text-slate-400">Net Amount</p></div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6"><p className="text-2xl font-bold text-yellow-400 mb-1">{formatCurrency(stats.pendingAmount)}</p><p className="text-sm text-slate-400">Pending Amount</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4"><p className="text-sm text-slate-400 mb-1">Total Transactions</p><p className="text-xl font-bold text-white">{stats.total}</p></div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4"><p className="text-sm text-slate-400 mb-1">Completed</p><p className="text-xl font-bold text-green-400">{stats.completed}</p></div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4"><p className="text-sm text-slate-400 mb-1">Pending</p><p className="text-xl font-bold text-yellow-400">{stats.pending}</p></div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4"><p className="text-sm text-slate-400 mb-1">Total Fees</p><p className="text-xl font-bold text-purple-400">{formatCurrency(stats.totalFees)}</p></div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                  <input type="text" placeholder="Search by ID, entity, reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option><option value="sale">Sale</option><option value="deposit">Deposit</option><option value="withdrawal">Withdrawal</option><option value="refund">Refund</option><option value="fee">Fee</option><option value="commission">Commission</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="all">All Time</option><option value="today">Today</option><option value="week">Last 7 Days</option><option value="month">Last 30 Days</option><option value="year">Last Year</option>
              </select>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Transaction History ({pagination.total})</h2>
              <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Transaction</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Entity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center"><p className="text-slate-400">No transactions found. Run <code className="text-xs bg-slate-700 px-1 rounded">npm run seed:finance-transactions</code> in backend and use includeSeed.</p></td></tr>
                  ) : transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-white">{t.id}</p><p className="text-xs text-slate-400">{t.description}</p><code className="text-xs text-slate-500">{t.reference}</code></td>
                      <td className="px-6 py-4 text-slate-300">{t.entity}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-2"><span className={`p-1.5 rounded-lg ${getTypeColor(t.type)}`}>{TYPE_ICONS[t.type]}</span><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(t.type)}`}>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span></div></td>
                      <td className="px-6 py-4"><p className={`text-sm font-bold ${t.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{(t.amount >= 0 ? '+' : '') + formatCurrency(t.amount, t.currency)}</p>{t.fees != null && t.fees > 0 && <p className="text-xs text-slate-500">Fees: {formatCurrency(t.fees)}</p>}{t.netAmount != null && t.netAmount !== t.amount && <p className="text-xs text-slate-400">Net: {formatCurrency(t.netAmount, t.currency)}</p>}</td>
                      <td className="px-6 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(t.status)}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(t.timestamp)}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setSelectedTransaction(t); setShowDetailsModal(true); }} className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg" title="View Details">
                          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex items-center justify-between">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 rounded-lg disabled:opacity-50">Previous</button>
                <div className="flex gap-2">{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${currentPage === p ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 'text-slate-300 bg-slate-700 hover:text-white'}`}>{p}</button>)}</div>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 rounded-lg disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-6"><h3 className="text-2xl font-bold text-white">Transaction Details</h3><button onClick={() => setShowDetailsModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">×</button></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><p className="text-sm text-slate-400 mb-1">Transaction ID</p><p className="text-lg font-semibold text-white">{selectedTransaction.id}</p></div>
              <div><p className="text-sm text-slate-400 mb-1">Reference</p><code className="text-sm font-mono text-slate-300">{selectedTransaction.reference}</code></div>
              <div><p className="text-sm text-slate-400 mb-1">Status</p><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTransaction.status)}`}>{selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}</span></div>
              <div><p className="text-sm text-slate-400 mb-1">Type</p><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedTransaction.type)}`}>{selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}</span></div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Amount Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-400">Gross Amount</span><span className={`font-bold ${selectedTransaction.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{(selectedTransaction.amount >= 0 ? '+' : '') + formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</span></div>
                {selectedTransaction.fees != null && selectedTransaction.fees > 0 && <div className="flex justify-between"><span className="text-slate-400">Fees</span><span className="text-red-400 font-semibold">-{formatCurrency(selectedTransaction.fees, selectedTransaction.currency)}</span></div>}
                {selectedTransaction.netAmount != null && <div className="flex justify-between pt-3 border-t border-slate-700"><span className="text-white font-semibold">Net Amount</span><span className={`text-lg font-bold ${selectedTransaction.netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{(selectedTransaction.netAmount >= 0 ? '+' : '') + formatCurrency(selectedTransaction.netAmount, selectedTransaction.currency)}</span></div>}
              </div>
            </div>
            <div className="mb-6"><p className="text-sm text-slate-400 mb-1">Entity</p><p className="text-lg font-semibold text-white">{selectedTransaction.entity}</p></div>
            <div className="mb-6"><p className="text-sm text-slate-400 mb-1">Description</p><p className="text-white">{selectedTransaction.description}</p></div>
            {selectedTransaction.paymentMethod && <div className="mb-6"><p className="text-sm text-slate-400 mb-1">Payment Method</p><p className="text-white">{PAYMENT_LABELS[selectedTransaction.paymentMethod] ?? selectedTransaction.paymentMethod}</p></div>}
            {selectedTransaction.invoiceId && <div className="mb-6"><p className="text-sm text-slate-400 mb-1">Invoice ID</p><code className="text-sm font-mono text-slate-300">{selectedTransaction.invoiceId}</code></div>}
            <div className="mb-6"><p className="text-sm text-slate-400 mb-1">Transaction Date</p><p className="text-white">{formatDate(selectedTransaction.timestamp)}</p></div>
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button onClick={handleDownloadReceipt} disabled={!!actionLoading} className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 disabled:opacity-50">{actionLoading === 'receipt' ? '...' : 'Download Receipt'}</button>
              {selectedTransaction.invoiceId && <button onClick={handleDownloadInvoice} disabled={!!actionLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50">{actionLoading === 'invoice' ? '...' : 'Download Invoice'}</button>}
            </div>
          </div>
        </div>
      )}

      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAnalyticsModal(false)}>
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-6"><h3 className="text-2xl font-bold text-white">Analytics</h3><button onClick={() => setShowAnalyticsModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">×</button></div>
            {analyticsLoading ? <p className="text-slate-400">Loading...</p> : analyticsData ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 rounded-lg p-4"><p className="text-slate-400 text-sm">Revenue</p><p className="text-emerald-400 font-bold">{formatCurrency(analyticsData.summary.totalRevenue)}</p></div>
                  <div className="bg-slate-900/50 rounded-lg p-4"><p className="text-slate-400 text-sm">Expenses</p><p className="text-red-400 font-bold">{formatCurrency(analyticsData.summary.totalExpenses)}</p></div>
                  <div className="bg-slate-900/50 rounded-lg p-4"><p className="text-slate-400 text-sm">Net</p><p className="text-blue-400 font-bold">{formatCurrency(analyticsData.summary.netAmount)}</p></div>
                  <div className="bg-slate-900/50 rounded-lg p-4"><p className="text-slate-400 text-sm">Count</p><p className="text-white font-bold">{analyticsData.summary.count}</p></div>
                </div>
                <div className="mb-6"><h4 className="text-white font-semibold mb-2">By Type</h4><pre className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded overflow-auto">{JSON.stringify(analyticsData.byType, null, 2)}</pre></div>
                <div className="mb-6"><h4 className="text-white font-semibold mb-2">By Status</h4><pre className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded overflow-auto">{JSON.stringify(analyticsData.byStatus, null, 2)}</pre></div>
                <div className="flex justify-end"><button onClick={handleDownloadAnalyticsReport} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold">Download Report</button></div>
              </>
            ) : <p className="text-slate-400">No analytics data.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
