'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  role: 'investor' | 'admin';
  bio: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    memberSince: 'January 2024',
    role: 'investor',
    bio: 'Passionate about sustainable investing and environmental conservation. Looking to make a positive impact through green investments.'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // Stats data
  const stats = {
    totalInvestments: 4,
    totalInvested: 5500,
    carbonCredits: 142.75,
    projectsSupported: 4
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account settings and personal information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-3xl font-bold text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
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
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{profile.location}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Total Invested</span>
                    <span className="font-bold text-green-700">${stats.totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Investments</span>
                    <span className="font-bold text-blue-700">{stats.totalInvestments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Carbon Credits</span>
                    <span className="font-bold text-emerald-700">{stats.carbonCredits}</span>
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Bio</label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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
                      <p className="mt-1 text-lg text-gray-900">{profile.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600">Location</p>
                      <p className="mt-1 text-lg text-gray-900">{profile.location}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600">Bio</p>
                      <p className="mt-1 text-lg leading-relaxed text-gray-900">{profile.bio}</p>
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

                  <button className="w-full rounded-lg border-2 border-gray-300 px-6 py-3 text-left font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    Change Password
                  </button>

                  <button className="w-full rounded-lg border-2 border-red-300 px-6 py-3 text-left font-semibold text-red-600 transition-colors hover:bg-red-50">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

