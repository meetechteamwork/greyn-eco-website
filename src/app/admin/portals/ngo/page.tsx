'use client';

import React, { useState } from 'react';

interface NGOEntity {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  projects: number;
  totalFunding: number;
  lastActive: string;
  joinedDate: string;
  location: string;
}

interface Activity {
  id: string;
  type: 'project_launched' | 'funding_received' | 'milestone_completed' | 'update_posted';
  entity: string;
  description: string;
  timestamp: string;
}

export default function NGOPortalPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const entities: NGOEntity[] = [
    {
      id: '1',
      name: 'Green Earth Foundation',
      email: 'contact@greenearth.org',
      status: 'active',
      projects: 12,
      totalFunding: 245000,
      lastActive: '1 hour ago',
      joinedDate: '2023-11-15',
      location: 'San Francisco, CA',
    },
    {
      id: '2',
      name: 'Ocean Conservation Initiative',
      email: 'info@oceancare.org',
      status: 'active',
      projects: 8,
      totalFunding: 189000,
      lastActive: '30 minutes ago',
      joinedDate: '2024-01-20',
      location: 'Miami, FL',
    },
    {
      id: '3',
      name: 'Forest Restoration Alliance',
      email: 'hello@forestrestore.org',
      status: 'pending',
      projects: 0,
      totalFunding: 0,
      lastActive: 'Never',
      joinedDate: '2024-03-22',
      location: 'Portland, OR',
    },
    {
      id: '4',
      name: 'Wildlife Protection Society',
      email: 'contact@wildlife-protect.org',
      status: 'active',
      projects: 15,
      totalFunding: 320000,
      lastActive: '2 hours ago',
      joinedDate: '2023-12-01',
      location: 'Denver, CO',
    },
    {
      id: '5',
      name: 'Clean Water Network',
      email: 'info@cleanwater.org',
      status: 'suspended',
      projects: 5,
      totalFunding: 95000,
      lastActive: '10 days ago',
      joinedDate: '2024-02-15',
      location: 'Atlanta, GA',
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'project_launched',
      entity: 'Green Earth Foundation',
      description: 'Launched new reforestation project',
      timestamp: '3 hours ago',
    },
    {
      id: '2',
      type: 'funding_received',
      entity: 'Ocean Conservation Initiative',
      description: 'Received $25,000 in funding',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'milestone_completed',
      entity: 'Wildlife Protection Society',
      description: 'Completed Phase 2 milestone',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'update_posted',
      entity: 'Green Earth Foundation',
      description: 'Posted project update with photos',
      timestamp: '2 days ago',
    },
    {
      id: '5',
      type: 'project_launched',
      entity: 'Ocean Conservation Initiative',
      description: 'Launched beach cleanup initiative',
      timestamp: '3 days ago',
    },
  ];

  const stats = {
    total: entities.length,
    active: entities.filter((e) => e.status === 'active').length,
    pending: entities.filter((e) => e.status === 'pending').length,
    suspended: entities.filter((e) => e.status === 'suspended').length,
    totalProjects: entities.reduce((sum, e) => sum + e.projects, 0),
    totalFunding: entities.reduce((sum, e) => sum + e.totalFunding, 0),
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      project_launched: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      funding_received: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      milestone_completed: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      update_posted: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
    };
    return icons[type];
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      project_launched: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      funding_received: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      milestone_completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      update_posted: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };
    return colors[type];
  };

  const getStatusBadge = (status: NGOEntity['status']) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return styles[status];
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  NGO Portal
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-1">Manage NGOs, projects, and funding activities</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total NGOs</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stats.active}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalProjects}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Projects</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                ${(stats.totalFunding / 1000).toFixed(0)}K
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Funding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Entities */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active NGOs</h2>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                      {stats.active} Active
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {entities.map((entity) => (
                    <div
                      key={entity.id}
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                        selectedEntity === entity.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''
                      }`}
                      onClick={() => setSelectedEntity(selectedEntity === entity.id ? null : entity.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                              {entity.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{entity.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-slate-400">{entity.email}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{entity.location}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(entity.status)}`}>
                              {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                            </span>
                          </div>
                          <div className="ml-15 grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Projects</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.projects}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">Total Funding</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${entity.totalFunding.toLocaleString()}
                              </p>
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
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">99.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Response Time</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">145ms</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 dark:text-slate-400">Active Sessions</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">567</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
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
                <button className="mt-4 w-full text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
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

