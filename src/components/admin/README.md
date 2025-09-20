# Admin Components

This directory contains admin-specific components for managing products and stores.

## ProductForm Component

The `ProductForm` component provides a complete interface for creating products with image upload functionality.

### Features

- ✅ Product creation form with validation
- ✅ Image upload with drag & drop support
- ✅ Multiple image upload (up to 10 images)
- ✅ Automatic image positioning
- ✅ Real-time upload progress
- ✅ Image preview with position indicators
- ✅ Error handling and success messages

### Usage

```tsx
import ProductForm from '@/components/admin/ProductForm';

function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ProductForm />
    </div>
  );
}
```

### Form Fields

- **Product Name**: Required text input
- **Price**: Required number input with validation
- **Store ID**: Required text input (must be a valid store ID)
- **Description**: Required textarea

### Image Upload

After creating a product, users can upload images with the following features:

- Drag & drop support
- File type validation (JPEG, PNG, WebP)
- File size validation (max 10MB per file)
- Automatic positioning (incremental from 1)
- Image preview grid
- Individual image deletion

### API Integration

The component integrates with the following API endpoints:

- `POST /api/product` - Create new product
- `POST /api/upload` - Upload images to Cloudflare R2
- `POST /api/product/images` - Associate images with product

### Error Handling

The component handles various error scenarios:

- Form validation errors
- API request failures
- File upload errors
- File validation errors (type, size)

### Success States

- Product creation success
- Image upload success
- Visual feedback for all operations
