'use client';

import React from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Dummy ENGO analytics data
const dummyENGOAnalytics = {
  totalProjects: 24,
  activeProjects: 18,
  pendingApproval: 4,
  completedProjects: 2,
  totalInvestments: 2547890,
  totalInvestors: 1247,
  carbonCreditsGenerated: 15847.5,
  revenue: 127394.50,
  growthRate: '+23.5%',
  newProjectsThisMonth: 6,
  avgProjectFunding: 106162.08
};

const ENGODashboardPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="engo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                ENGO Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Advanced analytics and project management for environmental organizations
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Projects */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Projects</h3>
                  </div>
                  <p className="text-4xl font-bold">{dummyENGOAnalytics.totalProjects}</p>
                  <p className="mt-2 text-sm text-green-100">{dummyENGOAnalytics.activeProjects} active</p>
                </div>
              </div>

              {/* Total Investments */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Investments</h3>
                  </div>
                  <p className="text-4xl font-bold">${(dummyENGOAnalytics.totalInvestments / 1000).toFixed(0)}k</p>
                  <p className="mt-2 text-sm text-blue-100">{dummyENGOAnalytics.growthRate} growth</p>
                </div>
              </div>

              {/* Total Investors */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Investors</h3>
                  </div>
                  <p className="text-4xl font-bold">{dummyENGOAnalytics.totalInvestors.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-purple-100">Active community</p>
                </div>
              </div>

              {/* Carbon Credits */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Carbon Credits</h3>
                  </div>
                  <p className="text-4xl font-bold">{dummyENGOAnalytics.carbonCreditsGenerated.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-emerald-100">Generated</p>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Project Status */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                    <span className="font-semibold text-gray-700">Active Projects</span>
                    <span className="text-2xl font-bold text-green-600">{dummyENGOAnalytics.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
                    <span className="font-semibold text-gray-700">Pending Approval</span>
                    <span className="text-2xl font-bold text-yellow-600">{dummyENGOAnalytics.pendingApproval}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                    <span className="font-semibold text-gray-700">Completed</span>
                    <span className="text-2xl font-bold text-blue-600">{dummyENGOAnalytics.completedProjects}</span>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Financial Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                    <span className="font-semibold text-gray-700">Total Revenue</span>
                    <span className="text-2xl font-bold text-blue-600">${dummyENGOAnalytics.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                    <span className="font-semibold text-gray-700">Avg Project Funding</span>
                    <span className="text-2xl font-bold text-green-600">${dummyENGOAnalytics.avgProjectFunding.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
                    <span className="font-semibold text-gray-700">New Projects (This Month)</span>
                    <span className="text-2xl font-bold text-purple-600">{dummyENGOAnalytics.newProjectsThisMonth}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ENGODashboardPage;

