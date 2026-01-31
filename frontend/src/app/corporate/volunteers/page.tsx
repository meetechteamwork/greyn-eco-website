'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';

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
  rejectionReason?: string;
}

interface EventsData {
  events: VolunteerEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalVolunteers: number;
    totalHours: number;
    pendingApprovals: number;
  };
}

interface HoursData {
  entries: VolunteerHoursEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function VolunteersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [hoursData, setHoursData] = useState<HoursData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showHoursFilter, setShowHoursFilter] = useState(false);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [bulkApproving, setBulkApproving] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  // Filters
  const [eventFilters, setEventFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const [hoursFilters, setHoursFilters] = useState({
    status: 'all',
    search: ''
  });

  // Pagination
  const [eventsPage, setEventsPage] = useState(1);
  const [hoursPage, setHoursPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    expectedVolunteers: '',
    expectedHours: ''
  });

  const categories = ['Environmental', 'Social', 'Education', 'Health', 'Other'];

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.corporate.volunteers.events.getAll({
        page: eventsPage,
        limit: pageSize,
        status: eventFilters.status !== 'all' ? eventFilters.status : undefined,
        category: eventFilters.category !== 'all' ? eventFilters.category : undefined,
        search: eventFilters.search || undefined
      });

      if (res.success && res.data) {
        setEventsData(res.data as EventsData);
      } else {
        setError(res.message || 'Failed to load events');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [eventsPage, eventFilters]);

  const fetchHoursEntries = useCallback(async () => {
    try {
      const res = await api.corporate.volunteers.hours.getAll({
        page: hoursPage,
        limit: pageSize,
        status: hoursFilters.status !== 'all' ? hoursFilters.status : undefined,
        search: hoursFilters.search || undefined
      });

      if (res.success && res.data) {
        setHoursData(res.data as HoursData);
      }
    } catch (err: any) {
      console.error('Failed to load hours entries:', err);
    }
  }, [hoursPage, hoursFilters]);

  useEffect(() => {
    fetchEvents();
    fetchHoursEntries();
  }, [fetchEvents, fetchHoursEntries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventFilterChange = (key: string, value: string) => {
    setEventFilters(prev => ({ ...prev, [key]: value }));
    setEventsPage(1);
  };

  const handleHoursFilterChange = (key: string, value: string) => {
    setHoursFilters(prev => ({ ...prev, [key]: value }));
    setHoursPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await api.corporate.volunteers.events.create({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        category: formData.category,
        expectedVolunteers: formData.expectedVolunteers ? parseInt(formData.expectedVolunteers) : undefined,
        expectedHours: formData.expectedHours ? parseInt(formData.expectedHours) : undefined
      });

      if (res.success) {
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          expectedVolunteers: '',
          expectedHours: ''
        });
        fetchEvents();
        alert('Event created successfully!');
      } else {
        alert(res.message || 'Failed to create event');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handleViewEvent = async (eventId: string) => {
    try {
      const res = await api.corporate.volunteers.events.get(eventId);
      if (res.success && res.data) {
        setSelectedEvent(res.data as VolunteerEvent);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load event details');
    }
  };

  const handleExport = async (type: 'events' | 'hours' = 'events') => {
    try {
      setExporting(true);
      await api.corporate.volunteers.export(type);
      alert(`${type === 'events' ? 'Events' : 'Hours'} exported successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleApprove = async (entryId: string) => {
    try {
      setApproving(entryId);
      const res = await api.corporate.volunteers.hours.approve(entryId);
      if (res.success) {
        fetchHoursEntries();
        fetchEvents(); // Refresh stats
        alert('Hours approved successfully!');
      } else {
        alert(res.message || 'Failed to approve hours');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to approve hours');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (entryId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    try {
      setRejecting(entryId);
      const res = await api.corporate.volunteers.hours.reject(entryId, reason || undefined);
      if (res.success) {
        fetchHoursEntries();
        fetchEvents(); // Refresh stats
        alert('Hours rejected');
      } else {
        alert(res.message || 'Failed to reject hours');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reject hours');
    } finally {
      setRejecting(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedEntries.length === 0) {
      alert('Please select entries to approve');
      return;
    }

    if (!confirm(`Approve ${selectedEntries.length} selected entries?`)) {
      return;
    }

    try {
      setBulkApproving(true);
      const res = await api.corporate.volunteers.hours.bulkApprove(selectedEntries);
      if (res.success) {
        setSelectedEntries([]);
        fetchHoursEntries();
        fetchEvents(); // Refresh stats
        alert(`${res.data?.approved || selectedEntries.length} entries approved successfully!`);
      } else {
        alert(res.message || 'Failed to bulk approve');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to bulk approve');
    } finally {
      setBulkApproving(false);
    }
  };

  const toggleEntrySelection = (entryId: string) => {
    setSelectedEntries(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
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

  if (loading && !eventsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  const events = eventsData?.events || [];
  const hoursEntries = hoursData?.entries || [];
  const stats = eventsData?.stats || { totalVolunteers: 0, totalHours: 0, pendingApprovals: 0 };
  const eventsPagination = eventsData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };
  const hoursPagination = hoursData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

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

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Total Volunteers</div>
              <div className="text-3xl font-bold">{stats.totalVolunteers}</div>
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
              <div className="text-3xl font-bold">{stats.totalHours}</div>
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
              <div className="text-3xl font-bold">{stats.pendingApprovals}</div>
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
                min="0"
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
                min="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                category: '',
                expectedVolunteers: '',
                expectedHours: ''
              })}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{creating ? 'Creating...' : 'Create Event'}</span>
              {!creating && (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              )}
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
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Filter
            </button>
            <button
              onClick={() => handleExport('events')}
              disabled={exporting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : 'View All'}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={eventFilters.status}
                  onChange={(e) => handleEventFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={eventFilters.category}
                  onChange={(e) => handleEventFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={eventFilters.search}
                  onChange={(e) => handleEventFilterChange('search', e.target.value)}
                  placeholder="Search events..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4 opacity-50">👥</div>
            <p className="text-gray-500 text-lg font-semibold mb-2">No volunteer events found</p>
            <p className="text-gray-400 text-sm">Create your first volunteer event to get started</p>
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
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
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
                    >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

            {/* Events Pagination */}
            {eventsPagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setEventsPage(prev => Math.max(1, prev - 1))}
                  disabled={eventsPage === 1 || loading}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white">
                  {eventsPagination.page}
                </span>
                <button
                  onClick={() => setEventsPage(prev => Math.min(eventsPagination.pages, prev + 1))}
                  disabled={eventsPage >= eventsPagination.pages || loading}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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
              <button
                onClick={() => handleExport('hours')}
                disabled={exporting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button
                onClick={handleBulkApprove}
                disabled={bulkApproving || selectedEntries.length === 0}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkApproving ? 'Approving...' : 'Bulk Approve'}
              </button>
            </div>
          </div>

          {/* Hours Filter Panel */}
          <div className="mt-4">
            <button
              onClick={() => setShowHoursFilter(!showHoursFilter)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {showHoursFilter ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showHoursFilter && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={hoursFilters.status}
                      onChange={(e) => handleHoursFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={hoursFilters.search}
                      onChange={(e) => handleHoursFilterChange('search', e.target.value)}
                      placeholder="Search entries..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedEntries.length === hoursEntries.length && hoursEntries.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEntries(hoursEntries.map(e => e.id));
                      } else {
                        setSelectedEntries([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
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
              {hoursEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-semibold mb-2">No volunteer hours entries found</p>
                      <p className="text-sm">Volunteer hours will appear here once submitted</p>
                    </div>
                  </td>
                </tr>
              ) : (
                hoursEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150"
                >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => toggleEntrySelection(entry.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
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
                            <button
                              onClick={() => handleApprove(entry.id)}
                              disabled={approving === entry.id}
                              className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                              {approving === entry.id ? 'Approving...' : 'Approve'}
                          </button>
                            <button
                              onClick={() => handleReject(entry.id)}
                              disabled={rejecting === entry.id}
                              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              {rejecting === entry.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{hoursEntries.length}</span> of <span className="font-semibold text-gray-900">{hoursPagination.total}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHoursPage(prev => Math.max(1, prev - 1))}
              disabled={hoursPage === 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white">
              {hoursPagination.page}
            </span>
            <button
              onClick={() => setHoursPage(prev => Math.min(hoursPagination.pages, prev + 1))}
              disabled={hoursPage >= hoursPagination.pages || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-900">{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Date</h3>
                    <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Location</h3>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Category</h3>
                    <p className="text-gray-900">{selectedEvent.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Status</h3>
                    {getEventStatusBadge(selectedEvent.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Volunteers</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedEvent.volunteers}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Hours</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedEvent.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
