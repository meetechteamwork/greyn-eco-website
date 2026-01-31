'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import NgoTopbar from '../components/NgoTopbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { api } from '../../../utils/api';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface SocialLinks {
  linkedin: string;
  researchGate: string;
  twitter: string;
  website: string;
}

interface PersonDetailsData {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  expertise: string[];
  education: Education[];
  projectsLed: number;
  yearsExperience: number;
  publications: number;
  awards: string[];
  socialLinks: SocialLinks;
}

const PersonDetailsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PersonDetailsData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PersonDetailsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');
  const [newAward, setNewAward] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.ngo.personDetails.get();
      if (response.success && response.data) {
        setDetails(response.data);
        setEditData(response.data);
      } else {
        setError(response.message || 'Failed to load person details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load person details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    setSaving(true);
    setError(null);
    try {
      const response = await api.ngo.personDetails.update(editData);
      if (response.success && response.data) {
        setDetails(response.data);
        setIsEditing(false);
        setError(null);
      } else {
        setError(response.message || 'Failed to update person details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update person details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(details);
    setIsEditing(false);
    setNewExpertise('');
    setNewAward('');
    setNewEducation({ degree: '', institution: '', year: '' });
  };

  const addExpertise = () => {
    if (newExpertise.trim() && editData) {
      setEditData({
        ...editData,
        expertise: [...editData.expertise, newExpertise.trim()]
      });
      setNewExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        expertise: editData.expertise.filter((_, i) => i !== index)
      });
    }
  };

  const addAward = () => {
    if (newAward.trim() && editData) {
      setEditData({
        ...editData,
        awards: [...editData.awards, newAward.trim()]
      });
      setNewAward('');
    }
  };

  const removeAward = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        awards: editData.awards.filter((_, i) => i !== index)
      });
    }
  };

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim() && editData) {
      setEditData({
        ...editData,
        education: [...editData.education, { ...newEducation }]
      });
      setNewEducation({ degree: '', institution: '', year: '' });
    }
  };

  const removeEducation = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        education: editData.education.filter((_, i) => i !== index)
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                  <p className="text-gray-600">Loading person details...</p>
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
                Person Details
              </h1>
              <p className="text-lg text-gray-600">
                Team member and leadership information
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
                {/* Profile Header */}
                <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white shadow-lg">
                  <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
                      {getInitials(data.name)}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editData?.name || ''}
                            onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-3xl font-bold text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Full Name"
                          />
                          <input
                            type="text"
                            value={editData?.role || ''}
                            onChange={(e) => setEditData({ ...editData!, role: e.target.value })}
                            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-xl text-green-100 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Role/Position"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-bold">{data.name}</h2>
                          <p className="text-xl text-green-100">{data.role || 'No role specified'}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData?.email || ''}
                          onChange={(e) => setEditData({ ...editData!, email: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Email address"
                        />
                      ) : (
                        <span className="text-lg text-gray-900">{data.email || 'Not set'}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData?.phone || ''}
                          onChange={(e) => setEditData({ ...editData!, phone: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      ) : (
                        <span className="text-lg text-gray-900">{data.phone || 'Not set'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Biography</h3>
                  {isEditing ? (
                    <textarea
                      value={editData?.bio || ''}
                      onChange={(e) => setEditData({ ...editData!, bio: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your biography..."
                    />
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-700">{data.bio || 'No biography provided'}</p>
                  )}
                </div>

                {/* Expertise */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Areas of Expertise</h3>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {editData?.expertise.map((area, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                          >
                            {area}
                            <button
                              onClick={() => removeExpertise(index)}
                              className="text-blue-700 hover:text-red-600"
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
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                          placeholder="Add expertise area..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={addExpertise}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="flex flex-wrap gap-3">
                      {data.expertise.length > 0 ? (
                        data.expertise.map((area, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                      >
                        {area}
                      </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No expertise areas specified</p>
                      )}
                  </div>
                  )}
                </div>

                {/* Education */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Education</h3>
                  {isEditing ? (
                    <div className="space-y-4">
                  <div className="space-y-4">
                        {editData?.education.map((edu, index) => (
                          <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                            <div className="flex-1">
                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                              <p className="text-gray-600">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                            </div>
                            <button
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                      </div>
                    ))}
                  </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                          placeholder="Degree"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                          placeholder="Institution"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                            placeholder="Year"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <button
                            onClick={addEducation}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.education.length > 0 ? (
                        data.education.map((edu, index) => (
                          <div key={index} className="rounded-lg border border-gray-200 p-4">
                            <p className="font-semibold text-gray-900">{edu.degree}</p>
                            <p className="text-gray-600">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No education entries</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Awards */}
                <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Awards & Recognition</h3>
                  {isEditing ? (
                    <div className="space-y-4">
                      <ul className="space-y-3">
                        {editData?.awards.map((award, index) => (
                          <li key={index} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                              <span className="text-lg text-gray-900">{award}</span>
                            </div>
                            <button
                              onClick={() => removeAward(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAward}
                          onChange={(e) => setNewAward(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addAward()}
                          placeholder="Add award or recognition..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={addAward}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                  <ul className="space-y-3">
                      {data.awards.length > 0 ? (
                        data.awards.map((award, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-lg text-gray-900">{award}</span>
                      </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No awards listed</li>
                      )}
                  </ul>
                  )}
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
                        <p className="text-sm text-gray-600">Projects Led</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData?.projectsLed || 0}
                            onChange={(e) => setEditData({ ...editData!, projectsLed: parseInt(e.target.value) || 0 })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-green-600">{data.projectsLed}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Years of Experience</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData?.yearsExperience || 0}
                            onChange={(e) => setEditData({ ...editData!, yearsExperience: parseInt(e.target.value) || 0 })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-blue-600">{data.yearsExperience}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Publications</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData?.publications || 0}
                            onChange={(e) => setEditData({ ...editData!, publications: parseInt(e.target.value) || 0 })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-purple-600">{data.publications}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Connect</h3>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">LinkedIn</label>
                          <input
                            type="text"
                            value={editData?.socialLinks.linkedin || ''}
                            onChange={(e) => setEditData({
                              ...editData!,
                              socialLinks: { ...editData!.socialLinks, linkedin: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            placeholder="linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">ResearchGate</label>
                          <input
                            type="text"
                            value={editData?.socialLinks.researchGate || ''}
                            onChange={(e) => setEditData({
                              ...editData!,
                              socialLinks: { ...editData!.socialLinks, researchGate: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            placeholder="researchgate.net/profile/username"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Twitter</label>
                          <input
                            type="text"
                            value={editData?.socialLinks.twitter || ''}
                            onChange={(e) => setEditData({
                              ...editData!,
                              socialLinks: { ...editData!.socialLinks, twitter: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Website</label>
                          <input
                            type="text"
                            value={editData?.socialLinks.website || ''}
                            onChange={(e) => setEditData({
                              ...editData!,
                              socialLinks: { ...editData!.socialLinks, website: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    ) : (
                    <div className="space-y-3">
                        {data.socialLinks.linkedin && (
                          <a
                            href={data.socialLinks.linkedin.startsWith('http') ? data.socialLinks.linkedin : `https://${data.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                          >
                        <span>LinkedIn</span>
                      </a>
                        )}
                        {data.socialLinks.researchGate && (
                          <a
                            href={data.socialLinks.researchGate.startsWith('http') ? data.socialLinks.researchGate : `https://${data.socialLinks.researchGate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                          >
                        <span>ResearchGate</span>
                      </a>
                        )}
                        {data.socialLinks.twitter && (
                          <a
                            href={data.socialLinks.twitter.startsWith('http') ? data.socialLinks.twitter : `https://twitter.com/${data.socialLinks.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                          >
                            <span>Twitter</span>
                          </a>
                        )}
                        {data.socialLinks.website && (
                          <a
                            href={data.socialLinks.website.startsWith('http') ? data.socialLinks.website : `https://${data.socialLinks.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                          >
                            <span>Website</span>
                          </a>
                        )}
                        {!data.socialLinks.linkedin && !data.socialLinks.researchGate && !data.socialLinks.twitter && !data.socialLinks.website && (
                          <p className="text-sm text-gray-500">No social links added</p>
                        )}
                    </div>
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

export default PersonDetailsPage;
