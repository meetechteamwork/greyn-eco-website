# How to Switch to ENGO Role - Quick Guide

## Method 1: Use the Role Switcher Component (Easiest)

1. **Navigate to the Home page** (`/`)
2. **Look for the Role Switcher** in the bottom-right corner (floating widget)
3. **Click "Switch to ENGO"** button
4. The page will refresh and you'll now have ENGO access!

### What You'll See After Switching:

✅ **ENGO Menu** appears in the header navigation (dropdown with ENGO options)
✅ **All ENGO pages** become accessible
✅ Quick links to ENGO pages in the Role Switcher widget

### ENGO Pages You Can Access:

- **ENGO Dashboard** - `/engo/dashboard`
  - Advanced analytics dashboard
  - Project statistics
  - Financial overview
  - Team metrics

- **ENGO Details** - `/engo/details`
  - Organization information
  - Registration details
  - Certifications
  - Impact metrics

- **Person Details** - `/engo/person-details`
  - Team member profiles
  - Leadership information
  - Expertise areas
  - Education & awards

- **Project Details** - `/engo/project-details/[id]`
  - Individual project information
  - Funding progress
  - Milestones
  - Team members

- **Launch Project** - `/engo/launch`
  - Form to submit new projects
  - Project details entry
  - Funding goals setup

## Method 2: Edit AuthContext File (Code Change)

1. Open `src/context/AuthContext.tsx`
2. Find line 30:
   ```typescript
   const INITIAL_ROLE: UserRole = 'simple-user'; // Change to 'engo' to test ENGO role
   ```
3. Change it to:
   ```typescript
   const INITIAL_ROLE: UserRole = 'engo'; // ENGO role activated
   ```
4. Save the file
5. Refresh your browser

## Method 3: Use the Header Navigation

Once you're logged in as ENGO, you'll see:

1. **ENGO dropdown menu** in the header (desktop)
2. **ENGO section** in the mobile menu
3. Click any ENGO menu item to navigate to that page

## Quick Access Links

After switching to ENGO role, you can directly visit:

- Dashboard: `http://localhost:3000/engo/dashboard`
- Details: `http://localhost:3000/engo/details`
- Person Details: `http://localhost:3000/engo/person-details`
- Project Details: `http://localhost:3000/engo/project-details/1`
- Launch Project: `http://localhost:3000/engo/launch`

## Switching Back to Simple User

1. Use the Role Switcher widget (bottom-right)
2. Click "Switch to Simple User"
3. Or edit `AuthContext.tsx` and change back to `'simple-user'`

## Features Available as ENGO

✅ Advanced dashboard with detailed analytics
✅ Organization details management
✅ Team member profiles
✅ Project management and tracking
✅ Launch new projects functionality
✅ All simple user features (Home, Products, Projects, Dashboard, Analytics, Wallet)

## Testing Protected Routes

**As Simple User:**
- Try accessing `/engo/dashboard` → Should redirect to home page
- ENGO menu will NOT appear in header

**As ENGO:**
- All `/engo/*` pages are accessible
- ENGO menu appears in header
- All simple user pages still work

## Need Help?

Check the `ROLE_SWITCHING_GUIDE.md` file for more detailed documentation.


