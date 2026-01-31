'use client';

import React, { useState, useEffect } from 'react';

interface VerificationProject {
  _id: string;
  name: string;
  category: string;
  location: string;
  carbonImpact: string;
  createdAt: string;
  status: 'pending' | 'active' | 'approved' | 'rejected';
}

interface VerificationChecklist {
  id: string;
  item: string;
  checked: boolean;
  required: boolean;
}

const defaultChecklist: VerificationChecklist[] = [
  { id: '1', item: 'Baseline assessment documents submitted', checked: false, required: true },
  { id: '2', item: 'Project methodology aligns with standards', checked: false, required: true },
  { id: '3', item: 'Geographic location verified', checked: false, required: true },
  { id: '4', item: 'Expected CO₂ reduction calculations validated', checked: false, required: true },
  { id: '5', item: 'Supporting evidence (photos/videos) provided', checked: false, required: true },
  { id: '6', item: 'NGO credentials verified', checked: false, required: true },
  { id: '7', item: 'Legal compliance documentation complete', checked: false, required: true },
  { id: '8', item: 'Third-party audit reports reviewed', checked: false, required: false },
  { id: '9', item: 'Stakeholder consultation records available', checked: false, required: false },
  { id: '10', item: 'Environmental impact assessment complete', checked: false, required: true },
];

export default function CarbonVerificationPage() {
  const [projects, setProjects] = useState<VerificationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<VerificationProject | null>(null);
  const [checklist, setChecklist] = useState<VerificationChecklist[]>(defaultChecklist);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // TODO: Replace with verification-specific API when available
        const response = await fetch('http://localhost:5000/api/admin/projects?status=pending', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProjects(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const [verificationNotes, setVerificationNotes] = useState('');

  const handleChecklistChange = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSelectProject = (project: VerificationProject) => {
    setSelectedProject(project);
    setChecklist(defaultChecklist.map(item => ({ ...item, checked: false })));
    setVerificationNotes('');
  };

  const allRequiredChecked = checklist
    .filter(item => item.required)
    .every(item => item.checked);

  const getStatusBadgeClass = (status: VerificationProject['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'active':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: VerificationProject['status']) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'active':
        return '⏳';
      case 'pending':
        return '📋';
      case 'rejected':
        return '✗';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Project Verification
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Review and verify carbon offset projects for certification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Projects Pending Verification
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {projects.filter(p => p.status === 'pending').length} project(s) awaiting review
              </p>

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-sm text-gray-600">Loading projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => handleSelectProject(project)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedProject?._id === project._id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base break-words flex-1">
                        {project.name}
                      </h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold flex-shrink-0 ${getStatusBadgeClass(project.status)}`}>
                        <span>{getStatusIcon(project.status)}</span>
                        <span className="hidden sm:inline">{project.status}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{project.category}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍</span>
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Expected Impact:</span>{' '}
                        <span className="text-green-600 font-bold">
                          {project.carbonImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-sm text-gray-600">No projects available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {selectedProject.name}
                    </h2>
                    <p className="text-green-100 text-sm">{selectedProject.category}</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <span>📍</span>
                          {selectedProject.location}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{selectedProject.category}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected CO₂ Reduction</label>
                        <p className="text-lg font-bold text-green-600 mt-1">
                          {selectedProject.carbonImpact}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted Date</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {new Date(selectedProject.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold ${getStatusBadgeClass(selectedProject.status)}`}>
                            <span>{getStatusIcon(selectedProject.status)}</span>
                            <span>{selectedProject.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Upload */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📎</span> Evidence & Documentation
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Baseline Documents */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Baseline Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all">
                        <div className="text-3xl mb-2">📄</div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">3 files uploaded</p>
                        <p className="text-xs text-gray-500">baseline_assessment.pdf, methodology.pdf, legal_docs.pdf</p>
                      </div>
                    </div>

                    {/* Geo-tagged Evidence */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Geo-tagged Evidence
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all">
                        <div className="text-3xl mb-2">🗺️</div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Location Verified</p>
                        <p className="text-xs text-gray-500 mb-2">Coordinates: -3.4653° S, -62.2159° W</p>
                        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Map Preview Placeholder</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos/Videos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Photos & Videos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">12 media files uploaded</p>
                      <p className="text-xs text-gray-500">project_photos.zip, site_video.mp4</p>
                    </div>
                  </div>
                </div>

                {/* Verification Checklist */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>✅</span> Verification Checklist
                  </h3>

                  <div className="space-y-3 mb-6">
                    {checklist.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          item.checked
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleChecklistChange(item.id)}
                          className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                        />
                        <span className={`flex-1 text-sm font-medium ${
                          item.checked ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {item.item}
                          {item.required && (
                            <span className="ml-2 text-red-500 text-xs">*Required</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Verification Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                      placeholder="Add notes, observations, or comments about this verification..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => alert('Project approved! Verification certificate will be generated.')}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!allRequiredChecked}
                    >
                      ✓ Approve Verification
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) alert(`Project rejected. Reason: ${reason}`);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      ✗ Reject
                    </button>
                  </div>

                  {/* Generate Certificate Button */}
                  {selectedProject.status === 'approved' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => alert('Certificate generation functionality will be implemented soon.')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <span>📜</span>
                        Generate Verification Certificate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Project</h3>
                <p className="text-gray-600">
                  Choose a project from the list to begin verification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


