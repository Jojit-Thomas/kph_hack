import ProductGrid from "@/components/store/ProductGrid";
import StoreNav from "@/components/store/StoreNav";
import { CartProvider, type Product } from "@/components/store/cart/CartContext";
import CartSheet from "@/components/store/cart/CartSheet";
import axios from "@/config/axios";

interface StoreData {
  id: string;
  name: string;
  description: string;
  handle: string;
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
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl">
          <div className="px-4 py-4 sm:px-6">
            <h1 className="text-base font-semibold tracking-tight">{storeData.name}</h1>
            {storeData.description && <p className="text-sm text-muted-foreground mt-1">{storeData.description}</p>}
          </div>
          <ProductGrid products={products} />
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
