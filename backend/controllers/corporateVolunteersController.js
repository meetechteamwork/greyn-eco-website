const { Corporate } = require('../models/User');
const CorporateVolunteers = require('../models/CorporateVolunteers');
const VolunteerHoursEntry = require('../models/VolunteerHoursEntry');
const mongoose = require('mongoose');

/** Exclude seed/sample data so only real user data is shown */
const NO_SEED = { source: { $ne: 'seed' } };

/**
 * Determine event status based on date
 */
function getEventStatus(eventDate) {
  const now = new Date();
  const event = new Date(eventDate);
  const diffDays = Math.floor((event - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'completed';
  } else if (diffDays === 0) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
}

/**
 * Map category from frontend to database
 */
function mapCategory(category) {
  const categoryMap = {
    'Environmental': 'environmental',
    'Social': 'community',
    'Education': 'education',
    'Health': 'health',
    'Other': 'other'
  };
  return categoryMap[category] || 'other';
}

/**
 * Map category from database to frontend
 */
function mapCategoryToFrontend(category) {
  const categoryMap = {
    'environmental': 'Environmental',
    'community': 'Social',
    'education': 'Education',
    'health': 'Health',
    'disaster-relief': 'Other',
    'other': 'Other'
  };
  return categoryMap[category] || 'Other';
}

/**
 * GET /api/corporate/volunteers/events
 * List all volunteer events
 */
exports.getEvents = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (category && category !== 'all') {
      query.category = mapCategory(category);
    }
    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      CorporateVolunteers.find(query)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CorporateVolunteers.countDocuments(query)
    ]);

    // Map events with status
    let mappedEvents = events.map(event => {
      const eventStatus = getEventStatus(event.eventDate);
      return {
        id: String(event._id),
        title: event.eventName,
        description: event.description || '',
        date: event.eventDate.toISOString().split('T')[0],
        location: event.location || '',
        volunteers: event.participantCount || 0,
        hours: event.totalHours || 0,
        status: eventStatus,
        category: mapCategoryToFrontend(event.category)
      };
    });

    // Filter by status if provided
    if (status && status !== 'all') {
      mappedEvents = mappedEvents.filter(event => event.status === status);
    }

    // Get statistics
    const allEvents = await CorporateVolunteers.find({
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    const totalVolunteers = allEvents.reduce((sum, e) => sum + (e.participantCount || 0), 0);
    const totalHours = allEvents.reduce((sum, e) => sum + (e.totalHours || 0), 0);
    const pendingApprovals = await VolunteerHoursEntry.countDocuments({
      corporate: corporateId,
      status: 'pending',
      ...NO_SEED
    });

    res.json({
      success: true,
      data: {
        events: mappedEvents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mappedEvents.length,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          totalVolunteers,
          totalHours,
          pendingApprovals
        }
      }
    });
  } catch (error) {
    console.error('Error in getEvents (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load volunteer events',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/volunteers/events/:id
 * Get single event details
 */
exports.getEvent = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const event = await CorporateVolunteers.findOne({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const eventStatus = getEventStatus(event.eventDate);

    res.json({
      success: true,
      data: {
        id: String(event._id),
        title: event.eventName,
        description: event.description || '',
        date: event.eventDate.toISOString().split('T')[0],
        location: event.location || '',
        volunteers: event.participantCount || 0,
        hours: event.totalHours || 0,
        status: eventStatus,
        category: mapCategoryToFrontend(event.category),
        organizer: event.organizer || ''
      }
    });
  } catch (error) {
    console.error('Error in getEvent (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load event',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/volunteers/events
 * Create new volunteer event
 */
exports.createEvent = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { title, description, date, location, category, expectedVolunteers, expectedHours } = req.body;

    if (!title || !date || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, location, and category are required'
      });
    }

    const event = await CorporateVolunteers.create({
      corporate: corporateId,
      eventName: title,
      description: description || '',
      eventDate: new Date(date),
      location: location,
      category: mapCategory(category),
      participantCount: parseInt(expectedVolunteers) || 0,
      totalHours: parseInt(expectedHours) || 0,
      organizer: '' // Can be set later
    });

    const eventStatus = getEventStatus(event.eventDate);

    res.json({
      success: true,
      message: 'Volunteer event created successfully',
      data: {
        id: String(event._id),
        title: event.eventName,
        description: event.description || '',
        date: event.eventDate.toISOString().split('T')[0],
        location: event.location || '',
        volunteers: event.participantCount || 0,
        hours: event.totalHours || 0,
        status: eventStatus,
        category: mapCategoryToFrontend(event.category)
      }
    });
  } catch (error) {
    console.error('Error in createEvent (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * PUT /api/corporate/volunteers/events/:id
 * Update volunteer event
 */
exports.updateEvent = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;
    const { title, description, date, location, category, expectedVolunteers, expectedHours } = req.body;

    const updateData = {};
    if (title) updateData.eventName = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.eventDate = new Date(date);
    if (location) updateData.location = location;
    if (category) updateData.category = mapCategory(category);
    if (expectedVolunteers !== undefined) updateData.participantCount = parseInt(expectedVolunteers);
    if (expectedHours !== undefined) updateData.totalHours = parseInt(expectedHours);

    const event = await CorporateVolunteers.findOneAndUpdate(
      {
        _id: id,
        corporate: corporateId,
        ...NO_SEED
      },
      updateData,
      { new: true }
    ).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const eventStatus = getEventStatus(event.eventDate);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: {
        id: String(event._id),
        title: event.eventName,
        description: event.description || '',
        date: event.eventDate.toISOString().split('T')[0],
        location: event.location || '',
        volunteers: event.participantCount || 0,
        hours: event.totalHours || 0,
        status: eventStatus,
        category: mapCategoryToFrontend(event.category)
      }
    });
  } catch (error) {
    console.error('Error in updateEvent (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

/**
 * DELETE /api/corporate/volunteers/events/:id
 * Delete volunteer event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const event = await CorporateVolunteers.findOneAndDelete({
      _id: id,
      corporate: corporateId,
      ...NO_SEED
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Also delete associated hours entries
    await VolunteerHoursEntry.deleteMany({
      volunteerEvent: id,
      ...NO_SEED
    });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteEvent (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/volunteers/hours
 * List volunteer hours entries with pagination and filtering
 */
exports.getHoursEntries = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {
      corporate: corporateId,
      ...NO_SEED
    };

    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { volunteerName: { $regex: search, $options: 'i' } },
        { eventName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [entries, total] = await Promise.all([
      VolunteerHoursEntry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      VolunteerHoursEntry.countDocuments(query)
    ]);

    const mappedEntries = entries.map(entry => ({
      id: String(entry._id),
      volunteerName: entry.volunteerName,
      eventName: entry.eventName,
      date: entry.eventDate.toISOString().split('T')[0],
      hours: entry.hours,
      status: entry.status,
      submittedDate: entry.createdAt.toISOString().split('T')[0],
      notes: entry.notes || '',
      rejectionReason: entry.rejectionReason || ''
    }));

    res.json({
      success: true,
      data: {
        entries: mappedEntries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getHoursEntries (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load volunteer hours entries',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/volunteers/hours
 * Create volunteer hours entry (for approval)
 */
exports.createHoursEntry = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { volunteerEvent, volunteerName, volunteerEmail, hours, notes } = req.body;

    if (!volunteerEvent || !volunteerName || !hours) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer event, name, and hours are required'
      });
    }

    // Get event details
    const event = await CorporateVolunteers.findOne({
      _id: volunteerEvent,
      corporate: corporateId,
      ...NO_SEED
    }).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer event not found'
      });
    }

    const entry = await VolunteerHoursEntry.create({
      corporate: corporateId,
      volunteerEvent: volunteerEvent,
      volunteerName: volunteerName,
      volunteerEmail: volunteerEmail || '',
      eventName: event.eventName,
      eventDate: event.eventDate,
      hours: parseFloat(hours),
      status: 'pending',
      notes: notes || ''
    });

    res.json({
      success: true,
      message: 'Volunteer hours entry submitted for approval',
      data: {
        id: String(entry._id),
        volunteerName: entry.volunteerName,
        eventName: entry.eventName,
        date: entry.eventDate.toISOString().split('T')[0],
        hours: entry.hours,
        status: entry.status,
        submittedDate: entry.createdAt.toISOString().split('T')[0],
        notes: entry.notes || ''
      }
    });
  } catch (error) {
    console.error('Error in createHoursEntry (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit volunteer hours',
      error: error.message
    });
  }
};

