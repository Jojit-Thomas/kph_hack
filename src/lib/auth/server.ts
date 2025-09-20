import SERVER_CONFIG from "@/config/constants";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserPayload } from "@/types/User";

export async function checkAuth(): Promise<
  { isAuthenticated: true; user: UserPayload } | { isAuthenticated: false; user: null }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { isAuthenticated: false, user: null };
  }
  const secret = new TextEncoder().encode(SERVER_CONFIG.JWT_SECRET ?? "");
  const { payload } = (await jwtVerify(token.value, secret)) as { payload: UserPayload };
  return { isAuthenticated: true, user: payload };
}
