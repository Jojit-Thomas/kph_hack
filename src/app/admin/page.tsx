import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Admin Dashboard
              </h1>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome to the admin area. This page is protected and only accessible to authenticated users.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Authentication Status
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    ✅ You are successfully authenticated and can access this protected route.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                    Route Protection
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    This route is protected by both middleware (server-side) and ProtectedRoute component (client-side).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
