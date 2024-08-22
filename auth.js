import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust based on your directory structure

export default async function authenticate(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No session found.");
    return null;
  }

  console.log("Session retrieved:", session);
  return { userId: session.user.id, role: session.user.role };
}
