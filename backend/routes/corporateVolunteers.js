const express = require('express');
const router = express.Router();
const { authenticateCorporate } = require('../middleware/auth');
const corporateVolunteersController = require('../controllers/corporateVolunteersController');

// All routes require corporate authentication
router.use(authenticateCorporate);

/**
 * @route   GET /api/corporate/volunteers/events
 * @desc    List all volunteer events with pagination and filtering
 * @access  Corporate
 * @query   status, category, search, page, limit
 */
router.get('/events', corporateVolunteersController.getEvents);

/**
 * @route   GET /api/corporate/volunteers/events/:id
 * @desc    Get single event details
 * @access  Corporate
 */
router.get('/events/:id', corporateVolunteersController.getEvent);

/**
 * @route   POST /api/corporate/volunteers/events
 * @desc    Create new volunteer event
 * @access  Corporate
 * @body    { title, description, date, location, category, expectedVolunteers, expectedHours }
 */
router.post('/events', corporateVolunteersController.createEvent);

/**
 * @route   PUT /api/corporate/volunteers/events/:id
 * @desc    Update volunteer event
 * @access  Corporate
 * @body    { title?, description?, date?, location?, category?, expectedVolunteers?, expectedHours? }
 */
router.put('/events/:id', corporateVolunteersController.updateEvent);

/**
 * @route   DELETE /api/corporate/volunteers/events/:id
 * @desc    Delete volunteer event
 * @access  Corporate
 */
router.delete('/events/:id', corporateVolunteersController.deleteEvent);

/**
 * @route   GET /api/corporate/volunteers/hours
 * @desc    List volunteer hours entries with pagination and filtering
 * @access  Corporate
 * @query   status, search, page, limit
 */
router.get('/hours', corporateVolunteersController.getHoursEntries);

/**
 * @route   POST /api/corporate/volunteers/hours
 * @desc    Create volunteer hours entry (for approval)
 * @access  Corporate
 * @body    { volunteerEvent, volunteerName, volunteerEmail?, hours, notes? }
 */
router.post('/hours', corporateVolunteersController.createHoursEntry);

/**
 * @route   PATCH /api/corporate/volunteers/hours/:id/approve
 * @desc    Approve volunteer hours entry
 * @access  Corporate
 */
router.patch('/hours/:id/approve', corporateVolunteersController.approveHoursEntry);

/**
 * @route   PATCH /api/corporate/volunteers/hours/:id/reject
 * @desc    Reject volunteer hours entry
 * @access  Corporate
 * @body    { reason? }
 */
router.patch('/hours/:id/reject', corporateVolunteersController.rejectHoursEntry);

/**
 * @route   POST /api/corporate/volunteers/hours/bulk-approve
 * @desc    Bulk approve volunteer hours entries
 * @access  Corporate
 * @body    { entryIds: string[] }
 */
router.post('/hours/bulk-approve', corporateVolunteersController.bulkApproveHours);

/**
 * @route   GET /api/corporate/volunteers/export
 * @desc    Export volunteer data as CSV
 * @access  Corporate
 * @query   type: 'events' | 'hours'
 */
router.get('/export', corporateVolunteersController.exportData);

module.exports = router;
