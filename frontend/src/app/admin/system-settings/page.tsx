'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function SystemSettingsPage() {
  const [activeSection, setActiveSection] = useState<'general' | 'performance' | 'maintenance' | 'integrations' | 'backup'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with empty objects - will be populated from backend
  const [generalSettings, setGeneralSettings] = useState<any>({});
  const [performanceSettings, setPerformanceSettings] = useState<any>({});
  const [maintenanceSettings, setMaintenanceSettings] = useState<any>({});

  const [integrations, setIntegrations] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
  ];

  // Fetch all settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.admin.systemSettings.getAll();
        
        if (response.success && response.data) {
          const data = response.data as {
            general?: any;
            performance?: any;
            maintenance?: any;
            integrations?: any[];
            backups?: any[];
          };
          
          // Set general settings (ensure all fields exist)
          if (data.general && Object.keys(data.general).length > 0) {
            setGeneralSettings(data.general);
          }
          
          // Set performance settings (ensure all fields exist)
          if (data.performance && Object.keys(data.performance).length > 0) {
            setPerformanceSettings(data.performance);
          }
          
          // Set maintenance settings (ensure all fields exist)
          if (data.maintenance && Object.keys(data.maintenance).length > 0) {
            setMaintenanceSettings(data.maintenance);
          }
          
          // Set integrations (always set, even if empty array)
          if (Array.isArray(data.integrations)) {
            setIntegrations(data.integrations);
          } else {
            setIntegrations([]);
          }
          
          // Set backups (always set, even if empty array)
          if (Array.isArray(data.backups)) {
            setBackups(data.backups);
          } else {
            setBackups([]);
          }
        } else {
          // If response failed, ensure empty states
          setIntegrations([]);
          setBackups([]);
        }
      } catch (err: any) {
        console.error('Error fetching system settings:', err);
        setError(err.message || 'Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Determine which section to save based on activeSection
      let sectionToSave = activeSection;
      let dataToSave = {};
      
      if (activeSection === 'general') {
        sectionToSave = 'general';
        dataToSave = generalSettings;
      } else if (activeSection === 'performance') {
        sectionToSave = 'performance';
        dataToSave = performanceSettings;
      } else if (activeSection === 'maintenance') {
        sectionToSave = 'maintenance';
        dataToSave = maintenanceSettings;
      } else {
        // Integrations and backup don't have a "save all" - they have individual actions
        setIsSaving(false);
        return;
      }
      
      // Validate data before sending
      if (!dataToSave || Object.keys(dataToSave).length === 0) {
        setError('No changes to save');
        return;
      }
      
      const response = await api.admin.systemSettings.updateSection(sectionToSave, dataToSave);
      
      if (response.success) {
        // Update local state with saved data to ensure sync with backend
        if (response.data) {
          const data = response.data as {
            general?: any;
            performance?: any;
            maintenance?: any;
          };
          if (data[sectionToSave]) {
            if (sectionToSave === 'general') {
              setGeneralSettings(data.general);
            } else if (sectionToSave === 'performance') {
              setPerformanceSettings(data.performance);
            } else if (sectionToSave === 'maintenance') {
              setMaintenanceSettings(data.maintenance);
            }
          }
        }
        
        // Show success message
        alert(`${sectionToSave.charAt(0).toUpperCase() + sectionToSave.slice(1)} settings saved successfully!`);
        setError(null); // Clear any previous errors
      } else {
        setError(response.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleIntegrationToggle = async (integration: any) => {
    try {
      setError(null);
      const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
      const response = await api.admin.systemSettings.updateIntegration(integration.id, { status: newStatus });
      
      if (response.success) {
        // Update local state with response data
        if (response.data) {
          const data = response.data as { integration?: any };
          if (data.integration) {
            setIntegrations(prev => prev.map(int => 
              int.id === integration.id 
                ? { ...int, ...data.integration }
                : int
            ));
          } else {
            // Fallback to status update only
            setIntegrations(prev => prev.map(int => 
              int.id === integration.id 
                ? { ...int, status: newStatus }
                : int
            ));
          }
        } else {
          // Fallback to status update only
          setIntegrations(prev => prev.map(int => 
            int.id === integration.id 
              ? { ...int, status: newStatus }
              : int
          ));
        }
      } else {
        setError(response.message || 'Failed to update integration');
      }
    } catch (err: any) {
      console.error('Error updating integration:', err);
      setError(err.message || 'Failed to update integration');
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const response = await api.admin.systemSettings.createBackup({ type: 'full' });
      
      if (response.success) {
        // Add the new backup to the list immediately (it will be in 'in_progress' status)
        if (response.data) {
          const data = response.data as { backup?: any };
          if (data.backup) {
            setBackups(prev => [data.backup, ...prev]);
          }
        }
        alert('Backup initiated successfully! It will appear in the list and update status once completed.');
        
        // Refresh backups list after a delay to get updated status
        setTimeout(async () => {
          try {
            const backupsResponse = await api.admin.systemSettings.getBackups();
            if (backupsResponse.success && backupsResponse.data) {
              const backupsData = backupsResponse.data as { backups?: any[] };
              setBackups(backupsData.backups || []);
            }
          } catch (refreshError) {
            console.error('Error refreshing backups:', refreshError);
          }
        }, 6000); // Refresh after 6 seconds when backup should be completed
      } else {
        setError(response.message || 'Failed to create backup');
      }
    } catch (err: any) {
      console.error('Error creating backup:', err);
      setError(err.message || 'Failed to create backup');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600 dark:text-slate-400">Loading system settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">Error loading settings</div>
            <p className="text-gray-600 dark:text-slate-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                System Settings
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-lg">
                Configure platform-wide settings and system preferences
              </p>
            </div>
            {(activeSection === 'general' || activeSection === 'performance' || activeSection === 'maintenance') && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
                      ${activeSection === section.id
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.platformName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        Platform URL
                      </label>
                      <input
                        type="url"
                        value={generalSettings.platformUrl}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, platformUrl: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                      >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        Default Language
                      </label>
                      <select
                        value={generalSettings.defaultLanguage}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, defaultLanguage: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Maintenance Mode</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Temporarily disable public access to the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">User Registration</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Allow new users to register accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.registrationEnabled}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, registrationEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Email Verification</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Require email verification for new accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.emailVerification}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, emailVerification: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeSection === 'performance' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Settings</h2>
                {Object.keys(performanceSettings).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                    Loading settings...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Cache Duration (seconds)
                        </label>
                        <input
                          type="number"
                          value={performanceSettings.cacheDuration || ''}
                          onChange={(e) => setPerformanceSettings({ ...performanceSettings, cacheDuration: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Max Upload Size (MB)
                        </label>
                        <input
                          type="number"
                          value={performanceSettings.maxUploadSize || ''}
                          onChange={(e) => setPerformanceSettings({ ...performanceSettings, maxUploadSize: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      {[
                        { key: 'cacheEnabled', label: 'Enable Caching', desc: 'Cache static content for faster load times' },
                        { key: 'cdnEnabled', label: 'CDN Enabled', desc: 'Use Content Delivery Network for global performance' },
                        { key: 'compressionEnabled', label: 'Compression', desc: 'Compress responses to reduce bandwidth' },
                        { key: 'imageOptimization', label: 'Image Optimization', desc: 'Automatically optimize uploaded images' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={performanceSettings[key] !== undefined ? (performanceSettings[key] as boolean) : false}
                              onChange={(e) => setPerformanceSettings({ ...performanceSettings, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Maintenance Settings */}
            {activeSection === 'maintenance' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Maintenance Settings</h2>
                {Object.keys(maintenanceSettings).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                    Loading settings...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={maintenanceSettings.backupFrequency || 'daily'}
                          onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, backupFrequency: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Backup Retention (days)
                        </label>
                        <input
                          type="number"
                          value={maintenanceSettings.backupRetention || ''}
                          onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, backupRetention: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          Log Retention (days)
                        </label>
                        <input
                          type="number"
                          value={maintenanceSettings.logRetention || ''}
                          onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, logRetention: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          System Updates
                        </label>
                        <select
                          value={maintenanceSettings.systemUpdates || 'auto'}
                          onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, systemUpdates: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                        >
                          <option value="auto">Automatic</option>
                          <option value="manual">Manual</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Auto Backup</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Automatically backup system data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={maintenanceSettings.autoBackup !== undefined ? maintenanceSettings.autoBackup : false}
                            onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, autoBackup: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Auto Cleanup</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Automatically clean old logs and temporary files</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={maintenanceSettings.cleanupEnabled !== undefined ? maintenanceSettings.cleanupEnabled : false}
                            onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, cleanupEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Third-Party Integrations</h2>
                <div className="space-y-4">
                  {integrations.length > 0 ? (
                    integrations.map((integration) => (
                      <div key={integration.id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              integration.status === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-slate-700'
                            }`}>
                              <span className="text-2xl">
                                {integration.type === 'email' && '📧'}
                                {integration.type === 'payment' && '💳'}
                                {integration.type === 'analytics' && '📊'}
                                {integration.type === 'storage' && '☁️'}
                                {integration.type === 'monitoring' && '🔍'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                              <p className={`text-sm font-semibold ${
                                integration.status === 'connected' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-slate-400'
                              }`}>
                                {integration.status === 'connected' ? '✓ Connected' : 'Disconnected'}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleIntegrationToggle(integration)}
                            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                              integration.status === 'connected'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                      No integrations configured. Please run the seed script to initialize default integrations.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Backup & Restore */}
            {activeSection === 'backup' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Backup & Restore</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Backup</h3>
                      <button 
                        onClick={handleCreateBackup}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Creating...' : 'Create Backup Now'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Create a full system backup including database, files, and configurations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Backups</h3>
                    <div className="space-y-3">
                      {backups.length > 0 ? (
                        backups.map((backup) => (
                          <div key={backup.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  backup.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 
                                  backup.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                  'bg-gray-100 dark:bg-slate-600'
                                }`}>
                                  {backup.status === 'completed' ? (
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  ) : backup.status === 'in_progress' ? (
                                    <div className="w-6 h-6 border-2 border-yellow-600 dark:border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                                  ) : null}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">{backup.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-slate-400">
                                    {backup.size} • {backup.date ? new Date(backup.date).toLocaleString() : 'Unknown date'}
                                  </p>
                                </div>
                              </div>
                              {backup.status === 'completed' && (
                                <div className="flex gap-2">
                                  <button className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                    Restore
                                  </button>
                                  <button className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                    Download
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                          No backups found. Create your first backup above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
