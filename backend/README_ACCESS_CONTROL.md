# Admin Security Access Control – Backend & MongoDB Atlas

Production-ready backend and MongoDB Atlas for **Admin Security Access Control** at `/admin/security/access-control`.

**Seed data:** Access rules and IP rules with `source: 'seed'` are excluded from API responses by default. Use `?includeSeed=1` to include them (e.g. after running the seed). Role access configs are always returned.

---

## Collections (MongoDB Atlas)

### 1. `access_rules`

| Field          | Type     | Description |
|----------------|----------|-------------|
| `name`         | String   | Required, indexed |
| `type`         | String   | `ip_whitelist`, `ip_blacklist`, `role_based`, `time_based`, `geographic`, `device_fingerprint` |
| `description`  | String   | Required |
| `status`       | String   | `active`, `inactive`, `expired`; default `active` |
| `priority`     | Number   | Default 1 |
| `conditions`   | [String] | Optional |
| `affectedUsers`| Number   | Optional |
| `affectedIPs`  | [String] | Optional |
| `createdBy`    | String   | Set from JWT (email/id) on create |
| `lastModified` | Date     | Set on create/update |
| `updatedBy`    | String   | Set on update |
| `source`       | String   | `seed` = excluded by default |
| `metadata`     | Mixed    | Optional |
| `createdAt`    | Date     | Auto (timestamps) |
| `updatedAt`    | Date     | Auto (timestamps) |

### 2. `ip_access_rules`

| Field       | Type   | Description |
|-------------|--------|-------------|
| `ipAddress` | String | Required, valid IPv4 or CIDR (e.g. `10.0.0.0/24`) |
| `cidr`      | String | Optional, e.g. `/24` |
| `type`      | String | `allow` or `deny` |
| `reason`    | String | Required |
| `status`    | String | `active`, `inactive`, `expired`; default `active` |
| `expiresAt` | Date   | Optional |
| `createdBy` | String | Set from JWT on create |
| `location`  | String | Optional |
| `source`    | String | `seed` = excluded by default |
| `metadata`  | Mixed  | Optional |
| `createdAt` | Date   | Auto |
| `updatedAt` | Date   | Auto |

### 3. `role_access_config`

| Field         | Type     | Description |
|---------------|----------|-------------|
| `role`        | String   | Required, unique (e.g. `Admin`, `Corporate Admin`) |
| `permissions` | [String] | `read`, `write`, `delete`, `admin`, `export`, `approve` |
| `resources`   | [String] | Optional |
| `restrictions`| [String] | Optional |
| `source`      | String   | Optional; not used for filtering |
| `metadata`    | Mixed    | Optional |
| `createdAt`   | Date     | Auto |
| `updatedAt`   | Date     | Auto |

---

## Seed

```bash
cd backend
npm run seed:access-control
```

- **Access rules:** 6 sample policies (ip_whitelist, role_based, ip_blacklist, time_based, geographic, device_fingerprint).
- **IP rules:** 5 sample rules (allow/deny).
- **Role access:** 5 configs (Admin, Corporate Admin, NGO Admin, Verifier, Investor).

Safe to re-run (upsert by name / ip+type / role). Use `?includeSeed=1` on access-rules and ip-rules endpoints to see seed data.

---

## API (Admin only, JWT)

Base: **`/api/admin/security/access-control`**  
All routes require `Authorization: Bearer <token>` and admin role.

### Overview

| Method | Path        | Description |
|--------|-------------|-------------|
| GET    | `/overview` | `{ stats: { totalRules, activeRules, ipRules, blockedIPs, allowedIPs, roles }, recentActivity: [{ name, lastModified, status }] }` |

**Query:** `includeSeed` (0|1) for stats/recent (excludes seed by default).

---

### Access Rules (Policies)

