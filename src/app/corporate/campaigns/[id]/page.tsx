'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  ngoName: string;
  ngoDescription: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  imageUrl?: string;
  donors: number;
  updates: CampaignUpdate[];
  milestones: Milestone[];
  impact: ImpactMetrics;
}

interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  achieved: boolean;
  achievedDate?: string;
}

interface ImpactMetrics {
  treesPlanted?: number;
  co2Offset?: number;
  peopleHelped?: number;
  wasteCollected?: number;
  waterProvided?: number;
  educationProvided?: number;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id as string;

  // Mock campaigns data with extended details
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Ocean Cleanup Initiative',
      description: 'Support our mission to remove plastic waste from the world\'s oceans and protect marine ecosystems.',
      fullDescription: 'Our Ocean Cleanup Initiative is a comprehensive program designed to tackle the growing problem of plastic pollution in our oceans. Through coordinated beach cleanups, ocean trawling operations, and community education programs, we aim to remove over 10,000 tons of plastic waste from marine environments while raising awareness about sustainable practices. This initiative brings together volunteers, scientists, and environmental organizations to create lasting change.',
      ngoName: 'Ocean Guardians Foundation',
      ngoDescription: 'A leading environmental organization dedicated to protecting marine ecosystems and promoting ocean conservation worldwide.',
      category: 'Environmental',
      targetAmount: 50000,
      raisedAmount: 37500,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      status: 'active',
      donors: 1247,
      updates: [
        {
          id: '1',
          date: '2024-02-01',
          title: 'Major Milestone Reached',
          content: 'We\'ve successfully removed 5,000 tons of plastic waste from the Pacific Ocean! Thank you to all our volunteers and donors.',
        },
        {
          id: '2',
          date: '2024-01-25',
          title: 'New Partnership Announced',
          content: 'We\'re excited to partner with local fishing communities to expand our cleanup efforts.',
        },
        {
          id: '3',
          date: '2024-01-20',
          title: 'Campaign Launch',
          content: 'The Ocean Cleanup Initiative has officially launched! Join us in making a difference.',
        }
      ],
      milestones: [
        {
          id: '1',
          title: 'Initial Funding Goal',
          description: 'Raise $25,000 for equipment and operations',
          targetAmount: 25000,
          achieved: true,
          achievedDate: '2024-01-28'
        },
        {
          id: '2',
          title: '5,000 Tons Removed',
          description: 'Remove 5,000 tons of plastic waste',
          targetAmount: 35000,
          achieved: true,
          achievedDate: '2024-02-01'
        },
        {
          id: '3',
          title: 'Final Goal',
          description: 'Reach full funding target of $50,000',
          targetAmount: 50000,
          achieved: false
        }
      ],
      impact: {
        wasteCollected: 5000,
        co2Offset: 250,
        peopleHelped: 15000
      }
    },
    {
      id: '2',
      title: 'Reforestation Project',
      description: 'Help us plant 10,000 trees in deforested areas to combat climate change and restore biodiversity.',
      fullDescription: 'Our Reforestation Project aims to restore degraded forest ecosystems by planting native tree species across multiple regions. This initiative not only helps combat climate change through carbon sequestration but also restores critical habitats for wildlife, prevents soil erosion, and supports local communities through sustainable forestry practices.',
      ngoName: 'Green Earth Alliance',
      ngoDescription: 'Dedicated to environmental restoration and sustainable development through community-driven initiatives.',
      category: 'Environmental',
      targetAmount: 75000,
      raisedAmount: 62000,
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      status: 'active',
      donors: 2156,
      updates: [
        {
          id: '1',
          date: '2024-02-05',
          title: '7,500 Trees Planted',
          content: 'We\'ve reached 75% of our tree planting goal! The saplings are thriving in their new homes.',
        },
        {
          id: '2',
          date: '2024-01-25',
          title: 'Community Engagement',
          content: 'Local communities are actively participating in the planting activities.',
        }
      ],
      milestones: [
        {
          id: '1',
          title: '5,000 Trees',
          description: 'Plant first 5,000 trees',
          targetAmount: 40000,
          achieved: true,
          achievedDate: '2024-01-30'
        },
        {
          id: '2',
          title: '7,500 Trees',
          description: 'Reach 75% of planting goal',
          targetAmount: 60000,
          achieved: true,
          achievedDate: '2024-02-05'
        },
        {
          id: '3',
          title: '10,000 Trees',
          description: 'Complete full reforestation goal',
          targetAmount: 75000,
          achieved: false
        }
      ],
      impact: {
        treesPlanted: 7500,
        co2Offset: 1500,
        peopleHelped: 5000
      }
    },
    {
      id: '3',
      title: 'Clean Water Access',
      description: 'Provide clean drinking water to 5,000 families in rural communities across Africa.',
      fullDescription: 'This initiative focuses on installing water wells, filtration systems, and water distribution networks in underserved rural communities. By providing access to clean, safe drinking water, we improve health outcomes, reduce waterborne diseases, and free up time for education and economic activities.',
      ngoName: 'Water for Life',
      ngoDescription: 'Committed to ensuring universal access to clean water and sanitation.',
      category: 'Social',
      targetAmount: 100000,
      raisedAmount: 100000,
      startDate: '2023-11-01',
      endDate: '2024-01-31',
      status: 'completed',
      donors: 3421,
      updates: [
        {
          id: '1',
          date: '2024-01-25',
          title: 'Project Completed',
          content: 'All 5,000 families now have access to clean water! This project has transformed entire communities.',
        }
      ],
      milestones: [
        {
          id: '1',
          title: '2,500 Families',
          description: 'Provide water access to half of target families',
          targetAmount: 50000,
          achieved: true,
          achievedDate: '2023-12-15'
        },
        {
          id: '2',
          title: 'Full Goal Achieved',
          description: 'Complete water access for all 5,000 families',
          targetAmount: 100000,
          achieved: true,
          achievedDate: '2024-01-25'
        }
      ],
      impact: {
        waterProvided: 5000,
        peopleHelped: 25000
      }
    },
    {
      id: '4',
      title: 'Wildlife Conservation',
      description: 'Protect endangered species and their habitats through conservation programs and anti-poaching efforts.',
      fullDescription: 'Our Wildlife Conservation program works to protect endangered species through habitat preservation, anti-poaching patrols, community education, and wildlife rehabilitation. We collaborate with local communities and governments to create sustainable conservation solutions.',
      ngoName: 'Wildlife Protection Society',
      ngoDescription: 'Leading the fight against wildlife extinction through innovative conservation strategies.',
      category: 'Environmental',
      targetAmount: 120000,
      raisedAmount: 45000,
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'active',
      donors: 892,
      updates: [
        {
          id: '1',
          date: '2024-02-10',
          title: 'Anti-Poaching Success',
          content: 'Our patrols have successfully prevented 15 poaching incidents this month.',
        }
      ],
      milestones: [
        {
          id: '1',
          title: 'Initial Funding',
          description: 'Raise $40,000 for equipment',
          targetAmount: 40000,
          achieved: true,
          achievedDate: '2024-02-05'
        },
        {
          id: '2',
          title: 'Full Funding',
          description: 'Reach complete funding goal',
          targetAmount: 120000,
          achieved: false
        }
      ],
      impact: {
        peopleHelped: 3000
      }
    },
    {
      id: '5',
      title: 'Education for All',
      description: 'Build schools and provide educational resources to underserved communities worldwide.',
      fullDescription: 'Education for All focuses on constructing schools, training teachers, and providing educational materials to children in underserved communities. We believe education is the foundation for breaking cycles of poverty and creating sustainable development.',
      ngoName: 'Global Education Fund',
      ngoDescription: 'Empowering communities through quality education and learning opportunities.',
      category: 'Education',
      targetAmount: 200000,
      raisedAmount: 185000,
      startDate: '2023-12-01',
      endDate: '2024-02-29',
      status: 'active',
      donors: 4567,
      updates: [
        {
          id: '1',
          date: '2024-02-15',
          title: 'Three Schools Completed',
          content: 'We\'ve successfully completed construction of three new schools, serving over 1,200 students.',
        }
      ],
      milestones: [
        {
          id: '1',
          title: 'First School',
          description: 'Complete first school construction',
          targetAmount: 60000,
          achieved: true,
          achievedDate: '2024-01-10'
        },
        {
          id: '2',
          title: 'Three Schools',
          description: 'Complete three school constructions',
          targetAmount: 150000,
          achieved: true,
          achievedDate: '2024-02-15'
        },
        {
          id: '3',
          title: 'Full Goal',
          description: 'Reach full funding target',
          targetAmount: 200000,
          achieved: false
        }
      ],
      impact: {
        educationProvided: 1200,
        peopleHelped: 5000
      }
    },
    {
      id: '6',
      title: 'Renewable Energy Transition',
      description: 'Install solar panels in rural communities to provide clean, sustainable energy access.',
      fullDescription: 'This project aims to bring renewable energy to rural communities through solar panel installations. By providing clean energy access, we reduce reliance on fossil fuels, improve quality of life, and support economic development.',
      ngoName: 'Solar Future Initiative',
      ngoDescription: 'Advancing renewable energy adoption in underserved communities.',
      category: 'Environmental',
      targetAmount: 150000,
      raisedAmount: 0,
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      status: 'upcoming',
      donors: 0,
      updates: [],
      milestones: [
        {
          id: '1',
          title: 'Initial Funding',
          description: 'Raise $50,000 to begin installations',
          targetAmount: 50000,
          achieved: false
        }
      ],
      impact: {}
    }
  ];

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'milestones' | 'impact'>('overview');

  useEffect(() => {
    const foundCampaign = mockCampaigns.find(c => c.id === campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
    }
  }, [campaignId]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
  const daysRemaining = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-300',
      completed: 'bg-blue-100 text-blue-700 border-blue-300',
      upcoming: 'bg-purple-100 text-purple-700 border-purple-300'
    };

    const labels = {
      active: 'Active',
      completed: 'Completed',
      upcoming: 'Upcoming'
    };

    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
        
        <div className="relative container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-16">
          {/* Back Button */}
          <Link
            href="/corporate/campaigns"
            className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Campaigns</span>
          </Link>

          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                {campaign.category}
              </span>
              {getStatusBadge(campaign.status)}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {campaign.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl">
              {campaign.description}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm opacity-90 mb-1">Raised</div>
                <div className="text-2xl font-bold">${(campaign.raisedAmount / 1000).toFixed(1)}K</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm opacity-90 mb-1">Target</div>
                <div className="text-2xl font-bold">${(campaign.targetAmount / 1000).toFixed(0)}K</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm opacity-90 mb-1">Donors</div>
                <div className="text-2xl font-bold">{campaign.donors.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm opacity-90 mb-1">Days Left</div>
                <div className="text-2xl font-bold">{daysRemaining > 0 ? daysRemaining : 'Ended'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 md:px-8 lg:px-10 py-6">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Campaign Progress</span>
              <span className="text-sm font-bold text-purple-600">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'updates', label: 'Updates' },
                    { id: 'milestones', label: 'Milestones' },
                    { id: 'impact', label: 'Impact' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Campaign</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {campaign.fullDescription}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">NGO Partner</h3>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                            {campaign.ngoName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{campaign.ngoName}</h4>
                            <p className="text-gray-600">{campaign.ngoDescription}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Start Date</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(campaign.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">End Date</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Updates Tab */}
                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    {campaign.updates.length > 0 ? (
                      campaign.updates.map((update) => (
                        <div key={update.id} className="border-l-4 border-purple-500 pl-6 pb-6 last:pb-0">
                          <div className="text-sm text-gray-500 mb-2">
                            {new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{update.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{update.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4 opacity-50">📰</div>
                        <p className="text-gray-500">No updates yet. Check back soon!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Milestones Tab */}
                {activeTab === 'milestones' && (
                  <div className="space-y-6">
                    {campaign.milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className={`relative pl-8 pb-8 last:pb-0 ${
                          index < campaign.milestones.length - 1 ? 'border-l-2 border-gray-200' : ''
                        }`}
                      >
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                          style={{
                            backgroundColor: milestone.achieved ? '#10b981' : '#e5e7eb',
                            marginLeft: '-13px'
                          }}
                        >
                          {milestone.achieved && (
                            <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{milestone.title}</h4>
                            {milestone.achieved && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                                Achieved
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{milestone.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Target: ${(milestone.targetAmount / 1000).toFixed(0)}K
                            </span>
                            {milestone.achievedDate && (
                              <span className="text-xs text-gray-500">
                                Achieved: {new Date(milestone.achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Impact Tab */}
                {activeTab === 'impact' && (
                  <div>
                    {Object.keys(campaign.impact).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaign.impact.treesPlanted && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <div className="text-4xl mb-3">🌳</div>
                            <div className="text-3xl font-bold text-green-900 mb-1">{campaign.impact.treesPlanted.toLocaleString()}</div>
                            <div className="text-sm text-green-700">Trees Planted</div>
                          </div>
                        )}
                        {campaign.impact.co2Offset && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                            <div className="text-4xl mb-3">🌍</div>
                            <div className="text-3xl font-bold text-blue-900 mb-1">{campaign.impact.co2Offset.toLocaleString()}t</div>
                            <div className="text-sm text-blue-700">CO₂ Offset</div>
                          </div>
                        )}
                        {campaign.impact.peopleHelped && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                            <div className="text-4xl mb-3">👥</div>
                            <div className="text-3xl font-bold text-purple-900 mb-1">{campaign.impact.peopleHelped.toLocaleString()}</div>
                            <div className="text-sm text-purple-700">People Helped</div>
                          </div>
                        )}
                        {campaign.impact.wasteCollected && (
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                            <div className="text-4xl mb-3">♻️</div>
                            <div className="text-3xl font-bold text-orange-900 mb-1">{campaign.impact.wasteCollected.toLocaleString()}t</div>
                            <div className="text-sm text-orange-700">Waste Collected</div>
                          </div>
                        )}
                        {campaign.impact.waterProvided && (
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                            <div className="text-4xl mb-3">💧</div>
                            <div className="text-3xl font-bold text-cyan-900 mb-1">{campaign.impact.waterProvided.toLocaleString()}</div>
                            <div className="text-sm text-cyan-700">Families with Clean Water</div>
                          </div>
                        )}
                        {campaign.impact.educationProvided && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                            <div className="text-4xl mb-3">📚</div>
                            <div className="text-3xl font-bold text-indigo-900 mb-1">{campaign.impact.educationProvided.toLocaleString()}</div>
                            <div className="text-sm text-indigo-700">Students Enrolled</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4 opacity-50">📊</div>
                        <p className="text-gray-500">Impact metrics will be updated as the campaign progresses.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Donate Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support This Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                  />
                </div>
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  Donate Now
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Your donation is secure and will directly support this campaign
                </div>
              </div>
            </div>

            {/* Campaign Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Category</div>
                  <div className="font-semibold text-gray-900">{campaign.category}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  {getStatusBadge(campaign.status)}
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Donors</div>
                  <div className="font-semibold text-gray-900">{campaign.donors.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Days Remaining</div>
                  <div className="font-semibold text-gray-900">{daysRemaining > 0 ? `${daysRemaining} days` : 'Campaign ended'}</div>
                </div>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Campaign</h3>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

