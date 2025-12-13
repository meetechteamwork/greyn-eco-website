'use client';

import React from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

// Dummy ENGO details data
const dummyENGODetails = {
  organizationName: 'Green Earth Foundation',
  registrationNumber: 'ENGO-2024-001',
  establishedDate: '2020-01-15',
  location: 'San Francisco, CA, USA',
  contactEmail: 'contact@greenearth.org',
  contactPhone: '+1 (555) 123-4567',
  website: 'www.greenearth.org',
  mission: 'To restore and protect natural ecosystems through innovative environmental projects and community engagement.',
  focusAreas: [
    'Reforestation',
    'Renewable Energy',
    'Ocean Conservation',
    'Urban Sustainability',
    'Wildlife Protection'
  ],
  totalProjectsLaunched: 24,
  totalImpact: {
    treesPlanted: 125000,
    carbonOffset: '15,847.5 tons CO₂',
    communitiesImpacted: 45,
    hectaresRestored: 2500
  },
  certifications: [
    'ISO 14001 Environmental Management',
    'UN SDG Partner',
    'Carbon Neutral Certified'
  ],
  teamSize: 45,
  annualBudget: 2500000
};

const ENGODetailsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="engo">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-4">
                <Link
                  href="/engo/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                ENGO Details
              </h1>
              <p className="text-lg text-gray-600">
                Organization information and credentials
              </p>
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
                      <p className="text-lg font-semibold text-gray-900">{dummyENGODetails.organizationName}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Registration Number</label>
                        <p className="text-lg text-gray-900">{dummyENGODetails.registrationNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Established Date</label>
                        <p className="text-lg text-gray-900">{dummyENGODetails.establishedDate}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Location</label>
                      <p className="text-lg text-gray-900">{dummyENGODetails.location}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Contact Email</label>
                        <p className="text-lg text-gray-900">{dummyENGODetails.contactEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Contact Phone</label>
                        <p className="text-lg text-gray-900">{dummyENGODetails.contactPhone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Website</label>
                      <p className="text-lg text-green-600">{dummyENGODetails.website}</p>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Mission Statement</h2>
                  <p className="text-lg leading-relaxed text-gray-700">{dummyENGODetails.mission}</p>
                </div>

                {/* Focus Areas */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Focus Areas</h2>
                  <div className="flex flex-wrap gap-3">
                    {dummyENGODetails.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Total Impact</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-green-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Trees Planted</p>
                      <p className="text-3xl font-bold text-green-700">{dummyENGODetails.totalImpact.treesPlanted.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Carbon Offset</p>
                      <p className="text-3xl font-bold text-blue-700">{dummyENGODetails.totalImpact.carbonOffset}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Communities Impacted</p>
                      <p className="text-3xl font-bold text-purple-700">{dummyENGODetails.totalImpact.communitiesImpacted}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-6">
                      <p className="text-sm font-semibold text-gray-600">Hectares Restored</p>
                      <p className="text-3xl font-bold text-emerald-700">{dummyENGODetails.totalImpact.hectaresRestored.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-green-600">{dummyENGODetails.totalProjectsLaunched}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Team Size</p>
                        <p className="text-2xl font-bold text-blue-600">{dummyENGODetails.teamSize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Budget</p>
                        <p className="text-2xl font-bold text-purple-600">${(dummyENGODetails.annualBudget / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Certifications</h3>
                    <ul className="space-y-2">
                      {dummyENGODetails.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {cert}
                        </li>
                      ))}
                    </ul>
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

export default ENGODetailsPage;

