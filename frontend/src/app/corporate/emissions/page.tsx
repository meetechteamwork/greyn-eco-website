'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';

interface EmissionEntry {
  id: string;
  date: string;
  category: string;
  value: string;
  co2Output: string;
  country: string;
}

interface EmissionsData {
  emissions: EmissionEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalEmissions: number;
    wasteRecycled: number;
    totalEntries: number;
  };
}

export default function EmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [emissionsData, setEmissionsData] = useState<EmissionsData | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    category: 'all',
    country: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    electricity: '',
    fuel: '',
    travelDistance: '',
    travelFlights: '',
    wasteRecycled: '',
    country: ''
  });

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Pakistan'
  ];

  const fetchEmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.corporate.emissions.getAll({
        page: currentPage,
        limit: pageSize,
        category: filters.category !== 'all' ? filters.category : undefined,
        country: filters.country !== 'all' ? filters.country : undefined,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });

      if (res.success && res.data) {
        setEmissionsData(res.data as EmissionsData);
      } else {
        setError(res.message || 'Failed to load emissions');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load emissions');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchEmissions();
  }, [fetchEmissions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one field is filled
    if (!formData.electricity && !formData.fuel && !formData.travelDistance && !formData.travelFlights && !formData.wasteRecycled) {
      alert('Please enter at least one emission value');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.corporate.emissions.create({
        electricity: formData.electricity ? parseFloat(formData.electricity) : undefined,
        fuel: formData.fuel ? parseFloat(formData.fuel) : undefined,
        travelDistance: formData.travelDistance ? parseFloat(formData.travelDistance) : undefined,
        travelFlights: formData.travelFlights ? parseFloat(formData.travelFlights) : undefined,
        wasteRecycled: formData.wasteRecycled ? parseFloat(formData.wasteRecycled) : undefined,
        country: formData.country || undefined
      });

      if (res.success) {
        setFormData({
          electricity: '',
          fuel: '',
          travelDistance: '',
          travelFlights: '',
          wasteRecycled: '',
          country: ''
        });
        fetchEmissions();
        alert(res.message || 'Emission data submitted successfully!');
      } else {
        alert(res.message || 'Failed to submit emission data');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit emission data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      electricity: '',
      fuel: '',
      travelDistance: '',
      travelFlights: '',
      wasteRecycled: '',
      country: ''
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await api.corporate.emissions.export({
        category: filters.category !== 'all' ? filters.category : undefined,
        country: filters.country !== 'all' ? filters.country : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      alert('Emissions exported successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to export emissions');
    } finally {
      setExporting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electricity':
        return '⚡';
      case 'Fuel':
        return '⛽';
      case 'Travel':
        return '✈️';
      case 'Waste Recycled':
        return '♻️';
      default:
        return '📊';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Electricity':
        return 'from-yellow-500 to-orange-500';
      case 'Fuel':
        return 'from-red-500 to-pink-500';
      case 'Travel':
        return 'from-blue-500 to-cyan-500';
      case 'Waste Recycled':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading && !emissionsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading emissions...</p>
        </div>
      </div>
    );
  }

  const emissions = emissionsData?.emissions || [];
  const stats = emissionsData?.stats || { totalEmissions: 0, wasteRecycled: 0, totalEntries: 0 };
  const pagination = emissionsData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          CO₂ Emissions Tracking
        </h1>
        <p className="text-lg text-gray-600">
          Monitor and record your company's carbon emissions across all sources
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchEmissions}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">🌍</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Total Emissions</div>
              <div className="text-3xl font-bold">{Math.abs(stats.totalEmissions).toLocaleString()}</div>
              <div className="text-sm">tons CO₂</div>
            </div>
          </div>
          <div className="text-xs opacity-80">Last 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">♻️</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Waste Recycled</div>
              <div className="text-3xl font-bold">{Math.round(stats.wasteRecycled)}</div>
              <div className="text-sm">tons offset</div>
            </div>
          </div>
          <div className="text-xs opacity-80">This month</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Entries Recorded</div>
              <div className="text-3xl font-bold">{stats.totalEntries}</div>
              <div className="text-sm">this month</div>
            </div>
          </div>
          <div className="text-xs opacity-80">Active tracking</div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Record New Emission</h2>
          <p className="text-gray-600">Enter emission data to track your carbon footprint</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Electricity Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Electricity Consumption
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="electricity"
                  value={formData.electricity}
                  onChange={handleInputChange}
                  placeholder="Enter kWh"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">kWh</span>
              </div>
            </div>

            {/* Fuel Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">⛽</span>
                  Fuel Consumption
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  placeholder="Enter liters"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">liters</span>
              </div>
            </div>

            {/* Travel Distance Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">🚗</span>
                  Travel Distance
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="travelDistance"
                  value={formData.travelDistance}
                  onChange={handleInputChange}
                  placeholder="Enter distance in km"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">km</span>
              </div>
            </div>

            {/* Travel Flights Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  Number of Flights
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="travelFlights"
                  value={formData.travelFlights}
                  onChange={handleInputChange}
                  placeholder="Enter number of flights"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">flights</span>
              </div>
            </div>

            {/* Waste Recycled Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">♻️</span>
                  Waste Recycled
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="wasteRecycled"
                  value={formData.wasteRecycled}
                  onChange={handleInputChange}
                  placeholder="Enter kg"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">kg</span>
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="group md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">🌎</span>
                  Country / Region
                </span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{submitting ? 'Submitting...' : 'Submit Emission Data'}</span>
              {!submitting && (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Emission History</h2>
              <p className="text-gray-600">Historical record of all tracked emissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg transition-all"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Travel">Travel</option>
                    <option value="Waste Recycled">Waste Recycled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search emissions..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
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
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CO₂ Output
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Country
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {emissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-semibold mb-2">No emissions found</p>
                      <p className="text-sm">Start tracking your emissions by submitting data above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                emissions.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(entry.category)} text-white text-lg`}>
                          {getCategoryIcon(entry.category)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{entry.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">{entry.value}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          entry.co2Output.startsWith('-') || entry.category === 'Waste Recycled'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {entry.co2Output.startsWith('-') || entry.category === 'Waste Recycled' ? '↓' : '↑'} {entry.co2Output.replace('-', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌎</span>
                        <span className="text-sm text-gray-700">{entry.country}</span>
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
            Showing <span className="font-semibold text-gray-900">{emissions.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white">
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
  );
}
