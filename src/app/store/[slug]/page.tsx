import type { Category } from '@/components/store/CategoryCard';
import CategoryGrid from '@/components/store/CategoryGrid';
import ProductRow from '@/components/store/ProductRow';
import StoreNav from '@/components/store/StoreNav';
import { CartProvider, type Product } from '@/components/store/cart/CartContext';
import CartSheet from '@/components/store/cart/CartSheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// For now we use mock products; ideally fetch by slug when backend exists.
function getMockProducts(slug: string): Product[] {
  const base: Product[] = Array.from({ length: 24 }).map((_, i) => ({
    id: `${slug}-${i + 1}`,
    title: `${slug} product ${i + 1}`,
    price: Number((Math.random() * 100 + 10).toFixed(2)),
    image: null,
    categorySlug: slug,
  }));
  return base;
}

function indexFromId(id: string) {
  const n = id.split('-').pop() ?? '0';
  const parsed = Number.parseInt(n, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Mock categories until backend is ready
function getMockCategories(): Category[] {
  const cats = [
    { slug: 'groceries', title: 'Groceries' },
    { slug: 'pharmacy', title: 'Pharmacy' },
    { slug: 'electronics', title: 'Electronics' },
    { slug: 'beauty', title: 'Beauty & Personal Care' },
    { slug: 'home', title: 'Home & Kitchen' },
    { slug: 'fashion', title: 'Fashion' },
    { slug: 'sports', title: 'Sports & Outdoors' },
    { slug: 'books', title: 'Books' },
  ];
  return cats;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = getMockProducts(slug);
  const categories = getMockCategories();

  // Compose sections from available data (mock heuristics for now)
  const mostBought = [...products]
    .sort((a, b) => ((indexFromId(b.id) * 37) % 101) - ((indexFromId(a.id) * 37) % 101))
    .slice(0, 10);
  const newArrivals = [...products].sort((a, b) => indexFromId(b.id) - indexFromId(a.id)).slice(0, 10);

  return (
    <CartProvider>
      <div className='min-h-screen'>
        <StoreNav />
        <main className='mx-auto w-full max-w-7xl'>
          {/* Hero */}
          <div className='px-4 pb-4 pt-6 sm:px-6 sm:pb-6'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <h1 className='capitalize tracking-tight text-2xl font-semibold sm:text-3xl'>{slug} store</h1>
                <p className='text-sm text-muted-foreground'>Discover curated picks, new arrivals, and best sellers.</p>
              </div>
              {/* Quick filters (placeholder UI) */}
              <div className='mt-2 flex flex-wrap gap-2 sm:mt-0'>
                <Button variant='outline' size='sm'>All</Button>
                <Button variant='outline' size='sm'>New</Button>
                <Button variant='outline' size='sm'>Most bought</Button>
                <Button variant='outline' size='sm'>Price</Button>
              </div>
            </div>
          </div>

          <Separator className='mb-6' />

          {/* Sections */}
          <div className='space-y-8 sm:space-y-10'>
            <section>
              <div className='px-4 sm:px-6'>
                <h2 className='text-base font-semibold tracking-tight'>Categories</h2>
                <p className='mb-3 mt-1 text-sm text-muted-foreground'>Browse all categories.</p>
              </div>
              <CategoryGrid categories={categories} />
            </section>

            <Separator />

            <section className='px-4 sm:px-6'>
              <h2 className='mb-2 text-base font-semibold tracking-tight'>Most bought by shoppers</h2>
              <p className='mb-3 text-sm text-muted-foreground'>Popular picks people can’t stop buying.</p>
              <ProductRow title='' products={mostBought} />
            </section>

            <Separator />

            <section className='px-4 sm:px-6'>
              <h2 className='mb-2 text-base font-semibold tracking-tight'>New arrivals</h2>
              <p className='mb-3 text-sm text-muted-foreground'>Fresh drops just in.</p>
              <ProductRow title='' products={newArrivals} />
            </section>
          </div>
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