/**
 * PATCH /api/corporate/volunteers/hours/:id/approve
 * Approve volunteer hours entry
 */
exports.approveHoursEntry = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;

    const entry = await VolunteerHoursEntry.findOneAndUpdate(
      {
        _id: id,
        corporate: corporateId,
        status: 'pending',
        ...NO_SEED
      },
      {
        status: 'approved',
        reviewedBy: corporateId,
        reviewedAt: new Date()
      },
      { new: true }
    ).lean();

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Hours entry not found or already processed'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer hours approved successfully',
      data: {
        id: String(entry._id),
        status: 'approved'
      }
    });
  } catch (error) {
    console.error('Error in approveHoursEntry (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve hours entry',
      error: error.message
    });
  }
};

/**
 * PATCH /api/corporate/volunteers/hours/:id/reject
 * Reject volunteer hours entry
 */
exports.rejectHoursEntry = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { id } = req.params;
    const { reason } = req.body;

    const entry = await VolunteerHoursEntry.findOneAndUpdate(
      {
        _id: id,
        corporate: corporateId,
        status: 'pending',
        ...NO_SEED
      },
      {
        status: 'rejected',
        reviewedBy: corporateId,
        reviewedAt: new Date(),
        rejectionReason: reason || ''
      },
      { new: true }
    ).lean();

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Hours entry not found or already processed'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer hours rejected',
      data: {
        id: String(entry._id),
        status: 'rejected'
      }
    });
  } catch (error) {
    console.error('Error in rejectHoursEntry (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject hours entry',
      error: error.message
    });
  }
};

