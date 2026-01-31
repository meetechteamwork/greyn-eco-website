'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import NgoTopbar from '../components/NgoTopbar';
import Footer from '../../components/Footer';
import { api } from '../../../utils/api';

interface Transaction {
  id: string;
  type: 'donation' | 'withdrawal' | 'project_funding' | 'revenue' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  projectName?: string;
  donorName?: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  requestedAt: string;
  status: 'pending_approval' | 'approved' | 'processing' | 'completed' | 'rejected';
  approvedAt?: string;
  availableAt?: string;
  rejectedReason?: string;
  bankAccount?: string;
}

interface WalletData {
  wallet: {
    balance: number;
    availableBalance: number;
    pendingWithdrawals: number;
    totalDonations: number;
    totalRevenue: number;
  };
  withdrawalRequests: WithdrawalRequest[];
  transactions: Transaction[];
}

const NgoWalletPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.ngo.wallet.get();
      if (response.success && response.data) {
        setWalletData(response.data);
      } else {
        setError(response.message || 'Failed to load wallet data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || !bankAccount.trim()) {
      setError('Please enter a valid amount and bank account number.');
      return;
    }

    if (!walletData || amount > walletData.wallet.availableBalance) {
      setError('Insufficient balance. Please enter an amount within your available balance.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await api.ngo.wallet.withdraw({ amount, bankAccount });
      if (response.success) {
        setWithdrawAmount('');
        setBankAccount('');
        setShowWithdraw(false);
        // Reload wallet data
        await loadWalletData();
      } else {
        setError(response.message || 'Failed to submit withdrawal request');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    setError(null);
    try {
      await api.ngo.wallet.exportReport('csv');
      // Download will trigger automatically
    } catch (err: any) {
      setError(err.message || 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const getWithdrawalStatusBadge = (request: WithdrawalRequest) => {
    switch (request.status) {
      case 'pending_approval':
        return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⏳ Pending Approval</span>;
      case 'approved':
        const approvedDate = request.approvedAt ? new Date(request.approvedAt) : null;
        const availableDate = request.availableAt ? new Date(request.availableAt) : null;
        const now = new Date();
        const hoursRemaining = availableDate && now < availableDate 
          ? Math.ceil((availableDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          : 0;
        
        if (availableDate && now < availableDate) {
          return <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">✅ Approved - Available in {hoursRemaining}h</span>;
        } else {
          return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">✅ Processing</span>;
        }
      case 'processing':
        return <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">🔄 Processing</span>;
      case 'completed':
        return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">✓ Completed</span>;
      case 'rejected':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">✗ Rejected</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
            <svg className="h-6 w-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-rose-100">
            <svg className="h-6 w-6 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20 12H4"></path>
            </svg>
          </div>
        );
      case 'project_funding':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'revenue':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
            <svg className="h-6 w-6 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'refund':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100">
            <svg className="h-6 w-6 text-orange-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">✓ Completed</span>;
      case 'pending':
        return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⏳ Pending</span>;
      case 'processing':
        return <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">🔄 Processing</span>;
      case 'failed':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">✗ Failed</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ngo']}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <NgoTopbar />
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading wallet information...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !walletData) {
    return (
      <ProtectedRoute allowedRoles={['ngo']}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <NgoTopbar />
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadWalletData}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!walletData) return null;

  const { wallet, withdrawalRequests, transactions } = walletData;

  return (
    <ProtectedRoute allowedRoles={['ngo']}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <NgoTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-gray-900">
                NGO Wallet
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Manage your organization's funds, donations, and project financing
              </p>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Balance Cards Grid */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Total Balance */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="relative">
                  <p className="mb-2 text-sm font-medium text-green-100">Total Balance</p>
                  <p className="text-3xl sm:text-4xl font-bold">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="mt-2 text-xs text-green-100">All funds</p>
                </div>
              </div>

              {/* Available Balance */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <p className="mb-2 text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mt-2 text-xs text-gray-500">Ready to use</p>
              </div>

              {/* Total Donations */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <p className="mb-2 text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-600">${wallet.totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mt-2 text-xs text-gray-500">All time</p>
              </div>

              {/* Pending Withdrawals */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <p className="mb-2 text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl sm:text-4xl font-bold text-yellow-600">${wallet.pendingWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mt-2 text-xs text-gray-500">Awaiting approval</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowWithdraw(true)}
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M20 12H4"></path>
                </svg>
                Withdraw Funds
              </button>

              <button
                onClick={handleExportReport}
                disabled={exporting}
                className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Generate Report
                  </>
                )}
              </button>
            </div>

            {/* Withdraw Modal */}
            {showWithdraw && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Withdraw Funds</h3>
                    <button
                      onClick={() => {
                        setShowWithdraw(false);
                        setWithdrawAmount('');
                        setBankAccount('');
                        setError(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={submitting}
                    >
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4 rounded-lg bg-blue-50 p-4 border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Available Balance:</span> ${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={wallet.availableBalance}
                      step="0.01"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg transition-colors focus:border-red-500 focus:outline-none"
                      disabled={submitting}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Enter bank account number"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg transition-colors focus:border-red-500 focus:outline-none"
                      disabled={submitting}
                    />
                  </div>

                  <div className="mb-6 rounded-lg bg-yellow-50 p-4 border border-yellow-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Note:</span> Withdrawal requests require admin approval. 
                      After approval, funds will be available for withdrawal after 24 hours.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowWithdraw(false);
                        setWithdrawAmount('');
                        setBankAccount('');
                        setError(null);
                      }}
                      className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleWithdraw}
                      className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawal Requests */}
            {withdrawalRequests.length > 0 && (
              <div className="mb-8 rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Withdrawal Requests</h2>
                </div>

                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <p className="text-lg font-bold text-gray-900">${request.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            {getWithdrawalStatusBadge(request)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>Requested: {formatDate(request.requestedAt)}</span>
                            {request.bankAccount && (
                              <span>Account: {request.bankAccount}</span>
                            )}
                            {request.approvedAt && (
                              <span>Approved: {formatDate(request.approvedAt)}</span>
                            )}
                            {request.availableAt && request.status === 'approved' && (
                              <span className="font-semibold text-blue-600">
                                Available: {formatDate(request.availableAt)}
                              </span>
                            )}
                          </div>
                          {request.rejectedReason && (
                            <p className="mt-2 text-sm text-red-600">
                              <span className="font-semibold">Reason:</span> {request.rejectedReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transaction History</h2>
                <button 
                  onClick={() => loadWalletData()}
                  className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.description}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                            {getStatusBadge(transaction.status)}
                            {transaction.projectName && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {transaction.projectName}
                              </span>
                            )}
                            {transaction.donorName && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                {transaction.donorName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className={`text-lg font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs capitalize text-gray-500">{transaction.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default NgoWalletPage;
