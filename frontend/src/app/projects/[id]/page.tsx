'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface ProjectDetails {
  _id: string;
  name: string;
  category: string;
  carbonImpact: string;
  image: string;
  description: string;
  longDescription: string;
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  duration: string;
  location: string;
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const [investmentAmount, setInvestmentAmount] = useState<string>('100');
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/public/projects/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setProject(data.data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl font-semibold text-gray-700">Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl font-semibold text-gray-700 mb-4">{error || 'Project not found'}</p>
            <Link href="/projects" className="text-green-600 hover:text-green-700 font-semibold">
              ← Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;

  const handleInvestClick = useCallback(() => {
    alert(`Investment of $${investmentAmount} initiated! Redirecting to wallet...`);
  }, [investmentAmount]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Banner */}
        <div className="relative h-96 w-full overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${project.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                {project.category}
              </span>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {project.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Project Overview</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {project.longDescription}
              </p>

              {/* Key Metrics */}
              <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-blue-700">{project.duration}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-lg font-bold text-purple-700">{project.location}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-sm text-gray-600">Min. Investment</p>
                  <p className="text-2xl font-bold text-emerald-700">${project.minInvestment}</p>
                </div>
              </div>

              {/* Impact Details */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Environmental Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-semibold text-gray-900">Carbon Impact</p>
                      <p className="text-gray-700">{project.carbonImpact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-semibold text-gray-900">Carbon Credits</p>
                      <p className="text-gray-700">{project.carbonCreditsPerHundred} credits per $100 invested</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <p className="font-semibold text-gray-900">Sustainability Goal</p>
                      <p className="text-gray-700">Aligned with UN Sustainable Development Goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Invest Now</h3>

                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">Funding Progress</span>
                    <span className="font-bold text-green-600">{fundingPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${fundingPercentage}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>${(project.currentFunding / 1000).toFixed(0)}k raised</span>
                    <span>${(project.fundingGoal / 1000).toFixed(0)}k goal</span>
                  </div>
                </div>

                {/* Investment Amount Input */}
                <div className="mb-6">
                  <label htmlFor="investment" className="mb-2 block text-sm font-semibold text-gray-700">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    id="investment"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={project.minInvestment}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg font-semibold transition-colors focus:border-green-500 focus:outline-none"
                    placeholder="Enter amount"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum investment: ${project.minInvestment}
                  </p>
                </div>

                {/* Investment Calculations */}
                <div className="mb-6 space-y-3 rounded-lg bg-green-50 p-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Carbon Credits</span>
                    <span className="font-bold text-green-700">{calculatedCarbonCredits.toFixed(2)}</span>
                  </div>
                </div>

                {/* Invest Button */}
                <Link
                  href="/wallet"
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  Invest Now
                  <svg
                    className="h-5 w-5"
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

                <p className="text-center text-xs text-gray-500">
                  Secure investment through our platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;

