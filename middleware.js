import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);

  // Prevent redirect loop by excluding the /notallowed route
  if (isMobile && url.pathname !== "/notallowed") {
    return NextResponse.redirect(new URL("/notallowed", request.url));
  }
  const url = request.nextUrl.clone();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirects based on user role
  const roleRedirects = {
    admin: "/homepage",
    LetterHead: "/letter",
    SchoolHead: "/students",
    InventoryHead: "/items",
    ConductHead: "/conduct",
  };

  // Protected routes with allowed roles
  const protectedRoutes = {
    "/management": ["admin"],
    "/homepage": ["admin"],
    "/students": ["admin", "SchoolHead"],
    "/batches": ["admin", "SchoolHead"],
    "/attendance": ["SchoolHead"],
    "/courses": ["admin", "SchoolHead"],
    "/items": ["admin", "InventoryHead"],
    "/conduct": ["admin", "ConductHead"],
    "/letter": ["admin", "LetterHead"],
    "/api/inventory": ["admin"],
    "/api/student": ["admin", "SchoolHead"],
    "/api/conduct": ["admin", "ConductHead"],
    "/api/event": ["admin"],
    "/api/session": ["admin"],
    "/api/letters": ["admin", "LetterHead"],
    "/api/hierarchy": ["admin"],
    "/api/users": ["admin"],
  };

  // If user is not authenticated
  if (!token) {
    if (url.pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url, { status: 303 });
    }
    return NextResponse.next();
  } else {
    // If user is authenticated and accesses login or root, redirect based on role
    if (url.pathname === "/login" || url.pathname === "/") {
      const redirectPath = roleRedirects[token.role] || "/homepage";
      url.pathname = redirectPath;
      return NextResponse.redirect(url, { status: 303 });
    }
  }

  // Check if the route is protected and enforce role-based access
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (url.pathname.startsWith(route)) {
      if (!token.role || !allowedRoles.includes(token.role)) {
        if (url.pathname.startsWith("/api")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        } else {
          const redirectPath = roleRedirects[token.role] || "/login";
          url.pathname = redirectPath;
          return NextResponse.redirect(url, { status: 303 });
        }
      }
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
