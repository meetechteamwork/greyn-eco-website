'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { api } from '../../../utils/api';

type PeriodType = 'This Month' | 'This Quarter' | 'This Year' | 'All Time';

interface DashboardData {
  kpis: {
    totalEmissions: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    emissionsOffset: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    totalDonations: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    volunteerHours: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    activeCampaigns: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    employees: { value: number; unit: string; change: number; trend: 'up' | 'down' };
    sustainabilityScore: { value: number; unit: string; change: number; trend: 'up' | 'down' };
  };
  sustainabilityScores: {
    overall: number;
    environmental: number;
    social: number;
    governance: number;
  };
  quickStats: {
    projects: number;
    partners: number;
    countries: number;
    awards: number;
  };
  period: string;
}

export default function CorporateDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('This Year');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  const fetchDashboard = useCallback(async (period: PeriodType = selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.corporate.dashboard.get(period);
      if (res.success && res.data) {
        setDashboardData(res.data as DashboardData);
      } else {
        setError(res.message || 'Failed to load dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboard(selectedPeriod);
  }, [selectedPeriod, fetchDashboard]);

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      // Convert period to format expected by backend
      const periodMap: Record<string, string> = {
        'This Month': new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        'This Quarter': `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`,
        'This Year': new Date().getFullYear().toString(),
        'All Time': new Date().getFullYear().toString()
      };
      const period = periodMap[selectedPeriod] || selectedPeriod;
      
      const res = await api.corporate.reports.generate({
        reportType: 'Annual',
        period: period,
        includeEmissions: true,
        includeDonations: true,
        includeVolunteers: true
      });
      if (res.success) {
        alert('Report generated successfully! You can view it in the reports section.');
      } else {
        alert(res.message || 'Failed to generate report');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setExportingReport(true);
      // First generate a report if needed, then export
      const periodMap: Record<string, string> = {
        'This Month': new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        'This Quarter': `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`,
        'This Year': new Date().getFullYear().toString(),
        'All Time': new Date().getFullYear().toString()
      };
      const period = periodMap[selectedPeriod] || selectedPeriod;
      
      const generateRes = await api.corporate.reports.generate({
        reportType: 'Annual',
        period: period,
        includeEmissions: true,
        includeDonations: true,
        includeVolunteers: true
      });

      const reportData = generateRes.data as any;
      if (generateRes.success && reportData?.id) {
        await api.corporate.reports.export(reportData.id, 'csv');
        alert('Report exported successfully!');
      } else {
        alert('Failed to generate report for export');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to export report');
    } finally {
      setExportingReport(false);
    }
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === 'USD') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value.toFixed(0)}`;
    }
    if (value >= 1000) {
      return value.toLocaleString();
    }
    return value.toFixed(0);
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchDashboard(selectedPeriod)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = dashboardData || {
    kpis: {
      totalEmissions: { value: 0, unit: 'tons', change: 0, trend: 'down' },
      emissionsOffset: { value: 0, unit: 'tons', change: 0, trend: 'up' },
      totalDonations: { value: 0, unit: 'USD', change: 0, trend: 'up' },
      volunteerHours: { value: 0, unit: 'hours', change: 0, trend: 'up' },
      activeCampaigns: { value: 0, unit: 'campaigns', change: 0, trend: 'up' },
      employees: { value: 0, unit: 'people', change: 0, trend: 'up' },
      sustainabilityScore: { value: 0, unit: '/100', change: 0, trend: 'up' }
    },
    sustainabilityScores: { overall: 0, environmental: 0, social: 0, governance: 0 },
    quickStats: { projects: 0, partners: 0, countries: 0, awards: 0 },
    period: selectedPeriod
  };

  const kpiCards = [
    {
      title: 'Total CO₂ Emissions',
      value: formatValue(data.kpis.totalEmissions.value, data.kpis.totalEmissions.unit),
      unit: data.kpis.totalEmissions.unit,
      change: formatChange(data.kpis.totalEmissions.change),
      trend: data.kpis.totalEmissions.trend,
      icon: '🌍',
      gradient: 'from-red-500 to-orange-500',
      description: 'Annual carbon footprint'
    },
    {
      title: 'CO₂ Offset Purchased',
      value: formatValue(data.kpis.emissionsOffset.value, data.kpis.emissionsOffset.unit),
      unit: data.kpis.emissionsOffset.unit,
      change: formatChange(data.kpis.emissionsOffset.change),
      trend: data.kpis.emissionsOffset.trend,
      icon: '🌱',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Carbon credits acquired'
    },
    {
      title: 'Total Donations',
      value: formatValue(data.kpis.totalDonations.value, data.kpis.totalDonations.unit),
      unit: '',
      change: formatChange(data.kpis.totalDonations.change),
      trend: data.kpis.totalDonations.trend,
      icon: '💰',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'ESG contributions this year'
    },
    {
      title: 'Volunteer Hours',
      value: formatValue(data.kpis.volunteerHours.value, data.kpis.volunteerHours.unit),
      unit: data.kpis.volunteerHours.unit,
      change: formatChange(data.kpis.volunteerHours.change),
      trend: data.kpis.volunteerHours.trend,
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Community engagement'
    },
    {
      title: 'Active Campaigns',
      value: formatValue(data.kpis.activeCampaigns.value, data.kpis.activeCampaigns.unit),
      unit: data.kpis.activeCampaigns.unit,
      change: data.kpis.activeCampaigns.change > 0 ? `+${data.kpis.activeCampaigns.change}` : String(data.kpis.activeCampaigns.change),
      trend: data.kpis.activeCampaigns.trend,
      icon: '📢',
      gradient: 'from-indigo-500 to-blue-500',
      description: 'Ongoing initiatives'
    },
    {
      title: 'Employees',
      value: formatValue(data.kpis.employees.value, data.kpis.employees.unit),
      unit: data.kpis.employees.unit,
      change: formatChange(data.kpis.employees.change),
      trend: data.kpis.employees.trend,
      icon: '👤',
      gradient: 'from-teal-500 to-green-500',
      description: 'Total workforce'
    },
    {
      title: 'Sustainability Score',
      value: formatValue(data.kpis.sustainabilityScore.value, data.kpis.sustainabilityScore.unit),
      unit: data.kpis.sustainabilityScore.unit,
      change: `+${data.kpis.sustainabilityScore.change}`,
      trend: data.kpis.sustainabilityScore.trend,
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
            <button
              onClick={handleExportReport}
              disabled={exportingReport || loading}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingReport ? 'Exporting...' : 'Export Report'}
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport || loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Period:</span>
          <div className="flex gap-2">
            {(['This Month', 'This Quarter', 'This Year', 'All Time'] as PeriodType[]).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedPeriod === period
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

      {/* Error Message */}
      {error && dashboardData && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

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
          <Link 
            href="/corporate/reports"
            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
          >
            View All Analytics
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emissions Trend Chart */}
          <ChartPlaceholder
            title="CO₂ Emissions Trend"
            description="Monthly emissions tracking over the past 12 months"
            height="h-80"
            gradient="from-red-500 to-orange-500"
            href="/corporate/emissions"
          />

          {/* Donations vs Offsets Chart */}
          <ChartPlaceholder
            title="Donations vs Carbon Offsets"
            description="Comparison of financial contributions and offset purchases"
            height="h-80"
            gradient="from-blue-500 to-green-500"
            href="/corporate/reports"
          />

          {/* Volunteer Participation Chart */}
          <ChartPlaceholder
            title="Volunteer Participation"
            description="Monthly volunteer engagement and hours contributed"
            height="h-80"
            gradient="from-purple-500 to-pink-500"
            href="/corporate/volunteers"
          />

          {/* Additional Chart - Campaign Performance */}
          <ChartPlaceholder
            title="Campaign Performance"
            description="Impact metrics across active sustainability campaigns"
            height="h-80"
            gradient="from-indigo-500 to-cyan-500"
            href="/corporate/campaigns"
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
                <div className="text-5xl font-bold mb-1">{data.sustainabilityScores.overall}</div>
                <div className="text-sm text-green-100">Overall Score</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Environmental Impact</div>
              <div className="text-3xl font-bold mb-2">{data.sustainabilityScores.environmental}</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${data.sustainabilityScores.environmental}%` }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Social Contribution</div>
              <div className="text-3xl font-bold mb-2">{data.sustainabilityScores.social}</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${data.sustainabilityScores.social}%` }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Governance Score</div>
              <div className="text-3xl font-bold mb-2">{data.sustainabilityScores.governance}</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${data.sustainabilityScores.governance}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: data.quickStats.projects, icon: '📊' },
          { label: 'Partners', value: data.quickStats.partners, icon: '🤝' },
          { label: 'Countries', value: data.quickStats.countries, icon: '🌎' },
          { label: 'Awards', value: data.quickStats.awards, icon: '🏆' }
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
