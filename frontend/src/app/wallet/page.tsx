'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { api } from '../../utils/api';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'approved' | 'processing';
  approvedAt?: string;
  availableAt?: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  requestedAt: string;
  status: 'pending_approval' | 'approved' | 'processing' | 'completed' | 'rejected';
  approvedAt?: string;
  availableAt?: string;
  rejectedReason?: string;
}

const WalletPageContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingInvestments, setPendingInvestments] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch wallet data from backend
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.wallet.get();

        if (!res.success || !res.data) {
          setError(res.message || 'Failed to load wallet');
          return;
        }

        const wallet = res.data.wallet || {};
        setWalletBalance(wallet.balance || 0);
        setAvailableBalance(wallet.availableBalance || 0);
        // Pending investments are calculated as balance - availableBalance - pendingWithdrawals
        const pending = Math.max(
          0,
          (wallet.balance || 0) -
            (wallet.availableBalance || 0) -
            (wallet.pendingWithdrawals || 0)
        );
        setPendingInvestments(pending);

        setWithdrawalRequests(res.data.withdrawalRequests || []);
        setTransactions(res.data.transactions || []);
      } catch (err: any) {
        console.error('Error loading wallet:', err);
        setError(err.message || 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleAddFunds = useCallback(async () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      try {
        const res = await api.wallet.addFunds({ amount });

        if (!res.success) {
          alert(`Failed to add funds: ${res.message || 'Unknown error'}`);
          return;
        }

        // Update local state with new wallet data
        if (res.data?.wallet) {
          setWalletBalance(res.data.wallet.balance || 0);
          setAvailableBalance(res.data.wallet.availableBalance || 0);
        }

        // Add new transaction to the list
        if (res.data?.transaction) {
          const newTransaction: Transaction = {
            id: res.data.transaction.id,
            type: res.data.transaction.type,
            amount: res.data.transaction.amount,
            description: res.data.transaction.description,
            date: new Date(res.data.transaction.date).toISOString().split('T')[0],
            status: res.data.transaction.status,
          };
          setTransactions((prev) => [newTransaction, ...prev]);
        }

        alert(`$${amount.toLocaleString()} added to your wallet successfully!`);
        setAddAmount('');
        setShowAddFunds(false);
      } catch (err: any) {
        console.error('Error adding funds:', err);
        alert(`Failed to add funds: ${err.message || 'Unknown error'}`);
      }
    }
  }, [addAmount]);

  const handleWithdraw = useCallback(async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= availableBalance && bankAccount.trim()) {
      try {
        const res = await api.wallet.withdraw({
          amount,
          bankAccount: bankAccount.trim(),
        });

        if (!res.success || !res.data) {
          alert(`Failed to submit withdrawal request: ${res.message || 'Unknown error'}`);
          return;
        }

        const newRequest: WithdrawalRequest = {
          id: res.data.id,
          amount: res.data.amount,
          requestedAt: res.data.requestedAt,
          status: res.data.status,
          approvedAt: res.data.approvedAt,
          availableAt: res.data.availableAt,
          rejectedReason: res.data.rejectedReason,
        };

        setWithdrawalRequests((prev) => [newRequest, ...prev]);
        alert(
          `Withdrawal request of $${amount.toLocaleString()} submitted. Waiting for admin approval.`
        );
        setWithdrawAmount('');
        setBankAccount('');
        setShowWithdraw(false);
      } catch (err: any) {
        console.error('Error submitting withdrawal:', err);
        alert(`Failed to submit withdrawal request: ${err.message || 'Unknown error'}`);
      }
    } else if (amount > availableBalance) {
      alert('Insufficient balance. Please enter an amount within your available balance.');
    } else if (!bankAccount.trim()) {
      alert('Please enter your bank account details.');
    }
  }, [withdrawAmount, bankAccount, availableBalance]);

  const getWithdrawalStatusBadge = (request: WithdrawalRequest) => {
    switch (request.status) {
      case 'pending_approval':
        return <span className="text-xs text-yellow-600 font-semibold">⏳ Pending Admin Approval</span>;
      case 'approved':
        const approvedDate = request.approvedAt ? new Date(request.approvedAt) : null;
        const availableDate = request.availableAt ? new Date(request.availableAt) : null;
        const now = new Date();
        const hoursRemaining = availableDate && now < availableDate 
          ? Math.ceil((availableDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          : 0;
        
        if (availableDate && now < availableDate) {
          return <span className="text-xs text-blue-600 font-semibold">✅ Approved - Available in {hoursRemaining}h</span>;
        } else {
          return <span className="text-xs text-green-600 font-semibold">✅ Processing</span>;
        }
      case 'processing':
        return <span className="text-xs text-blue-600 font-semibold">🔄 Processing</span>;
      case 'completed':
        return <span className="text-xs text-green-600 font-semibold">✓ Completed</span>;
      case 'rejected':
        return <span className="text-xs text-red-600 font-semibold">✗ Rejected</span>;
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
      case 'deposit':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20 12H4"></path>
            </svg>
          </div>
        );
      case 'investment':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        );
      case 'return':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
        return <span className="text-xs text-green-600">✓ Completed</span>;
      case 'pending':
        return <span className="text-xs text-yellow-600">⏳ Pending</span>;
      case 'failed':
        return <span className="text-xs text-red-600">✗ Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
              My Wallet
            </h1>
            <p className="text-lg text-gray-600">
              Manage your funds and track transactions
            </p>
          </div>

          {/* Balance Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Total Balance */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-2 text-sm font-medium text-green-100">Total Balance</p>
                <p className="text-4xl font-bold">${walletBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Available Balance */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <p className="mb-2 text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">${availableBalance.toLocaleString()}</p>
              <p className="mt-2 text-xs text-gray-500">Ready to invest</p>
            </div>

            {/* Pending */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <p className="mb-2 text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">${pendingInvestments.toLocaleString()}</p>
              <p className="mt-2 text-xs text-gray-500">Processing investments</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              onClick={() => setShowAddFunds(true)}
              className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Add Funds
            </button>

            <button
              onClick={() => setShowWithdraw(true)}
              className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <svg
                className="h-6 w-6"
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
          </div>

          {/* Add Funds Modal */}
          {showAddFunds && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Add Funds</h3>
                  <button
                    onClick={() => setShowAddFunds(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg transition-colors focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="mb-6 rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> Funds will be added to your wallet
                    instantly and can be used to invest in projects.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddFunds(false)}
                    className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFunds}
                    className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Modal */}
          {showWithdraw && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Withdraw Funds</h3>
                  <button
                    onClick={() => {
                      setShowWithdraw(false);
                      setWithdrawAmount('');
                      setBankAccount('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Available Balance:</span> ${availableBalance.toLocaleString()}
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
                    max={availableBalance}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg transition-colors focus:border-red-500 focus:outline-none"
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
                  />
                </div>

                <div className="mb-6 rounded-lg bg-yellow-50 p-4">
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
                    }}
                    className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawal Requests */}
          {withdrawalRequests.length > 0 && (
            <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h2>
              </div>

              <div className="space-y-4">
                {withdrawalRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <p className="text-lg font-bold text-gray-900">${request.amount.toLocaleString()}</p>
                          {getWithdrawalStatusBadge(request)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>Requested: {formatDate(request.requestedAt)}</span>
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
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              {transactions.length > 0 && (
                <button className="text-sm font-medium text-green-600 hover:text-green-700">
                  View All
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center">
                <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent" />
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-600 font-semibold">Failed to load wallet data</p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-700">No transactions yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Once you add funds or invest in projects, your history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}$
                        {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs capitalize text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-8">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Ready to Invest?</h3>
            <p className="mb-6 text-gray-700">
              Explore our curated selection of sustainable projects and start making an impact today.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
            >
              Browse Projects
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const WalletPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="simple-user">
      <WalletPageContent />
    </ProtectedRoute>
  );
};

export default WalletPage;

