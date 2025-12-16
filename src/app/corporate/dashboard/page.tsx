'use client';

import React from 'react';
import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';

export default function CorporateDashboardPage() {
  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Total CO₂ Emissions',
      value: '12,450',
      unit: 'tons',
      change: '+5.2%',
      trend: 'down' as const,
      icon: '🌍',
      gradient: 'from-red-500 to-orange-500',
      description: 'Annual carbon footprint'
    },
    {
      title: 'CO₂ Offset Purchased',
      value: '8,920',
      unit: 'tons',
      change: '+18.3%',
      trend: 'up' as const,
      icon: '🌱',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Carbon credits acquired'
    },
    {
      title: 'Total Donations',
      value: '$2.4M',
      unit: '',
      change: '+24.7%',
      trend: 'up' as const,
      icon: '💰',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'ESG contributions this year'
    },
    {
      title: 'Volunteer Hours',
      value: '15,240',
      unit: 'hours',
      change: '+12.1%',
      trend: 'up' as const,
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Community engagement'
    },
    {
      title: 'Active Campaigns',
      value: '24',
      unit: 'campaigns',
      change: '+4',
      trend: 'up' as const,
      icon: '📢',
      gradient: 'from-indigo-500 to-blue-500',
      description: 'Ongoing initiatives'
    },
    {
      title: 'Employees',
      value: '1,247',
      unit: 'people',
      change: '+8.5%',
      trend: 'up' as const,
      icon: '👤',
      gradient: 'from-teal-500 to-green-500',
      description: 'Total workforce'
    },
    {
      title: 'Sustainability Score',
      value: '87',
      unit: '/100',
      change: '+3.2',
      trend: 'up' as const,
      icon: '⭐',
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Overall ESG rating'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Corporate ESG Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive overview of your sustainability performance and impact metrics
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Export Report
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white hover:shadow-lg transition-all hover:scale-105">
              Generate Report
            </button>
          </div>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Period:</span>
          <div className="flex gap-2">
            {['This Month', 'This Quarter', 'This Year', 'All Time'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  period === 'This Year'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Trends</h2>
          <button className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
            View All Analytics
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emissions Trend Chart */}
          <ChartPlaceholder
            title="CO₂ Emissions Trend"
            description="Monthly emissions tracking over the past 12 months"
            height="h-80"
            gradient="from-red-500 to-orange-500"
          />

          {/* Donations vs Offsets Chart */}
          <ChartPlaceholder
            title="Donations vs Carbon Offsets"
            description="Comparison of financial contributions and offset purchases"
            height="h-80"
            gradient="from-blue-500 to-green-500"
          />

          {/* Volunteer Participation Chart */}
          <ChartPlaceholder
            title="Volunteer Participation"
            description="Monthly volunteer engagement and hours contributed"
            height="h-80"
            gradient="from-purple-500 to-pink-500"
          />

          {/* Additional Chart - Campaign Performance */}
          <ChartPlaceholder
            title="Campaign Performance"
            description="Impact metrics across active sustainability campaigns"
            height="h-80"
            gradient="from-indigo-500 to-cyan-500"
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-2xl p-8 text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sustainability Impact Summary</h2>
              <p className="text-green-100">Your company's overall ESG performance</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-5xl font-bold mb-1">87</div>
                <div className="text-sm text-green-100">Overall Score</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Environmental Impact</div>
              <div className="text-3xl font-bold mb-2">92</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Social Contribution</div>
              <div className="text-3xl font-bold mb-2">85</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Governance Score</div>
              <div className="text-3xl font-bold mb-2">88</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: '24', icon: '📊' },
          { label: 'Partners', value: '18', icon: '🤝' },
          { label: 'Countries', value: '12', icon: '🌎' },
          { label: 'Awards', value: '7', icon: '🏆' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
