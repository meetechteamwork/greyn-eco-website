'use client';

import React, { useState } from 'react';

type ActionType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'access' | 'permission_change' | 'security_event';
type Severity = 'low' | 'medium' | 'high' | 'critical';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: ActionType;
  resource: string;
  details: string;
  severity: Severity;
  ipAddress: string;
  userAgent: string;
  hash: string;
  success: boolean;
}

export default function AuditPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-03-25T14:30:00Z',
      actor: 'admin@greyn-eco.com',
      action: 'permission_change',
      resource: 'User: sarah.johnson@example.com',
      details: 'Changed role from Simple User to Corporate Admin',
      severity: 'high',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hash: '0x8f7e6d5c4b3a291807060504030201009f8e7d6c5b4a39281716151413121110',
      success: true,
    },
    {
      id: '2',
      timestamp: '2024-03-25T14:25:00Z',
      actor: 'security@greyn-eco.com',
      action: 'security_event',
      resource: 'IP: 203.0.113.45',
      details: 'Blocked IP due to suspicious activity',
      severity: 'critical',
      ipAddress: '203.0.113.45',
      userAgent: 'Unknown',
      hash: '0x7e6d5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f',
      success: true,
    },
    {
      id: '3',
      timestamp: '2024-03-25T14:20:00Z',
      actor: 'admin@greyn-eco.com',
      action: 'create',
      resource: 'Transaction: TXN-2024-001234',
      details: 'Created new transaction record',
      severity: 'low',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hash: '0x6d5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e',
      success: true,
    },
    {
      id: '4',
      timestamp: '2024-03-25T14:15:00Z',
      actor: 'user@example.com',
      action: 'login',
      resource: 'Authentication',
      details: 'Failed login attempt - Invalid credentials',
      severity: 'medium',
      ipAddress: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      hash: '0x5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d',
      success: false,
    },
    {
      id: '5',
      timestamp: '2024-03-25T14:10:00Z',
      actor: 'admin@greyn-eco.com',
      action: 'update',
      resource: 'Role: Security Admin',
      details: 'Updated permissions for Security Admin role',
      severity: 'high',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hash: '0x4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c',
      success: true,
    },
    {
      id: '6',
      timestamp: '2024-03-25T14:05:00Z',
      actor: 'admin@greyn-eco.com',
      action: 'access',
      resource: '/admin/security',
      details: 'Accessed security operations page',
      severity: 'low',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hash: '0x3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b',
      success: true,
    },
    {
      id: '7',
      timestamp: '2024-03-25T14:00:00Z',
      actor: 'admin@greyn-eco.com',
      action: 'delete',
      resource: 'IP Rule: 192.168.1.50',
      details: 'Removed IP allow rule',
      severity: 'medium',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hash: '0x291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a',
      success: true,
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    return matchesSeverity && matchesAction;
  });

  const stats = {
    total: auditLogs.length,
    critical: auditLogs.filter((l) => l.severity === 'critical').length,
    high: auditLogs.filter((l) => l.severity === 'high').length,
    failed: auditLogs.filter((l) => !l.success).length,
  };

  const getSeverityColor = (severity: Severity) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return colors[severity];
  };

  const getActionIcon = (action: ActionType) => {
    const icons = {
      login: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
      ),
      logout: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      ),
      create: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4v16m8-8H4"></path>
        </svg>
      ),
      update: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      ),
      delete: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      ),
      access: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      ),
      permission_change: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      security_event: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      ),
    };
    return icons[action];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const truncateHash = (hash: string, start: number = 8, end: number = 8) => {
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Audit Logs
                </h1>
                <p className="text-lg text-slate-400 mt-1">Immutable audit trail of all system activities</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
              <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-sm font-medium text-slate-400">Total Events</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-red-500/50 p-6">
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.critical}</p>
              <p className="text-sm font-medium text-slate-400">Critical</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-orange-500/50 p-6">
              <p className="text-3xl font-bold text-orange-400 mb-1">{stats.high}</p>
              <p className="text-sm font-medium text-slate-400">High Severity</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-xl border border-yellow-500/50 p-6">
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.failed}</p>
              <p className="text-sm font-medium text-slate-400">Failed Actions</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="access">Access</option>
                <option value="permission_change">Permission Change</option>
                <option value="security_event">Security Event</option>
              </select>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                Export Logs
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Resource</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Severity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-700/30 transition-colors cursor-pointer ${
                        selectedLog === log.id ? 'bg-slate-700/50' : ''
                      }`}
                      onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm text-white font-mono">{formatDate(log.timestamp)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{log.actor}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.ipAddress}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-slate-700 text-slate-300">
                            {getActionIcon(log.action)}
                          </div>
                          <span className="text-sm text-white capitalize">{log.action.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{log.resource}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.details}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(log.severity)}`}>
                          {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                            {truncateHash(log.hash)}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(log.hash);
                            }}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Copy hash"
                          >
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            log.success
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-red-500/20 text-red-400 border border-red-500/50'
                          }`}
                        >
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-slate-400">No audit logs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

