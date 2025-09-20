import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/server';
import { uploadToR2, generateUniqueKey } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, user } = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const productId = formData.get('productId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 });
    }

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 10MB per file.' 
      }, { status: 400 });
    }

    const uploadResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = generateUniqueKey(file.name);
      const url = await uploadToR2(file, key);
      
      uploadResults.push({
        url,
        key,
        position: i + 1, // Position starts from 1
        originalName: file.name,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      uploads: uploadResults,
      productId,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
