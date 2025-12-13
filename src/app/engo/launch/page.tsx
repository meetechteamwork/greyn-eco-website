'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const LaunchProjectPage: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    description: '',
    longDescription: '',
    location: '',
    fundingGoal: '',
    minInvestment: '',
    duration: '',
    carbonImpact: '',
    carbonCreditsPerHundred: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Project submitted successfully! It will be reviewed by our team.');
      setIsSubmitting(false);
      // Reset form
      setFormData({
        projectName: '',
        category: '',
        description: '',
        longDescription: '',
        location: '',
        fundingGoal: '',
        minInvestment: '',
        duration: '',
        carbonImpact: '',
        carbonCreditsPerHundred: ''
      });
    }, 1500);
  };

  const categories = [
    'Reforestation',
    'Solar Energy',
    'Wind Energy',
    'Ocean Conservation',
    'Urban Sustainability',
    'Clean Transportation',
    'Wildlife Protection',
    'Water Conservation'
  ];

  return (
    <ProtectedRoute requiredRole="engo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-4">
                <Link
                  href="/engo/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                Launch Your Project
              </h1>
              <p className="text-lg text-gray-600">
                Submit your environmental project for funding and community support
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label htmlFor="projectName" className="mb-2 block text-sm font-semibold text-gray-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., Amazon Rainforest Reforestation"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Brief one-line description"
                    required
                  />
                </div>

                {/* Long Description */}
                <div>
                  <label htmlFor="longDescription" className="mb-2 block text-sm font-semibold text-gray-700">
                    Detailed Description *
                  </label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Provide detailed information about your project..."
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., Amazon Basin, Brazil"
                    required
                  />
                </div>

                {/* Financial Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="fundingGoal" className="mb-2 block text-sm font-semibold text-gray-700">
                      Funding Goal ($) *
                    </label>
                    <input
                      type="number"
                      id="fundingGoal"
                      name="fundingGoal"
                      value={formData.fundingGoal}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="100000"
                      min="1000"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="minInvestment" className="mb-2 block text-sm font-semibold text-gray-700">
                      Minimum Investment ($) *
                    </label>
                    <input
                      type="number"
                      id="minInvestment"
                      name="minInvestment"
                      value={formData.minInvestment}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="50"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="duration" className="mb-2 block text-sm font-semibold text-gray-700">
                      Project Duration *
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="e.g., 10 years"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="carbonImpact" className="mb-2 block text-sm font-semibold text-gray-700">
                      Carbon Impact *
                    </label>
                    <input
                      type="text"
                      id="carbonImpact"
                      name="carbonImpact"
                      value={formData.carbonImpact}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="e.g., 500 tons CO₂/year"
                      required
                    />
                  </div>
                </div>

                {/* Carbon Credits */}
                <div>
                  <label htmlFor="carbonCreditsPerHundred" className="mb-2 block text-sm font-semibold text-gray-700">
                    Carbon Credits per $100 *
                  </label>
                  <input
                    type="number"
                    id="carbonCreditsPerHundred"
                    name="carbonCreditsPerHundred"
                    value={formData.carbonCreditsPerHundred}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="2.5"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Project for Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default LaunchProjectPage;

