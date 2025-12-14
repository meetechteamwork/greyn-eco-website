'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isENGO, isSimpleUser, user } = useAuth();
  
  // Debug: Log ENGO status (remove after testing)
  useEffect(() => {
    console.log('Header - isENGO:', isENGO, 'user role:', user?.role);
  }, [isENGO, user?.role]);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showENGOMenu, setShowENGOMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Legacy admin check (keeping for existing admin pages)
  const isAdmin = false; // Can be enabled if needed

  // Base navigation links (visible to all)
  // Dashboard routes to ENGO dashboard for ENGO users, simple dashboard for simple users
  const baseNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Products', href: '/products' },
    { label: 'Dashboard', href: isENGO ? '/engo/dashboard' : '/dashboard' }
  ];

  // Activity Bar link (only for simple users)
  const activityLink = isSimpleUser ? [{ label: 'Activity Bar', href: '/activities' }] : [];

  // Wallet link (only for ENGO users)
  const walletLink = isENGO ? [{ label: 'Wallet', href: '/wallet' }] : [];

  // Combine navigation links (Analytics merged into Dashboard for simple users)
  const primaryNavLinks = [...baseNavLinks, ...activityLink, ...walletLink];

  const adminMenuLinks = [
    { label: 'Admin Dashboard', href: '/admin', icon: '📊' },
    { label: 'Manage Projects', href: '/admin/projects', icon: '📂' },
    { label: 'Manage Users', href: '/admin/users', icon: '👥' },
    { label: 'Platform Analytics', href: '/admin/analytics', icon: '📈' }
  ];

  const engoMenuLinks = [
    { label: 'ENGO Dashboard', href: '/engo/dashboard', icon: '🌱' },
    { label: 'ENGO Details', href: '/engo/details', icon: '📋' },
    { label: 'Person Details', href: '/engo/person-details', icon: '👤' },
    { label: 'Launch Project', href: '/engo/launch', icon: '🚀' }
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setShowAdminMenu(false);
    setShowENGOMenu(false);
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a4d2e] px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Greyn Eco Logo"
            >
              {/* Brick pattern */}
              <rect x="4" y="6" width="6" height="4" fill="#1a4d2e" />
              <rect x="11" y="6" width="6" height="4" fill="#1a4d2e" />
              <rect x="18" y="6" width="6" height="4" fill="#1a4d2e" />
              
              <rect x="7.5" y="11" width="6" height="4" fill="#1a4d2e" />
              <rect x="14.5" y="11" width="6" height="4" fill="#1a4d2e" />
              
              <rect x="4" y="16" width="6" height="4" fill="#1a4d2e" />
              <rect x="11" y="16" width="6" height="4" fill="#1a4d2e" />
              <rect x="18" y="16" width="6" height="4" fill="#1a4d2e" />
              
              <rect x="7.5" y="21" width="6" height="4" fill="#1a4d2e" />
              <rect x="14.5" y="21" width="6" height="4" fill="#1a4d2e" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-white">
            Greyn Eco
          </span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="hidden flex-1 mx-8 lg:block">
          <ul className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {primaryNavLinks.map((link) => {
              // Ensure Dashboard link always goes to correct dashboard based on role
              const href = link.label === 'Dashboard' 
                ? (isENGO ? '/engo/dashboard' : '/dashboard')
                : link.href;
              return (
                <li key={`${link.label}-${href}`}>
                  <Link
                    href={href}
                    className="relative text-base font-medium text-white transition-colors hover:text-green-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            
            {/* ENGO Dropdown - Only visible for ENGO users */}
            {isENGO && (
              <li className="relative">
                <button
                  onClick={() => setShowENGOMenu(!showENGOMenu)}
                  className="relative flex items-center gap-1 text-base font-medium text-white transition-colors hover:text-green-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
                >
                  ENGO
                  <svg className={`h-4 w-4 transition-transform ${showENGOMenu ? 'rotate-180' : ''}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {showENGOMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-lg bg-white shadow-xl py-2">
                    {engoMenuLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50"
                        onClick={() => setShowENGOMenu(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}

            {/* Admin Dropdown - Legacy support */}
            {isAdmin && (
              <li className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="relative flex items-center gap-1 text-base font-medium text-white transition-colors hover:text-green-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Admin
                  <svg className={`h-4 w-4 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {showAdminMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-lg bg-white shadow-xl py-2">
                    {adminMenuLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50"
                        onClick={() => setShowAdminMenu(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
        
        {/* Auth & User Menu */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Show Login/Signup buttons when NOT authenticated */}
          {!isAuthenticated && (
            <>
              {/* Login Button - Ghost Style */}
              <Link
                href="/auth"
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg border-2 border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                <span className="relative z-10">Login</span>
              </Link>

              {/* Get Started Button - Primary Style */}
              <Link
                href="/auth"
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#1a4d2e] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative z-10">Get Started</span>
                <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </>
          )}

          {/* User Menu - Show when authenticated */}
          {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1a4d2e]">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <svg className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-white shadow-xl py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </Link>
              <Link
                href={isENGO ? '/engo/dashboard' : '/dashboard'}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Dashboard
              </Link>
              <div className="my-2 border-t border-gray-200"></div>
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/auth');
                }}
              >
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/30 p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden absolute inset-x-0 top-full rounded-b-3xl border-t border-white/20 bg-gradient-to-b from-white via-white/95 to-white/90 px-6 pb-8 pt-6 shadow-[0_20px_45px_rgba(0,0,0,0.15)] backdrop-blur"
        >
          <div className="space-y-8">
            <div className="grid gap-2">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-gray-100/80 bg-gradient-to-r from-white to-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></span>
                    {link.label}
                  </span>
                  <svg
                    className="h-4 w-4 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* ENGO Menu - Only visible for ENGO users */}
            {isENGO && (
              <div className="space-y-4 border-t border-gray-100 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                  ENGO
                </p>
                <div className="grid gap-3">
                  {engoMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 text-lg">
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      <svg
                        className="h-4 w-4 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Menu - Legacy support */}
            {isAdmin && (
              <div className="space-y-4 border-t border-gray-100 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Admin
                </p>
                <div className="grid gap-3">
                  {adminMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 text-lg">
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      <svg
                        className="h-4 w-4 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 border-t border-gray-100 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                {isAuthenticated ? 'Account' : 'Join Greyn Eco'}
              </p>
              {isAuthenticated ? (
                <div className="grid gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white"
                    onClick={closeMobileMenu}
                  >
                    <span>Profile</span>
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href={isENGO ? '/engo/dashboard' : '/dashboard'}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white"
                    onClick={closeMobileMenu}
                  >
                    <span>Dashboard</span>
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-500/10 to-red-500/5 px-4 py-3 text-sm font-semibold text-red-600 shadow-inner transition-all hover:-translate-y-0.5 hover:from-red-500/20 hover:to-red-500/10"
                    onClick={() => {
                      closeMobileMenu();
                      router.push('/auth');
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/auth"
                    className="flex items-center justify-center rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01]"
                    onClick={closeMobileMenu}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

