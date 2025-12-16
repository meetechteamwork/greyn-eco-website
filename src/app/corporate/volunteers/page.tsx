'use client';

import React, { useState } from 'react';

interface VolunteerEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  volunteers: number;
  hours: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
}

interface VolunteerHoursEntry {
  id: string;
  volunteerName: string;
  eventName: string;
  date: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  notes?: string;
}

export default function VolunteersPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    expectedVolunteers: '',
    expectedHours: ''
  });

  // Mock volunteer events
  const mockEvents: VolunteerEvent[] = [
    {
      id: '1',
      title: 'Community Beach Cleanup',
      description: 'Join us for a day of cleaning up our local beaches and protecting marine life.',
      date: '2024-02-15',
      location: 'Sunset Beach, CA',
      volunteers: 45,
      hours: 180,
      status: 'upcoming',
      category: 'Environmental'
    },
    {
      id: '2',
      title: 'Tree Planting Initiative',
      description: 'Help us plant 500 trees in the local park to combat climate change.',
      date: '2024-02-20',
      location: 'Central Park, NY',
      volunteers: 120,
      hours: 480,
      status: 'upcoming',
      category: 'Environmental'
    },
    {
      id: '3',
      title: 'Food Bank Volunteer Day',
      description: 'Assist in sorting and distributing food to families in need.',
      date: '2024-01-28',
      location: 'Downtown Food Bank',
      volunteers: 32,
      hours: 128,
      status: 'ongoing',
      category: 'Social'
    },
    {
      id: '4',
      title: 'Educational Workshop Series',
      description: 'Teach sustainability practices to local schools and community groups.',
      date: '2024-01-25',
      location: 'Community Center',
      volunteers: 18,
      hours: 72,
      status: 'completed',
      category: 'Education'
    },
    {
      id: '5',
      title: 'Recycling Drive Event',
      description: 'Organize and manage a community-wide recycling collection drive.',
      date: '2024-02-10',
      location: 'City Hall Parking Lot',
      volunteers: 28,
      hours: 112,
      status: 'upcoming',
      category: 'Environmental'
    },
    {
      id: '6',
      title: 'Senior Care Support',
      description: 'Provide companionship and assistance to elderly community members.',
      date: '2024-01-30',
      location: 'Senior Living Center',
      volunteers: 15,
      hours: 60,
      status: 'ongoing',
      category: 'Social'
    }
  ];

  // Mock volunteer hours entries
  const mockHoursEntries: VolunteerHoursEntry[] = [
    {
      id: '1',
      volunteerName: 'Sarah Johnson',
      eventName: 'Community Beach Cleanup',
      date: '2024-01-15',
      hours: 4,
      status: 'pending',
      submittedDate: '2024-01-16',
      notes: 'Great participation, helped organize cleanup stations'
    },
    {
      id: '2',
      volunteerName: 'Michael Chen',
      eventName: 'Tree Planting Initiative',
      date: '2024-01-20',
      hours: 6,
      status: 'approved',
      submittedDate: '2024-01-21',
      notes: 'Excellent work, planted 25 trees'
    },
    {
      id: '3',
      volunteerName: 'Emily Rodriguez',
      eventName: 'Food Bank Volunteer Day',
      date: '2024-01-18',
      hours: 5,
      status: 'approved',
      submittedDate: '2024-01-19'
    },
    {
      id: '4',
      volunteerName: 'David Thompson',
      eventName: 'Educational Workshop Series',
      date: '2024-01-12',
      hours: 3,
      status: 'rejected',
      submittedDate: '2024-01-13',
      notes: 'Hours do not match event schedule'
    },
    {
      id: '5',
      volunteerName: 'Jessica Williams',
      eventName: 'Recycling Drive Event',
      date: '2024-01-10',
      hours: 4,
      status: 'pending',
      submittedDate: '2024-01-11',
      notes: 'Helped with setup and breakdown'
    },
    {
      id: '6',
      volunteerName: 'Robert Martinez',
      eventName: 'Senior Care Support',
      date: '2024-01-08',
      hours: 8,
      status: 'approved',
      submittedDate: '2024-01-09'
    },
    {
      id: '7',
      volunteerName: 'Amanda Davis',
      eventName: 'Community Beach Cleanup',
      date: '2024-01-15',
      hours: 3,
      status: 'pending',
      submittedDate: '2024-01-16'
    },
    {
      id: '8',
      volunteerName: 'James Wilson',
      eventName: 'Tree Planting Initiative',
      date: '2024-01-20',
      hours: 7,
      status: 'approved',
      submittedDate: '2024-01-21',
      notes: 'Team leader, coordinated planting activities'
    }
  ];

  const categories = ['Environmental', 'Social', 'Education', 'Health', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No logic needed
  };

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };

    const icons = {
      pending: '⏳',
      approved: '✓',
      rejected: '✗'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        <span>{icons[status]}</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getEventStatusBadge = (status: 'upcoming' | 'ongoing' | 'completed') => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700 border-blue-300',
      ongoing: 'bg-purple-100 text-purple-700 border-purple-300',
      completed: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    const labels = {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Calculate statistics
  const totalVolunteers = mockEvents.reduce((sum, event) => sum + event.volunteers, 0);
  const totalHours = mockEvents.reduce((sum, event) => sum + event.hours, 0);
  const pendingApprovals = mockHoursEntries.filter(e => e.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Volunteer Management
        </h1>
        <p className="text-lg text-gray-600">
          Organize events, track participation, and manage volunteer hours
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Total Volunteers</div>
              <div className="text-3xl font-bold">{totalVolunteers}</div>
              <div className="text-sm">across all events</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">⏱️</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Total Hours</div>
              <div className="text-3xl font-bold">{totalHours}</div>
              <div className="text-sm">volunteer hours</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Pending Approvals</div>
              <div className="text-3xl font-bold">{pendingApprovals}</div>
              <div className="text-sm">awaiting review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Volunteer Event Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Volunteer Event</h2>
          <p className="text-gray-600">Set up a new volunteer opportunity for your team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Community Beach Cleanup"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the volunteer event, what volunteers will do, and the impact..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Central Park, NY"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Volunteers */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Volunteers
              </label>
              <input
                type="number"
                name="expectedVolunteers"
                value={formData.expectedVolunteers}
                onChange={handleInputChange}
                placeholder="Estimated number"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Expected Hours */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Hours
              </label>
              <input
                type="number"
                name="expectedHours"
                value={formData.expectedHours}
                onChange={handleInputChange}
                placeholder="Total volunteer hours"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>Create Event</span>
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Event Cards List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Volunteer Events</h2>
            <p className="text-gray-600">Manage and track all volunteer activities</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg transition-all">
              View All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    {getEventStatusBadge(event.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-lg">📅</span>
                    <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-lg">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-lg">🏷️</span>
                    <span>{event.category}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Volunteers</div>
                    <div className="text-2xl font-bold text-gray-900">{event.volunteers}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hours</div>
                    <div className="text-2xl font-bold text-gray-900">{event.hours}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Hours Approval Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Volunteer Hours Approval</h2>
              <p className="text-gray-600">Review and approve submitted volunteer hours</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Export
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white hover:shadow-lg transition-all">
                Bulk Approve
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockHoursEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {entry.volunteerName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{entry.volunteerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700">{entry.eventName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      {entry.hours} hrs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {new Date(entry.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {entry.status === 'pending' && (
                        <>
                          <button className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{mockHoursEntries.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


