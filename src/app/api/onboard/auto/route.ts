import db from "@/db.server";
import { processImage } from "@/helpers/process-image";
import { scrapeInstagramProfile } from "@/helpers/scrape";
import { uploadImagesFromUrls } from "@/helpers/upload-image";
import { checkAuth } from "@/lib/auth/server";
import slugify from "slugify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const { isAuthenticated, user } = await checkAuth();
  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (url) {
    const { images, title } = await scrapeInstagramProfile(url);
    
    // Create a store with the title and handle the same as the url
    const store = await db.store.create({
      data: {
        name: title,
        handle: slugify(url.split("/").pop() || title, { lower: true, replacement: "-" }),
        ownerId: user.userId,
        description: "",
      },
    });

    // Start the image processing in the background (fire and forget)
    processImagesInBackground(images, store.id);

    return Response.json({ 
      success: true, 
      storeId: store.id,
      totalImages: images.length
    });
  }
}

// Background processing function
async function processImagesInBackground(images: any[], storeId: string) {
  try {
    // Upload all scraped images to R2 bucket
    const uploadResults = await uploadImagesFromUrls(images, `store-${storeId}`);
    
    // Process each successfully uploaded image
    for (let i = 0; i < uploadResults.length; i++) {
      const uploadResult = uploadResults[i];
      
      if (uploadResult.success && uploadResult.uploadedUrl) {
        // Use the original image for processing (AI analysis)
        const originalImage = images[i];
        const result = await processImage(originalImage, storeId);
        
        if (result.success) {
          const product = await db.product.create({
            data: {
              name: result.parsedProduct?.name || "",
              description: result.parsedProduct?.description || "",
              price: result.parsedProduct?.price || 0,
              storeId: storeId,
            },
          });
          
          // Save the uploaded R2 URL to the database
          await db.productImage.create({
            data: {
              url: uploadResult.uploadedUrl, // Use the uploaded R2 URL instead of original
              productId: product.id,
              position: 1,
            },
          });
        }
      } else {
        console.error(`Failed to upload image: ${uploadResult.error}`);
      }
    }
  } catch (error) {
    console.error("Error processing images in background:", error);
  }
}
