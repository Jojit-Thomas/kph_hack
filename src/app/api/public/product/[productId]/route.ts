import db from "@/db.server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    const product = await db.product.findFirst({
      where: { id: productId },
      include: {
        store: true,
        images: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
