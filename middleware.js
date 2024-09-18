import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // For fetching the JWT in middleware

export async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);

  // Prevent redirect loop by excluding the /notallowed route
  if (isMobile && url.pathname !== "/notallowed") {
    return NextResponse.redirect(new URL("/notallowed", request.url));
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Extract user role from token (if user is logged in)
  const userRole = token?.role;

  const protectedRoutes = {
    "/management": ["admin"],
    "/homepage": ["admin"],
    "/students": ["admin", "SchoolHead"],
    "/batches": ["admin", "SchoolHead"],
    "/attendances": ["SchoolHead"],
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
    "api/users": ["admin"],
  };

  // Default redirect pages for each role
  const roleRedirects = {
    admin: "/homepage",
    LetterHead: "/letter",
    SchoolHead: "/students",
    InventoryHead: "/items",
    ConductHead: "/conduct",
  };

  // Check if the route is protected and user has the appropriate role
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (url.pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        if (url.pathname.startsWith("/api")) {
          // For APIs, return an error response instead of redirecting
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        } else {
          const redirectPath = roleRedirects[userRole] || "/homepage";
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/api/:path*"], // Applies to all routes and APIs
};
