# Role-Based Authentication System - User Guide

## Overview

This project implements a dummy role-based frontend system with two roles:
- **simple-user**: Basic user with access to standard pages
- **engo**: Environmental Non-Governmental Organization with additional access to ENGO-specific pages

## How to Switch Roles

### Method 1: Edit AuthContext (Recommended)

1. Open `src/context/AuthContext.tsx`
2. Find the `INITIAL_ROLE` constant around line 18:
   ```typescript
   const INITIAL_ROLE: UserRole = 'simple-user'; // Change to 'engo' to test ENGO role
   ```
3. Change the value to switch roles:
   - For simple user: `'simple-user'`
   - For ENGO: `'engo'`
4. Save the file and refresh your browser

### Method 2: Programmatic Switch (For Testing)

You can also switch roles programmatically in any component:

```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { switchRole, isENGO, isSimpleUser } = useAuth();

  return (
    <div>
      <button onClick={() => switchRole('engo')}>Switch to ENGO</button>
      <button onClick={() => switchRole('simple-user')}>Switch to Simple User</button>
    </div>
  );
};
```

## Role Permissions

### Simple User (`simple-user`)
**Can Access:**
- `/` - Home
- `/products` - Products
- `/projects` - Projects
- `/dashboard` - Basic Dashboard
- `/analytics` - Analytics
- `/wallet` - Wallet

**Cannot Access:**
- All `/engo/*` routes (will be redirected to home)

### ENGO (`engo`)
**Can Access:**
- Everything a simple user can access, PLUS:
- `/engo/dashboard` - ENGO Dashboard (advanced analytics)
- `/engo/details` - ENGO Details page
- `/engo/person-details` - Person Details page
- `/engo/project-details/[id]` - Project Details page
- `/engo/launch` - Launch Your Project page

## Protected Routes

All ENGO pages are protected using the `ProtectedRoute` component. If a simple user tries to access an ENGO page, they will be automatically redirected to the home page.

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication context with role management
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── Header.tsx               # Navigation with conditional ENGO menu
└── app/
    ├── layout.tsx               # Root layout with AuthProvider
    ├── dashboard/               # Basic dashboard (both roles)
    ├── projects/                # Projects page (both roles)
    ├── products/                # Products page (both roles)
    └── engo/                    # ENGO-only pages
        ├── dashboard/
        ├── details/
        ├── person-details/
        ├── project-details/[id]/
        └── launch/
```

## Testing the System

1. **Test Simple User:**
   - Set `INITIAL_ROLE = 'simple-user'` in AuthContext
   - Navigate to `/engo/dashboard` - should redirect to home
   - Check header - no ENGO menu should be visible

2. **Test ENGO:**
   - Set `INITIAL_ROLE = 'engo'` in AuthContext
   - Navigate to `/engo/dashboard` - should show ENGO dashboard
   - Check header - ENGO dropdown menu should be visible
   - All ENGO pages should be accessible

## Integration with Backend

When you're ready to integrate with a real backend:

1. Replace the dummy user state in `AuthContext.tsx` with API calls
2. Store authentication tokens in localStorage or cookies
3. Update `ProtectedRoute` to check authentication status from API
4. Replace dummy data with API responses in all pages

## Current Implementation

- ✅ Dummy authentication context
- ✅ Role-based routing
- ✅ Protected routes for ENGO pages
- ✅ Conditional menu rendering in Header
- ✅ All pages created with dummy data
- ✅ Mobile-responsive navigation
- ✅ Clean structure for backend integration

## Notes

- All data is currently dummy/static JSON
- No real API calls are made
- Role switching is instant (no loading states)
- All pages are fully functional with placeholder data


