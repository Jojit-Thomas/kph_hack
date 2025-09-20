import db from "@/db.server";
import { checkAuth } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const { isAuthenticated, user } = await checkAuth();
    if (!isAuthenticated) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, images } = await request.json();

    if (!productId || !images || !Array.isArray(images)) {
      return Response.json({ 
        error: "Product ID and images array are required" 
      }, { status: 400 });
    }

    // Verify the product exists and user has access to it
    const product = await db.product.findFirst({
      where: { id: productId },
      include: { store: true }
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user owns the store
    if (product.store.ownerId !== user.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete existing images for this product
    await db.productImage.deleteMany({
      where: { productId }
    });

    // Create new image records
    const imageData = images.map((image: any, index: number) => ({
      url: image.url,
      position: index + 1,
      productId: productId,
    }));

    const createdImages = await db.productImage.createMany({
      data: imageData
    });

    // Fetch the updated product with images
    const updatedProduct = await db.product.findFirst({
      where: { id: productId },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return Response.json({
      success: true,
      product: updatedProduct,
      images: createdImages
    });

  } catch (error) {
    console.error('Error associating images with product:', error);
    return Response.json(
      { error: "Failed to associate images with product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { isAuthenticated, user } = await checkAuth();
    if (!isAuthenticated) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const imageId = searchParams.get("imageId");

    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Verify the product exists and user has access to it
    const product = await db.product.findFirst({
      where: { id: productId },
      include: { store: true }
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user owns the store
    if (product.store.ownerId !== user.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (imageId) {
      // Delete specific image
      await db.productImage.delete({
        where: { id: imageId }
      });
    } else {
      // Delete all images for the product
      await db.productImage.deleteMany({
        where: { productId }
      });
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Error deleting product images:', error);
    return Response.json(
      { error: "Failed to delete product images" },
      { status: 500 }
    );
  }
}
