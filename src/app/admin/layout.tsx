'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

