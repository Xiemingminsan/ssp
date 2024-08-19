import { getSession } from "next-auth/react";
import { headers, cookies } from "next/headers";

export default async function authenticate(req) {
  // Manually extract cookies and headers from the request
  const reqWithHeadersAndCookies = {
    headers: Object.fromEntries(headers()),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };

  // Fetch the session using the modified request object
  const session = await getSession({ req: reqWithHeadersAndCookies });

  if (!session) {
    console.log(
      "No session found. Request headers:",
      reqWithHeadersAndCookies.headers
    );
    console.log("Cookies:", reqWithHeadersAndCookies.cookies);
    return null;
  }

  console.log("Session retrieved:", session);
  return { userId: session.user.id, role: session.user.role };
}