/**
 * POST /api/corporate/volunteers/hours/bulk-approve
 * Bulk approve volunteer hours entries
 */
exports.bulkApproveHours = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { entryIds } = req.body;

    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Entry IDs array is required'
      });
    }

    const result = await VolunteerHoursEntry.updateMany(
      {
        _id: { $in: entryIds.map(id => new mongoose.Types.ObjectId(id)) },
        corporate: corporateId,
        status: 'pending',
        ...NO_SEED
      },
      {
        status: 'approved',
        reviewedBy: corporateId,
        reviewedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} entries approved successfully`,
      data: {
        approved: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error in bulkApproveHours (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve hours',
      error: error.message
    });
  }
};

/**
 * GET /api/corporate/volunteers/export
 * Export volunteer data as CSV
 */
exports.exportData = async (req, res) => {
  try {
    const corporateId = req.user.userId;
    const { type = 'events' } = req.query;

    if (type === 'events') {
      const events = await CorporateVolunteers.find({
        corporate: corporateId,
        ...NO_SEED
      }).sort({ eventDate: -1 }).lean();

      const csvRows = [
        ['Event Name', 'Date', 'Location', 'Category', 'Volunteers', 'Hours', 'Description']
      ];

      events.forEach(event => {
        csvRows.push([
          event.eventName,
          new Date(event.eventDate).toISOString().split('T')[0],
          event.location || '',
          mapCategoryToFrontend(event.category),
          event.participantCount || 0,
          event.totalHours || 0,
          (event.description || '').replace(/"/g, '""')
        ]);
      });

      const csv = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="volunteer-events-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else if (type === 'hours') {
      const entries = await VolunteerHoursEntry.find({
        corporate: corporateId,
        ...NO_SEED
      }).sort({ createdAt: -1 }).lean();

      const csvRows = [
        ['Volunteer Name', 'Event Name', 'Date', 'Hours', 'Status', 'Submitted Date', 'Notes']
      ];

      entries.forEach(entry => {
        csvRows.push([
          entry.volunteerName,
          entry.eventName,
          new Date(entry.eventDate).toISOString().split('T')[0],
          entry.hours,
          entry.status,
          new Date(entry.createdAt).toISOString().split('T')[0],
          (entry.notes || '').replace(/"/g, '""')
        ]);
      });

      const csv = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="volunteer-hours-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid export type. Must be "events" or "hours"'
      });
    }
  } catch (error) {
    console.error('Error in exportData (corporate/volunteers):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};
