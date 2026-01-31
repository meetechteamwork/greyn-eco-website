# System Settings Setup Guide

## Quick Start

### 1. Seed Initial Data

Before using the System Settings page, seed the database with default integrations:

```bash
cd backend
npm run seed:system
```

This will:
- ✅ Initialize system settings with default values (stored in MongoDB)
- ✅ Create 5 default integrations (Email, Payment, Analytics, Storage, Monitoring)

### 2. Verify Setup

After seeding:
1. Start your backend server: `npm start` or `npm run dev`
2. Login as admin in the frontend
3. Navigate to `/admin/system-settings`
4. You should see all settings loaded from MongoDB

## Database Collections

The system uses three MongoDB collections:

1. **systemsettings** - Single document with all platform settings
2. **integrations** - Third-party service integrations
3. **backups** - System backup records

## Production Checklist

- [x] All data stored in MongoDB (no hardcoded values)
- [x] Frontend fetches from backend API
- [x] Settings persist across sessions
- [x] Error handling for empty/missing data
- [x] Admin authentication required
- [ ] Add input validation middleware
- [ ] Encrypt sensitive integration configs
- [ ] Implement actual backup process (currently simulated)
- [ ] Add audit logging for settings changes
- [ ] Add rate limiting for API endpoints

## API Endpoints

All endpoints require admin JWT token in Authorization header.

### Settings
- `GET /api/admin/system-settings` - Get all data
- `PUT /api/admin/system-settings/:section` - Update section (general/performance/maintenance)

### Integrations
- `GET /api/admin/system-settings/integrations` - List integrations
- `PUT /api/admin/system-settings/integrations/:id` - Update integration status

### Backups
- `GET /api/admin/system-settings/backups` - List backups
- `POST /api/admin/system-settings/backups` - Create backup

## Troubleshooting

**Issue**: Settings page shows "Loading..." forever
- **Solution**: Check backend is running and MongoDB connection is active

**Issue**: "No integrations configured" message
- **Solution**: Run `npm run seed:system` to create default integrations

**Issue**: Settings not saving
- **Solution**: Check admin JWT token is valid and included in request headers
