'use client';

import React, { useState, useMemo } from 'react';

type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';
type InvitationRole = 'corporate' | 'engo' | 'carbon' | 'admin' | 'verifier';
type InvitationPortal = 'Corporate ESG' | 'Carbon Marketplace' | 'NGO Portal' | 'Admin Portal';

interface Invitation {
  id: string;
  email: string;
  role: InvitationRole;
  portal: InvitationPortal;
  status: InvitationStatus;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  invitationCode: string;
}

export default function AdminInvitationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [portalFilter, setPortalFilter] = useState<string>('all');
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Mock invitations data
  const allInvitations: Invitation[] = [
    {
      id: '1',
      email: 'john.doe@corporation.com',
      role: 'corporate',
      portal: 'Corporate ESG',
      status: 'pending',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-25T10:00:00Z',
      expiresAt: '2024-04-01T10:00:00Z',
      invitationCode: 'INV-CORP-2024-001',
    },
    {
      id: '2',
      email: 'jane.smith@ngo.org',
      role: 'engo',
      portal: 'NGO Portal',
      status: 'accepted',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-20T14:30:00Z',
      expiresAt: '2024-03-27T14:30:00Z',
      acceptedAt: '2024-03-21T09:15:00Z',
      invitationCode: 'INV-ENGO-2024-002',
    },
    {
      id: '3',
      email: 'carbon.buyer@investor.com',
      role: 'carbon',
      portal: 'Carbon Marketplace',
      status: 'pending',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-24T16:00:00Z',
      expiresAt: '2024-03-31T16:00:00Z',
      invitationCode: 'INV-CARB-2024-003',
    },
    {
      id: '4',
      email: 'verifier@certification.org',
      role: 'verifier',
      portal: 'Carbon Marketplace',
      status: 'accepted',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-18T11:00:00Z',
      expiresAt: '2024-03-25T11:00:00Z',
      acceptedAt: '2024-03-19T08:30:00Z',
      invitationCode: 'INV-VER-2024-004',
    },
    {
      id: '5',
      email: 'expired@example.com',
      role: 'corporate',
      portal: 'Corporate ESG',
      status: 'expired',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-10T09:00:00Z',
      expiresAt: '2024-03-17T09:00:00Z',
      invitationCode: 'INV-CORP-2024-005',
    },
    {
      id: '6',
      email: 'revoked@example.com',
      role: 'engo',
      portal: 'NGO Portal',
      status: 'revoked',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-15T13:00:00Z',
      expiresAt: '2024-03-22T13:00:00Z',
      invitationCode: 'INV-ENGO-2024-006',
    },
    {
      id: '7',
      email: 'new.admin@company.com',
      role: 'admin',
      portal: 'Admin Portal',
      status: 'pending',
      invitedBy: 'Super Admin',
      invitedAt: '2024-03-25T08:00:00Z',
      expiresAt: '2024-04-01T08:00:00Z',
      invitationCode: 'INV-ADM-2024-007',
    },
    {
      id: '8',
      email: 'corporate2@business.com',
      role: 'corporate',
      portal: 'Corporate ESG',
      status: 'pending',
      invitedBy: 'Admin User',
      invitedAt: '2024-03-23T15:30:00Z',
      expiresAt: '2024-03-30T15:30:00Z',
      invitationCode: 'INV-CORP-2024-008',
    },
  ];

  // Filter invitations
  const filteredInvitations = useMemo(() => {
    return allInvitations.filter((invitation) => {
      const matchesSearch =
        invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invitation.invitationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invitation.invitedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
      const matchesRole = roleFilter === 'all' || invitation.role === roleFilter;
      const matchesPortal = portalFilter === 'all' || invitation.portal === portalFilter;
      return matchesSearch && matchesStatus && matchesRole && matchesPortal;
    });
  }, [searchQuery, statusFilter, roleFilter, portalFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allInvitations.length,
      pending: allInvitations.filter((i) => i.status === 'pending').length,
      accepted: allInvitations.filter((i) => i.status === 'accepted').length,
      expired: allInvitations.filter((i) => i.status === 'expired').length,
      revoked: allInvitations.filter((i) => i.status === 'revoked').length,
    };
  }, []);

  const getStatusColor = (status: InvitationStatus) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      expired: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      revoked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return colors[status];
  };

  const getRoleColor = (role: InvitationRole) => {
    const colors = {
      corporate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      engo: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      carbon: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      verifier: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    };
    return colors[role];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleResend = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setShowResendModal(true);
  };

  const handleRevoke = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setShowRevokeModal(true);
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
                  Invitations Management
                </h1>
                <p className="text-lg text-slate-400">Manage user invitations and access requests</p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4v16m8-8H4"></path>
                  </svg>
                  Send New Invitation
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Invitations</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.pending}</p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">{stats.accepted}</p>
              <p className="text-sm text-slate-400">Accepted</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-500/20">
                  <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-400 mb-1">{stats.expired}</p>
              <p className="text-sm text-slate-400">Expired</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <svg className="w-6 h-6 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.revoked}</p>
              <p className="text-sm text-slate-400">Revoked</p>
            </div>
          </div>

          {/* Filters and Search */}
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
                    placeholder="Search by email, code, or inviter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="corporate">Corporate</option>
                  <option value="engo">NGO</option>
                  <option value="carbon">Carbon</option>
                  <option value="admin">Admin</option>
                  <option value="verifier">Verifier</option>
                </select>
              </div>
            </div>

            {/* Portal Filter */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Portal</label>
              <select
                value={portalFilter}
                onChange={(e) => setPortalFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Portals</option>
                <option value="Corporate ESG">Corporate ESG</option>
                <option value="Carbon Marketplace">Carbon Marketplace</option>
                <option value="NGO Portal">NGO Portal</option>
                <option value="Admin Portal">Admin Portal</option>
              </select>
            </div>
          </div>

          {/* Invitations Table */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Invitations ({filteredInvitations.length})</h2>
                <button className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Portal</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Invited By</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Invited At</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Expires</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-lg font-semibold text-slate-400">No invitations found</p>
                          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map((invitation) => {
                      const daysUntilExpiry = getDaysUntilExpiry(invitation.expiresAt);
                      const isExpiringSoon = daysUntilExpiry <= 3 && invitation.status === 'pending';

                      return (
                        <tr key={invitation.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-white">{invitation.email}</p>
                              <code className="text-xs text-slate-400 font-mono mt-1">{invitation.invitationCode}</code>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(invitation.role)}`}>
                              {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-300">{invitation.portal}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invitation.status)}`}>
                              {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-300">{invitation.invitedBy}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-300">{formatDate(invitation.invitedAt)}</p>
                            {invitation.acceptedAt && (
                              <p className="text-xs text-green-400 mt-1">Accepted: {formatDate(invitation.acceptedAt)}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className={`text-sm ${isExpiringSoon ? 'text-yellow-400 font-semibold' : 'text-slate-300'}`}>
                                {formatDate(invitation.expiresAt)}
                              </p>
                              {invitation.status === 'pending' && (
                                <p className={`text-xs mt-1 ${isExpiringSoon ? 'text-yellow-400' : 'text-slate-500'}`}>
                                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {invitation.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleResend(invitation)}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                    title="Resend Invitation"
                                  >
                                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleRevoke(invitation)}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                    title="Revoke Invitation"
                                  >
                                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </>
                              )}
                              {invitation.status === 'expired' && (
                                <button
                                  onClick={() => handleResend(invitation)}
                                  className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                  title="Resend Invitation"
                                >
                                  Resend
                                </button>
                              )}
                              <button
                                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Resend Modal (Placeholder) */}
      {showResendModal && selectedInvitation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Resend Invitation</h3>
            <p className="text-slate-400 mb-6">
              Resend invitation email to <span className="text-white font-semibold">{selectedInvitation.email}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResendModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // UI only - no backend logic
                  setShowResendModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Modal (Placeholder) */}
      {showRevokeModal && selectedInvitation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Revoke Invitation</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to revoke the invitation for <span className="text-white font-semibold">{selectedInvitation.email}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // UI only - no backend logic
                  setShowRevokeModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

