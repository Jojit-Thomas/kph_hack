"use client";

import { useStore } from "@/components/StoreProvider";
import NoStoreOnboarding from "@/components/admin/NoStoreOnboarding";
import { Button } from "@/components/ui/button";

export default function StoresPage() {
  const { stores, loading } = useStore();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Stores</h1>
      </div>
      {loading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading...</div>
      ) : stores.length === 0 ? (
        <NoStoreOnboarding />
      ) : (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Store management coming soon. Create and manage multiple storefronts here.
          <div className="mt-4">
            <Button size="sm">Create another store</Button>
          </div>
        </div>
      )}
    </section>
  );
}
