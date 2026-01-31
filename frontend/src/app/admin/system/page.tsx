'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'maintenance';
type Severity = 'low' | 'medium' | 'high' | 'critical';
type LogLevel = 'info' | 'warning' | 'error' | 'debug' | 'critical';

interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  lastChecked: string | Date;
}

interface Incident {
  id: string;
  incidentId?: string;
  service: string;
  severity: Severity;
  status: 'active' | 'resolved' | 'acknowledged' | 'investigating';
  timestamp: string | Date;
  description: string;
}

interface SystemLog {
  id: string;
  timestamp: string | Date;
  service: string;
  message: string;
  level: LogLevel;
}

export default function SystemPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>('operational');
  const [operationalCount, setOperationalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch system health data
  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.admin.system.getHealth();

        if (response.success && response.data) {
          const data = response.data as any;
          setServices(data.services || []);
          setIncidents(data.incidents || []);
          setSystemLogs(data.logs || []);
          setOverallStatus(data.overallStatus || 'operational');
          setOperationalCount(data.operationalCount || 0);
        } else {
          setError(response.message || 'Failed to load system health data');
        }
      } catch (err: any) {
        console.error('Error fetching system health:', err);
        setError(err.message || 'Failed to load system health data');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemHealth();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: ServiceStatus) => {
    const colors = {
      operational: 'bg-green-500',
      degraded: 'bg-yellow-500',
      down: 'bg-red-500',
      maintenance: 'bg-blue-500',
    };
    return colors[status];
  };

  const getStatusTextColor = (status: ServiceStatus) => {
    const colors = {
      operational: 'text-green-400',
      degraded: 'text-yellow-400',
      down: 'text-red-400',
      maintenance: 'text-blue-400',
    };
    return colors[status];
  };

  const getSeverityColor = (severity: Severity) => {
    const colors = {
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return colors[severity];
  };

  const getLogLevelColor = (level: LogLevel) => {
    const colors = {
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      debug: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colors[level];
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  // Chart Placeholder Component
  const ChartPlaceholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="h-64 relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-slate-500 mx-auto mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p className="text-sm font-semibold text-slate-400">Monitoring data will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-slate-400">Loading system health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
          <p className="text-red-400 text-lg font-semibold">Error loading data</p>
          <p className="text-slate-400 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  System Health
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-400">Live status of platform services and infrastructure</p>
              </div>
              <div className={`flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border self-start sm:self-auto ${
                overallStatus === 'operational'
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                  : overallStatus === 'down'
                  ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
                  : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50'
              }`}>
                <span className={`w-3 h-3 rounded-full animate-pulse ${
                  overallStatus === 'operational' ? 'bg-green-500' : overallStatus === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <span className={`text-sm font-bold ${
                  overallStatus === 'operational' ? 'text-green-400' : overallStatus === 'down' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {overallStatus === 'operational' 
                    ? '🟢 All Systems Operational' 
                    : overallStatus === 'down'
                    ? '🔴 System Down'
                    : '⚠️ Some Systems Degraded'}
                </span>
              </div>
            </div>
          </div>

          {/* Service Status Cards */}
          {services.length > 0 ? (
            <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
              <div
                key={service.id}
                className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} animate-pulse`}></div>
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      service.status === 'operational'
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : service.status === 'degraded'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Latency</p>
                    <p className={`text-xl font-bold ${
                      service.latency < 50 ? 'text-green-400' :
                      service.latency < 100 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {service.latency}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Uptime</p>
                    <p className="text-xl font-bold text-white">{formatUptime(service.uptime)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Uptime</span>
                    <span className="text-xs font-semibold text-white">{formatUptime(service.uptime)}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(service.status)} transition-all duration-500`}
                      style={{ width: `${service.uptime}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="mb-8 text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-slate-400">No services configured yet.</p>
            </div>
          )}

          {/* Infrastructure Metrics Charts */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Infrastructure Metrics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ChartPlaceholder
                title="CPU Usage"
                description="Real-time CPU utilization across all servers"
              />
              <ChartPlaceholder
                title="Memory Usage"
                description="Memory consumption and availability metrics"
              />
              <ChartPlaceholder
                title="Request Rate"
                description="HTTP requests per second over time"
              />
              <ChartPlaceholder
                title="Error Rate"
                description="Error frequency and distribution"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Incidents & Alerts */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-700 bg-slate-900/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Incidents & Alerts</h2>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/50 self-start sm:self-auto">
                      {incidents.filter((i) => i.status === 'active').length} Active
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[800px] w-full">
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Incident ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Service</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Severity</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {incidents.length > 0 ? (
                        incidents.map((incident) => (
                          <tr key={incident.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
                                {incident.incidentId || incident.id}
                              </code>
                            </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-white">{incident.service}</p>
                            <p className="text-xs text-slate-400 mt-1">{incident.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(incident.severity)}`}>
                              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              incident.status === 'active'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                : 'bg-green-500/20 text-green-400 border border-green-500/50'
                            }`}>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-400 font-mono">{formatDate(incident.timestamp)}</p>
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                            No incidents recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Logs Preview & Admin Actions */}
            <div className="space-y-6">
              {/* System Logs Preview */}
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                  <h3 className="text-lg font-bold text-white">System Logs Preview</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {systemLogs.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {systemLogs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold text-white">{log.service}</p>
                              <p className="text-xs text-slate-500 font-mono">{formatDate(log.timestamp)}</p>
                            </div>
                            <p className="text-xs text-slate-400">{log.message}</p>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No system logs available.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                  <button className="w-full text-center text-sm font-semibold text-blue-400 hover:text-blue-300">
                    View All Logs →
                  </button>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-slate-700 text-slate-400 rounded-lg font-semibold text-sm cursor-not-allowed opacity-50"
                  >
                    Restart Service
                  </button>
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-slate-700 text-slate-400 rounded-lg font-semibold text-sm cursor-not-allowed opacity-50"
                  >
                    Enable Maintenance Mode
                  </button>
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-slate-700 text-slate-400 rounded-lg font-semibold text-sm cursor-not-allowed opacity-50"
                  >
                    Clear Cache
                  </button>
                </div>
                <p className="mt-4 text-xs text-slate-500 text-center">
                  Actions are disabled in read-only mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
