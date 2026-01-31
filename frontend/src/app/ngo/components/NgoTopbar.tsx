'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function NgoTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Get user initials for avatar
  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'NG';

  // Navigation items
  const navItems = [
    { icon: '🌱', label: 'NGO Dashboard', href: '/ngo/dashboard' },
    { icon: '📋', label: 'NGO Details', href: '/ngo/details' },
    { icon: '👤', label: 'Person Details', href: '/ngo/person-details' },
    { icon: '🚀', label: 'Launch Project', href: '/ngo/launch' },
    { icon: '💰', label: 'Wallet', href: '/ngo/wallet' },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <header className="bg-gradient-to-r from-white via-green-50/30 to-white border-b border-gray-200/60 shadow-lg sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - NGO Name */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/ngo/dashboard')}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <span className="text-xl">🌱</span>
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-green-600 group-hover:via-emerald-500 group-hover:to-green-600 transition-all duration-300">
                {user?.ngoName || user?.name || 'NGO Portal'}
              </h1>
              <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-300">Non-Governmental Organization Portal</p>
            </div>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-105'
                      : hovered
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-md scale-105'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {/* Hover glow effect */}
                  {hovered && !active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-sm -z-10 animate-pulse"></div>
                  )}
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
                  )}
                  
                  {/* Icon with animation */}
                  <span className={`text-base transition-all duration-300 ${
                    active || hovered ? 'scale-110 rotate-3' : 'scale-100'
                  }`}>
                    {item.icon}
                  </span>
                  
                  {/* Label with underline animation */}
                  <span className="relative">
                    {item.label}
                    {hovered && !active && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></span>
                    )}
                  </span>
                  
                  {/* Ripple effect on click */}
                  <span className="absolute inset-0 rounded-xl bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                </button>
              );
            })}
          </nav>

          {/* Right Section - Role Badge & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Role Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 border border-green-300/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:bg-emerald-500 transition-colors"></div>
              <span className="text-xs font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">NGO Admin</span>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="relative flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-2.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95 group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                <svg
                  className="relative h-5 w-5 text-white transition-transform duration-300"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200/50 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Navigation Items for Mobile */}
                  <div className="px-2 py-2 border-b border-gray-200/50">
                    {navItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            setShowProfileDropdown(false);
                            router.push(item.href);
                          }}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            active
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:scale-105 active:scale-95'
                          }`}
                        >
                          <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110 rotate-3' : ''}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name || 'NGO User'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.email || 'ngo@example.com'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
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

            {/* Desktop Profile Avatar Dropdown */}
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 p-1.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95 group"
              >
                {/* Animated glow ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                
                {/* Avatar */}
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-green-600 shadow-inner group-hover:shadow-md transition-shadow duration-300">
                  {userInitials}
                </div>
                
                {/* Dropdown arrow */}
                <svg
                  className={`relative h-4 w-4 text-white transition-all duration-300 ${
                    showProfileDropdown ? 'rotate-180 scale-110' : 'group-hover:scale-110'
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200/50 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name || 'NGO User'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.email || 'ngo@example.com'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
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
      </div>
    </header>
  );
}
