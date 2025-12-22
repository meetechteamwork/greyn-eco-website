'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

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

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'ip-rules' | 'policies'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showAddIPModal, setShowAddIPModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AccessRule | null>(null);

  // Mock data
  const accessRules: AccessRule[] = [
    {
      id: '1',
      name: 'Corporate Office Access',
      type: 'ip_whitelist',
      description: 'Allow access from corporate office IP range',
      status: 'active',
      priority: 1,
      createdAt: '2024-01-15',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-20',
      conditions: ['IP Range: 192.168.1.0/24', 'Requires 2FA', 'Business hours only'],
      affectedIPs: ['192.168.1.0/24'],
    },
    {
      id: '2',
      name: 'Admin Portal Restriction',
      type: 'role_based',
      description: 'Restrict admin portal access to admin role only',
      status: 'active',
      priority: 2,
      createdAt: '2024-02-10',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-18',
      conditions: ['Role: Admin', 'Requires MFA', 'Audit logging enabled'],
      affectedUsers: 5,
    },
    {
      id: '3',
      name: 'Suspicious IP Block',
      type: 'ip_blacklist',
      description: 'Block known malicious IP addresses',
      status: 'active',
      priority: 1,
      createdAt: '2024-03-20',
      createdBy: 'security@greyn-eco.com',
      lastModified: '2024-03-25',
      conditions: ['IP: 203.0.113.45', 'Auto-blocked', 'Permanent'],
      affectedIPs: ['203.0.113.45', '198.51.100.23'],
    },
    {
      id: '4',
      name: 'Business Hours Access',
      type: 'time_based',
      description: 'Restrict access to business hours (9 AM - 6 PM EST)',
      status: 'active',
      priority: 3,
      createdAt: '2024-01-20',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-02-15',
      conditions: ['Time: 09:00-18:00 EST', 'Monday-Friday', 'Exceptions: Admins'],
      affectedUsers: 45,
    },
    {
      id: '5',
      name: 'Geographic Restriction',
      type: 'geographic',
      description: 'Block access from restricted countries',
      status: 'active',
      priority: 2,
      createdAt: '2024-02-05',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-10',
      conditions: ['Blocked: CN, RU, KP', 'Requires VPN verification', 'Admin override available'],
      affectedUsers: 12,
    },
    {
      id: '6',
      name: 'Device Fingerprint Validation',
      type: 'device_fingerprint',
      description: 'Require device fingerprint verification for sensitive operations',
      status: 'active',
      priority: 4,
      createdAt: '2024-03-01',
      createdBy: 'admin@greyn-eco.com',
      lastModified: '2024-03-15',
      conditions: ['Device registration required', 'Biometric verification', 'Trusted devices only'],
      affectedUsers: 8,
    },
  ];

  const ipRules: IPAccessRule[] = [
    {
      id: '1',
      ipAddress: '192.168.1.100',
      type: 'allow',
      reason: 'Corporate office IP',
      status: 'active',
      createdAt: '2024-01-15',
      createdBy: 'admin@greyn-eco.com',
      location: 'New York, USA',
    },
    {
      id: '2',
      ipAddress: '203.0.113.45',
      type: 'deny',
      reason: 'Suspicious activity detected',
      status: 'active',
      createdAt: '2024-03-20',
      createdBy: 'security@greyn-eco.com',
      location: 'Unknown',
    },
    {
      id: '3',
      ipAddress: '198.51.100.23',
      type: 'deny',
      reason: 'Brute force attempt',
      status: 'active',
      createdAt: '2024-03-22',
      createdBy: 'Auto-Block',
      location: 'San Francisco, USA',
    },
    {
      id: '4',
      ipAddress: '10.0.0.0/24',
      cidr: '/24',
      type: 'allow',
      reason: 'VPN gateway range',
      status: 'active',
      createdAt: '2024-02-10',
      createdBy: 'admin@greyn-eco.com',
      location: 'Corporate VPN',
    },
    {
      id: '5',
      ipAddress: '172.16.0.50',
      type: 'allow',
      reason: 'Development server',
      status: 'active',
      createdAt: '2024-01-25',
      expiresAt: '2024-12-31',
      createdBy: 'admin@greyn-eco.com',
      location: 'London, UK',
    },
  ];

  const roleAccess: RoleAccess[] = [
    {
      role: 'Admin',
      permissions: ['read', 'write', 'delete', 'admin', 'export', 'approve'],
      resources: ['All Resources'],
      restrictions: ['None'],
    },
    {
      role: 'Corporate Admin',
      permissions: ['read', 'write', 'approve'],
      resources: ['Corporate Portal', 'Projects', 'Transactions'],
      restrictions: ['No user management', 'No system settings'],
    },
    {
      role: 'NGO Admin',
      permissions: ['read', 'write'],
      resources: ['NGO Portal', 'Projects', 'Verification'],
      restrictions: ['No financial access', 'No user management'],
    },
    {
      role: 'Verifier',
      permissions: ['read', 'approve'],
      resources: ['Verification Portal', 'Project Details'],
      restrictions: ['Read-only except verification', 'No financial data'],
    },
    {
      role: 'Investor',
      permissions: ['read', 'export'],
      resources: ['Carbon Marketplace', 'Projects', 'Certificates'],
      restrictions: ['No write access', 'No admin functions'],
    },
  ];

  // Filter rules
  const filteredRules = useMemo(() => {
    return accessRules.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
      const matchesType = typeFilter === 'all' || rule.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const filteredIPRules = useMemo(() => {
    return ipRules.filter((rule) => {
      const matchesSearch =
        rule.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalRules: accessRules.length,
      activeRules: accessRules.filter((r) => r.status === 'active').length,
      ipRules: ipRules.length,
      blockedIPs: ipRules.filter((r) => r.type === 'deny').length,
      allowedIPs: ipRules.filter((r) => r.type === 'allow').length,
      roles: roleAccess.length,
    };
  }, []);

  const getRuleTypeColor = (type: AccessRuleType) => {
    const colors = {
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
    const labels = {
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
    const colors = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      expired: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colors[status];
  };

  const getPermissionIcon = (permission: PermissionType) => {
    const icons = {
      read: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      ),
      write: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      ),
      delete: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      ),
      admin: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      export: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      approve: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    };
    return icons[permission];
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
                  Access Control
                </h1>
                <p className="text-lg text-slate-400">Manage access rules, IP restrictions, and role-based permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddIPModal(true)}
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
                  onClick={() => setShowAddRuleModal(true)}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.activeRules}</p>
              <p className="text-sm text-slate-400">Active Rules</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">{stats.allowedIPs}</p>
              <p className="text-sm text-slate-400">Allowed IPs</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.blockedIPs}</p>
              <p className="text-sm text-slate-400">Blocked IPs</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
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
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
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
              {/* Quick Stats */}
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
                    {accessRules.slice(0, 3).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-white">{rule.name}</p>
                          <p className="text-xs text-slate-400">{rule.lastModified}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(rule.status)}`}>
                          {rule.status}
                        </span>
                      </div>
                    ))}
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
                        <button className="px-4 py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Permissions</p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300"
                              >
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
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Restrictions</p>
                          <div className="space-y-1">
                            {role.restrictions.map((restriction) => (
                              <p key={restriction} className="text-sm text-red-400">{restriction}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ip-rules' && (
            <div>
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

              {/* IP Rules Table */}
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
                      {filteredIPRules.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                              </svg>
                              <p className="text-lg font-semibold text-slate-400">No IP rules found</p>
                              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredIPRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                                {rule.ipAddress}
                                {rule.cidr && <span className="text-slate-400">{rule.cidr}</span>}
                              </code>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  rule.type === 'allow'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                }`}
                              >
                                {rule.type === 'allow' ? '✓ Allow' : '✗ Deny'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-300">{rule.reason}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-300">{rule.location || 'Unknown'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rule.status)}`}>
                                {rule.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-400">{rule.createdAt}</p>
                              {rule.expiresAt && (
                                <p className="text-xs text-yellow-400 mt-1">Expires: {rule.expiresAt}</p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors" title="Edit">
                                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                  </svg>
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors" title="Delete">
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
                        placeholder="Search rules..."
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
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="ip_whitelist">IP Whitelist</option>
                      <option value="ip_blacklist">IP Blacklist</option>
                      <option value="role_based">Role-Based</option>
                      <option value="time_based">Time-Based</option>
                      <option value="geographic">Geographic</option>
                      <option value="device_fingerprint">Device Fingerprint</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Access Rules Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRules.length === 0 ? (
                  <div className="col-span-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <p className="text-lg font-semibold text-slate-400">No access rules found</p>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all"
                    >
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rule.status)}`}>
                            {rule.status}
                          </span>
                          <button
                            onClick={() => setSelectedRule(rule)}
                            className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                            title="View Details"
                          >
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
                            {rule.conditions.map((condition, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
                            <button className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                              Edit
                            </button>
                            <button className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
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
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create New Access Rule</h3>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-400">Access rule creation form would go here...</p>
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowAddRuleModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Rule created!');
                    setShowAddRuleModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add IP Rule Modal */}
      {showAddIPModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add IP Rule</h3>
              <button
                onClick={() => setShowAddIPModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-400">IP rule creation form would go here...</p>
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowAddIPModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('IP rule created!');
                    setShowAddIPModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Add Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

