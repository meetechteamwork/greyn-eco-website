'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ENGO analytics data
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

// Monthly funding data
const monthlyFundingData = [
  { month: 'Jan', funding: 85000, projects: 2, investors: 45 },
  { month: 'Feb', funding: 125000, projects: 3, investors: 78 },
  { month: 'Mar', funding: 180000, projects: 4, investors: 112 },
  { month: 'Apr', funding: 240000, projects: 5, investors: 156 },
  { month: 'May', funding: 320000, projects: 6, investors: 203 },
  { month: 'Jun', funding: 410000, projects: 7, investors: 267 },
  { month: 'Jul', funding: 520000, projects: 8, investors: 345 },
  { month: 'Aug', funding: 650000, projects: 9, investors: 432 },
  { month: 'Sep', funding: 780000, projects: 10, investors: 521 },
  { month: 'Oct', funding: 920000, projects: 11, investors: 623 },
  { month: 'Nov', funding: 1100000, projects: 12, investors: 745 },
  { month: 'Dec', funding: 1350000, projects: 13, investors: 892 }
];

// Revenue and investor growth
const revenueData = [
  { month: 'Jan', revenue: 4250, investors: 45 },
  { month: 'Feb', revenue: 6250, investors: 78 },
  { month: 'Mar', revenue: 9000, investors: 112 },
  { month: 'Apr', revenue: 12000, investors: 156 },
  { month: 'May', revenue: 16000, investors: 203 },
  { month: 'Jun', revenue: 20500, investors: 267 },
  { month: 'Jul', revenue: 26000, investors: 345 },
  { month: 'Aug', revenue: 32500, investors: 432 },
  { month: 'Sep', revenue: 39000, investors: 521 },
  { month: 'Oct', revenue: 46000, investors: 623 },
  { month: 'Nov', revenue: 55000, investors: 745 },
  { month: 'Dec', revenue: 67500, investors: 892 }
];

// Carbon credits generated
const carbonCreditsData = [
  { month: 'Jan', credits: 850 },
  { month: 'Feb', credits: 1250 },
  { month: 'Mar', credits: 1800 },
  { month: 'Apr', credits: 2450 },
  { month: 'May', credits: 3200 },
  { month: 'Jun', credits: 4100 },
  { month: 'Jul', credits: 5200 },
  { month: 'Aug', credits: 6500 },
  { month: 'Sep', credits: 7800 },
  { month: 'Oct', credits: 9200 },
  { month: 'Nov', credits: 11000 },
  { month: 'Dec', credits: 13500 }
];

// Top performing projects
const topProjects = [
  { name: 'Amazon Reforestation', funding: 450000, goal: 500000, investors: 234, credits: 4500, progress: 90 },
  { name: 'Solar Farm California', funding: 380000, goal: 400000, investors: 189, credits: 3800, progress: 95 },
  { name: 'Wind Power Texas', funding: 320000, goal: 350000, investors: 156, credits: 3200, progress: 91 },
  { name: 'Ocean Cleanup Initiative', funding: 280000, goal: 300000, investors: 142, credits: 2800, progress: 93 },
  { name: 'Urban Green Spaces', funding: 250000, goal: 280000, investors: 128, credits: 2500, progress: 89 }
];

// Project category distribution
const categoryDistribution = [
  { category: 'Reforestation', percentage: 35, amount: 875000, color: 'bg-green-500', projects: 8 },
  { category: 'Solar Energy', percentage: 28, amount: 700000, color: 'bg-yellow-500', projects: 7 },
  { category: 'Wind Energy', percentage: 22, amount: 550000, color: 'bg-blue-500', projects: 5 },
  { category: 'Ocean Cleanup', percentage: 10, amount: 250000, color: 'bg-cyan-500', projects: 3 },
  { category: 'Other', percentage: 5, amount: 125000, color: 'bg-purple-500', projects: 1 }
];

