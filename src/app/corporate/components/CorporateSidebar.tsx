'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  label: string;
  href: string;
  icon: string;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/corporate/dashboard', icon: '📊' },
  { label: 'CO₂ Emissions', href: '/corporate/emissions', icon: '🌍' },
  { label: 'Volunteers', href: '/corporate/volunteers', icon: '👥' },
  { label: 'Campaigns', href: '/corporate/campaigns', icon: '📢' },
  { label: 'ESG Reports', href: '/corporate/reports', icon: '📈' },
  { label: 'Employees', href: '/corporate/employees', icon: '👤' },
];

export default function CorporateSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Corporate Portal</h2>
        <p className="mt-1 text-xs text-gray-500">ESG Management</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Greyn Eco Platform</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}


