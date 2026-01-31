/**
 * React Hook for Role-Aware Routing
 * 
 * Provides easy access to role-based routing utilities in components
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getRoleRoute, 
  getRoleNamespace, 
  getNavLinksForRole,
  canAccessRoute 
} from '../utils/routing';

export const useRoleRouting = () => {
  const { user, isLoading } = useAuth();
  const role = user?.role || null;

  const routes = useMemo(() => ({
    home: getRoleRoute('home', role),
    projects: getRoleRoute('projects', role),
    products: getRoleRoute('products', role),
    dashboard: getRoleRoute('dashboard', role),
  }), [role]);

  const namespace = useMemo(() => getRoleNamespace(role), [role]);

  const navLinks = useMemo(() => getNavLinksForRole(role), [role]);

  const checkAccess = (pathname: string): boolean => {
    return canAccessRoute(pathname, role);
  };

  return {
    routes,
    namespace,
    navLinks,
    checkAccess,
    role,
    isLoading,
  };
};
