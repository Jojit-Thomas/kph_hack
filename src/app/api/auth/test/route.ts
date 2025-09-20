import { checkAuth } from "@/lib/auth/server";

export async function GET(request: Request) {
  const { isAuthenticated, user } = await checkAuth();

  if (!isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ decoded: user });
}
