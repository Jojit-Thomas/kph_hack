'use client';
import ProductCard from './ProductCard';
import { Product } from './cart/CartContext';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className='grid grid-cols-2 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
