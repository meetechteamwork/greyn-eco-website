'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';

export default function CorporateHelpSupportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'faq' | 'contact'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const [faqs] = useState([
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I track CO₂ emissions?',
      answer: 'Navigate to CO₂ Emissions section, click "Submit Data", select the category (Electricity, Fuel, Travel, or Waste Recycled), enter the details, and submit. The system will automatically calculate your CO2 emissions.',
    },
    {
      id: '2',
      category: 'Security',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Profile Settings > Security tab, toggle on "Two-Factor Authentication", and follow the setup wizard to link your authenticator app.',
    },
    {
      id: '3',
      category: 'Reports',
      question: 'How do I generate an ESG report?',
      answer: 'Navigate to ESG Reports section, click "Generate Report", select the period and report type, then click "Generate". The report will be created with all your sustainability metrics.',
    },
    {
      id: '4',
      category: 'Volunteers',
      question: 'How do I approve volunteer hours?',
      answer: 'Go to Volunteers section, find the pending hours entry, review the details, and click "Approve" or "Reject". You can also use bulk approval for multiple entries.',
    },
    {
      id: '5',
      category: 'Campaigns',
      question: 'How do I create a new sustainability campaign?',
      answer: 'Navigate to Campaigns section, click "Create Campaign", fill in the campaign details (name, description, target amount, dates, category), and submit. The campaign will be created and visible to all employees.',
    },
    {
      id: '6',
      category: 'Profile',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile Settings > Profile tab, click "Edit Profile", update your information, and click "Save Changes". Your changes will be saved immediately.',
    },
    {
      id: '7',
      category: 'Dashboard',
      question: 'What do the sustainability scores mean?',
      answer: 'The sustainability score is calculated based on your CO2 emissions, volunteer hours, campaign participation, and donations. Higher scores indicate better sustainability performance.',
    },
    {
      id: '8',
      category: 'Data Export',
      question: 'How do I export my data?',
      answer: 'You can export data from any section (Emissions, Reports, Volunteers, Campaigns) using the "Export" button. Data is exported in CSV format for easy analysis.',
    },
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'docs', label: 'Documentation', icon: '📚' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contact', label: 'Contact Support', icon: '📧' },
  ];

  const quickLinks = [
    { title: 'ESG Reporting Guide', icon: '📊', href: '/corporate/reports', internal: true },
    { title: 'CO2 Tracking Best Practices', icon: '🌍', href: '/corporate/emissions', internal: true },
    { title: 'Volunteer Management', icon: '👥', href: '/corporate/volunteers', internal: true },
    { title: 'Campaign Setup Guide', icon: '📢', href: '/corporate/campaigns', internal: true },
    { title: 'Data Export Tutorial', icon: '📥', href: '/corporate/dashboard', internal: true },
    { title: 'Profile Settings', icon: '⚙️', href: '/corporate/profile-settings', internal: true },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);
    setContactSuccess(null);

    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in both subject and message fields');
      setContactLoading(false);
      return;
    }

    try {
      const response = await api.corporate.support.submitContact({
        subject: contactForm.subject,
        message: contactForm.message
      });

      if (response.success) {
        setContactSuccess(response.message || 'Your message has been sent successfully!');
        setContactForm({ subject: '', message: '' });
        setTimeout(() => setContactSuccess(null), 5000);
      } else {
        setContactError(response.message || 'Failed to send message');
      }
    } catch (err: any) {
      setContactError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent mb-2">
            Help & Support
          </h1>
          <p className="text-gray-600 text-lg">
            Get help with your corporate ESG portal
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-6 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-4 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-green-600 bg-white'
                      : 'text-gray-600 hover:text-green-600 hover:bg-white/50'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="font-semibold text-gray-900">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Support Options */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                    <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center text-2xl mb-4">
                      📧
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
                    <button
                      onClick={() => {
                        setActiveTab('contact');
                        // Scroll to form
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                    >
                      Send Email
                    </button>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                    <div className="w-12 h-12 rounded-lg bg-purple-200 flex items-center justify-center text-2xl mb-4">
                      📞
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Call us for immediate assistance</p>
                    <a
                      href="tel:+1234567890"
                      className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === 'docs' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation</h2>
              <div className="space-y-4">
                <a
                  href="/corporate/dashboard"
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                  <p className="text-sm text-gray-600 mb-3">Learn how to set up your corporate ESG portal and start tracking your sustainability metrics.</p>
                  <span className="text-green-600 font-semibold hover:text-green-700">View Dashboard →</span>
                </a>
                <a
                  href="/corporate/emissions"
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">CO2 Emissions Tracking</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete guide on how to track and calculate your CO2 emissions across different categories.</p>
                  <span className="text-green-600 font-semibold hover:text-green-700">Go to Emissions →</span>
                </a>
                <a
                  href="/corporate/reports"
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">ESG Reporting</h3>
                  <p className="text-sm text-gray-600 mb-3">Learn how to generate comprehensive ESG reports and export your data.</p>
                  <span className="text-green-600 font-semibold hover:text-green-700">View Reports →</span>
                </a>
                <a
                  href="/corporate/volunteers"
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Volunteer Management</h3>
                  <p className="text-sm text-gray-600 mb-3">Guide on managing volunteer events and approving volunteer hours.</p>
                  <span className="text-green-600 font-semibold hover:text-green-700">Manage Volunteers →</span>
                </a>
                <a
                  href="/corporate/campaigns"
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Campaign Management</h3>
                  <p className="text-sm text-gray-600 mb-3">Learn how to create and manage sustainability campaigns, track progress, and measure impact.</p>
                  <span className="text-green-600 font-semibold hover:text-green-700">View Campaigns →</span>
                </a>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-left">
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded mr-2">
                          {faq.category}
                        </span>
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
              
              {/* Success Message */}
              {contactSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="text-green-800 font-medium">{contactSuccess}</p>
                </div>
              )}

              {/* Error Message */}
              {contactError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <p className="text-red-800 font-medium">{contactError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="What can we help you with?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                      <textarea
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="Describe your issue or question..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Other ways to reach us</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📧</span>
                        <span className="font-semibold text-gray-900">Email</span>
                      </div>
                      <a href="mailto:support@greyn-eco.com" className="text-green-600 hover:text-green-700">
                        support@greyn-eco.com
                      </a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📞</span>
                        <span className="font-semibold text-gray-900">Phone</span>
                      </div>
                      <a href="tel:+1234567890" className="text-green-600 hover:text-green-700">
                        +1 (234) 567-890
                      </a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🕐</span>
                        <span className="font-semibold text-gray-900">Business Hours</span>
                      </div>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
