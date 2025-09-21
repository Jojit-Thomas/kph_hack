import axios from "axios";
import { uploadToR2, generateUniqueKey } from "@/lib/r2";
import { ScrapedImage } from "./scrape";

export interface UploadedImageResult {
  success: boolean;
  originalUrl: string;
  uploadedUrl?: string;
  key?: string;
  error?: string;
}

/**
 * Downloads an image from a URL and uploads it to R2 bucket
 * @param imageItem - The scraped image object containing src and alt
 * @param filename - Optional custom filename, defaults to auto-generated
 * @returns Promise<UploadedImageResult>
 */
export async function uploadImageFromUrl(
  imageItem: ScrapedImage,
  filename?: string
): Promise<UploadedImageResult> {
  try {
    // Download the image
    const response = await axios.get(imageItem.src, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Determine content type from response headers or URL
    let contentType = response.headers['content-type'];
    if (!contentType) {
      const url = new URL(imageItem.src);
      const pathname = url.pathname.toLowerCase();
      if (pathname.includes('.jpg') || pathname.includes('.jpeg')) {
        contentType = 'image/jpeg';
      } else if (pathname.includes('.png')) {
        contentType = 'image/png';
      } else if (pathname.includes('.webp')) {
        contentType = 'image/webp';
      } else {
        contentType = 'image/jpeg'; // Default fallback
      }
    }

    // Create a File-like object from the downloaded data
    const buffer = Buffer.from(response.data);
    const blob = new Blob([buffer], { type: contentType });
    const file = new File([blob], filename || 'scraped-image', { type: contentType });

    // Generate unique key for R2
    const key = generateUniqueKey(filename || `scraped-${Date.now()}.${getExtensionFromContentType(contentType)}`);

    // Upload to R2
    const uploadedUrl = await uploadToR2(file, key);

    return {
      success: true,
      originalUrl: imageItem.src,
      uploadedUrl,
      key
    };

  } catch (error) {
    console.error(`Failed to upload image from ${imageItem.src}:`, error);
    return {
      success: false,
      originalUrl: imageItem.src,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Uploads multiple images from URLs to R2 bucket
 * @param images - Array of scraped images
 * @param baseFilename - Base filename for generated names
 * @returns Promise<UploadedImageResult[]>
 */
export async function uploadImagesFromUrls(
  images: ScrapedImage[],
  baseFilename?: string
): Promise<UploadedImageResult[]> {
  const results: UploadedImageResult[] = [];
  
  // Process images in parallel with a concurrency limit to avoid overwhelming the server
  const concurrencyLimit = 3;
  const chunks = [];
  
  for (let i = 0; i < images.length; i += concurrencyLimit) {
    chunks.push(images.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map((image, index) => 
        uploadImageFromUrl(
          image, 
          baseFilename ? `${baseFilename}-${index + 1}` : undefined
        )
      )
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Helper function to get file extension from content type
 */
function getExtensionFromContentType(contentType: string): string {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  
  return typeMap[contentType] || 'jpg';
}
