'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboardPage: React.FC = () => {
  // Mock admin data
  const stats = {
    totalUsers: 1247,
    totalProjects: 24,
    totalInvestments: 2547890,
    activeProjects: 18,
    pendingProjects: 4,
    completedProjects: 2,
    totalCarbonCredits: 15847.5,
    newUsersThisMonth: 143,
    investmentGrowth: '+23.5%',
    platformRevenue: 127394.50
  };

  const recentActivities = [
    { type: 'user', action: 'New user registered', user: 'Sarah Johnson', time: '5 min ago', icon: '👤' },
    { type: 'investment', action: 'New investment', user: 'Michael Chen', amount: '$5,000', time: '12 min ago', icon: '💰' },
    { type: 'project', action: 'Project approved', project: 'Solar Farm Texas', time: '1 hour ago', icon: '✅' },
    { type: 'user', action: 'User verified', user: 'Emma Williams', time: '2 hours ago', icon: '✓' },
    { type: 'investment', action: 'Large investment', user: 'David Brown', amount: '$25,000', time: '3 hours ago', icon: '🎯' }
  ];

  const projectStatus = [
    { name: 'Amazon Reforestation', status: 'active', progress: 75, funded: 75000, goal: 100000 },
    { name: 'Solar Farm California', status: 'active', progress: 72, funded: 180000, goal: 250000 },
    { name: 'Wind Power Texas', status: 'active', progress: 84, funded: 420000, goal: 500000 },
    { name: 'Ocean Cleanup', status: 'pending', progress: 63, funded: 95000, goal: 150000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Admin Dashboard
              </h1>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                ADMIN
              </span>
            </div>
            <p className="text-lg text-gray-600">
              Manage platform operations, users, and projects
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-blue-100">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="mt-2 text-sm text-blue-100">+{stats.newUsersThisMonth} this month</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-green-100">Total Investments</p>
                <p className="text-3xl font-bold">${(stats.totalInvestments / 1000000).toFixed(2)}M</p>
                <p className="mt-2 text-sm text-green-100">{stats.investmentGrowth} growth</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-purple-100">Active Projects</p>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="mt-2 text-sm text-purple-100">{stats.pendingProjects} pending approval</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-emerald-100">Platform Revenue</p>
                <p className="text-3xl font-bold">${(stats.platformRevenue / 1000).toFixed(0)}K</p>
                <p className="mt-2 text-sm text-emerald-100">Total earnings</p>
              </div>
            </div>
          </div>

          {/* Admin Navigation Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link
              href="/admin/projects"
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-3xl text-white">
                📊
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Manage Projects</h3>
              <p className="mb-4 text-gray-600">
                Review, approve, and manage all investment projects on the platform
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>Go to Projects</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-3xl text-white">
                👥
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Manage Users</h3>
              <p className="mb-4 text-gray-600">
                View user accounts, verify identities, and manage permissions
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>Go to Users</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-3xl text-white">
                📈
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Analytics</h3>
              <p className="mb-4 text-gray-600">
                View platform metrics, reports, and detailed analytics
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span>Go to Analytics</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.user || activity.project}
                          {activity.amount && <span className="ml-2 font-semibold text-green-600">{activity.amount}</span>}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  View All Activity
                </button>
              </div>

              {/* Project Status */}
              <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Status</h2>
                <div className="space-y-6">
                  {projectStatus.map((project, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{project.name}</p>
                          <p className="text-sm text-gray-600">
                            ${(project.funded / 1000).toFixed(0)}k / ${(project.goal / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-gray-600">{project.progress}% funded</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Actions */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg">
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add New Project
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Invite User
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Generate Report
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Platform</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Payments</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">API</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Database</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      Operational
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Platform Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">Carbon Credits Issued</span>
                      <span className="font-semibold text-gray-900">{stats.totalCarbonCredits.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">User Verification</span>
                      <span className="font-semibold text-gray-900">94%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">Project Success Rate</span>
                      <span className="font-semibold text-gray-900">89%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;

