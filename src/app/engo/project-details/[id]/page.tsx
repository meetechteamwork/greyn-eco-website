'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

// Dummy project details data
const dummyProjects: { [key: string]: any } = {
  '1': {
    id: '1',
    name: 'Amazon Rainforest Reforestation',
    category: 'Reforestation',
    status: 'active',
    description: 'Plant 10,000 native trees in the Amazon rainforest',
    longDescription: 'This project aims to restore 250 hectares of degraded Amazon rainforest by planting 10,000 native tree species. The initiative will create wildlife corridors, restore ecosystem services, and sequester significant amounts of carbon dioxide.',
    fundingGoal: 100000,
    currentFunding: 75000,
    minInvestment: 50,
    duration: '10 years',
    location: 'Amazon Basin, Brazil',
    carbonCreditsPerHundred: 2.5,
    investorCount: 142,
    startDate: '2024-01-15',
    milestones: [
      { date: '2024-03-15', title: 'Site Preparation Complete', status: 'completed' },
      { date: '2024-06-15', title: 'First 2,500 Trees Planted', status: 'completed' },
      { date: '2024-09-15', title: '50% Planting Milestone', status: 'in-progress' },
      { date: '2025-01-15', title: 'All Trees Planted', status: 'pending' }
    ],
    team: [
      { name: 'Dr. Maria Silva', role: 'Project Lead' },
      { name: 'Carlos Rodriguez', role: 'Field Coordinator' },
      { name: 'Ana Costa', role: 'Community Engagement' }
    ]
  },
  '2': {
    id: '2',
    name: 'Solar Energy Farm - California',
    category: 'Solar Energy',
    status: 'active',
    description: 'Build a 5MW solar farm to power 1,200 homes',
    longDescription: 'A state-of-the-art 5 megawatt solar energy installation that will generate clean electricity for approximately 1,200 homes annually.',
    fundingGoal: 250000,
    currentFunding: 180000,
    minInvestment: 100,
    duration: '25 years',
    location: 'California, USA',
    carbonCreditsPerHundred: 3.2,
    investorCount: 215,
    startDate: '2024-02-01',
    milestones: [
      { date: '2024-04-01', title: 'Land Acquisition', status: 'completed' },
      { date: '2024-07-01', title: 'Construction Begins', status: 'in-progress' },
      { date: '2024-12-01', title: 'Grid Connection', status: 'pending' }
    ],
    team: [
      { name: 'James Wilson', role: 'Project Manager' },
      { name: 'Lisa Chen', role: 'Engineering Lead' }
    ]
  }
};

const ENGOProjectDetailsPage: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;
  const project = dummyProjects[projectId] || dummyProjects['1'];
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;

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
                {project.name}
              </h1>
              <p className="text-lg text-gray-600">{project.description}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Project Overview */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Overview</h2>
                  <p className="text-lg leading-relaxed text-gray-700">{project.longDescription}</p>
                </div>

                {/* Funding Progress */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Funding Progress</h2>
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">Progress</span>
                      <span className="font-bold text-green-600">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${(project.currentFunding / 1000).toFixed(0)}k raised</span>
                    <span>${(project.fundingGoal / 1000).toFixed(0)}k goal</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-gray-600">Investors</p>
                      <p className="text-2xl font-bold text-green-700">{project.investorCount}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-bold text-blue-700">{project.duration}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm text-gray-600">Min Investment</p>
                      <p className="text-2xl font-bold text-purple-700">${project.minInvestment}</p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Milestones</h2>
                  <div className="space-y-4">
                    {project.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        } text-white`}>
                          {milestone.status === 'completed' ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-lg font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{milestone.title}</p>
                          <p className="text-sm text-gray-600">{milestone.date}</p>
                          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Project Team</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.team.map((member: any, index: number) => (
                      <div key={index} className="rounded-lg border border-gray-200 p-4">
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Project Info */}
                  <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Project Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{project.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          {project.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{project.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Carbon Credits</p>
                        <p className="font-semibold text-green-600">{project.carbonCreditsPerHundred} per $100</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700">
                        Edit Project
                      </button>
                      <button className="w-full rounded-lg border-2 border-green-600 px-4 py-3 font-semibold text-green-600 transition hover:bg-green-50">
                        View Analytics
                      </button>
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

export default ENGOProjectDetailsPage;

