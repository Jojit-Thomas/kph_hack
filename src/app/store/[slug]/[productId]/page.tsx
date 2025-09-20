import { CartProvider, type Product } from '@/components/store/cart/CartContext';
import CartSheet from '@/components/store/cart/CartSheet';
import ProductRow from '@/components/store/ProductRow';
import PurchasePanel from '@/components/store/PurchasePanel';
import StoreNav from '@/components/store/StoreNav';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// Mock fetch by slug and id; replace with real DB/API later
async function getProduct(slug: string, productId: string): Promise<Product | null> {
  // Generate a deterministic mock
  const n = Number(productId.split('-').pop() ?? '1');
  return {
    id: productId,
    title: `${slug} Product ${n}`,
    price: Number(((n % 50) + 19.99).toFixed(2)),
    image: null,
    description:
      'This is a sample product description. Replace this with real content from your database. It highlights key features and selling points.',
    categorySlug: slug,
  };
}

function makeMockList(slug: string, baseLabel: string, count = 10): Product[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${slug}-${baseLabel}-${i + 1}`,
    title: `${baseLabel} ${i + 1}`,
    price: Number(((i % 40) + 9.99).toFixed(2)),
    image: null,
    categorySlug: slug,
    description: undefined,
  }));
}

// Client add-to-cart button moved to a separate component

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;
  const product = await getProduct(slug, productId);
  const similar = makeMockList(slug, 'Similar Product');
  const mostBought = makeMockList(slug, 'Mostly Bought');

  return (
    <CartProvider>
      <div className='min-h-screen'>
        <StoreNav />
        <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6'>
          {/* Breadcrumbs */}
          <nav className='mb-6 text-xs text-muted-foreground'>
            <span className='hover:underline'>Store</span>
            <span className='mx-2'>/</span>
            <span className='hover:underline'>{slug}</span>
            <span className='mx-2'>/</span>
            <span className='text-foreground'>Product</span>
          </nav>
          {!product ? (
            <p className='text-sm text-muted-foreground'>Product not found.</p>
          ) : (
            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]'>
              {/* Left: Media + details */}
              <div className='space-y-6'>
                {/* Media gallery (single for now) */}
                <div className='relative overflow-hidden rounded-2xl border bg-secondary shadow-sm'>
                  <div className='relative aspect-square w-full'>
                    {product.image ? (
                      <Image src={product.image} alt={product.title} fill className='object-cover' />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-muted-foreground'>No image</div>
                    )}
                  </div>
                </div>

                {/* Title & meta */}
                <div>
                  <h1 className='text-2xl font-semibold tracking-tight'>{product.title}</h1>
                  <p className='mt-1 text-sm text-muted-foreground'>Category · {slug}</p>
                </div>

                <Separator />

                {/* Description */}
                {product.description ? (
                  <div className='prose prose-sm max-w-none dark:prose-invert'>
                    <p>{product.description}</p>
                  </div>
                ) : null}
              </div>

              {/* Right: Purchase sticky card */}
              <div className='space-y-6'>
                <div className='lg:sticky lg:top-24'>
                  <PurchasePanel product={product} />
                </div>
              </div>
            </div>
          )}
          {/* Rows */}
          <div className='mt-12 space-y-10'>
            <ProductRow title='Similar products' products={similar} />
            <ProductRow title='Mostly bought' products={mostBought} />
          </div>
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
