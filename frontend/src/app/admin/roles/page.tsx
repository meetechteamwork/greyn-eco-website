'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/utils/api';
import { useSimpleToast } from '@/components/Toast';

type Permission = 'view' | 'create' | 'approve' | 'delete';
type Role = 'Admin' | 'Corporate Admin' | 'NGO Admin' | 'Verifier' | 'Investor';

interface RolePermissions {
  [key: string]: {
    [key in Permission]: boolean;
  };
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: {
    view: boolean;
    create: boolean;
    approve: boolean;
    delete: boolean;
  };
  isSystem: boolean;
  isActive: boolean;
}

export default function AdminRolesPage() {
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [stats, setStats] = useState({ 
    totalRoles: 0, 
    activeRoles: 0,
    systemRoles: 0,
    customRoles: 0,
    permissionTypes: 0, 
    activePermissions: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPermissions, setOriginalPermissions] = useState<RolePermissions>({});
  const { showToast } = useSimpleToast();
  const permissionsRef = useRef<RolePermissions>({});
  const permissionLabels: { [key in Permission]: string } = {
    view: 'View',
    create: 'Create',
    approve: 'Approve',
    delete: 'Delete',
  };

  // Fetch roles from API with retry logic
  useEffect(() => {
    const fetchRoles = async (retryCount = 0) => {
      const maxRetries = 3;
      
      try {
        setLoading(true);
        setError(null);
        
        const [rolesResponse, statsResponse] = await Promise.all([
          api.admin.roles.getAll(),
          api.admin.roles.getStats()
        ]);

        if (rolesResponse.success && rolesResponse.data) {
          const rolesData = rolesResponse.data as any;
          // Validate response data
          if (!Array.isArray(rolesData)) {
            throw new Error('Invalid response format from server');
          }

          const rolesList = rolesData.map((r: RoleData) => r.name) as Role[];
          const permissionsMap: RolePermissions = {};

          rolesData.forEach((role: RoleData) => {
            // Validate role structure
            if (!role.name || !role.permissions) {
              console.warn('Invalid role data:', role);
              return;
            }
            permissionsMap[role.name] = {
              view: role.permissions.view === true,
              create: role.permissions.create === true,
              approve: role.permissions.approve === true,
              delete: role.permissions.delete === true,
            };
          });

          setRoles(rolesList);
          setRolesData(rolesData);
          setPermissions(permissionsMap);
          setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMap))); // Deep copy
          permissionsRef.current = JSON.parse(JSON.stringify(permissionsMap));
          setHasChanges(false);
        } else {
          const errorMsg = rolesResponse.message || 'Failed to fetch roles';
          setError(errorMsg);
          
          // Retry on network errors
          if (retryCount < maxRetries && (errorMsg.includes('network') || errorMsg.includes('fetch'))) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return fetchRoles(retryCount + 1);
          }
          
          showToast(errorMsg, 'error');
        }

        if (statsResponse.success && statsResponse.data) {
          const statsData = statsResponse.data as any;
          const rolesDataForStats = rolesResponse.data as any;
          // Calculate active permissions from actual roles data
          const activePerms = rolesResponse.success && rolesDataForStats && Array.isArray(rolesDataForStats) && rolesDataForStats.length > 0
            ? rolesDataForStats.reduce((acc: number, role: RoleData) => {
                return acc + Object.values(role.permissions).filter(Boolean).length;
              }, 0)
            : (statsData.totalPermissions || 0);

          setStats({
            totalRoles: statsData.totalRoles || (Array.isArray(rolesDataForStats) ? rolesDataForStats.length : 0),
            activeRoles: statsData.activeRoles || statsData.totalRoles || (Array.isArray(rolesDataForStats) ? rolesDataForStats.length : 0),
            systemRoles: statsData.systemRoles || 0,
            customRoles: statsData.customRoles || 0,
            permissionTypes: statsData.permissionTypes || 4,
            activePermissions: activePerms
          });
        } else if (rolesResponse.success && rolesResponse.data) {
          const rolesDataForStats = rolesResponse.data as any;
          if (Array.isArray(rolesDataForStats) && rolesDataForStats.length > 0) {
            // Calculate from roles if stats API fails
            const totalPerms = rolesDataForStats.reduce((acc: number, role: RoleData) => {
              return acc + Object.values(role.permissions).filter(Boolean).length;
            }, 0);
            setStats({
              totalRoles: rolesDataForStats.length,
              activeRoles: rolesDataForStats.length,
              systemRoles: rolesDataForStats.filter((r: RoleData) => r.isSystem).length,
              customRoles: rolesDataForStats.filter((r: RoleData) => !r.isSystem).length,
              permissionTypes: 4,
              activePermissions: totalPerms
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        const errorMsg = err.message || 'Failed to fetch roles';
        setError(errorMsg);
        
        // Retry on network errors
        if (retryCount < maxRetries && (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('Failed to fetch'))) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchRoles(retryCount + 1);
        }
        
        showToast(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Check for changes and update stats in real-time
  useEffect(() => {
    const hasChanges = JSON.stringify(permissions) !== JSON.stringify(originalPermissions);
    setHasChanges(hasChanges);
    
    // Calculate active permissions from current permissions state (real-time)
    if (Object.keys(permissions).length > 0) {
      const activePerms = Object.values(permissions).reduce((acc, role) => {
        if (role && typeof role === 'object') {
          return acc + Object.values(role).filter(val => val === true).length;
        }
        return acc;
      }, 0);
      
      setStats(prev => ({
        ...prev,
        activePermissions: activePerms,
        totalRoles: rolesData.length > 0 ? rolesData.length : prev.totalRoles
      }));
    }
  }, [permissions, originalPermissions, rolesData.length]);

  const handlePermissionToggle = (role: Role, permission: Permission) => {
    // Validate inputs
    if (!role || !permission) {
      showToast('Invalid role or permission', 'error');
      return;
    }

    const roleData = rolesData.find(r => r.name === role);
    if (!roleData) {
      showToast('Role not found', 'error');
      return;
    }

    // Prevent modification of Admin role
    if (roleData.isSystem && role === 'Admin') {
      showToast('Cannot modify Admin role permissions', 'warning');
      return;
    }

    // Validate permission key
    const validPermissions: Permission[] = ['view', 'create', 'approve', 'delete'];
    if (!validPermissions.includes(permission)) {
      showToast('Invalid permission type', 'error');
      return;
    }

    const currentValue = permissions[role]?.[permission] ?? false;
    const newValue = !currentValue;
    
    // Update permissions (will be saved when user clicks Save Changes)
    setPermissions((prev) => {
      const currentRolePerms = prev[role] || { view: false, create: false, approve: false, delete: false };
      const updated = {
        ...prev,
        [role]: {
          ...currentRolePerms,
          [permission]: newValue,
        },
      };
      
      // Update ref for change detection
      permissionsRef.current = updated;
      
      return updated;
    });

    showToast(`${permission} permission ${newValue ? 'enabled' : 'disabled'} for ${role}`, 'info', 2000);
  };

  const handleRolePermissionsToggle = (role: Role, value: boolean) => {
    const roleData = rolesData.find(r => r.name === role);
    if (!roleData) return;

    // Prevent modification of Admin role
    if (roleData.isSystem && role === 'Admin') {
      showToast('Cannot modify Admin role permissions', 'warning');
      return;
    }

    // Update permissions (will be saved when user clicks Save Changes)
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        view: value,
        create: value,
        approve: value,
        delete: value,
      },
    }));

    showToast(`All permissions ${value ? 'enabled' : 'disabled'} for ${role}`, 'info', 2000);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      showToast('No changes to save', 'info');
      return;
    }

    // Count how many roles have changes
    const changedRolesCount = Object.keys(permissions).filter(role => {
      const roleData = rolesData.find(r => r.name === role);
      if (!roleData || (roleData.isSystem && role === 'Admin')) return false;
      return JSON.stringify(permissions[role]) !== JSON.stringify(originalPermissions[role]);
    }).length;

    // Confirm if multiple roles are being changed
    if (changedRolesCount > 1) {
      if (!confirm(`You are about to save changes to ${changedRolesCount} roles. Continue?`)) {
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      // Collect all roles that need updating
      const updates: Array<{ roleData: RoleData; permissions: any }> = [];
      
      rolesData.forEach((roleData) => {
        if (roleData.isSystem && roleData.name === 'Admin') {
          return; // Skip Admin role
        }

        const currentPerms = permissions[roleData.name];
        const originalPerms = originalPermissions[roleData.name];

        // Check if permissions have changed
        if (JSON.stringify(currentPerms) !== JSON.stringify(originalPerms)) {
          updates.push({
            roleData,
            permissions: currentPerms
          });
        }
      });

      if (updates.length === 0) {
        showToast('No changes to save', 'info');
        setSaving(false);
        return;
      }

      // Save all changes in parallel with retry logic
      const updatePromises = updates.map(async ({ roleData, permissions: perms }) => {
        let lastError: any = null;
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const response = await api.admin.roles.updatePermissions(roleData.id, perms);
            if (!response.success) {
              throw new Error(response.message || `Failed to update ${roleData.name}`);
            }
            return { success: true, roleData, data: response.data };
          } catch (err: any) {
            lastError = err;
            // Don't retry on validation errors
            if (err.message?.includes('Invalid') || err.message?.includes('required') || err.message?.includes('Cannot modify')) {
              break;
            }
            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
        }
        
        return { success: false, roleData, error: lastError?.message || 'Unknown error' };
      });

      const results = await Promise.all(updatePromises);
      
      // Check for failures
      const failures = results.filter(r => !r.success);
      if (failures.length > 0) {
        const failedRoles = failures.map(f => f.roleData.name).join(', ');
        const errorMessages = failures.map(f => f.error).filter(Boolean);
        const errorMsg = errorMessages.length > 0 
          ? `Failed to save: ${failedRoles}. Errors: ${errorMessages.join('; ')}`
          : `Failed to save changes for: ${failedRoles}`;
        throw new Error(errorMsg);
      }

      // Refresh data from server to ensure consistency
      try {
        const [rolesResponse, statsResponse] = await Promise.all([
          api.admin.roles.getAll(),
          api.admin.roles.getStats()
        ]);

        if (rolesResponse.success && rolesResponse.data) {
          const rolesData = rolesResponse.data as any;
          // Validate response data
          if (!Array.isArray(rolesData)) {
            throw new Error('Invalid response format from server');
          }

          const rolesList = rolesData.map((r: RoleData) => r.name) as Role[];
          const permissionsMap: RolePermissions = {};

          rolesData.forEach((role: RoleData) => {
            permissionsMap[role.name] = role.permissions;
          });

          setRoles(rolesList);
          setRolesData(rolesData);
          setPermissions(permissionsMap);
          setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMap))); // Deep copy
          setHasChanges(false);
        }

        if (statsResponse.success && statsResponse.data) {
          const statsData = statsResponse.data as any;
          const rolesDataForStats = rolesResponse.data as any;
          // Calculate active permissions from actual roles data
          const activePerms = rolesResponse.success && rolesDataForStats && Array.isArray(rolesDataForStats) && rolesDataForStats.length > 0
            ? rolesDataForStats.reduce((acc: number, role: RoleData) => {
                return acc + Object.values(role.permissions).filter(Boolean).length;
              }, 0)
            : (statsData.totalPermissions || 0);

          setStats({
            totalRoles: statsData.totalRoles || (Array.isArray(rolesDataForStats) ? rolesDataForStats.length : 0),
            activeRoles: statsData.activeRoles || statsData.totalRoles || (Array.isArray(rolesDataForStats) ? rolesDataForStats.length : 0),
            systemRoles: statsData.systemRoles || 0,
            customRoles: statsData.customRoles || 0,
            permissionTypes: statsData.permissionTypes || 4,
            activePermissions: activePerms
          });
        } else if (rolesResponse.success && rolesResponse.data) {
          const rolesDataForStats = rolesResponse.data as any;
          if (Array.isArray(rolesDataForStats) && rolesDataForStats.length > 0) {
            // Calculate from roles if stats API fails
            const totalPerms = rolesDataForStats.reduce((acc: number, role: RoleData) => {
              return acc + Object.values(role.permissions).filter(Boolean).length;
            }, 0);
            setStats({
              totalRoles: rolesDataForStats.length,
              activeRoles: rolesDataForStats.length,
              systemRoles: rolesDataForStats.filter((r: RoleData) => r.isSystem).length,
              customRoles: rolesDataForStats.filter((r: RoleData) => !r.isSystem).length,
              permissionTypes: 4,
              activePermissions: totalPerms
            });
          }
        }
      } catch (refreshError: any) {
        console.error('Error refreshing data after save:', refreshError);
        // Don't fail the save operation if refresh fails
      }

      showToast(`Successfully saved ${updates.length} role${updates.length > 1 ? 's' : ''}`, 'success');
    } catch (err: any) {
      console.error('Error saving changes:', err);
      const errorMsg = err.message || 'Failed to save changes. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      
      // Reload data to show current server state
      try {
        const rolesResponse = await api.admin.roles.getAll();
        if (rolesResponse.success && rolesResponse.data) {
          const rolesData = rolesResponse.data as any;
          if (Array.isArray(rolesData)) {
            const rolesList = rolesData.map((r: RoleData) => r.name) as Role[];
            const permissionsMap: RolePermissions = {};

            rolesData.forEach((role: RoleData) => {
              permissionsMap[role.name] = role.permissions;
            });

            setRoles(rolesList);
            setRolesData(rolesData);
            setPermissions(permissionsMap);
            setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMap)));
            setHasChanges(false);
          }
        }
      } catch (reloadError: any) {
        console.error('Error reloading data:', reloadError);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Are you sure you want to reset all roles to default? This will overwrite all current permissions.')) {
      return;
    }

    try {
      const response = await api.admin.roles.reset();
      
      if (response.success) {
        // Reload roles
        const rolesResponse = await api.admin.roles.getAll();
        if (rolesResponse.success && rolesResponse.data) {
          const rolesData = rolesResponse.data as any;
          if (Array.isArray(rolesData)) {
            const rolesList = rolesData.map((r: RoleData) => r.name) as Role[];
            const permissionsMap: RolePermissions = {};

            rolesData.forEach((role: RoleData) => {
              permissionsMap[role.name] = role.permissions;
            });

            setRoles(rolesList);
            setRolesData(rolesData);
            setPermissions(permissionsMap);
          }
        }
        showToast('Roles reset to default successfully!', 'success');
      } else {
        showToast(response.message || 'Failed to reset roles', 'error');
      }
    } catch (err: any) {
      console.error('Error resetting roles:', err);
      showToast('Failed to reset roles. Please try again.', 'error');
    }
  };

  const handleExportRoles = async () => {
    try {
      const response = await api.admin.roles.export();
      
      if (response.success && response.data) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `roles-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Roles exported successfully!', 'success');
      } else {
        showToast(response.message || 'Failed to export roles', 'error');
      }
    } catch (err: any) {
      console.error('Error exporting roles:', err);
      showToast('Failed to export roles. Please try again.', 'error');
    }
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
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-2">
              Roles & Permissions
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400">
              Manage role-based access control and permissions matrix
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mb-8 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600 dark:text-slate-400">Loading roles...</p>
            </div>
          )}

          {/* Stats Summary */}
          {!loading && (
          <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalRoles > 0 ? stats.totalRoles : (rolesData.length > 0 ? rolesData.length : 0)}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Roles</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.permissionTypes > 0 ? stats.permissionTypes : 4}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Permission Types</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {(() => {
                  // Always calculate from actual permissions state (real data)
                  if (Object.keys(permissions).length > 0) {
                    return Object.values(permissions).reduce((acc, role) => {
                      if (role && typeof role === 'object') {
                        return acc + Object.values(role).filter(val => val === true).length;
                      }
                      return acc;
                    }, 0);
                  }
                  // Only use stats if permissions not loaded yet
                  return stats.activePermissions > 0 ? stats.activePermissions : 0;
                })()}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Active Permissions</p>
            </div>
          </div>
          )}

          {/* Permissions Matrix */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Matrix Header */}
            <div className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Permissions Matrix</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Configure permissions for each role using the matrix below
                  </p>
                </div>
                <button 
                  onClick={handleSaveChanges}
                  disabled={saving || !hasChanges}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    hasChanges && !saving
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  title={!hasChanges ? 'No changes to save' : 'Save all permission changes'}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Saving...</span>
                    </>
                  ) : hasChanges ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Save Changes</span>
                      {hasChanges && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                          {Object.keys(permissions).filter(role => {
                            const roleData = rolesData.find(r => r.name === role);
                            if (!roleData || (roleData.isSystem && role === 'Admin')) return false;
                            return JSON.stringify(permissions[role]) !== JSON.stringify(originalPermissions[role]);
                          }).length}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>All Saved</span>
                    </>
                  )}
                </button>
              </div>

              {/* Permission Types Header */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 min-w-[600px]">
                  <div className="col-span-1"></div>
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="text-center">
                      <div className="inline-flex items-center justify-center w-full px-2 sm:px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Matrix Body */}
            {!loading && roles.length > 0 && Object.keys(permissions).length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-slate-700 overflow-x-auto">
              {roles.map((role, roleIndex) => {
                const roleData = rolesData.find(r => r.name === role);
                const isAdmin = role === 'Admin';

                // Ensure permissions exist for this role
                if (!permissions[role]) {
                  return null;
                }

                return (
                <div
                  key={role}
                  className={`p-4 sm:p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-700/30 ${
                    roleIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/30 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="grid grid-cols-5 gap-4 items-center min-w-[600px]">
                    {/* Role Column */}
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${getRoleColor(role)} text-white shadow-lg`}>
                        {getRoleIcon(role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{role}</h3>
                          {roleData?.isSystem && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                              SYSTEM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{roleData?.description || getRoleDescription(role)}</p>
                      </div>
                      {/* Quick toggle */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {roleData && JSON.stringify(permissions[role]) !== JSON.stringify(originalPermissions[role]) && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                            Unsaved
                          </span>
                        )}
                        <button
                          onClick={() => {
                            const allEnabled = Object.values(permissions[role] || {}).every(Boolean);
                            handleRolePermissionsToggle(role, !allEnabled);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          title={Object.values(permissions[role] || {}).every(Boolean) ? 'Disable all' : 'Enable all'}
                        >
                          {Object.values(permissions[role] || {}).every(Boolean) ? 'All On' : 'All Off'}
                        </button>
                      </div>
                    </div>

                    {/* Permission Checkboxes */}
                    {Object.entries(permissionLabels).map(([permissionKey, label]) => {
                      const permission = permissionKey as Permission;
                      const rolePermissions = permissions[role] || {};
                      const isEnabled = rolePermissions[permission] === true;
                      const isAdminRole = role === 'Admin';

                      return (
                        <div 
                          key={permission} 
                          className="flex justify-center"
                          onClick={(e) => {
                            if (!isAdminRole) {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePermissionToggle(role, permission);
                            }
                          }}
                        >
                          <label 
                            className="relative inline-flex items-center cursor-pointer group"
                            onClick={(e) => {
                              if (!isAdminRole) {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePermissionToggle(role, permission);
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isAdminRole) {
                                  handlePermissionToggle(role, permission);
                                }
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isAdminRole) {
                                  handlePermissionToggle(role, permission);
                                }
                              }}
                              disabled={isAdminRole}
                              className="sr-only peer"
                              readOnly
                            />
                            <div 
                              className={`
                                relative w-14 h-8 rounded-full transition-all duration-300
                                ${isEnabled 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                  : 'bg-gray-300 dark:bg-slate-600'
                                }
                                ${isAdminRole ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                                ${!isAdminRole && 'group-hover:shadow-lg group-hover:scale-105'}
                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800
                              `}
                              onClick={(e) => {
                                if (!isAdminRole) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePermissionToggle(role, permission);
                                }
                              }}
                            >
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
              );
              })}
            </div>
            )}
          </div>

          {/* Legend and Info */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                <button 
                  onClick={() => alert('Create new role feature coming soon!')}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-700 transition-colors group"
                >
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
                <button 
                  onClick={handleExportRoles}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-700 transition-colors group"
                >
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
                <button 
                  onClick={handleResetToDefault}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-700 transition-colors group"
                >
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

