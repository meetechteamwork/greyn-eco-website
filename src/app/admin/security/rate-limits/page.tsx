'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

type RateLimitStatus = 'normal' | 'warning' | 'critical' | 'exceeded';
type RateLimitWindow = '15 minutes' | '1 hour' | '24 hours' | '1 week';
type RateLimitMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL';

interface RateLimit {
  id: string;
  endpoint: string;
  method: RateLimitMethod;
  limit: number;
  window: RateLimitWindow;
  current: number;
  status: RateLimitStatus;
  description: string;
  lastReset: string;
  nextReset: string;
  blockedRequests?: number;
  averageResponseTime?: number;
  category: 'authentication' | 'api' | 'admin' | 'data' | 'payment' | 'other';
  createdAt: string;
  createdBy: string;
  lastModified: string;
}

export default function RateLimitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedLimit, setSelectedLimit] = useState<RateLimit | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock rate limits data
  const rateLimits: RateLimit[] = [
    {
      id: '1',
      endpoint: '/api/auth/login',
      method: 'POST',
      limit: 100,
      window: '15 minutes',
      current: 23,
      status: 'normal',
      description: 'Login endpoint rate limit to prevent brute force attacks',
      lastReset: '2024-03-25T14:00:00Z',
      nextReset: '2024-03-25T14:15:00Z',
      blockedRequests: 0,
      averageResponseTime: 145,
      category: 'authentication',
      createdAt: '2024-01-15',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-20',
    },
    {
      id: '2',
      endpoint: '/api/users',
      method: 'GET',
      limit: 1000,
      window: '1 hour',
      current: 856,
      status: 'warning',
      description: 'User data retrieval endpoint',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 12,
      averageResponseTime: 89,
      category: 'api',
      createdAt: '2024-01-10',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-18',
    },
    {
      id: '3',
      endpoint: '/api/transactions',
      method: 'POST',
      limit: 500,
      window: '1 hour',
      current: 487,
      status: 'warning',
      description: 'Transaction creation endpoint',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 5,
      averageResponseTime: 234,
      category: 'payment',
      createdAt: '2024-02-01',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-15',
    },
    {
      id: '4',
      endpoint: '/api/admin/*',
      method: 'ALL',
      limit: 200,
      window: '1 hour',
      current: 45,
      status: 'normal',
      description: 'All admin endpoints rate limit',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 0,
      averageResponseTime: 156,
      category: 'admin',
      createdAt: '2024-01-20',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-10',
    },
    {
      id: '5',
      endpoint: '/api/carbon/purchase',
      method: 'POST',
      limit: 50,
      window: '15 minutes',
      current: 48,
      status: 'critical',
      description: 'Carbon credit purchase endpoint - high security',
      lastReset: '2024-03-25T14:00:00Z',
      nextReset: '2024-03-25T14:15:00Z',
      blockedRequests: 2,
      averageResponseTime: 312,
      category: 'payment',
      createdAt: '2024-02-15',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-22',
    },
    {
      id: '6',
      endpoint: '/api/projects',
      method: 'GET',
      limit: 2000,
      window: '1 hour',
      current: 1234,
      status: 'normal',
      description: 'Project listing and search endpoint',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 0,
      averageResponseTime: 67,
      category: 'api',
      createdAt: '2024-01-05',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-02-28',
    },
    {
      id: '7',
      endpoint: '/api/verification/approve',
      method: 'POST',
      limit: 100,
      window: '1 hour',
      current: 95,
      status: 'warning',
      description: 'Project verification approval endpoint',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 3,
      averageResponseTime: 189,
      category: 'admin',
      createdAt: '2024-02-20',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-19',
    },
    {
      id: '8',
      endpoint: '/api/data/export',
      method: 'GET',
      limit: 20,
      window: '24 hours',
      current: 18,
      status: 'warning',
      description: 'Data export endpoint - resource intensive',
      lastReset: '2024-03-24T00:00:00Z',
      nextReset: '2024-03-26T00:00:00Z',
      blockedRequests: 1,
      averageResponseTime: 2456,
      category: 'data',
      createdAt: '2024-01-30',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-12',
    },
    {
      id: '9',
      endpoint: '/api/auth/password-reset',
      method: 'POST',
      limit: 10,
      window: '1 hour',
      current: 10,
      status: 'exceeded',
      description: 'Password reset endpoint - very strict limit',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 15,
      averageResponseTime: 178,
      category: 'authentication',
      createdAt: '2024-01-12',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-05',
    },
    {
      id: '10',
      endpoint: '/api/admin/users/*',
      method: 'ALL',
      limit: 300,
      window: '1 hour',
      current: 67,
      status: 'normal',
      description: 'User management endpoints',
      lastReset: '2024-03-25T13:00:00Z',
      nextReset: '2024-03-25T14:00:00Z',
      blockedRequests: 0,
      averageResponseTime: 123,
      category: 'admin',
      createdAt: '2024-02-10',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-14',
    },
  ];

  // Filter rate limits
  const filteredLimits = useMemo(() => {
    return rateLimits.filter((limit) => {
      const matchesSearch =
        limit.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        limit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        limit.method.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || limit.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || limit.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: rateLimits.length,
      normal: rateLimits.filter((l) => l.status === 'normal').length,
      warning: rateLimits.filter((l) => l.status === 'warning').length,
      critical: rateLimits.filter((l) => l.status === 'critical').length,
      exceeded: rateLimits.filter((l) => l.status === 'exceeded').length,
      totalRequests: rateLimits.reduce((sum, l) => sum + l.current, 0),
      totalBlocked: rateLimits.reduce((sum, l) => sum + (l.blockedRequests || 0), 0),
      averageUsage: Math.round(
        (rateLimits.reduce((sum, l) => sum + (l.current / l.limit) * 100, 0) / rateLimits.length) * 10
      ) / 10,
    };
  }, []);

  const getStatusColor = (status: RateLimitStatus) => {
    const colors = {
      normal: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      critical: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
      exceeded: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return colors[status];
  };

  const getStatusIcon = (status: RateLimitStatus) => {
    const icons = {
      normal: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      ),
      critical: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      exceeded: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      ),
    };
    return icons[status];
  };

  const getProgressColor = (percentage: number, status: RateLimitStatus) => {
    if (status === 'exceeded') return 'bg-red-500';
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      authentication: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      api: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      data: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      payment: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getMethodColor = (method: RateLimitMethod) => {
    const colors = {
      GET: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      POST: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      PUT: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      DELETE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      PATCH: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      ALL: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    };
    return colors[method];
  };

  const calculatePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleViewDetails = (limit: RateLimit) => {
    setSelectedLimit(limit);
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
                  Rate Limits
                </h1>
                <p className="text-lg text-slate-400">Monitor and manage API rate limits and throttling</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export
                  </div>
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    New Rate Limit
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">{stats.normal}</p>
              <p className="text-sm text-slate-400">Normal Status</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.warning}</p>
              <p className="text-sm text-slate-400">Warning Status</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.critical + stats.exceeded}</p>
              <p className="text-sm text-slate-400">Critical/Exceeded</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-1">{stats.totalBlocked}</p>
              <p className="text-sm text-slate-400">Blocked Requests</p>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-sm text-slate-400 mb-2">Total Requests</p>
              <p className="text-2xl font-bold text-white">{stats.totalRequests.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-sm text-slate-400 mb-2">Average Usage</p>
              <p className="text-2xl font-bold text-white">{stats.averageUsage}%</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-sm text-slate-400 mb-2">Total Endpoints</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by endpoint..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="normal">Normal</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="exceeded">Exceeded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="api">API</option>
                  <option value="admin">Admin</option>
                  <option value="data">Data</option>
                  <option value="payment">Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rate Limits Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Rate Limit Configuration ({filteredLimits.length} endpoints)</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Endpoint</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Usage</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Limit</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Window</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredLimits.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p className="text-lg font-semibold text-slate-400">No rate limits found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLimits.map((limit) => {
                      const percentage = calculatePercentage(limit.current, limit.limit);
                      return (
                        <tr key={limit.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                                {limit.endpoint}
                              </code>
                              <p className="text-xs text-slate-400 mt-1 max-w-xs truncate" title={limit.description}>
                                {limit.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getMethodColor(limit.method)}`}>
                              {limit.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="min-w-[200px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-white">{limit.current.toLocaleString()}</span>
                                <span className="text-xs text-slate-400">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${getProgressColor(percentage, limit.status)}`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                              {limit.blockedRequests && limit.blockedRequests > 0 && (
                                <p className="text-xs text-red-400 mt-1">
                                  {limit.blockedRequests} blocked
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-300">{limit.limit.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{limit.window}</span>
                            <p className="text-xs text-slate-500 mt-1">Resets: {formatDate(limit.nextReset)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(limit.status)}`}>
                              {getStatusIcon(limit.status)}
                              {limit.status.charAt(0).toUpperCase() + limit.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getCategoryColor(limit.category)}`}>
                              {limit.category.charAt(0).toUpperCase() + limit.category.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(limit)}
                                className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                              </button>
                              <button className="p-2 text-yellow-400 hover:text-yellow-300 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors" title="Edit">
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button className="p-2 text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors" title="Reset">
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLimit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Rate Limit Details</h3>
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
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(selectedLimit.status)}`}>
                  {getStatusIcon(selectedLimit.status)}
                  {selectedLimit.status.charAt(0).toUpperCase() + selectedLimit.status.slice(1)}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg ${getCategoryColor(selectedLimit.category)}`}>
                  {selectedLimit.category.charAt(0).toUpperCase() + selectedLimit.category.slice(1)}
                </span>
              </div>

              {/* Endpoint Info */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Endpoint Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Endpoint</p>
                    <code className="text-lg font-mono text-white bg-slate-800 px-3 py-2 rounded block">{selectedLimit.endpoint}</code>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Method</p>
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${getMethodColor(selectedLimit.method)}`}>
                      {selectedLimit.method}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-400 mb-1">Description</p>
                    <p className="text-white">{selectedLimit.description}</p>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Usage Statistics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Current Usage</span>
                      <span className="text-lg font-bold text-white">
                        {selectedLimit.current.toLocaleString()} / {selectedLimit.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getProgressColor(calculatePercentage(selectedLimit.current, selectedLimit.limit), selectedLimit.status)}`}
                        style={{ width: `${Math.min(calculatePercentage(selectedLimit.current, selectedLimit.limit), 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {calculatePercentage(selectedLimit.current, selectedLimit.limit).toFixed(1)}% of limit used
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Window</p>
                      <p className="text-white font-semibold">{selectedLimit.window}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Blocked Requests</p>
                      <p className="text-white font-semibold">{selectedLimit.blockedRequests || 0}</p>
                    </div>
                    {selectedLimit.averageResponseTime && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Avg Response Time</p>
                        <p className="text-white font-semibold">{selectedLimit.averageResponseTime}ms</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Last Reset</p>
                  <p className="text-white">{formatDate(selectedLimit.lastReset)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Next Reset</p>
                  <p className="text-white">{formatDate(selectedLimit.nextReset)}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Created</p>
                    <p className="text-white">{selectedLimit.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Last Modified</p>
                    <p className="text-white">{selectedLimit.lastModified}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                  Edit Limit
                </button>
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  Reset Counter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create New Rate Limit</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-400">Rate limit creation form would go here...</p>
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Rate limit created!');
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Create Limit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

