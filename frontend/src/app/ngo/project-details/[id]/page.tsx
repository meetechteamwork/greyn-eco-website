'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import NgoTopbar from '../../components/NgoTopbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { api } from '../../../../utils/api';

interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
}

interface Project {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  longDescription: string;
  location: string;
  fundingGoal: number;
  minInvestment: number;
  currentFunding: number;
  donors: number;
  carbonCredits: number;
  carbonImpact: string;
  carbonCreditsPerHundred: number;
  duration: string;
  progress: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  milestones: Milestone[];
  team: TeamMember[];
}

const NGOProjectDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
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

  const handleEditProject = () => {
    router.push(`/ngo/project-details/${projectId}/edit`);
  };

  const handleViewAnalytics = () => {
    router.push(`/ngo/project-details/${projectId}/analytics`);
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
                  <p className="text-gray-600">Loading project details...</p>
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
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={loadProject}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Retry
                  </button>
                  <Link
                    href="/ngo/dashboard"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Back to Dashboard
                  </Link>
                </div>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

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
                {project.name}
              </h1>
              <p className="text-lg text-gray-600">{project.description || 'No description available'}</p>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Project Overview */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Overview</h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {project.longDescription || project.description || 'No detailed description available.'}
                  </p>
                </div>

                {/* Funding Progress */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Funding Progress</h2>
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">Progress</span>
                      <span className="font-bold text-green-600">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                        style={{ width: `${Math.min(100, fundingPercentage)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${(project.currentFunding / 1000).toFixed(0)}k raised</span>
                    <span>${(project.fundingGoal / 1000).toFixed(0)}k goal</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-gray-600">Donors</p>
                      <p className="text-2xl font-bold text-green-700">{project.donors || 0}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-bold text-blue-700">{project.duration || 'N/A'}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm text-gray-600">Min Investment</p>
                      <p className="text-2xl font-bold text-purple-700">${project.minInvestment || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Milestones</h2>
                  {project.milestones && project.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id || index} className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                          } text-white`}>
                            {milestone.status === 'completed' ? (
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-lg font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{milestone.title}</p>
                            {milestone.description && (
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">{formatDate(milestone.date)}</p>
                            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                              milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {milestone.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No milestones added yet</p>
                    </div>
                  )}
                </div>

                {/* Team */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Team</h2>
                  {project.team && project.team.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {project.team.map((member, index) => (
                        <div key={member.id || index} className="rounded-lg border border-gray-200 p-4">
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          {member.email && (
                            <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                          )}
                          {member.bio && (
                            <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No team members added yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Project Info */}
                  <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Project Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{project.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{project.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(project.startDate)}</p>
                      </div>
                      {project.endDate && (
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(project.endDate)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Carbon Credits</p>
                        <p className="font-semibold text-green-600">
                          {project.carbonCreditsPerHundred || 0} per $100
                        </p>
                      </div>
                      {project.carbonImpact && (
                        <div>
                          <p className="text-sm text-gray-600">Carbon Impact</p>
                          <p className="font-semibold text-gray-900">{project.carbonImpact}</p>
                        </div>
                      )}
                      {project.carbonCredits > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Total Credits</p>
                          <p className="font-semibold text-green-600">{project.carbonCredits.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleEditProject}
                        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                      >
                        Edit Project
                      </button>
                      <button
                        onClick={handleViewAnalytics}
                        className="w-full rounded-lg border-2 border-green-600 px-4 py-3 font-semibold text-green-600 transition hover:bg-green-50"
                      >
                        View Analytics
                      </button>
                    </div>
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

export default NGOProjectDetailsPage;
