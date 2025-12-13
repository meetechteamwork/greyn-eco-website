'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Role Switcher Component
 * 
 * This component allows you to easily switch between roles for testing.
 * Place this component anywhere in your app to quickly test different user roles.
 * 
 * Usage: Import and add <RoleSwitcher /> to any page component
 */
const RoleSwitcher: React.FC = () => {
  const { user, switchRole, isENGO, isSimpleUser } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl bg-white p-4 shadow-2xl border-2 border-green-500">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Role Switcher</h3>
        <p className="text-xs text-gray-600">Current Role: <span className="font-semibold text-green-600">{user?.role || 'None'}</span></p>
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          onClick={() => switchRole('simple-user')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isSimpleUser
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Switch to Simple User
        </button>
        <button
          onClick={() => switchRole('engo')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isENGO
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Switch to ENGO
        </button>
      </div>

      {isENGO && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">ENGO Pages:</p>
          <div className="flex flex-col gap-1 text-xs">
            <a href="/engo/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
            <a href="/engo/details" className="text-blue-600 hover:underline">Details</a>
            <a href="/engo/person-details" className="text-blue-600 hover:underline">Person Details</a>
            <a href="/engo/project-details/1" className="text-blue-600 hover:underline">Project Details</a>
            <a href="/engo/launch" className="text-blue-600 hover:underline">Launch Project</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;


