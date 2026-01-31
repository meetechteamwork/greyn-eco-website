'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';

interface CorporateEntity {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  employees: number;
  campaigns: number;
  lastActive: string;
  joinedDate: string | null;
}

interface Activity {
  id: string;
  type: 'campaign_created' | 'emission_reported' | 'volunteer_event' | 'report_generated';
  entity: string;
  description: string;
  timestamp: string;
}

interface PortalHealth {
  status: string;
  uptime: number | null;
  responseTime: number | null;
  activeSessions: number;
  maxSessions: number | null;
  lastChecked?: string | null;
  message?: string | null;
}

interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  totalEmployees: number;
  totalCampaigns: number;
}

export default function CorporatePortalPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [entities, setEntities] = useState<CorporateEntity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    totalEmployees: 0,
    totalCampaigns: 0,
  });
  const [health, setHealth] = useState<PortalHealth | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.admin.portals.corporate.getDashboard();
      if (res.success && res.data) {
        const d = res.data as { stats?: DashboardStats; entities?: CorporateEntity[]; activities?: Activity[]; health?: PortalHealth | null };
        if (d.stats) setStats(d.stats);
        setEntities(d.entities ?? []);
        setActivities(d.activities ?? []);
        setHealth('health' in d ? d.health ?? null : null);
      } else {
        setError(res.message || 'Failed to load dashboard');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAction = async (action: 'disable' | 'review' | 'approve', entityId: string) => {
    const entity = entities.find((e) => e.id === entityId);
    if (!entity || !confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${entity.name}?`)) return;

    setActionLoading(entityId);
    try {
      const res = await api.admin.portals.corporate.updateEntityStatus(entityId, action);
      if (res.success) {
        await fetchDashboard();
        setSelectedEntity(null);
      } else {
        setError(res.message || `Failed to ${action} entity`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : `Failed to ${action} entity`);
    } finally {
      setActionLoading(null);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      campaign_created: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4v16m8-8H4"></path>
        </svg>
      ),
      emission_reported: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      volunteer_event: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      report_generated: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    };
    return icons[type];
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      campaign_created: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      emission_reported: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      volunteer_event: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      report_generated: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[type];
  };

  const getStatusBadge = (status: CorporateEntity['status']) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return styles[status];
  };

  const healthStatusLabel = health?.status === 'operational' ? 'Operational' : health?.status === 'degraded' ? 'Degraded' : health?.status === 'partial_outage' ? 'Partial Outage' : health?.status === 'major_outage' ? 'Major Outage' : '—';
  const healthDotColor = health?.status === 'operational' ? 'bg-green-500' : health?.status === 'degraded' ? 'bg-yellow-500' : 'bg-slate-400';
  const healthTextColor = health?.status === 'operational' ? 'text-green-600 dark:text-green-400' : health?.status === 'degraded' ? 'text-yellow-600 dark:text-yellow-400' : health ? 'text-red-600 dark:text-red-400' : 'text-slate-500';
  const sessionPct = health?.maxSessions != null && health.maxSessions > 0 ? Math.min(100, ((health.activeSessions ?? 0) / health.maxSessions) * 100) : 0;

  if (loading && entities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading Corporate Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 dark:hover:text-red-200">✕</button>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Corporate ESG Portal
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-1">Manage corporate entities and ESG activities</p>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalEmployees.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Employees</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.totalCampaigns}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active Campaigns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Entities */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Corporate Entities</h2>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                      {stats.active} Active
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {entities.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-slate-400">
                      <p className="font-medium">No corporate entities in the database.</p>
                      <p className="text-sm mt-1">To add sample data, run in the backend folder: <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">npm run seed:corporate-portal</code></p>
                    </div>
                  ) : (
                    entities.map((entity) => (
                      <div
                        key={entity.id}
                        className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                          selectedEntity === entity.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => setSelectedEntity(selectedEntity === entity.id ? null : entity.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                {entity.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{entity.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-400">{entity.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(entity.status)}`}>
                                {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                              </span>
                            </div>
                            <div className="ml-15 grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Employees</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.employees.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Campaigns</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.campaigns}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Last Active</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{entity.lastActive}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Joined</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {entity.joinedDate ? new Date(entity.joinedDate).toLocaleDateString() : '—'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {selectedEntity === entity.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAction('disable', entity.id); }}
                              disabled={!!actionLoading}
                              className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === entity.id ? '…' : 'Disable'}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAction('review', entity.id); }}
                              disabled={!!actionLoading}
                              className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === entity.id ? '…' : 'Review'}
                            </button>
                            {entity.status === 'pending' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAction('approve', entity.id); }}
                                disabled={!!actionLoading}
                                className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-semibold text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === entity.id ? '…' : 'Approve'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Portal Health */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Portal Health</h3>
                {health === null ? (
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    <p>No health data in the database.</p>
                    <p className="mt-1">Run <code className="text-xs bg-gray-100 dark:bg-slate-700 px-1 rounded">npm run seed:corporate-portal</code> in the backend to create a health record.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Status</span>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${healthDotColor}`}></span>
                        <span className={`text-sm font-bold ${healthTextColor}`}>{healthStatusLabel}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Uptime</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{health.uptime != null ? `${health.uptime}%` : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Response Time</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{health.responseTime != null ? `${health.responseTime}ms` : '—'}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-slate-400">Active Sessions</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{(health.activeSessions ?? 0).toLocaleString()}</span>
                      </div>
                      {health.maxSessions != null && health.maxSessions > 0 ? (
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all" style={{ width: `${sessionPct}%` }}></div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No recent activity in the database. Seed with <code className="text-xs">npm run seed:corporate-portal</code> in the backend folder.</p>
                  ) : (
                    activities.slice(0, 8).map((activity) => (
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
                    ))
                  )}
                </div>
                <button className="mt-4 w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
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
