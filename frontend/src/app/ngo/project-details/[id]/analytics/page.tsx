'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '../../../../../components/ProtectedRoute';
import NgoTopbar from '../../../components/NgoTopbar';
import Footer from '../../../../components/Footer';
import Link from 'next/link';
import { api } from '../../../../../utils/api';

const ProjectAnalyticsPage: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setProject(response.data);
      } else {
        setError(response.message || 'Failed to load project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ngo">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <NgoTopbar />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !project) {
    return (
      <ProtectedRoute requiredRole="ngo">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <NgoTopbar />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link
                  href={`/ngo/project-details/${projectId}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Back to Project
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) return null;

  const fundingPercentage = project.fundingGoal > 0 
    ? (project.currentFunding / project.fundingGoal) * 100 
    : 0;

  return (
    <ProtectedRoute requiredRole="ngo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <NgoTopbar />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
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
                Project Analytics
              </h1>
              <p className="text-lg text-gray-600">{project.name}</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6 text-white shadow-xl">
                <p className="text-sm font-medium text-green-100 mb-2">Funding Progress</p>
                <p className="text-3xl font-bold">{fundingPercentage.toFixed(0)}%</p>
                <p className="text-sm text-green-100 mt-2">
                  ${(project.currentFunding / 1000).toFixed(0)}k / ${(project.fundingGoal / 1000).toFixed(0)}k
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl">
                <p className="text-sm font-medium text-blue-100 mb-2">Total Donors</p>
                <p className="text-3xl font-bold">{project.donors || 0}</p>
                <p className="text-sm text-blue-100 mt-2">Active supporters</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-6 text-white shadow-xl">
                <p className="text-sm font-medium text-purple-100 mb-2">Carbon Credits</p>
                <p className="text-3xl font-bold">{(project.carbonCredits || 0).toLocaleString()}</p>
                <p className="text-sm text-purple-100 mt-2">Total generated</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-xl">
                <p className="text-sm font-medium text-emerald-100 mb-2">Project Status</p>
                <p className="text-2xl font-bold capitalize">{project.status}</p>
                <p className="text-sm text-emerald-100 mt-2">Current state</p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Funding Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Funding</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(project.currentFunding || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Funding Goal</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${(project.fundingGoal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${((project.fundingGoal || 0) - (project.currentFunding || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                        style={{ width: `${Math.min(100, fundingPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-lg font-semibold text-gray-900">{project.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{project.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{project.duration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carbon Impact</p>
                    <p className="text-lg font-semibold text-gray-900">{project.carbonImpact || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carbon Credits per $100</p>
                    <p className="text-lg font-semibold text-green-600">{project.carbonCreditsPerHundred || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ProjectAnalyticsPage;
