'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

type RoleTab = 'investor' | 'ngo' | 'corporate' | 'admin';

const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoleTab>('investor');

  // Check if user came from auth page with a role parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role === 'simple-user' || role === 'investor') setActiveTab('investor');
    else if (role === 'ngo') setActiveTab('ngo');
    else if (role === 'corporate') setActiveTab('corporate');
    else if (role === 'admin') setActiveTab('admin');
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tabs = [
    { id: 'investor' as RoleTab, label: 'Investor', icon: '💰' },
    { id: 'ngo' as RoleTab, label: 'NGO', icon: '🌱' },
    { id: 'corporate' as RoleTab, label: 'Corporate', icon: '🏢' },
    { id: 'admin' as RoleTab, label: 'Admin', icon: '🔐' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              How It Works
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Learn how Greyn Eco connects investors, NGOs, corporations, and administrators 
              to create a sustainable future together.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    scrollToSection(`section-${tab.id}`);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 shadow hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Investor Section */}
          <section
            id="section-investor"
            className={`mb-16 rounded-2xl bg-white p-8 shadow-xl transition-all ${
              activeTab === 'investor' ? 'border-2 border-green-500' : 'border border-gray-200'
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-3xl">
                💰
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">For Investors</h2>
                <p className="text-gray-600">Start investing in sustainable projects</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-green-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Browse Projects</h3>
                  <p className="text-gray-600">
                    Explore verified environmental projects from NGOs around the world. 
                    Each project shows its impact, funding goal, and expected returns.
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Invest & Track</h3>
                  <p className="text-gray-600">
                    Choose a project and invest any amount. Monitor your portfolio, 
                    track returns, and see the real-world impact of your investments.
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Earn Returns</h3>
                  <p className="text-gray-600">
                    Receive financial returns and carbon credits. Use credits to purchase 
                    eco-friendly products or retire them to offset your carbon footprint.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">Additional Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-600">✓</span>
                    <span><strong>Activity Tracking:</strong> Submit eco-friendly activities to earn additional credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-600">✓</span>
                    <span><strong>Product Marketplace:</strong> Buy sustainable products using your carbon credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-600">✓</span>
                    <span><strong>Portfolio Dashboard:</strong> View all your investments, returns, and impact in one place</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* NGO Section */}
          <section
            id="section-ngo"
            className={`mb-16 rounded-2xl bg-white p-8 shadow-xl transition-all ${
              activeTab === 'ngo' ? 'border-2 border-green-500' : 'border border-gray-200'
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-3xl">
                🌱
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">For NGOs</h2>
                <p className="text-gray-600">Launch and manage your environmental projects</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-emerald-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Register & Verify</h3>
                  <p className="text-gray-600">
                    Create your NGO account and complete your organization profile. 
                    Our team verifies your credentials to ensure authenticity.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Launch Projects</h3>
                  <p className="text-gray-600">
                    Submit your environmental project for review. Include details about 
                    impact, funding needs, timeline, and expected outcomes.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Receive Funding</h3>
                  <p className="text-gray-600">
                    Once approved, your project goes live. Investors can fund your project, 
                    and you receive funds as milestones are achieved.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">NGO Portal Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span><strong>Project Management:</strong> Track milestones, update progress, and manage team members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span><strong>Wallet System:</strong> Receive funds, track transactions, and request withdrawals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span><strong>Analytics Dashboard:</strong> Monitor project performance, funding progress, and impact metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Corporate Section */}
          <section
            id="section-corporate"
            className={`mb-16 rounded-2xl bg-white p-8 shadow-xl transition-all ${
              activeTab === 'corporate' ? 'border-2 border-blue-500' : 'border border-gray-200'
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-3xl">
                🏢
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">For Corporations</h2>
                <p className="text-gray-600">Achieve your ESG goals and sustainability targets</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Company Registration</h3>
                  <p className="text-gray-600">
                    Register your company and set up your corporate profile. 
                    Define your sustainability goals and ESG targets.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Track & Offset</h3>
                  <p className="text-gray-600">
                    Monitor your carbon emissions, invest in offset projects, 
                    and track your progress toward carbon neutrality.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Generate Reports</h3>
                  <p className="text-gray-600">
                    Create comprehensive ESG reports showcasing your sustainability 
                    initiatives and environmental impact to stakeholders.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">Corporate Portal Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">✓</span>
                    <span><strong>Emissions Tracking:</strong> Monitor and report your company's carbon footprint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">✓</span>
                    <span><strong>Campaign Management:</strong> Launch employee volunteer programs and sustainability campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">✓</span>
                    <span><strong>Compliance Reports:</strong> Generate detailed ESG reports for regulatory compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Admin Section */}
          <section
            id="section-admin"
            className={`mb-16 rounded-2xl bg-white p-8 shadow-xl transition-all ${
              activeTab === 'admin' ? 'border-2 border-red-500' : 'border border-gray-200'
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-3xl">
                🔐
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">For Administrators</h2>
                <p className="text-gray-600">Manage the platform and ensure quality</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-red-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Review & Approve</h3>
                  <p className="text-gray-600">
                    Review NGO registrations and project submissions. 
                    Verify credentials and approve high-quality projects.
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Monitor Platform</h3>
                  <p className="text-gray-600">
                    Track all platform activities, transactions, and user interactions. 
                    Ensure security and compliance across all portals.
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Manage System</h3>
                  <p className="text-gray-600">
                    Configure system settings, manage user roles, handle support requests, 
                    and maintain platform health.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">Admin Portal Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-red-600">✓</span>
                    <span><strong>Project Approval:</strong> Review and approve/reject NGO project submissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-red-600">✓</span>
                    <span><strong>User Management:</strong> Manage all users, roles, and access permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-red-600">✓</span>
                    <span><strong>Financial Oversight:</strong> Monitor all transactions, withdrawals, and financial activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-red-600">✓</span>
                    <span><strong>Security & Audit:</strong> Track security events, audit logs, and system health</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-lg opacity-90">
              Join thousands of users making a positive environmental impact
            </p>
            <Link
              href="/auth"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-600 transition-all hover:scale-105 hover:shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
