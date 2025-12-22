'use client';

import React, { useState, useMemo } from 'react';

type CreditStatus = 'issued' | 'verified' | 'sold' | 'retired';
type CreditType = 'VCS' | 'Gold Standard' | 'CDM' | 'Verra' | 'Other';

interface CreditEntry {
  id: string;
  creditId: string;
  status: CreditStatus;
  projectName: string;
  projectLocation: string;
  creditType: CreditType;
  quantity: number;
  pricePerCredit: number;
  totalValue: number;
  timestamp: string;
  entity: string;
  verifier?: string;
  buyer?: string;
  hash: string;
  previousHash?: string;
  blockNumber: number;
  certificateUrl?: string;
}

export default function FinanceLedgerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<CreditEntry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock credit entries data
  const allCreditEntries: CreditEntry[] = [
    {
      id: '1',
      creditId: 'CC-2024-001234',
      status: 'retired',
      projectName: 'Amazon Reforestation Project',
      projectLocation: 'Brazil, Amazon Rainforest',
      creditType: 'VCS',
      quantity: 500,
      pricePerCredit: 25.00,
      totalValue: 12500.00,
      timestamp: '2024-03-25T14:30:00Z',
      entity: 'Amazon Conservation NGO',
      verifier: 'Dr. Maria Silva',
      buyer: 'TechCorp Industries',
      hash: '0x4a7f3b2c1d9e8f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a',
      previousHash: '0x3a6e2a1b0c8d7e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f',
      blockNumber: 12456,
      certificateUrl: '/certificates/retirement-001234.pdf',
    },
    {
      id: '2',
      creditId: 'CC-2024-001233',
      status: 'sold',
      projectName: 'Solar Farm California',
      projectLocation: 'California, USA',
      creditType: 'Gold Standard',
      quantity: 340,
      pricePerCredit: 28.50,
      totalValue: 9690.00,
      timestamp: '2024-03-25T11:45:00Z',
      entity: 'Solar Energy Corp',
      verifier: 'Green Verification Inc',
      buyer: 'GreenEnergy Solutions',
      hash: '0x3a6e2a1b0c8d7e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f',
      previousHash: '0x2a5d1a0b9c7d6e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      blockNumber: 12455,
    },
    {
      id: '3',
      creditId: 'CC-2024-001232',
      status: 'verified',
      projectName: 'Wind Power Texas',
      projectLocation: 'Texas, USA',
      creditType: 'Verra',
      quantity: 128,
      pricePerCredit: 22.00,
      totalValue: 2816.00,
      timestamp: '2024-03-24T16:20:00Z',
      entity: 'Wind Energy LLC',
      verifier: 'Dr. Michael Chen',
      hash: '0x2a5d1a0b9c7d6e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      previousHash: '0x1a4c0a9b8c6d5e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f',
      blockNumber: 12454,
    },
    {
      id: '4',
      creditId: 'CC-2024-001231',
      status: 'issued',
      projectName: 'Ocean Cleanup Initiative',
      projectLocation: 'Pacific Ocean',
      creditType: 'VCS',
      quantity: 624,
      pricePerCredit: 20.00,
      totalValue: 12480.00,
      timestamp: '2024-03-24T09:00:00Z',
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
      projectLocation: 'Brazil, Amazon Rainforest',
      creditType: 'VCS',
      quantity: 200,
      pricePerCredit: 25.00,
      totalValue: 5000.00,
      timestamp: '2024-03-23T13:15:00Z',
      entity: 'Amazon Conservation NGO',
      verifier: 'Dr. Maria Silva',
      buyer: 'Sarah Johnson',
      hash: '0x0a3b9a8b7c5d4e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      previousHash: '0x9a2a8a7b6c4d3e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
      blockNumber: 12452,
      certificateUrl: '/certificates/retirement-001230.pdf',
    },
    {
      id: '6',
      creditId: 'CC-2024-001229',
      status: 'sold',
      projectName: 'Hydroelectric Dam Nepal',
      projectLocation: 'Nepal',
      creditType: 'CDM',
      quantity: 450,
      pricePerCredit: 18.50,
      totalValue: 8325.00,
      timestamp: '2024-03-23T10:30:00Z',
      entity: 'Nepal Energy Authority',
      verifier: 'UNFCCC Verification',
      buyer: 'Corporate Buyer Inc',
      hash: '0x9a2a8a7b6c4d3e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
      previousHash: '0x8a1a7a6b5c3d2e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
      blockNumber: 12451,
    },
    {
      id: '7',
      creditId: 'CC-2024-001228',
      status: 'verified',
      projectName: 'Biomass Energy India',
      projectLocation: 'India',
      creditType: 'Gold Standard',
      quantity: 275,
      pricePerCredit: 24.00,
      totalValue: 6600.00,
      timestamp: '2024-03-22T15:45:00Z',
      entity: 'Indian Renewable Energy',
      verifier: 'Gold Standard Verification',
      hash: '0x8a1a7a6b5c3d2e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
      previousHash: '0x7a0a6a5b4c2d1e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f',
      blockNumber: 12450,
    },
    {
      id: '8',
      creditId: 'CC-2024-001227',
      status: 'issued',
      projectName: 'Forest Conservation Kenya',
      projectLocation: 'Kenya',
      creditType: 'VCS',
      quantity: 380,
      pricePerCredit: 21.00,
      totalValue: 7980.00,
      timestamp: '2024-03-22T08:20:00Z',
      entity: 'Kenya Forest Service',
      hash: '0x7a0a6a5b4c2d1e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f',
      previousHash: '0x6a9a5a4b3c1d0e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f',
      blockNumber: 12449,
    },
    {
      id: '9',
      creditId: 'CC-2024-001226',
      status: 'retired',
      projectName: 'Solar Farm California',
      projectLocation: 'California, USA',
      creditType: 'Gold Standard',
      quantity: 150,
      pricePerCredit: 28.50,
      totalValue: 4275.00,
      timestamp: '2024-03-21T12:00:00Z',
      entity: 'Solar Energy Corp',
      verifier: 'Green Verification Inc',
      buyer: 'EcoFinance Group',
      hash: '0x6a9a5a4b3c1d0e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f',
      previousHash: '0x5a8a4a3b2c0d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f',
      blockNumber: 12448,
      certificateUrl: '/certificates/retirement-001226.pdf',
    },
    {
      id: '10',
      creditId: 'CC-2024-001225',
      status: 'sold',
      projectName: 'Wind Power Texas',
      projectLocation: 'Texas, USA',
      creditType: 'Verra',
      quantity: 100,
      pricePerCredit: 22.00,
      totalValue: 2200.00,
      timestamp: '2024-03-20T14:30:00Z',
      entity: 'Wind Energy LLC',
      verifier: 'Dr. Michael Chen',
      buyer: 'Sustainable Corp',
      hash: '0x5a8a4a3b2c0d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f',
      previousHash: '0x4a7a3a2b1c9d8e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
      blockNumber: 12447,
    },
  ];

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allCreditEntries.filter((entry) => {
      const matchesSearch =
        entry.creditId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.hash.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesType = typeFilter === 'all' || entry.creditType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEntries, currentPage]);

  // Calculate lifecycle stats
  const lifecycleStats = useMemo(() => {
    const issued = filteredEntries.filter((e) => e.status === 'issued');
    const verified = filteredEntries.filter((e) => e.status === 'verified');
    const sold = filteredEntries.filter((e) => e.status === 'sold');
    const retired = filteredEntries.filter((e) => e.status === 'retired');

    return {
      issued: {
        count: issued.length,
        credits: issued.reduce((sum, e) => sum + e.quantity, 0),
        value: issued.reduce((sum, e) => sum + e.totalValue, 0),
      },
      verified: {
        count: verified.length,
        credits: verified.reduce((sum, e) => sum + e.quantity, 0),
        value: verified.reduce((sum, e) => sum + e.totalValue, 0),
      },
      sold: {
        count: sold.length,
        credits: sold.reduce((sum, e) => sum + e.quantity, 0),
        value: sold.reduce((sum, e) => sum + e.totalValue, 0),
      },
      retired: {
        count: retired.length,
        credits: retired.reduce((sum, e) => sum + e.quantity, 0),
        value: retired.reduce((sum, e) => sum + e.totalValue, 0),
      },
      totalCredits: filteredEntries.reduce((sum, e) => sum + e.quantity, 0),
      totalValue: filteredEntries.reduce((sum, e) => sum + e.totalValue, 0),
    };
  }, [filteredEntries]);

  const getStatusColor = (status: CreditStatus) => {
    const colors = {
      issued: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      verified: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      sold: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
      retired: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  const handleViewDetails = (entry: CreditEntry) => {
    setSelectedEntry(entry);
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
                  Carbon Credits Ledger
                </h1>
                <p className="text-lg text-slate-400">Immutable blockchain ledger of carbon credit lifecycle</p>
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
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Verify Chain
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Lifecycle Visualization */}
          <div className="mb-8 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Credit Lifecycle Flow</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Issued */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border-2 border-blue-500/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-full bg-blue-500/30">
                      {getStatusIcon('issued')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">Issued</h3>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{lifecycleStats.issued.count}</p>
                    <p className="text-sm text-slate-400">{lifecycleStats.issued.credits.toLocaleString()} credits</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(lifecycleStats.issued.value)}</p>
                  </div>
                </div>
                <div className="absolute top-1/2 -right-2 transform translate-y-[-50%] hidden md:block">
                  <svg className="w-8 h-8 text-purple-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>

              {/* Verified */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border-2 border-purple-500/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-full bg-purple-500/30">
                      {getStatusIcon('verified')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">Verified</h3>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{lifecycleStats.verified.count}</p>
                    <p className="text-sm text-slate-400">{lifecycleStats.verified.credits.toLocaleString()} credits</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(lifecycleStats.verified.value)}</p>
                  </div>
                </div>
                <div className="absolute top-1/2 -right-2 transform translate-y-[-50%] hidden md:block">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>

              {/* Sold */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl p-6 border-2 border-emerald-500/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-full bg-emerald-500/30">
                      {getStatusIcon('sold')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">Sold</h3>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{lifecycleStats.sold.count}</p>
                    <p className="text-sm text-slate-400">{lifecycleStats.sold.credits.toLocaleString()} credits</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(lifecycleStats.sold.value)}</p>
                  </div>
                </div>
                <div className="absolute top-1/2 -right-2 transform translate-y-[-50%] hidden md:block">
                  <svg className="w-8 h-8 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>

              {/* Retired */}
              <div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border-2 border-green-500/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-full bg-green-500/30">
                      {getStatusIcon('retired')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">Retired</h3>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{lifecycleStats.retired.count}</p>
                    <p className="text-sm text-slate-400">{lifecycleStats.retired.credits.toLocaleString()} credits</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(lifecycleStats.retired.value)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{lifecycleStats.totalCredits.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Credits</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-1">{formatCurrency(lifecycleStats.totalValue)}</p>
              <p className="text-sm text-slate-400">Total Value</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <svg className="w-6 h-6 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-1">{filteredEntries.length}</p>
              <p className="text-sm text-slate-400">Total Entries</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    placeholder="Search by credit ID, project, entity, or hash..."
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
                  <option value="issued">Issued</option>
                  <option value="verified">Verified</option>
                  <option value="sold">Sold</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Credit Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="VCS">VCS</option>
                  <option value="Gold Standard">Gold Standard</option>
                  <option value="CDM">CDM</option>
                  <option value="Verra">Verra</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Immutable Ledger ({filteredEntries.length} entries)</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Block</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Credit ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Value</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {paginatedEntries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="text-lg font-semibold text-slate-400">No ledger entries found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-slate-700">
                              <svg className="w-4 h-4 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                              </svg>
                            </div>
                            <span className="text-sm font-mono text-white">#{entry.blockNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                            {entry.creditId}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-white">{entry.projectName}</p>
                            <p className="text-xs text-slate-400 mt-1">{entry.projectLocation}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-700 text-slate-300 mt-1">
                              {entry.creditType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded-lg ${getStatusColor(entry.status)}`}>
                              {getStatusIcon(entry.status)}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.status)}`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white">{entry.quantity.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">tonnes CO₂</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-emerald-400">{formatCurrency(entry.totalValue)}</p>
                          <p className="text-xs text-slate-400">{formatCurrency(entry.pricePerCredit)}/credit</p>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded block max-w-xs truncate" title={entry.hash}>
                            {formatHash(entry.hash)}
                          </code>
                          {entry.previousHash && (
                            <p className="text-xs text-slate-500 mt-1">Prev: {formatHash(entry.previousHash)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-300">{formatDate(entry.timestamp)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(entry)}
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

      {/* Entry Details Modal */}
      {showDetailsModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Ledger Entry Details</h3>
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
              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(selectedEntry.status)}`}>
                  {getStatusIcon(selectedEntry.status)}
                  <span className="font-semibold">{selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}</span>
                </span>
                <span className="text-sm text-slate-400">Block #{selectedEntry.blockNumber}</span>
              </div>

              {/* Credit Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Credit ID</p>
                  <code className="text-lg font-mono text-white bg-slate-900 px-3 py-2 rounded block">{selectedEntry.creditId}</code>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Credit Type</p>
                  <p className="text-lg font-semibold text-white">{selectedEntry.creditType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Project Name</p>
                  <p className="text-lg font-semibold text-white">{selectedEntry.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Location</p>
                  <p className="text-lg text-white">{selectedEntry.projectLocation}</p>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Financial Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Quantity</p>
                    <p className="text-xl font-bold text-white">{selectedEntry.quantity.toLocaleString()} tonnes CO₂</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Price per Credit</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(selectedEntry.pricePerCredit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Value</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(selectedEntry.totalValue)}</p>
                  </div>
                </div>
              </div>

              {/* Entity Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Entity</p>
                  <p className="text-white">{selectedEntry.entity}</p>
                </div>
                {selectedEntry.verifier && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Verifier</p>
                    <p className="text-white">{selectedEntry.verifier}</p>
                  </div>
                )}
                {selectedEntry.buyer && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Buyer</p>
                    <p className="text-white">{selectedEntry.buyer}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 mb-1">Timestamp</p>
                  <p className="text-white">{formatDate(selectedEntry.timestamp)}</p>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Blockchain Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Block Hash</p>
                    <code className="text-sm font-mono text-slate-300 bg-slate-800 px-3 py-2 rounded block break-all">
                      {selectedEntry.hash}
                    </code>
                  </div>
                  {selectedEntry.previousHash && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Previous Hash</p>
                      <code className="text-sm font-mono text-slate-300 bg-slate-800 px-3 py-2 rounded block break-all">
                        {selectedEntry.previousHash}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                {selectedEntry.certificateUrl && (
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">
                    Download Certificate
                  </button>
                )}
                <button className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                  View on Blockchain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

