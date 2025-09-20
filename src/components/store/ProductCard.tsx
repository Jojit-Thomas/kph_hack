'use client';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, useCart } from './cart/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { add, open } = useCart();

  const onAdd = () => {
    add(product, 1);
    open();
  };

  const detailHref = `/store/${product.categorySlug ?? 'store'}/${product.id}`;
  
  // Get the first image from the images array or fall back to the image field
  const displayImage = product.images?.[0]?.url || product.image;
  
  // Use name from database or fall back to title for backward compatibility
  const productName = product.name || product.title || 'Untitled Product';

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs transition-colors'>
      <Link href={detailHref} className='relative aspect-square w-full overflow-hidden bg-secondary'>
        {displayImage ? (
          <Image src={displayImage} alt={productName} fill className='object-cover transition-transform duration-300 group-hover:scale-105' />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-sm text-muted-foreground'>Image</div>
        )}
      </Link>
      <div className='flex flex-1 flex-col gap-2 p-3'>
        <div className='min-w-0'>
          <Link href={detailHref} className='block truncate text-sm font-medium hover:underline'>
            {productName}
          </Link>
          <p className='text-sm text-muted-foreground'>${product.price.toFixed(2)}</p>
        </div>
        <div className='mt-auto flex items-center gap-2'>
          <Button onClick={onAdd} className='flex-1'>
            <ShoppingCart className='size-4' />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
