'use client';

import React, { useState } from 'react';

type Permission = 'view' | 'create' | 'approve' | 'delete';
type Role = 'Admin' | 'Corporate Admin' | 'NGO Admin' | 'Verifier' | 'Investor';

interface RolePermissions {
  [key: string]: {
    [key in Permission]: boolean;
  };
}

export default function AdminRolesPage() {
  const [permissions, setPermissions] = useState<RolePermissions>({
    'Admin': {
      view: true,
      create: true,
      approve: true,
      delete: true,
    },
    'Corporate Admin': {
      view: true,
      create: true,
      approve: true,
      delete: false,
    },
    'NGO Admin': {
      view: true,
      create: true,
      approve: false,
      delete: false,
    },
    'Verifier': {
      view: true,
      create: false,
      approve: true,
      delete: false,
    },
    'Investor': {
      view: true,
      create: false,
      approve: false,
      delete: false,
    },
  });

  const roles: Role[] = ['Admin', 'Corporate Admin', 'NGO Admin', 'Verifier', 'Investor'];
  const permissionLabels: { [key in Permission]: string } = {
    view: 'View',
    create: 'Create',
    approve: 'Approve',
    delete: 'Delete',
  };

  const handlePermissionToggle = (role: Role, permission: Permission) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));
    // In a real app, this would call an API
    console.log(`Toggled ${permission} for ${role}`);
  };

  const handleRolePermissionsToggle = (role: Role, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        view: value,
        create: value,
        approve: value,
        delete: value,
      },
    }));
    // In a real app, this would call an API
    console.log(`Set all permissions for ${role} to ${value}`);
  };

  const getRoleColor = (role: Role): string => {
    const colors = {
      'Admin': 'from-red-500 to-red-600',
      'Corporate Admin': 'from-blue-500 to-blue-600',
      'NGO Admin': 'from-emerald-500 to-emerald-600',
      'Verifier': 'from-orange-500 to-orange-600',
      'Investor': 'from-purple-500 to-purple-600',
    };
    return colors[role];
  };

  const getRoleIcon = (role: Role) => {
    const icons = {
      'Admin': (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      'Corporate Admin': (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      ),
      'NGO Admin': (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      'Verifier': (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'Investor': (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    };
    return icons[role];
  };

  const getRoleDescription = (role: Role): string => {
    const descriptions = {
      'Admin': 'Full system access with all permissions',
      'Corporate Admin': 'Manage corporate ESG portal and campaigns',
      'NGO Admin': 'Manage NGO projects and submissions',
      'Verifier': 'Verify and approve carbon credit projects',
      'Investor': 'View and purchase carbon credits',
    };
    return descriptions[role];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-2">
              Roles & Permissions
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Manage role-based access control and permissions matrix
            </p>
          </div>

          {/* Stats Summary */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{roles.length}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Roles</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4</p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Permission Types</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {Object.values(permissions).reduce((acc, role) => 
                  acc + Object.values(role).filter(Boolean).length, 0
                )}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active Permissions</p>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Matrix Header */}
            <div className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions Matrix</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Configure permissions for each role using the matrix below
                  </p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all hover:scale-105">
                  Save Changes
                </button>
              </div>

              {/* Permission Types Header */}
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1"></div>
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="text-center">
                    <div className="inline-flex items-center justify-center w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Body */}
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {roles.map((role, roleIndex) => (
                <div
                  key={role}
                  className={`p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-700/30 ${
                    roleIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/30 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    {/* Role Column */}
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${getRoleColor(role)} text-white shadow-lg`}>
                        {getRoleIcon(role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{role}</h3>
                          {role === 'Admin' && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                              SYSTEM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{getRoleDescription(role)}</p>
                      </div>
                      {/* Quick toggle */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => {
                            const allEnabled = Object.values(permissions[role]).every(Boolean);
                            handleRolePermissionsToggle(role, !allEnabled);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          title={Object.values(permissions[role]).every(Boolean) ? 'Disable all' : 'Enable all'}
                        >
                          {Object.values(permissions[role]).every(Boolean) ? 'All On' : 'All Off'}
                        </button>
                      </div>
                    </div>

                    {/* Permission Checkboxes */}
                    {Object.entries(permissionLabels).map(([permissionKey, label]) => {
                      const permission = permissionKey as Permission;
                      const isEnabled = permissions[role][permission];
                      const isAdmin = role === 'Admin';

                      return (
                        <div key={permission} className="flex justify-center">
                          <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handlePermissionToggle(role, permission)}
                              disabled={isAdmin}
                              className="sr-only peer"
                            />
                            <div className={`
                              relative w-14 h-8 rounded-full transition-all duration-300
                              ${isEnabled 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gray-300 dark:bg-slate-600'
                              }
                              ${isAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                              ${!isAdmin && 'group-hover:shadow-lg group-hover:scale-105'}
                              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800
                            `}>
                              <div className={`
                                absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                                ${isEnabled ? 'translate-x-6' : 'translate-x-0'}
                              `}>
                                {isEnabled && (
                                  <svg className="w-full h-full p-1.5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend and Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Permission Types</h3>
              <div className="space-y-3">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {key === 'view' && 'Read and view resources'}
                        {key === 'create' && 'Create new resources'}
                        {key === 'approve' && 'Approve and verify content'}
                        {key === 'delete' && 'Remove and delete resources'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-700 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Create New Role</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-700 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Export Permissions</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-700 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Reset to Default</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

