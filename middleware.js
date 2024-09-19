// middleware.js

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Debugging logs (Remove or comment out in production)
  // console.log("Middleware - Token:", token);

  const roleRedirects = {
    admin: "/homepage",
    LetterHead: "/letter",
    SchoolHead: "/students",
    InventoryHead: "/items",
    ConductHead: "/conduct",
  };

  if (!token) {
    // If user is not authenticated
    if (url.pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url, { status: 303 });
    }
    return NextResponse.next();
  } else {
    // If user is authenticated
    if (url.pathname === "/login" || url.pathname === "/") {
      // Redirect authenticated users away from login page
      const redirectPath = roleRedirects[token.role] || "/homepage";
      url.pathname = redirectPath;
      return NextResponse.redirect(url, { status: 303 });
    }
  }

  // Set no-cache to prevent caching issues
  const response = NextResponse.next();
  response.headers.set("x-middleware-cache", "no-cache");
  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
