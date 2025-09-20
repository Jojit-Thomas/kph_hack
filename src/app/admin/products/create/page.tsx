'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add a new product to your store catalog
          </p>
        </div>
      </div>

      {/* Product Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ProductForm />
      </div>
    </div>
  );
}
