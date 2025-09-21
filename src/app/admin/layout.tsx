'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Navbar from '@/components/admin/Navbar';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-background'>
        <Navbar />
        <div className='flex'>
          <AdminSidebar />
          <main className='flex-1'>
            <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
