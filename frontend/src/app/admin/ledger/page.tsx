'use client';

import React, { useState } from 'react';

type CreditStatus = 'issued' | 'verified' | 'sold' | 'retired';

interface CreditEntry {
  id: string;
  creditId: string;
  status: CreditStatus;
  projectName: string;
  quantity: number;
  timestamp: string;
  entity: string;
  hash: string;
  previousHash?: string;
  blockNumber: number;
}

export default function LedgerPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const creditEntries: CreditEntry[] = [
    {
      id: '1',
      creditId: 'CC-2024-001234',
      status: 'retired',
      projectName: 'Amazon Reforestation Project',
      quantity: 500,
      timestamp: '2024-03-25T10:00:00Z',
      entity: 'TechCorp Industries',
      hash: '0x4a7f3b2c1d9e8f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a',
      previousHash: '0x3a6e2a1b0c8d7e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f',
      blockNumber: 12456,
    },
    {
      id: '2',
      creditId: 'CC-2024-001233',
      status: 'sold',
      projectName: 'Solar Farm California',
      quantity: 340,
      timestamp: '2024-03-24T14:30:00Z',
      entity: 'GreenEnergy Solutions',
      hash: '0x3a6e2a1b0c8d7e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f',
      previousHash: '0x2a5d1a0b9c7d6e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      blockNumber: 12455,
    },
    {
      id: '3',
      creditId: 'CC-2024-001232',
      status: 'verified',
      projectName: 'Wind Power Texas',
      quantity: 128,
      timestamp: '2024-03-23T11:15:00Z',
      entity: 'Dr. Michael Chen',
      hash: '0x2a5d1a0b9c7d6e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      previousHash: '0x1a4c0a9b8c6d5e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f',
      blockNumber: 12454,
    },
    {
      id: '4',
      creditId: 'CC-2024-001231',
      status: 'issued',
      projectName: 'Ocean Cleanup Initiative',
      quantity: 624,
      timestamp: '2024-03-22T09:00:00Z',
      entity: 'Ocean Conservation NGO',
      hash: '0x1a4c0a9b8c6d5e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f',
      previousHash: '0x0a3b9a8b7c5d4e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      blockNumber: 12453,
    },
    {
      id: '5',
      creditId: 'CC-2024-001230',
      status: 'retired',
      projectName: 'Amazon Reforestation Project',
      quantity: 200,
      timestamp: '2024-03-21T16:45:00Z',
      entity: 'Sarah Johnson',
      hash: '0x0a3b9a8b7c5d4e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      previousHash: '0x9a2a8a7b6c4d3e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
      blockNumber: 12452,
    },
  ];

  const filteredEntries = creditEntries.filter((entry) => {
    if (selectedStatus === 'all') return true;
    return entry.status === selectedStatus;
  });

  const lifecycleStats = {
    issued: creditEntries.filter((e) => e.status === 'issued').length,
    verified: creditEntries.filter((e) => e.status === 'verified').length,
    sold: creditEntries.filter((e) => e.status === 'sold').length,
    retired: creditEntries.filter((e) => e.status === 'retired').length,
    totalCredits: creditEntries.reduce((sum, e) => sum + e.quantity, 0),
  };

  const getStatusColor = (status: CreditStatus) => {
    const colors = {
      issued: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      verified: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      sold: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      retired: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    };
    return colors[status];
  };

  const getStatusIcon = (status: CreditStatus) => {
    const icons = {
      issued: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      verified: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      sold: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      retired: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    };
    return icons[status];
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

  const truncateHash = (hash: string, start: number = 6, end: number = 4) => {
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-2">
              Carbon Credits Ledger
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Immutable blockchain-style ledger of carbon credit lifecycle
            </p>
          </div>

          {/* Lifecycle Stats */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['issued', 'verified', 'sold', 'retired'] as CreditStatus[]).map((status) => (
              <div
                key={status}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6"
              >
                <div className={`inline-flex p-3 rounded-lg mb-3 ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {lifecycleStats[status]}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 capitalize">{status}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-100">Total Credits</p>
                <svg className="w-6 h-6 text-blue-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <p className="text-3xl font-bold mb-1">{lifecycleStats.totalCredits.toLocaleString()}</p>
              <p className="text-sm text-blue-100">tCO₂e</p>
            </div>
          </div>

          {/* Lifecycle Funnel Visualization */}
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Credit Lifecycle Flow</h2>
            <div className="flex items-center justify-between flex-wrap gap-4">
              {(['issued', 'verified', 'sold', 'retired'] as CreditStatus[]).map((status, index) => (
                <React.Fragment key={status}>
                  <div className="flex-1 min-w-[150px] text-center">
                    <div className={`inline-flex p-4 rounded-xl mb-3 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize">{status}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{lifecycleStats[status]} credits</p>
                    <div className="mt-4 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          status === 'issued' ? 'bg-blue-500' :
                          status === 'verified' ? 'bg-green-500' :
                          status === 'sold' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${(lifecycleStats[status] / lifecycleStats.issued) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400 dark:text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Immutable Ledger Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Immutable Ledger</h2>
                <div className="flex gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="issued">Issued</option>
                    <option value="verified">Verified</option>
                    <option value="sold">Sold</option>
                    <option value="retired">Retired</option>
                  </select>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Export Ledger
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Block #</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Credit ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Entity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                        selectedEntry === entry.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                          #{entry.blockNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{entry.creditId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.status)}`}>
                          {getStatusIcon(entry.status)}
                          <span className="capitalize">{entry.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.projectName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {entry.quantity.toLocaleString()} tCO₂e
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{entry.entity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {truncateHash(entry.hash)}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(entry.hash);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Copy hash"
                          >
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(entry.timestamp)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEntries.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-500 dark:text-slate-400">No ledger entries found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

