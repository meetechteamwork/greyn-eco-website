# Routing Quick Reference

## Quick Start

```typescript
import { useRoleRouting } from '@/hooks/useRoleRouting';

function MyComponent() {
  const { routes, navLinks } = useRoleRouting();
  
  // Use role-specific routes
  <Link href={routes.home}>Home</Link>
  <Link href={routes.projects}>Projects</Link>
  <Link href={routes.products}>Products</Link>
  <Link href={routes.dashboard}>Dashboard</Link>
  
  // Or use pre-built nav links
  {navLinks.map(link => (
    <Link key={link.href} href={link.href}>{link.label}</Link>
  ))}
}
```

## Route Mapping Reference

| Route | Admin | NGO | Corporate | Carbon | Investor |
|-------|-------|-----|-----------|--------|----------|
| **Home** | `/admin/overview` | `/ngo/dashboard` | `/corporate/dashboard` | `/carbon/marketplace` | `/home` |
| **Projects** | `/admin/projects` | `/ngo/launch` | `/projects` | `/carbon/projects` | `/projects` |
| **Products** | `/admin/overview` | `/products` | `/products` | `/carbon/marketplace` | `/products` |
| **Dashboard** | `/admin/overview` | `/ngo/dashboard` | `/corporate/dashboard` | `/carbon/marketplace` | `/dashboard` |

## Role Namespaces

- **Admin**: `/admin/*`
- **NGO**: `/ngo/*`
- **Corporate**: `/corporate/*`
- **Carbon**: `/carbon/*`
- **Investor**: `/investor/*` (maps to simple-user role)

## Utility Functions

```typescript
import { getRoleRoute, canAccessRoute, getRoleNamespace } from '@/utils/routing';

// Get route for specific role
getRoleRoute('home', 'admin') // → '/admin/overview'

// Check route access
canAccessRoute('/ngo/dashboard', 'ngo') // → true
canAccessRoute('/admin/overview', 'ngo') // → false (cross-portal blocked)

// Get namespace
getRoleNamespace('corporate') // → '/corporate'
```

## Best Practices

1. **Always use `useRoleRouting()` hook** instead of hardcoding routes
2. **Use `canAccessRoute()` in ProtectedRoute** to prevent cross-portal access
3. **Update `ROUTE_MAP` in `routing.ts`** when adding new routes
4. **Test with different roles** to ensure proper routing

## Common Patterns

### Navigation Links
```typescript
const { navLinks } = useRoleRouting();
// navLinks is already role-aware and ready to use
```

### Conditional Rendering
```typescript
const { routes, checkAccess } = useRoleRouting();
const canViewProjects = checkAccess(routes.projects);

{canViewProjects && <ProjectsPage />}
```

### Redirects
```typescript
const { routes } = useRoleRouting();
router.push(routes.dashboard); // Always goes to correct dashboard
```
