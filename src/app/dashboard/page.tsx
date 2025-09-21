"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { useStore } from '@/components/StoreProvider';
import NoStoreOnboarding from '@/components/admin/NoStoreOnboarding';

export default function DashboardPage() {
  const { stores, loading } = useStore();
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
              {loading ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">Loading...</div>
              ) : stores.length === 0 ? (
                <NoStoreOnboarding />
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">You're authenticated. Go to Admin to manage your store.</p>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Navigation</h3>
                    <div className="space-y-2">
                      <a href="/admin" className="block text-blue-600 dark:text-blue-400 hover:underline">→ Admin Dashboard</a>
                      <a href="/" className="block text-blue-600 dark:text-blue-400 hover:underline">→ Home Page</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
