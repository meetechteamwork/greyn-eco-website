# Admin Security Audit Logs – Backend & MongoDB Atlas

Production-ready backend and MongoDB Atlas for **Admin Security Audit Logs** at `/admin/security/audit-logs`.

**Seed data:** Records with `source: 'seed'` are excluded from API responses by default. Use `?includeSeed=1` to include them (e.g. after running the seed).

---

## Collection: `audit_logs`

| Field       | Type   | Required | Description |
|------------|--------|----------|-------------|
| `timestamp`| Date   | ✓        | Event time |
| `actor`    | String | ✓        | Who performed the action (e.g. email, system id) |
| `actorRole`| String |          | Role of the actor |
| `action`   | String | ✓        | One of: `login`, `logout`, `create`, `update`, `delete`, `access`, `permission_change`, `security_event`, `data_export`, `password_change`, `role_change`, `suspension` |
| `resource` | String | ✓        | Affected resource |
| `details`  | String | ✓        | Human-readable description |
| `severity` | String | ✓        | `low`, `medium`, `high`, `critical` |
| `status`   | String | ✓        | `success`, `failed`, `warning` |
| `ipAddress`| String | ✓        | Client IP |
| `userAgent`| String | ✓        | Default `''` |
| `location` | String |          | Optional |
| `hash`     | String |          | Integrity hash (`0x` + SHA-256 hex). Used by verify. |
| `sessionId`| String |          | Optional |
| `source`   | String |          | `seed` = excluded by default |
| `metadata` | Mixed  |          | Optional |
| `createdAt`| Date   |          | Auto (timestamps) |
| `updatedAt`| Date   |          | Auto (timestamps) |

**Indexes:** `timestamp`, `actor`, `action`, `resource`, `severity`, `status`, `ipAddress`, `source`.

---

## Integrity hash

The `hash` is computed as:

```
SHA-256( timestamp|actor|action|resource|details|severity|status|ipAddress|userAgent|sessionId )
```

stored as `0x` + 64 hex chars. The **Verify** endpoint recomputes this and compares to the stored value.

---

## Seed

```bash
cd backend
npm run seed:audit-logs
```

- Deletes existing docs with `source: 'seed'`.
- Inserts 15 sample audit logs with computed integrity hashes.
- Use `?includeSeed=1` on list/export/verify to include seed data.

---

## API (Admin only, JWT)

Base: **`/api/admin/security/audit-logs`**

All routes require `Authorization: Bearer <token>` and admin role.

### List (filters, pagination, stats)

| Method | Path   | Description |
|--------|--------|-------------|
| GET    | `/`    | List + stats + pagination |

**Query:** `search`, `severity` (all|low|medium|high|critical), `action` (all|login|logout|create|update|delete|access|permission_change|security_event|data_export|password_change|role_change|suspension), `status` (all|success|failed|warning), `dateRange` (all|today|week|month|year), `page` (default 1), `limit` (default 15, max 100), `includeSeed` (0|1).

**Search:** `actor`, `resource`, `details`, `ipAddress`, `hash` (case-insensitive).

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [ { "id", "timestamp", "actor", "actorRole", "action", "resource", "details", "severity", "status", "ipAddress", "userAgent", "location", "hash", "sessionId" } ],
    "stats": { "total", "critical", "high", "medium", "low", "failed", "success", "warning" },
    "pagination": { "page", "limit", "total", "totalPages" }
  }
}
```

---

### Single log

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | `/:id`   | One by `_id` |

**Response:** `{ success, data: <AuditLog> }`

---

### Export (Export button)

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | `/export`| Export filtered as CSV or JSON |

**Query:** Same as list, plus `format` (csv|json, default json).

- **JSON:** `{ success, data: { logs } }`
- **CSV:** `Content-Disposition: attachment; filename="audit-logs-YYYY-MM-DD.csv"`

---

### Export one (Export Entry in details modal)

| Method | Path         | Description |
|--------|--------------|-------------|
| GET    | `/:id/export`| Single log as JSON |

**Response:** `{ success, data: <AuditLog> }`

---

### Verify integrity (Verify Hash)

| Method | Path          | Description |
|--------|---------------|-------------|
| GET    | `/:id/verify` | Verify hash; returns `{ valid, message }` |

**Response:** `{ success, data: { valid: boolean, message?: string } }`

- `valid: true` → recomputed hash matches stored.
- `valid: false` → mismatch or no hash stored.

---

## Log shape (for frontend)

```json
{
  "id": "<_id>",
  "timestamp": "2024-03-25T14:30:00.000Z",
  "actor": "admin@greyn-eco.com",
  "actorRole": "Admin",
  "action": "permission_change",
  "resource": "User: sarah.johnson@example.com",
  "details": "Changed role from Simple User to Corporate Admin",
  "severity": "high",
  "status": "success",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "location": "New York, USA",
  "hash": "0x...",
  "sessionId": "sess_abc123xyz"
}
```

---

## UI → API mapping

| UI action        | Method | Endpoint                        |
|------------------|--------|----------------------------------|
| List + filters   | GET    | `/` + search, severity, action, status, dateRange, page, limit |
| View details     | GET    | `/:id`                          |
| Export (header)  | GET    | `/export?format=csv` or `format=json` + filters |
| Export entry     | GET    | `/:id/export`                   |
| Verify integrity | GET    | `/:id/verify`                   |

---

## Checklist in MongoDB Atlas

- [ ] Collection **`audit_logs`** exists.
- [ ] Documents have `timestamp`, `actor`, `action`, `resource`, `details`, `severity`, `status`, `ipAddress`, `userAgent`.
- [ ] Optional: `actorRole`, `location`, `hash`, `sessionId`, `source`.
- [ ] After seed: 15 documents with `source: 'seed'` and valid `hash`.
