'use client';

import { useStore } from '@/components/StoreProvider';
import { Button } from '@/components/ui/button';
import axios from '@/config/axios';
import { Calendar, DollarSign, Edit, Eye, Filter, MoreVertical, Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const { selectedStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (!selectedStore) {
          if (active) setProducts([]);
          return;
        }
        const res = await axios.get('/product', { params: { storeId: selectedStore.id } });
        const data = (res.data || []) as Array<{
          id: string;
          name: string;
          description: string;
          price: number;
          images?: Array<{ url: string }>;
          createdAt: string;
          updatedAt: string;
        }>;
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          images: (p.images || []).map((img) => img.url),
          status: 'active',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        if (active) setProducts(mapped);
      } catch (e) {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      active = false;
    };
  }, [selectedStore]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Active' },
      inactive: { color: 'red', text: 'Inactive' },
      draft: { color: 'yellow', text: 'Draft' },
    } as const;
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-400`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-cream-50 dark:bg-stone-800 p-6 rounded-lg shadow">
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-stone-200 dark:bg-stone-700 rounded mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-amber-50">Products</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-cream-50 dark:bg-stone-800 rounded-lg shadow p-6 border border-stone-200 dark:border-stone-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-stone-700 dark:text-amber-50 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-stone-700 dark:text-amber-50 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <Button variant="outline" className="flex items-center space-x-2 border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-cream-50 dark:bg-stone-800 rounded-lg shadow-md overflow-hidden border border-stone-200 dark:border-stone-700 hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-stone-100 dark:bg-stone-700 relative">
              {product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-stone-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">{getStatusBadge(product.status)}</div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-amber-50 mb-2">{product.name}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-xl font-bold text-stone-900 dark:text-amber-50">${product.price}</span>
                </div>
                <div className="flex items-center space-x-1 text-stone-500 dark:text-stone-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/admin/products/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="px-3 border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

            {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 dark:text-amber-50 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching products' : `You've created "${selectedStore?.name ?? 'your'}"`}
          </h3>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Now add your products to share your link.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/admin/products/create">
              <Button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </Link>
            {selectedStore?.handle && (
              <Link href={`/store/${selectedStore.handle}`} className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
                View your store link
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-cream-50 dark:bg-stone-800 rounded-lg shadow p-6 border border-stone-200 dark:border-stone-700">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-amber-50 mb-4">Product Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-stone-900 dark:text-amber-50">{products.length}</div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{products.filter((p) => p.status === 'active').length}</div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{products.filter((p) => p.status === 'draft').length}</div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{products.filter((p) => p.status === 'inactive').length}</div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Inactive</div>
          </div>
        </div>
      </div>
    </div>
  );
}
