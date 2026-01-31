'use client';

import React, { useState } from 'react';

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'faq' | 'contact' | 'tickets'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const [faqs] = useState([
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I create a new user account?',
      answer: 'Navigate to Users section, click "Add New User", fill in the required information, and assign appropriate roles and permissions. The user will receive an email invitation to complete their registration.',
    },
    {
      id: '2',
      category: 'Security',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Profile Settings > Security tab, toggle on "Two-Factor Authentication", and follow the setup wizard to link your authenticator app.',
    },
    {
      id: '3',
      category: 'System',
      question: 'How do I perform a system backup?',
      answer: 'Navigate to System Settings > Backup & Restore section, click "Create Backup Now" button. You can also schedule automatic backups in the Maintenance settings.',
    },
    {
      id: '4',
      category: 'Users',
      question: 'How do I change a user\'s role?',
      answer: 'Go to Users page, find the user, click on "Change Role" action button, select the new role, and confirm the change. The user will be notified of the role change.',
    },
    {
      id: '5',
      category: 'Security',
      question: 'What should I do if I see suspicious activity?',
      answer: 'Immediately check the Security & Logs page for detailed information. If a threat is detected, it will be automatically blocked. You can also manually revoke sessions or block IP addresses from the Access Control section.',
    },
    {
      id: '6',
      category: 'System',
      question: 'How do I enable maintenance mode?',
      answer: 'Go to System Settings > General tab, toggle on "Maintenance Mode". This will temporarily disable public access while you perform updates or maintenance.',
    },
  ]);

  const [supportTickets] = useState([
    {
      id: 'T-2024-001',
      subject: 'API Integration Issue',
      status: 'open',
      priority: 'high',
      created: '2024-03-20',
      lastUpdate: '2 hours ago',
    },
    {
      id: 'T-2024-002',
      subject: 'User Permission Question',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-03-19',
      lastUpdate: '1 day ago',
    },
    {
      id: 'T-2024-003',
      subject: 'Feature Request: Bulk Export',
      status: 'resolved',
      priority: 'low',
      created: '2024-03-15',
      lastUpdate: '3 days ago',
    },
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'docs', label: 'Documentation', icon: '📚' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contact', label: 'Contact Support', icon: '💬' },
    { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
  ];

  const quickLinks = [
    { title: 'User Management Guide', icon: '👥', href: '#' },
    { title: 'Security Best Practices', icon: '🔒', href: '#' },
    { title: 'API Documentation', icon: '🔌', href: '#' },
    { title: 'System Configuration', icon: '⚙️', href: '#' },
    { title: 'Troubleshooting Guide', icon: '🔧', href: '#' },
    { title: 'Video Tutorials', icon: '🎥', href: '#' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'in-progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                Help & Support
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-lg">
                Get assistance, browse documentation, and contact our support team
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, FAQs, or documentation..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-800 dark:text-white text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 mb-6">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-4 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-red-600 dark:text-red-400 bg-gray-50 dark:bg-slate-800'
                      : 'text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Links */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Links</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {link.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                              {link.title}
                            </h3>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Support Options */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get Support</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <div className="w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-900/30 flex items-center justify-center text-2xl mb-4">
                        💬
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Chat with our support team in real-time</p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                        Start Chat
                      </button>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                      <div className="w-12 h-12 rounded-lg bg-green-200 dark:bg-green-900/30 flex items-center justify-center text-2xl mb-4">
                        📧
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Send us an email and we'll respond within 24 hours</p>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                        Send Email
                      </button>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                      <div className="w-12 h-12 rounded-lg bg-purple-200 dark:bg-purple-900/30 flex items-center justify-center text-2xl mb-4">
                        🎫
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Create Ticket</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Submit a support ticket for detailed assistance</p>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                        New Ticket
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Support Email</p>
                      <p className="font-semibold text-gray-900 dark:text-white">support@greyn-eco.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Support Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Business Hours</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Mon-Fri, 9 AM - 6 PM PST</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Response Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documentation Tab */}
            {activeTab === 'docs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Documentation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Getting Started Guide', desc: 'Learn the basics of the admin portal', icon: '🚀' },
                    { title: 'User Management', desc: 'Complete guide to managing users and roles', icon: '👥' },
                    { title: 'Security Configuration', desc: 'Set up security features and best practices', icon: '🔒' },
                    { title: 'API Reference', desc: 'Complete API documentation and examples', icon: '🔌' },
                    { title: 'System Administration', desc: 'Configure system settings and preferences', icon: '⚙️' },
                    { title: 'Troubleshooting', desc: 'Common issues and their solutions', icon: '🔧' },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{doc.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{doc.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-400">{doc.desc}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{faq.question}</h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}
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
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Support</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="What can we help you with?"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                      Priority
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all">
                      <option>Technical Issue</option>
                      <option>Feature Request</option>
                      <option>Account Question</option>
                      <option>Billing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Please provide as much detail as possible..."
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Max file size: 10MB</p>
                    </div>
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl">
                    Submit Support Request
                  </button>
                </div>
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-lg">
                    Create New Ticket
                  </button>
                </div>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{ticket.subject}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                            <span>Ticket ID: {ticket.id}</span>
                            <span>Created: {ticket.created}</span>
                            <span>Last Update: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
