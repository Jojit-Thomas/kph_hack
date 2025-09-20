'use client';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function CartSheet() {
  const { isOpen, close, items, updateQty, remove, subtotal, clear } = useCart();

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[90%] max-w-md bg-background border-l shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role='dialog'
        aria-label='Cart'
      >
        <header className='flex items-center justify-between border-b px-4 py-3'>
          <h2 className='text-sm font-semibold'>Your Cart</h2>
          <button className='inline-flex size-8 items-center justify-center rounded-md border hover:bg-accent' onClick={close} aria-label='Close cart'>
            <X className='size-4' />
          </button>
        </header>

        <div className='flex h-[calc(100%-136px)] flex-col overflow-hidden'>
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {items.length === 0 ? (
              <p className='text-sm text-muted-foreground'>Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className='flex gap-3 rounded-md border p-3'>
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary'>
                    {(() => {
                      const displayImage = item.product.images?.[0]?.url || item.product.image;
                      const productName = item.product.name || item.product.title || 'Untitled Product';
                      return displayImage ? (
                        <Image src={displayImage} alt={productName} fill className='object-cover' />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>No image</div>
                      );
                    })()}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium'>{item.product.name || item.product.title || 'Untitled Product'}</p>
                        <p className='text-xs text-muted-foreground'>${item.product.price.toFixed(2)}</p>
                      </div>
                      <button className='text-muted-foreground hover:text-destructive' onClick={() => remove(item.id)} aria-label='Remove'>
                        <Trash2 className='size-4' />
                      </button>
                    </div>
                    <div className='mt-2 flex items-center gap-2'>
                      <button
                        className='inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent'
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label='Decrease quantity'
                      >
                        <Minus className='size-4' />
                      </button>
                      <span className='min-w-6 text-center text-sm tabular-nums'>{item.qty}</span>
                      <button
                        className='inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent'
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label='Increase quantity'
                      >
                        <Plus className='size-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <footer className='border-t p-4'>
            <div className='mb-3 flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex gap-2'>
              <button className='flex-1 rounded-md border px-3 py-2 text-sm hover:bg-accent' onClick={clear}>Clear</button>
              <button className='flex-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90'>Checkout</button>
            </div>
          </footer>
        </div>
      </aside>
    </div>
  );
}
