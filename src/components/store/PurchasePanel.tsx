'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Product } from './cart/CartContext';
import { useCart } from './cart/CartContext';

export default function PurchasePanel({ product, className }: { product: Product; className?: string }) {
  const { add, open } = useCart();
  const [qty, setQty] = useState(1);

  const priceTotal = useMemo(() => (product.price * qty).toFixed(2), [product.price, qty]);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));
  const onAdd = () => {
    add(product, qty);
    open();
  };

  return (
    <div className={['rounded-xl border bg-card/50 p-4 shadow-sm', className].filter(Boolean).join(' ')}>
      <div className='flex items-baseline justify-between gap-2'>
        <h2 className='text-lg font-semibold tracking-tight'>${product.price.toFixed(2)}</h2>
        <span className='text-xs text-muted-foreground'>incl. taxes</span>
      </div>

      <Separator className='my-4' />

      <div className='flex items-center justify-between gap-3'>
        <div className='text-sm'>Quantity</div>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex size-8 items-center justify-center rounded-md border hover:bg-accent'
            onClick={dec}
            aria-label='Decrease quantity'
          >
            <Minus className='size-4' />
          </button>
          <span className='min-w-8 text-center text-sm tabular-nums'>{qty}</span>
          <button
            className='inline-flex size-8 items-center justify-center rounded-md border hover:bg-accent'
            onClick={inc}
            aria-label='Increase quantity'
          >
            <Plus className='size-4' />
          </button>
        </div>
      </div>

      <div className='mt-4 rounded-md bg-muted/40 p-3 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Total</span>
          <span className='font-medium'>${priceTotal}</span>
        </div>
      </div>

      <Button onClick={onAdd} className='mt-4 w-full'>
        <ShoppingCart className='size-4' />
        Add to cart
      </Button>
    </div>
  );
}
