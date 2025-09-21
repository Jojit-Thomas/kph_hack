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
  if (!name || typeof name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  // Generate a URL-friendly unique handle
  let base = handleParam ? String(handleParam) : slugify(name, { lower: true, replacement: "-" });
  base = base.replace(/[^a-z0-9-]/g, "");
  if (!base) base = `store-${Math.random().toString(36).slice(2, 8)}`;

  let uniqueHandle = base;
  let suffix = 1;
  while (await db.store.findFirst({ where: { handle: uniqueHandle } })) {
    uniqueHandle = `${base}-${suffix++}`;
  }

  const created = await db.store.create({
    data: { name, description: description || "", handle: uniqueHandle, ownerId: user.userId },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const publishedUrl = `${baseUrl}/store/${created.handle}`;

  return Response.json({ ...created, publishedUrl });
}
