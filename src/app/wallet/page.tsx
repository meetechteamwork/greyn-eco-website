'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const WalletPage: React.FC = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  // Placeholder data
  const walletBalance = 2847.50;
  const pendingInvestments = 500;
  const availableBalance = walletBalance - pendingInvestments;

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 5000,
      description: 'Bank transfer deposit',
      date: '2025-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'investment',
      amount: -1000,
      description: 'Amazon Rainforest Reforestation',
      date: '2025-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'investment',
      amount: -2500,
      description: 'Solar Energy Farm - California',
      date: '2025-01-12',
      status: 'completed'
    },
    {
      id: '4',
      type: 'return',
      amount: 125,
      description: 'Return from Amazon Reforestation',
      date: '2025-01-10',
      status: 'completed'
    },
    {
      id: '5',
      type: 'investment',
      amount: -1500,
      description: 'Wind Power Initiative - Texas',
      date: '2025-01-08',
      status: 'completed'
    },
    {
      id: '6',
      type: 'investment',
      amount: -500,
      description: 'Electric Vehicle Charging Network',
      date: '2025-01-05',
      status: 'pending'
    },
    {
      id: '7',
      type: 'return',
      amount: 375,
      description: 'Return from Solar Energy Farm',
      date: '2025-01-03',
      status: 'completed'
    },
    {
      id: '8',
      type: 'deposit',
      amount: 2000,
      description: 'Credit card deposit',
      date: '2025-01-01',
      status: 'completed'
    }
  ];

  const handleAddFunds = useCallback(() => {
    if (parseFloat(addAmount) > 0) {
      alert(`$${addAmount} will be added to your wallet. Redirecting to payment gateway...`);
      setAddAmount('');
      setShowAddFunds(false);
    }
  }, [addAmount]);

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
              disabled
              className="flex items-center justify-center gap-3 rounded-xl bg-gray-200 px-8 py-6 text-lg font-semibold text-gray-400 cursor-not-allowed"
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
              Withdraw (Coming Soon)
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
                    <span className="font-semibold">Note:</span> This is a demo interface. 
                    No real transactions will be processed.
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

          {/* Transaction History */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                View All
              </button>
            </div>

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
                    <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs capitalize text-gray-500">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
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

export default WalletPage;

