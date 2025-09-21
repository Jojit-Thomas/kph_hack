import db from "@/db.server";
import { processImage } from "@/helpers/process-image";
import { scrapeInstagramPublic } from "@/helpers/scrape";
import { uploadImagesFromUrls } from "@/helpers/upload-image";
import { checkAuth } from "@/lib/auth/server";
import slugify from "slugify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const { isAuthenticated, user } = await checkAuth();
  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (url) {
    const { images, title } = await scrapeInstagramPublic(url);
    
    // Create a store with the title and handle the same as the url
    const store = await db.store.create({
      data: {
        name: title,
        handle: slugify(url.split("/").pop() || title, { lower: true, replacement: "-" }),
        ownerId: user.userId,
        description: "",
      },
    });

    // Upload all scraped images to R2 bucket
    const uploadResults = await uploadImagesFromUrls(images, `store-${store.id}`);
    
    // Process each successfully uploaded image
    for (let i = 0; i < uploadResults.length; i++) {
      const uploadResult = uploadResults[i];
      
      if (uploadResult.success && uploadResult.uploadedUrl) {
        // Use the original image for processing (AI analysis)
        const originalImage = images[i];
        const result = await processImage(originalImage, store.id);
        
        if (result.success) {
          const product = await db.product.create({
            data: {
              name: result.parsedProduct?.name || "",
              description: result.parsedProduct?.description || "",
              price: result.parsedProduct?.price || 0,
              storeId: store.id,
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

    return Response.json({ 
      success: true, 
      storeId: store.id,
      uploadedImages: uploadResults.filter(r => r.success).length,
      totalImages: images.length
    });
  }
}
