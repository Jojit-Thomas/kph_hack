"use client";

import { useStore } from "@/components/StoreProvider";
import AdminMetrics from "@/components/admin/AdminMetrics";
import NoStoreOnboarding from "@/components/admin/NoStoreOnboarding";
import axios from "@/config/axios";
import Link from "next/link";
import React from "react";

const AdminHomePage = () => {
  const { stores, loading, selectedStore } = useStore();
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [hasProducts, setHasProducts] = React.useState<boolean | null>(null);
  const [loadingMetrics, setLoadingMetrics] = React.useState(false);
  const [metrics, setMetrics] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStore) {
        setHasProducts(null);
        return;
      }
      try {
        setLoadingProducts(true);
        const res = await axios.get(`/product`, { params: { storeId: selectedStore.id } });
        const products = res.data as Array<any>;
        setHasProducts((products?.length ?? 0) > 0);
      } catch {
        setHasProducts(null);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedStore]);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      if (!selectedStore) {
        setMetrics(null);
        return;
      }
      try {
        setLoadingMetrics(true);
        // For now, we'll use mock data. In the future, this would call actual API endpoints
        const mockMetrics = {
          totalProducts: hasProducts ? Math.floor(Math.random() * 50) + 1 : 0,
          totalRevenue: Math.floor(Math.random() * 10000),
          totalOrders: Math.floor(Math.random() * 100),
          totalCustomers: Math.floor(Math.random() * 200),
          revenueChange: "+12% from last month",
          ordersChange: "+8% from last month",
          storeViews: Math.floor(Math.random() * 1000),
          conversionRate: (Math.random() * 5).toFixed(1),
        };
        setMetrics(mockMetrics);
      } catch {
        setMetrics(null);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, [selectedStore, hasProducts]);

  if (loading) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (stores.length === 0) {
    return <NoStoreOnboarding />;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
      
      <AdminMetrics loading={loadingMetrics} metrics={metrics} />
      
      {selectedStore && hasProducts === false ? (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">You've created "{selectedStore.name}".</h2>
          <p className="mt-1 text-sm text-muted-foreground">Now add your products to share your link.</p>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/admin/products/create" className="text-sm text-blue-600 hover:underline">Add products</Link>
            <Link href={`/store/${selectedStore.handle}`} className="text-sm text-blue-600 hover:underline">View store link</Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          {loadingProducts ? 'Checking your products…' : 'Choose Products to start adding items to your store, or Stores to manage settings.'}
        </div>
      )}
    </section>
  );
};

export default AdminHomePage;