'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  totalInvested: number;
  projectsCount: number;
  verified: boolean;
  location: string;
}

const AdminUsersPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Mock users data
  const allUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-01-15',
      totalInvested: 5500,
      projectsCount: 4,
      verified: true,
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-02-20',
      totalInvested: 12000,
      projectsCount: 7,
      verified: true,
      location: 'New York, NY'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-01-08',
      totalInvested: 8700,
      projectsCount: 5,
      verified: true,
      location: 'Los Angeles, CA'
    },
    {
      id: '4',
      name: 'Emma Williams',
      email: 'emma.w@example.com',
      role: 'investor',
      status: 'pending',
      joinDate: '2024-03-15',
      totalInvested: 0,
      projectsCount: 0,
      verified: false,
      location: 'Chicago, IL'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-02-01',
      totalInvested: 25000,
      projectsCount: 12,
      verified: true,
      location: 'Boston, MA'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      role: 'investor',
      status: 'suspended',
      joinDate: '2024-01-25',
      totalInvested: 3200,
      projectsCount: 2,
      verified: true,
      location: 'Seattle, WA'
    },
    {
      id: '7',
      name: 'James Wilson',
      email: 'james.w@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-11-01',
      totalInvested: 0,
      projectsCount: 0,
      verified: true,
      location: 'Austin, TX'
    },
    {
      id: '8',
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-02-10',
      totalInvested: 15500,
      projectsCount: 9,
      verified: true,
      location: 'Miami, FL'
    },
    {
      id: '9',
      name: 'Robert Taylor',
      email: 'robert.t@example.com',
      role: 'investor',
      status: 'pending',
      joinDate: '2024-03-18',
      totalInvested: 0,
      projectsCount: 0,
      verified: false,
      location: 'Denver, CO'
    },
    {
      id: '10',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-15',
      totalInvested: 0,
      projectsCount: 0,
      verified: true,
      location: 'Portland, OR'
    }
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesStatusFilter = filter === 'all' || user.status === filter;
    const matchesRoleFilter = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatusFilter && matchesRoleFilter && matchesSearch;
  });

  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'active').length,
    pending: allUsers.filter(u => u.status === 'pending').length,
    suspended: allUsers.filter(u => u.status === 'suspended').length,
    investors: allUsers.filter(u => u.role === 'investor').length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    verified: allUsers.filter(u => u.verified).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';
  };

  const handleVerify = (userId: string) => {
    alert(`User ${userId} verified!`);
  };

  const handleSuspend = (userId: string) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      alert(`User ${userId} suspended!`);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      alert(`User ${userId} deleted!`);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Change user ${userId} role to ${newRole}?`)) {
      alert(`User ${userId} role changed to ${newRole}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                User Management
              </h1>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                ADMIN
              </span>
            </div>
            <p className="text-lg text-gray-600 ml-9">
              Manage user accounts, permissions, and verification
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm font-medium text-gray-600">Active</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm font-medium text-gray-600">Pending</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-sm font-medium text-gray-600">Verified</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 pl-12 transition-colors focus:border-green-500 focus:outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="investor">Investors</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap">
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Invite User
            </button>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Investments</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Projects</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-sm font-bold text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-2">
                              {user.name}
                              {user.verified && (
                                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{new Date(user.joinDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {user.totalInvested > 0 ? `$${user.totalInvested.toLocaleString()}` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{user.projectsCount || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!user.verified && user.status === 'pending' && (
                            <button
                              onClick={() => handleVerify(user.id)}
                              className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200"
                              title="Verify User"
                            >
                              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                          )}
                          {user.status === 'active' && (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition-colors hover:bg-yellow-200"
                              title="Suspend User"
                            >
                              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200"
                            title="Delete User"
                          >
                            <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Role Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Investors</span>
                  <span className="font-bold text-blue-700">{stats.investors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Admins</span>
                  <span className="font-bold text-purple-700">{stats.admins}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Status Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-bold text-green-700">{stats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-bold text-yellow-700">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Suspended</span>
                  <span className="font-bold text-red-700">{stats.suspended}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-white">
                  Export User Data
                </button>
                <button className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-white">
                  Send Bulk Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminUsersPage;

