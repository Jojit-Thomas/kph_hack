import db from "@/db.server";
import { checkAuth } from "@/lib/auth/server";
import slugify from "slugify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const { isAuthenticated, user } = await checkAuth();
  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (storeId) {
    const store = await db.store.findFirst({
      where: { handle: storeId },
    });
    return Response.json(store);
  }
  const stores = await db.store.findMany({
    where: { ownerId: user.userId },
  });
  return Response.json(stores);
}

export async function POST(request: Request) {
  const { name, description, handle: handleParam } = await request.json();
  const { isAuthenticated, user } = await checkAuth();

  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const handle = handleParam ? handleParam : slugify(name, { lower: true, replacement: "-" });

  const store = await db.store.create({
    data: { name, description, handle, ownerId: user.userId },
  });

  return Response.json(store);
}
