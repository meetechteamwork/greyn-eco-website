'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type EmployeeRole = 'Corporate Admin' | 'Sustainability Manager' | 'HR Manager' | 'Finance Manager' | 'Employee';

interface NavLink {
  label: string;
  href: string;
  icon: string;
  allowedRoles: EmployeeRole[]; // Roles that can see this link
}

const allNavLinks: NavLink[] = [
  { label: 'Dashboard', href: '/corporate/dashboard', icon: '📊', allowedRoles: ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee'] },
  { label: 'CO₂ Emissions', href: '/corporate/emissions', icon: '🌍', allowedRoles: ['Corporate Admin', 'Sustainability Manager', 'Employee'] },
  { label: 'Volunteers', href: '/corporate/volunteers', icon: '👥', allowedRoles: ['Corporate Admin', 'HR Manager', 'Sustainability Manager', 'Employee'] },
  { label: 'Campaigns', href: '/corporate/campaigns', icon: '📢', allowedRoles: ['Corporate Admin', 'Sustainability Manager', 'Employee'] },
  { label: 'ESG Reports', href: '/corporate/reports', icon: '📈', allowedRoles: ['Corporate Admin', 'Sustainability Manager', 'Finance Manager'] },
  { label: 'Employees', href: '/corporate/employees', icon: '👤', allowedRoles: ['Corporate Admin', 'HR Manager'] },
  { label: 'Profile Settings', href: '/corporate/profile-settings', icon: '👤', allowedRoles: ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee'] },
];

export default function CorporateSidebar() {
  const pathname = usePathname();
  const [employeeRole, setEmployeeRole] = useState<EmployeeRole>('Corporate Admin');

  useEffect(() => {
    // Get employee role from localStorage or default to Corporate Admin
    const storedRole = localStorage.getItem('employeeRole') as EmployeeRole;
    if (storedRole && ['Corporate Admin', 'Sustainability Manager', 'HR Manager', 'Finance Manager', 'Employee'].includes(storedRole)) {
      setEmployeeRole(storedRole);
    }
  }, []);

  // Filter nav links based on employee role
  const navLinks = allNavLinks.filter(link => link.allowedRoles.includes(employeeRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <Image
            src="/GREYN Logo.png"
            alt="GREYN Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">Corporate Portal - ESG Management</p>
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


