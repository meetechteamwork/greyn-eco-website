'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../utils/api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  ngoName: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  metrics?: any;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'milestones' | 'impact'>('overview');

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.corporate.campaigns.get(campaignId);

      if (res.success && res.data) {
        setCampaign(res.data as Campaign);
      } else {
        setError(res.message || 'Campaign not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4 opacity-50">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The campaign you are looking for does not exist.'}</p>
          <Link
            href="/corporate/campaigns"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = campaign.targetAmount > 0
    ? Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)
    : 0;

  const daysRemaining = campaign.endDate
    ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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

  // Get impact metrics from campaign.metrics
  const impact = campaign.metrics || {};
  const donors = impact.donors || 0;

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
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30 mr-3">
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
                <div className="text-2xl font-bold">{donors.toLocaleString()}</div>
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
                      className={`px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
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
                        {campaign.description || 'No additional description available.'}
                      </p>
                    </div>

                    {campaign.ngoName && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">NGO Partner</h3>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                              {campaign.ngoName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{campaign.ngoName}</h4>
                              <p className="text-gray-600">Partner organization supporting this campaign</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Start Date</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(campaign.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      {campaign.endDate && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">End Date</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Updates Tab */}
                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">📰</div>
                      <p className="text-gray-500">No updates yet. Check back soon!</p>
                    </div>
                  </div>
                )}

                {/* Milestones Tab */}
                {activeTab === 'milestones' && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">🎯</div>
                      <p className="text-gray-500">Milestones will be added as the campaign progresses.</p>
                    </div>
                  </div>
                )}

                {/* Impact Tab */}
                {activeTab === 'impact' && (
                  <div>
                    {Object.keys(impact).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {impact.emissionsReduced !== undefined && impact.emissionsReduced > 0 && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                            <div className="text-4xl mb-3">🌍</div>
                            <div className="text-3xl font-bold text-blue-900 mb-1">{impact.emissionsReduced.toLocaleString()}t</div>
                            <div className="text-sm text-blue-700">CO₂ Reduced</div>
                          </div>
                        )}
                        {impact.donationsRaised !== undefined && impact.donationsRaised > 0 && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <div className="text-4xl mb-3">💰</div>
                            <div className="text-3xl font-bold text-green-900 mb-1">${impact.donationsRaised.toLocaleString()}</div>
                            <div className="text-sm text-green-700">Donations Raised</div>
                          </div>
                        )}
                        {impact.volunteersEngaged !== undefined && impact.volunteersEngaged > 0 && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                            <div className="text-4xl mb-3">👥</div>
                            <div className="text-3xl font-bold text-purple-900 mb-1">{impact.volunteersEngaged.toLocaleString()}</div>
                            <div className="text-sm text-purple-700">Volunteers Engaged</div>
                          </div>
                        )}
                        {impact.peopleImpacted !== undefined && impact.peopleImpacted > 0 && (
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                            <div className="text-4xl mb-3">🌱</div>
                            <div className="text-3xl font-bold text-orange-900 mb-1">{impact.peopleImpacted.toLocaleString()}</div>
                            <div className="text-sm text-orange-700">People Impacted</div>
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
                  <div className="font-semibold text-gray-900">{donors.toLocaleString()}</div>
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
                <button
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://www.facebook.com/share/1AXzwMhXZL/?mibextid=wwXIfr/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Facebook
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Campaign link copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors"
                >
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
