'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import NgoTopbar from '../components/NgoTopbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { api } from '../../../utils/api';

interface NgoDetailsData {
  organizationName: string;
  registrationNumber: string;
  establishedDate: string | null;
  location: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  mission: string;
  focusAreas: string[];
  certifications: string[];
  teamSize: number;
  annualBudget: number;
  totalProjectsLaunched: number;
  totalImpact: {
    treesPlanted: number;
    carbonOffset: number;
    communitiesImpacted: number;
    hectaresRestored: number;
  };
}

const NGODetailsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<NgoDetailsData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NgoDetailsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.ngo.details.get();
      if (response.success && response.data) {
        setDetails(response.data);
        setEditData(response.data);
      } else {
        setError(response.message || 'Failed to load NGO details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load NGO details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    setSaving(true);
    setError(null);
    try {
      const response = await api.ngo.details.update(editData);
      if (response.success && response.data) {
        setDetails(response.data);
        setIsEditing(false);
        setError(null);
      } else {
        setError(response.message || 'Failed to update NGO details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update NGO details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(details);
    setIsEditing(false);
    setNewFocusArea('');
    setNewCertification('');
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && editData) {
      setEditData({
        ...editData,
        focusAreas: [...editData.focusAreas, newFocusArea.trim()]
      });
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        focusAreas: editData.focusAreas.filter((_, i) => i !== index)
      });
    }
  };

  const addCertification = () => {
    if (newCertification.trim() && editData) {
      setEditData({
        ...editData,
        certifications: [...editData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        certifications: editData.certifications.filter((_, i) => i !== index)
      });
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
                  <p className="text-gray-600">Loading NGO details...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !details) {
    return (
      <ProtectedRoute requiredRole="ngo">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <NgoTopbar />
          <main className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadDetails}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const data = isEditing ? editData : details;
  if (!data) return null;

  return (
    <ProtectedRoute requiredRole="ngo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <NgoTopbar />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <Link
                  href="/ngo/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Details
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                NGO Details
              </h1>
              <p className="text-lg text-gray-600">
                Organization information and credentials
              </p>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Organization Info */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Organization Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Organization Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData?.organizationName || ''}
                          onChange={(e) => setEditData({ ...editData!, organizationName: e.target.value })}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{data.organizationName}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Registration Number</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData?.registrationNumber || ''}
                            onChange={(e) => setEditData({ ...editData!, registrationNumber: e.target.value })}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{data.registrationNumber}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Established Date</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData?.establishedDate || ''}
                            onChange={(e) => setEditData({ ...editData!, establishedDate: e.target.value || null })}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{data.establishedDate || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData?.location || ''}
                          onChange={(e) => setEditData({ ...editData!, location: e.target.value })}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-lg text-gray-900">{data.location || 'Not set'}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Contact Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData?.contactEmail || ''}
                            onChange={(e) => setEditData({ ...editData!, contactEmail: e.target.value })}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{data.contactEmail || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Contact Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData?.contactPhone || ''}
                            onChange={(e) => setEditData({ ...editData!, contactPhone: e.target.value })}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{data.contactPhone || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData?.website || ''}
                          onChange={(e) => setEditData({ ...editData!, website: e.target.value })}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      ) : (
                        <p className="text-lg text-green-600">
                          {data.website ? (
                            <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {data.website}
                            </a>
                          ) : (
                            'Not set'
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Mission Statement</h2>
                  {isEditing ? (
                    <textarea
                      value={editData?.mission || ''}
                      onChange={(e) => setEditData({ ...editData!, mission: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your organization's mission statement..."
                    />
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-700">{data.mission || 'No mission statement provided'}</p>
                  )}
                </div>

                {/* Focus Areas */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Focus Areas</h2>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {editData?.focusAreas.map((area, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
                          >
                            {area}
                            <button
                              onClick={() => removeFocusArea(index)}
                              className="text-green-700 hover:text-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFocusArea}
                          onChange={(e) => setNewFocusArea(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addFocusArea()}
                          placeholder="Add focus area..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={addFocusArea}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {data.focusAreas.length > 0 ? (
                        data.focusAreas.map((area, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No focus areas specified</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Impact Metrics */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Total Impact</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-green-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Trees Planted</p>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData?.totalImpact.treesPlanted || 0}
                          onChange={(e) => setEditData({
                            ...editData!,
                            totalImpact: { ...editData!.totalImpact, treesPlanted: parseInt(e.target.value) || 0 }
                          })}
                          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-green-700">{data.totalImpact.treesPlanted.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-blue-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Carbon Offset (tons CO₂)</p>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editData?.totalImpact.carbonOffset || 0}
                          onChange={(e) => setEditData({
                            ...editData!,
                            totalImpact: { ...editData!.totalImpact, carbonOffset: parseFloat(e.target.value) || 0 }
                          })}
                          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-blue-700">{data.totalImpact.carbonOffset.toLocaleString()} tons</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-purple-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Communities Impacted</p>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData?.totalImpact.communitiesImpacted || 0}
                          onChange={(e) => setEditData({
                            ...editData!,
                            totalImpact: { ...editData!.totalImpact, communitiesImpacted: parseInt(e.target.value) || 0 }
                          })}
                          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-purple-700">{data.totalImpact.communitiesImpacted}</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Hectares Restored</p>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editData?.totalImpact.hectaresRestored || 0}
                          onChange={(e) => setEditData({
                            ...editData!,
                            totalImpact: { ...editData!.totalImpact, hectaresRestored: parseFloat(e.target.value) || 0 }
                          })}
                          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-emerald-700">{data.totalImpact.hectaresRestored.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Quick Stats */}
                  <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Projects Launched</p>
                        <p className="text-2xl font-bold text-green-600">{data.totalProjectsLaunched}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Team Size</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData?.teamSize || 0}
                            onChange={(e) => setEditData({ ...editData!, teamSize: parseInt(e.target.value) || 0 })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-blue-600">{data.teamSize}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Budget</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData?.annualBudget || 0}
                            onChange={(e) => setEditData({ ...editData!, annualBudget: parseFloat(e.target.value) || 0 })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-purple-600">${(data.annualBudget / 1000).toFixed(0)}k</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Certifications</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <ul className="space-y-2">
                          {editData?.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center justify-between gap-2 text-sm text-gray-700">
                              <span className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {cert}
                              </span>
                              <button
                                onClick={() => removeCertification(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                            placeholder="Add certification..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={addCertification}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {data.certifications.length > 0 ? (
                          data.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {cert}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No certifications listed</li>
                        )}
                      </ul>
                    )}
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

export default NGODetailsPage;
