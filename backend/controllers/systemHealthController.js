const SystemService = require('../models/SystemService');
const Incident = require('../models/Incident');
const SystemLog = require('../models/SystemLog');

/**
 * Get all system health data (services, incidents, logs)
 */
exports.getSystemHealth = async (req, res) => {
  try {
    // Fetch all data in parallel
    const [services, incidents, logs] = await Promise.all([
      SystemService.getServices().catch(() => []),
      Incident.getRecentIncidents(10).catch(() => []),
      SystemLog.getRecentLogs(20).catch(() => [])
    ]);
    
    // Calculate overall status
    const operationalCount = services.filter(s => s.status === 'operational').length;
    const overallStatus = services.length > 0 && operationalCount === services.length 
      ? 'operational' 
      : services.some(s => s.status === 'down') 
        ? 'down' 
        : 'degraded';
    
    // Format services for frontend
    const formattedServices = services.map(service => ({
      id: service._id.toString(),
      name: service.name,
      status: service.status,
      latency: service.latency || 0,
      uptime: service.uptime || 100,
      lastChecked: service.lastChecked || service.createdAt
    }));
    
    // Format incidents for frontend
    const formattedIncidents = incidents.map(incident => ({
      id: incident._id.toString(),
      incidentId: incident.incidentId,
      service: incident.service,
      severity: incident.severity,
      status: incident.status,
      timestamp: incident.detectedAt || incident.createdAt,
      description: incident.description || incident.title
    }));
    
    // Format logs for frontend
    const formattedLogs = logs.map(log => ({
      id: log._id.toString(),
      timestamp: log.createdAt,
      service: log.service,
      message: log.message,
      level: log.level
    }));
    
    res.json({
      success: true,
      data: {
        services: formattedServices,
        incidents: formattedIncidents,
        logs: formattedLogs,
        overallStatus,
        operationalCount,
        totalServices: services.length
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health data',
      error: error.message
    });
  }
};

/**
 * Get services only
 */
exports.getServices = async (req, res) => {
  try {
    const services = await SystemService.getServices();
    
    const formatted = services.map(service => ({
      id: service._id.toString(),
      name: service.name,
      status: service.status,
      latency: service.latency || 0,
      uptime: service.uptime || 100,
      lastChecked: service.lastChecked || service.createdAt
    }));
    
    res.json({
      success: true,
      data: {
        services: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * Get incidents only
 */
exports.getIncidents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // optional filter
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const incidents = await Incident.find(query)
      .sort({ detectedAt: -1 })
      .limit(limit);
    
    const formatted = incidents.map(incident => ({
      id: incident._id.toString(),
      incidentId: incident.incidentId,
      service: incident.service,
      severity: incident.severity,
      status: incident.status,
      timestamp: incident.detectedAt || incident.createdAt,
      description: incident.description || incident.title
    }));
    
    res.json({
      success: true,
      data: {
        incidents: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: error.message
    });
  }
};

/**
 * Get system logs only
 */
exports.getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const level = req.query.level; // optional filter
    const service = req.query.service; // optional filter
    
    let filters = {};
    if (level) filters.level = level;
    if (service) filters.service = service;
    
    const logs = await SystemLog.getRecentLogs(limit, filters);
    
    const formatted = logs.map(log => ({
      id: log._id.toString(),
      timestamp: log.createdAt,
      service: log.service,
      message: log.message,
      level: log.level
    }));
    
    res.json({
      success: true,
      data: {
        logs: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system logs',
      error: error.message
    });
  }
};

/**
 * Update service health (for health check endpoints)
 */
exports.updateServiceHealth = async (req, res) => {
  try {
    const { serviceName } = req.params;
    const { latency, uptime, status } = req.body;
    
    const service = await SystemService.updateHealth(serviceName, {
      latency,
      uptime,
      status
    });
    
    res.json({
      success: true,
      message: 'Service health updated',
      data: {
        service: {
          id: service._id.toString(),
          name: service.name,
          status: service.status,
          latency: service.latency,
          uptime: service.uptime
        }
      }
    });
  } catch (error) {
    console.error('Error updating service health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service health',
      error: error.message
    });
  }
};
