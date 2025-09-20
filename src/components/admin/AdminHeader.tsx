'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import { StoreSelector, StoreInfo } from '../StoreSelector';
import { ModeToggle } from '../ThemeToggler';
import { Button } from '../ui/button';
import { LogOut, Store, Bell, User } from 'lucide-react';

export function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </span>
            </Link>
          </div>

          {/* Right side - Store Selector, Notifications, Theme, and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Store Selector */}
            <div className="flex items-center space-x-3">
              <StoreSelector />
              <StoreInfo />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            
            <ModeToggle />
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
