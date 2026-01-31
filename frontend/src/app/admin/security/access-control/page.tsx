'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { useSimpleToast } from '@/components/Toast';

type AccessRuleType = 'ip_whitelist' | 'ip_blacklist' | 'role_based' | 'time_based' | 'geographic' | 'device_fingerprint';
type RuleStatus = 'active' | 'inactive' | 'expired';
type PermissionType = 'read' | 'write' | 'delete' | 'admin' | 'export' | 'approve';

interface AccessRule {
  id: string;
  name: string;
  type: AccessRuleType;
  description: string;
  status: RuleStatus;
  priority: number;
  createdAt: string;
  createdBy: string;
  lastModified: string;
  conditions: string[];
  affectedUsers?: number;
  affectedIPs?: string[];
}

interface RoleAccess {
  role: string;
  permissions: PermissionType[];
  resources: string[];
  restrictions: string[];
}

interface IPAccessRule {
  id: string;
  ipAddress: string;
  cidr?: string;
  type: 'allow' | 'deny';
  reason: string;
  status: RuleStatus;
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
  location?: string;
}

const INCLUDE_SEED = true;
const ACCESS_RULE_TYPES: AccessRuleType[] = ['ip_whitelist', 'ip_blacklist', 'role_based', 'time_based', 'geographic', 'device_fingerprint'];
const STATUS_OPTIONS: RuleStatus[] = ['active', 'inactive', 'expired'];
const PERMISSION_OPTIONS: PermissionType[] = ['read', 'write', 'delete', 'admin', 'export', 'approve'];

