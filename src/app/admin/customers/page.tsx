'use client';

import React from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your customer database
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Customer Management
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This feature is coming soon. You'll be able to view and manage all your customers here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Email Marketing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Send targeted campaigns</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Customer Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track support tickets</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Purchase History</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">View order history</p>
          </div>
        </div>
      </div>
    </div>
  );
}
