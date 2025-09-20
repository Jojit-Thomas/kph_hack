import SERVER_CONFIG from "@/config/constants";
import db from "@/db.server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 400 });
  }
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Invalid password" }, { status: 400 });
    }
    const token = jwt.sign({ userId: user.id }, SERVER_CONFIG.JWT_SECRET, { expiresIn: "1h" });
    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true, secure: true, maxAge: 3600 });
    // return Response.json({ token });
    return Response.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to login" }, { status: 500 });
  }
}
