'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  role: string;
  bio: string;
}

interface DashboardStats {
  totalInvestments: number;
  totalInvested: number;
  carbonCredits: number;
  projectsSupported: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ProfilePageContent: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0,
    totalInvested: 0,
    carbonCredits: 0,
    projectsSupported: 0
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    memberSince: '',
    role: 'investor',
    bio: ''
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user) {
          const memberDate = new Date();
          setProfile({
            name: user.name || user.contactPerson || user.organizationName || user.companyName || 'User',
            email: user.email,
            phone: '',
            location: '',
            memberSince: memberDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            role: user.role === 'simple-user' ? 'investor' : user.role,
            bio: ''
          });
          setEditedProfile({
            name: user.name || user.contactPerson || user.organizationName || user.companyName || 'User',
            email: user.email,
            phone: '',
            location: '',
            memberSince: memberDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            role: user.role === 'simple-user' ? 'investor' : user.role,
            bio: ''
          });
        }

        try {
          const statsResponse = await api.dashboard.getStats();
          if (statsResponse.success && statsResponse.data) {
            setStats({
              totalInvestments: statsResponse.data.totalInvestments || 0,
              totalInvested: statsResponse.data.totalInvested || 0,
              carbonCredits: statsResponse.data.carbonCredits || statsResponse.data.totalCarbonCredits || 0,
              projectsSupported: statsResponse.data.projectsSupported || statsResponse.data.activeProjects || 0
            });
          }
        } catch (err) {
          console.log('Stats not available:', err);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      setProfile(editedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    setModalSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setModalError('New passwords do not match');
      setModalLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setModalError('New password must be at least 6 characters');
      setModalLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.success) {
        setModalSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setModalSuccess('');
        }, 2000);
      } else {
        setModalError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setModalError('An error occurred. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (data.success) {
        alert('Account deleted successfully. Goodbye!');
        logout();
        router.push('/');
      } else {
        setModalError(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setModalError('An error occurred. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">My Profile</h1>
            <p className="text-lg text-gray-600">Manage your account settings and personal information</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-3xl font-bold text-white">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 capitalize">
                    {profile.role}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900">{profile.memberSince}</p>
                  </div>
                  {profile.location && (
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Total Invested</span>
                    <span className="font-bold text-green-700">Rs. {stats.totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Investments</span>
                    <span className="font-bold text-blue-700">{stats.totalInvestments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Carbon Credits</span>
                    <span className="font-bold text-emerald-700">{stats.carbonCredits.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Projects</span>
                    <span className="font-bold text-purple-700">{stats.projectsSupported}</span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                >
                  View Dashboard
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Information */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700"
                    >
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        disabled
                        className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                        placeholder="Karachi, Pakistan"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Bio</label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Full Name</p>
                      <p className="mt-1 text-lg text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Email</p>
                      <p className="mt-1 text-lg text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone</p>
                      <p className="mt-1 text-lg text-gray-900">{profile.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Location</p>
                      <p className="mt-1 text-lg text-gray-900">{profile.location || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Bio</p>
                      <p className="mt-1 text-lg leading-relaxed text-gray-900">{profile.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Settings */}
              <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Account Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your investments</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full rounded-lg border-2 border-gray-300 px-6 py-3 text-left font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Change Password
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full rounded-lg border-2 border-red-300 px-6 py-3 text-left font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setModalError('');
                  setModalSuccess('');
                  setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{modalSuccess}</div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setModalError('');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                  }}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {modalLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-red-600">Delete Account</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setModalError('');
                  setDeletePassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Warning: This action cannot be undone</p>
                  <p className="mt-1 text-sm text-red-700">All your data including investments, activities, and wallet balance will be permanently deleted.</p>
                </div>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{modalError}</div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Enter your password to confirm</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
                  placeholder="Your current password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setModalError('');
                    setDeletePassword('');
                  }}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {modalLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;
