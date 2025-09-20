'use client';
import Link from 'next/link';

export type Category = {
  slug: string;
  title: string;
  image?: string | null;
};

export default function CategoryCard({ category }: { category: Category }) {
  const href = `/store/${category.slug}`;
  return (
    <Link
      href={href}
      className='group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs transition-colors hover:border-primary'
      aria-label={`Browse ${category.title}`}
    >
      <div className='relative aspect-[4/3] w-full overflow-hidden bg-secondary'>
        {/* Placeholder image area */}
        {category.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.image} alt={category.title} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-sm text-muted-foreground'>
            {category.title}
          </div>
        )}
      </div>
      <div className='p-3'>
        <div className='truncate text-sm font-medium'>{category.title}</div>
        <div className='text-xs text-muted-foreground'>Explore</div>
      </div>
    </Link>
  );
}
