'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { validateImageFiles, uploadImages, associateImagesWithProduct, UploadResult } from '@/lib/upload';

export type { UploadResult };

interface ImageUploadProps {
  productId: string;
  onUploadComplete?: (images: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  existingImages?: Array<{ id: string; url: string; position: number }>;
  onImageDelete?: (imageId: string) => void;
}

export function ImageUpload({
  productId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  existingImages = [],
  onImageDelete,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    const { valid, errors } = validateImageFiles(files);
    
    if (errors.length > 0) {
      onUploadError?.(errors.join('\n'));
      return;
    }

    if (valid.length === 0) return;

    setUploading(true);
    try {
      const result = await uploadImages(valid, productId);
      setUploadedImages(prev => [...prev, ...result.uploads]);
      
      // Associate images with product
      await associateImagesWithProduct(productId, result.uploads);
      
      onUploadComplete?.(result.uploads);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [productId, onUploadComplete, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleRemoveImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const allImages = [...existingImages, ...uploadedImages.map((img, index) => ({
    id: `uploaded-${index}`,
    url: img.url,
    position: img.position,
  }))].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          
          <div className="text-sm text-gray-600">
            {uploading ? (
              'Uploading images...'
            ) : (
              <>
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Click to upload
                </span>{' '}
                or drag and drop
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP up to 10MB each (max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Select Images'}
      </Button>

      {/* Image Preview Grid */}
      {allImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Product Images ({allImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Position indicator */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    if (image.id.startsWith('uploaded-')) {
                      const uploadedIndex = parseInt(image.id.split('-')[1]);
                      handleRemoveImage(uploadedIndex);
                    } else {
                      onImageDelete?.(image.id);
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
