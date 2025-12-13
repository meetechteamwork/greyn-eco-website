'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  proofImage: string;
  credits: number;
  status: 'pending' | 'verified' | 'unverified';
  submittedDate: string;
  verifiedDate?: string;
}

const ActivitiesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'plant-tree',
    title: '',
    description: '',
    proofImage: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy data - in real app, this would come from API/context
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'plant-tree',
      title: 'Planted 5 Trees in Local Park',
      description: 'Planted 5 native trees in the community park and watered them regularly.',
      proofImage: '/api/placeholder/400/300',
      credits: 50,
      status: 'verified',
      submittedDate: '2024-01-15',
      verifiedDate: '2024-01-16'
    },
    {
      id: '2',
      type: 'cleanup',
      title: 'Beach Cleanup Activity',
      description: 'Organized beach cleanup and collected 20kg of plastic waste.',
      proofImage: '/api/placeholder/400/300',
      credits: 75,
      status: 'verified',
      submittedDate: '2024-01-20',
      verifiedDate: '2024-01-21'
    },
    {
      id: '3',
      type: 'recycle',
      title: 'Recycling Program',
      description: 'Started recycling program in neighborhood, collected 100kg recyclables.',
      proofImage: '/api/placeholder/400/300',
      credits: 30,
      status: 'pending',
      submittedDate: '2024-01-25'
    }
  ]);

  const [totalCredits] = useState(155); // Sum of verified activities

  const activityTypes = [
    { value: 'plant-tree', label: '🌳 Plant Tree', credits: 50, description: 'Plant trees and provide proof' },
    { value: 'cleanup', label: '🧹 Cleanup Activity', credits: 75, description: 'Organize or participate in cleanup' },
    { value: 'recycle', label: '♻️ Recycling', credits: 30, description: 'Recycle materials and document' },
    { value: 'energy-save', label: '⚡ Energy Saving', credits: 25, description: 'Save energy and show proof' },
    { value: 'water-conserve', label: '💧 Water Conservation', credits: 40, description: 'Conserve water activities' },
    { value: 'education', label: '📚 Environmental Education', credits: 60, description: 'Educate others about environment' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, proofImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const selectedType = activityTypes.find(t => t.value === formData.type);
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: formData.type,
        title: formData.title,
        description: formData.description,
        proofImage: URL.createObjectURL(formData.proofImage!),
        credits: selectedType?.credits || 0,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };

      setActivities(prev => [newActivity, ...prev]);
      setFormData({
        type: 'plant-tree',
        title: '',
        description: '',
        proofImage: null
      });
      setShowForm(false);
      setIsSubmitting(false);
      alert('Activity submitted successfully! Admin will review it soon.');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unverified':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return '✓';
      case 'unverified':
        return '✗';
      case 'pending':
        return '⏳';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
              Activity Bar
            </h1>
            <p className="text-lg text-gray-600">
              Complete eco-friendly activities, earn credits, and redeem products
            </p>
          </div>

          {/* Credits Summary Card */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">Total Credits</h3>
                </div>
                <p className="text-4xl font-bold">{totalCredits}</p>
                <p className="mt-2 text-sm text-emerald-100">Available to redeem</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-6 w-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Verified Activities</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {activities.filter(a => a.status === 'verified').length}
              </p>
              <p className="mt-2 text-sm text-gray-600">Activities approved</p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-6 w-6 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {activities.filter(a => a.status === 'pending').length}
              </p>
              <p className="mt-2 text-sm text-gray-600">Awaiting admin approval</p>
            </div>
          </div>

          {/* Submit Activity Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              {showForm ? 'Cancel' : 'Submit New Activity'}
            </button>
          </div>

          {/* Activity Submission Form */}
          {showForm && (
            <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Submit New Activity</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Activity Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Activity Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.credits} credits
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {activityTypes.find(t => t.value === formData.type)?.description}
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Planted 10 Trees in Community Park"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your activity in detail..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Proof Image */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Proof Image/Photo *
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-emerald-400">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="proof-image"
                      required
                    />
                    <label htmlFor="proof-image" className="cursor-pointer">
                      {formData.proofImage ? (
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm font-medium text-gray-900">{formData.proofImage.name}</p>
                          <p className="text-xs text-gray-500">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload proof image
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Credits Info */}
                <div className="rounded-xl bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm font-semibold text-emerald-900">
                      You will earn {activityTypes.find(t => t.value === formData.type)?.credits || 0} credits upon admin verification
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.proofImage}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Activity'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Activities List */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-500">Activities</p>
                <h2 className="text-2xl font-bold text-gray-900">Your Activity History</h2>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-4 text-lg font-semibold text-gray-900">No activities yet</p>
                <p className="mt-2 text-gray-600">Start by submitting your first eco-friendly activity!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activities.map((activity) => {
                  const activityType = activityTypes.find(t => t.value === activity.type);
                  return (
                    <div
                      key={activity.id}
                      className={`rounded-xl border-2 p-6 transition-all hover:shadow-md ${getStatusColor(activity.status)}`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row">
                        {/* Proof Image */}
                        <div className="md:w-48">
                          <img
                            src={activity.proofImage}
                            alt={activity.title}
                            className="h-48 w-full rounded-lg object-cover md:h-full"
                          />
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1">
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-2xl">{activityType?.label.split(' ')[0]}</span>
                                <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(activity.status)}`}>
                              <span>{getStatusIcon(activity.status)}</span>
                              <span className="uppercase">{activity.status}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span className="font-semibold text-gray-900">{activity.credits} Credits</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span className="text-gray-600">Submitted: {new Date(activity.submittedDate).toLocaleDateString()}</span>
                            </div>
                            {activity.verifiedDate && (
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-gray-600">Verified: {new Date(activity.verifiedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Redeem Products CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center text-white">
            <h3 className="mb-2 text-2xl font-bold">Ready to Redeem Your Credits?</h3>
            <p className="mb-6 text-emerald-100">
              Use your {totalCredits} credits to purchase eco-friendly products
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition-all hover:scale-105 hover:shadow-lg"
            >
              Browse Products
              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivitiesPage;

