'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RoleSwitcher from '../../components/RoleSwitcher';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

interface Investment {
  id: string;
  _id?: string;
  projectId: string;
  projectName: string;
  category?: string;
  amount: number;
  returns: number;
  carbonCredits: number;
  status: 'active' | 'pending' | 'completed';
  investmentDate?: string;
}

interface MonthlyData {
  month: string;
  investments: number;
  returns: number;
  carbonCredits: number;
}

interface DashboardStats {
  totalInvested: number;
  totalReturns: number;
  totalCarbonCredits: number;
  investmentCount: number;
  carbonTonsEquivalent: string;
}

interface PortfolioDistribution {
  category: string;
  percentage: number;
  amount: number;
  count: number;
  color: string;
}

const DashboardPage: React.FC = () => {
  const { isSimpleUser, isNGO, isCorporate } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: 0,
    totalReturns: 0,
    totalCarbonCredits: 0,
    investmentCount: 0,
    carbonTonsEquivalent: '0'
  });
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [portfolioDistribution, setPortfolioDistribution] = useState<PortfolioDistribution[]>([]);
  const [topProjects, setTopProjects] = useState<Investment[]>([]);
  
  // Redirect NGO users immediately - this page is ONLY for simple users
  useEffect(() => {
    if (isNGO) {
      router.push('/ngo/dashboard');
      return;
    }
    if (isCorporate) {
      router.push('/corporate/dashboard');
      return;
    }
  }, [isNGO, isCorporate, router]);
  
  // Don't render anything for NGO or Corporate users - they should never see this page
  if (isNGO || isCorporate) {
    return null;
  }

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, investmentsRes, monthlyRes, portfolioRes, topProjectsRes] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getInvestments({ limit: 50 }),
          api.dashboard.getMonthlyAnalytics({ months: 12 }),
          api.dashboard.getPortfolioDistribution(),
          api.dashboard.getTopProjects({ limit: 5 })
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (investmentsRes.success && investmentsRes.data) {
          setInvestments(investmentsRes.data);
        }

        if (monthlyRes.success && monthlyRes.data) {
          setMonthlyData(monthlyRes.data);
        }

        if (portfolioRes.success && portfolioRes.data) {
          setPortfolioDistribution(portfolioRes.data);
        }

        if (topProjectsRes.success && topProjectsRes.data) {
          setTopProjects(topProjectsRes.data);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isSimpleUser) {
      fetchDashboardData();
    }
  }, [isSimpleUser]);

  const maxInvestment = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.investments), 1) : 1;
  const maxReturns = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.returns), 1) : 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['simple-user']}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Header />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                  <p className="text-lg text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['simple-user']}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Header />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-2xl py-16 text-center">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-24 w-24 text-red-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                  Unable to Load Dashboard
                </h3>
                <p className="mb-8 text-lg text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
                >
                  <span>Try Again</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['simple-user']}>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
              Investment Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your portfolio performance and environmental impact
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Total Invested */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">Total Invested</h3>
                </div>
                <p className="text-4xl font-bold">${stats.totalInvested.toLocaleString()}</p>
                <p className="mt-2 text-sm text-green-100">Across {stats.investmentCount} projects</p>
              </div>
            </div>

            {/* Total Returns */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">Total Returns</h3>
                </div>
                <p className="text-4xl font-bold">${stats.totalReturns.toLocaleString()}</p>
                <p className="mt-2 text-sm text-blue-100">From {stats.investmentCount} projects</p>
              </div>
            </div>

            {/* Carbon Credits */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">Carbon Credits</h3>
                </div>
                <p className="text-4xl font-bold">{stats.totalCarbonCredits.toLocaleString()}</p>
                <p className="mt-2 text-sm text-emerald-100">Equivalent to {parseFloat(stats.carbonTonsEquivalent).toFixed(0)} tons CO₂</p>
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Portfolio Performance</h2>
            <div className="relative h-64 w-full">
              <svg viewBox="0 0 800 250" className="h-full w-full" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="0" x2="800" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="62.5" x2="800" y2="62.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="125" x2="800" y2="125" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="187.5" x2="800" y2="187.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="250" x2="800" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                
                {/* Performance Line */}
                <polyline
                  points="0,200 100,180 200,170 300,150 400,140 500,130 600,110 700,90 800,70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Area under curve */}
                <polygon
                  points="0,200 100,180 200,170 300,150 400,140 500,130 600,110 700,90 800,70 800,250 0,250"
                  fill="url(#areaGradient)"
                  opacity="0.3"
                />
                
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* X-Axis Labels */}
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>

          {/* Investment List */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-500">Portfolio</p>
                <h2 className="text-2xl font-bold text-gray-900">Your Investments</h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:translate-y-[-2px] hover:bg-green-700"
              >
                Browse Projects
                <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              {investments.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <th className="px-6 py-4">Project</th>
                        <th className="px-6 py-4">Investment</th>
                        <th className="px-6 py-4">Returns</th>
                        <th className="px-6 py-4">Carbon credits</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
                      {investments.map((investment) => (
                        <tr key={investment.id || investment._id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <Link href={`/projects/${investment.projectId || investment.id}`} className="font-semibold text-gray-900 hover:text-green-600">
                              {investment.projectName}
                            </Link>
                          </td>
                          <td className="px-6 py-4">${investment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">${investment.returns.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-emerald-600">{investment.carbonCredits.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(investment.status)}`}>
                              {investment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No Investments Yet</h3>
                  <p className="mt-2 text-sm text-gray-600">Start investing in sustainable projects to see them here.</p>
                  <Link
                    href="/projects"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Browse Projects
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <div key={investment.id || investment._id} className="rounded-2xl border border-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Project</p>
                        <Link href={`/projects/${investment.projectId || investment.id}`} className="text-base font-semibold text-gray-900">
                          {investment.projectName}
                        </Link>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(investment.status)}`}>
                        {investment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Investment</p>
                        <p className="text-lg font-bold text-gray-900">${investment.amount.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl bg-green-50/70 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Returns</p>
                        <p className="text-lg font-bold text-green-600">${investment.returns.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50/70 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Carbon credits</p>
                        <p className="text-lg font-bold text-emerald-600">{investment.carbonCredits.toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">{investment.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No Investments Yet</h3>
                  <p className="mt-2 text-sm text-gray-600">Start investing in sustainable projects to see them here.</p>
                  <Link
                    href="/projects"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Browse Projects
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Content - Merged for Simple Users */}
          {isSimpleUser && (
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Charts Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Investment Growth Chart */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Investment Growth</h2>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Investments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-600">Returns</span>
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

                      {/* Investments Line */}
                      {monthlyData.length > 0 && (
                        <>
                          <polyline
                            points={monthlyData.map((d, i) => 
                              `${(i * 900) / Math.max(monthlyData.length - 1, 1)},${320 - (d.investments / maxInvestment) * 280}`
                            ).join(' ')}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Returns Line */}
                          <polyline
                            points={monthlyData.map((d, i) => 
                              `${(i * 900) / Math.max(monthlyData.length - 1, 1)},${320 - (d.returns / maxReturns) * 200}`
                            ).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Data Points */}
                          {monthlyData.map((d, i) => (
                            <circle
                              key={`inv-${i}`}
                              cx={(i * 900) / Math.max(monthlyData.length - 1, 1)}
                              cy={320 - (d.investments / maxInvestment) * 280}
                              r="4"
                              fill="#10b981"
                            />
                          ))}

                          {monthlyData.map((d, i) => (
                            <circle
                              key={`ret-${i}`}
                              cx={(i * 900) / Math.max(monthlyData.length - 1, 1)}
                              cy={320 - (d.returns / maxReturns) * 200}
                              r="4"
                              fill="#3b82f6"
                            />
                          ))}
                        </>
                      )}
                    </svg>

                    {/* X-Axis Labels */}
                    {monthlyData.length > 0 ? (
                      <div className="mt-4 flex justify-between text-xs text-gray-500">
                        {monthlyData.map((d) => (
                          <span key={d.month}>{d.month}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 text-center text-sm text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Carbon Credits Over Time */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Carbon Credits Earned</h2>
                  <div className="space-y-3">
                    {monthlyData.length > 0 ? (
                      monthlyData.slice(-6).reverse().map((data, index) => {
                        const maxCarbon = Math.max(...monthlyData.map(d => d.carbonCredits), 1);
                        const percentage = (data.carbonCredits / maxCarbon) * 100;
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <span className="w-12 text-sm font-medium text-gray-600">{data.month}</span>
                            <div className="flex-1">
                              <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <span className="w-16 text-right text-sm font-bold text-gray-900">
                              {data.carbonCredits.toFixed(2)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">No carbon credits data available</p>
                    )}
                  </div>
                </div>

                {/* Top Performing Projects */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Top Performing Projects</h2>
                  <div className="space-y-4">
                    {(topProjects.length > 0 ? topProjects : investments.slice(0, 4)).length > 0 ? (
                      (topProjects.length > 0 ? topProjects : investments.slice(0, 4)).map((project, index) => (
                        <div
                          key={project.id || project._id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{project.projectName}</p>
                              <p className="text-sm text-gray-600">{project.status === 'active' ? 'Active project' : project.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">${project.returns.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Returns</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">No projects available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Portfolio Distribution */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="mb-6 text-xl font-bold text-gray-900">Portfolio Distribution</h3>
                  
                  {/* Donut Chart Representation */}
                  <div className="mb-6">
                    {portfolioDistribution.length > 0 ? (
                      <div className="mx-auto h-48 w-48 rounded-full border-[24px] border-gray-200 relative overflow-hidden" style={{
                        background: portfolioDistribution.length === 1
                          ? `conic-gradient(${portfolioDistribution[0].color} 0% 100%)`
                          : portfolioDistribution.length === 2
                          ? `conic-gradient(
                              ${portfolioDistribution[0].color} 0% ${portfolioDistribution[0].percentage}%,
                              ${portfolioDistribution[1].color} ${portfolioDistribution[0].percentage}% 100%
                            )`
                          : portfolioDistribution.length === 3
                          ? `conic-gradient(
                              ${portfolioDistribution[0].color} 0% ${portfolioDistribution[0].percentage}%,
                              ${portfolioDistribution[1].color} ${portfolioDistribution[0].percentage}% ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}%,
                              ${portfolioDistribution[2].color} ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}% 100%
                            )`
                          : `conic-gradient(
                              ${portfolioDistribution[0].color} 0% ${portfolioDistribution[0].percentage}%,
                              ${portfolioDistribution[1].color} ${portfolioDistribution[0].percentage}% ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}%,
                              ${portfolioDistribution[2].color} ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}% ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage + portfolioDistribution[2].percentage}%,
                              ${portfolioDistribution[3]?.color || '#a855f7'} ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage + portfolioDistribution[2].percentage}% 100%
                            )`
                      }}>
                        <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">100%</p>
                            <p className="text-xs text-gray-600">Diversified</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-auto h-48 w-48 rounded-full border-[24px] border-gray-200 relative overflow-hidden bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-400">0%</p>
                          <p className="text-xs text-gray-500">No Data</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {portfolioDistribution.length > 0 ? (
                      portfolioDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-gray-700">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{item.percentage}%</p>
                            <p className="text-xs text-gray-500">${item.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No portfolio distribution data available</p>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 p-6">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Risk Assessment</h3>
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Portfolio Risk Level</span>
                      <span className="font-bold text-green-700">Low</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Your portfolio is well-diversified across multiple sustainable sectors with stable returns.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      href="/projects"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                    >
                      Explore Projects
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                    <Link
                      href="/activities"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Activity Bar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <RoleSwitcher />
    </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;

