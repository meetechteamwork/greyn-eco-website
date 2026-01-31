/**
 * Role-Aware Routing Utility
 * 
 * Single source of truth for routing based on user roles.
 * Prevents cross-portal access and ensures consistent navigation.
 */

type UserRole = 'simple-user' | 'ngo' | 'corporate' | 'carbon' | 'admin';

/**
 * Route namespace mapping for each role
 */
const ROLE_ROUTE_NAMESPACES: Record<UserRole, string> = {
  'admin': '/admin',
  'ngo': '/ngo',
  'corporate': '/corporate',
  'carbon': '/carbon',
  'simple-user': '/investor', // Investor namespace for simple users
};

/**
 * Route definitions with portal-specific paths
 * Each route can have portal-specific implementations or fallback to shared
 */
const ROUTE_MAP: Record<string, Partial<Record<UserRole, string>>> = {
  home: {
    'admin': '/admin/overview', // Admin uses overview as home
    'ngo': '/ngo/dashboard', // NGO uses dashboard as home
    'corporate': '/corporate/dashboard', // Corporate uses dashboard as home
    'carbon': '/carbon/marketplace', // Carbon uses marketplace as home
    'simple-user': '/home', // Simple user uses shared home page
  },
  projects: {
    'admin': '/admin/projects',
    'ngo': '/ngo/launch', // NGO uses launch project as their projects view
    'corporate': '/projects', // Corporate shares investor projects
    'carbon': '/carbon/projects',
    'simple-user': '/projects', // Simple user uses shared projects
  },
  products: {
    'admin': '/admin/overview', // Admin doesn't have products, use overview
    'ngo': '/products', // NGO shares products
    'corporate': '/products', // Corporate shares products
    'carbon': '/carbon/marketplace', // Carbon uses marketplace as products
    'simple-user': '/products', // Simple user uses shared products
  },
  dashboard: {
    'admin': '/admin/overview',
    'ngo': '/ngo/dashboard',
    'corporate': '/corporate/dashboard',
    'carbon': '/carbon/marketplace',
    'simple-user': '/dashboard',
  },
};

/**
 * Get the route namespace for a given role
 */
export const getRoleNamespace = (role: UserRole | null | undefined): string => {
  if (!role) return '';
  return ROLE_ROUTE_NAMESPACES[role] || '';
};

/**
 * Get a role-specific route for a given route key
 * Falls back to shared routes if portal-specific route doesn't exist
 */
export const getRoleRoute = (
  routeKey: keyof typeof ROUTE_MAP,
  role: UserRole | null | undefined
): string => {
  if (!role) {
    // Not authenticated - return public/shared routes
    const publicRoutes: Record<string, string> = {
      home: '/home',
      projects: '/projects',
      products: '/products',
      dashboard: '/auth', // Redirect to login if not authenticated
    };
    return publicRoutes[routeKey] || '/';
  }

  // Get role-specific route if exists
  const roleRoute = ROUTE_MAP[routeKey]?.[role];
  
  if (roleRoute) {
    return roleRoute;
  }

  // Fallback to shared routes for simple-user or default
  const fallbackRoutes: Record<string, string> = {
    home: '/home',
    projects: '/projects',
    products: '/products',
    dashboard: '/dashboard',
  };

  return fallbackRoutes[routeKey] || '/';
};

/**
 * Check if a route belongs to a specific portal namespace
 */
export const isRouteInNamespace = (
  pathname: string,
  role: UserRole | null | undefined
): boolean => {
  if (!role) return false;
  const namespace = getRoleNamespace(role);
  return pathname.startsWith(namespace);
};

/**
 * Get all navigation links for a given role
 */
export const getNavLinksForRole = (
  role: UserRole | null | undefined
): Array<{ label: string; href: string }> => {
  const links = [
    { label: 'Home', href: getRoleRoute('home', role) },
    { label: 'Projects', href: getRoleRoute('projects', role) },
    { label: 'Products', href: getRoleRoute('products', role) },
    { label: 'Dashboard', href: getRoleRoute('dashboard', role) },
  ];

  return links;
};

/**
 * Validate if a route is accessible by a role
 * Prevents cross-portal access
 */
export const canAccessRoute = (
  pathname: string,
  role: UserRole | null | undefined
): boolean => {
  if (!role) {
    // Protected routes that require authentication (explicitly block for unauthenticated users)
    const protectedRoutes = ['/dashboard', '/activities', '/wallet', '/profile', '/admin', '/ngo', '/corporate', '/carbon'];
    if (protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
      return false;
    }
    
    // Public routes (not in any portal namespace)
    const publicRoutes = ['/home', '/auth', '/projects', '/products', '/about', '/how-it-works', '/contact', '/'];
    return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  }

  const namespace = getRoleNamespace(role);
  
  // Check if route is in the user's namespace
  if (pathname.startsWith(namespace)) {
    return true;
  }

  // Allow shared/public routes
  const sharedRoutes = ['/home', '/auth', '/projects', '/products', '/about', '/how-it-works', '/contact'];
  if (sharedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return true;
  }

  // Block cross-portal access
  const otherNamespaces = Object.values(ROLE_ROUTE_NAMESPACES).filter(ns => ns !== namespace);
  return !otherNamespaces.some(ns => pathname.startsWith(ns));
};
