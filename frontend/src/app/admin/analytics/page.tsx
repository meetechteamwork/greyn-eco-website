'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/overview', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl font-semibold text-gray-700">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const platformMetrics = analytics?.overview || {
    totalRevenue: 0,
    totalInvestments: 0,
    totalUsers: 0,
    activeProjects: 0,
    conversionRate: 0,
    avgInvestmentSize: 0,
    platformFees: 0,
    carbonCreditsIssued: 0
  };

  const monthlyRevenue = analytics?.monthlyData || [];
  const projectCategoryStats = analytics?.categoryStats || [];
  const topPerformingProjects = analytics?.topProjects || [];
  const userActivityMetrics = analytics?.userActivity || {
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    avgSessionDuration: '0m 0s',
    bounceRate: 0,
    newUsersThisMonth: 0
  };

  const maxRevenue = monthlyRevenue.length > 0 ? Math.max(...monthlyRevenue.map((d: any) => d.revenue || 0)) : 1;
  const maxInvestments = monthlyRevenue.length > 0 ? Math.max(...monthlyRevenue.map((d: any) => d.investments || 0)) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-4 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Platform Analytics
              </h1>
              <span className="rounded-full bg-red-100 px-2 sm:px-3 py-1 text-xs font-semibold text-red-700">
                ADMIN
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 ml-7 sm:ml-9">
              Comprehensive platform metrics and insights
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-sm font-semibold text-gray-700">Time Range:</span>
            <div className="flex flex-wrap gap-2">
              {['7days', '30days', '90days', '1year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 shadow hover:shadow-lg'
                  }`}
                >
                  {range === '7days' && '7 Days'}
                  {range === '30days' && '30 Days'}
                  {range === '90days' && '90 Days'}
                  {range === '1year' && '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8 sm:mb-10 md:mb-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-green-100">Platform Revenue</p>
                <p className="text-3xl font-bold">${(platformMetrics.totalRevenue / 1000).toFixed(1)}K</p>
                <p className="mt-2 text-sm text-green-100">+23.5% growth</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-blue-100">Total Investments</p>
                <p className="text-3xl font-bold">${(platformMetrics.totalInvestments / 1000000).toFixed(2)}M</p>
                <p className="mt-2 text-sm text-blue-100">Across {platformMetrics.activeProjects} projects</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-purple-100">Conversion Rate</p>
                <p className="text-3xl font-bold">{platformMetrics.conversionRate}%</p>
                <p className="mt-2 text-sm text-purple-100">User to investor</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-emerald-100">Avg Investment</p>
                <p className="text-3xl font-bold">${platformMetrics.avgInvestmentSize.toLocaleString()}</p>
                <p className="mt-2 text-sm text-emerald-100">Per transaction</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Revenue and Investment Growth */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Revenue & Investment Growth</h2>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">Investments</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-80">
                  <svg viewBox="0 0 900 320" className="h-full w-full" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 80}
                        x2="900"
                        y2={i * 80}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Revenue Line */}
                    <polyline
                      points={monthlyRevenue.map((d: any, i: number) =>
                        `${(i * 900) / (monthlyRevenue.length - 1)},${320 - (d.revenue / maxRevenue) * 280}`
                      ).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Investments Line (scaled) */}
                    <polyline
                      points={monthlyRevenue.map((d: any, i: number) =>
                        `${(i * 900) / (monthlyRevenue.length - 1)},${320 - (d.investments / maxInvestments) * 250}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {monthlyRevenue.map((d: any, i: number) => (
                      <circle
                        key={`rev-${i}`}
                        cx={(i * 900) / (monthlyRevenue.length - 1)}
                        cy={320 - (d.revenue / maxRevenue) * 280}
                        r="4"
                        fill="#10b981"
                      />
                    ))}
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    {monthlyRevenue.map((d: any) => (
                      <span key={d.month}>{d.month}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Category Performance</h2>
                <div className="space-y-6">
                  {projectCategoryStats.map((category: any, index: number) => {
                    const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                    return (
                      <div key={index}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full ${colors[index]}`}></div>
                            <span className="font-semibold text-gray-900">{category.category}</span>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                ${(category.invested / 1000).toFixed(0)}K
                              </p>
                              <p className="text-xs text-gray-600">{category.projects} projects</p>
                            </div>
                            <span className="text-sm font-semibold text-green-600">{category.growth}</span>
                          </div>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${colors[index]} transition-all duration-500`}
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performing Projects */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Top Performing Projects</h2>
                <div className="space-y-4">
                  {topPerformingProjects.map((project: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-lg font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{project.name}</p>
                          <p className="text-sm text-gray-600">{project.investors} investors</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${(project.revenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* User Activity */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">User Activity</h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm text-gray-600">Daily Active</span>
                      <span className="font-bold text-gray-900">{userActivityMetrics.dailyActiveUsers}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm text-gray-600">Weekly Active</span>
                      <span className="font-bold text-gray-900">{userActivityMetrics.weeklyActiveUsers}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Active</span>
                      <span className="font-bold text-gray-900">{userActivityMetrics.monthlyActiveUsers}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg Session</span>
                      <span className="font-bold text-gray-900">{userActivityMetrics.avgSessionDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bounce Rate</span>
                      <span className="font-bold text-gray-900">{userActivityMetrics.bounceRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Fees */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Platform Fees</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">${(platformMetrics.platformFees / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-gray-600">Collected this period</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee Rate</span>
                    <span className="font-semibold text-gray-900">1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed</span>
                    <span className="font-semibold text-gray-900">${(platformMetrics.totalInvestments / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Carbon Impact */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Carbon Impact</h3>
                <div className="mb-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{platformMetrics.carbonCreditsIssued.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Credits Issued</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-sm text-gray-700">
                    Equivalent to <span className="font-bold text-emerald-700">{(platformMetrics.carbonCreditsIssued * 0.5).toFixed(0)} tons</span> of CO₂ offset
                  </p>
                </div>
              </div>

              {/* Export Options */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Export Reports</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('CSV export functionality will be implemented soon.')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download CSV
                  </button>
                  <button
                    onClick={() => alert('PDF export functionality will be implemented soon.')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Generate PDF
                  </button>
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

export default AdminAnalyticsPage;

