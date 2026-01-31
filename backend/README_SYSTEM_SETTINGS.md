# System Settings Setup Guide

## Initial Setup

### 1. Seed Default Data

Before using the System Settings page, you need to seed the database with default integrations:

```bash
cd backend
npm run seed:system
```

This will:
- Initialize system settings with default values
- Create default integrations (Email, Payment, Analytics, Storage, Monitoring)

### 2. Verify Setup

After seeding, you can verify the data was created by checking MongoDB or accessing the System Settings page in the admin panel.

## API Endpoints

All endpoints require admin authentication (Bearer token).

### Settings
- `GET /api/admin/system-settings` - Get all settings (general, performance, maintenance, integrations, backups)
- `GET /api/admin/system-settings/settings` - Get only settings (no integrations/backups)
- `PUT /api/admin/system-settings/:section` - Update settings by section (general, performance, maintenance)

### Integrations
- `GET /api/admin/system-settings/integrations` - List all integrations
- `PUT /api/admin/system-settings/integrations/:id` - Update integration status

### Backups
- `GET /api/admin/system-settings/backups` - List recent backups
- `POST /api/admin/system-settings/backups` - Create a new backup

## Production Notes

1. **Backup Process**: The current backup creation is simulated. In production, implement actual backup logic that:
   - Exports database
   - Archives files
   - Stores in cloud storage (S3, etc.)
   - Updates status based on actual completion

2. **Integration Configuration**: Integration configs are stored in MongoDB. In production, consider:
   - Encrypting sensitive configuration data
   - Using environment variables for API keys
   - Implementing proper OAuth flows for third-party services

3. **Settings Validation**: Add validation middleware for settings updates to ensure:
   - Valid timezone values
   - Valid date/time formats
   - Numeric ranges for performance settings
   - Proper enum values

4. **Error Handling**: All endpoints include error handling, but consider:
   - Adding retry logic for database operations
   - Implementing rate limiting
   - Adding audit logging for settings changes
