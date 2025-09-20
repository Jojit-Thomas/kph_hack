import db, { Prisma } from "@/db.server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await db.user.create({
      data: { email, password: hashedPassword },
    });
    return Response.json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
