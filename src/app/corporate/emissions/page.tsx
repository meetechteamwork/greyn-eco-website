'use client';

import React, { useState } from 'react';

interface EmissionEntry {
  id: string;
  date: string;
  category: string;
  value: string;
  co2Output: string;
  country: string;
}

export default function EmissionsPage() {
  const [formData, setFormData] = useState({
    electricity: '',
    fuel: '',
    travel: '',
    wasteRecycled: '',
    country: ''
  });

  // Mock historical emission entries
  const mockEmissions: EmissionEntry[] = [
    {
      id: '1',
      date: '2024-01-15',
      category: 'Electricity',
      value: '45,230 kWh',
      co2Output: '18,092 tons',
      country: 'United States'
    },
    {
      id: '2',
      date: '2024-01-14',
      category: 'Fuel',
      value: '12,450 liters',
      co2Output: '32,370 tons',
      country: 'United States'
    },
    {
      id: '3',
      date: '2024-01-13',
      category: 'Travel',
      value: '8,240 km',
      co2Output: '1,648 tons',
      country: 'United Kingdom'
    },
    {
      id: '4',
      date: '2024-01-12',
      category: 'Waste Recycled',
      value: '2,340 kg',
      co2Output: '-468 tons',
      country: 'Canada'
    },
    {
      id: '5',
      date: '2024-01-11',
      category: 'Electricity',
      value: '43,890 kWh',
      co2Output: '17,556 tons',
      country: 'United States'
    },
    {
      id: '6',
      date: '2024-01-10',
      category: 'Travel',
      value: '12 flights',
      co2Output: '2,880 tons',
      country: 'Germany'
    },
    {
      id: '7',
      date: '2024-01-09',
      category: 'Fuel',
      value: '11,200 liters',
      co2Output: '29,120 tons',
      country: 'United States'
    },
    {
      id: '8',
      date: '2024-01-08',
      category: 'Waste Recycled',
      value: '1,980 kg',
      co2Output: '-396 tons',
      country: 'Australia'
    },
    {
      id: '9',
      date: '2024-01-07',
      category: 'Electricity',
      value: '46,780 kWh',
      co2Output: '18,712 tons',
      country: 'United States'
    },
    {
      id: '10',
      date: '2024-01-06',
      category: 'Travel',
      value: '6,890 km',
      co2Output: '1,378 tons',
      country: 'France'
    }
  ];

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
    'Brazil'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No logic needed - just prevent default
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

  // Calculate totals
  const totalEmissions = mockEmissions.reduce((sum, entry) => {
    const value = parseFloat(entry.co2Output.replace(/[^0-9.-]/g, ''));
    return sum + value;
  }, 0);

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">🌍</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Total Emissions</div>
              <div className="text-3xl font-bold">{Math.abs(totalEmissions).toLocaleString()}</div>
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
              <div className="text-3xl font-bold">864</div>
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
              <div className="text-3xl font-bold">{mockEmissions.length}</div>
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">liters</span>
              </div>
            </div>

            {/* Travel Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  Travel Distance / Flights
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="travel"
                  value={formData.travel}
                  onChange={handleInputChange}
                  placeholder="Enter km or number of flights"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
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
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>Submit Emission Data</span>
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
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
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Export CSV
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg transition-all">
                Filter
              </button>
            </div>
          </div>
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
              {mockEmissions.map((entry, index) => (
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
                        entry.co2Output.startsWith('-')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entry.co2Output.startsWith('-') ? '↓' : '↑'} {entry.co2Output.replace('-', '')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌎</span>
                      <span className="text-sm text-gray-700">{entry.country}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{mockEmissions.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


