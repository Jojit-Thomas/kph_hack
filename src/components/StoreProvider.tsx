'use client';

import axios from '@/config/axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Store {
  id: string;
  name: string;
  description: string;
  handle: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreContextType {
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  stores: Store[];
  loading: boolean;
  error: string | null;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/store');
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch stores');
      }
      
      const storesData = response.data;
      setStores(storesData);
      
      // Auto-select first store if none selected and stores exist
      if (!selectedStore && storesData.length > 0) {
        setSelectedStore(storesData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
      // console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStores = async () => {
    await fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const value: StoreContextType = {
    selectedStore,
    setSelectedStore,
    stores,
    loading,
    error,
    refreshStores,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
