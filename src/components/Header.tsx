'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { StoreSelector, StoreInfo } from './StoreSelector';
import { ModeToggle } from './ThemeToggler';
import { Button } from './ui/button';
import { LogOut, Home, Store, Settings } from 'lucide-react';

export function Header() {
  const { logout } = useAuth();
  const pathname = usePathname();

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                StoreHub
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                href="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/admin'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </nav>
          </div>

          {/* Right side - Store Selector, Theme Toggle, and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Store Selector - Only show on admin pages */}
            {pathname?.startsWith('/admin') && (
              <div className="flex items-center space-x-3">
                <StoreSelector />
                <StoreInfo />
              </div>
            )}
            
            <ModeToggle />
            
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
    </header>
  );
}
