'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import CarbonSidebar from './components/CarbonSidebar';
import CarbonTopbar from './components/CarbonTopbar';

export default function CarbonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['carbon', 'simple-user', 'ngo', 'corporate']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <CarbonSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <CarbonTopbar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

