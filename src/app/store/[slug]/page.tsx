import ProductGrid from "@/components/store/ProductGrid";
import StoreNav from "@/components/store/StoreNav";
import { CartProvider, type Product } from "@/components/store/cart/CartContext";
import CartSheet from "@/components/store/cart/CartSheet";
import axios from "@/config/axios";
import { checkAuth } from "@/lib/auth/server";
import Link from "next/link";

interface StoreData {
  id: string;
  name: string;
  description: string;
  handle: string;
  ownerId: string;
  products: Product[];
}

async function getStoreData(slug: string): Promise<StoreData | null> {
  try {
    const response = await axios.get(`/public/store/${slug}`);

    return response.data;
  } catch (error) {
    console.log("Error fetching store data:", error);
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storeData = await getStoreData(slug);
  const auth = await checkAuth();

  if (!storeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl grid place-items-center my-auto">
          <div className="px-4 py-4 sm:px-6">
            <h1 className="text-base font-semibold tracking-tight">Store not found</h1>
            <p className="text-sm text-muted-foreground mt-2">The store "{slug}" could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  // Transform products to include backward compatibility fields
  const products: Product[] = storeData.products.map((product) => ({
    ...product,
    title: product.name, // Add title for backward compatibility
    categorySlug: slug, // Add categorySlug for navigation
  }));

  return (
    <CartProvider>
      <div className="min-h-screen">
        <StoreNav storeName={storeData.name} />
        <main className="mx-auto w-full max-w-7xl">
          <div className="px-4 py-4 sm:px-6">
            <h1 className="text-base font-semibold tracking-tight">{storeData.name}</h1>
            {storeData.description && <p className="text-sm text-muted-foreground mt-1">{storeData.description}</p>}
          </div>
          {products.length === 0 ? (
            <div className="px-4 pb-12 sm:px-6">
              <div className="grid place-items-center rounded-xl border bg-card p-8 text-center">
                <h2 className="text-lg font-semibold">You’ve created “{storeData.name}”.</h2>
                <p className="mt-2 text-sm text-muted-foreground">Now add your products to share your link.</p>
                {auth.isAuthenticated && auth.user.userId === storeData.ownerId && (
                  <div className="mt-4 flex items-center gap-3">
                    <Link href="/admin/products/create" className="text-sm text-blue-600 hover:underline">Add products</Link>
                    <Link href={`/store/${slug}`} className="text-sm text-blue-600 hover:underline">View store link</Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
