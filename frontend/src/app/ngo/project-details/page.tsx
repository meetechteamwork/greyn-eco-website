'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import NgoTopbar from '../components/NgoTopbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { api } from '../../../utils/api';

interface Project {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  donors: number;
  progress: number;
  createdAt: string;
}

const NGOProjectDetailsListPage: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  useEffect(() => {
    loadProjects();
  }, [filter, categoryFilter, searchTerm]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.ngo.projects.get({
        status: filter !== 'all' ? filter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        page: 1,
        limit: 100
      });

      if (response.success && response.data) {
        setProjects(response.data.projects || []);
      } else {
        setError(response.message || 'Failed to load projects');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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
                My Projects
              </h1>
              <p className="text-lg text-gray-600">View and manage all your projects</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 pl-12 transition-colors focus:border-green-500 focus:outline-none"
                  />
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <Link
                href="/ngo/launch"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Launch New Project
              </Link>
            </div>

            {/* Projects Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading projects...</p>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 shadow-lg text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by launching your first project!'}
                </p>
                <Link
                  href="/ngo/launch"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Launch New Project
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                    onClick={() => router.push(`/ngo/project-details/${project.id}`)}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description || 'No description'}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">Progress</span>
                        <span className="font-bold text-green-600">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                          style={{ width: `${Math.min(100, project.progress)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-600">
                        <span>${(project.currentFunding / 1000).toFixed(0)}k</span>
                        <span>${(project.fundingGoal / 1000).toFixed(0)}k goal</span>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {project.category}
                      </span>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Donors</p>
                        <p className="font-bold text-gray-900">{project.donors || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-bold text-gray-900 truncate">{project.location || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-xs text-gray-500">Created {formatDate(project.createdAt)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/ngo/project-details/${project.id}`);
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                      >
                        View Details
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default NGOProjectDetailsListPage;
