export interface UploadResult {
  url: string;
  key: string;
  position: number;
  originalName: string;
  size: number;
  type: string;
}

export interface UploadResponse {
  success: boolean;
  uploads: UploadResult[];
  productId: string;
}

export async function uploadImages(
  files: File[],
  productId: string
): Promise<UploadResponse> {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('productId', productId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

export async function associateImagesWithProduct(
  productId: string,
  images: UploadResult[]
): Promise<any> {
  const response = await fetch('/api/product/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      images,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to associate images with product');
  }

  return response.json();
}

export function validateImageFiles(files: FileList): { valid: File[]; errors: string[] } {
  const validFiles: File[] = [];
  const errors: string[] = [];

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 10;

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
    return { valid: [], errors };
  }

  Array.from(files).forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Invalid file type. Only JPEG, PNG, and WebP images are allowed.`);
      return;
    }

    if (file.size > maxSize) {
      errors.push(`File ${index + 1}: File size too large. Maximum size is 10MB.`);
      return;
    }

    validFiles.push(file);
  });

  return { valid: validFiles, errors };
}
