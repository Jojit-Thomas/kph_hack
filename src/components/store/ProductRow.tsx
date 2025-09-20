import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/components/store/cart/CartContext';

export default function ProductRow({ title, products }: { title: string; products: Product[] }) {
  if (!products?.length) return null;
  return (
    <section>
      <h2 className='px-4 text-base font-semibold tracking-tight sm:px-6'>{title}</h2>
      <div className='-mx-4 px-4 sm:-mx-6 sm:px-6'>
        <div className='flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2'>
          {products.map((p) => (
            <div key={p.id} className='w-[220px] shrink-0 snap-start sm:w-[240px] md:w-[260px]'>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