// Pre-calculate donut chart paths to prevent hydration mismatch
const donutChartPaths = categoryDistribution.reduce((acc, category, index) => {
  const startAngle = acc.angle;
  const angle = (category.percentage / 100) * 360;
  const endAngle = startAngle + angle;
  
  // Round to 2 decimal places to prevent hydration mismatch
  const x1 = Math.round((100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)) * 100) / 100;
  const y1 = Math.round((100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)) * 100) / 100;
  const x2 = Math.round((100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180)) * 100) / 100;
  const y2 = Math.round((100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180)) * 100) / 100;
  
  const largeArc = angle > 180 ? 1 : 0;
  
  // Pre-calculate color to avoid string operations during render
  const getColor = (colorStr: string) => {
    const color = colorStr.replace('bg-', '').split('-')[0];
    if (color === 'green') return '#10b981';
    if (color === 'yellow') return '#eab308';
    if (color === 'blue') return '#3b82f6';
    if (color === 'cyan') return '#06b6d4';
    return '#a855f7';
  };
  
  return {
    angle: endAngle,
    paths: [
      ...acc.paths,
      {
        key: index,
        d: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
        fill: getColor(category.color)
      }
    ]
  };
}, { angle: 0, paths: [] as Array<{ key: number; d: string; fill: string }> }).paths;

// Pre-calculate polyline points to prevent hydration mismatch
const revenueLinePoints = revenueData.map((d, i) => {
  const x = Math.round(((i / (revenueData.length - 1)) * 380 + 10) * 100) / 100;
  const y = Math.round((200 - (d.revenue / Math.max(...revenueData.map(d => d.revenue))) * 180) * 100) / 100;
  return `${x},${y}`;
}).join(' ');

const investorLinePoints = revenueData.map((d, i) => {
  const x = Math.round(((i / (revenueData.length - 1)) * 380 + 10) * 100) / 100;
  const y = Math.round((200 - (d.investors / Math.max(...revenueData.map(d => d.investors))) * 180) * 100) / 100;
  return `${x},${y}`;
}).join(' ');

// Pre-calculate max values for charts
const maxFunding = Math.max(...monthlyFundingData.map(d => d.funding));
const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
const maxCredits = Math.max(...carbonCreditsData.map(d => d.credits));
const maxInvestors = Math.max(...revenueData.map(d => d.investors));

const ENGODashboardPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6M' | '12M' | 'All'>('12M');

  return (
    <ProtectedRoute requiredRole="engo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Header />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                  ENGO Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Advanced analytics and project management for environmental organizations
                </p>
              </div>
              <div className="mt-4 flex gap-2 md:mt-0">
                {(['6M', '12M', 'All'] as const).map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      selectedTimeframe === timeframe
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 shadow hover:bg-gray-50'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Projects */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/5"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Total Projects</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.totalProjects}</p>
                  <p className="mt-2 text-sm text-green-100">{dummyENGOAnalytics.activeProjects} active • {dummyENGOAnalytics.pendingApproval} pending</p>
                </div>
              </div>

              {/* Total Investments */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/5"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Total Investments</h3>
                  </div>
                  <p className="text-5xl font-bold">${(dummyENGOAnalytics.totalInvestments / 1000).toFixed(0)}k</p>
                  <p className="mt-2 text-sm text-blue-100">{dummyENGOAnalytics.growthRate} growth this month</p>
                </div>
              </div>

              {/* Total Investors */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/5"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Total Investors</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.totalInvestors.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-purple-100">Active community members</p>
                </div>
              </div>

              {/* Carbon Credits */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/5"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Carbon Credits</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.carbonCreditsGenerated.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-emerald-100">Total generated</p>
                </div>
              </div>
            </div>

            {/* Analytics Charts Section */}
            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Funding & Project Growth Chart */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Funding & Project Growth</h2>
                    <p className="text-sm text-gray-600">Monthly trends over time</p>
                  </div>
                  <div className="rounded-lg bg-green-100 px-3 py-1">
                    <span className="text-sm font-semibold text-green-700">+{dummyENGOAnalytics.growthRate}</span>
                  </div>
                </div>
                <div className="h-64">
                  <div className="flex h-full items-end justify-between gap-2">
                    {monthlyFundingData.map((data, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div className="relative w-full">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:from-blue-700 hover:to-blue-500"
                            style={{ height: `${(data.funding / maxFunding) * 100}%` }}
                            title={`$${data.funding.toLocaleString()}`}
                          ></div>
                          <div
                            className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-green-500 to-green-400 opacity-60"
                            style={{ height: `${(data.projects / 13) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Funding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Projects</span>
                  </div>
                </div>
              </div>

              {/* Revenue & Investor Growth Chart */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Revenue & Investor Growth</h2>
                    <p className="text-sm text-gray-600">Platform revenue and investor count</p>
                  </div>
                  <div className="rounded-lg bg-purple-100 px-3 py-1">
                    <span className="text-sm font-semibold text-purple-700">Growing</span>
                  </div>
                </div>
                <div className="h-64">
                  <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Revenue line */}
                    <polyline
                      fill="none"
                      stroke="url(#revenueGradient)"
                      strokeWidth="3"
                      points={revenueLinePoints}
                    />
                    {/* Investor line */}
                    <polyline
                      fill="none"
                      stroke="url(#investorGradient)"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      points={investorLinePoints}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="investorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-green-500"></div>
                    <span className="text-sm text-gray-600">Investors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Credits Generated Chart */}
            <div className="mb-12 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Carbon Credits Generated</h2>
                  <p className="text-sm text-gray-600">Monthly carbon credit generation trend</p>
                </div>
                <div className="rounded-lg bg-emerald-100 px-3 py-1">
                  <span className="text-sm font-semibold text-emerald-700">{dummyENGOAnalytics.carbonCreditsGenerated.toLocaleString()} Total</span>
                </div>
              </div>
              <div className="h-64">
                <div className="flex h-full items-end justify-between gap-2">
                  {carbonCreditsData.map((data, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 via-green-500 to-emerald-400 transition-all hover:from-emerald-700 hover:via-green-600 hover:to-emerald-500"
                        style={{ height: `${(data.credits / maxCredits) * 100}%` }}
                        title={`${data.credits.toLocaleString()} credits`}
                      ></div>
                      <span className="text-xs font-medium text-gray-600">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performing Projects & Category Distribution */}
            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Top Performing Projects */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Top Performing Projects</h2>
                  <Link href="/engo/project-details" className="text-sm font-semibold text-green-600 hover:text-green-700">
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {topProjects.map((project, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-green-300 hover:shadow-md">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">${(project.funding / 1000).toFixed(0)}k</span> / ${(project.goal / 1000).toFixed(0)}k
                          </span>
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{project.investors}</span> investors
                          </span>
                        </div>
                        <span className="font-semibold text-emerald-600">{project.credits.toLocaleString()} credits</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Category Distribution */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Category Distribution</h2>
                <div className="mb-6">
                  <div className="relative h-64 w-full">
                    <svg viewBox="0 0 200 200" className="h-full w-full">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="40"
                      />
                      {donutChartPaths.map((path) => (
                        <path
                          key={path.key}
                          d={path.d}
                          fill={path.fill}
                          className="transition-all hover:opacity-80"
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{dummyENGOAnalytics.totalProjects}</p>
                        <p className="text-sm text-gray-600">Total Projects</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full ${category.color}`}></div>
                        <div>
                          <p className="font-semibold text-gray-900">{category.category}</p>
                          <p className="text-xs text-gray-600">{category.projects} projects</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{category.percentage}%</p>
                        <p className="text-xs text-gray-600">${(category.amount / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Metrics Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Project Status */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Active Projects</span>
                    </div>
                    <span className="text-3xl font-bold text-green-600">{dummyENGOAnalytics.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-yellow-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Pending Approval</span>
                    </div>
                    <span className="text-3xl font-bold text-yellow-600">{dummyENGOAnalytics.pendingApproval}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Completed</span>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">{dummyENGOAnalytics.completedProjects}</span>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Financial Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Total Revenue</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">${dummyENGOAnalytics.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Avg Project Funding</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">${dummyENGOAnalytics.avgProjectFunding.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-500 p-2">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">New Projects (Month)</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{dummyENGOAnalytics.newProjectsThisMonth}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/engo/launch"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    Launch New Project
                  </Link>
                  <Link
                    href="/engo/details"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all hover:bg-green-50"
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Update ENGO Details
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    View Analytics
                  </Link>
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
