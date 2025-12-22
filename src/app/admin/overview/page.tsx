'use client';

import React from 'react';

// Chart Placeholder Component
const ChartPlaceholder: React.FC<{
  title: string;
  description?: string;
  height?: string;
  gradient?: string;
  icon?: React.ReactNode;
}> = ({ title, description, height = 'h-80', gradient = 'from-blue-500 to-purple-500', icon }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      <div className={`${height} relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 border border-gray-200 dark:border-slate-600`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`grid-${title.replace(/\s+/g, '-')}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${title.replace(/\s+/g, '-')})`} className="text-gray-400"/>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {icon || (
              <div className={`mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            )}
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Data Visualization</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Coming soon</p>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient} opacity-30 animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
        <span>Last updated: Today</span>
        <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

// Funnel Chart Component
const CreditsLifecycleFunnel: React.FC = () => {
  const funnelData = [
    { label: 'Issued', value: 15847, percentage: 100, color: 'from-blue-500 to-blue-600' },
    { label: 'Active', value: 12450, percentage: 78.5, color: 'from-green-500 to-green-600' },
    { label: 'Verified', value: 9850, percentage: 62.1, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Retired', value: 5997, percentage: 37.8, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Credits Lifecycle Funnel</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">Credit flow from issuance to retirement</p>
      </div>

      <div className="space-y-4">
        {funnelData.map((stage, index) => (
          <div key={stage.label} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{stage.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stage.value.toLocaleString()}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">({stage.percentage}%)</span>
              </div>
            </div>
            <div className="relative h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
              <div
                className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-1000 ease-out flex items-center justify-end pr-4`}
                style={{ width: `${stage.percentage}%` }}
              >
                <span className="text-xs font-bold text-white opacity-80">{stage.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-slate-400">Conversion Rate</span>
          <span className="font-bold text-gray-900 dark:text-white">37.8%</span>
        </div>
      </div>
    </div>
  );
};

// Heatmap Component
const PortalActivityHeatmap: React.FC = () => {
  const portals = ['Corporate ESG', 'Carbon Marketplace', 'NGO Portal'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Mock activity data (0-100 scale)
  const getActivityLevel = (portal: number, day: number, hour: number) => {
    // Simulate realistic patterns: higher activity during business hours, weekdays
    const baseActivity = hour >= 9 && hour <= 17 ? 60 : 30;
    const dayMultiplier = day < 5 ? 1.2 : 0.8; // Weekdays vs weekends
    const portalVariation = portal * 10;
    return Math.min(100, Math.floor((baseActivity * dayMultiplier) + portalVariation + (Math.random() * 20)));
  };

  const getColorClass = (level: number) => {
    if (level >= 70) return 'bg-red-500';
    if (level >= 50) return 'bg-orange-500';
    if (level >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Portal Activity Heatmap</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">24-hour activity patterns across portals</p>
      </div>

      <div className="space-y-6">
        {portals.map((portal, portalIndex) => (
          <div key={portal}>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">{portal}</h4>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, dayIndex) => (
                <div key={day} className="space-y-1">
                  <div className="text-xs font-medium text-gray-600 dark:text-slate-400 text-center mb-2">{day}</div>
                  <div className="flex flex-col gap-1">
                    {hours.slice(9, 21).map((hour) => {
                      const activity = getActivityLevel(portalIndex, dayIndex, hour);
                      return (
                        <div
                          key={hour}
                          className={`h-3 w-full rounded ${getColorClass(activity)} opacity-${Math.max(30, activity)} hover:scale-110 transition-transform cursor-pointer`}
                          style={{ opacity: activity / 100 }}
                          title={`${hour}:00 - ${activity}% activity`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-slate-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-slate-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-gray-600 dark:text-slate-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-gray-600 dark:text-slate-400">Peak</span>
          </div>
        </div>
        <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default function AdminOverviewPage() {
  // Executive-level KPI data
  const kpis = [
    {
      label: 'Total Users',
      value: '12,847',
      change: '+1,243 this month',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      bgPattern: 'from-blue-400/20 to-indigo-400/20',
    },
    {
      label: 'Active Corporates',
      value: '342',
      change: '+28 this quarter',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      ),
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      bgPattern: 'from-purple-400/20 to-pink-400/20',
    },
    {
      label: 'NGOs Registered',
      value: '127',
      change: '+15 this quarter',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      bgPattern: 'from-green-400/20 to-teal-400/20',
    },
    {
      label: 'Carbon Credits Issued',
      value: '15,847.5',
      unit: 'tCO₂e',
      change: '+2,341 this month',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      bgPattern: 'from-emerald-400/20 to-cyan-400/20',
    },
    {
      label: 'Credits Retired',
      value: '5,997.2',
      unit: 'tCO₂e',
      change: '+892 this month',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      bgPattern: 'from-orange-400/20 to-yellow-400/20',
    },
    {
      label: 'Platform Revenue',
      value: '$2.47M',
      change: '+18.3% YoY',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      gradient: 'from-red-500 via-rose-600 to-pink-600',
      bgPattern: 'from-red-400/20 to-pink-400/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Executive Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                  Platform Overview
                </h1>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-2">
                  Executive dashboard • Real-time insights & analytics
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-700">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-bold text-red-700 dark:text-red-300">LIVE</span>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Gradient Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient}`}></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} text-white shadow-lg`}>
                      {kpi.icon}
                    </div>
                    {kpi.changeType === 'positive' && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span className="text-xs font-bold text-green-700 dark:text-green-300">+</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-1">{kpi.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</span>
                      {kpi.unit && (
                        <span className="text-sm font-medium text-gray-500 dark:text-slate-500">{kpi.unit}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{kpi.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Platform Usage Trend */}
            <ChartPlaceholder
              title="Platform Usage Trend"
              description="Monthly active users and engagement metrics over time"
              height="h-96"
              gradient="from-blue-500 via-indigo-500 to-purple-500"
              icon={
                <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              }
            />

            {/* Credits Lifecycle Funnel */}
            <CreditsLifecycleFunnel />
          </div>

          {/* Portal Activity Heatmap */}
          <div className="mb-6">
            <PortalActivityHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
}
