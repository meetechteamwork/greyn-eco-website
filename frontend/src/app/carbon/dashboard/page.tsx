'use client';

import React, { useState, useEffect } from 'react';

interface RecentActivity {
  id: string;
  projectName: string;
  creditsBought: number;
  status: 'Active' | 'Retired';
  date: string;
}

interface DashboardStats {
  totalCredits: number;
  activeCredits: number;
  retiredCredits: number;
  portfolioValue: number;
}

const getStatusBadgeClass = (status: 'Active' | 'Retired') => {
  return status === 'Active'
    ? 'bg-green-100 text-green-700 border-green-200'
    : 'bg-blue-100 text-blue-700 border-blue-200';
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  gradient: string;
}> = ({ title, value, unit, icon, gradient }) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-lg text-gray-500 font-medium">{unit}</span>}
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </div>
  );
};

const ImpactCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  gradient: string;
}> = ({ title, value, icon, gradient }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChartPlaceholder: React.FC<{
  title: string;
  description: string;
  gradient: string;
}> = ({ title, description, gradient }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="h-64 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Data visualization coming soon</p>
            <p className="text-xs text-gray-400 mt-1">Chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CarbonDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 0,
    activeCredits: 0,
    retiredCredits: 0,
    portfolioValue: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call when carbon investor dashboard API is available
    // For now, calculate from localStorage cart data
    const calculateStats = () => {
      const cart = localStorage.getItem('carbonCart');
      if (cart) {
        try {
          const cartItems = JSON.parse(cart);
          const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          const value = cartItems.reduce((sum: number, item: any) => sum + ((item.minInvestment || 0) * (item.quantity || 1)), 0);

          setStats({
            totalCredits: total,
            activeCredits: total,
            retiredCredits: 0,
            portfolioValue: value,
          });
        } catch (e) {
          console.error('Error loading stats:', e);
        }
      }
      setLoading(false);
    };

    calculateStats();
  }, []);

  const kpiCards = [
    {
      title: 'Total Credits Purchased',
      value: stats.totalCredits.toLocaleString(),
      unit: 'credits',
      icon: '🌱',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Credits Retired',
      value: stats.retiredCredits.toLocaleString(),
      unit: 'credits',
      icon: '🔥',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Active Credits',
      value: stats.activeCredits.toLocaleString(),
      unit: 'credits',
      icon: '🏭',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Total CO₂ Offset',
      value: stats.totalCredits.toLocaleString(),
      unit: 'tonnes',
      icon: '🌍',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'Certificates Issued',
      value: '0',
      unit: 'certificates',
      icon: '📄',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Investment Value',
      value: `$${stats.portfolioValue.toLocaleString()}`,
      unit: '',
      icon: '💰',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  const impactCards = [
    {
      title: 'Trees Planted Equivalent',
      value: `${(stats.totalCredits * 20).toLocaleString()} trees`,
      icon: '🌳',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Cars Removed from Roads',
      value: `${Math.floor(stats.totalCredits / 4.6).toLocaleString()} cars`,
      icon: '🚗',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Homes Powered for a Year',
      value: `${Math.floor(stats.totalCredits / 8.7).toLocaleString()} homes`,
      icon: '🏠',
      gradient: 'from-purple-500 to-indigo-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Carbon Dashboard
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Overview of carbon credit activity and impact
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {kpiCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Impact Equivalency Cards */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Environmental Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {impactCards.map((card, index) => (
              <ImpactCard key={index} {...card} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Analytics & Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ChartPlaceholder
              title="Credits Purchased vs Retired"
              description="Comparison of purchased and retired credits over time"
              gradient="from-green-500 to-emerald-500"
            />
            <ChartPlaceholder
              title="Monthly Carbon Offset Trend"
              description="Monthly CO₂ offset tracking and projections"
              gradient="from-blue-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest carbon credit transactions and project investments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Credits Bought
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{activity.projectName}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {activity.creditsBought.toLocaleString()} credits
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(activity.status)}`}>
                        {activity.status === 'Active' ? '✓' : '📜'} {activity.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <p>
                Showing <span className="font-semibold text-gray-900">{activities.length}</span> recent activities
              </p>
              <button
                onClick={() => window.location.href = '/activities'}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                View All Activity →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


