'use client';

import React, { useState } from 'react';

type UserRole = 'simple-user' | 'engo' | 'corporate' | 'carbon' | 'admin';
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
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);

  // Mock users data
  const allUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'corporate',
      portalAccess: ['Corporate ESG'],
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'carbon',
      portalAccess: ['Carbon Marketplace'],
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '15 min ago',
    },
    {
      id: '3',
      name: 'Emma Williams',
      email: 'emma.williams@example.com',
      role: 'engo',
      portalAccess: ['NGO Portal'],
      status: 'active',
      joinDate: '2024-01-08',
      lastActive: '1 day ago',
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'corporate',
      portalAccess: ['Corporate ESG'],
      status: 'suspended',
      joinDate: '2024-03-15',
      lastActive: '5 days ago',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'carbon',
      portalAccess: ['Carbon Marketplace'],
      status: 'pending',
      joinDate: '2024-03-18',
      lastActive: 'Never',
    },
    {
      id: '6',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'admin',
      portalAccess: ['Admin Portal'],
      status: 'active',
      joinDate: '2023-11-01',
      lastActive: '30 min ago',
    },
    {
      id: '7',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'simple-user',
      portalAccess: [],
      status: 'active',
      joinDate: '2024-02-10',
      lastActive: '3 hours ago',
    },
    {
      id: '8',
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      role: 'engo',
      portalAccess: ['NGO Portal'],
      status: 'active',
      joinDate: '2024-01-25',
      lastActive: '1 hour ago',
    },
    {
      id: '9',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@example.com',
      role: 'carbon',
      portalAccess: ['Carbon Marketplace'],
      status: 'active',
      joinDate: '2023-12-15',
      lastActive: '45 min ago',
    },
    {
      id: '10',
      name: 'Thomas Moore',
      email: 'thomas.moore@example.com',
      role: 'corporate',
      portalAccess: ['Corporate ESG'],
      status: 'active',
      joinDate: '2024-02-05',
      lastActive: '12 hours ago',
    },
  ];

  // Filter users
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesPortal =
      portalFilter === 'all' ||
      user.portalAccess.some((portal) => portal === portalFilter);

    return matchesSearch && matchesStatus && matchesRole && matchesPortal;
  });

  // Stats
  const stats = {
    total: allUsers.length,
    active: allUsers.filter((u) => u.status === 'active').length,
    pending: allUsers.filter((u) => u.status === 'pending').length,
    suspended: allUsers.filter((u) => u.status === 'suspended').length,
  };

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
      engo: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      corporate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      carbon: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return styles[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      'simple-user': 'Simple User',
      engo: 'ENGO',
      corporate: 'Corporate',
      carbon: 'Carbon',
      admin: 'Admin',
    };
    return labels[role];
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    // In a real app, this would navigate to user details page
    console.log('View user:', user);
  };

  const handleSuspendUser = (user: User) => {
    if (confirm(`Are you sure you want to ${user.status === 'suspended' ? 'reactivate' : 'suspend'} ${user.name}?`)) {
      // In a real app, this would call an API
      console.log(`${user.status === 'suspended' ? 'Reactivate' : 'Suspend'} user:`, user.id);
    }
  };

  const handleChangeRole = (user: User) => {
    setUserToChangeRole(user);
    setShowRoleChangeModal(true);
  };

  const handleRoleChangeSubmit = (newRole: UserRole) => {
    if (userToChangeRole && confirm(`Change ${userToChangeRole.name}'s role to ${getRoleLabel(newRole)}?`)) {
      // In a real app, this would call an API
      console.log('Change role:', userToChangeRole.id, 'to', newRole);
      setShowRoleChangeModal(false);
      setUserToChangeRole(null);
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
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Manage user accounts, roles, and portal access permissions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Users</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stats.active}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{stats.pending}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Pending</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{stats.suspended}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Suspended</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Roles</option>
                  <option value="simple-user">Simple User</option>
                  <option value="engo">ENGO</option>
                  <option value="corporate">Corporate</option>
                  <option value="carbon">Carbon</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={portalFilter}
                  onChange={(e) => setPortalFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
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

            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No users found</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Role Modal */}
      {showRoleChangeModal && userToChangeRole && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change User Role</h3>
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
              {(['simple-user', 'engo', 'corporate', 'carbon', 'admin'] as UserRole[]).map((role) => (
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
