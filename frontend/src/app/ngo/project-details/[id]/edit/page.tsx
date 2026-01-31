'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../../components/ProtectedRoute';
import NgoTopbar from '../../../components/NgoTopbar';
import Footer from '../../../../components/Footer';
import Link from 'next/link';
import { api } from '../../../../../utils/api';

const ProjectEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const categories = [
    'Reforestation',
    'Solar Energy',
    'Wind Energy',
    'Ocean Conservation',
    'Urban Sustainability',
    'Clean Transportation',
    'Wildlife Protection',
    'Water Conservation',
    'Other'
  ];

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.ngo.projects.getOne(projectId);
      if (response.success && response.data) {
        const p = response.data;
        setFormData({
          projectName: p.name || '',
          category: p.category || '',
          description: p.description || '',
          longDescription: p.longDescription || '',
          location: p.location || '',
          fundingGoal: p.fundingGoal?.toString() || '',
          minInvestment: p.minInvestment?.toString() || '',
          duration: p.duration || '',
          carbonImpact: p.carbonImpact || '',
          carbonCreditsPerHundred: p.carbonCreditsPerHundred?.toString() || ''
        });
      } else {
        setError(response.message || 'Failed to load project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const updateData: any = {};
      if (formData.projectName) updateData.projectName = formData.projectName.trim();
      if (formData.category) updateData.category = formData.category;
      if (formData.description !== undefined) updateData.description = formData.description.trim();
      if (formData.longDescription !== undefined) updateData.longDescription = formData.longDescription.trim();
      if (formData.location) updateData.location = formData.location.trim();
      if (formData.fundingGoal) updateData.fundingGoal = parseFloat(formData.fundingGoal);
      if (formData.minInvestment) updateData.minInvestment = parseFloat(formData.minInvestment);
      if (formData.duration !== undefined) updateData.duration = formData.duration.trim();
      if (formData.carbonImpact !== undefined) updateData.carbonImpact = formData.carbonImpact.trim();
      if (formData.carbonCreditsPerHundred) updateData.carbonCreditsPerHundred = parseFloat(formData.carbonCreditsPerHundred);

      const response = await api.ngo.projects.update(projectId, updateData);

      if (response.success) {
        setSuccess('Project updated successfully!');
        setTimeout(() => {
          router.push(`/ngo/project-details/${projectId}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to update project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ngo">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <NgoTopbar />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading project...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

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
                  href={`/ngo/project-details/${projectId}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Project
                </Link>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                Edit Project
              </h1>
              <p className="text-lg text-gray-600">
                Update your project information
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
                    required
                    disabled={saving}
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
                    disabled={saving}
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
                    required
                    disabled={saving}
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
                    required
                    disabled={saving}
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
                    required
                    disabled={saving}
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
                      min="1000"
                      step="0.01"
                      required
                      disabled={saving}
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
                      min="1"
                      step="0.01"
                      required
                      disabled={saving}
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
                      required
                      disabled={saving}
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
                      required
                      disabled={saving}
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
                    step="0.1"
                    min="0"
                    required
                    disabled={saving}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex gap-4">
                  <Link
                    href={`/ngo/project-details/${projectId}`}
                    className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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

export default ProjectEditPage;
