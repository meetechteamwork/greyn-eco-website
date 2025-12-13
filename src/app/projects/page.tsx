'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Project {
  id: string;
  name: string;
  category: string;
  carbonImpact: string;
  image: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
}

const ProjectsPage: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Amazon Rainforest Reforestation',
      category: 'Reforestation',
      carbonImpact: '500 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      description: 'Plant 10,000 native trees in the Amazon rainforest',
      fundingGoal: 100000,
      currentFunding: 75000
    },
    {
      id: '2',
      name: 'Solar Energy Farm - California',
      category: 'Solar Energy',
      carbonImpact: '800 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      description: 'Build a 5MW solar farm to power 1,200 homes',
      fundingGoal: 250000,
      currentFunding: 180000
    },
    {
      id: '3',
      name: 'Wind Power Initiative - Texas',
      category: 'Wind Energy',
      carbonImpact: '1,200 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80',
      description: 'Install 10 wind turbines generating clean energy',
      fundingGoal: 500000,
      currentFunding: 420000
    },
    {
      id: '4',
      name: 'Ocean Cleanup Initiative',
      category: 'Ocean Conservation',
      carbonImpact: '300 tons plastic removed',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      description: 'Remove plastic waste from Pacific Ocean regions',
      fundingGoal: 150000,
      currentFunding: 95000
    },
    {
      id: '5',
      name: 'Urban Green Rooftop Gardens',
      category: 'Urban Sustainability',
      carbonImpact: '150 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      description: 'Convert 50 city rooftops into green gardens',
      fundingGoal: 80000,
      currentFunding: 62000
    },
    {
      id: '6',
      name: 'Electric Vehicle Charging Network',
      category: 'Clean Transportation',
      carbonImpact: '650 tons CO₂/year',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      description: 'Install 200 EV charging stations across major cities',
      fundingGoal: 300000,
      currentFunding: 245000
    }
  ];

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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
              
              return (
                <article
                  key={project.id}
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

                    {/* View Project Button */}
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      View Project
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsPage;

