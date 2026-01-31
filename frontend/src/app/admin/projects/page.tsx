'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../utils/api';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Footer from '../../components/Footer';

interface Project {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'completed' | 'rejected' | 'paused' | 'cancelled';
  fundingGoal: number;
  currentFunding: number;
  donors: number;
  carbonImpact: string;
  location: string;
  createdAt: string;
  ngo?: {
    id: string;
    name: string;
    email: string;
    contactPerson: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  approvedAt?: string;
  rejectedBy?: {
    id: string;
    name: string;
  };
  rejectedAt?: string;
  rejectionReason?: string;
}

interface ProjectStats {
  total: number;
  pending: number;
  active: number;
  completed: number;
  rejected: number;
}

const AdminProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadProjects();
  }, [filter, categoryFilter, searchTerm]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.admin.projects.get({
        status: filter !== 'all' ? filter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        page: 1,
        limit: 100
      });

      if (response.success && response.data) {
        const data = response.data as any;
        setProjects(data.projects || []);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          active: 0,
          completed: 0,
          rejected: 0
        });
      } else {
        setError(response.message || 'Failed to load projects');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProject) return;

    setActionLoading(selectedProject.id);
    try {
      const response = await api.admin.projects.approve(selectedProject.id, approveComment || undefined);
      if (response.success) {
        setShowApproveModal(false);
        setApproveComment('');
        setSelectedProject(null);
        await loadProjects();
      } else {
        setError(response.message || 'Failed to approve project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to approve project');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedProject || !rejectReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setActionLoading(selectedProject.id);
    try {
      const response = await api.admin.projects.reject(selectedProject.id, rejectReason);
      if (response.success) {
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedProject(null);
        await loadProjects();
      } else {
        setError(response.message || 'Failed to reject project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject project');
    } finally {
      setActionLoading(null);
    }
  };

  const openApproveModal = (project: Project) => {
    setSelectedProject(project);
    setApproveComment('');
    setShowApproveModal(true);
    setError(null);
  };

  const openRejectModal = (project: Project) => {
    setSelectedProject(project);
    setRejectReason('');
    setShowRejectModal(true);
    setError(null);
  };

  const handleDelete = async (projectId: string) => {
    setActionLoading(projectId);
    try {
      const response = await api.admin.projects.delete(projectId);
      if (response.success) {
        await loadProjects();
      } else {
        setError(response.message || 'Failed to delete project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setActionLoading(null);
    }
  };

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

  const categories = [
    'Reforestation',
    'Solar Energy',
    'Wind Energy',
    'Ocean Cleanup',
    'Ocean Conservation',
    'Urban Sustainability',
    'Clean Transportation',
    'Wildlife Protection',
    'Water Conservation',
    'Other'
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 transition-colors self-start"
                >
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7"></path>
                  </svg>
                </Link>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Project Management
                </h1>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 self-start sm:self-auto">
                  ADMIN
                </span>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 sm:ml-9">
                Review, approve, and manage all NGO projects
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-xl p-4 transition-all ${
                  filter === 'all' ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-lg' : 'bg-white text-gray-900 shadow hover:shadow-lg'
                }`}
              >
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm font-medium">Total</p>
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`rounded-xl p-4 transition-all ${
                  filter === 'active' ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg' : 'bg-white text-gray-900 shadow hover:shadow-lg'
                }`}
              >
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm font-medium">Active</p>
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`rounded-xl p-4 transition-all ${
                  filter === 'pending' ? 'bg-gradient-to-br from-yellow-600 to-yellow-700 text-white shadow-lg' : 'bg-white text-gray-900 shadow hover:shadow-lg'
                }`}
              >
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm font-medium">Pending</p>
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-xl p-4 transition-all ${
                  filter === 'completed' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' : 'bg-white text-gray-900 shadow hover:shadow-lg'
                }`}
              >
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm font-medium">Completed</p>
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`rounded-xl p-4 transition-all ${
                  filter === 'rejected' ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg' : 'bg-white text-gray-900 shadow hover:shadow-lg'
                }`}
              >
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm font-medium">Rejected</p>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 sm:mb-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none"
                  />
                  <svg
                    className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border-2 border-gray-300 px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={loadProjects}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 transition-all hover:bg-gray-200"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Projects Table */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-600">Loading projects...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-[800px] w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Project Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">NGO</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Funding</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Donors</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {projects.map((project) => {
                        const fundingPercentage = project.fundingGoal > 0 
                          ? (project.currentFunding / project.fundingGoal) * 100 
                          : 0;
                        return (
                          <tr key={project.id} className="transition-colors hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-gray-900">{project.name}</p>
                                <p className="text-sm text-gray-600">{project.location}</p>
                                {project.carbonImpact && (
                                  <p className="text-xs text-gray-500 mt-1">{project.carbonImpact}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {project.ngo ? (
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{project.ngo.name}</p>
                                  <p className="text-xs text-gray-500">{project.ngo.contactPerson}</p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{project.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  ${(project.currentFunding / 1000).toFixed(0)}k / ${(project.fundingGoal / 1000).toFixed(0)}k
                                </p>
                                <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full bg-green-500"
                                    style={{ width: `${Math.min(100, fundingPercentage)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{project.donors || 0}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {project.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => openApproveModal(project)}
                                      disabled={actionLoading === project.id}
                                      className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                      title="Approve Project"
                                    >
                                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                      </svg>
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => openRejectModal(project)}
                                      disabled={actionLoading === project.id}
                                      className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                      title="Reject Project"
                                    >
                                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {project.status !== 'pending' && (
                                  <>
                                    {project.status === 'rejected' && project.rejectionReason && (
                                      <span className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded" title={project.rejectionReason}>
                                        Rejected
                                      </span>
                                    )}
                                    {project.status === 'active' && project.approvedBy && (
                                      <span className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded" title={`Approved by ${project.approvedBy.name}`}>
                                        ✓ Approved
                                      </span>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
                                          handleDelete(project.id);
                                        }
                                      }}
                                      disabled={actionLoading === project.id}
                                      className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                      title="Delete Project"
                                    >
                                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                      </svg>
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {projects.length === 0 && !loading && (
                  <div className="py-16 text-center">
                    <p className="text-gray-500">No projects found matching your criteria</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Approve Modal */}
        {showApproveModal && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Approve Project</h3>
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedProject(null);
                    setApproveComment('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={!!actionLoading}
                >
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Project:</p>
                <p className="font-semibold text-gray-900">{selectedProject.name}</p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Comment (Optional)
                </label>
                <textarea
                  value={approveComment}
                  onChange={(e) => setApproveComment(e.target.value)}
                  rows={4}
                  placeholder="Add an optional comment for the NGO..."
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:outline-none"
                  disabled={!!actionLoading}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedProject(null);
                    setApproveComment('');
                  }}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={!!actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!!actionLoading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === selectedProject.id ? 'Approving...' : 'Approve Project'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Reject Project</h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedProject(null);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={!!actionLoading}
                >
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Project:</p>
                <p className="font-semibold text-gray-900">{selectedProject.name}</p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a clear reason for rejection. This will be sent to the NGO..."
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-red-500 focus:outline-none"
                  required
                  disabled={!!actionLoading}
                />
                <p className="mt-2 text-xs text-gray-500">This reason will be emailed to the NGO organization.</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedProject(null);
                    setRejectReason('');
                  }}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={!!actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!!actionLoading || !rejectReason.trim()}
                  className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === selectedProject.id ? 'Rejecting...' : 'Reject Project'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminProjectsPage;
