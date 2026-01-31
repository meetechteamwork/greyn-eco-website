# Admin Finance Transactions – Backend & MongoDB Atlas

Production-ready backend and MongoDB for the **Admin Finance Transactions** page at `/admin/finance/transactions`.

**Seed data:** Records with `source: 'seed'` are excluded from API responses by default. Use `?includeSeed=1` to include them (e.g. for development/demo after running the seed).

---

## What’s in the database (verify in MongoDB Atlas)

### Collection: `finance_transactions`

| Field           | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `transactionId`| String | ✓ unique | e.g. `TXN-2024-001` |
| `timestamp`    | Date   | ✓        | Transaction time |
| `type`         | String | ✓        | `purchase`, `sale`, `refund`, `fee`, `commission`, `withdrawal`, `deposit` |
| `amount`       | Number | ✓        | Can be negative |
| `currency`     | String |          | Default `USD` |
| `entity`       | String | ✓        | Counterparty / description |
| `description`  | String | ✓        | |
| `status`       | String | ✓        | `completed`, `pending`, `failed`, `refunded`, `processing` |
| `reference`    | String | ✓        | External reference |
| `paymentMethod`| String |          | `credit_card`, `bank_transfer`, `crypto`, `wallet`, `other` |
| `fees`         | Number |          | Default 0 |
| `netAmount`    | Number |          | Amount after fees |
| `invoiceId`    | String |          | Link to invoice |
| `source`       | String |          | `seed` = excluded by default |
| `metadata`     | Mixed  |          | Optional |
| `createdAt`    | Date   |          | Auto |
| `updatedAt`    | Date   |          | Auto |

**Indexes:** `transactionId`, `timestamp`, `status`, `type`, `entity`, `reference`, `source`.

---

## Seed

```bash
cd backend
npm run seed:finance-transactions
```

- Inserts/updates 12 sample transactions with `source: 'seed'`.
- To see them in the API, call with `?includeSeed=1`.

---

## API (Admin only, JWT)

Base: **`/api/admin/finance/transactions`**

### List (filters, pagination, stats)

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | `/`      | List + stats + pagination |

**Query:** `search`, `status` (all|completed|pending|processing|failed|refunded), `type` (all|purchase|sale|deposit|withdrawal|refund|fee|commission), `dateRange` (all|today|week|month|year), `page` (default 1), `limit` (default 10), `includeSeed` (0|1).

**Response:**  
`{ success, data: { transactions: [...], stats: { total, completed, pending, failed, totalRevenue, totalExpenses, totalFees, netAmount, pendingAmount }, pagination: { page, limit, total, totalPages } } }`

---

### Export (Export button)

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | `/export`| Export filtered as CSV or JSON |

**Query:** Same as list, plus `format` (csv|json, default json).

- **JSON:** `{ success, data: { transactions } }`
- **CSV:** `Content-Disposition: attachment; filename="transactions-YYYY-MM-DD.csv"`

---

### Analytics (Analytics button)

| Method | Path        | Description |
|--------|-------------|-------------|
| GET    | `/analytics`| Aggregated analytics |

**Query:** `dateRange`, `groupBy` (day|week|month), `includeSeed`.

**Response:**  
`{ success, data: { summary: { totalRevenue, totalExpenses, netAmount, count }, byType, byStatus, timeSeries: [{ period, count, revenue, expenses }] } }`

---

### Single transaction (View Details)

| Method | Path   | Description |
|--------|--------|-------------|
| GET    | `/:id` | One by `transactionId` or `_id` |

**Response:** `{ success, data: <transaction> }`

---

### Receipt (Download Receipt button)

| Method | Path        | Description |
|--------|-------------|-------------|
| GET    | `/:id/receipt` | Receipt payload for the transaction |

**Response:** `{ success, data: { receipt: { transactionId, reference, date, type, entity, description, amount, currency, fees, netAmount, status, paymentMethod } } }`

---

### Invoice (View Invoice button, when `invoiceId` exists)

| Method | Path         | Description |
|--------|--------------|-------------|
| GET    | `/:id/invoice` | Invoice payload; 404 if no `invoiceId` |

**Response:** `{ success, data: { invoice: { invoiceId, transactionId, reference, date, entity, description, amount, currency, fees, netAmount, status } } }`

---

## Transaction response shape (for frontend)

```json
{
  "id": "TXN-2024-001",
  "transactionId": "TXN-2024-001",
  "timestamp": "2024-03-25T14:30:00.000Z",
  "type": "purchase",
  "amount": 12500,
  "currency": "USD",
  "entity": "TechCorp Industries",
  "description": "Carbon credit purchase - 500 credits @ $25/tonne",
  "status": "completed",
  "reference": "REF-789456",
  "paymentMethod": "credit_card",
  "fees": 375,
  "netAmount": 12125,
  "invoiceId": "INV-2024-001"
}
```

---

## Button → endpoint mapping (for later frontend integration)

| UI button         | HTTP | Endpoint | Notes |
|-------------------|------|----------|-------|
| Export            | GET  | `/export?format=csv` or `format=json` + same filters as list | CSV triggers file download |
| Analytics         | GET  | `/analytics` + dateRange, groupBy | Use for analytics view or modal |
| View Details      | GET  | `/:id`   | `id` = `transactionId` or `_id` |
| Download Receipt  | GET  | `/:id/receipt` | |
| View Invoice      | GET  | `/:id/invoice` | 404 when no `invoiceId` |

---

## Checklist in MongoDB Atlas

- [ ] Collection **`finance_transactions`** exists.
- [ ] Documents have `transactionId`, `timestamp`, `type`, `amount`, `entity`, `description`, `status`, `reference`.
- [ ] Optional: `paymentMethod`, `fees`, `netAmount`, `invoiceId`, `source`.
- [ ] After seed: 12 documents with `source: "seed"`.
