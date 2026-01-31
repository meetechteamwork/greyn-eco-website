'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type CarbonUserRole = 'Corporate Buyer' | 'Individual Buyer' | 'NGO Admin' | 'Verifier';

interface NavLink {
  label: string;
  href: string;
  icon: string;
  roles?: CarbonUserRole[]; // Optional roles for conditional display
}

const allNavLinks: NavLink[] = [
  { label: 'Marketplace', href: '/carbon/marketplace', icon: '🌳' },
  { label: 'My Dashboard', href: '/carbon/dashboard', icon: '📊' },
  { label: 'Projects', href: '/carbon/projects', icon: '📁' },
  { label: 'Cart', href: '/carbon/cart', icon: '🛒' },
  { label: 'Verification', href: '/carbon/verification', icon: '✅', roles: ['Verifier'] },
  { label: 'Retirement Ledger', href: '/carbon/ledger', icon: '📋' },
];

export default function CarbonSidebar() {
  const pathname = usePathname();
  const [currentUserRole, setCurrentUserRole] = useState<CarbonUserRole>('Individual Buyer'); // Mock role

  useEffect(() => {
    // Get user role from localStorage or default to Individual Buyer
    const storedRole = localStorage.getItem('carbonUserRole') as CarbonUserRole;
    if (storedRole && ['Corporate Buyer', 'Individual Buyer', 'NGO Admin', 'Verifier'].includes(storedRole)) {
      setCurrentUserRole(storedRole);
    }
  }, []);

  // Filter nav links based on user role
  const filteredNavLinks = allNavLinks.filter(link =>
    !link.roles || link.roles.includes(currentUserRole)
  );

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-center mb-2">
          <Image
            src="/GREYN Logo.png"
            alt="GREYN Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-600 font-medium text-center">Carbon Portal - Credit Marketplace</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-gray-900 hover:shadow-md'
                }
              `}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-sm' : ''}`}>
                {link.icon}
              </span>
              <span className="font-semibold text-sm">{link.label}</span>
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-sm animate-pulse"></span>
              )}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-200"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          <p className="font-semibold text-gray-700">Greyn Eco Platform</p>
          <p className="mt-1 text-gray-400">Carbon Credit v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
