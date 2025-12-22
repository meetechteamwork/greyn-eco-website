'use client';

import React, { useState, useMemo } from 'react';

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
  hash: string;
  sessionId?: string;
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Mock audit logs data
  const allAuditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-03-25T14:30:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'permission_change',
      resource: 'User: sarah.johnson@example.com',
      details: 'Changed role from Simple User to Corporate Admin',
      severity: 'high',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x8f7e6d5c4b3a291807060504030201009f8e7d6c5b4a39281716151413121110',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '2',
      timestamp: '2024-03-25T14:25:00Z',
      actor: 'security@greyn-eco.com',
      actorRole: 'Security System',
      action: 'security_event',
      resource: 'IP: 203.0.113.45',
      details: 'Blocked IP due to suspicious activity - Multiple failed login attempts',
      severity: 'critical',
      status: 'success',
      ipAddress: '203.0.113.45',
      userAgent: 'Unknown',
      location: 'Unknown',
      hash: '0x7e6d5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f',
    },
    {
      id: '3',
      timestamp: '2024-03-25T14:20:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'create',
      resource: 'Transaction: TXN-2024-001234',
      details: 'Created new transaction record for carbon credit purchase',
      severity: 'low',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x6d5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '4',
      timestamp: '2024-03-25T14:15:00Z',
      actor: 'user@example.com',
      actorRole: 'User',
      action: 'login',
      resource: 'Authentication',
      details: 'Failed login attempt - Invalid credentials',
      severity: 'medium',
      status: 'failed',
      ipAddress: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'San Francisco, USA',
      hash: '0x5c4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d',
    },
    {
      id: '5',
      timestamp: '2024-03-25T14:10:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'update',
      resource: 'Role: Security Admin',
      details: 'Updated permissions for Security Admin role - Added audit log access',
      severity: 'high',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x4b3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '6',
      timestamp: '2024-03-25T14:05:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'access',
      resource: '/admin/security',
      details: 'Accessed security operations page',
      severity: 'low',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x3a291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '7',
      timestamp: '2024-03-25T14:00:00Z',
      actor: 'corporate@example.com',
      actorRole: 'Corporate Admin',
      action: 'data_export',
      resource: 'Export: User List',
      details: 'Exported user list data to CSV',
      severity: 'medium',
      status: 'success',
      ipAddress: '172.16.0.50',
      userAgent: 'Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36',
      location: 'London, UK',
      hash: '0x291807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a',
      sessionId: 'sess_def456uvw',
    },
    {
      id: '8',
      timestamp: '2024-03-25T13:55:00Z',
      actor: 'user@example.com',
      actorRole: 'User',
      action: 'password_change',
      resource: 'Account: user@example.com',
      details: 'Password changed successfully',
      severity: 'medium',
      status: 'success',
      ipAddress: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'San Francisco, USA',
      hash: '0x1807060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a09',
      sessionId: 'sess_ghi789rst',
    },
    {
      id: '9',
      timestamp: '2024-03-25T13:50:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'role_change',
      resource: 'User: michael.chen@example.com',
      details: 'Changed user role from Carbon Buyer to Verifier',
      severity: 'high',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x07060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a0908',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '10',
      timestamp: '2024-03-25T13:45:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'suspension',
      resource: 'User: david.brown@example.com',
      details: 'Suspended user account due to policy violation',
      severity: 'critical',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x060504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a090807',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '11',
      timestamp: '2024-03-25T13:40:00Z',
      actor: 'unknown@example.com',
      actorRole: 'Unknown',
      action: 'login',
      resource: 'Authentication',
      details: 'Failed login attempt - Account does not exist',
      severity: 'medium',
      status: 'failed',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      location: 'Unknown',
      hash: '0x0504030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a09080706',
    },
    {
      id: '12',
      timestamp: '2024-03-25T13:35:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'delete',
      resource: 'Invitation: INV-2024-006',
      details: 'Deleted expired invitation',
      severity: 'low',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x04030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a0908070605',
      sessionId: 'sess_abc123xyz',
    },
    {
      id: '13',
      timestamp: '2024-03-25T13:30:00Z',
      actor: 'verifier@certification.org',
      actorRole: 'Verifier',
      action: 'update',
      resource: 'Project: Amazon Reforestation',
      details: 'Updated project verification status to Verified',
      severity: 'high',
      status: 'success',
      ipAddress: '10.0.0.25',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Berlin, Germany',
      hash: '0x030201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a090807060504',
      sessionId: 'sess_jkl012mno',
    },
    {
      id: '14',
      timestamp: '2024-03-25T13:25:00Z',
      actor: 'admin@greyn-eco.com',
      actorRole: 'Admin',
      action: 'logout',
      resource: 'Session: sess_xyz789abc',
      details: 'User logged out successfully',
      severity: 'low',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      hash: '0x0201009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a09080706050403',
      sessionId: 'sess_xyz789abc',
    },
    {
      id: '15',
      timestamp: '2024-03-25T13:20:00Z',
      actor: 'security@greyn-eco.com',
      actorRole: 'Security System',
      action: 'security_event',
      resource: 'Rate Limit',
      details: 'Rate limit exceeded for IP 198.51.100.23 - Temporary block applied',
      severity: 'high',
      status: 'warning',
      ipAddress: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'San Francisco, USA',
      hash: '0x01009f8e7d6c5b4a392817161514131211100f0e0d0c0b0a0908070605040302',
    },
  ];

  // Filter logs
  const filteredLogs = useMemo(() => {
    return allAuditLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.hash.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      
      // Date range filter (simplified)
      let matchesDate = true;
      if (dateRange !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        const hoursDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60));
        
        if (dateRange === 'today' && hoursDiff > 24) matchesDate = false;
        if (dateRange === 'week' && hoursDiff > 168) matchesDate = false;
        if (dateRange === 'month' && hoursDiff > 720) matchesDate = false;
      }
      
      return matchesSearch && matchesSeverity && matchesAction && matchesStatus && matchesDate;
    });
  }, [searchQuery, severityFilter, actionFilter, statusFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      critical: filteredLogs.filter((l) => l.severity === 'critical').length,
      high: filteredLogs.filter((l) => l.severity === 'high').length,
      medium: filteredLogs.filter((l) => l.severity === 'medium').length,
      low: filteredLogs.filter((l) => l.severity === 'low').length,
      failed: filteredLogs.filter((l) => l.status === 'failed').length,
      success: filteredLogs.filter((l) => l.status === 'success').length,
      warning: filteredLogs.filter((l) => l.status === 'warning').length,
    };
  }, [filteredLogs]);

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
    const icons = {
      login: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
      ),
      logout: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      ),
      create: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4v16m8-8H4"></path>
        </svg>
      ),
      update: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      ),
      delete: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      ),
      access: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      ),
      permission_change: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      security_event: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      ),
      data_export: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      password_change: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
        </svg>
      ),
      role_change: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      suspension: (
        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
        </svg>
      ),
    };
    return icons[action] || icons.access;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 12)}...${hash.substring(hash.length - 12)}`;
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
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
                  Audit Logs
                </h1>
                <p className="text-lg text-slate-400">Complete security audit trail and activity monitoring</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export
                  </div>
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Verify Integrity
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
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.critical}</p>
              <p className="text-sm text-slate-400">Critical Events</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <svg className="w-6 h-6 text-orange-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-400 mb-1">{stats.high}</p>
              <p className="text-sm text-slate-400">High Severity</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.failed}</p>
              <p className="text-sm text-slate-400">Failed Actions</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Logs</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by actor, resource, IP, hash..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Action Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Action</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  <option value="data_export">Data Export</option>
                  <option value="password_change">Password Change</option>
                  <option value="role_change">Role Change</option>
                  <option value="suspension">Suspension</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Audit Trail ({filteredLogs.length} entries)</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
                </div>
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
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="text-lg font-semibold text-slate-400">No audit logs found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-slate-300">{formatDate(log.timestamp)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-white">{log.actor}</p>
                            {log.actorRole && (
                              <span className="text-xs text-slate-400">{log.actorRole}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-slate-700 text-slate-300">
                              {getActionIcon(log.action)}
                            </span>
                            <span className="text-sm text-slate-300 capitalize">
                              {log.action.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-300 max-w-xs truncate" title={log.resource}>
                            {log.resource}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(log.severity)}`}>
                            {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-mono text-slate-300">{log.ipAddress}</p>
                            {log.location && (
                              <p className="text-xs text-slate-500 mt-1">{log.location}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded block max-w-xs truncate" title={log.hash}>
                            {formatHash(log.hash)}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : 'text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Audit Log Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getSeverityColor(selectedLog.severity)}`}>
                  {selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)} Severity
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg ${getStatusColor(selectedLog.status)}`}>
                  {selectedLog.status.charAt(0).toUpperCase() + selectedLog.status.slice(1)}
                </span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Log ID</p>
                  <code className="text-lg font-mono text-white bg-slate-900 px-3 py-2 rounded block">{selectedLog.id}</code>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Timestamp</p>
                  <p className="text-lg text-white">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Actor</p>
                  <p className="text-lg font-semibold text-white">{selectedLog.actor}</p>
                  {selectedLog.actorRole && (
                    <p className="text-sm text-slate-400 mt-1">{selectedLog.actorRole}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Action</p>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-slate-700 text-slate-300">
                      {getActionIcon(selectedLog.action)}
                    </span>
                    <span className="text-lg text-white capitalize">
                      {selectedLog.action.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resource & Details */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Resource & Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Resource</p>
                    <p className="text-white">{selectedLog.resource}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Details</p>
                    <p className="text-white">{selectedLog.details}</p>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">IP Address</p>
                  <code className="text-lg font-mono text-white bg-slate-900 px-3 py-2 rounded block">{selectedLog.ipAddress}</code>
                </div>
                {selectedLog.location && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="text-lg text-white">{selectedLog.location}</p>
                  </div>
                )}
                {selectedLog.sessionId && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Session ID</p>
                    <code className="text-sm font-mono text-slate-300 bg-slate-900 px-3 py-2 rounded block">{selectedLog.sessionId}</code>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 mb-1">User Agent</p>
                  <p className="text-sm text-slate-300 break-all">{selectedLog.userAgent}</p>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Integrity Hash</h4>
                <code className="text-sm font-mono text-slate-300 bg-slate-800 px-3 py-2 rounded block break-all">
                  {selectedLog.hash}
                </code>
                <p className="text-xs text-slate-500 mt-2">This hash ensures the integrity and immutability of this audit log entry.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                  Export Entry
                </button>
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  Verify Hash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

