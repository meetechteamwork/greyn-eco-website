'use client';

import React, { useState } from 'react';

interface IPRule {
  id: string;
  ipAddress: string;
  type: 'allow' | 'block';
  reason: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'expired';
}

interface RateLimit {
  id: string;
  endpoint: string;
  limit: number;
  window: string;
  current: number;
  status: 'normal' | 'warning' | 'critical';
}

interface SecurityRole {
  id: string;
  name: string;
  permissions: string[];
  users: number;
  lastModified: string;
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'ip-rules' | 'rate-limits'>('roles');

  const roles: SecurityRole[] = [
    {
      id: '1',
      name: 'Security Admin',
      permissions: ['Full Access', 'IP Management', 'Rate Limit Control', 'Audit Access'],
      users: 3,
      lastModified: '2024-03-20',
    },
    {
      id: '2',
      name: 'Security Analyst',
      permissions: ['View Logs', 'IP Management', 'View Rate Limits'],
      users: 5,
      lastModified: '2024-03-18',
    },
    {
      id: '3',
      name: 'Read-Only Auditor',
      permissions: ['View Logs', 'View IP Rules', 'View Rate Limits'],
      users: 8,
      lastModified: '2024-03-15',
    },
  ];

  const ipRules: IPRule[] = [
    {
      id: '1',
      ipAddress: '192.168.1.100',
      type: 'allow',
      reason: 'Corporate office IP',
      createdAt: '2024-01-15',
      createdBy: 'Admin User',
      status: 'active',
    },
    {
      id: '2',
      ipAddress: '203.0.113.45',
      type: 'block',
      reason: 'Suspicious activity detected',
      createdAt: '2024-03-20',
      createdBy: 'Security System',
      status: 'active',
    },
    {
      id: '3',
      ipAddress: '198.51.100.23',
      type: 'block',
      reason: 'Brute force attempt',
      createdAt: '2024-03-22',
      createdBy: 'Auto-Block',
      status: 'active',
    },
    {
      id: '4',
      ipAddress: '10.0.0.50',
      type: 'allow',
      reason: 'VPN gateway',
      createdAt: '2024-02-10',
      createdBy: 'Admin User',
      status: 'active',
    },
  ];

  const rateLimits: RateLimit[] = [
    {
      id: '1',
      endpoint: '/api/auth/login',
      limit: 100,
      window: '15 minutes',
      current: 23,
      status: 'normal',
    },
    {
      id: '2',
      endpoint: '/api/users',
      limit: 1000,
      window: '1 hour',
      current: 856,
      status: 'warning',
    },
    {
      id: '3',
      endpoint: '/api/transactions',
      limit: 500,
      window: '1 hour',
      current: 487,
      status: 'warning',
    },
    {
      id: '4',
      endpoint: '/api/admin/*',
      limit: 200,
      window: '1 hour',
      current: 45,
      status: 'normal',
    },
    {
      id: '5',
      endpoint: '/api/carbon/purchase',
      limit: 50,
      window: '15 minutes',
      current: 48,
      status: 'critical',
    },
  ];

  const securityStats = {
    totalRoles: roles.length,
    totalUsers: roles.reduce((sum, r) => sum + r.users, 0),
    activeIPRules: ipRules.filter((r) => r.status === 'active').length,
    blockedIPs: ipRules.filter((r) => r.type === 'block').length,
    rateLimitAlerts: rateLimits.filter((r) => r.status !== 'normal').length,
  };

  const getRateLimitColor = (status: RateLimit['status']) => {
    const colors = {
      normal: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500',
    };
    return colors[status];
  };

  const getRateLimitTextColor = (status: RateLimit['status']) => {
    const colors = {
      normal: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      critical: 'text-red-600 dark:text-red-400',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Security Operations
                </h1>
                <p className="text-lg text-slate-400 mt-1">Manage security roles, IP rules, and rate limits</p>
              </div>
            </div>
          </div>

          {/* Security Stats */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-3xl font-bold text-white mb-1">{securityStats.totalRoles}</p>
              <p className="text-sm font-medium text-slate-400">Security Roles</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-3xl font-bold text-white mb-1">{securityStats.totalUsers}</p>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-3xl font-bold text-white mb-1">{securityStats.activeIPRules}</p>
              <p className="text-sm font-medium text-slate-400">Active IP Rules</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-red-500/50 p-6">
              <p className="text-3xl font-bold text-red-400 mb-1">{securityStats.blockedIPs}</p>
              <p className="text-sm font-medium text-slate-400">Blocked IPs</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-yellow-500/50 p-6">
              <p className="text-3xl font-bold text-yellow-400 mb-1">{securityStats.rateLimitAlerts}</p>
              <p className="text-sm font-medium text-slate-400">Rate Limit Alerts</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-slate-700">
            {(['roles', 'ip-rules', 'rate-limits'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-red-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'roles' ? 'Security Roles' : tab === 'ip-rules' ? 'IP Rules' : 'Rate Limits'}
              </button>
            ))}
          </div>

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Security Roles</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Create Role
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-700">
                {roles.map((role) => (
                  <div key={role.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{role.name}</h3>
                            <p className="text-sm text-slate-400">Last modified: {role.lastModified}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-semibold">
                            {role.users} users
                          </span>
                        </div>
                        <div className="ml-11 flex flex-wrap gap-2">
                          {role.permissions.map((permission, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs font-medium"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold text-sm hover:bg-slate-600 transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold text-sm hover:bg-red-500/30 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IP Rules Tab */}
          {activeTab === 'ip-rules' && (
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">IP Access Rules</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Add IP Rule
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">IP Address</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Created By</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {ipRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                            {rule.ipAddress}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              rule.type === 'allow'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-red-500/20 text-red-400 border border-red-500/50'
                            }`}
                          >
                            {rule.type === 'allow' ? 'Allow' : 'Block'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-white">{rule.reason}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-400">{rule.createdBy}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-400">{rule.createdAt}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rate Limits Tab */}
          {activeTab === 'rate-limits' && (
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Rate Limits</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Configure Limits
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-700">
                {rateLimits.map((limit) => {
                  const percentage = (limit.current / limit.limit) * 100;
                  return (
                    <div key={limit.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <code className="text-sm font-mono text-white bg-slate-900 px-3 py-1 rounded">
                              {limit.endpoint}
                            </code>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRateLimitTextColor(limit.status)} bg-${limit.status === 'normal' ? 'green' : limit.status === 'warning' ? 'yellow' : 'red'}-500/20 border border-${limit.status === 'normal' ? 'green' : limit.status === 'warning' ? 'yellow' : 'red'}-500/50`}>
                              {limit.status.charAt(0).toUpperCase() + limit.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Limit: {limit.limit} requests</span>
                            <span>Window: {limit.window}</span>
                            <span className="text-white font-semibold">Current: {limit.current}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${getRateLimitColor(limit.status)} transition-all duration-500`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                          <span>{limit.current} / {limit.limit}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

