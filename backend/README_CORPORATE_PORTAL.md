# Admin Corporate Portal – Backend & MongoDB

Backend and MongoDB Atlas integration for the **Admin Corporate Portal** at `/admin/portals/corporate`.

**Only real data is shown:** Records with `source: 'seed'` are excluded from all API responses. The seed script marks sample data so it is hidden on the portal.

## MongoDB Atlas

Uses the same `MONGODB_URI` from `backend/.env` (see main README or `MONGODB_SETUP.md`).

### Collections

| Collection | Model | Purpose |
|------------|-------|---------|
| `corporates` | Corporate (User.js) | Corporate entities; extended with `employees`, `campaigns` |
| `corporate_portal_activities` | CorporatePortalActivity | ESG activities: campaign_created, emission_reported, volunteer_event, report_generated |
| `corporate_portal_health` | CorporatePortalHealth | Single-doc portal health: status, uptime, responseTime, activeSessions |

## Seed

```bash
cd backend
npm run seed:corporate-portal
```

Creates 5 sample corporates, 8 activities, and 1 health document. Safe to re-run (skips existing by email/taxId).

## API (Admin only, JWT)

Base: ` /api/admin/portals/corporate`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Full dashboard: stats, entities, activities, health |
| GET | `/entities` | List entities (`?status=active|pending|suspended`, `?search=`) |
| GET | `/activities` | Recent activities (`?limit=50`) |
| GET | `/stats` | Aggregated stats |
| GET | `/health` | Portal health |
| PATCH | `/entities/:id/status` | Update status; body: `{ "action": "disable" \| "approve" \| "review" }` |

- **disable** → status `suspended`
- **approve** → status `active`
- **review** → status `pending`

## Frontend

- `api.admin.portals.corporate.getDashboard()` – load dashboard
- `api.admin.portals.corporate.updateEntityStatus(id, 'disable'|'approve'|'review')` – change entity status
