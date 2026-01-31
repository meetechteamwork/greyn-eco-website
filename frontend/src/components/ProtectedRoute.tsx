'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useRoleRouting } from '../hooks/useRoleRouting';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ngo' | 'simple-user' | 'corporate' | 'carbon' | 'admin';
  allowedRoles?: ('ngo' | 'simple-user' | 'corporate' | 'carbon' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { routes, checkAccess } = useRoleRouting();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    // Redirect to login if not authenticated - do this immediately
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    // Validate route access using routing utility (prevents cross-portal access)
    if (!checkAccess(pathname)) {
      router.replace(routes.dashboard);
      return;
    }

    // Check required role
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to role-specific dashboard for wrong role
      router.replace(routes.dashboard);
      return;
    }

    // Check allowed roles
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to role-specific dashboard for unauthorized role
      router.replace(routes.dashboard);
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, allowedRoles, router, pathname, checkAccess, routes.dashboard]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated - show loading instead to prevent flash
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Don't render if role doesn't match
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};


