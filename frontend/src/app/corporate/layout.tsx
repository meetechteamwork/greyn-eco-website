'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import CorporateSidebar from './components/CorporateSidebar';
import CorporateTopbar from './components/CorporateTopbar';

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['corporate']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <CorporateSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <CorporateTopbar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

