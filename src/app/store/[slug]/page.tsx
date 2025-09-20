// import StoreNav from "@/components/store/StoreNav";
// import { CartProvider, type Product } from "@/components/store/cart/CartContext";
// import CartSheet from "@/components/store/cart/CartSheet";
// import axios from "@/config/axios";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import CategoryGrid from "@/components/store/CategoryGrid";
// import ProductRow from "@/components/store/ProductRow";

// interface StoreData {
//   id: string;
//   name: string;
//   description: string;
//   handle: string;
//   products: Product[];
// }

// async function getStoreData(slug: string): Promise<StoreData | null> {
//   try {
//     const response = await axios.get(`/public/store/${slug}`);

//     console.log(response.data);

//     if (response.status !== 200) {
//       if (response.status === 404) {
//         return null;
//       }
//       throw new Error(`Failed to fetch store: ${response.statusText}`);
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching store data:", error);
//     return null;
//   }
// }

// export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
//   const storeData = await getStoreData(slug);

//   if (!storeData) {
//     return (
//       <div className="min-h-screen">
//         <StoreNav />
//         <main className="mx-auto w-full max-w-7xl">
//           <div className="px-4 py-4 sm:px-6">
//             <h1 className="text-base font-semibold tracking-tight">Store not found</h1>
//             <p className="text-sm text-muted-foreground mt-2">The store "{slug}" could not be found.</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <CartProvider>
//       <div className="min-h-screen">
//         <StoreNav />
//         <main className="mx-auto w-full max-w-7xl">
//           {/* Hero */}
//           <div className="px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
//             <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//               <div>
//                 <h1 className="capitalize tracking-tight text-2xl font-semibold sm:text-3xl">{slug} store</h1>
//                 <p className="text-sm text-muted-foreground">Discover curated picks, new arrivals, and best sellers.</p>
//               </div>
//               {/* Quick filters (placeholder UI) */}
//               <div className="mt-2 flex flex-wrap gap-2 sm:mt-0">
//                 <Button variant="outline" size="sm">
//                   All
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   New
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Most bought
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Price
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <Separator className="mb-6" />

//           <section className="px-4 sm:px-6">
//             <h2 className="mb-2 text-base font-semibold tracking-tight">Most bought by shoppers</h2>
//             <p className="mb-3 text-sm text-muted-foreground">Popular picks people can’t stop buying.</p>
//             <ProductRow title="" products={storeData.products} />
//           </section>

//           {/* Sections */}
//           {/* <div className="space-y-8 sm:space-y-10">
//             <section>
//               <div className="px-4 sm:px-6">
//                 <h2 className="text-base font-semibold tracking-tight">Categories</h2>
//                 <p className="mb-3 mt-1 text-sm text-muted-foreground">Browse all categories.</p>
//               </div>
//               <CategoryGrid categories={storeData.categories} />
//             </section>

//             <Separator />

//             <section className="px-4 sm:px-6">
//               <h2 className="mb-2 text-base font-semibold tracking-tight">Most bought by shoppers</h2>
//               <p className="mb-3 text-sm text-muted-foreground">Popular picks people can’t stop buying.</p>
//               <ProductRow title="" products={mostBought} />
//             </section>

//             <Separator />

//             <section className="px-4 sm:px-6">
//               <h2 className="mb-2 text-base font-semibold tracking-tight">New arrivals</h2>
//               <p className="mb-3 text-sm text-muted-foreground">Fresh drops just in.</p>
//               <ProductRow title="" products={newArrivals} />
//             </section>
//           </div> */}
//         </main>
//         <CartSheet />
//       </div>
//     </CartProvider>
//   );
// }

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
    console.error("Error fetching store data:", error);
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storeData = await getStoreData(slug);

  if (!storeData) {
    return (
      <div className="min-h-screen">
        <StoreNav />
        <main className="mx-auto w-full max-w-7xl">
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
