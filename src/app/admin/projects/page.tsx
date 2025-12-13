'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Project {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  fundingGoal: number;
  currentFunding: number;
  startDate: string;
  investorCount: number;
  carbonImpact: string;
}

const AdminProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock projects data
  const allProjects: Project[] = [
    {
      id: '1',
      name: 'Amazon Rainforest Reforestation',
      category: 'Reforestation',
      status: 'active',
      fundingGoal: 100000,
      currentFunding: 75000,
      startDate: '2024-01-15',
      investorCount: 142,
      carbonImpact: '500 tons CO₂/year'
    },
    {
      id: '2',
      name: 'Solar Energy Farm - California',
      category: 'Solar Energy',
      status: 'active',
      fundingGoal: 250000,
      currentFunding: 180000,
      startDate: '2024-02-01',
      investorCount: 215,
      carbonImpact: '800 tons CO₂/year'
    },
    {
      id: '3',
      name: 'Wind Power Initiative - Texas',
      category: 'Wind Energy',
      status: 'active',
      fundingGoal: 500000,
      currentFunding: 420000,
      startDate: '2024-01-20',
      investorCount: 387,
      carbonImpact: '1,200 tons CO₂/year'
    },
    {
      id: '4',
      name: 'Ocean Cleanup Initiative',
      category: 'Ocean Conservation',
      status: 'pending',
      fundingGoal: 150000,
      currentFunding: 95000,
      startDate: '2024-03-01',
      investorCount: 98,
      carbonImpact: '300 tons plastic'
    },
    {
      id: '5',
      name: 'Urban Green Rooftop Gardens',
      category: 'Urban Sustainability',
      status: 'active',
      fundingGoal: 80000,
      currentFunding: 62000,
      startDate: '2024-02-15',
      investorCount: 76,
      carbonImpact: '150 tons CO₂/year'
    },
    {
      id: '6',
      name: 'Electric Vehicle Charging Network',
      category: 'Clean Transportation',
      status: 'pending',
      fundingGoal: 300000,
      currentFunding: 245000,
      startDate: '2024-03-10',
      investorCount: 189,
      carbonImpact: '650 tons CO₂/year'
    },
    {
      id: '7',
      name: 'Mangrove Restoration - Indonesia',
      category: 'Reforestation',
      status: 'completed',
      fundingGoal: 120000,
      currentFunding: 120000,
      startDate: '2023-11-01',
      investorCount: 167,
      carbonImpact: '400 tons CO₂/year'
    },
    {
      id: '8',
      name: 'Geothermal Energy Plant - Iceland',
      category: 'Renewable Energy',
      status: 'rejected',
      fundingGoal: 800000,
      currentFunding: 45000,
      startDate: '2024-03-05',
      investorCount: 42,
      carbonImpact: '2,000 tons CO₂/year'
    }
  ];

  const filteredProjects = allProjects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allProjects.length,
    active: allProjects.filter(p => p.status === 'active').length,
    pending: allProjects.filter(p => p.status === 'pending').length,
    completed: allProjects.filter(p => p.status === 'completed').length,
    rejected: allProjects.filter(p => p.status === 'rejected').length
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
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApprove = (projectId: string) => {
    alert(`Project ${projectId} approved!`);
  };

  const handleReject = (projectId: string) => {
    if (confirm('Are you sure you want to reject this project?')) {
      alert(`Project ${projectId} rejected!`);
    }
  };

  const handleEdit = (projectId: string) => {
    alert(`Edit project ${projectId} (feature coming soon)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Project Management
              </h1>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                ADMIN
              </span>
            </div>
            <p className="text-lg text-gray-600 ml-9">
              Review, approve, and manage all investment projects
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
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

          {/* Search and Actions */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg">
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Project
            </button>
          </div>

          {/* Projects Table */}
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Project Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Funding</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Investors</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProjects.map((project) => {
                    const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
                    return (
                      <tr key={project.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-600">{project.carbonImpact}</p>
                          </div>
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
                                style={{ width: `${fundingPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{project.investorCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(project.id)}
                              className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200"
                              title="Edit"
                            >
                              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            {project.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(project.id)}
                                  className="rounded-lg bg-green-100 p-2 text-green-700 transition-colors hover:bg-green-200"
                                  title="Approve"
                                >
                                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleReject(project.id)}
                                  className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200"
                                  title="Reject"
                                >
                                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
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

            {filteredProjects.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-500">No projects found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProjectsPage;

