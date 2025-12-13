'use client';

import React from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

// Dummy person details data
const dummyPersonDetails = {
  name: 'Dr. Sarah Johnson',
  role: 'Executive Director',
  email: 'sarah.johnson@greenearth.org',
  phone: '+1 (555) 234-5678',
  bio: 'Dr. Sarah Johnson has over 15 years of experience in environmental conservation and sustainable development. She holds a Ph.D. in Environmental Science and has led numerous successful restoration projects across North and South America.',
  expertise: [
    'Environmental Policy',
    'Ecosystem Restoration',
    'Sustainable Development',
    'Climate Change Mitigation'
  ],
  education: [
    {
      degree: 'Ph.D. in Environmental Science',
      institution: 'Stanford University',
      year: '2008'
    },
    {
      degree: 'M.S. in Conservation Biology',
      institution: 'UC Berkeley',
      year: '2004'
    }
  ],
  projectsLed: 18,
  yearsExperience: 15,
  publications: 24,
  awards: [
    'Environmental Leadership Award 2023',
    'Conservation Excellence Award 2021',
    'Sustainable Innovation Prize 2019'
  ],
  socialLinks: {
    linkedin: 'linkedin.com/in/sarahjohnson',
    twitter: '@sarahj_eco',
    researchGate: 'researchgate.net/profile/sarah-johnson'
  }
};

const PersonDetailsPage: React.FC = () => {
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
                Person Details
              </h1>
              <p className="text-lg text-gray-600">
                Team member and leadership information
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Profile Header */}
                <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white shadow-lg">
                  <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
                      {dummyPersonDetails.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{dummyPersonDetails.name}</h2>
                      <p className="text-xl text-green-100">{dummyPersonDetails.role}</p>
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
                      <span className="text-lg text-gray-900">{dummyPersonDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-lg text-gray-900">{dummyPersonDetails.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Biography</h3>
                  <p className="text-lg leading-relaxed text-gray-700">{dummyPersonDetails.bio}</p>
                </div>

                {/* Expertise */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {dummyPersonDetails.expertise.map((area, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Education</h3>
                  <div className="space-y-4">
                    {dummyPersonDetails.education.map((edu, index) => (
                      <div key={index} className="rounded-lg border border-gray-200 p-4">
                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution} • {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 p-8 shadow-lg">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">Awards & Recognition</h3>
                  <ul className="space-y-3">
                    {dummyPersonDetails.awards.map((award, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-lg text-gray-900">{award}</span>
                      </li>
                    ))}
                  </ul>
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
                        <p className="text-2xl font-bold text-green-600">{dummyPersonDetails.projectsLed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Years of Experience</p>
                        <p className="text-2xl font-bold text-blue-600">{dummyPersonDetails.yearsExperience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Publications</p>
                        <p className="text-2xl font-bold text-purple-600">{dummyPersonDetails.publications}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Connect</h3>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600">
                        <span>LinkedIn</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600">
                        <span>Twitter</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600">
                        <span>ResearchGate</span>
                      </a>
                    </div>
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

