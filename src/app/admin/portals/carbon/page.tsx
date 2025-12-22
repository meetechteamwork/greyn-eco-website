'use client';

import React, { useState } from 'react';

interface CarbonEntity {
  id: string;
  name: string;
  email: string;
  role: 'Corporate Buyer' | 'Individual Buyer' | 'NGO Admin' | 'Verifier';
  status: 'active' | 'pending' | 'suspended';
  creditsPurchased: number;
  creditsRetired: number;
  lastActive: string;
  joinedDate: string;
}

interface Activity {
  id: string;
  type: 'purchase' | 'retirement' | 'verification' | 'project_submitted';
  entity: string;
  description: string;
  timestamp: string;
}

export default function CarbonPortalPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const entities: CarbonEntity[] = [
    {
      id: '1',
      name: 'Global Tech Solutions',
      email: 'contact@globaltech.com',
      role: 'Corporate Buyer',
      status: 'active',
      creditsPurchased: 1250,
      creditsRetired: 890,
      lastActive: '1 hour ago',
      joinedDate: '2024-01-10',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Individual Buyer',
      status: 'active',
      creditsPurchased: 45,
      creditsRetired: 30,
      lastActive: '30 minutes ago',
      joinedDate: '2024-02-15',
    },
    {
      id: '3',
      name: 'Green Forest NGO',
      email: 'admin@greenforest.org',
      role: 'NGO Admin',
      status: 'active',
      creditsPurchased: 0,
      creditsRetired: 0,
      lastActive: '3 hours ago',
      joinedDate: '2024-01-20',
    },
    {
      id: '4',
      name: 'Dr. Michael Chen',
      email: 'mchen@verifier.com',
      role: 'Verifier',
      status: 'pending',
      creditsPurchased: 0,
      creditsRetired: 0,
      lastActive: 'Never',
      joinedDate: '2024-03-20',
    },
    {
      id: '5',
      name: 'EcoCorp Industries',
      email: 'sustainability@ecocorp.com',
      role: 'Corporate Buyer',
      status: 'suspended',
      creditsPurchased: 500,
      creditsRetired: 200,
      lastActive: '7 days ago',
      joinedDate: '2024-02-01',
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'purchase',
      entity: 'Global Tech Solutions',
      description: 'Purchased 250 carbon credits',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'retirement',
      entity: 'Sarah Johnson',
      description: 'Retired 15 credits for offset',
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      type: 'verification',
      entity: 'Dr. Michael Chen',
      description: 'Verified new carbon project',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'project_submitted',
      entity: 'Green Forest NGO',
      description: 'Submitted new reforestation project',
      timestamp: '2 days ago',
    },
    {
      id: '5',
      type: 'purchase',
      entity: 'Corporate Buyer',
      description: 'Large purchase: 500 credits',
      timestamp: '3 days ago',
    },
  ];

  const stats = {
    total: entities.length,
    active: entities.filter((e) => e.status === 'active').length,
    pending: entities.filter((e) => e.status === 'pending').length,
    suspended: entities.filter((e) => e.status === 'suspended').length,
    totalCreditsPurchased: entities.reduce((sum, e) => sum + e.creditsPurchased, 0),
    totalCreditsRetired: entities.reduce((sum, e) => sum + e.creditsRetired, 0),
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      purchase: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      ),
      retirement: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      verification: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      project_submitted: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    };
    return icons[type];
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      purchase: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      retirement: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      verification: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      project_submitted: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[type];
  };

  const getStatusBadge = (status: CarbonEntity['status']) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return styles[status];
  };

  const getRoleBadge = (role: CarbonEntity['role']) => {
    const styles = {
      'Corporate Buyer': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Individual Buyer': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'NGO Admin': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Verifier': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    };
    return styles[role];
  };

  const handleAction = (action: 'disable' | 'review' | 'approve', entityId: string) => {
    const entity = entities.find((e) => e.id === entityId);
    if (entity && confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${entity.name}?`)) {
      console.log(`${action} entity:`, entityId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Carbon Marketplace Portal
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-1">Manage carbon credit buyers, sellers, and verifiers</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Entities</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stats.active}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalCreditsPurchased.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Credits Purchased</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stats.totalCreditsRetired.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Credits Retired</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Entities */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Entities</h2>
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                      {stats.active} Active
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {entities.map((entity) => (
                    <div
                      key={entity.id}
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                        selectedEntity === entity.id ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                      }`}
                      onClick={() => setSelectedEntity(selectedEntity === entity.id ? null : entity.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                              {entity.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{entity.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-slate-400">{entity.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(entity.role)}`}>
                                {entity.role}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(entity.status)}`}>
                                {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-15 grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Credits Purchased</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.creditsPurchased.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Credits Retired</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.creditsRetired.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Last Active</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.lastActive}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Joined</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(entity.joinedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedEntity === entity.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('disable', entity.id);
                            }}
                            className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Disable
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('review', entity.id);
                            }}
                            className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            Review
                          </button>
                          {entity.status === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('approve', entity.id);
                              }}
                              className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-semibold text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Health Status */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Portal Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Status</span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">Operational</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Uptime</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Response Time</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">95ms</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 dark:text-slate-400">Active Sessions</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">892</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.entity}</p>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full text-center text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  View All Activity →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

