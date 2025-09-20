import ProductGrid from '@/components/store/ProductGrid';
import StoreNav from '@/components/store/StoreNav';
import { CartProvider, type Product } from '@/components/store/cart/CartContext';
import CartSheet from '@/components/store/cart/CartSheet';

// For now we will use mock products; ideally fetch by slug.
function getMockProducts(slug: string): Product[] {
  const base: Product[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `${slug}-${i + 1}`,
    title: `${slug} Product ${i + 1}`,
    price: Number((Math.random() * 100 + 10).toFixed(2)),
    image: null,
    categorySlug: slug,
  }));
  return base;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = getMockProducts(slug);
  return (
    <CartProvider>
      <div className='min-h-screen'>
        <StoreNav />
        <main className='mx-auto w-full max-w-7xl'>
          <div className='px-4 py-4 sm:px-6'>
            <h1 className='text-base font-semibold tracking-tight capitalize'>{slug} store</h1>
          </div>
          <ProductGrid products={products} />
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
