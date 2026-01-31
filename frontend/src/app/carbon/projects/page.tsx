'use client';

import React, { useState, useEffect } from 'react';

type ProjectStatus = 'Draft' | 'Under Review' | 'Verified' | 'active' | 'pending' | 'approved';

interface Project {
  _id: string;
  name: string;
  location: string;
  category: string;
  carbonImpact: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

const getStatusBadgeClass = (status: ProjectStatus) => {
  switch (status) {
    case 'Verified':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Draft':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: ProjectStatus) => {
  switch (status) {
    case 'Verified':
      return '✓';
    case 'Under Review':
      return '⏳';
    case 'Draft':
      return '📝';
    default:
      return '📄';
  }
};

export default function CarbonProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    methodology: '',
    expectedCO2Reduction: '',
    timeline: '',
    milestones: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert('Project submitted successfully! It will be reviewed by our team.');
    setFormData({
      projectName: '',
      location: '',
      methodology: '',
      expectedCO2Reduction: '',
      timeline: '',
      milestones: '',
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                NGO Projects
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Submit and manage your carbon offset projects
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{showForm ? '−' : '+'}</span>
              {showForm ? 'Cancel' : 'Submit New Project'}
            </button>
          </div>
        </div>

        {/* Project Submission Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Project Submission Form</h2>
              <p className="text-green-100 text-sm mt-1">Fill in the details to submit your carbon offset project</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Project Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="City, Country"
                  />
                </div>

                {/* Methodology */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Methodology <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  >
                    <option value="">Select methodology</option>
                    <option value="Renewable Energy - Solar PV">Renewable Energy - Solar PV</option>
                    <option value="Renewable Energy - Wind Power">Renewable Energy - Wind Power</option>
                    <option value="Forest Restoration">Forest Restoration</option>
                    <option value="Forest Conservation">Forest Conservation</option>
                    <option value="Blue Carbon - Mangrove Protection">Blue Carbon - Mangrove Protection</option>
                    <option value="Energy Efficiency">Energy Efficiency</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Carbon Capture & Storage">Carbon Capture & Storage</option>
                  </select>
                </div>

                {/* Expected CO₂ Reduction */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Expected CO₂ Reduction (tonnes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="expectedCO2Reduction"
                    value={formData.expectedCO2Reduction}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="e.g., 50000"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Timeline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="e.g., 3 years (2024-2027)"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Timeline & Milestones <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="milestones"
                  value={formData.milestones}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                  placeholder="Describe key milestones and timeline for your project..."
                />
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Baseline Documents */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Baseline Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Upload Documents</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      className="hidden"
                      id="baseline-docs"
                      onChange={(e) => {
                        // File upload logic would go here
                        console.log('Baseline documents selected:', e.target.files);
                      }}
                    />
                    <label
                      htmlFor="baseline-docs"
                      className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                </div>

                {/* Photos / Videos */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Photos / Videos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Upload Media</p>
                    <p className="text-xs text-gray-500">JPG, PNG, MP4 (Max 50MB)</p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      id="media-files"
                      onChange={(e) => {
                        // File upload logic would go here
                        console.log('Media files selected:', e.target.files);
                      }}
                    />
                    <label
                      htmlFor="media-files"
                      className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Submit Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      projectName: '',
                      location: '',
                      methodology: '',
                      expectedCO2Reduction: '',
                      timeline: '',
                      milestones: '',
                    });
                    setShowForm(false);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Project List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
            <p className="text-sm text-gray-600 mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                          {project.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{project.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🌍</span>
                            <span>{project.category}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🌳</span>
                            <span className="font-semibold text-green-600">
                              {project.carbonImpact}
                            </span>
                          </span>
                        </div>
                      </div>
                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold flex-shrink-0 ${getStatusBadgeClass(project.status)}`}>
                        <span>{getStatusIcon(project.status)}</span>
                        <span>{project.status}</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Submitted: {new Date(project.createdAt).toLocaleDateString()}</span>
                      <span>Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => alert(`Viewing details for project: ${project.name}`)}
                      className="px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                    >
                      View Details
                    </button>
                    {project.status === 'Draft' && (
                      <button
                        onClick={() => alert(`Editing project: ${project.name}`)}
                        className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (if no projects) */}
          {projects.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Submit your first carbon offset project to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <span>+</span>
                Submit New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


