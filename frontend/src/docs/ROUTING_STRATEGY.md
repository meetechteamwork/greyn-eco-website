# Multi-Portal Role-Aware Routing Strategy

## Overview

This document describes the production-ready routing strategy for the multi-portal Next.js application with 4 portals: Admin, NGO, Corporate, and Investor (simple-user).

## Problem Statement

Previously, shared navbar links (Home, Projects, Products) routed all roles to the same Investor portal pages, causing:
- Cross-portal access issues
- Inconsistent user experience
- Difficulty maintaining role-specific features
- Security concerns

## Solution Architecture

### 1. Single Source of Truth: `user.role`

All routing decisions are based on `user.role` from the `AuthContext`. This ensures:
- Consistency across the application
- Single point of control for role management
- Easy debugging and maintenance

### 2. Role Namespace Mapping

Each role has a dedicated route namespace:

```typescript
const ROLE_ROUTE_NAMESPACES = {
  'admin': '/admin',
  'ngo': '/ngo',
  'corporate': '/corporate',
  'carbon': '/carbon',
  'simple-user': '/investor', // Investor namespace
};
```

### 3. Route Configuration

Routes are defined in a centralized configuration (`frontend/src/utils/routing.ts`):

```typescript
const ROUTE_MAP = {
  home: {
    'admin': '/admin/overview',
    'ngo': '/ngo/dashboard',
    'corporate': '/corporate/dashboard',
    'carbon': '/carbon/marketplace',
    'simple-user': '/home',
  },
  projects: {
    'admin': '/admin/projects',
    'ngo': '/ngo/launch',
    'corporate': '/projects',
    'carbon': '/carbon/projects',
    'simple-user': '/projects',
  },
  // ... more routes
};
```

## Implementation

### Core Utilities (`frontend/src/utils/routing.ts`)

1. **`getRoleRoute(routeKey, role)`**: Returns role-specific route for a given key
2. **`getRoleNamespace(role)`**: Returns the namespace prefix for a role
3. **`canAccessRoute(pathname, role)`**: Validates if a route is accessible by a role
4. **`getNavLinksForRole(role)`**: Returns navigation links for a role

### React Hook (`frontend/src/hooks/useRoleRouting.ts`)

Provides easy access to routing utilities in components:

```typescript
const { routes, namespace, navLinks, checkAccess, role } = useRoleRouting();
```

### Usage in Components

**Before (Problematic):**
```typescript
const baseNavLinks = [
  { label: 'Home', href: '/home' }, // Always routes to investor
  { label: 'Projects', href: '/projects' }, // Always routes to investor
];
```

**After (Role-Aware):**
```typescript
const { navLinks } = useRoleRouting();
// Automatically gets role-specific routes
// Admin → /admin/overview, /admin/projects
// NGO → /ngo/dashboard, /ngo/launch
// Corporate → /corporate/dashboard, /projects
```

## Route Resolution Examples

### Admin User
- **Home** → `/admin/overview`
- **Projects** → `/admin/projects`
- **Products** → `/admin/overview` (fallback)
- **Dashboard** → `/admin/overview`

### NGO User
- **Home** → `/ngo/dashboard`
- **Projects** → `/ngo/launch`
- **Products** → `/products` (shared)
- **Dashboard** → `/ngo/dashboard`

### Corporate User
- **Home** → `/corporate/dashboard`
- **Projects** → `/projects` (shared)
- **Products** → `/products` (shared)
- **Dashboard** → `/corporate/dashboard`

### Investor (Simple User)
- **Home** → `/home`
- **Projects** → `/projects`
- **Products** → `/products`
- **Dashboard** → `/dashboard`

## Security & Access Control

### Cross-Portal Prevention

The `canAccessRoute()` function prevents cross-portal access:

```typescript
// ✅ Allowed: User's own namespace
canAccessRoute('/ngo/dashboard', 'ngo') // true

// ✅ Allowed: Shared/public routes
canAccessRoute('/home', 'ngo') // true
canAccessRoute('/projects', 'admin') // true

// ❌ Blocked: Other portal's namespace
canAccessRoute('/admin/overview', 'ngo') // false
canAccessRoute('/corporate/dashboard', 'admin') // false
```

### Route Validation in ProtectedRoute

The `ProtectedRoute` component should validate routes:

```typescript
import { canAccessRoute } from '../utils/routing';

const ProtectedRoute = ({ children, pathname }) => {
  const { role } = useRoleRouting();
  
  if (!canAccessRoute(pathname, role)) {
    router.replace(getRoleRoute('dashboard', role));
    return null;
  }
  
  return children;
};
```

## Benefits

### 1. Production-Safe Pattern
- **Single Source of Truth**: All routing logic in one place
- **Type-Safe**: TypeScript ensures route keys match configuration
- **Testable**: Pure functions easy to unit test
- **Maintainable**: Change route mapping in one place affects entire app

### 2. Scalability
- **Easy to Add Portals**: Just add new role to `ROLE_ROUTE_NAMESPACES`
- **Flexible Route Mapping**: Each route can have portal-specific or shared paths
- **No Code Duplication**: Single utility used everywhere

### 3. Developer Experience
- **Clear Intent**: `useRoleRouting()` hook makes role-aware routing obvious
- **IDE Support**: TypeScript autocompletion for route keys
- **Debugging**: Centralized routing logic easy to trace

### 4. User Experience
- **Consistent Navigation**: Same navbar, different destinations based on role
- **No Confusion**: Users always see their portal's pages
- **Seamless**: Transparent routing without user awareness

## Migration Path

1. ✅ Created `routing.ts` utility with route mapping
2. ✅ Created `useRoleRouting` hook for React components
3. ✅ Updated `Header.tsx` to use role-aware routing
4. ⏭️ Update `ProtectedRoute` to use `canAccessRoute()`
5. ⏭️ Update any other components using hardcoded routes
6. ⏭️ Add portal-specific pages if needed (e.g., `/ngo/home`, `/corporate/projects`)

## Future Enhancements

1. **Dynamic Route Configuration**: Load route mapping from backend
2. **Route Permissions**: Fine-grained permission system per route
3. **Analytics**: Track route access patterns by role
4. **A/B Testing**: Route variations for testing new features

## Example Code

### Basic Usage
```typescript
import { useRoleRouting } from '@/hooks/useRoleRouting';

function MyComponent() {
  const { routes, navLinks } = useRoleRouting();
  
  return (
    <Link href={routes.projects}>
      View Projects
    </Link>
  );
}
```

### Advanced Usage
```typescript
import { useRoleRouting } from '@/hooks/useRoleRouting';
import { getRoleRoute } from '@/utils/routing';

function ConditionalLink() {
  const { role, checkAccess } = useRoleRouting();
  
  const linkTo = getRoleRoute('projects', role);
  const canAccess = checkAccess(linkTo);
  
  if (!canAccess) return null;
  
  return <Link href={linkTo}>Projects</Link>;
}
```

## Testing

```typescript
import { getRoleRoute, canAccessRoute } from '@/utils/routing';

describe('Role Routing', () => {
  it('should route admin to admin namespace', () => {
    expect(getRoleRoute('home', 'admin')).toBe('/admin/overview');
  });
  
  it('should prevent cross-portal access', () => {
    expect(canAccessRoute('/admin/overview', 'ngo')).toBe(false);
  });
});
```

---

**Last Updated**: 2024-03-20
**Author**: Development Team
**Status**: ✅ Production Ready
