"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/store/ProductGrid";
import StoreNav from "@/components/store/StoreNav";
import { CartProvider, type Product } from "@/components/store/cart/CartContext";
import CartSheet from "@/components/store/cart/CartSheet";
import { Loader2, Package } from "lucide-react";

interface StoreData {
  id: string;
  name: string;
  description: string;
  handle: string;
  products: Product[];
}

interface StorePageProps {
  params: Promise<{ storeId: string }>;
}

export default function StorePage({ params }: StorePageProps) {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [storeId, setStoreId] = useState<string | null>(null);

  const MAX_POLLING_ATTEMPTS = 30; // 5 minutes with 10-second intervals
  const POLLING_INTERVAL = 10000; // 10 seconds

  useEffect(() => {
    const initializeStore = async () => {
      const resolvedParams = await params;
      setStoreId(resolvedParams.storeId);
      await fetchStoreData(resolvedParams.storeId);
    };

    initializeStore();
  }, [params]);

  const fetchStoreData = async (id: string) => {
    try {
      const response = await fetch(`/api/public/store/id/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Store not found");
        } else {
          setError("Failed to fetch store data");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setStoreData(data);
      setError(null);
      setLoading(false);

      // If we have products, stop polling
      if (data.products && data.products.length > 0) {
        setIsPolling(false);
        setPollingCount(0);
      } else {
        // Start polling if no products yet
        startPolling(id);
      }
    } catch (err) {
      console.error("Error fetching store data:", err);
      setError("Failed to fetch store data");
      setLoading(false);
    }
  };

  const startPolling = (id: string) => {
    setIsPolling(true);
    setPollingCount(0);
    
    const pollInterval = setInterval(async () => {
      setPollingCount(prev => {
        const newCount = prev + 1;
        
        // Stop polling after max attempts
        if (newCount >= MAX_POLLING_ATTEMPTS) {
          clearInterval(pollInterval);
          setIsPolling(false);
          return newCount;
        }
        
        // Fetch store data
        fetchStoreData(id);
        return newCount;
      });
    }, POLLING_INTERVAL);

    // Cleanup function
    return () => clearInterval(pollInterval);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl grid place-items-center my-auto">
          <div className="px-4 py-4 sm:px-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-base font-semibold tracking-tight">Loading store...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl grid place-items-center my-auto">
          <div className="px-4 py-4 sm:px-6">
            <h1 className="text-base font-semibold tracking-tight">Store not found</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {error || "The store could not be found."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Transform products to include backward compatibility fields
  const products: Product[] = storeData.products.map((product) => ({
    ...product,
    title: product.name, // Add title for backward compatibility
    categorySlug: storeData.handle, // Add categorySlug for navigation
  }));

  return (
    <CartProvider>
      <div className="min-h-screen">
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl">
          <div className="px-4 py-4 sm:px-6">
            <h1 className="text-base font-semibold tracking-tight">{storeData.name}</h1>
            {storeData.description && <p className="text-sm text-muted-foreground mt-1">{storeData.description}</p>}
            
            {/* Import Status */}
            {isPolling && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Importing products from Instagram...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-200">
                      Found {storeData.products.length} products so far • 
                      {Math.floor((pollingCount * POLLING_INTERVAL) / 1000)}s elapsed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="px-4 py-8 sm:px-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {isPolling ? "Importing products..." : "No products yet"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPolling 
                    ? "Products are being imported from your Instagram profile. This may take a few minutes."
                    : "Products will appear here once they're imported."
                  }
                </p>
              </div>
            </div>
          )}
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
