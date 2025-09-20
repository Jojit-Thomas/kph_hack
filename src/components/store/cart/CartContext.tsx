'use client';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type Product = {
  id: string;
  name: string; // Changed from title to name to match database
  price: number;
  description: string;
  storeId: string;
  categorySlug?: string; // Keep for backward compatibility
  images?: Array<{
    id: string;
    url: string;
    position: number;
  }>;
  // Legacy field for backward compatibility
  title?: string;
  image?: string | null;
};

export type CartItem = {
  id: string; // product id
  product: Product;
  qty: number;
};

type CartContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartContextValue['add'] = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: product.id, product, qty }];
    });
  };

  const remove: CartContextValue['remove'] = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQty: CartContextValue['updateQty'] = (productId, qty) => {
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.qty * i.product.price, 0), [items]);

  const value: CartContextValue = {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
    items,
    add,
    remove,
    updateQty,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
