const SystemSettings = require('../models/SystemSettings');
const Integration = require('../models/Integration');
const Backup = require('../models/Backup');

/**
 * Get all system settings
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    res.json({
      success: true,
      data: {
        general: settings.general,
        performance: settings.performance,
        maintenance: settings.maintenance
      }
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error: error.message
    });
  }
};

/**
 * Update system settings by section
 */
exports.updateSettings = async (req, res) => {
  try {
    const { section } = req.params; // general, performance, or maintenance
    const data = req.body;

    // Validate section
    if (!['general', 'performance', 'maintenance'].includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be: general, performance, or maintenance'
      });
    }

    // Validate data before saving
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided'
      });
    }

    const updatedSettings = await SystemSettings.updateSettings(section, data);
    
    res.json({
      success: true,
      message: `${section} settings updated successfully`,
      data: {
        [section]: updatedSettings[section]
      }
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error: error.message
    });
  }
};

/**
 * Get all integrations
 */
exports.getIntegrations = async (req, res) => {
  try {
    let integrations = await Integration.find().sort({ displayOrder: 1, createdAt: 1 });
    
    // If no integrations exist, return empty array (frontend can handle this)
    // In production, you'd run the seed script first
    if (integrations.length === 0) {
      return res.json({
        success: true,
        data: {
          integrations: []
        }
      });
    }
    
    // Format for frontend
    const formatted = integrations.map(int => ({
      id: int._id.toString(),
      name: int.name,
      status: int.status,
      type: int.type,
      description: int.description,
      icon: int.icon,
      connectedAt: int.connectedAt,
      lastChecked: int.lastChecked,
      isHealthy: int.isHealthy
    }));
    
    res.json({
      success: true,
      data: {
        integrations: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch integrations',
      error: error.message
    });
  }
};

/**
 * Update integration status
 */
exports.updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, config } = req.body;

    const integration = await Integration.findById(id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found'
      });
    }

    // Update status
    if (status) {
      integration.status = status;
      if (status === 'connected') {
        integration.connectedAt = new Date();
        integration.isHealthy = true;
      } else if (status === 'disconnected') {
        integration.disconnectedAt = new Date();
      }
    }

    // Update config (if provided)
    if (config) {
      integration.config = { ...integration.config.toObject(), ...config };
    }

    integration.lastChecked = new Date();
    await integration.save();

    res.json({
      success: true,
      message: 'Integration updated successfully',
      data: {
        integration: {
          id: integration._id.toString(),
          name: integration.name,
          status: integration.status,
          type: integration.type
        }
      }
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update integration',
      error: error.message
    });
  }
};

/**
 * Get all backups
 */
exports.getBackups = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const backups = await Backup.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('createdBy', 'name email');
    
    // Format for frontend
    const formatted = backups.map(backup => ({
      id: backup._id.toString(),
      name: backup.name,
      size: backup.formattedSize || backup.size.display || '0 bytes',
      date: backup.completedAt || backup.createdAt,
      status: backup.status,
      type: backup.type,
      description: backup.description
    }));
    
    res.json({
      success: true,
      data: {
        backups: formatted
      }
    });
  } catch (error) {
    console.error('Error fetching backups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch backups',
      error: error.message
    });
  }
};

/**
 * Helper function to create backup record
 */
async function createBackupRecord(name, type, description, res) {
  try {
    // Create backup record
    const backup = await Backup.create({
      name,
      type,
      status: 'in_progress',
      description,
      includes: {
        database: type === 'full' || type === 'database',
        files: type === 'full' || type === 'files',
        configurations: type === 'full' || type === 'configuration'
      },
      startedAt: new Date()
    });
    
    // In production, you would trigger actual backup process here
    // For now, we'll simulate it by updating status after a delay
    // In real production, this would be handled by a background job/queue
    setTimeout(async () => {
      try {
        // Calculate actual backup size (in production, this would come from backup process)
        const estimatedSize = Math.floor(Math.random() * 3000000000) + 1000000000; // 1-3 GB
        const sizeInGB = (estimatedSize / (1024 * 1024 * 1024)).toFixed(1);
        
        await Backup.findByIdAndUpdate(backup._id, {
          status: 'completed',
          completedAt: new Date(),
          size: {
            value: estimatedSize,
            unit: 'bytes',
            display: `${sizeInGB} GB`
          }
        });
      } catch (error) {
        console.error('Error updating backup status:', error);
        // Update to failed status
        try {
          await Backup.findByIdAndUpdate(backup._id, {
            status: 'failed'
          });
        } catch (updateError) {
          console.error('Error updating backup to failed status:', updateError);
        }
      }
    }, 5000);
    
    res.json({
      success: true,
      message: 'Backup initiated successfully',
      data: {
        backup: {
          id: backup._id.toString(),
          name: backup.name,
          status: backup.status,
          type: backup.type
        }
      }
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new backup
 */
exports.createBackup = async (req, res) => {
  try {
    const { type = 'full', description } = req.body;
    
    // Generate backup name with timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '-');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupName = `Backup_${dateStr}_${timeStr}`;
    
    // Check if backup name already exists (unlikely but possible)
    const existing = await Backup.findOne({ name: backupName });
    if (existing) {
      // Append milliseconds if duplicate
      const backupNameWithMs = `${backupName}_${now.getMilliseconds()}`;
      return await createBackupRecord(backupNameWithMs, type, description, res);
    }
    
    return await createBackupRecord(backupName, type, description, res);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
};

/**
 * Get complete system settings data (all sections + integrations + backups)
 */
exports.getAllSettings = async (req, res) => {
  try {
    // Fetch all data in parallel with error handling
    let settings, integrations, backups;
    
    try {
      settings = await SystemSettings.getSettings();
      // If settings exist but sections are empty, ensure structure exists
      if (!settings.general) settings.general = {};
      if (!settings.performance) settings.performance = {};
      if (!settings.maintenance) settings.maintenance = {};
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return empty structure - frontend will show loading/empty states
      settings = {
        general: {},
        performance: {},
        maintenance: {}
      };
    }
    
    try {
      integrations = await Integration.find().sort({ displayOrder: 1, createdAt: 1 });
    } catch (error) {
      console.error('Error fetching integrations:', error);
      integrations = [];
    }
    
    try {
      backups = await Backup.find().sort({ createdAt: -1 }).limit(10);
    } catch (error) {
      console.error('Error fetching backups:', error);
      backups = [];
    }
    
    res.json({
      success: true,
      data: {
        general: settings.general || {},
        performance: settings.performance || {},
        maintenance: settings.maintenance || {},
        integrations: integrations.map(int => ({
          id: int._id.toString(),
          name: int.name,
          status: int.status,
          type: int.type,
          description: int.description,
          icon: int.icon
        })),
        backups: backups.map(backup => ({
          id: backup._id.toString(),
          name: backup.name,
          size: backup.formattedSize || backup.size?.display || '0 bytes',
          date: backup.completedAt || backup.createdAt,
          status: backup.status,
          type: backup.type
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching all system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error: error.message
    });
  }
};
