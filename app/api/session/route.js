import { getSession } from "next-auth/react";

export async function authenticate(req) {
  const session = await getSession({ req });

  if (!session) {
    console.log("No session found. Request headers:", req.headers);
    console.log("Cookies:", req.cookies);
    return null;
  }

  console.log("Session retrieved:", session);
  return { userId: session.user.id, role: session.user.role };
}
