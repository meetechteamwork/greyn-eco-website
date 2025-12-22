'use client';

import React, { useState } from 'react';

type TransactionType = 'purchase' | 'sale' | 'refund' | 'fee' | 'commission';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

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
}

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: 'TXN-2024-001',
      timestamp: '2024-03-25T10:30:00Z',
      type: 'purchase',
      amount: 12500.00,
      currency: 'USD',
      entity: 'TechCorp Industries',
      description: 'Carbon credit purchase - 500 credits',
      status: 'completed',
      reference: 'REF-789456',
    },
    {
      id: 'TXN-2024-002',
      timestamp: '2024-03-25T09:15:00Z',
      type: 'commission',
      amount: 625.00,
      currency: 'USD',
      entity: 'Platform Commission',
      description: 'Commission from TechCorp purchase',
      status: 'completed',
      reference: 'REF-789455',
    },
    {
      id: 'TXN-2024-003',
      timestamp: '2024-03-24T16:45:00Z',
      type: 'purchase',
      amount: 8500.00,
      currency: 'USD',
      entity: 'GreenEnergy Solutions',
      description: 'Carbon credit purchase - 340 credits',
      status: 'completed',
      reference: 'REF-789444',
    },
    {
      id: 'TXN-2024-004',
      timestamp: '2024-03-24T14:20:00Z',
      type: 'sale',
      amount: 25000.00,
      currency: 'USD',
      entity: 'EcoFinance Group',
      description: 'Corporate ESG subscription - Annual',
      status: 'completed',
      reference: 'REF-789433',
    },
    {
      id: 'TXN-2024-005',
      timestamp: '2024-03-24T11:10:00Z',
      type: 'purchase',
      amount: 3200.00,
      currency: 'USD',
      entity: 'Sarah Johnson',
      description: 'Individual carbon credit purchase - 128 credits',
      status: 'pending',
      reference: 'REF-789422',
    },
    {
      id: 'TXN-2024-006',
      timestamp: '2024-03-23T15:30:00Z',
      type: 'fee',
      amount: 150.00,
      currency: 'USD',
      entity: 'Transaction Fee',
      description: 'Platform transaction processing fee',
      status: 'completed',
      reference: 'REF-789411',
    },
    {
      id: 'TXN-2024-007',
      timestamp: '2024-03-23T13:00:00Z',
      type: 'refund',
      amount: -1200.00,
      currency: 'USD',
      entity: 'Refund Processing',
      description: 'Refund for failed transaction',
      status: 'completed',
      reference: 'REF-789400',
    },
    {
      id: 'TXN-2024-008',
      timestamp: '2024-03-22T10:00:00Z',
      type: 'purchase',
      amount: 15600.00,
      currency: 'USD',
      entity: 'Global Tech Solutions',
      description: 'Carbon credit purchase - 624 credits',
      status: 'completed',
      reference: 'REF-789389',
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    if (filterStatus === 'all') return true;
    return txn.status === filterStatus;
  });

  const revenueStats = {
    totalRevenue: 523400.00,
    thisMonth: 89200.00,
    lastMonth: 78100.00,
    totalTransactions: 1247,
    averageTransaction: 419.65,
    pendingAmount: 3200.00,
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    const colors = {
      purchase: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      sale: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      refund: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      fee: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      commission: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    };
    return colors[type];
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      refunded: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    };
    return styles[status];
  };

  const getTransactionIcon = (type: TransactionType) => {
    const icons = {
      purchase: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      ),
      sale: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      refund: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
        </svg>
      ),
      fee: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      commission: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    };
    return icons[type];
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                  Finance & Revenue
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-1">
                  Transaction management and revenue analytics
                </p>
              </div>
              <div className="flex gap-2">
                {(['today', 'week', 'month', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Summary Cards */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-blue-100">Total Revenue</p>
                <svg className="w-6 h-6 text-blue-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{formatCurrency(revenueStats.totalRevenue)}</p>
              <p className="text-sm text-blue-100">All-time revenue</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-green-100">This Month</p>
                <svg className="w-6 h-6 text-green-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{formatCurrency(revenueStats.thisMonth)}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-green-100">+14.2%</span>
                <span className="text-xs text-green-200">vs last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-purple-100">Transactions</p>
                <svg className="w-6 h-6 text-purple-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{revenueStats.totalTransactions.toLocaleString()}</p>
              <p className="text-sm text-purple-100">Total transactions</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-orange-100">Avg. Transaction</p>
                <svg className="w-6 h-6 text-orange-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{formatCurrency(revenueStats.averageTransaction)}</p>
              <p className="text-sm text-orange-100">Per transaction</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h2>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Transaction</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Entity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{transaction.id}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-mono">{transaction.reference}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction.type)}`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.entity}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{transaction.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-bold ${
                          transaction.amount >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(transaction.timestamp)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-500 dark:text-slate-400">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

