'use client';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product, useCart } from './cart/CartContext';

export default function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { add, open } = useCart();
  return (
    <Button
      onClick={() => {
        add(product, 1);
        open();
      }}
      className={className}
    >
      <ShoppingCart className='size-4' />
      Add to cart
    </Button>
  );
}
