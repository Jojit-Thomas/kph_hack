import SERVER_CONFIG from "@/config/constants";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = new TextEncoder().encode(SERVER_CONFIG.JWT_SECRET ?? "");
  const { payload } = await jwtVerify(token.value, secret);
  console.log(payload);
  return Response.json({ decoded: payload });
}
