import SERVER_CONFIG from "@/config/constants";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const decoded = jwt.verify(token.value, SERVER_CONFIG.JWT_SECRET);
  console.log(decoded);
  return Response.json({ decoded });
}
