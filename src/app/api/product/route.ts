import db from "@/db.server";
import { checkAuth } from "@/lib/auth/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const storeId = searchParams.get("storeId");
  const { isAuthenticated, user } = await checkAuth();
  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (productId) {
    const product = await db.product.findFirst({
      where: { id: productId },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return Response.json(product);
  }
  if (storeId) {
    const products = await db.product.findMany({
      where: { storeId: storeId },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    });
    return Response.json(products);
  }
  return Response.json({ error: "No product or store id provided" }, { status: 400 });
}

export async function POST(request: Request) {
  const { name, description, price, storeId } = await request.json();
  const { isAuthenticated, user } = await checkAuth();
  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const product = await db.product.create({
    data: { name, description, price, storeId },
  });
  if (!product) return Response.json({ error: "Failed to create product" }, { status: 500 });
  return Response.json(product);
}
