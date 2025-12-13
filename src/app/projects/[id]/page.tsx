'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface ProjectDetails {
  id: string;
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
  carbonCreditsPerHundred: number;
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const [investmentAmount, setInvestmentAmount] = useState<string>('100');

  // Placeholder project data
  const projectsData: { [key: string]: ProjectDetails } = {
    '1': {
      id: '1',
      name: 'Amazon Rainforest Reforestation',
      category: 'Reforestation',
      carbonImpact: '500 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
      description: 'Plant 10,000 native trees in the Amazon rainforest',
      longDescription: 'This project aims to restore 250 hectares of degraded Amazon rainforest by planting 10,000 native tree species. The initiative will create wildlife corridors, restore ecosystem services, and sequester significant amounts of carbon dioxide. Local communities will be employed for planting and maintenance, providing sustainable livelihoods while protecting one of Earth\'s most critical ecosystems.',
      fundingGoal: 100000,
      currentFunding: 75000,
      minInvestment: 50,
      duration: '10 years',
      location: 'Amazon Basin, Brazil',
      carbonCreditsPerHundred: 2.5
    },
    '2': {
      id: '2',
      name: 'Solar Energy Farm - California',
      category: 'Solar Energy',
      carbonImpact: '800 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
      description: 'Build a 5MW solar farm to power 1,200 homes',
      longDescription: 'A state-of-the-art 5 megawatt solar energy installation that will generate clean electricity for approximately 1,200 homes annually. Using cutting-edge photovoltaic technology, this project will offset 800 tons of CO₂ emissions per year while providing stable returns through power purchase agreements with local utilities.',
      fundingGoal: 250000,
      currentFunding: 180000,
      minInvestment: 100,
      duration: '25 years',
      location: 'California, USA',
      carbonCreditsPerHundred: 3.2
    },
    '3': {
      id: '3',
      name: 'Wind Power Initiative - Texas',
      category: 'Wind Energy',
      carbonImpact: '1,200 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1200&q=80',
      description: 'Install 10 wind turbines generating clean energy',
      longDescription: 'Deploy 10 modern wind turbines in the Texas wind corridor, generating clean renewable energy for thousands of homes. This project leverages optimal wind conditions to maximize energy production while minimizing environmental impact.',
      fundingGoal: 500000,
      currentFunding: 420000,
      minInvestment: 150,
      duration: '20 years',
      location: 'Texas, USA',
      carbonCreditsPerHundred: 4.0
    },
    '4': {
      id: '4',
      name: 'Ocean Cleanup Initiative',
      category: 'Ocean Conservation',
      carbonImpact: '300 tons plastic removed',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
      description: 'Remove plastic waste from Pacific Ocean regions',
      longDescription: 'Deploy advanced cleanup technology to remove plastic waste from critical Pacific Ocean regions. This initiative combines ocean cleanup with plastic recycling programs, creating a circular economy while protecting marine ecosystems.',
      fundingGoal: 150000,
      currentFunding: 95000,
      minInvestment: 75,
      duration: '5 years',
      location: 'Pacific Ocean',
      carbonCreditsPerHundred: 2.0
    },
    '5': {
      id: '5',
      name: 'Urban Green Rooftop Gardens',
      category: 'Urban Sustainability',
      carbonImpact: '150 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80',
      description: 'Convert 50 city rooftops into green gardens',
      longDescription: 'Transform urban rooftops into productive green spaces that reduce urban heat islands, improve air quality, and provide local food production. This project will convert 50 commercial building rooftops into sustainable gardens.',
      fundingGoal: 80000,
      currentFunding: 62000,
      minInvestment: 50,
      duration: '7 years',
      location: 'New York City, USA',
      carbonCreditsPerHundred: 1.5
    },
    '6': {
      id: '6',
      name: 'Electric Vehicle Charging Network',
      category: 'Clean Transportation',
      carbonImpact: '650 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80',
      description: 'Install 200 EV charging stations across major cities',
      longDescription: 'Build a comprehensive network of 200 electric vehicle charging stations across major metropolitan areas, accelerating the transition to clean transportation while generating revenue through charging fees.',
      fundingGoal: 300000,
      currentFunding: 245000,
      minInvestment: 100,
      duration: '15 years',
      location: 'Multiple Cities, USA',
      carbonCreditsPerHundred: 2.8
    }
  };

  const project = projectsData[params.id as string] || projectsData['1'];
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;

  const handleInvestClick = useCallback(() => {
    // Placeholder - will link to wallet in future
    alert(`Investment of $${investmentAmount} initiated! Redirecting to wallet...`);
  }, [investmentAmount]);

  const calculatedCarbonCredits = (parseFloat(investmentAmount) / 100) * project.carbonCreditsPerHundred;

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

