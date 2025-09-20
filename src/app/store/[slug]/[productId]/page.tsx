import { CartProvider, type Product } from '@/components/store/cart/CartContext';
import CartSheet from '@/components/store/cart/CartSheet';
import ProductRow from '@/components/store/ProductRow';
import PurchasePanel from '@/components/store/PurchasePanel';
import StoreNav from '@/components/store/StoreNav';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  storeId: string;
  store: {
    id: string;
    name: string;
    handle: string;
  };
  images: Array<{
    id: string;
    url: string;
    position: number;
  }>;
}

async function getProduct(productId: string): Promise<ProductData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/public/product/${productId}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getStoreProducts(storeHandle: string, excludeProductId?: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/public/store/${storeHandle}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const storeData = await response.json();
    const products = storeData.products || [];
    
    // Filter out the current product and limit to 10
    const filteredProducts = products
      .filter((product: ProductData) => product.id !== excludeProductId)
      .slice(0, 10)
      .map((product: ProductData) => ({
        ...product,
        title: product.name, // Add title for backward compatibility
        categorySlug: storeHandle, // Add categorySlug for navigation
      }));
    
    return filteredProducts;
  } catch (error) {
    console.error('Error fetching store products:', error);
    return [];
  }
}

// Client add-to-cart button moved to a separate component

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;
  const productData = await getProduct(productId);
  
  if (!productData) {
    return (
      <div className='min-h-screen'>
        <StoreNav />
        <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6'>
          <p className='text-sm text-muted-foreground'>Product not found.</p>
        </main>
      </div>
    );
  }

  // Transform product data to match Product type
  const product: Product = {
    ...productData,
    title: productData.name, // Add title for backward compatibility
    categorySlug: slug, // Add categorySlug for navigation
  };

  // Get related products from the same store
  const similar = await getStoreProducts(slug, productId);
  const mostBought = similar.slice(0, 5); // Use first 5 as "most bought"

  // Get the first image or fall back to null
  const displayImage = productData.images?.[0]?.url || null;

  return (
    <CartProvider>
      <div className='min-h-screen'>
        <StoreNav />
        <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6'>
          {/* Breadcrumbs */}
          <nav className='mb-6 text-xs text-muted-foreground'>
            <span className='hover:underline'>Store</span>
            <span className='mx-2'>/</span>
            <span className='hover:underline'>{productData.store.name}</span>
            <span className='mx-2'>/</span>
            <span className='text-foreground'>{productData.name}</span>
          </nav>
          
          <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]'>
            {/* Left: Media + details */}
            <div className='space-y-6'>
              {/* Media gallery */}
              <div className='relative overflow-hidden rounded-2xl border bg-secondary shadow-sm'>
                <div className='relative aspect-square w-full'>
                  {displayImage ? (
                    <Image src={displayImage} alt={productData.name} fill className='object-cover' />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-muted-foreground'>No image</div>
                  )}
                </div>
              </div>

              {/* Title & meta */}
              <div>
                <h1 className='text-2xl font-semibold tracking-tight'>{productData.name}</h1>
                <p className='mt-1 text-sm text-muted-foreground'>{productData.store.name}</p>
              </div>

              <Separator />

              {/* Description */}
              {productData.description ? (
                <div className='prose prose-sm max-w-none dark:prose-invert'>
                  <p>{productData.description}</p>
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
          
          {/* Related products */}
          {similar.length > 0 && (
            <div className='mt-12 space-y-10'>
              <ProductRow title='Similar products' products={similar} />
              {mostBought.length > 0 && (
                <ProductRow title='Other products from this store' products={mostBought} />
              )}
            </div>
          )}
        </main>
        <CartSheet />
      </div>
    </CartProvider>
  );
}
