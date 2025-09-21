'use client';

import { AlertCircle, ChevronDown, Loader2, Store } from 'lucide-react';
import { useStore } from './StoreProvider';

export function StoreSelector() {
  const { selectedStore, setSelectedStore, stores, loading, error } = useStore();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading stores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Error loading stores</span>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <a href="/admin" className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 hover:underline">
        <Store className="h-4 w-4" />
        <span className="text-sm">Create your first store</span>
      </a>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedStore?.id || ''}
        onChange={(e) => {
          const store = stores.find(s => s.id === e.target.value);
          setSelectedStore(store || null);
        }}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
      >
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export function StoreInfo() {
  const { selectedStore } = useStore();

  if (!selectedStore) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
      <Store className="h-4 w-4" />
      <span>Selected: {selectedStore.name}</span>
    </div>
  );
}
