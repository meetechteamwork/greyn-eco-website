'use client';

import React, { useState } from 'react';

interface RetiredCredit {
  id: string;
  creditId: string;
  projectName: string;
  projectId: string;
  retiredDate: string;
  buyer: string;
  quantity: number; // in tonnes
  pricePerTonne: number;
  totalAmount: number;
}

interface LedgerEntry {
  id: string;
  timestamp: string;
  action: string;
  creditId: string;
  projectName: string;
  buyer: string;
  quantity: number;
  hash: string;
  previousHash: string;
}

const mockRetiredCredits: RetiredCredit[] = [
  {
    id: '1',
    creditId: 'CC-2024-001234',
    projectName: 'Amazon Rainforest Conservation',
    projectId: 'PRJ-001',
    retiredDate: '2024-01-15',
    buyer: 'Acme Corporation',
    quantity: 5000,
    pricePerTonne: 15.50,
    totalAmount: 77500,
  },
  {
    id: '2',
    creditId: 'CC-2024-001567',
    projectName: 'Solar Energy Farm Initiative',
    projectId: 'PRJ-002',
    retiredDate: '2024-01-20',
    buyer: 'Tech Solutions Inc.',
    quantity: 3000,
    pricePerTonne: 22.00,
    totalAmount: 66000,
  },
  {
    id: '3',
    creditId: 'CC-2024-001890',
    projectName: 'Mangrove Restoration Program',
    projectId: 'PRJ-003',
    retiredDate: '2024-02-05',
    buyer: 'Green Energy Foundation',
    quantity: 7500,
    pricePerTonne: 18.75,
    totalAmount: 140625,
  },
  {
    id: '4',
    creditId: 'CC-2024-002134',
    projectName: 'Wind Power Development',
    projectId: 'PRJ-004',
    retiredDate: '2024-02-12',
    buyer: 'Sustainable Industries Ltd.',
    quantity: 10000,
    pricePerTonne: 25.00,
    totalAmount: 250000,
  },
  {
    id: '5',
    creditId: 'CC-2024-002456',
    projectName: 'Peatland Restoration',
    projectId: 'PRJ-007',
    retiredDate: '2024-02-28',
    buyer: 'Eco Partners Group',
    quantity: 2500,
    pricePerTonne: 16.50,
    totalAmount: 41250,
  },
];

const mockLedgerEntries: LedgerEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    action: 'Credit Retirement',
    creditId: 'CC-2024-001234',
    projectName: 'Amazon Rainforest Conservation',
    buyer: 'Acme Corporation',
    quantity: 5000,
    hash: '0x7a3f8b2c9d4e1f6a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    id: '2',
    timestamp: '2024-01-20T14:15:00Z',
    action: 'Credit Retirement',
    creditId: 'CC-2024-001567',
    projectName: 'Solar Energy Farm Initiative',
    buyer: 'Tech Solutions Inc.',
    quantity: 3000,
    hash: '0x8b4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    previousHash: '0x7a3f8b2c9d4e1f6a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  },
  {
    id: '3',
    timestamp: '2024-02-05T09:45:00Z',
    action: 'Credit Retirement',
    creditId: 'CC-2024-001890',
    projectName: 'Mangrove Restoration Program',
    buyer: 'Green Energy Foundation',
    quantity: 7500,
    hash: '0x9c5d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    previousHash: '0x8b4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
  },
  {
    id: '4',
    timestamp: '2024-02-12T16:20:00Z',
    action: 'Credit Retirement',
    creditId: 'CC-2024-002134',
    projectName: 'Wind Power Development',
    buyer: 'Sustainable Industries Ltd.',
    quantity: 10000,
    hash: '0xad6e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    previousHash: '0x9c5d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
  },
  {
    id: '5',
    timestamp: '2024-02-28T11:10:00Z',
    action: 'Credit Retirement',
    creditId: 'CC-2024-002456',
    projectName: 'Peatland Restoration',
    buyer: 'Eco Partners Group',
    quantity: 2500,
    hash: '0xbe7f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    previousHash: '0xad6e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
  },
];

export default function CarbonLedgerPage() {
  const [selectedCredit, setSelectedCredit] = useState<RetiredCredit | null>(null);

  const handleDownloadCertificate = (credit: RetiredCredit) => {
    // In a real app, this would download a PDF certificate
    alert(`Downloading retirement certificate for ${credit.creditId}...`);
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 16)}...${hash.substring(hash.length - 16)}`;
  };

  const totalRetiredCredits = mockRetiredCredits.reduce((sum, credit) => sum + credit.quantity, 0);
  const totalRetiredValue = mockRetiredCredits.reduce((sum, credit) => sum + credit.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Retirement Ledger
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Track retired carbon credits and view the immutable ledger
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Retired Credits</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {totalRetiredCredits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">tonnes CO₂</p>
              </div>
              <div className="text-4xl">🌳</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${totalRetiredValue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">USD</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Retirement Records</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {mockRetiredCredits.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">transactions</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        </div>

        {/* Retired Credits Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Retired Credits</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mockRetiredCredits.length} retirement record{mockRetiredCredits.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Credit ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Retired Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockRetiredCredits.map((credit) => (
                  <tr
                    key={credit.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCredit(credit)}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 font-mono">
                        {credit.creditId}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{credit.projectName}</div>
                      <div className="text-xs text-gray-500">{credit.projectId}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(credit.retiredDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(credit.retiredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{credit.buyer}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {credit.quantity.toLocaleString()} tCO₂
                      </div>
                      <div className="text-xs text-gray-500">
                        ${credit.pricePerTonne.toFixed(2)}/tonne
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCertificate(credit);
                        }}
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>📜</span>
                        <span className="hidden sm:inline">Download Certificate</span>
                        <span className="sm:hidden">Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immutable Ledger */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔗</span> Immutable Ledger
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Blockchain-style transaction log (read-only)
                </p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                ✓ Verified
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {mockLedgerEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Entry Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {entry.action}
                          </span>
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {entry.creditId}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>
                            <span className="font-semibold">Project:</span>{' '}
                            <span className="text-gray-900">{entry.projectName}</span>
                          </p>
                          <p>
                            <span className="font-semibold">Buyer:</span>{' '}
                            <span className="text-gray-900">{entry.buyer}</span>
                          </p>
                          <p>
                            <span className="font-semibold">Quantity:</span>{' '}
                            <span className="text-green-600 font-bold">
                              {entry.quantity.toLocaleString()} tCO₂
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hash Information */}
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-32 flex-shrink-0">
                          Hash:
                        </span>
                        <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded break-all">
                          {formatHash(entry.hash)}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(entry.hash);
                            alert('Hash copied to clipboard!');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex-shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-32 flex-shrink-0">
                          Previous Hash:
                        </span>
                        <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded break-all">
                          {index === 0 ? 'Genesis Block' : formatHash(entry.previousHash)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ledger Footer */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <p>
                <span className="font-semibold">Total Entries:</span> {mockLedgerEntries.length}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Ledger is synchronized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


