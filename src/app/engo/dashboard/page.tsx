'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

interface MonthlyData {
  month: string;
  investments: number;
  projects: number;
  carbonCredits: number;
  investors: number;
  revenue: number;
}

const ENGODashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('12months');

  // Monthly data for charts
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', investments: 145000, projects: 2, carbonCredits: 850, investors: 89, revenue: 8500 },
    { month: 'Feb', investments: 198000, projects: 3, carbonCredits: 1120, investors: 124, revenue: 12300 },
    { month: 'Mar', investments: 245000, projects: 4, carbonCredits: 1450, investors: 156, revenue: 15800 },
    { month: 'Apr', investments: 312000, projects: 5, carbonCredits: 1890, investors: 189, revenue: 18900 },
    { month: 'May', investments: 387000, projects: 6, carbonCredits: 2340, investors: 234, revenue: 22400 },
    { month: 'Jun', investments: 456000, projects: 7, carbonCredits: 2870, investors: 287, revenue: 27600 },
    { month: 'Jul', investments: 534000, projects: 8, carbonCredits: 3420, investors: 342, revenue: 32100 },
    { month: 'Aug', investments: 612000, projects: 9, carbonCredits: 3980, investors: 398, revenue: 38500 },
    { month: 'Sep', investments: 698000, projects: 10, carbonCredits: 4560, investors: 456, revenue: 45200 },
    { month: 'Oct', investments: 789000, projects: 11, carbonCredits: 5230, investors: 523, revenue: 52800 },
    { month: 'Nov', investments: 845000, projects: 12, carbonCredits: 5870, investors: 587, revenue: 61300 },
    { month: 'Dec', investments: 927000, projects: 13, carbonCredits: 6540, investors: 654, revenue: 72900 }
  ];

  const projectCategoryStats = [
    { category: 'Solar Energy', projects: 8, invested: 1147335, percentage: 45, growth: '+18%', color: '#eab308' },
    { category: 'Wind Energy', projects: 5, invested: 687731, percentage: 27, growth: '+12%', color: '#3b82f6' },
    { category: 'Reforestation', projects: 6, invested: 458621, percentage: 18, growth: '+9%', color: '#10b981' },
    { category: 'Other', projects: 5, growth: '+15%', invested: 254203, percentage: 10, color: '#a855f7' }
  ];

  const topPerformingProjects = [
    { name: 'Solar Energy Farm - California', growth: '+12%', status: 'up', funding: 450000, goal: 500000, investors: 234 },
    { name: 'Wind Power Initiative - Texas', growth: '+18%', status: 'up', funding: 420000, goal: 500000, investors: 198 },
    { name: 'Amazon Rainforest Reforestation', growth: '+9%', status: 'up', funding: 180000, goal: 250000, investors: 156 },
    { name: 'Ocean Cleanup Project', growth: '+7%', status: 'up', funding: 95000, goal: 150000, investors: 89 }
  ];

  const recentActivity = [
    { type: 'investment', action: 'New investment received', amount: '$25,000', project: 'Solar Farm Texas', time: '2 hours ago', icon: '💰' },
    { type: 'project', action: 'Project approved', project: 'Wind Power California', time: '5 hours ago', icon: '✅' },
    { type: 'investor', action: 'New investor joined', investor: 'Sarah Johnson', time: '1 day ago', icon: '👤' },
    { type: 'milestone', action: 'Milestone reached', project: 'Ocean Cleanup', time: '2 days ago', icon: '🎯' }
  ];

  const maxInvestment = Math.max(...monthlyData.map(d => d.investments));
  const maxProjects = Math.max(...monthlyData.map(d => d.projects));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxInvestors = Math.max(...monthlyData.map(d => d.investors));

  return (
    <ProtectedRoute requiredRole="engo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Header />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="mb-1 text-4xl font-bold text-gray-900 md:text-5xl">
                    ENGO Dashboard
                  </h1>
                  <p className="text-lg text-gray-600">
                    Advanced analytics and project management for environmental organizations
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Projects */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Projects</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.totalProjects}</p>
                  <p className="mt-2 text-sm text-green-100">{dummyENGOAnalytics.activeProjects} active</p>
                </div>
              </div>

              {/* Total Investments */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Investments</h3>
                  </div>
                  <p className="text-5xl font-bold">${(dummyENGOAnalytics.totalInvestments / 1000).toFixed(0)}k</p>
                  <p className="mt-2 text-sm text-blue-100">{dummyENGOAnalytics.growthRate} growth</p>
                </div>
              </div>

              {/* Total Investors */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Total Investors</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.totalInvestors.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-purple-100">Active community</p>
                </div>
              </div>

              {/* Carbon Credits */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Carbon Credits</h3>
                  </div>
                  <p className="text-5xl font-bold">{dummyENGOAnalytics.carbonCreditsGenerated.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-emerald-100">Generated</p>
                </div>
              </div>
            </div>

            {/* Analytics Charts Section */}
            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Charts Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Funding & Project Growth Chart */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Funding & Project Growth</h2>
                      <p className="text-sm text-gray-500 mt-1">Monthly trends over the past year</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-600 font-medium">Funding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-600 font-medium">Projects</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-96">
                    <svg viewBox="0 0 1000 380" className="h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="fundingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="projectGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="40"
                          y1={60 + i * 80}
                          x2="960"
                          y2={60 + i * 80}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Y-Axis Labels */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <text
                          key={i}
                          x="35"
                          y={65 + i * 80}
                          textAnchor="end"
                          className="text-xs fill-gray-400"
                          fontSize="12"
                        >
                          {Math.round((maxInvestment / 4) * (4 - i) / 1000)}k
                        </text>
                      ))}

                      {/* Funding Area */}
                      <polygon
                        points={`40,340 ${monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.investments / maxInvestment) * 280}`
                        ).join(' ')}, 960,340`}
                        fill="url(#fundingGradient)"
                      />

                      {/* Funding Line */}
                      <polyline
                        points={monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.investments / maxInvestment) * 280}`
                        ).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Projects Line */}
                      <polyline
                        points={monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.projects / maxProjects) * 200}`
                        ).join(' ')}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Points */}
                      {monthlyData.map((d, i) => (
                        <g key={`point-${i}`}>
                          <circle
                            cx={40 + (i * 920) / (monthlyData.length - 1)}
                            cy={340 - (d.investments / maxInvestment) * 280}
                            r="5"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx={40 + (i * 920) / (monthlyData.length - 1)}
                            cy={340 - (d.projects / maxProjects) * 200}
                            r="5"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="mt-4 flex justify-between px-2 text-xs text-gray-500 font-medium">
                      {monthlyData.map((d) => (
                        <span key={d.month}>{d.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue & Investors Chart */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Revenue & Investor Growth</h2>
                      <p className="text-sm text-gray-500 mt-1">Financial performance metrics</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-gray-600 font-medium">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-gray-600 font-medium">Investors</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-96">
                    <svg viewBox="0 0 1000 380" className="h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="40"
                          y1={60 + i * 80}
                          x2="960"
                          y2={60 + i * 80}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Revenue Area */}
                      <polygon
                        points={`40,340 ${monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.revenue / maxRevenue) * 280}`
                        ).join(' ')}, 960,340`}
                        fill="url(#revenueGradient)"
                      />

                      {/* Revenue Line */}
                      <polyline
                        points={monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.revenue / maxRevenue) * 280}`
                        ).join(' ')}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Investors Line */}
                      <polyline
                        points={monthlyData.map((d, i) => 
                          `${40 + (i * 920) / (monthlyData.length - 1)},${340 - (d.investors / maxInvestors) * 200}`
                        ).join(' ')}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Points */}
                      {monthlyData.map((d, i) => (
                        <g key={`rev-point-${i}`}>
                          <circle
                            cx={40 + (i * 920) / (monthlyData.length - 1)}
                            cy={340 - (d.revenue / maxRevenue) * 280}
                            r="5"
                            fill="#a855f7"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx={40 + (i * 920) / (monthlyData.length - 1)}
                            cy={340 - (d.investors / maxInvestors) * 200}
                            r="5"
                            fill="#f97316"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="mt-4 flex justify-between px-2 text-xs text-gray-500 font-medium">
                      {monthlyData.map((d) => (
                        <span key={d.month}>{d.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Carbon Credits Over Time */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Carbon Credits Generated</h2>
                    <p className="text-sm text-gray-500 mt-1">Last 6 months performance</p>
                  </div>
                  <div className="space-y-4">
                    {monthlyData.slice(-6).reverse().map((data, index) => {
                      const percentage = (data.carbonCredits / 6540) * 100;
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <span className="w-16 text-sm font-semibold text-gray-700">{data.month}</span>
                          <div className="flex-1">
                            <div className="h-10 w-full overflow-hidden rounded-lg bg-gray-100">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transition-all duration-700 flex items-center justify-end pr-3"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                          <span className="w-24 text-right text-sm font-bold text-gray-900">
                            {data.carbonCredits.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Performing Projects */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Top Performing Projects</h2>
                      <p className="text-sm text-gray-500 mt-1">Best performing projects by funding</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {topPerformingProjects.map((project, index) => {
                      const progressPercentage = (project.funding / project.goal) * 100;
                      return (
                        <div
                          key={index}
                          className="rounded-xl border-2 border-gray-100 p-5 transition-all hover:border-green-200 hover:shadow-md"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-xl font-bold text-green-700">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{project.name}</p>
                                <p className="text-sm text-gray-600">
                                  ${(project.funding / 1000).toFixed(0)}k / ${(project.goal / 1000).toFixed(0)}k • {project.investors} investors
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">{project.growth}</p>
                              <p className="text-xs text-gray-500 font-medium">Growth</p>
                            </div>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-700 flex items-center justify-end pr-2"
                              style={{ width: `${progressPercentage}%` }}
                            >
                              <span className="text-xs font-bold text-white">{progressPercentage.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Project Status */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Status</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-5 border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                          <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Active Projects</span>
                      </div>
                      <span className="text-3xl font-bold text-green-600">{dummyENGOAnalytics.activeProjects}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 p-5 border border-yellow-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
                          <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Pending Approval</span>
                      </div>
                      <span className="text-3xl font-bold text-yellow-600">{dummyENGOAnalytics.pendingApproval}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-5 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                          <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Completed</span>
                      </div>
                      <span className="text-3xl font-bold text-blue-600">{dummyENGOAnalytics.completedProjects}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Financial Overview</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border border-blue-100">
                      <span className="font-semibold text-gray-700">Total Revenue</span>
                      <span className="text-2xl font-bold text-blue-600">${dummyENGOAnalytics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-5 border border-green-100">
                      <span className="font-semibold text-gray-700">Avg Project Funding</span>
                      <span className="text-2xl font-bold text-green-600">${dummyENGOAnalytics.avgProjectFunding.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-5 border border-purple-100">
                      <span className="font-semibold text-gray-700">New Projects (This Month)</span>
                      <span className="text-2xl font-bold text-purple-600">{dummyENGOAnalytics.newProjectsThisMonth}</span>
                    </div>
                  </div>
                </div>

                {/* Project Category Distribution */}
                <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                  <h3 className="mb-6 text-xl font-bold text-gray-900">Project Distribution</h3>
                  
                  {/* Donut Chart Representation */}
                  <div className="mb-6">
                    <div className="mx-auto h-52 w-52 rounded-full border-[28px] border-gray-200 relative overflow-hidden shadow-lg" style={{
                      background: `conic-gradient(
                        ${projectCategoryStats[0].color} 0% ${projectCategoryStats[0].percentage}%,
                        ${projectCategoryStats[1].color} ${projectCategoryStats[0].percentage}% ${projectCategoryStats[0].percentage + projectCategoryStats[1].percentage}%,
                        ${projectCategoryStats[2].color} ${projectCategoryStats[0].percentage + projectCategoryStats[1].percentage}% ${projectCategoryStats[0].percentage + projectCategoryStats[1].percentage + projectCategoryStats[2].percentage}%,
                        ${projectCategoryStats[3].color} ${projectCategoryStats[0].percentage + projectCategoryStats[1].percentage + projectCategoryStats[2].percentage}% 100%
                      )`
                    }}>
                      <div className="absolute inset-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900">100%</p>
                          <p className="text-xs text-gray-600 font-medium">Diversified</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {projectCategoryStats.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-semibold text-gray-700">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{item.percentage}%</p>
                          <p className="text-xs text-gray-500">{item.projects} projects</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600">
                            {activity.project || activity.investor || activity.amount}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-xl border border-green-100">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      href="/engo/launch"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
                    >
                      Launch New Project
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                    <Link
                      href="/projects"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      View All Projects
                    </Link>
                    <Link
                      href="/engo/details"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      ENGO Details
                    </Link>
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
