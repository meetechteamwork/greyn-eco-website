'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSimpleToast } from '@/components/Toast';
import { api } from '@/utils/api';

type ActionType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'access' | 'permission_change' | 'security_event' | 'data_export' | 'password_change' | 'role_change' | 'suspension';
type Severity = 'low' | 'medium' | 'high' | 'critical';
type Status = 'success' | 'failed' | 'warning';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: ActionType;
  resource: string;
  details: string;
  severity: Severity;
  status: Status;
  ipAddress: string;
  userAgent: string;
  location?: string;
  hash?: string;
  sessionId?: string;
}

const DEFAULT_STATS = { total: 0, critical: 0, high: 0, medium: 0, low: 0, failed: 0, success: 0, warning: 0 };
const ITEMS_PER_PAGE = 15;

export default function AuditLogsPage() {
  const { showToast } = useSimpleToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [pagination, setPagination] = useState({ page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 1 });

  const [exportLoading, setExportLoading] = useState(false);
  const [verifyIntegrityLoading, setVerifyIntegrityLoading] = useState(false);
  const [exportEntryLoading, setExportEntryLoading] = useState(false);
  const [verifyHashLoading, setVerifyHashLoading] = useState(false);

  const fetchIdRef = useRef(0);

  // Debounce search; reset to page 1 when applying new search (setCurrentPage(1) when already 1 is a no-op)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchLogs = useCallback(async () => {
    const thisId = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    let res: { success?: boolean; message?: string; data?: { logs?: AuditLog[]; stats?: typeof DEFAULT_STATS; pagination?: { page: number; limit: number; total: number; totalPages: number } } };
    try {
      res = await api.admin.auditLogs.getList({
        search: debouncedSearch,
        severity: severityFilter,
        action: actionFilter,
        status: statusFilter,
        dateRange,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        includeSeed: true,
      });
    } catch (e) {
      if (thisId !== fetchIdRef.current) return;
      setLoading(false);
      const msg = (e as { message?: string })?.message || 'Failed to fetch audit logs';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    if (thisId !== fetchIdRef.current) return;
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Failed to fetch audit logs');
      showToast(res.message || 'Failed to fetch audit logs', 'error');
      return;
    }
    const d = res.data;
    if (!d) {
      setError('Invalid response');
      return;
    }
    setLogs(d.logs || []);
    setStats(d.stats || DEFAULT_STATS);
    setPagination(d.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 1 });
  }, [debouncedSearch, severityFilter, actionFilter, statusFilter, dateRange, currentPage, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await api.admin.auditLogs.exportDownload(
        { search: debouncedSearch, severity: severityFilter, action: actionFilter, status: statusFilter, dateRange, includeSeed: true },
        'csv'
      );
      showToast('Audit logs exported successfully', 'success');
    } catch (e: unknown) {
      showToast((e as { message?: string })?.message || 'Export failed', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    if (logs.length === 0) {
      showToast('No logs to verify', 'info');
      return;
    }
    setVerifyIntegrityLoading(true);
    try {
      const results = await Promise.all(logs.map((l) => api.admin.auditLogs.verify(l.id, true)));
      const passed = results.filter((r) => r.success && (r as { data?: { valid?: boolean } }).data?.valid).length;
      const failed = results.length - passed;
      if (failed === 0) showToast(`${passed} of ${results.length} logs verified successfully`, 'success');
      else showToast(`${passed} passed, ${failed} failed`, 'warning');
    } catch (e: unknown) {
      showToast((e as { message?: string })?.message || 'Verification failed', 'error');
    } finally {
      setVerifyIntegrityLoading(false);
    }
  };

  const handleExportEntry = async () => {
    if (!selectedLog) return;
    setExportEntryLoading(true);
    try {
      const res = await api.admin.auditLogs.getExportOne(selectedLog.id, true);
      if (!res.success || (res as { data?: unknown }).data == null) {
        showToast((res as { message?: string }).message || 'Export failed', 'error');
        return;
      }
      const data = (res as { data: unknown }).data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${selectedLog.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Entry exported', 'success');
    } catch (e: unknown) {
      showToast((e as { message?: string })?.message || 'Export failed', 'error');
    } finally {
      setExportEntryLoading(false);
    }
  };

  const handleVerifyHash = async () => {
    if (!selectedLog) return;
    setVerifyHashLoading(true);
    try {
      const res = await api.admin.auditLogs.verify(selectedLog.id, true);
      if (!res.success) {
        showToast((res as { message?: string }).message || 'Verify failed', 'error');
        return;
      }
      const { valid, message } = ((res as { data?: { valid?: boolean; message?: string } }).data) || {};
      showToast(message || (valid ? 'Integrity verified' : 'Hash mismatch'), valid ? 'success' : 'error');
    } catch (e: unknown) {
      showToast((e as { message?: string })?.message || 'Verify failed', 'error');
    } finally {
      setVerifyHashLoading(false);
    }
  };

  const getSeverityColor = (severity: Severity) => {
    const colors = {
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    };
    return colors[severity];
  };

  const getStatusColor = (status: Status) => {
    const colors = {
      success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    };
    return colors[status];
  };

  const getActionIcon = (action: ActionType) => {
    const icons: Record<ActionType, React.ReactNode> = {
      login: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>,
      logout: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
      create: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4"></path></svg>,
      update: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
      delete: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
      access: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>,
      permission_change: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
      security_event: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
      data_export: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
      password_change: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>,
      role_change: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
      suspension: <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>,
    };
    return icons[action] ?? icons.access;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const formatHash = (hash: string | undefined) => (hash && hash.length >= 24 ? `${hash.substring(0, 12)}...${hash.substring(hash.length - 12)}` : (hash || '—'));

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const { totalPages } = pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Audit Logs</h1>
                <p className="text-lg text-slate-400">Complete security audit trail and activity monitoring</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExport} disabled={exportLoading} className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    {exportLoading ? <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                    Export
                  </div>
                </button>
                <button onClick={handleVerifyIntegrity} disabled={verifyIntegrityLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <div className="flex items-center gap-2">
                    {verifyIntegrityLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
                    Verify Integrity
                  </div>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-200 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-red-500/20"><svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div></div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.critical}</p>
              <p className="text-sm text-slate-400">Critical Events</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-orange-500/20"><svg className="w-6 h-6 text-orange-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div></div>
              <p className="text-3xl font-bold text-orange-400 mb-1">{stats.high}</p>
              <p className="text-sm text-slate-400">High Severity</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-yellow-500/20"><svg className="w-6 h-6 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.failed}</p>
              <p className="text-sm text-slate-400">Failed Actions</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-emerald-500/20"><svg className="w-6 h-6 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Logs</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                  <input type="text" placeholder="Search by actor, resource, IP, hash..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Severity</label>
                <select value={severityFilter} onChange={(e) => handleFilterChange(setSeverityFilter, e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="all">All Severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Action</label>
                <select value={actionFilter} onChange={(e) => handleFilterChange(setActionFilter, e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="all">All Actions</option><option value="login">Login</option><option value="logout">Logout</option><option value="create">Create</option><option value="update">Update</option><option value="delete">Delete</option><option value="access">Access</option><option value="permission_change">Permission Change</option><option value="security_event">Security Event</option><option value="data_export">Data Export</option><option value="password_change">Password Change</option><option value="role_change">Role Change</option><option value="suspension">Suspension</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="all">All Statuses</option><option value="success">Success</option><option value="failed">Failed</option><option value="warning">Warning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
                <select value={dateRange} onChange={(e) => handleFilterChange(setDateRange, e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="all">All Time</option><option value="today">Last 24 Hours</option><option value="week">Last 7 Days</option><option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Audit Trail ({pagination.total} entries)</h2>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-400">Page {pagination.page} of {totalPages}</span></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Resource</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Severity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">IP Address</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Hash</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={9} className="px-6 py-12 text-center"><div className="flex flex-col items-center"><span className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-slate-400">Loading audit logs…</p></div></td></tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <p className="text-lg font-semibold text-slate-400">No audit logs found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or run seed: npm run seed:audit-logs</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4"><p className="text-sm font-mono text-slate-300">{formatDate(log.timestamp)}</p></td>
                        <td className="px-6 py-4"><div><p className="text-sm font-semibold text-white">{log.actor}</p>{log.actorRole && <span className="text-xs text-slate-400">{log.actorRole}</span>}</div></td>
                        <td className="px-6 py-4"><div className="flex items-center gap-2"><span className="p-1.5 rounded-lg bg-slate-700 text-slate-300">{getActionIcon(log.action)}</span><span className="text-sm text-slate-300 capitalize">{(log.action as string).replace('_', ' ')}</span></div></td>
                        <td className="px-6 py-4"><p className="text-sm text-slate-300 max-w-xs truncate" title={log.resource}>{log.resource}</p><p className="text-xs text-slate-500 mt-1 max-w-xs truncate" title={log.details}>{log.details}</p></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(log.severity)}`}>{log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>{log.status.charAt(0).toUpperCase() + log.status.slice(1)}</span></td>
                        <td className="px-6 py-4"><div><p className="text-sm font-mono text-slate-300">{log.ipAddress}</p>{log.location && <p className="text-xs text-slate-500 mt-1">{log.location}</p>}</div></td>
                        <td className="px-6 py-4"><code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded block max-w-xs truncate" title={log.hash || ''}>{formatHash(log.hash)}</code></td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleViewDetails(log)} className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors" title="View Details">
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={pagination.page === 1} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${pagination.page === page ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 'text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600'}`}>{page}</button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={pagination.page === totalPages} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Audit Log Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getSeverityColor(selectedLog.severity)}`}>{selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)} Severity</span>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg ${getStatusColor(selectedLog.status)}`}>{selectedLog.status.charAt(0).toUpperCase() + selectedLog.status.slice(1)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-400 mb-1">Log ID</p><code className="text-lg font-mono text-white bg-slate-900 px-3 py-2 rounded block">{selectedLog.id}</code></div>
                <div><p className="text-sm text-slate-400 mb-1">Timestamp</p><p className="text-lg text-white">{formatDate(selectedLog.timestamp)}</p></div>
                <div><p className="text-sm text-slate-400 mb-1">Actor</p><p className="text-lg font-semibold text-white">{selectedLog.actor}</p>{selectedLog.actorRole && <p className="text-sm text-slate-400 mt-1">{selectedLog.actorRole}</p>}</div>
                <div><p className="text-sm text-slate-400 mb-1">Action</p><div className="flex items-center gap-2"><span className="p-2 rounded-lg bg-slate-700 text-slate-300">{getActionIcon(selectedLog.action)}</span><span className="text-lg text-white capitalize">{(selectedLog.action as string).replace('_', ' ')}</span></div></div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Resource & Details</h4>
                <div className="space-y-3"><div><p className="text-sm text-slate-400 mb-1">Resource</p><p className="text-white">{selectedLog.resource}</p></div><div><p className="text-sm text-slate-400 mb-1">Details</p><p className="text-white">{selectedLog.details}</p></div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-400 mb-1">IP Address</p><code className="text-lg font-mono text-white bg-slate-900 px-3 py-2 rounded block">{selectedLog.ipAddress}</code></div>
                {selectedLog.location && <div><p className="text-sm text-slate-400 mb-1">Location</p><p className="text-lg text-white">{selectedLog.location}</p></div>}
                {selectedLog.sessionId && <div><p className="text-sm text-slate-400 mb-1">Session ID</p><code className="text-sm font-mono text-slate-300 bg-slate-900 px-3 py-2 rounded block">{selectedLog.sessionId}</code></div>}
                <div><p className="text-sm text-slate-400 mb-1">User Agent</p><p className="text-sm text-slate-300 break-all">{selectedLog.userAgent}</p></div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Integrity Hash</h4>
                <code className="text-sm font-mono text-slate-300 bg-slate-800 px-3 py-2 rounded block break-all">{selectedLog.hash || '—'}</code>
                <p className="text-xs text-slate-500 mt-2">This hash ensures the integrity and immutability of this audit log entry.</p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button onClick={handleExportEntry} disabled={exportEntryLoading} className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors disabled:opacity-60">
                  {exportEntryLoading ? 'Exporting…' : 'Export Entry'}
                </button>
                <button onClick={handleVerifyHash} disabled={verifyHashLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60">
                  {verifyHashLoading ? 'Verifying…' : 'Verify Hash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
