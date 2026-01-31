'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

interface Project {
  _id: string;
  name: string;
  category: string;
  status: 'active' | 'funded' | 'completed' | 'cancelled' | 'draft';
  fundingGoal: number;
  currentFunding: number;
  carbonImpact: string;
  image: string;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminPublicProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    longDescription: '',
    image: '',
    carbonImpact: '',
    fundingGoal: '',
    currentFunding: '',
    minInvestment: '',
    duration: '',
    location: '',
    status: 'draft',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, [filter, categoryFilter, search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search) params.search = search;

      const response = await api.admin.publicProjects.get(params);
      if (response.success && response.data) {
        const data = response.data as any;
        setProjects(data.projects || data);
      } else {
        setError(response.message || 'Failed to load projects');
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      longDescription: '',
      image: '',
      carbonImpact: '',
      fundingGoal: '',
      currentFunding: '',
      minInvestment: '',
      duration: '',
      location: '',
      status: 'draft',
      featured: false
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      category: project.category,
      description: project.description,
      longDescription: (project as any).longDescription || '',
      image: project.image,
      carbonImpact: project.carbonImpact,
      fundingGoal: project.fundingGoal.toString(),
      currentFunding: project.currentFunding.toString(),
      minInvestment: ((project as any).minInvestment || 100).toString(),
      duration: ((project as any).duration || ''),
      location: ((project as any).location || ''),
      status: project.status,
      featured: project.featured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        fundingGoal: parseFloat(formData.fundingGoal),
        currentFunding: parseFloat(formData.currentFunding),
        minInvestment: formData.minInvestment ? parseFloat(formData.minInvestment) : 100
      };

      if (editingProject) {
        const response = await api.admin.publicProjects.update(editingProject._id, data);
        if (response.success) {
          setShowModal(false);
          fetchProjects();
        } else {
          setError(response.message || 'Failed to update project');
        }
      } else {
        const response = await api.admin.publicProjects.create(data);
        if (response.success) {
          setShowModal(false);
          fetchProjects();
        } else {
          setError(response.message || 'Failed to create project');
        }
      }
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await api.admin.publicProjects.delete(id);
      if (response.success) {
        fetchProjects();
      } else {
        setError(response.message || 'Failed to delete project');
      }
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Public Projects Management</h1>
            <button
              onClick={handleCreate}
              className="rounded-lg bg-green-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white hover:bg-green-700 transition-colors"
            >
              + Add Project
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base w-full md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base w-full md:w-auto"
            >
              <option value="all">All Categories</option>
              <option value="Reforestation">Reforestation</option>
              <option value="Solar Energy">Solar Energy</option>
              <option value="Wind Energy">Wind Energy</option>
              <option value="Ocean Conservation">Ocean Conservation</option>
              <option value="Urban Sustainability">Urban Sustainability</option>
              <option value="Clean Transportation">Clean Transportation</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base w-full md:flex-1"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-gray-600">Loading projects...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funding</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{project.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ${(project.currentFunding / 1000).toFixed(0)}k / ${(project.fundingGoal / 1000).toFixed(0)}k
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.featured ? (
                          <span className="text-yellow-500">★</span>
                        ) : (
                          <span className="text-gray-400">☆</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  {editingProject ? 'Edit Project' : 'Create Project'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select category</option>
                      <option value="Reforestation">Reforestation</option>
                      <option value="Solar Energy">Solar Energy</option>
                      <option value="Wind Energy">Wind Energy</option>
                      <option value="Ocean Conservation">Ocean Conservation</option>
                      <option value="Urban Sustainability">Urban Sustainability</option>
                      <option value="Clean Transportation">Clean Transportation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Funding Goal</label>
                      <input
                        type="number"
                        required
                        value={formData.fundingGoal}
                        onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Funding</label>
                      <input
                        type="number"
                        required
                        value={formData.currentFunding}
                        onChange={(e) => setFormData({ ...formData, currentFunding: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Carbon Impact</label>
                    <input
                      type="text"
                      required
                      value={formData.carbonImpact}
                      onChange={(e) => setFormData({ ...formData, carbonImpact: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="funded">Funded</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="mr-2"
                      />
                      Featured
                    </label>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {editingProject ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPublicProjectsPage;
