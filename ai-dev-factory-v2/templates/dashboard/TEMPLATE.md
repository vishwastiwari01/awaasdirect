# 📊 Dashboard / Admin Panel Template

Use this for: analytics dashboards, admin panels, internal tools, data visualization apps, monitoring systems.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| Charts | Recharts OR Chart.js |
| Tables | TanStack Table v8 |
| Date | date-fns |
| State | Zustand |
| Backend | Next.js API routes OR Express |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js (role-based) |
| Deploy | Vercel |

---

## 📁 Folder Structure

```
dashboard/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx            ← Sidebar + header layout
│   │   ├── page.tsx              ← Main overview
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx          ← Users table
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← User detail
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── analytics/
│       ├── users/
│       └── reports/
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── StatCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── QuickActions.tsx
│   │
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   └── AreaChart.tsx
│   │
│   └── tables/
│       ├── DataTable.tsx         ← Reusable TanStack table
│       ├── TableFilters.tsx
│       ├── TablePagination.tsx
│       └── ColumnHeader.tsx
```

---

## 📊 Dashboard Overview Page

### Stats Row (top)
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total Users  │ │  Revenue    │ │  Orders     │ │ Conversion  │
│    12,430   │ │  $48,290   │ │    1,204    │ │    3.2%     │
│  ↑ 12% MTM │ │ ↑ 8% MTM  │ │ ↓ 2% MTM  │ │ ↑ 0.5%    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Charts Row (middle)
- Left (60%): Revenue over time — line chart with date range filter
- Right (40%): Traffic sources — donut chart

### Bottom Row
- Left: Recent orders table (last 10)
- Right: Activity feed (latest events)

---

## 📋 Data Table Component Features

```typescript
// Every data table should support:
- Column sorting (click header)
- Global search filter
- Per-column filters
- Pagination (10/25/50/100 per page)
- Row selection (checkboxes)
- Bulk actions (delete, export selected)
- Export to CSV
- Column visibility toggle
- Responsive (horizontal scroll on mobile)
```

---

## 🔐 Role-Based Access Control

```typescript
// Three roles minimum:
type Role = 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'

// Permissions matrix:
const permissions = {
  SUPER_ADMIN: ['read', 'write', 'delete', 'manage_users', 'manage_billing'],
  ADMIN:       ['read', 'write', 'delete'],
  VIEWER:      ['read'],
}

// Protect pages:
// - SUPER_ADMIN only: /settings/team, /settings/billing
// - ADMIN+: /users, /reports, write actions
// - All roles: /dashboard, /analytics (read-only)
```

---

## 📈 Chart Configs (Recharts)

```typescript
// Revenue Line Chart
{
  dataKey: "revenue",
  stroke: "#6366F1",
  strokeWidth: 2,
  dot: false,
  activeDot: { r: 4 }
}

// Color palette for charts:
const CHART_COLORS = [
  '#6366F1', // Indigo (primary)
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
]
```

---

## 🔌 API Endpoints

```
GET  /api/analytics/overview        ← Stats for dashboard
GET  /api/analytics/revenue?range=  ← Revenue chart data (7d/30d/90d/1y)
GET  /api/analytics/traffic         ← Traffic sources

GET  /api/users?page=&limit=&search=
GET  /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id
POST /api/users/:id/ban

GET  /api/reports
POST /api/reports/export?format=csv
```

---

## 🌍 Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/dashboard/TEMPLATE.md` as the base. Build an admin dashboard for [your app/business]."
