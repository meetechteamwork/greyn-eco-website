const mongoose = require('mongoose');

/**
 * Backup Model
 * Tracks system backups and restore operations
 */
const backupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  
  // Backup type
  type: {
    type: String,
    enum: ['full', 'database', 'files', 'configuration'],
    default: 'full'
  },
  
  // Status
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'failed', 'cancelled'],
    default: 'in_progress'
  },
  
  // Size information
  size: {
    value: {
      type: Number, // in bytes
      default: 0
    },
    unit: {
      type: String,
      default: 'bytes'
    },
    display: {
      type: String // e.g., "2.4 GB"
    }
  },
  
  // Location
  storageLocation: {
    type: String,
    enum: ['local', 's3', 'gcs', 'azure'],
    default: 'local'
  },
  filePath: {
    type: String
  },
  
  // Backup metadata
  includes: {
    database: {
      type: Boolean,
      default: true
    },
    files: {
      type: Boolean,
      default: true
    },
    configurations: {
      type: Boolean,
      default: true
    }
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date // For automatic cleanup
  },
  
  // Metadata
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  // Checksum for integrity
  checksum: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
backupSchema.index({ status: 1, createdAt: -1 });
backupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // For TTL

// Virtual for formatted size
backupSchema.virtual('formattedSize').get(function() {
  if (this.size && this.size.display) {
    return this.size.display;
  }
  
  const bytes = (this.size && this.size.value) || 0;
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  } else if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  } else if (kb >= 1) {
    return `${kb.toFixed(1)} KB`;
  }
  return `${bytes} bytes`;
});

// Ensure virtuals are included in JSON
backupSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Backup', backupSchema);
