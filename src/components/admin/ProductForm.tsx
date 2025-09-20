'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUpload, UploadResult } from '@/components/ui/image-upload';
import { useStore } from '@/components/StoreProvider';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
}

export default function ProductForm() {
  const { selectedStore } = useStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price) {
        throw new Error('All fields are required');
      }

      if (!selectedStore) {
        throw new Error('Please select a store first');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a valid positive number');
      }

      // Create the product
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: price,
          storeId: selectedStore.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const product = await response.json();
      setCreatedProductId(product.id);
      setSuccess('Product created successfully! You can now upload images.');

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (images: UploadResult[]) => {
    setUploadedImages(prev => [...prev, ...images]);
    setSuccess(`Successfully uploaded ${images.length} image(s)!`);
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Store
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
            {selectedStore ? (
              <div className="flex items-center space-x-2">
                <span className="font-medium">{selectedStore.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({selectedStore.handle})
                </span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                No store selected. Please select a store from the header.
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use the store selector in the header to choose which store this product belongs to
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter product description"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !selectedStore}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </Button>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Image Upload Section */}
      {createdProductId && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upload Product Images
          </h3>
          <ImageUpload
            productId={createdProductId}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxFiles={10}
          />
        </div>
      )}

      {/* Uploaded Images Summary */}
      {uploadedImages.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {uploadedImages.map((image, index) => (
              <div key={index} className="aspect-square rounded overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
