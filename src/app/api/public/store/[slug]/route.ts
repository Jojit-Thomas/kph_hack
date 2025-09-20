import db from "@/db.server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find store by handle (slug)
    const store = await db.store.findFirst({
      where: { handle: slug },
      include: {
        products: {
          include: {
            images: {
              orderBy: { position: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!store) {
      return Response.json({ error: "Store not found" }, { status: 404 });
    }

    return Response.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return Response.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}