| Method | Path               | Description |
|--------|--------------------|-------------|
| GET    | `/access-rules`    | List. Query: `search`, `status`, `type`, `includeSeed`, `page`, `limit` |
| GET    | `/access-rules/:id`| One by `_id` |
| POST   | `/access-rules`    | Create. Body: `name`, `type`, `description`, `status?`, `priority?`, `conditions?`, `affectedUsers?`, `affectedIPs?` |
| PUT    | `/access-rules/:id`| Update (partial). Same body fields. |
| DELETE | `/access-rules/:id`| Delete. |

**List response:** `{ success, data: { accessRules, pagination: { page, limit, total, totalPages } } }`

**One/Create/Update:** `{ success, data: <AccessRule> }`

**AccessRule shape:**  
`{ id, name, type, description, status, priority, createdAt, createdBy, lastModified, conditions, affectedUsers?, affectedIPs? }`

---

### IP Rules

| Method | Path            | Description |
|--------|-----------------|-------------|
| GET    | `/ip-rules`     | List. Query: `search`, `status`, `includeSeed`, `page`, `limit` |
| GET    | `/ip-rules/:id` | One by `_id` |
| POST   | `/ip-rules`     | Create. Body: `ipAddress`, `cidr?`, `type`, `reason`, `status?`, `expiresAt?`, `location?` |
| PUT    | `/ip-rules/:id` | Update (partial). Same body fields. |
| DELETE | `/ip-rules/:id` | Delete. |

**List response:** `{ success, data: { ipRules, pagination } }`

**One/Create/Update:** `{ success, data: <IPAccessRule> }`

**IPAccessRule shape:**  
`{ id, ipAddress, cidr?, type, reason, status, createdAt, expiresAt?, createdBy, location? }`

**Validation:** `ipAddress` must be valid IPv4 or CIDR (e.g. `192.168.1.1`, `10.0.0.0/24`). `cidr` if provided must be `/1`–`/32`. `type`: `allow` or `deny`.

---

### Role Access

| Method | Path                 | Description |
|--------|----------------------|-------------|
| GET    | `/role-access`       | List all. `{ success, data: { roleAccess } }` |
| GET    | `/role-access/:role` | One by role name (e.g. `Corporate%20Admin`). |
| PUT    | `/role-access/:role` | Upsert. Body: `permissions?`, `resources?`, `restrictions?` |

**RoleAccess shape:**  
`{ role, permissions, resources, restrictions }`

**Permissions:** `read`, `write`, `delete`, `admin`, `export`, `approve`.

---

## Checklist in MongoDB Atlas

- [ ] Collection **`access_rules`** with `name`, `type`, `description`, `status`, `priority`, `conditions`, `createdBy`, `lastModified`, `source`.
- [ ] Collection **`ip_access_rules`** with `ipAddress`, `type`, `reason`, `status`, `createdBy`, `source`.
- [ ] Collection **`role_access_config`** with `role`, `permissions`, `resources`, `restrictions`.
- [ ] After seed: 6 `access_rules`, 5 `ip_access_rules`, 5 `role_access_config` (with `source: 'seed'` where applicable).

---

## UI → API mapping (for future frontend integration)

| UI action            | Method | Endpoint |
|----------------------|--------|----------|
| Overview stats       | GET    | `/overview` |
| Recent activity      | GET    | `/overview` (same) |
| Access Rules list    | GET    | `/access-rules?search=&status=&type=` |
| View Access Rule     | GET    | `/access-rules/:id` |
| New Access Rule      | POST   | `/access-rules` |
| Edit Access Rule     | PUT    | `/access-rules/:id` |
| Delete Access Rule   | DELETE | `/access-rules/:id` |
| IP Rules list        | GET    | `/ip-rules?search=&status=` |
| Add IP Rule          | POST   | `/ip-rules` |
| Edit IP Rule         | PUT    | `/ip-rules/:id` |
| Delete IP Rule       | DELETE | `/ip-rules/:id` |
| Role Access list     | GET    | `/role-access` |
| Edit Role Access     | PUT    | `/role-access/:role` |
