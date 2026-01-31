'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Role Info Component
 * 
 * Displays current user role and provides quick access links.
 * Role switching is not available as we use real JWT authentication.
 * 
 * Usage: Import and add <RoleSwitcher /> to any page component
 */
const RoleSwitcher: React.FC = () => {
  const { user, isNGO, isSimpleUser, isCorporate, isCarbon, isAdmin } = useAuth();

  // Don't show if user is not authenticated
  if (!user) {
    return null;
  }

  const getRoleLabel = () => {
    if (isSimpleUser) return 'Investor';
    if (isNGO) return 'NGO';
    if (isCorporate) return 'Corporate';
    if (isCarbon) return 'Carbon';
    if (isAdmin) return 'Admin';
    return user.role || 'User';
  };

  const getRoleColor = () => {
    if (isSimpleUser) return 'text-green-600';
    if (isNGO) return 'text-emerald-600';
    if (isCorporate) return 'text-blue-600';
    if (isCarbon) return 'text-teal-600';
    if (isAdmin) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl bg-white p-4 shadow-2xl border-2 border-green-500">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Current Session</h3>
        <p className="text-xs text-gray-600">
          Role: <span className={`font-semibold ${getRoleColor()}`}>{getRoleLabel()}</span>
        </p>
        {user.email && (
          <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{user.email}</p>
        )}
      </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Quick Access:</p>
          <div className="flex flex-col gap-1 text-xs">
          {isNGO && (
            <>
              <a href="/ngo/dashboard" className="text-blue-600 hover:underline">NGO Dashboard</a>
              <a href="/ngo/details" className="text-blue-600 hover:underline">NGO Details</a>
            <a href="/ngo/person-details" className="text-blue-600 hover:underline">Person Details</a>
            <a href="/ngo/project-details/1" className="text-blue-600 hover:underline">Project Details</a>
            <a href="/ngo/launch" className="text-blue-600 hover:underline">Launch Project</a>
            </>
      )}
      {isCorporate && (
            <>
              <a href="/corporate/dashboard" className="text-blue-600 hover:underline font-medium">Corporate Dashboard</a>
              <a href="/corporate/emissions" className="text-blue-600 hover:underline">CO₂ Emissions</a>
            <a href="/corporate/volunteers" className="text-blue-600 hover:underline">Volunteers</a>
            <a href="/corporate/campaigns" className="text-blue-600 hover:underline">Campaigns</a>
              <a href="/corporate/reports" className="text-blue-600 hover:underline">ESG Reports</a>
            <a href="/corporate/employees" className="text-blue-600 hover:underline">Employees</a>
            </>
          )}
      {isCarbon && (
            <>
              <a href="/carbon/marketplace" className="text-blue-600 hover:underline font-medium">Carbon Marketplace</a>
            </>
          )}
      {isAdmin && (
            <>
              <a href="/admin/overview" className="text-red-600 hover:underline font-medium">Admin Overview</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;


