'use client';
import CategoryCard, { type Category } from './CategoryCard';

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className='grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {categories.map((c) => (
        <CategoryCard key={c.slug} category={c} />
      ))}
    </div>
  );
}
