'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import NgoTopbar from '../components/NgoTopbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { api } from '../../../utils/api';

const LaunchProjectPage: React.FC = () => {
  const router = useRouter();
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.projectName || !formData.category || !formData.description || !formData.location || !formData.fundingGoal) {
        setError('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }

      if (parseFloat(formData.fundingGoal) < 1000) {
        setError('Funding goal must be at least $1,000.');
        setIsSubmitting(false);
        return;
      }

      if (formData.minInvestment && parseFloat(formData.minInvestment) < 1) {
        setError('Minimum investment must be at least $1.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const projectData = {
        projectName: formData.projectName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        location: formData.location.trim(),
        fundingGoal: parseFloat(formData.fundingGoal),
        minInvestment: formData.minInvestment ? parseFloat(formData.minInvestment) : undefined,
        duration: formData.duration.trim() || undefined,
        carbonImpact: formData.carbonImpact.trim() || undefined,
        carbonCreditsPerHundred: formData.carbonCreditsPerHundred ? parseFloat(formData.carbonCreditsPerHundred) : undefined
      };

      const response = await api.ngo.projects.create(projectData);

      if (response.success) {
        setSuccess(response.message || 'Project submitted successfully! It will be reviewed by our team.');
        
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

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/ngo/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit project. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    <ProtectedRoute requiredRole="ngo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <NgoTopbar />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-4">
                <Link
                  href="/ngo/dashboard"
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

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                      step="0.01"
                      required
                      disabled={isSubmitting}
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
                      step="0.01"
                      required
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Project for Review'
                    )}
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
