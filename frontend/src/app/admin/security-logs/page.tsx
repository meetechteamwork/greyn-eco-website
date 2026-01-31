'use client';

import React, { useState } from 'react';

export default function SecurityLogsPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'threats' | 'compliance' | 'reports'>('logs');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const [logs] = useState([
    {
      id: '1',
      timestamp: '2024-03-20 14:32:15',
      severity: 'high',
      type: 'Failed Login',
      user: 'admin@greyn-eco.com',
      ip: '192.168.1.100',
      location: 'San Francisco, CA',
      status: 'blocked',
      details: 'Multiple failed login attempts detected from suspicious IP address',
    },
    {
      id: '2',
      timestamp: '2024-03-20 14:28:42',
      severity: 'medium',
      type: 'Permission Change',
      user: 'admin@greyn-eco.com',
      ip: '192.168.1.50',
      location: 'San Francisco, CA',
      status: 'success',
      details: 'User role changed from Corporate to Admin',
    },
    {
      id: '3',
      timestamp: '2024-03-20 14:15:33',
      severity: 'low',
      type: 'API Access',
      user: 'api-service',
      ip: '10.0.0.5',
      location: 'Internal',
      status: 'success',
      details: 'API token used for data export',
    },
    {
      id: '4',
      timestamp: '2024-03-20 13:45:12',
      severity: 'high',
      type: 'Suspicious Activity',
      user: 'unknown',
      ip: '203.0.113.42',
      location: 'Unknown',
      status: 'flagged',
      details: 'Unusual data access pattern detected',
    },
    {
      id: '5',
      timestamp: '2024-03-20 13:20:08',
      severity: 'medium',
      type: 'Password Reset',
      user: 'user@example.com',
      ip: '192.168.1.75',
      location: 'New York, NY',
      status: 'success',
      details: 'Password reset requested and completed',
    },
  ]);

  const [threats] = useState([
    {
      id: '1',
      type: 'Brute Force Attack',
      source: '203.0.113.42',
      target: 'admin@greyn-eco.com',
      attempts: 47,
      status: 'blocked',
      firstSeen: '2024-03-20 12:00:00',
      lastSeen: '2024-03-20 14:30:00',
    },
    {
      id: '2',
      type: 'SQL Injection Attempt',
      source: '198.51.100.15',
      target: '/api/users',
      attempts: 12,
      status: 'blocked',
      firstSeen: '2024-03-20 10:15:00',
      lastSeen: '2024-03-20 10:45:00',
    },
  ]);

  const tabs = [
    { id: 'logs', label: 'Security Logs', icon: '📋' },
    { id: 'threats', label: 'Threat Detection', icon: '🛡️' },
    { id: 'compliance', label: 'Compliance', icon: '✅' },
    { id: 'reports', label: 'Reports', icon: '📊' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'flagged': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                Security & Logs
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-lg">
                Monitor security events, threats, and compliance status
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all">
                Export Logs
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-lg">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Total Events</span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,247</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last week</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Threats Blocked</span>
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">23</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">2 today</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Active Sessions</span>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">All secure</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Compliance Score</span>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">98%</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Fully compliant</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 mb-6">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-4 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-red-600 dark:text-red-400 bg-gray-50 dark:bg-slate-800'
                      : 'text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Security Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Search logs..."
                      className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                    <select className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white">
                      <option>All Severities</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(log.severity)}`}>
                              {log.severity.toUpperCase()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{log.type}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                            <span>👤 {log.user}</span>
                            <span>🌐 {log.ip}</span>
                            <span>📍 {log.location}</span>
                            <span>🕐 {log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Threat Detection Tab */}
            {activeTab === 'threats' && (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border-2 border-red-200 dark:border-red-800 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-red-200 dark:bg-red-900/30 flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Threats Detected</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">2 threats have been automatically blocked</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {threats.map((threat) => (
                    <div key={threat.id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-red-300 dark:border-red-800">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{threat.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Source: {threat.source}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Target: {threat.target}</p>
                        </div>
                        <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-semibold text-sm">
                          {threat.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-slate-400 mb-1">Attempts</p>
                          <p className="font-bold text-gray-900 dark:text-white">{threat.attempts}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-slate-400 mb-1">First Seen</p>
                          <p className="font-bold text-gray-900 dark:text-white">{threat.firstSeen}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-slate-400 mb-1">Last Seen</p>
                          <p className="font-bold text-gray-900 dark:text-white">{threat.lastSeen}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Overall Compliance Status</h3>
                      <p className="text-gray-600 dark:text-slate-400">All security standards are met</p>
                    </div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">98%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'GDPR Compliance', status: 'compliant', score: 100 },
                    { name: 'SOC 2 Type II', status: 'compliant', score: 98 },
                    { name: 'ISO 27001', status: 'compliant', score: 97 },
                    { name: 'PCI DSS', status: 'compliant', score: 99 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                          {item.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Score: {item.score}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Daily Security Report', date: '2024-03-20', type: 'PDF', size: '2.4 MB' },
                    { name: 'Weekly Threat Analysis', date: '2024-03-19', type: 'PDF', size: '5.1 MB' },
                    { name: 'Monthly Compliance Report', date: '2024-03-01', type: 'PDF', size: '8.7 MB' },
                    { name: 'Quarterly Audit Report', date: '2024-01-01', type: 'PDF', size: '12.3 MB' },
                  ].map((report, idx) => (
                    <div key={idx} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">{report.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Generated: {report.date}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-500">
                            <span>📄 {report.type}</span>
                            <span>💾 {report.size}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
