'use client';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { AiOutlineShop } from 'react-icons/ai';
import { ModeToggle } from '../ThemeToggler';
import { useCart } from './cart/CartContext';

const StoreNav = () => {
  const cart = (() => {
    try {
      return useCart();
    } catch {
      return null; // allow StoreNav to render outside provider too
    }
  })();
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <AiOutlineShop className='h-5 w-5 opacity-90 dark:opacity-95' aria-hidden />
          <span className='text-sm font-semibold tracking-tight'>Sample Store</span>
        </Link>

        {/* Minimal links (placeholder) */}
        <nav className='hidden items-center gap-3 sm:flex'>
          <Link href='/store' className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
            Categories
          </Link>
        </nav>

        {/* Search */}
        <div className='relative ml-auto w-full max-w-md'>
          <Search className='pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='search'
            placeholder='Search products'
            className='h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
            aria-label='Search products'
          />
        </div>

        {/* Actions: Cart, Account, Theme */}
        <div className='ml-1 flex items-center gap-1.5 sm:ml-0 sm:gap-2'>
          {/* Cart */}
          <div className='relative'>
            <Button variant='outline' size='icon' aria-label='Cart' onClick={() => cart?.toggle()}>
              <ShoppingCart className='size-4' />
              <span className='sr-only'>Open cart</span>
            </Button>
            {/* Badge (static 0 for now) */}
            <span className='text-primary-foreground absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none'>
              {cart?.count ?? 0}
            </span>
          </div>

          {/* Account */}
          <Button variant='outline' size='icon' aria-label='Account'>
            <User className='size-4' />
            <span className='sr-only'>Account</span>
          </Button>

          {/* Theme */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default StoreNav;