export default function AccessControlPage() {
  const { showToast } = useSimpleToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'ip-rules' | 'policies'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [stats, setStats] = useState({ totalRules: 0, activeRules: 0, ipRules: 0, blockedIPs: 0, allowedIPs: 0, roles: 0 });
  const [recentActivity, setRecentActivity] = useState<{ name: string; lastModified?: string; status: string }[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [ipRules, setIPRules] = useState<IPAccessRule[]>([]);
  const [roleAccess, setRoleAccess] = useState<RoleAccess[]>([]);

  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showAddIPModal, setShowAddIPModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AccessRule | null>(null);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);
  const [editingIPRule, setEditingIPRule] = useState<IPAccessRule | null>(null);
  const [editingRole, setEditingRole] = useState<RoleAccess | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await api.admin.accessControl.getOverview(INCLUDE_SEED);
      if (res.success && res.data) {
        const d = res.data as { stats?: typeof stats; recentActivity?: typeof recentActivity };
        if (d.stats) setStats(d.stats);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      }
    } catch (_e) {
      // non-blocking
    }
  }, []);

  const fetchAccessRules = useCallback(async () => {
    try {
      const res = await api.admin.accessControl.getAccessRules({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        page: 1,
        limit: 50,
        includeSeed: INCLUDE_SEED,
      });
      if (res.success && res.data) {
        const d = res.data as { accessRules?: AccessRule[] };
        setAccessRules(d.accessRules ?? []);
      } else {
        setAccessRules([]);
      }
    } catch (_e) {
      setAccessRules([]);
    }
  }, [searchQuery, statusFilter, typeFilter]);

  const fetchIPRules = useCallback(async () => {
    try {
      const res = await api.admin.accessControl.getIPRules({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: 1,
        limit: 50,
        includeSeed: INCLUDE_SEED,
      });
      if (res.success && res.data) {
        const d = res.data as { ipRules?: IPAccessRule[] };
        setIPRules(d.ipRules ?? []);
      } else {
        setIPRules([]);
      }
    } catch (_e) {
      setIPRules([]);
    }
  }, [searchQuery, statusFilter]);

  const fetchRoleAccess = useCallback(async () => {
    try {
      const res = await api.admin.accessControl.getRoleAccess();
      if (res.success && res.data) {
        const d = res.data as { roleAccess?: RoleAccess[] };
        setRoleAccess(d.roleAccess ?? []);
      } else {
        setRoleAccess([]);
      }
    } catch (_e) {
      setRoleAccess([]);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchOverview();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, [fetchOverview]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverview();
    } else if (activeTab === 'policies') {
      fetchAccessRules();
    } else if (activeTab === 'ip-rules') {
      fetchIPRules();
    } else if (activeTab === 'roles') {
      fetchRoleAccess();
    }
  }, [activeTab, fetchOverview, fetchAccessRules, fetchIPRules, fetchRoleAccess]);

  useEffect(() => {
    if (activeTab === 'policies') fetchAccessRules();
  }, [activeTab, searchQuery, statusFilter, typeFilter, fetchAccessRules]);

  useEffect(() => {
    if (activeTab === 'ip-rules') fetchIPRules();
  }, [activeTab, searchQuery, statusFilter, fetchIPRules]);

  const refetchAfterMutation = useCallback(() => {
    fetchOverview();
    if (activeTab === 'policies') fetchAccessRules();
    if (activeTab === 'ip-rules') fetchIPRules();
    if (activeTab === 'roles') fetchRoleAccess();
  }, [activeTab, fetchOverview, fetchAccessRules, fetchIPRules, fetchRoleAccess]);

  const getRuleTypeColor = (type: AccessRuleType) => {
    const colors: Record<AccessRuleType, string> = {
      ip_whitelist: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      ip_blacklist: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      role_based: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      time_based: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      geographic: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
      device_fingerprint: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
    };
    return colors[type];
  };

  const getRuleTypeLabel = (type: AccessRuleType) => {
    const labels: Record<AccessRuleType, string> = {
      ip_whitelist: 'IP Whitelist',
      ip_blacklist: 'IP Blacklist',
      role_based: 'Role-Based',
      time_based: 'Time-Based',
      geographic: 'Geographic',
      device_fingerprint: 'Device Fingerprint',
    };
    return labels[type];
  };

  const getStatusColor = (status: RuleStatus) => {
    const colors: Record<RuleStatus, string> = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      expired: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colors[status];
  };

  const getPermissionIcon = (permission: PermissionType) => (
    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const handleDeleteAccessRule = async (rule: AccessRule) => {
    if (!confirm(`Delete access rule "${rule.name}"?`)) return;
    setActionLoading(rule.id);
    try {
      const res = await api.admin.accessControl.deleteAccessRule(rule.id, INCLUDE_SEED);
      if (res.success) {
        showToast('Access rule deleted', 'success');
        refetchAfterMutation();
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to delete', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteIPRule = async (rule: IPAccessRule) => {
    if (!confirm(`Delete IP rule for ${rule.ipAddress}?`)) return;
    setActionLoading(rule.id);
    try {
      const res = await api.admin.accessControl.deleteIPRule(rule.id, INCLUDE_SEED);
      if (res.success) {
        showToast('IP rule deleted', 'success');
        refetchAfterMutation();
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to delete', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-900/20 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Access Control</h1>
                <p className="text-lg text-slate-400">Manage access rules, IP restrictions, and role-based permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingIPRule(null);
                    setShowAddIPModal(true);
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add IP Rule
                  </div>
                </button>
                <button
                  onClick={() => {
                    setEditingRule(null);
                    setShowAddRuleModal(true);
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    New Access Rule
                  </div>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
                  <div className="p-3 rounded-xl bg-red-500/20 inline-block mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-red-400 mb-1">{stats.activeRules}</p>
                  <p className="text-sm text-slate-400">Active Rules</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-green-500/50 transition-all">
                  <div className="p-3 rounded-xl bg-green-500/20 inline-block mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-green-400 mb-1">{stats.allowedIPs}</p>
                  <p className="text-sm text-slate-400">Allowed IPs</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
                  <div className="p-3 rounded-xl bg-red-500/20 inline-block mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-red-400 mb-1">{stats.blockedIPs}</p>
                  <p className="text-sm text-slate-400">Blocked IPs</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all">
                  <div className="p-3 rounded-xl bg-blue-500/20 inline-block mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">{stats.roles}</p>
                  <p className="text-sm text-slate-400">Roles Configured</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'roles', label: 'Role Access', icon: '👥' },
                    { id: 'ip-rules', label: 'IP Rules', icon: '🌐' },
                    { id: 'policies', label: 'Access Rules', icon: '🔒' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === tab.id ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Access Control Summary</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Total Access Rules</span>
                          <span className="text-xl font-bold text-white">{stats.totalRules}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Active Rules</span>
                          <span className="text-xl font-bold text-green-400">{stats.activeRules}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">IP Rules</span>
                          <span className="text-xl font-bold text-blue-400">{stats.ipRules}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Roles Configured</span>
                          <span className="text-xl font-bold text-purple-400">{stats.roles}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {recentActivity.length === 0 ? (
                          <p className="text-slate-500 text-sm">No recent activity</p>
                        ) : (
                          recentActivity.map((rule, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                              <div>
                                <p className="text-sm font-semibold text-white">{rule.name}</p>
                                <p className="text-xs text-slate-400">{rule.lastModified || '—'}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(rule.status as RuleStatus)}`}>{rule.status}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'roles' && (
                <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white">Role-Based Access Control</h2>
                    <p className="text-sm text-slate-400 mt-1">Manage permissions for each role</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {roleAccess.map((role, index) => (
                        <div key={index} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">{role.role}</h3>
                              <p className="text-sm text-slate-400">{role.permissions.length} permissions configured</p>
                            </div>
                            <button
                              onClick={() => setEditingRole(role)}
                              className="px-4 py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Permissions</p>
                              <div className="flex flex-wrap gap-2">
                                {role.permissions.map((perm) => (
                                  <span key={perm} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300">
                                    {getPermissionIcon(perm)}
                                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Resources</p>
                              <div className="space-y-1">
                                {role.resources.map((resource) => (
                                  <p key={resource} className="text-sm text-slate-300">{resource}</p>
                                ))}
                                {role.resources.length === 0 && <p className="text-slate-500 text-sm">—</p>}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Restrictions</p>
                              <div className="space-y-1">
                                {role.restrictions.map((restriction) => (
                                  <p key={restriction} className="text-sm text-red-400">{restriction}</p>
                                ))}
                                {role.restrictions.length === 0 && <p className="text-slate-500 text-sm">—</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {roleAccess.length === 0 && (
                        <p className="text-slate-500 text-center py-8">No role access configured</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ip-rules' && (
                <div>
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
                            placeholder="Search by IP or reason..."
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
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-900/50 border-b border-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">IP Address</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Reason</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {ipRules.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                  </svg>
                                  <p className="text-lg font-semibold text-slate-400">No IP rules found</p>
                                  <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or add a new rule</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ipRules.map((rule) => (
                              <tr key={rule.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                  <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                                    {rule.ipAddress}
                                    {rule.cidr && <span className="text-slate-400">{rule.cidr}</span>}
                                  </code>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${rule.type === 'allow' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                                    {rule.type === 'allow' ? '✓ Allow' : '✗ Deny'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-slate-300">{rule.reason}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-slate-300">{rule.location || '—'}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rule.status)}`}>{rule.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-slate-400">{rule.createdAt}</p>
                                  {rule.expiresAt && <p className="text-xs text-yellow-400 mt-1">Expires: {rule.expiresAt}</p>}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingIPRule(rule);
                                        setShowAddIPModal(true);
                                      }}
                                      className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteIPRule(rule)}
                                      disabled={actionLoading === rule.id}
                                      className="p-2 text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                                      title="Delete"
                                    >
                                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'policies' && (
                <div>
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
                            placeholder="Search rules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="all">All Types</option>
                          {ACCESS_RULE_TYPES.map((t) => (
                            <option key={t} value={t}>{getRuleTypeLabel(t)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {accessRules.length === 0 ? (
                      <div className="col-span-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-12 text-center">
                        <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <p className="text-lg font-semibold text-slate-400">No access rules found</p>
                        <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or create a new rule</p>
                      </div>
                    ) : (
                      accessRules.map((rule) => (
                        <div key={rule.id} className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">{rule.name}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRuleTypeColor(rule.type)}`}>
                                  {getRuleTypeLabel(rule.type)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 mb-3">{rule.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rule.status)}`}>{rule.status}</span>
                              <button onClick={() => setSelectedRule(rule)} className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors" title="View Details">
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Conditions</p>
                              <div className="space-y-1">
                                {rule.conditions.length === 0 ? <p className="text-slate-500 text-sm">—</p> : rule.conditions.map((condition, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {condition}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                              <div className="text-xs text-slate-500">
                                <p>Priority: <span className="font-semibold text-slate-400">{rule.priority}</span></p>
                                <p>Modified: <span className="font-semibold text-slate-400">{rule.lastModified}</span></p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingRule(rule);
                                    setShowAddRuleModal(true);
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAccessRule(rule)}
                                  disabled={actionLoading === rule.id}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Access Rule Modal (Create / Edit) */}
      {(showAddRuleModal || editingRule) && (
        <AccessRuleFormModal
          rule={editingRule}
          onClose={() => {
            setShowAddRuleModal(false);
            setEditingRule(null);
          }}
          onSuccess={() => {
            setShowAddRuleModal(false);
            setEditingRule(null);
            refetchAfterMutation();
            showToast(editingRule ? 'Access rule updated' : 'Access rule created', 'success');
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {/* IP Rule Modal (Add / Edit) */}
      {(showAddIPModal || editingIPRule) && (
        <IPRuleFormModal
          rule={editingIPRule}
          onClose={() => {
            setShowAddIPModal(false);
            setEditingIPRule(null);
          }}
          onSuccess={() => {
            setShowAddIPModal(false);
            setEditingIPRule(null);
            refetchAfterMutation();
            showToast(editingIPRule ? 'IP rule updated' : 'IP rule added', 'success');
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {/* View Details Modal */}
      {selectedRule && (
        <ViewDetailsModal
          rule={selectedRule}
          onClose={() => setSelectedRule(null)}
          getRuleTypeLabel={getRuleTypeLabel}
          getRuleTypeColor={getRuleTypeColor}
          getStatusColor={getStatusColor}
        />
      )}

      {/* Edit Role Access Modal */}
      {editingRole && (
        <RoleAccessFormModal
          roleAccess={editingRole}
          onClose={() => setEditingRole(null)}
          onSuccess={() => {
            setEditingRole(null);
            refetchAfterMutation();
            showToast('Role access updated', 'success');
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}
    </div>
  );
}

// --- Access Rule Form Modal ---
function AccessRuleFormModal({
  rule,
  onClose,
  onSuccess,
  onError,
}: {
  rule: AccessRule | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(rule?.name ?? '');
  const [type, setType] = useState<AccessRuleType>(rule?.type ?? 'role_based');
  const [description, setDescription] = useState(rule?.description ?? '');
  const [status, setStatus] = useState<RuleStatus>(rule?.status ?? 'active');
  const [priority, setPriority] = useState(rule?.priority ?? 1);
  const [conditionsStr, setConditionsStr] = useState(rule?.conditions?.join('\n') ?? '');
  const [affectedUsers, setAffectedUsers] = useState(rule?.affectedUsers ?? '');
  const [affectedIPsStr, setAffectedIPsStr] = useState(rule?.affectedIPs?.join('\n') ?? '');

  const isEdit = !!rule;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      onError('Name and description are required');
      return;
    }
    setLoading(true);
    try {
      const conditions = conditionsStr.split('\n').map((s) => s.trim()).filter(Boolean);
      const affectedIPs = affectedIPsStr.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: name.trim(),
        type,
        description: description.trim(),
        status,
        priority: Math.max(1, parseInt(String(priority), 10) || 1),
        conditions,
        affectedUsers: affectedUsers === '' ? undefined : parseInt(String(affectedUsers), 10),
        affectedIPs: affectedIPs.length ? affectedIPs : undefined,
      };
      if (isEdit) {
        const res = await api.admin.accessControl.updateAccessRule(rule.id, payload, INCLUDE_SEED);
        if (res.success) onSuccess();
        else onError(res.message || 'Update failed');
      } else {
        const res = await api.admin.accessControl.createAccessRule(payload);
        if (res.success) onSuccess();
        else onError(res.message || 'Create failed');
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{isEdit ? 'Edit Access Rule' : 'Create New Access Rule'}</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Type *</label>
              <select value={type} onChange={(e) => setType(e.target.value as AccessRuleType)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500">
                {ACCESS_RULE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as RuleStatus)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Priority</label>
                <input type="number" min={1} value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Conditions (one per line)</label>
              <textarea value={conditionsStr} onChange={(e) => setConditionsStr(e.target.value)} rows={3} placeholder="IP Range: 192.168.1.0/24" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Affected Users</label>
                <input type="number" min={0} value={affectedUsers} onChange={(e) => setAffectedUsers(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Affected IPs (one per line)</label>
                <textarea value={affectedIPsStr} onChange={(e) => setAffectedIPsStr(e.target.value)} rows={2} placeholder="192.168.1.0/24" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50">
                {loading ? 'Saving...' : isEdit ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- IP Rule Form Modal ---
function IPRuleFormModal({
  rule,
  onClose,
  onSuccess,
  onError,
}: {
  rule: IPAccessRule | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(rule?.ipAddress ?? '');
  const [cidr, setCidr] = useState(rule?.cidr ?? '');
  const [type, setType] = useState<'allow' | 'deny'>(rule?.type ?? 'allow');
  const [reason, setReason] = useState(rule?.reason ?? '');
  const [status, setStatus] = useState<RuleStatus>(rule?.status ?? 'active');
  const [expiresAt, setExpiresAt] = useState(rule?.expiresAt ?? '');
  const [location, setLocation] = useState(rule?.location ?? '');

  const isEdit = !!rule;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipAddress.trim() || !reason.trim()) {
      onError('IP address and reason are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ipAddress: ipAddress.trim(),
        cidr: cidr.trim() || undefined,
        type,
        reason: reason.trim(),
        status,
        expiresAt: expiresAt.trim() || undefined,
        location: location.trim() || undefined,
      };
      if (isEdit) {
        const res = await api.admin.accessControl.updateIPRule(rule.id, payload, INCLUDE_SEED);
        if (res.success) onSuccess();
        else onError(res.message || 'Update failed');
      } else {
        const res = await api.admin.accessControl.createIPRule(payload);
        if (res.success) onSuccess();
        else onError(res.message || 'Create failed');
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{isEdit ? 'Edit IP Rule' : 'Add IP Rule'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">IP Address *</label>
              <input type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} placeholder="192.168.1.1 or 10.0.0.0/24" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">CIDR (optional)</label>
              <input type="text" value={cidr} onChange={(e) => setCidr(e.target.value)} placeholder="/24" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Type *</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'allow' | 'deny')} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500">
                <option value="allow">Allow</option>
                <option value="deny">Deny</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as RuleStatus)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Reason *</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Expires (date, optional)</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Location (optional)</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Update Rule' : 'Add Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- View Details Modal (read-only) ---
function ViewDetailsModal({
  rule,
  onClose,
  getRuleTypeLabel,
  getRuleTypeColor,
  getStatusColor,
}: {
  rule: AccessRule;
  onClose: () => void;
  getRuleTypeLabel: (t: AccessRuleType) => string;
  getRuleTypeColor: (t: AccessRuleType) => string;
  getStatusColor: (s: RuleStatus) => string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Access Rule Details</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-400">Name:</span>
            <p className="text-white font-semibold">{rule.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Type:</span>
            <p><span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getRuleTypeColor(rule.type)}`}>{getRuleTypeLabel(rule.type)}</span></p>
          </div>
          <div>
            <span className="text-slate-400">Description:</span>
            <p className="text-slate-300">{rule.description}</p>
          </div>
          <div>
            <span className="text-slate-400">Status:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(rule.status)}`}>{rule.status}</span>
          </div>
          <div>
            <span className="text-slate-400">Priority:</span>
            <p className="text-slate-300">{rule.priority}</p>
          </div>
          <div>
            <span className="text-slate-400">Created:</span>
            <p className="text-slate-300">{rule.createdAt}</p>
          </div>
          <div>
            <span className="text-slate-400">Last modified:</span>
            <p className="text-slate-300">{rule.lastModified}</p>
          </div>
          <div>
            <span className="text-slate-400">Created by:</span>
            <p className="text-slate-300">{rule.createdBy || '—'}</p>
          </div>
          {rule.conditions?.length ? (
            <div>
              <span className="text-slate-400">Conditions:</span>
              <ul className="list-disc list-inside text-slate-300 mt-1">
                {rule.conditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(rule.affectedUsers != null || (rule.affectedIPs && rule.affectedIPs.length)) && (
            <div>
              <span className="text-slate-400">Affected:</span>
              <p className="text-slate-300">
                {rule.affectedUsers != null && `Users: ${rule.affectedUsers}`}
                {rule.affectedUsers != null && rule.affectedIPs?.length ? ' · ' : ''}
                {rule.affectedIPs?.length ? `IPs: ${rule.affectedIPs.join(', ')}` : ''}
              </p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="w-full px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Role Access Form Modal ---
function RoleAccessFormModal({
  roleAccess,
  onClose,
  onSuccess,
  onError,
}: {
  roleAccess: RoleAccess;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionType[]>(roleAccess.permissions);
  const [resourcesStr, setResourcesStr] = useState(roleAccess.resources?.join('\n') ?? '');
  const [restrictionsStr, setRestrictionsStr] = useState(roleAccess.restrictions?.join('\n') ?? '');

  const togglePermission = (p: PermissionType) => {
    setPermissions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resources = resourcesStr.split('\n').map((s) => s.trim()).filter(Boolean);
      const restrictions = restrictionsStr.split('\n').map((s) => s.trim()).filter(Boolean);
      const res = await api.admin.accessControl.updateRoleAccess(roleAccess.role, { permissions, resources, restrictions });
      if (res.success) onSuccess();
      else onError(res.message || 'Update failed');
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Edit Role Access: {roleAccess.role}</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {PERMISSION_OPTIONS.map((p) => (
                  <label key={p} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg border border-slate-600 cursor-pointer hover:border-slate-500">
                    <input type="checkbox" checked={permissions.includes(p)} onChange={() => togglePermission(p)} className="rounded border-slate-500 bg-slate-800 text-red-500 focus:ring-red-500" />
                    <span className="text-slate-300 capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Resources (one per line)</label>
              <textarea value={resourcesStr} onChange={(e) => setResourcesStr(e.target.value)} rows={4} placeholder="One resource per line, e.g. Corporate Portal" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Restrictions (one per line)</label>
              <textarea value={restrictionsStr} onChange={(e) => setRestrictionsStr(e.target.value)} rows={3} placeholder="One per line, e.g. No user management" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50">
                {loading ? 'Saving...' : 'Update Role Access'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
