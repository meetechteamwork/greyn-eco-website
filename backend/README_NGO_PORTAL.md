# Admin NGO Portal – Backend & MongoDB Atlas

Production-ready backend and MongoDB Atlas for the **Admin NGO Portal** at `/admin/portals/ngo`.

**Only real data is shown:** Records with `source: 'seed'` are excluded from all API responses.

---

## What’s new in the database (verify in MongoDB Atlas)

After running `npm run seed:ngo-portal` (or once real data exists), check the following in **MongoDB Atlas → your database**:

---

### 1. New collection: `ngo_portal_activities`

**Purpose:** One document per NGO activity (project launch, funding, milestone, update).

| Field        | Type        | Description |
|-------------|-------------|-------------|
| `type`      | String      | One of: `project_launched`, `funding_received`, `milestone_completed`, `update_posted` |
| `ngo`       | ObjectId    | Reference to `ngos._id` (optional) |
| `entityName`| String      | NGO/organization name |
| `description` | String    | Activity description |
| `metadata`  | Mixed       | Optional extra data |
| `source`    | String      | `'seed'` for seed data (excluded by API) |
| `createdAt` | Date        | Auto-set |
| `updatedAt` | Date        | Auto-set (timestamps: true) |

**How to verify:**  
Atlas → Database → Browse Collections → `ngo_portal_activities`. You should see documents with `type`, `entityName`, `description`, and `source` (seed docs will have `source: "seed"`).

---

### 2. New collection: `ngo_portal_health`

**Purpose:** Single (or very few) document(s) for NGO portal health (status, uptime, sessions).

| Field           | Type   | Description |
|-----------------|--------|-------------|
| `status`        | String | `operational`, `degraded`, `partial_outage`, `major_outage` |
| `uptime`        | Number | Uptime % (0–100) |
| `responseTime`  | Number | Avg response time (ms) |
| `activeSessions`| Number | Current active sessions |
| `maxSessions`   | Number | Capacity (for progress bar) |
| `lastChecked`   | Date   | Last health check |
| `message`       | String | Optional status message |
| `source`        | String | `'seed'` for seed (excluded by API) |
| `updatedAt`     | Date   | Auto-set |

**How to verify:**  
Atlas → `ngo_portal_health`. After seeding, one document with `status: "operational"`, `uptime: 99.7`, `responseTime: 145`, `activeSessions: 567`, `maxSessions: 1000`, `source: "seed"`.

---

### 3. Extended collection: `ngos`

**New fields** (existing fields like `organizationName`, `email`, `status`, etc. stay as-is):

| Field         | Type   | Default | Description |
|---------------|--------|---------|-------------|
| `projects`    | Number | 0       | Number of projects |
| `totalFunding`| Number | 0       | Total funding amount |
| `location`    | String | `''`    | e.g. `"San Francisco, CA"` |
| `source`      | String | —       | `'seed'` for seed data (excluded by API) |

**How to verify:**  
Atlas → `ngos` → open a document. After seed, some docs will have `projects`, `totalFunding`, `location`, and `source: "seed"`.

---

### Quick checklist in Atlas

- [ ] Database contains collection **`ngo_portal_activities`** with docs having `type`, `entityName`, `description`, `source`, `createdAt`.
- [ ] Database contains collection **`ngo_portal_health`** with at least one doc: `status`, `uptime`, `responseTime`, `activeSessions`, `maxSessions`, `source`.
- [ ] Collection **`ngos`** has documents with **`projects`**, **`totalFunding`**, **`location`**, and optionally **`source`**.

---

## Seed

```bash
cd backend
npm run seed:ngo-portal
```

- Marks existing seed data with `source: 'seed'` (filtered out by API).
- Creates 5 sample NGOs, 8 activities, 1 health document. Safe to re-run.

---

## API (Admin only, JWT)

Base: **`/api/admin/portals/ngo`**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Full dashboard: `{ stats, entities, activities, health }` |
| GET | `/entities` | List NGOs. Query: `?status=active\|pending\|suspended` `&search=` |
| GET | `/activities` | Recent activities. Query: `?limit=50` |
| GET | `/stats` | `{ total, active, pending, suspended, totalProjects, totalFunding }` |
| GET | `/health` | `{ status, uptime, responseTime, activeSessions, maxSessions, lastChecked, message }` or `null` |
| PATCH | `/entities/:id/status` | Body: `{ "action": "disable" \| "approve" \| "review" }` |

- **disable** → `suspended`
- **approve** → `active`
- **review** → `pending`

---

## Response shapes (for later frontend integration)

**Entity:**  
`{ id, name, email, status, projects, totalFunding, lastActive, joinedDate, location }`

**Activity:**  
`{ id, type, entity, description, timestamp }`

**Stats:**  
`{ total, active, pending, suspended, totalProjects, totalFunding }`

**Health:**  
`{ status, uptime, responseTime, activeSessions, maxSessions, lastChecked, message }` or `null`
