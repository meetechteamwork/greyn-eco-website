'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';

interface ESGReport {
  id: string;
  title: string;
  period: string;
  generatedDate: string;
  status: 'draft' | 'published' | 'archived';
  type: 'Annual' | 'Quarterly' | 'Monthly' | 'Custom';
  emissions: number;
  offsetPurchased: number;
  donations: number;
  volunteerHours: number;
  metrics?: any;
}

interface ReportsData {
  reports: ESGReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ESGReport | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    reportType: 'all',
    search: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    reportType: 'Annual',
    period: '',
    includeEmissions: true,
    includeDonations: true,
    includeVolunteers: true
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.corporate.reports.getAll({
        page: currentPage,
        limit: pageSize,
        status: filters.status !== 'all' ? filters.status : undefined,
        reportType: filters.reportType !== 'all' ? filters.reportType : undefined,
        search: filters.search || undefined
      });
      
      if (res.success && res.data) {
        setReportsData(res.data as ReportsData);
      } else {
        setError(res.message || 'Failed to load reports');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.period.trim()) {
      alert('Please enter a period (e.g., 2023, Q4 2023, January 2024)');
      return;
    }

    try {
      setGenerating(true);
      const res = await api.corporate.reports.generate({
        reportType: formData.reportType,
        period: formData.period,
        includeEmissions: formData.includeEmissions,
        includeDonations: formData.includeDonations,
        includeVolunteers: formData.includeVolunteers
      });

      if (res.success) {
        setShowGenerateModal(false);
        setFormData({
          reportType: 'Annual',
          period: '',
          includeEmissions: true,
          includeDonations: true,
          includeVolunteers: true
        });
        fetchReports(); // Refresh reports list
        alert('Report generated successfully!');
      } else {
        alert(res.message || 'Failed to generate report');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setExporting(true);
      await api.corporate.reports.exportAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        reportType: filters.reportType !== 'all' ? filters.reportType : undefined
      });
      alert('All reports exported successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to export reports');
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      setDownloading(reportId);
      await api.corporate.reports.export(reportId, 'csv');
    } catch (err: any) {
      alert(err.message || 'Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const res = await api.corporate.reports.get(reportId);
      if (res.success && res.data) {
        setSelectedReport(res.data as ESGReport);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load report details');
    }
  };

  const handleShare = () => {
    if (selectedReport) {
      const shareText = `Check out our ${selectedReport.title}: ${window.location.origin}/corporate/reports`;
      if (navigator.share) {
        navigator.share({
          title: selectedReport.title,
          text: shareText,
          url: window.location.href
        }).catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText);
          alert('Report link copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Report link copied to clipboard!');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      published: 'bg-green-100 text-green-700 border-green-300',
      archived: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    const icons = {
      draft: '📝',
      published: '✓',
      archived: '📦'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        <span>{icons[status as keyof typeof icons]}</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      Annual: 'bg-purple-100 text-purple-700 border-purple-300',
      Quarterly: 'bg-blue-100 text-blue-700 border-blue-300',
      Monthly: 'bg-pink-100 text-pink-700 border-pink-300',
      Custom: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[type as keyof typeof styles] || styles.Custom}`}>
        {type}
      </span>
    );
  };

  if (loading && !reportsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const reports = reportsData?.reports || [];
  const stats = reportsData?.stats || { total: 0, published: 0, draft: 0, archived: 0 };
  const pagination = reportsData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            ESG Reports
          </h1>
          <p className="text-lg text-gray-600">
            Generate, manage, and review your Environmental, Social, and Governance reports
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Generate ESG Report</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Total Reports</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Published</div>
          <div className="text-3xl font-bold">{stats.published}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Drafts</div>
          <div className="text-3xl font-bold">{stats.draft}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Archived</div>
          <div className="text-3xl font-bold">{stats.archived}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Reports History</h2>
                  <p className="text-gray-600">View and manage all your ESG reports</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Filter
                  </button>
                  <button
                    onClick={handleExportAll}
                    disabled={exporting || loading}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting ? 'Exporting...' : 'Export All'}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilter && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                      <select
                        value={filters.reportType}
                        onChange={(e) => handleFilterChange('reportType', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="Annual">Annual</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search reports..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-lg font-semibold mb-2">No reports found</p>
                          <p className="text-sm">Generate your first ESG report to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150 cursor-pointer"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              📊
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{report.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {report.emissions.toFixed(1)}t CO₂ • ${(report.donations / 1000).toFixed(0)}K donations
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700">{report.period}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(report.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {new Date(report.generatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewReport(report.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(report.id);
                              }}
                              disabled={downloading === report.id}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {downloading === report.id ? 'Downloading...' : 'Download'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{reports.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> reports
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white">
                  {pagination.page}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage >= pagination.pages || loading}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview Placeholder */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-xl font-bold mb-1">Report Preview</h3>
              <p className="text-sm opacity-90">Select a report to preview</p>
            </div>

            {selectedReport ? (
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">{selectedReport.title}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="font-semibold">{selectedReport.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-semibold">{selectedReport.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                </div>

                {/* PDF Preview Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">PDF Preview</div>
                    <div className="text-xs text-gray-500">Report content would appear here</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Emissions</div>
                    <div className="text-lg font-bold text-green-900">{selectedReport.emissions.toFixed(1)}t</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1">Offset</div>
                    <div className="text-lg font-bold text-blue-900">{selectedReport.offsetPurchased.toFixed(0)}t</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-700 mb-1">Donations</div>
                    <div className="text-lg font-bold text-purple-900">${(selectedReport.donations / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                    <div className="text-xs text-pink-700 mb-1">Volunteer Hrs</div>
                    <div className="text-lg font-bold text-pink-900">{selectedReport.volunteerHours}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(selectedReport.id)}
                    disabled={downloading === selectedReport.id}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {downloading === selectedReport.id ? 'Downloading...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <p className="text-gray-500 text-sm">Click on a report from the table to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Generate ESG Report</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="Annual">Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Period *
                </label>
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023, Q4 2023, January 2024"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Examples: "2023", "Q4 2023", "January 2024"</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Include Sections
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="includeEmissions"
                      checked={formData.includeEmissions}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">CO₂ Emissions Data</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="includeDonations"
                      checked={formData.includeDonations}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Donations & Contributions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="includeVolunteers"
                      checked={formData.includeVolunteers}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Volunteer Hours</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>{generating ? 'Generating...' : 'Generate Report'}</span>
                  {!generating && (
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
