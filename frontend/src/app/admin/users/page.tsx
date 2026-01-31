'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';

type UserRole = 'simple-user' | 'ngo' | 'corporate' | 'carbon' | 'admin';
type UserStatus = 'active' | 'suspended' | 'pending';
type PortalAccess = 'Corporate ESG' | 'Carbon Marketplace' | 'NGO Portal' | 'Admin Portal';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  portalAccess: PortalAccess[];
  status: UserStatus;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [portalFilter, setPortalFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters: any = {};
        if (searchQuery) filters.search = searchQuery;
        if (statusFilter !== 'all') filters.status = statusFilter;
        if (roleFilter !== 'all') filters.role = roleFilter;
        if (portalFilter !== 'all') filters.portal = portalFilter;

        const [usersResponse, statsResponse] = await Promise.all([
          api.admin.users.getAll(filters),
          api.admin.users.getStats()
        ]);

        if (usersResponse.success && usersResponse.data) {
          const usersData = usersResponse.data as any;
          setAllUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          setError(usersResponse.message || 'Failed to fetch users');
        }

        if (statsResponse.success && statsResponse.data) {
          const statsData = statsResponse.data as any;
          setStats(statsData);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, statusFilter, roleFilter, portalFilter]);

  // All filtering is done on backend
  const filteredUsers = allUsers;

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return styles[status];
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      'simple-user': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      ngo: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      corporate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      carbon: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return styles[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      'simple-user': 'Simple User',
      ngo: 'NGO',
      corporate: 'Corporate',
      carbon: 'Carbon',
      admin: 'Admin',
    };
    return labels[role];
  };

  const handleViewUser = async (user: User) => {
    try {
      // Fetch full user details from API
      const response = await api.admin.users.getById(user.id);
      if (response.success && response.data) {
        const userData = response.data as any;
        setSelectedUser(userData);
        setShowViewModal(true);
      } else {
        // Fallback to local user data
        setSelectedUser(user);
        setShowViewModal(true);
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      // Fallback to local user data
      setSelectedUser(user);
      setShowViewModal(true);
    }
  };

  const handleSuspendUser = async (user: User) => {
    const action = user.status === 'suspended' ? 'reactivate' : 'suspend';
    const message = user.status === 'suspended' 
      ? `Are you sure you want to reactivate ${user.name}? They will regain access to their portal.`
      : `Are you sure you want to suspend ${user.name}? They will lose access to their portal.`;
    
    if (confirm(message)) {
      try {
        const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
        const response = await api.admin.users.updateStatus(user.id, newStatus);
        
        if (response.success && response.data) {
          // Update the user in the list with fresh data from backend
          // Backend ensures portal access is restored when status is active
          const updatedUser = response.data as any;
          setAllUsers(prevUsers =>
            prevUsers.map(u => u.id === user.id ? updatedUser : u)
          );

          // Update selectedUser if it's the same user being viewed
          if (selectedUser && selectedUser.id === user.id) {
            setSelectedUser(updatedUser);
          }

          // Refresh stats
          const statsResponse = await api.admin.users.getStats();
          if (statsResponse.success && statsResponse.data) {
            const statsData = statsResponse.data as any;
            setStats(statsData);
          }
          
          // Show success message with portal access info
          const portalInfo = updatedUser.status === 'active' && updatedUser.portalAccess.length > 0
            ? ` Portal access: ${updatedUser.portalAccess.join(', ')}`
            : updatedUser.status === 'active' 
              ? ' (No portal access for this role)'
              : '';
          alert(`User ${action === 'reactivate' ? 'reactivated' : 'suspended'} successfully!${portalInfo}`);
        } else {
          alert(response.message || 'Failed to update user status');
        }
      } catch (err: any) {
        console.error('Error updating user status:', err);
        alert('Failed to update user status. Please try again.');
      }
    }
  };

  const handleChangeRole = (user: User) => {
    setUserToChangeRole(user);
    setShowRoleChangeModal(true);
  };

  const handleRoleChangeSubmit = async (newRole: UserRole) => {
    if (userToChangeRole && confirm(`Change ${userToChangeRole.name}'s role to ${getRoleLabel(newRole)}? This will update their portal access.`)) {
      try {
        const response = await api.admin.users.updateRole(userToChangeRole.id, newRole);
        
        if (response.success && response.data) {
          // Update the user in the list with fresh data from backend
          const updatedUser = response.data as any;
          setAllUsers(prevUsers =>
            prevUsers.map(u => u.id === userToChangeRole.id ? updatedUser : u)
          );

          // Refresh stats
          const statsResponse = await api.admin.users.getStats();
          if (statsResponse.success && statsResponse.data) {
            const statsData = statsResponse.data as any;
            setStats(statsData);
          }
          
          setShowRoleChangeModal(false);
          setUserToChangeRole(null);
          
          // Show success message
          alert(`User role changed successfully! Portal access has been updated.`);
        } else {
          alert(response.message || 'Failed to update user role');
        }
      } catch (err: any) {
        console.error('Error updating user role:', err);
        alert('Failed to update user role. Please try again.');
      }
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400">
              Manage user accounts, roles, and portal access permissions
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mb-8 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600 dark:text-slate-400">Loading users...</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="mb-6 sm:mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">Total Users</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stats.active}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">Active</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{stats.pending}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">Pending</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{stats.suspended}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">Suspended</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Roles</option>
                  <option value="simple-user">Simple User</option>
                  <option value="ngo">NGO</option>
                  <option value="corporate">Corporate</option>
                  <option value="carbon">Carbon</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={portalFilter}
                  onChange={(e) => setPortalFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Portals</option>
                  <option value="Corporate ESG">Corporate ESG</option>
                  <option value="Carbon Marketplace">Carbon Marketplace</option>
                  <option value="NGO Portal">NGO Portal</option>
                  <option value="Admin Portal">Admin Portal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {!loading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full">
                <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Portal Access</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                            {getUserInitials(user.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Last active: {user.lastActive}</p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      {/* Portal Access */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.portalAccess.length > 0 ? (
                            user.portalAccess.map((portal, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                              >
                                {portal}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-slate-500 italic">No portal access</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View User"
                          >
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSuspendUser(user)}
                            className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                            title={user.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                          >
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              {user.status === 'suspended' ? (
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              ) : (
                                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                              )}
                            </svg>
                          </button>
                          <button
                            onClick={() => handleChangeRole(user)}
                            className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            title="Change Role"
                          >
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="py-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No users found</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* View User Details Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">User Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {getUserInitials(selectedUser.name)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{selectedUser.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedUser.status)}`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(selectedUser.role)}`}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">User ID</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{selectedUser.id}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Join Date</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedUser.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Last Active</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.lastActive}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Account Status</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{selectedUser.status}</p>
                </div>
              </div>

              {/* Portal Access */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Portal Access</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.portalAccess.length > 0 ? (
                    selectedUser.portalAccess.map((portal, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                      >
                        {portal}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-slate-400 italic">No portal access</span>
                  )}
                </div>
                {selectedUser.status === 'active' && selectedUser.portalAccess.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                    This user has an active account but no portal access based on their role.
                  </p>
                )}
                {selectedUser.status === 'suspended' && (
                  <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    Portal access will be restored when this user is reactivated.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleChangeRole(selectedUser);
                  }}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Change Role
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleSuspendUser(selectedUser);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    selectedUser.status === 'suspended'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    {selectedUser.status === 'suspended' ? (
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    ) : (
                      <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    )}
                  </svg>
                  {selectedUser.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleChangeModal && userToChangeRole && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Change User Role</h3>
              <button
                onClick={() => {
                  setShowRoleChangeModal(false);
                  setUserToChangeRole(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
              Change role for <span className="font-semibold text-gray-900 dark:text-white">{userToChangeRole.name}</span>
            </p>
            <div className="space-y-2 mb-6">
              {(['simple-user', 'ngo', 'corporate', 'carbon', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChangeSubmit(role)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    userToChangeRole.role === role
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{getRoleLabel(role)}</span>
                  {userToChangeRole.role === role && (
                    <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Current)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
