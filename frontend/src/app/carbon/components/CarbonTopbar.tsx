'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

type CarbonUserRole = 'Corporate Buyer' | 'Individual Buyer' | 'NGO Admin' | 'Verifier';

export default function CarbonTopbar() {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<CarbonUserRole>('Individual Buyer'); // Mock role
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user role from localStorage or default to Individual Buyer
    const storedRole = localStorage.getItem('carbonUserRole') as CarbonUserRole;
    if (storedRole && ['Corporate Buyer', 'Individual Buyer', 'NGO Admin', 'Verifier'].includes(storedRole)) {
      setCurrentUserRole(storedRole);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRoleChange = (newRole: CarbonUserRole) => {
    setCurrentUserRole(newRole);
    localStorage.setItem('carbonUserRole', newRole);
    // In a real app, you might trigger a page refresh or re-fetch data
  };

  // Get user initials for avatar
  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'CC';

  // Role badge colors
  const getRoleBadgeStyle = (role: CarbonUserRole) => {
    switch (role) {
      case 'Corporate Buyer':
        return 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700';
      case 'Individual Buyer':
        return 'from-green-50 to-emerald-50 border-green-200 text-green-700';
      case 'NGO Admin':
        return 'from-purple-50 to-pink-50 border-purple-200 text-purple-700';
      case 'Verifier':
        return 'from-orange-50 to-amber-50 border-orange-200 text-orange-700';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200 text-gray-700';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Portal Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Carbon Credit Marketplace
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Invest in verified carbon offset projects</p>
          </div>
        </div>

        {/* Right Section - Role Badge & Profile */}
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getRoleBadgeStyle(currentUserRole)} border shadow-sm`}>
            <span className="text-xs font-bold">{currentUserRole}</span>
          </div>

          {/* Profile Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-1.5 shadow-md transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-green-600 shadow-sm">
                {userInitials}
              </div>
              <svg
                className={`h-4 w-4 text-white transition-transform ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.name || 'Carbon User'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {user?.email || 'user@carbonmarket.com'}
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Switch Role (Mock)
                  </label>
                  <select
                    value={currentUserRole}
                    onChange={(e) => handleRoleChange(e.target.value as CarbonUserRole)}
                    className="w-full p-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold bg-white hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  >
                    <option value="Corporate Buyer">Corporate Buyer</option>
                    <option value="Individual Buyer">Individual Buyer</option>
                    <option value="NGO Admin">NGO Admin</option>
                    <option value="Verifier">Verifier</option>
                  </select>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Profile Settings
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Preferences
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Help & Support
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 pt-1 mt-1">
                  <button 
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
