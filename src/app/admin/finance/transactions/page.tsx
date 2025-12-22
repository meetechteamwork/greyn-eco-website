'use client';

import React, { useState, useMemo } from 'react';

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

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock transactions data
  const allTransactions: Transaction[] = [
    {
      id: 'TXN-2024-001',
      timestamp: '2024-03-25T14:30:00Z',
      type: 'purchase',
      amount: 12500.00,
      currency: 'USD',
      entity: 'TechCorp Industries',
      description: 'Carbon credit purchase - 500 credits @ $25/tonne',
      status: 'completed',
      reference: 'REF-789456',
      paymentMethod: 'credit_card',
      fees: 375.00,
      netAmount: 12125.00,
      invoiceId: 'INV-2024-001',
    },
    {
      id: 'TXN-2024-002',
      timestamp: '2024-03-25T13:15:00Z',
      type: 'commission',
      amount: 625.00,
      currency: 'USD',
      entity: 'Platform Commission',
      description: 'Commission from TechCorp purchase (5%)',
      status: 'completed',
      reference: 'REF-789455',
      paymentMethod: 'wallet',
    },
    {
      id: 'TXN-2024-003',
      timestamp: '2024-03-25T11:45:00Z',
      type: 'purchase',
      amount: 8500.00,
      currency: 'USD',
      entity: 'GreenEnergy Solutions',
      description: 'Carbon credit purchase - 340 credits @ $25/tonne',
      status: 'completed',
      reference: 'REF-789444',
      paymentMethod: 'bank_transfer',
      fees: 255.00,
      netAmount: 8245.00,
      invoiceId: 'INV-2024-002',
    },
    {
      id: 'TXN-2024-004',
      timestamp: '2024-03-25T10:20:00Z',
      type: 'sale',
      amount: 25000.00,
      currency: 'USD',
      entity: 'EcoFinance Group',
      description: 'Corporate ESG subscription - Annual plan',
      status: 'completed',
      reference: 'REF-789433',
      paymentMethod: 'bank_transfer',
      fees: 0,
      netAmount: 25000.00,
      invoiceId: 'INV-2024-003',
    },
    {
      id: 'TXN-2024-005',
      timestamp: '2024-03-25T09:10:00Z',
      type: 'purchase',
      amount: 3200.00,
      currency: 'USD',
      entity: 'Sarah Johnson',
      description: 'Individual carbon credit purchase - 128 credits',
      status: 'pending',
      reference: 'REF-789422',
      paymentMethod: 'credit_card',
      fees: 96.00,
      netAmount: 3104.00,
    },
    {
      id: 'TXN-2024-006',
      timestamp: '2024-03-24T16:30:00Z',
      type: 'fee',
      amount: 150.00,
      currency: 'USD',
      entity: 'Transaction Fee',
      description: 'Platform transaction processing fee',
      status: 'completed',
      reference: 'REF-789411',
      paymentMethod: 'wallet',
    },
    {
      id: 'TXN-2024-007',
      timestamp: '2024-03-24T14:00:00Z',
      type: 'refund',
      amount: -1200.00,
      currency: 'USD',
      entity: 'Refund Processing',
      description: 'Refund for failed transaction TXN-2024-008',
      status: 'completed',
      reference: 'REF-789400',
      paymentMethod: 'credit_card',
    },
    {
      id: 'TXN-2024-008',
      timestamp: '2024-03-24T12:30:00Z',
      type: 'purchase',
      amount: 1200.00,
      currency: 'USD',
      entity: 'John Doe',
      description: 'Carbon credit purchase - 48 credits',
      status: 'failed',
      reference: 'REF-789399',
      paymentMethod: 'credit_card',
    },
    {
      id: 'TXN-2024-009',
      timestamp: '2024-03-24T10:15:00Z',
      type: 'withdrawal',
      amount: -5000.00,
      currency: 'USD',
      entity: 'NGO Green Earth',
      description: 'Fund withdrawal to bank account',
      status: 'processing',
      reference: 'REF-789388',
      paymentMethod: 'bank_transfer',
      fees: 25.00,
      netAmount: -4975.00,
    },
    {
      id: 'TXN-2024-010',
      timestamp: '2024-03-23T18:00:00Z',
      type: 'deposit',
      amount: 15000.00,
      currency: 'USD',
      entity: 'Corporate Buyer Inc',
      description: 'Account deposit for future purchases',
      status: 'completed',
      reference: 'REF-789377',
      paymentMethod: 'bank_transfer',
      fees: 0,
      netAmount: 15000.00,
    },
    {
      id: 'TXN-2024-011',
      timestamp: '2024-03-23T15:45:00Z',
      type: 'purchase',
      amount: 6750.00,
      currency: 'USD',
      entity: 'Sustainable Corp',
      description: 'Carbon credit purchase - 270 credits @ $25/tonne',
      status: 'completed',
      reference: 'REF-789366',
      paymentMethod: 'crypto',
      fees: 202.50,
      netAmount: 6547.50,
      invoiceId: 'INV-2024-004',
    },
    {
      id: 'TXN-2024-012',
      timestamp: '2024-03-23T13:20:00Z',
      type: 'commission',
      amount: 337.50,
      currency: 'USD',
      entity: 'Platform Commission',
      description: 'Commission from Sustainable Corp purchase (5%)',
      status: 'completed',
      reference: 'REF-789355',
      paymentMethod: 'wallet',
    },
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      // Date range filter (simplified)
      let matchesDate = true;
      if (dateRange !== 'all') {
        const transactionDate = new Date(transaction.timestamp);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRange === 'today' && daysDiff > 0) matchesDate = false;
        if (dateRange === 'week' && daysDiff > 7) matchesDate = false;
        if (dateRange === 'month' && daysDiff > 30) matchesDate = false;
        if (dateRange === 'year' && daysDiff > 365) matchesDate = false;
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [searchQuery, statusFilter, typeFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Calculate stats
  const stats = useMemo(() => {
    const completed = filteredTransactions.filter((t) => t.status === 'completed');
    const totalRevenue = completed
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + (t.netAmount || t.amount), 0);
    const totalExpenses = completed
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.netAmount || t.amount), 0);
    const totalFees = completed.reduce((sum, t) => sum + (t.fees || 0), 0);
    const pendingAmount = filteredTransactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + (t.netAmount || t.amount), 0);

    return {
      total: filteredTransactions.length,
      completed: completed.length,
      pending: filteredTransactions.filter((t) => t.status === 'pending').length,
      failed: filteredTransactions.filter((t) => t.status === 'failed').length,
      totalRevenue,
      totalExpenses,
      totalFees,
      netAmount: totalRevenue - totalExpenses,
      pendingAmount,
    };
  }, [filteredTransactions]);

  const getStatusColor = (status: TransactionStatus) => {
    const colors = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      refunded: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      processing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    };
    return colors[status];
  };

  const getTypeColor = (type: TransactionType) => {
    const colors = {
      purchase: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      sale: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      refund: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      fee: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      commission: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      withdrawal: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      deposit: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    };
    return colors[type];
  };

  const getTypeIcon = (type: TransactionType) => {
    const icons = {
      purchase: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      sale: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      refund: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      ),
      fee: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      commission: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      withdrawal: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      ),
      deposit: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
        </svg>
      ),
    };
    return icons[type];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    const labels = {
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      crypto: 'Cryptocurrency',
      wallet: 'Platform Wallet',
      other: 'Other',
    };
    return method ? labels[method] : 'N/A';
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Transactions
                </h1>
                <p className="text-lg text-slate-400">Complete financial transaction history and analytics</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export
                  </div>
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Analytics
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-400 mb-1">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-slate-400">Total Revenue</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-red-400 mb-1">{formatCurrency(stats.totalExpenses)}</p>
              <p className="text-sm text-slate-400">Total Expenses</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 7h6m0 10v-5m-6 5v-5m6 5h-2M9 17H7m2 0v-5M7 12V7m2 5h6m-6-5h2m6 5v5m0-5h2"></path>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-400 mb-1">{formatCurrency(stats.netAmount)}</p>
              <p className="text-sm text-slate-400">Net Amount</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-400 mb-1">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-sm text-slate-400">Pending Amount</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-400 mb-1">Completed</p>
              <p className="text-xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-400 mb-1">Pending</p>
              <p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-400 mb-1">Total Fees</p>
              <p className="text-xl font-bold text-purple-400">{formatCurrency(stats.totalFees)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID, entity, reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="refund">Refund</option>
                  <option value="fee">Fee</option>
                  <option value="commission">Commission</option>
                </select>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Transaction History ({filteredTransactions.length})</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
                </div>
              </div>
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
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="text-lg font-semibold text-slate-400">No transactions found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-white">{transaction.id}</p>
                            <p className="text-xs text-slate-400 mt-1">{transaction.description}</p>
                            <code className="text-xs text-slate-500 font-mono mt-1">{transaction.reference}</code>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-300">{transaction.entity}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded-lg ${getTypeColor(transaction.type)}`}>
                              {getTypeIcon(transaction.type)}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`text-sm font-bold ${transaction.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                            {transaction.fees && transaction.fees > 0 && (
                              <p className="text-xs text-slate-500 mt-1">Fees: {formatCurrency(transaction.fees)}</p>
                            )}
                            {transaction.netAmount !== undefined && transaction.netAmount !== transaction.amount && (
                              <p className="text-xs text-slate-400 mt-1">Net: {formatCurrency(transaction.netAmount, transaction.currency)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-300">{formatDate(transaction.timestamp)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(transaction)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : 'text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Transaction Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Transaction ID</p>
                  <p className="text-lg font-semibold text-white">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Reference</p>
                  <code className="text-sm font-mono text-slate-300">{selectedTransaction.reference}</code>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Type</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                  </span>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Amount Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gross Amount</span>
                    <span className={`font-bold ${selectedTransaction.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedTransaction.amount >= 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </span>
                  </div>
                  {selectedTransaction.fees !== undefined && selectedTransaction.fees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fees</span>
                      <span className="text-red-400 font-semibold">-{formatCurrency(selectedTransaction.fees, selectedTransaction.currency)}</span>
                    </div>
                  )}
                  {selectedTransaction.netAmount !== undefined && (
                    <div className="flex justify-between pt-3 border-t border-slate-700">
                      <span className="text-white font-semibold">Net Amount</span>
                      <span className={`font-bold text-lg ${selectedTransaction.netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selectedTransaction.netAmount >= 0 ? '+' : ''}{formatCurrency(selectedTransaction.netAmount, selectedTransaction.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Entity & Description */}
              <div>
                <p className="text-sm text-slate-400 mb-1">Entity</p>
                <p className="text-lg font-semibold text-white">{selectedTransaction.entity}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Description</p>
                <p className="text-white">{selectedTransaction.description}</p>
              </div>

              {/* Payment Method */}
              {selectedTransaction.paymentMethod && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Payment Method</p>
                  <p className="text-white">{getPaymentMethodLabel(selectedTransaction.paymentMethod)}</p>
                </div>
              )}

              {/* Invoice */}
              {selectedTransaction.invoiceId && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Invoice ID</p>
                  <code className="text-sm font-mono text-slate-300">{selectedTransaction.invoiceId}</code>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Transaction Date</p>
                  <p className="text-white">{formatDate(selectedTransaction.timestamp)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                  Download Receipt
                </button>
                {selectedTransaction.invoiceId && (
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                    View Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

