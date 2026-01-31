'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../../utils/api';

interface Project {
  _id: string;
  name: string;
  category: string;
  carbonImpact: string;
  image: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  fundingPercentage?: number;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.public.projects.get({ limit: 100 });
        if (response.success && response.data) {
          setProjects(response.data);
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

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              Unable to Load Projects
            </h3>
            <p className="mb-8 text-lg text-gray-600">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              <span>Try Again</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Reforestation': 'bg-green-100 text-green-700',
      'Solar Energy': 'bg-yellow-100 text-yellow-700',
      'Wind Energy': 'bg-blue-100 text-blue-700',
      'Ocean Conservation': 'bg-cyan-100 text-cyan-700',
      'Urban Sustainability': 'bg-emerald-100 text-emerald-700',
      'Clean Transportation': 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Investment Projects
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover sustainable projects making a real environmental impact. 
              Invest in the future while earning returns.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="mx-auto max-w-2xl py-16 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                No Investment Projects Available
              </h3>
              <p className="mb-8 text-lg text-gray-600">
                We're currently working on bringing you exciting new investment opportunities. 
                Check back soon to discover sustainable projects that make a real environmental impact.
              </p>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
              >
                <span>Return to Home</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const fundingPercentage = project.fundingPercentage || (project.fundingGoal > 0 ? (project.currentFunding / project.fundingGoal) * 100 : 0);
                
                return (
                  <article
                    key={project._id || project.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${project.image}')` }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {project.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {project.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="mb-4">
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-xs text-gray-600">Carbon Impact</p>
                        <p className="text-sm font-bold text-blue-700">{project.carbonImpact}</p>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-semibold text-gray-900">{fundingPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{ width: `${fundingPercentage}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>${(project.currentFunding / 1000).toFixed(0)}k raised</span>
                        <span>${(project.fundingGoal / 1000).toFixed(0)}k goal</span>
                      </div>
                    </div>

                    {/* Invest Button - Redirects to Auth */}
                    <Link
                      href="/auth?action=invest"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      Invest Now
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsPage;

